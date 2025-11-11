-- Chat History Table for Rota Reformer WhatsApp Bot
-- Run this in your Postgres database (Supabase)

CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- Optional: Add retention policy (delete messages older than 30 days)
-- Uncomment if you want automatic cleanup:
-- CREATE OR REPLACE FUNCTION delete_old_chat_history()
-- RETURNS void AS $$
-- BEGIN
--   DELETE FROM public.chat_history
--   WHERE created_at < NOW() - INTERVAL '30 days';
-- END;
-- $$ LANGUAGE plpgsql;

-- Test the table
-- SELECT * FROM public.chat_history LIMIT 10;
