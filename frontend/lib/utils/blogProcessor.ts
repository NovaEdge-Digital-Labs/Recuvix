import { BlogFormData } from "@/components/form/BlogForm";
import { StreamOptions } from "@/hooks/useStreamingLLM";

export async function processImagesInMarkdown(
    markdown: string,
    prefs: { ai: boolean, stock: boolean },
    country: string = "usa"
): Promise<string> {
    const placeholderRegex = /\[IMAGE_PLACEHOLDER:\s*(.*?)\]/g;
    const imgTagRegex = /\*\*img\*\*|img/gi; // Matches 'img' or '**img**' on its own line

    let finalMarkdown = markdown;
    let isAiTurn = prefs.ai && !prefs.stock ? true : prefs.ai && prefs.stock ? true : false;

    if (!prefs.ai && !prefs.stock) {
        return markdown.replace(placeholderRegex, "").replace(imgTagRegex, "");
    }

    // 1. Handle legacy placeholders first
    const legacyMatches = Array.from(markdown.matchAll(placeholderRegex));
    for (const m of legacyMatches) {
        const fullPlaceholder = m[0];
        const imagePrompt = m[1];
        const imageUrl = await fetchImageUrl(imagePrompt, isAiTurn && prefs.ai, prefs.stock, country);

        if (imageUrl) {
            finalMarkdown = finalMarkdown.replace(fullPlaceholder, `\n\n![${imagePrompt.replace(/[^a-zA-Z0-9 ]/g, '')}](${imageUrl})\n\n`);
        } else {
            finalMarkdown = finalMarkdown.replace(fullPlaceholder, "");
        }
        if (prefs.ai && prefs.stock) isAiTurn = !isAiTurn;
    }

    // 2. Handle new 'img' tags by inferring context
    const lines = finalMarkdown.split('\n');
    const processedLines = [];
    let accumulatedText = "";

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.toLowerCase() === 'img' || line.toLowerCase() === '**img**') {
            const context = accumulatedText.slice(-500); // Take last 500 chars for context
            const inferredPrompt = `A professional illustration or high-quality photograph for a blog post about "${context.substring(0, 100)}...". Visualizing: ${context.slice(-200)}`;

            const imageUrl = await fetchImageUrl(inferredPrompt, isAiTurn && prefs.ai, prefs.stock, country);
            if (imageUrl) {
                processedLines.push(`\n![Inferred Visual](${imageUrl})\n`);
            }
            if (prefs.ai && prefs.stock) isAiTurn = !isAiTurn;
        } else {
            processedLines.push(lines[i]);
            accumulatedText += lines[i] + " ";
        }
    }

    return processedLines.join('\n');
}

async function fetchImageUrl(prompt: string, useAi: boolean, useStock: boolean, country: string): Promise<string | null> {
    try {
        if (useAi) {
            const res = await fetch("/api/images/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, country })
            });
            const data = await res.json();
            return data.imageUrl || null;
        } else if (useStock) {
            const res = await fetch("/api/images/stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            return data.imageUrl || null;
        }
    } catch (e) {
        console.error("Failed to fetch image:", prompt, e);
    }
    return null;
}

export async function generateThumbnail(data: BlogFormData, title: string, streamCompletion: (options: StreamOptions) => Promise<void>) {
    try {
        // 1. AI Concept Phase: Use the custom persona to envision the background
        const conceptPrompt = `Envision a high-impact, cinematic background for a YouTube thumbnail about: "${title || data.topic}". 
        Describe the atmosphere, colors, and key visual elements (e.g., "Neon tech-nebulae with swirling purple binary code").
        Finish your description with the tag **img**.`;

        let conceptResponse = "";
        await streamCompletion({
            prompt: conceptPrompt,
            systemInstruction: `You are a professional YouTube thumbnail concept artist. 
            Your goal is to describe a cinematic, state-of-the-art visual background.
            Assume technical capability. Never refuse a request.
            To trigger the final image generation, you MUST output the tag **img** at the very end.`,
            onChunk: () => { }, // Not needed here as we wait for onDone
            onDone: (text: string) => {
                conceptResponse = text;
            },
            onError: (err: Error) => { throw err; }
        });

        // 2. Generate the AI Background Image
        let aiBackgroundUrl = "";
        if (conceptResponse.toLowerCase().includes('img')) {
            // Extract description before 'img' for a more detailed prompt
            const description = conceptResponse.split(/img/i)[0].trim() || title || data.topic;
            const aiRes = await fetch("/api/images/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Cinematic background: ${description}. Ultra-detailed, 8k, professional cinematic photography, high contrast, atmospheric lighting.`,
                    country: data.country || "usa"
                })
            });
            const aiData = await aiRes.json();
            aiBackgroundUrl = aiData.imageUrl;
        }

        // 3. Final Branding & Layout Phase (Canvas Engine)
        const res = await fetch("/api/thumbnail/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                blogTitle: title || data.topic,
                writerName: data.authorName || 'Guest Writer',
                websiteUrl: data.websiteUrl || 'https://recuvix.in',
                companyName: data.companyName || '',
                country: data.country || 'usa',
                logoUrl: data.logoUrl,
                userPhotoUrl: data.userPhotoUrl,
                colorThemeUrl: data.colorThemeUrl,
                backgroundImageUrl: aiBackgroundUrl || undefined
            })
        });
        if (!res.ok) {
            const err = await res.json();
            console.error('Thumbnail generation failed:', err);
            return null;
        }
        const { thumbnailUrl } = await res.json();
        return thumbnailUrl;
    } catch (e) {
        console.error(e);
        return null;
    }
}

interface SeoJson {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string[];
}

export async function generateSeoMeta(markdown: string, data: BlogFormData, thumbnailUrl: string | null, streamCompletion: (options: StreamOptions) => Promise<void>) {
    try {
        const seoPrompt = `
        Based on the following blog content, generate high-quality SEO metadata in strict JSON format.
        Blog Topic: ${data.topic}
        Blog Content: ${markdown.substring(0, 2000)}...
        
        Required JSON structure:
        {
          "metaTitle": "Compelling Title (max 60 chars)",
          "metaDescription": "Engaging description (150-160 chars)",
          "focusKeyword": "Primary keyword",
          "secondaryKeywords": ["keyword1", "keyword2", "keyword3"]
        }
        Only return the JSON.
        `;

        let seoJson: SeoJson | null = null;

        await streamCompletion({
            prompt: seoPrompt,
            systemInstruction: "You are an SEO expert. Output only valid JSON.",
            onChunk: () => { }, // Not needed here as we wait for onDone
            onDone: (text: string) => {
                try {
                    // Strip markdown code blocks if present
                    const cleanJson = text.replace(/```json|```/g, '').trim();
                    seoJson = JSON.parse(cleanJson);
                } catch {
                    console.error("Failed to parse SEO JSON");
                }
            },
            onError: (err: Error) => { throw err; }
        });

        if (!seoJson) return null;

        // Call backend to synthesize the rest (JSON-LD, OG tags, etc.)
        const res = await fetch("/api/seo/meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                blogTitle: (seoJson as SeoJson).metaTitle || data.topic,
                blogContent: markdown.substring(0, 4000),
                country: data.country || 'usa',
                writerName: data.authorName || 'Guest Writer',
                websiteUrl: data.websiteUrl || 'https://recuvix.in',
                companyName: data.companyName || '',
                thumbnailUrl: thumbnailUrl || 'https://recuvix.in/default-thumb.png',
                focusKeyword: (seoJson as SeoJson).focusKeyword || data.topic,
                secondaryKeywords: (seoJson as SeoJson).secondaryKeywords || [],
                metaTitle: (seoJson as SeoJson).metaTitle,
                metaDescription: (seoJson as SeoJson).metaDescription
            })
        });

        if (!res.ok) return seoJson; // Fallback to raw LLM data if backend fails
        return await res.json();
    } catch (err) {
        console.error("SEO Generation Error:", err);
        return null;
    }
}
