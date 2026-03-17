/**
 * API Key Format Validators
 * Validates key formats before sending to external LLM APIs.
 * This prevents garbage keys from being forwarded to paid APIs.
 */

export const API_KEY_PATTERNS: Record<string, { prefix: string; minLength: number }> = {
    claude: { prefix: 'sk-ant-', minLength: 50 },
    openai: { prefix: 'sk-', minLength: 30 },
    gemini: { prefix: 'AIzaSy', minLength: 30 },
    grok: { prefix: 'xai-', minLength: 20 },
};

/**
 * Validates an API key matches the expected format for a given provider.
 * @returns true if valid, false if rejected.
 */
export function validateApiKeyFormat(provider: string, key: string): boolean {
    if (!key || typeof key !== 'string') return false;

    const pattern = API_KEY_PATTERNS[provider.toLowerCase()];
    if (!pattern) {
        // Unknown provider — do a basic sanity check
        return key.length >= 20 && /^[a-zA-Z0-9._\-]+$/.test(key);
    }

    return key.startsWith(pattern.prefix) && key.length >= pattern.minLength;
}

/**
 * Validates an OpenAI key. Accepts both 'sk-' (legacy) and 'sk-proj-' (project-scoped) keys.
 */
export function validateOpenAiKey(key: string): boolean {
    return (key.startsWith('sk-') || key.startsWith('sk-proj-')) && key.length >= 30;
}

/**
 * Validates a Claude (Anthropic) key.
 */
export function validateClaudeKey(key: string): boolean {
    return key.startsWith('sk-ant-') && key.length >= 50;
}

/**
 * Validates a Gemini (Google) key.
 */
export function validateGeminiKey(key: string): boolean {
    return key.startsWith('AIzaSy') && key.length >= 30;
}

/**
 * Validates a Grok (xAI) key.
 */
export function validateGrokKey(key: string): boolean {
    return key.startsWith('xai-') && key.length >= 20;
}

/**
 * Dispatches to the correct provider validator.
 */
export function validateProviderKey(provider: string, key: string): boolean {
    switch (provider.toLowerCase()) {
        case 'openai': return validateOpenAiKey(key);
        case 'claude': return validateClaudeKey(key);
        case 'gemini': return validateGeminiKey(key);
        case 'grok': return validateGrokKey(key);
        default: return validateApiKeyFormat(provider, key);
    }
}
