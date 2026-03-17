-- ============================================
-- AGENCY / TEAM WORKSPACES SCHEMA
-- ============================================

-- 1. WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
    max_members INTEGER DEFAULT 5,
    credits_balance INTEGER DEFAULT 0,
    
    -- Brand Assets
    brand_logo_url TEXT,
    brand_user_image_url TEXT,
    brand_website_url TEXT,
    brand_instagram_handle TEXT,
    brand_facebook_handle TEXT,
    brand_youtube_handle TEXT,
    brand_x_handle TEXT,
    brand_address TEXT,
    brand_phone TEXT,
    
    -- Generation Defaults
    default_country TEXT DEFAULT 'United States',
    default_tone TEXT DEFAULT 'Professional',
    default_word_count INTEGER DEFAULT 1000,
    default_output_format TEXT DEFAULT 'Markdown',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Repair Workspaces Table Constraints
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.workspaces DROP CONSTRAINT IF EXISTS workspaces_owner_id_fkey;
        ALTER TABLE public.workspaces ADD CONSTRAINT workspaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- Ensure columns exist if table was created in a previous partial run
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency'));
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 5;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_logo_url TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_user_image_url TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_website_url TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_instagram_handle TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_facebook_handle TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_youtube_handle TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_x_handle TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_address TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS brand_phone TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS default_country TEXT DEFAULT 'United States';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS default_tone TEXT DEFAULT 'Professional';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS default_word_count INTEGER DEFAULT 1000;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS default_output_format TEXT DEFAULT 'Markdown';

-- 2. WORKSPACE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'removed')),
    invited_email TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    invitation_token TEXT,
    invitation_expires_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, invited_email)
);

-- Repair Workspace Members Table Columns
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS invited_email TEXT;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS invitation_token TEXT;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.workspace_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Fix status constraint to include 'removed'
ALTER TABLE public.workspace_members DROP CONSTRAINT IF EXISTS workspace_members_status_check;
ALTER TABLE public.workspace_members ADD CONSTRAINT workspace_members_status_check CHECK (status IN ('active', 'pending', 'removed'));

-- Repair Workspace Members Table Constraints
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.workspace_members DROP CONSTRAINT IF EXISTS workspace_members_user_id_fkey;
        ALTER TABLE public.workspace_members ADD CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
        -- Make user_id nullable for pending invites
        ALTER TABLE public.workspace_members ALTER COLUMN user_id DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- 3. WORKSPACE ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.workspace_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Repair Workspace Activity Table Constraints
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.workspace_activity DROP CONSTRAINT IF EXISTS workspace_activity_actor_id_fkey;
        ALTER TABLE public.workspace_activity ADD CONSTRAINT workspace_activity_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- 4. UPDATE BLOGS TABLE FOR WORKSPACES
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5. HELPERS FOR RLS (Fixes infinite recursion)
CREATE OR REPLACE FUNCTION public.check_is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id
    AND user_id = auth.uid()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_is_workspace_role(ws_id UUID, required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id
    AND user_id = auth.uid()
    AND role = ANY(required_roles)
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. ROW LEVEL SECURITY (RLS)

-- Workspaces RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
CREATE POLICY "Users can view workspaces they are members of"
    ON public.workspaces FOR SELECT
    USING (auth.uid() = owner_id OR check_is_workspace_member(id));

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners and Admins can update workspace settings" ON public.workspaces;
CREATE POLICY "Owners and Admins can update workspace settings"
    ON public.workspaces FOR UPDATE
    USING (check_is_workspace_role(id, ARRAY['owner', 'admin']));

-- Workspace Members RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view other members in their workspace" ON public.workspace_members;
CREATE POLICY "Members can view other members in their workspace"
    ON public.workspace_members FOR SELECT
    USING (auth.uid() = user_id OR check_is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "Owners and Admins can manage members" ON public.workspace_members;
CREATE POLICY "Owners and Admins can manage members"
    ON public.workspace_members FOR ALL
    USING (check_is_workspace_role(workspace_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "Users can join workspaces they own" ON public.workspace_members;
CREATE POLICY "Users can join workspaces they own"
    ON public.workspace_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces
            WHERE id = workspace_id
            AND owner_id = auth.uid()
        )
    );

-- Workspace Activity RLS
ALTER TABLE public.workspace_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view workspace activity" ON public.workspace_activity;
CREATE POLICY "Members can view workspace activity"
    ON public.workspace_activity FOR SELECT
    USING (check_is_workspace_member(workspace_id));

-- ============================================
-- WORKSPACE CREDIT MANAGEMENT FUNCTIONS
-- ============================================

-- Function to safely deduct credits from a workspace
CREATE OR REPLACE FUNCTION deduct_workspace_credit(
    p_workspace_id UUID,
    p_user_id UUID,
    p_blog_topic TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Check if user is a member of the workspace with generation permission
    IF NOT EXISTS (
        SELECT 1 FROM public.workspace_members 
        WHERE workspace_id = p_workspace_id 
        AND user_id = p_user_id 
        AND role IN ('owner', 'admin', 'member')
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
    END IF;

    -- Lock the workspace row for update
    SELECT credits_balance INTO v_current_balance 
    FROM public.workspaces 
    WHERE id = p_workspace_id FOR UPDATE;

    IF v_current_balance < 1 THEN
        RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits');
    END IF;

    v_new_balance := v_current_balance - 1;

    -- Update workspace balance
    UPDATE public.workspaces 
    SET credits_balance = v_new_balance 
    WHERE id = p_workspace_id;

    -- Log activity
    INSERT INTO public.workspace_activity (workspace_id, actor_id, type, metadata)
    VALUES (
        p_workspace_id, 
        p_user_id, 
        'blog_generated', 
        jsonb_build_object('topic', p_blog_topic, 'balance_after', v_new_balance)
    );

    RETURN jsonb_build_object('success', true, 'balance_after', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema cache (VERY IMPORTANT)
NOTIFY pgrst, 'reload schema';

-- Alternative reload if NOTIFY isn't captured
-- SELECT pg_notify('pgrst', 'reload schema');
