import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * POST /api/voice/clean-transcript
 * LLM-powered transcript cleaning and structuring.
 */

export async function POST(req: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] || ''
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            recordingId, llmProvider, apiKey, targetBlogTopic,
            country, cleaningLevel
        } = await req.json();

        if (!recordingId) {
            return NextResponse.json({ error: 'Missing recordingId' }, { status: 400 });
        }

        // 1. Load recording
        const { data: recording, error: recError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .select('*')
            .eq('id', recordingId)
            .eq('user_id', user.id)
            .single();

        if (recError || !recording || !recording.transcript_raw) {
            return NextResponse.json({ error: 'Recording or transcript not found' }, { status: 404 });
        }

        // 2. Prepare prompt
        const prompt = `
You are an expert editor and content strategist. 
You have received a raw transcript from a spoken audio recording. Your job is to clean it and extract structured content.

CLEANING LEVEL: ${cleaningLevel || 'standard'}

RAW TRANSCRIPT:
${recording.transcript_raw.slice(0, 8000)}

${targetBlogTopic ? `THE SPEAKER'S INTENDED TOPIC: ${targetBlogTopic}` : ''}

TARGET COUNTRY: ${country || 'Global'}

TASK 1 — CLEAN THE TRANSCRIPT:
Remove or fix:
- Filler words: "um", "uh", "like", "you know", "basically", "literally", "right?", "so yeah"
- False starts and repetitions: "I was— I mean I wanted to" → "I wanted to"
- Verbal tics and stutters
- "[inaudible]" sections (skip them)
${cleaningLevel === 'heavy' ? `
- Fix run-on sentences
- Improve awkward phrasing
- Add punctuation where missing
- Fix grammatical errors while preserving the speaker's natural voice and style
` : ''}

TASK 2 — EXTRACT STRUCTURE:
Identify the main topics and subtopics discussed. Group related content together.

TASK 3 — IDENTIFY KEY CONTENT:
Find and note:
- Main argument or thesis
- Key insights (3-5 most important points)
- Any specific examples, stories, or case studies
- Statistics or data mentioned
- Questions the speaker answers
- Strong quotes (memorable phrases worth keeping)

Respond ONLY with valid JSON. 
No markdown, no code fences.

{
  "cleanedTranscript": "The full cleaned text",
  "wordCount": number,
  "estimatedReadingMinutes": number,
  "mainThesis": "Core argument in 1-2 sentences",
  "keyInsights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  "detectedTopics": ["topic1", "topic2"],
  "suggestedTitle": "A compelling blog title",
  "suggestedFocusKeyword": "primary keyword",
  "speakerTone": "conversational|educational|authoritative|storytelling|motivational",
  "strongQuotes": [
    "A memorable phrase worth featuring"
  ],
  "contentOutline": [
    {
      "heading": "Suggested H2 section",
      "summary": "What this section covers",
      "transcriptExcerpt": "Relevant quote..."
    }
  ]
}
`.trim();

        // 3. Call LLM (Non-streaming)
        let llmResponseText = '';

        if (llmProvider === 'openai' || llmProvider === 'grok') {
            const url = llmProvider === 'openai'
                ? 'https://api.openai.com/v1/chat/completions'
                : 'https://api.x.ai/v1/chat/completions'; // Assuming Grok URL

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: llmProvider === 'openai' ? 'gpt-4o' : 'grok-1',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.1,
                    response_format: { type: 'json_object' }
                }),
            });
            const data = await res.json();
            llmResponseText = data.choices[0]?.message?.content;
        } else if (llmProvider === 'claude') {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20240620',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 4000,
                }),
            });
            const data = await res.json();
            llmResponseText = data.content[0]?.text;
        } else if (llmProvider === 'gemini') {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                }),
            });
            const data = await res.json();
            llmResponseText = data.candidates[0]?.content?.parts[0]?.text;
        }

        if (!llmResponseText) {
            throw new Error('LLM failed to respond');
        }

        // 4. Parse JSON
        const result = JSON.parse(llmResponseText.replace(/```json|```/g, '').trim());

        // 5. Update DB
        const { data: updated, error: updateError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .update({
                transcript_cleaned: result.cleanedTranscript,
                transcript_structured: JSON.stringify(result),
                detected_topics: result.detectedTopics,
                detected_keywords: [result.suggestedFocusKeyword]
            })
            .eq('id', recordingId)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({ analysis: result });

    } catch (error: any) {
        console.error('Cleaning API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
