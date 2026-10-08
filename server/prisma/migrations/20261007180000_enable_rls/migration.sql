-- Supabase exposes the public schema through its auto-generated Data API (PostgREST).
-- This app only accesses the database through its own backend, so enable Row Level
-- Security with no policies on every table: Data API (anon/authenticated roles) is denied,
-- while the backend's connection role (table owner) is unaffected.
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$;
