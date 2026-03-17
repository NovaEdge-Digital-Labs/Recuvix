import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type ApiKeyRow = Database['public']['Tables']['api_keys']['Row'];


// TODO: Use Supabase Vault for encryption before production launch.
// V1: keys are stored as-is, protected only by RLS.
function encodeKey(key: string): string {
    return btoa(key);
}

function decodeKey(encoded: string): string {
    try {
        return atob(encoded);
    } catch {
        return encoded; // already plain (migration compat)
    }
}

export const apiKeysService = {
    async saveKey(
        userId: string,
        provider: ApiKeyRow['provider'],
        apiKey: string
    ): Promise<ApiKeyRow> {
        const supabase = createClient();
        const keyHint = '...' + apiKey.slice(-4);
        const encryptedKey = encodeKey(apiKey);

        const { data, error } = await (supabase
            .from('api_keys') as any)
            .upsert(
                {
                    user_id: userId,
                    provider,
                    encrypted_key: encryptedKey,
                    key_hint: keyHint,
                    is_default: true,
                },
                { onConflict: 'user_id,provider' }
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getKeys(userId: string): Promise<ApiKeyRow[]> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('api_keys') as any)
            .select('*')
            .eq('user_id', userId);
        if (error) throw error;
        return data || [];
    },

    async getDecryptedKey(userId: string, provider: ApiKeyRow['provider']): Promise<string | null> {
        const supabase = createClient();
        const { data } = await (supabase
            .from('api_keys') as any)
            .select('encrypted_key')
            .eq('user_id', userId)
            .eq('provider', provider)
            .single();
        if (!data) return null;
        return decodeKey(data.encrypted_key);
    },

    async deleteKey(userId: string, provider: ApiKeyRow['provider']): Promise<void> {
        const supabase = createClient();
        const { error } = await (supabase
            .from('api_keys') as any)
            .delete()
            .eq('user_id', userId)
            .eq('provider', provider);
        if (error) throw error;
    },

    async markTested(
        userId: string,
        provider: ApiKeyRow['provider'],
        isValid: boolean
    ): Promise<void> {
        const supabase = createClient();
        await (supabase
            .from('api_keys') as any)
            .update({ last_tested_at: new Date().toISOString(), is_valid: isValid })
            .eq('user_id', userId)
            .eq('provider', provider);
    },
};
