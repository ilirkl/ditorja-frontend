-- Create table with all required fields
CREATE TABLE IF NOT EXISTS public.ditorja_frontend (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_title TEXT NOT NULL,
    article_short TEXT NOT NULL,
    article_medium TEXT,
    article_large TEXT,
    article_image TEXT,
    article_category TEXT NOT NULL,
    article_hashtags TEXT[],
    author TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ditorja_frontend ENABLE ROW LEVEL SECURITY;

-- Create read access policy
CREATE POLICY "Allow public read access" 
ON public.ditorja_frontend 
FOR SELECT 
TO anon 
USING (true);

-- Grant permissions
GRANT SELECT ON TABLE public.ditorja_frontend TO anon;
GRANT USAGE ON SCHEMA public TO anon;
