-- pvp_snapshots je bio potpuno otvoren za anon (insert/update/delete WITH CHECK (true)),
-- pa je svako mogao da prepiše ili obriše tuđe snapshotove.
-- Snapshotove sada mogu da pišu samo prijavljeni igrači; brisanje ide preko service_role.
DROP POLICY IF EXISTS "pvp_delete_own" ON public.pvp_snapshots;
DROP POLICY IF EXISTS "anon_insert_pvp_snapshots" ON public.pvp_snapshots;
DROP POLICY IF EXISTS "anon_update_pvp_snapshots" ON public.pvp_snapshots;

CREATE POLICY "auth_insert_pvp_snapshots" ON public.pvp_snapshots
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_pvp_snapshots" ON public.pvp_snapshots
  FOR UPDATE TO authenticated USING (true);
