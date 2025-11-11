-- v4 Database Setup: Chat History + Product Knowledge
-- Run this in Supabase SQL Editor

-- 1. Chat History Table (for conversation memory)
CREATE TABLE IF NOT EXISTS public.chat_history (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_session
ON public.chat_history(session_id, created_at);

-- 2. Product Knowledge Table (from Google Sheets)
CREATE TABLE IF NOT EXISTS public.product_knowledge (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('product', 'faq')),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_knowledge_type
ON public.product_knowledge(type);

CREATE INDEX IF NOT EXISTS idx_product_knowledge_name
ON public.product_knowledge(name);

-- 3. Optional: Full-text search index for content
CREATE INDEX IF NOT EXISTS idx_product_knowledge_content_search
ON public.product_knowledge USING gin(to_tsvector('turkish', content));

-- Test queries
SELECT 'Chat History table created' as status;
SELECT 'Product Knowledge table created' as status;

-- View sample data (will be empty initially)
SELECT COUNT(*) as chat_history_count FROM public.chat_history;
SELECT COUNT(*) as product_knowledge_count FROM public.product_knowledge;

-- Clean up old data (optional - run manually if needed)
-- DELETE FROM public.chat_history WHERE created_at < NOW() - INTERVAL '30 days';
