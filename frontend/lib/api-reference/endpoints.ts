export interface ParamDef {
    name: string;
    type: string;
    required: boolean;
    default?: string | number | boolean;
    description: string;
    options?: string[];
    properties?: ParamDef[];
}

export interface ResponseDef {
    status: number;
    title: string;
    description: string;
    schema: ParamDef[];
}

export interface Endpoint {
    id: string;
    group: string;
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    title: string;
    description: string;
    auth: boolean;
    streaming: boolean;
    credits: number;
    requestBody?: ParamDef[];
    responses: ResponseDef[];
    errors: { code: string; message: string; fix: string }[];
}

export const API_ENDPOINTS: Endpoint[] = [
    {
        id: 'blog-generate',
        group: 'CORE',
        method: 'POST',
        path: '/api/blog/generate',
        title: 'Generate Blog Post',
        description: 'Generates a complete SEO-optimized blog post from a topic. Streams the response via SSE. Includes blog HTML, images, and SEO metadata.',
        auth: true,
        streaming: true,
        credits: 1,
        requestBody: [
            { name: 'topic', type: 'string', required: true, description: 'Blog topic or title. Min 5 chars, max 200 chars.' },
            { name: 'country', type: 'string', required: true, description: 'Target country for SEO. e.g. "india", "usa".' },
            { name: 'tone', type: 'string', required: false, default: 'professional', description: 'Writing tone.', options: ['professional', 'conversational', 'educational', 'journalistic'] },
            { name: 'wordCount', type: 'number', required: false, default: 1500, description: 'Target word count. Range: 300-5000.' },
            { name: 'outputFormat', type: 'string', required: false, default: 'html', description: 'Output file format.', options: ['html', 'md', 'xml'] },
            { name: 'llmProvider', type: 'string', required: true, description: 'AI provider to use.', options: ['claude', 'openai', 'gemini', 'grok'] },
            { name: 'apiKey', type: 'string', required: true, description: 'Provider API key (if BYOK mode).' },
            { name: 'includeAiImages', type: 'boolean', required: false, default: true, description: 'Whether to generate AI-sourced images.' },
            { name: 'includeThumbnail', type: 'boolean', required: false, default: true, description: 'Whether to create a blog thumbnail.' },
        ],
        responses: [
            {
                status: 200,
                title: 'Success (Streaming)',
                description: 'Sends Server-Sent Events (SSE) data chunks.',
                schema: [
                    { name: 'type', type: 'enum', required: true, description: 'Event type.', options: ['step', 'chunk', 'outline_ready', 'image_ready', 'done', 'error'] },
                    { name: 'text', type: 'string', required: false, description: 'The generated text chunk.' },
                    { name: 'wordCount', type: 'number', required: false, description: 'Total word count (on done).' }
                ]
            }
        ],
        errors: [
            { code: 'INVALID_API_KEY', message: 'Key is wrong or expired', fix: 'Re-enter in Settings' },
            { code: 'RATE_LIMITED', message: 'LLM rate limit hit', fix: 'Wait 60 seconds' },
            { code: 'INSUFFICIENT_CREDITS', message: 'No credits remaining', fix: 'Buy credits' }
        ]
    },
    {
        id: 'outline-generate',
        group: 'CORE',
        method: 'POST',
        path: '/api/outline/generate',
        title: 'Generate Blog Outline',
        description: 'Generates a structured H1 + H2 outline for a blog topic. Much faster than full generation.',
        auth: true,
        streaming: false,
        credits: 0,
        requestBody: [
            { name: 'llmProvider', type: 'string', required: true, description: 'AI provider.' },
            { name: 'apiKey', type: 'string', required: true, description: 'API key.' },
            { name: 'topic', type: 'string', required: true, description: 'Blog topic.' },
            { name: 'country', type: 'string', required: true, description: 'Target country.' }
        ],
        responses: [
            {
                status: 200,
                title: 'Outline Ready',
                description: 'Returns the full outline structure.',
                schema: [
                    { name: 'h1', type: 'string', required: true, description: 'Main heading.' },
                    { name: 'h2s', type: 'string[]', required: true, description: 'Array of subheadings.' },
                    { name: 'focusKeyword', type: 'string', required: true, description: 'Selected focus keyword.' }
                ]
            }
        ],
        errors: []
    },
    {
        id: 'titles-suggest',
        group: 'CORE',
        method: 'POST',
        path: '/api/titles/suggest',
        title: 'Suggest Blog Titles',
        description: 'Generates 5 SEO-optimized alternative titles for a blog topic.',
        auth: true,
        streaming: false,
        credits: 0,
        responses: [
            {
                status: 200,
                title: 'Title Suggestions',
                description: '5 Title suggestions',
                schema: [
                    { name: 'suggestions', type: 'array', required: true, description: 'Title Suggestion array' }
                ]
            }
        ],
        errors: []
    },
    {
        id: 'seo-meta',
        group: 'SEO',
        method: 'POST',
        path: '/api/seo/meta',
        title: 'Generate SEO Meta Pack',
        description: 'Generates complete SEO metadata for a blog post.',
        auth: true,
        streaming: false,
        credits: 0,
        responses: [
            {
                status: 200,
                title: 'Meta Pack Generated',
                description: 'SEO Meta Pack result',
                schema: [
                    { name: 'slug', type: 'string', required: true, description: 'URL Slug' },
                    { name: 'metaTitle', type: 'string', required: true, description: 'SEO Title' }
                ]
            }
        ],
        errors: []
    },
    {
        id: 'voice-transcribe',
        group: 'VOICE',
        method: 'POST',
        path: '/api/voice/transcribe',
        title: 'Transcribe Audio',
        description: 'Submits an uploaded audio recording for transcription using OpenAI Whisper.',
        auth: true,
        streaming: false,
        credits: 0,
        responses: [
            {
                status: 200,
                title: 'Processing Started',
                description: 'Polling job started',
                schema: [
                    { name: 'recordingId', type: 'string', required: true, description: 'Job ID' }
                ]
            }
        ],
        errors: []
    }
];
