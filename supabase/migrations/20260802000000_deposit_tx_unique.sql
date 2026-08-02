-- Zaštita od duplog kreditiranja depozita: isti tx_id se smije upisati samo jednom.
ALTER TABLE public.deposits DROP CONSTRAINT IF EXISTS deposits_tx_id_key;
ALTER TABLE public.deposits ADD CONSTRAINT deposits_tx_id_key UNIQUE (tx_id);
