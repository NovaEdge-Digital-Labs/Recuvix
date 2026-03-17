export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    plan: 'free' | 'pro' | 'agency';
                    plan_expires_at: string | null;
                    blogs_generated_count: number;
                    total_words_generated: number;
                    credits_balance: number;
                    credits_total_purchased: number;
                    credits_total_used: number;
                    managed_mode_enabled: boolean;
                    preferences: Json;
                    tenant_id: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    plan?: 'free' | 'pro' | 'agency';
                    plan_expires_at?: string | null;
                    blogs_generated_count?: number;
                    total_words_generated?: number;
                    credits_balance?: number;
                    credits_total_purchased?: number;
                    credits_total_used?: number;
                    managed_mode_enabled?: boolean;
                    preferences?: Json;
                    tenant_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    plan?: 'free' | 'pro' | 'agency';
                    plan_expires_at?: string | null;
                    blogs_generated_count?: number;
                    total_words_generated?: number;
                    credits_balance?: number;
                    credits_total_purchased?: number;
                    credits_total_used?: number;
                    managed_mode_enabled?: boolean;
                    preferences?: Json;
                    tenant_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            api_keys: {
                Row: {
                    id: string;
                    user_id: string;
                    provider: 'claude' | 'openai' | 'gemini' | 'grok';
                    encrypted_key: string;
                    key_hint: string | null;
                    is_default: boolean;
                    last_tested_at: string | null;
                    is_valid: boolean | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    provider: 'claude' | 'openai' | 'gemini' | 'grok';
                    encrypted_key: string;
                    key_hint?: string | null;
                    is_default?: boolean;
                    last_tested_at?: string | null;
                    is_valid?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    provider?: 'claude' | 'openai' | 'gemini' | 'grok';
                    encrypted_key?: string;
                    key_hint?: string | null;
                    is_default?: boolean;
                    last_tested_at?: string | null;
                    is_valid?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            blogs: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    topic: string;
                    focus_keyword: string;
                    secondary_keywords: string[];
                    country: string;
                    word_count: number;
                    format: 'html' | 'md' | 'xml';
                    model: string;
                    status: string;
                    excerpt: string | null;
                    blog_html: string | null;
                    blog_markdown: string | null;
                    seo_meta: Json | null;
                    meta_title: string | null;
                    meta_description: string | null;
                    slug: string | null;
                    thumbnail_url: string | null;
                    generation_input: Json | null;
                    approved_outline: Json | null;
                    generation_time_seconds: number | null;
                    is_starred: boolean;
                    tags: string[];
                    edit_count: number;
                    edit_history: Json;
                    has_wordpress_post: boolean;
                    wordpress_url: string | null;
                    wordpress_post_id: number | null;
                    parent_blog_id: string | null;
                    language_code: string;
                    tenant_id: string | null;
                    created_at: string;
                    updated_at: string;
                    last_viewed_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    topic: string;
                    focus_keyword?: string;
                    secondary_keywords?: string[];
                    country?: string;
                    word_count?: number;
                    format?: 'html' | 'md' | 'xml';
                    model: string;
                    status?: string;
                    excerpt?: string | null;
                    blog_html?: string | null;
                    blog_markdown?: string | null;
                    seo_meta?: Json | null;
                    meta_title?: string | null;
                    meta_description?: string | null;
                    slug?: string | null;
                    thumbnail_url?: string | null;
                    generation_input?: Json | null;
                    approved_outline?: Json | null;
                    generation_time_seconds?: number | null;
                    is_starred?: boolean;
                    tags?: string[];
                    edit_count?: number;
                    edit_history?: Json;
                    has_wordpress_post?: boolean;
                    wordpress_url?: string | null;
                    wordpress_post_id?: number | null;
                    parent_blog_id?: string | null;
                    language_code?: string;
                    tenant_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    last_viewed_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    topic?: string;
                    focus_keyword?: string;
                    secondary_keywords?: string[];
                    country?: string;
                    word_count?: number;
                    format?: 'html' | 'md' | 'xml';
                    model?: string;
                    status?: string;
                    excerpt?: string | null;
                    blog_html?: string | null;
                    blog_markdown?: string | null;
                    seo_meta?: Json | null;
                    meta_title?: string | null;
                    meta_description?: string | null;
                    slug?: string | null;
                    thumbnail_url?: string | null;
                    generation_input?: Json | null;
                    approved_outline?: Json | null;
                    generation_time_seconds?: number | null;
                    is_starred?: boolean;
                    tags?: string[];
                    edit_count?: number;
                    edit_history?: Json;
                    has_wordpress_post?: boolean;
                    wordpress_url?: string | null;
                    wordpress_post_id?: number | null;
                    parent_blog_id?: string | null;
                    language_code?: string;
                    tenant_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    last_viewed_at?: string;
                };
            };
            research_history: {
                Row: {
                    id: string;
                    user_id: string;
                    niche: string;
                    country: string;
                    topics: Json;
                    model: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    niche: string;
                    country: string;
                    topics?: Json;
                    model: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    niche?: string;
                    country?: string;
                    topics?: Json;
                    model?: string;
                    created_at?: string;
                };
            };
            tracked_blogs: {
                Row: {
                    id: string;
                    user_id: string;
                    blog_id: string | null;
                    title: string;
                    url: string;
                    slug: string | null;
                    published_at: string | null;
                    focus_keyword: string;
                    secondary_keywords: string[];
                    notes: string | null;
                    source_type: string | null;
                    status: 'active' | 'planned' | 'archived';
                    added_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    blog_id?: string | null;
                    title: string;
                    url: string;
                    slug?: string | null;
                    published_at?: string | null;
                    focus_keyword?: string;
                    secondary_keywords?: string[];
                    notes?: string | null;
                    source_type?: string | null;
                    status?: 'active' | 'planned' | 'archived';
                    added_at?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    blog_id?: string | null;
                    title?: string;
                    url?: string;
                    slug?: string | null;
                    published_at?: string | null;
                    focus_keyword?: string;
                    secondary_keywords?: string[];
                    notes?: string | null;
                    source_type?: string | null;
                    status?: 'active' | 'planned' | 'archived';
                    added_at?: string;
                    created_at?: string;
                };
            };
            ranking_snapshots: {
                Row: {
                    id: string;
                    user_id: string;
                    tracked_blog_id: string;
                    snapshot_date: string;
                    keyword: string;
                    position: number | null;
                    impressions: number | null;
                    clicks: number | null;
                    ctr: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    tracked_blog_id: string;
                    snapshot_date?: string;
                    keyword: string;
                    position?: number | null;
                    impressions?: number | null;
                    clicks?: number | null;
                    ctr?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    tracked_blog_id?: string;
                    snapshot_date?: string;
                    keyword?: string;
                    position?: number | null;
                    impressions?: number | null;
                    clicks?: number | null;
                    ctr?: number | null;
                    created_at?: string;
                };
            };
            wordpress_connections: {
                Row: {
                    id: string;
                    user_id: string;
                    label: string;
                    site_url: string;
                    username: string;
                    app_password: string;
                    default_status: 'draft' | 'publish' | 'pending';
                    default_category_id: number | null;
                    site_title: string | null;
                    wordpress_version: string | null;
                    is_default: boolean;
                    last_tested_at: string | null;
                    categories: Json;
                    authors: Json;
                    connected_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    label: string;
                    site_url: string;
                    username: string;
                    app_password: string;
                    default_status?: 'draft' | 'publish' | 'pending';
                    default_category_id?: number | null;
                    site_title?: string | null;
                    wordpress_version?: string | null;
                    is_default?: boolean;
                    last_tested_at?: string | null;
                    categories?: Json;
                    authors?: Json;
                    connected_at?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    label?: string;
                    site_url?: string;
                    username?: string;
                    app_password?: string;
                    default_status?: 'draft' | 'publish' | 'pending';
                    default_category_id?: number | null;
                    site_title?: string | null;
                    wordpress_version?: string | null;
                    is_default?: boolean;
                    last_tested_at?: string | null;
                    categories?: Json;
                    authors?: Json;
                    connected_at?: string;
                    created_at?: string;
                };
            };
            gsc_configs: {
                Row: {
                    id: string;
                    user_id: string;
                    access_token: string;
                    refresh_token: string;
                    token_expiry: string;
                    site_url: string;
                    connected_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    access_token: string;
                    refresh_token: string;
                    token_expiry: string;
                    site_url: string;
                    connected_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    access_token?: string;
                    refresh_token?: string;
                    token_expiry?: string;
                    site_url?: string;
                    connected_at?: string;
                    updated_at?: string;
                };
            };
            platform_api_keys: {
                Row: {
                    id: string;
                    provider: string;
                    model: string;
                    label: string;
                    encrypted_key: string;
                    key_hint: string;
                    priority: number;
                    daily_request_limit: number;
                    is_active: boolean;
                    is_healthy: boolean;
                    last_success_at: string | null;
                    last_error: string | null;
                    last_error_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    provider: string;
                    model: string;
                    label: string;
                    encrypted_key: string;
                    key_hint: string;
                    priority?: number;
                    daily_request_limit?: number;
                    is_active?: boolean;
                    is_healthy?: boolean;
                    last_success_at?: string | null;
                    last_error?: string | null;
                    last_error_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    provider?: string;
                    model?: string;
                    label?: string;
                    encrypted_key?: string;
                    key_hint?: string;
                    priority?: number;
                    daily_request_limit?: number;
                    is_active?: boolean;
                    is_healthy?: boolean;
                    last_success_at?: string | null;
                    last_error?: string | null;
                    last_error_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            platform_key_usage_log: {
                Row: {
                    id: string;
                    key_id: string;
                    user_id: string;
                    blog_id: string | null;
                    status: 'success' | 'error';
                    error_message: string | null;
                    started_at: string;
                    ended_at: string | null;
                    duration_ms: number | null;
                };
                Insert: {
                    id?: string;
                    key_id: string;
                    user_id: string;
                    blog_id?: string | null;
                    status: 'success' | 'error';
                    error_message?: string | null;
                    started_at?: string;
                    ended_at?: string | null;
                    duration_ms?: number | null;
                };
                Update: {
                    id?: string;
                    key_id?: string;
                    user_id?: string;
                    blog_id?: string | null;
                    status?: 'success' | 'error';
                    error_message?: string | null;
                    started_at?: string;
                    ended_at?: string | null;
                    duration_ms?: number | null;
                };
            };
            platform_settings: {
                Row: {
                    key: string;
                    value: Json;
                    description: string | null;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: Json;
                    description?: string | null;
                    updated_at?: string;
                };
                Update: {
                    key?: string;
                    value?: Json;
                    description?: string | null;
                    updated_at?: string;
                };
            };
            razorpay_orders: {
                Row: {
                    id: string;
                    user_id: string;
                    razorpay_order_id: string | null;
                    pack_id: string;
                    pack_name: string;
                    credits: number;
                    amount_inr: number;
                    status: 'created' | 'paid' | 'failed' | 'cancelled';
                    expires_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    razorpay_order_id?: string | null;
                    pack_id: string;
                    pack_name: string;
                    credits: number;
                    amount_inr: number;
                    status?: 'created' | 'paid' | 'failed' | 'cancelled';
                    expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    razorpay_order_id?: string | null;
                    pack_id?: string;
                    pack_name?: string;
                    credits?: number;
                    amount_inr?: number;
                    status?: 'created' | 'paid' | 'failed' | 'cancelled';
                    expires_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            credit_transactions: {
                Row: {
                    id: string;
                    user_id: string;
                    amount: number;
                    type: string;
                    metadata: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    amount: number;
                    type: string;
                    metadata?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    amount?: number;
                    type?: string;
                    metadata?: Json;
                    created_at?: string;
                };
            };
            wl_tenants: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    custom_domain: string | null;
                    domain_verified: boolean;
                    logo_url: string | null;
                    favicon_url: string | null;
                    colors: Json;
                    fonts: Json;
                    features: Json;
                    status: 'active' | 'suspended' | 'pending';
                    owner_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    custom_domain?: string | null;
                    domain_verified?: boolean;
                    logo_url?: string | null;
                    favicon_url?: string | null;
                    colors?: Json;
                    fonts?: Json;
                    features?: Json;
                    status?: 'active' | 'suspended' | 'pending';
                    owner_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    custom_domain?: string | null;
                    domain_verified?: boolean;
                    logo_url?: string | null;
                    favicon_url?: string | null;
                    colors?: Json;
                    fonts?: Json;
                    features?: Json;
                    status?: 'active' | 'suspended' | 'pending';
                    owner_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            wl_tenant_users: {
                Row: {
                    tenant_id: string;
                    user_id: string;
                    role: 'admin' | 'user';
                    status: 'active' | 'inactive';
                    joined_at: string;
                };
                Insert: {
                    tenant_id: string;
                    user_id: string;
                    role?: 'admin' | 'user';
                    status?: 'active' | 'inactive';
                    joined_at?: string;
                };
                Update: {
                    tenant_id?: string;
                    user_id?: string;
                    role?: 'admin' | 'user';
                    status?: 'active' | 'inactive';
                    joined_at?: string;
                };
            };
            wl_revenue_transactions: {
                Row: {
                    id: string;
                    tenant_id: string;
                    user_id: string;
                    amount_total: number;
                    amount_platform_fee: number;
                    amount_tenant_net: number;
                    payout_status: 'pending' | 'paid' | 'failed';
                    razorpay_payment_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    tenant_id: string;
                    user_id: string;
                    amount_total: number;
                    amount_platform_fee: number;
                    amount_tenant_net: number;
                    payout_status?: 'pending' | 'paid' | 'failed';
                    razorpay_payment_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    tenant_id?: string;
                    user_id?: string;
                    amount_total?: number;
                    amount_platform_fee?: number;
                    amount_tenant_net?: number;
                    payout_status?: 'pending' | 'paid' | 'failed';
                    razorpay_payment_id?: string;
                    created_at?: string;
                };
            };
            wl_domain_verifications: {
                Row: {
                    id: string;
                    tenant_id: string;
                    domain: string;
                    txt_record: string;
                    status: 'pending' | 'verified' | 'failed';
                    last_checked_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    tenant_id: string;
                    domain: string;
                    txt_record: string;
                    status?: 'pending' | 'verified' | 'failed';
                    last_checked_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    tenant_id?: string;
                    domain?: string;
                    txt_record?: string;
                    status?: 'pending' | 'verified' | 'failed';
                    last_checked_at?: string | null;
                    created_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: {
            add_credits: {
                Args: {
                    p_user_id: string;
                    p_amount: number;
                    p_razorpay_payment_id: string;
                    p_razorpay_order_id: string;
                    p_razorpay_signature: string;
                    p_pack_id: string;
                    p_pack_name: string;
                    p_amount_paid_inr: number;
                };
                Returns: {
                    success: boolean;
                    credits_added: number;
                    balance_after: number;
                };
            };
            deduct_credit: {
                Args: {
                    p_user_id: string;
                    p_blog_id: string;
                    p_blog_topic: string;
                    p_llm_provider: string;
                };
                Returns: {
                    success: boolean;
                    error?: string;
                };
            };
            get_tenant_by_hostname: {
                Args: {
                    p_hostname: string;
                };
                Returns: Json;
            };
            get_tenant_llm_key: {
                Args: {
                    p_tenant_id: string;
                    p_provider: string;
                };
                Returns: string;
            };
        };
        Enums: Record<string, never>;
    };
};
