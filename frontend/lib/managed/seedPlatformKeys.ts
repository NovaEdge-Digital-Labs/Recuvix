import { supabaseAdmin } from '@/lib/supabase/admin'
import { encryptKey, maskKey } from './keyEncryption'

const KEYS_TO_SEED = [
    {
        provider: 'claude',
        model: 'claude-3-5-sonnet-20240620', // Updated to latest stable models
        label: 'Claude Primary',
        envVar: 'PLATFORM_CLAUDE_KEY_1',
        priority: 1,
    },
    {
        provider: 'claude',
        model: 'claude-3-5-sonnet-20240620',
        label: 'Claude Secondary',
        envVar: 'PLATFORM_CLAUDE_KEY_2',
        priority: 2,
    },
    {
        provider: 'openai',
        model: 'gpt-4o',
        label: 'OpenAI Primary',
        envVar: 'PLATFORM_OPENAI_KEY_1',
        priority: 1,
    },
    {
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        label: 'Gemini Primary',
        envVar: 'PLATFORM_GEMINI_KEY_1',
        priority: 1,
    },
    {
        provider: 'grok',
        model: 'grok-1',
        label: 'Grok Primary',
        envVar: 'PLATFORM_GROK_KEY_1',
        priority: 1,
    },
]

async function seed() {
    console.log('Starting platform key seeding...')

    for (const config of KEYS_TO_SEED) {
        const rawKey = process.env[config.envVar]
        if (!rawKey) {
            console.log(`Skipping ${config.label} — env var ${config.envVar} not set`)
            continue
        }

        const { error } = await supabaseAdmin
            .from('platform_api_keys')
            .upsert({
                provider: config.provider,
                model: config.model,
                label: config.label,
                encrypted_key: encryptKey(rawKey),
                key_hint: maskKey(rawKey),
                priority: config.priority,
                is_active: true,
                is_healthy: true,
            } as any, { onConflict: 'label' })

        if (error) {
            console.error(`Error seeding ${config.label}:`, error.message)
        } else {
            console.log(`Successfully seeded: ${config.label}`)
        }
    }

    console.log('Seeding complete.')
}

// Check if run directly
if (require.main === module) {
    seed().catch(err => {
        console.error('Seeding failed:', err)
        process.exit(1)
    })
}

export { seed }
