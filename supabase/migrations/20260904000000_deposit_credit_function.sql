-- ============================================================
-- Atomično kreditiranje depozita (BCM / BOCRYPTO / BPW)
--
-- Problem koji rješava:
--  - Stari tok je kreditirao depozit SAMO na klijentu (R.bcm += amount)
--    pa se kredit gubio ako save nije stigao (mreža, zatvoren tab,
--    blokiran cloud save). Depozit je ostajao 'completed' u deposits
--    ali igrač nije dobio tokene.
--
-- credit_deposit():
--  - upisuje deposits (UNIQUE(tx_id) štiti od duplog kreditiranja)
--  - kredituje player_resources u ISTOJ SQL transakciji
--  - upisuje u transactions (audit)
-- ============================================================

CREATE OR REPLACE FUNCTION public.credit_deposit(
  p_player_id TEXT,
  p_token     TEXT,
  p_amount    NUMERIC,
  p_tx_id     TEXT,
  p_memo      TEXT,
  p_force     BOOLEAN DEFAULT false
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_col      TEXT;
  v_existing TEXT;
  v_amount   NUMERIC := 0;
BEGIN
  IF p_player_id IS NULL OR p_token IS NULL OR p_amount IS NULL OR p_tx_id IS NULL
     OR p_amount <= 0 OR p_player_id = '' OR p_tx_id = '' THEN
    RETURN jsonb_build_object('success', false, 'code', 'BAD_INPUT', 'error', 'Nedostaju podaci depozita');
  END IF;

  IF p_token = 'BCM' THEN
    v_col := 'bcm';
    v_amount := floor(p_amount);
  ELSIF p_token = 'BOCRYPTO' THEN
    v_col := 'bocrypto';
    v_amount := round(p_amount, 3);
  ELSIF p_token = 'BPW' THEN
    v_col := 'spcard';
    v_amount := p_amount;
  ELSE
    RETURN jsonb_build_object('success', false, 'code', 'BAD_TOKEN', 'error', 'Nepoznat token');
  END IF;

  -- Anti-double-credit provjera.
  -- p_force=true je ZA admin recovery: depozit je već upisan u deposits
  -- (stari tok) ali NIKAD nije kreditiran u player_resources — preko ovoga
  -- se balans nadoknađuje uz audit u transactions. NE koristi se iz
  -- deposit-verify (tamo je uvijek p_force=false).
  SELECT tx_id INTO v_existing FROM deposits WHERE tx_id = p_tx_id LIMIT 1;
  IF FOUND AND NOT p_force THEN
    RETURN jsonb_build_object('success', false, 'code', 'ALREADY_PROCESSED', 'error', 'Transakcija je već obrađena');
  END IF;

  -- Osiguraj da players red postoji (FK za deposits i player_resources)
  INSERT INTO players (id, player_type, username)
  VALUES (p_player_id, 'hive', p_player_id)
  ON CONFLICT (id) DO NOTHING;

  -- Upis depozita (UNIQUE(tx_id) štiti od race-a pri istovermenim pozivima)
  IF NOT FOUND THEN
    BEGIN
      INSERT INTO deposits (player_id, token, amount, tx_id, status, memo, created_at)
      VALUES (p_player_id, p_token, v_amount, p_tx_id, 'completed', p_memo, now());
    EXCEPTION WHEN unique_violation THEN
      RETURN jsonb_build_object('success', false, 'code', 'ALREADY_PROCESSED', 'error', 'Transakcija je već obrađena');
    END;
  END IF;

  -- Kredituj balans u istoj SQL transakciji
  INSERT INTO player_resources (player_id, updated_at)
  VALUES (p_player_id, now())
  ON CONFLICT (player_id) DO NOTHING;

  EXECUTE format(
    'UPDATE player_resources SET %I = COALESCE(%I, 0) + $2, updated_at = now() WHERE player_id = $1',
    v_col, v_col
  ) USING p_player_id, v_amount;

  -- Audit (zaseban blok — greška ovdje ne smije poništiti kredit)
  BEGIN
    INSERT INTO transactions (player_id, type, token, amount, created_at)
    VALUES (p_player_id, 'deposit', p_token, v_amount, now());
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN jsonb_build_object('success', true, 'force', p_force, 'token', p_token, 'amount', v_amount);
END;
$$;

REVOKE ALL ON FUNCTION public.credit_deposit(TEXT, TEXT, NUMERIC, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.credit_deposit(TEXT, TEXT, NUMERIC, TEXT, TEXT, BOOLEAN) TO service_role;