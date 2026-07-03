DROP POLICY IF EXISTS "anon_select_pvp_snapshots" ON public.pvp_snapshots;
DROP POLICY IF EXISTS "anon_insert_pvp_snapshots" ON public.pvp_snapshots;
DROP POLICY IF EXISTS "anon_update_pvp_snapshots" ON public.pvp_snapshots;
CREATE POLICY "anon_select_pvp_snapshots" ON public.pvp_snapshots FOR SELECT USING (true);
CREATE POLICY "anon_insert_pvp_snapshots" ON public.pvp_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_pvp_snapshots" ON public.pvp_snapshots FOR UPDATE USING (true);
