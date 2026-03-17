import { createClient } from '@supabase/supabase-js';
import { Database } from './database';

/**
 * Creates a Supabase client using the SERVICE_ROLE_KEY.
 * This client bypasses Row Level Security (RLS).
 * MUST ONLY be used in server-side contexts that have already verified admin status.
 */
export const createAdminClient = () => createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Singleton instance of the admin client.
 */
export const supabaseAdmin = createAdminClient();
