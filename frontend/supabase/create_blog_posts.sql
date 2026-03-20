-- Create blog_posts table for the marketing blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_name TEXT NOT NULL,
    author_avatar_url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_time_minutes INTEGER NOT NULL DEFAULT 5,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.blog_posts
            FOR SELECT USING (is_published = true);
    END IF;
END $$;

-- Allow authenticated users to manage blog posts (optional, adjust as needed)
-- CREATE POLICY "Allow authenticated manage" ON public.blog_posts
--     FOR ALL USING (auth.role() = 'authenticated');
