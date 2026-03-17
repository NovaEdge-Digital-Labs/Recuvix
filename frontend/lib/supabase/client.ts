/*
SUPABASE SETUP:
1. Create project at supabase.com
2. Go to SQL Editor, run the schema SQL provided in the project docs
3. Go to Authentication → Providers:
   - Email: enable (default)
   - Google: enable, add OAuth credentials
     (get from console.cloud.google.com)
     Callback URL: {your-app-url}/auth/callback
4. Go to Project Settings → API:
   Copy NEXT_PUBLIC_SUPABASE_URL
   Copy NEXT_PUBLIC_SUPABASE_ANON_KEY
   Copy service_role key (keep secret!)
5. Add all keys to .env.local
6. For Google OAuth:
   - Create OAuth 2.0 credentials in Google Console
   - Add authorized redirect URI:
     https://{your-supabase-project}.supabase.co/auth/v1/callback
*/

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database';

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // Disable library-side locking as it can hang in Chromium browsers
          // when multiple tabs or leaked locks are present.
          lock: (name: string, acquireTimeout: number, acquire: () => Promise<any>) => acquire(),
        },
      }
    );
  }

  return supabaseInstance;
}
