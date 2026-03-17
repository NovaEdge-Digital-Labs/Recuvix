import { RepurposeFormat } from './repurposePromptBuilder';

export interface RepurposeContent {
    content: string;
    tweets?: string[];
    tweetCount?: number;
    subject?: string;
    preheader?: string;
    html?: string;
    textVersion?: string;
    pinTitle?: string;
    description?: string;
    sections?: { label: string; content: string }[];
    estimatedDurationMinutes?: number;
    generatedAt?: string;
    model?: string;
    edited?: boolean;
}

export function parseRepurposeResponse(
    format: RepurposeFormat,
    rawText: string
): RepurposeContent {
    switch (format) {
        case 'twitter': {
            const tweets = rawText
                .split(/\n---\n/)
                .map((t) => t.trim())
                .filter((t) => t.length > 0);
            return {
                tweets,
                content: rawText,
                tweetCount: tweets.length,
            };
        }

        case 'email':
            try {
                const cleaned = rawText
                    .replace(/^```json\n?/, '')
                    .replace(/\n?```$/, '')
                    .trim();
                const parsed = JSON.parse(cleaned);
                return {
                    subject: parsed.subject,
                    preheader: parsed.preheader,
                    html: parsed.html,
                    textVersion: parsed.textVersion,
                    content: parsed.html,
                };
            } catch (e) {
                console.error('Failed to parse email JSON:', e);
                // Fallback: treat as plain text email
                return {
                    content: rawText,
                    subject: 'Newsletter',
                    preheader: '',
                };
            }

        case 'pinterest':
            try {
                const cleaned = rawText
                    .replace(/^```json\n?/, '')
                    .replace(/\n?```$/, '')
                    .trim();
                const parsed = JSON.parse(cleaned);
                return {
                    pinTitle: parsed.pinTitle,
                    description: parsed.description,
                    content: parsed.pinTitle + '\n\n' + parsed.description,
                };
            } catch (e) {
                console.error('Failed to parse pinterest JSON:', e);
                return { content: rawText };
            }

        case 'youtube': {
            // Extract sections from script
            const sections: { label: string; content: string }[] = [];
            const sectionRegex = /\[([A-Z\s]+ - \d+:\d+)\]([\s\S]*?)(?=\[[A-Z\s]+ - \d+:\d+\]|$)/g;
            let match;
            while ((match = sectionRegex.exec(rawText)) !== null) {
                sections.push({
                    label: match[1],
                    content: match[2].trim(),
                });
            }
            const wordCount = rawText
                .replace(/\[.*?\]/g, '')
                .split(/\s+/)
                .filter((w) => w.length > 0).length;
            return {
                content: rawText,
                sections,
                estimatedDurationMinutes: Math.round(wordCount / 130), // ~130 wpm
            };
        }

        default:
            // LinkedIn, Instagram, Facebook, WhatsApp — plain text
            return { content: rawText.trim() };
    }
}
