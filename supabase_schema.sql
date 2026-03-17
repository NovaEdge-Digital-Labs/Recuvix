-- Add credit system columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS managed_mode_enabled BOOLEAN DEFAULT false;

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- positive for addition, negative for deduction
    type TEXT NOT NULL CHECK (type IN ('purchase', 'bonus', 'generation', 'refund', 'admin')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for credit_transactions
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions" 
    ON public.credit_transactions FOR SELECT 
    USING (auth.uid() = profile_id);

-- Create razorpay_orders table
CREATE TABLE IF NOT EXISTS public.razorpay_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    amount_inr INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'created',
    pack_id TEXT NOT NULL,
    credits INTEGER NOT NULL,
    receipt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for razorpay_orders
ALTER TABLE public.razorpay_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" 
    ON public.razorpay_orders FOR SELECT 
    USING (auth.uid() = profile_id);

-- Create platform_api_keys table
CREATE TABLE IF NOT EXISTS public.platform_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL UNIQUE,
    key_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS: Platform API keys are only readable by service_role (admins/backend)
ALTER TABLE public.platform_api_keys ENABLE ROW LEVEL SECURITY;

-- Function to safely deduct credits transactionally
CREATE OR REPLACE FUNCTION deduct_credit(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_balance INTEGER;
BEGIN
    -- Lock the row for update to prevent race conditions
    SELECT credits_balance INTO current_balance 
    FROM public.profiles 
    WHERE id = user_id FOR UPDATE;

    IF current_balance >= 1 THEN
        -- Deduct balance
        UPDATE public.profiles 
        SET credits_balance = credits_balance - 1 
        WHERE id = user_id;

        -- Record transaction
        INSERT INTO public.credit_transactions (profile_id, amount, type, metadata)
        VALUES (user_id, -1, 'generation', '{"description": "Blog Generation"}'::jsonb);

        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely add credits transactionally
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, credit_amount INTEGER, pack TEXT, rzp_order_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Add balance
    UPDATE public.profiles 
    SET credits_balance = credits_balance + credit_amount 
    WHERE id = user_id;

    -- Record transaction
    INSERT INTO public.credit_transactions (profile_id, amount, type, metadata)
    VALUES (
        user_id, 
        credit_amount, 
        'purchase', 
        jsonb_build_object('pack_id', pack, 'razorpay_order_id', rzp_order_id)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Force PostgREST schema cache to reload immediately
NOTIFY pgrst, 'reload schema';
