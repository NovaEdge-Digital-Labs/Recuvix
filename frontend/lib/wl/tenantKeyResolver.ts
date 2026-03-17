import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import crypto from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.PLATFORM_KEY_ENCRYPTION_SECRET || 'fallback-secret-for-dev-only-32chars';

// Helper to decrypt keys
function decryptKey(encryptedData: string): string {
    try {
        if (!encryptedData.includes(':')) return encryptedData; // Not encrypted

        const [ivHex, encryptedHex] = encryptedData.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv(
            ENCRYPTION_ALGORITHM,
            Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
            iv
        );

        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (err) {
        console.error('Decryption failed:', err);
        return encryptedData; // Fallback to raw if decryption fails
    }
}

export async function resolveLLMKey(
    provider: string,
    tenantId: string | null,
    userApiKey: string | null,
): Promise<{
    key: string,
    source: 'user_byok' | 'tenant' | 'platform'
}> {
    // Priority 1: User's own BYOK key
    if (userApiKey && userApiKey !== 'default' && userApiKey.length > 5) {
        console.log(`[LLM_KEY] Using USER BYOK for ${provider}`);
        return { key: userApiKey, source: 'user_byok' };
    }

    // Priority 2: Tenant's own LLM key
    if (tenantId) {
        const { data, error } = await supabaseAdmin.rpc(
            'get_tenant_llm_key',
            { p_tenant_id: tenantId, p_provider: provider }
        );

        if (data && !error) {
            console.log(`[LLM_KEY] Using TENANT key for ${provider} (Tenant: ${tenantId})`);
            return {
                key: decryptKey(data),
                source: 'tenant'
            };
        }
    }

    // Priority 3: Platform key pool
    console.log(`[LLM_KEY] Falling back to PLATFORM keys for ${provider}`);
    const envKeyName = `PLATFORM_${provider.toUpperCase()}_KEY`;
    const envKey = process.env[envKeyName];
    if (envKey) {
        return {
            key: envKey,
            source: 'platform'
        };
    }

    const { data, error } = await supabaseAdmin
        .from('platform_api_keys')
        .select('encrypted_key')
        .eq('provider', provider)
        .eq('is_active', true)
        .eq('is_healthy', true)
        .order('priority', { ascending: true })
        .limit(1)
        .single();

    if (data && !error) {
        return {
            key: decryptKey(data.encrypted_key),
            source: 'platform'
        };
    }

    throw new Error('No LLM key available for ' + provider);
}
