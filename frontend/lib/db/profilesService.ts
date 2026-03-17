import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const profilesService = {
    async getProfile(userId: string): Promise<ProfileRow | null> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('profiles') as any)
            .select('*')
            .eq('id', userId)
            .single();
        if (error) return null;
        return data;
    },

    async updateProfile(userId: string, updates: Omit<ProfileUpdate, 'id'>): Promise<{ success: boolean, error: any }> {
        try {
            // Use the proxy API route to bypass potential client-side locks and RLS issues
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok || data.error) {
                return { success: false, error: { message: data.error || 'Failed to update profile via API' } };
            }

            return { success: true, error: null };
        } catch (err: any) {
            console.error("Profile update failed:", err);
            if (err.name === 'AbortError') {
                return { success: false, error: { message: 'session_lock_timeout' } };
            }
            return { success: false, error: err };
        }
    },

    async incrementBlogsGenerated(userId: string, wordCount: number): Promise<void> {
        const supabase = createClient();
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('total_blogs_generated, total_words_generated')
            .eq('id', userId)
            .single();
        if (!profile) return;

        await (supabase
            .from('profiles') as any)
            .update({
                total_blogs_generated: (profile.total_blogs_generated || 0) + 1,
                total_words_generated: (profile.total_words_generated || 0) + wordCount,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
    },

    async savePreferences(userId: string, preferences: Record<string, unknown>): Promise<void> {
        const supabase = createClient();
        await (supabase
            .from('profiles') as any)
            .update({ preferences, updated_at: new Date().toISOString() })
            .eq('id', userId);
    },
};
