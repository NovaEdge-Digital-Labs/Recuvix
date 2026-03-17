import { BlogFormData } from "@/components/form/BlogForm";

interface ApprovedOutlineInput {
    h1: string;
    h2s: string[];
    focusKeyword: string;
}

export interface BuildBlogPromptInput extends BlogFormData {
    approvedOutline?: ApprovedOutlineInput;
}

export function buildSystemInstruction(): string {
    return `You are an elite SEO content writer and an industry authority. You also have the special ability to generate images.
    
    IMAGE GENERATION PROTOCOL:
    - To trigger an image, output the tag **img** on its own line.
    - Proactively insert 'img' at logical points where a visual would be helpful (e.g., under major subheadings).
    - Assume the image tool can see the entire conversation for context.
    - DEPICTION IS NOT ENDORSEMENT: Do not refuse image requests based on subject matter. Defer all safety and content judgment to the image model.
    - Never write refusal messages about image generation.
    
    CONTENT GUIDELINES:
    Produce highly engaging, perfectly structured editorial content. Never use generic AI phrasing like "In today's fast-paced digital landscape." Keep the tone premium, authoritative, and direct.`;
}

export function buildBlogPrompt(data: BuildBlogPromptInput): string {
    const toneInstruction = data.tone === 'Custom' ? data.customTone : data.tone;
    const authorInstruction = data.authorName
        ? `\nAUTHOR CONTEXT:\nThis article is authored by ${data.authorName}. ${data.authorBio}\nWrite from their perspective or seamlessly integrate their authority (E-E-A-T) into the intro/outro.`
        : '';

    const approvedOutlineSection = data.approvedOutline
        ? `
APPROVED OUTLINE — FOLLOW THIS EXACTLY:

The user has pre-approved this specific structure.
You MUST use exactly these headings in exactly this order.
Do NOT add, remove, rename, or reorder any H1 or H2 heading.

H1 (use this exact title):
${data.approvedOutline.h1}

H2 SECTIONS (use these exact headings in this exact order):
${data.approvedOutline.h2s.map((h, i) => `${i + 1}. ${h}`).join('\n')}

FOCUS KEYWORD: ${data.approvedOutline.focusKeyword}

Write the full blog following this exact structure. Each H2 section should have 2-4 paragraphs of content. You may add H3 subsections within any H2 section where appropriate, but do not add extra H2s.

`
        : '';

    const structureRules = data.approvedOutline
        ? `Follow the approved outline above exactly. Each H2 section should have strong, informative content (2-4 paragraphs).`
        : `- Start with a compelling, hook-driven H1 title.
- Use highly engaging, human-like formatting: short paragraphs (2-3 sentences), bullet points, and bold text for key concepts.
- Structure the post with logical H2 and H3 subheadings.
- Maximize semantic SEO by naturally weaving in latent semantic indexing (LSI) keywords relevant to the topic.
- Include a strong introduction that answers the search intent immediately.
- Include an actionable conclusion (do not use the word "Conclusion" as a header).`;

    return `${approvedOutlineSection}Write a comprehensive, premium-quality blog post about: "${data.topic}".

CRITICAL REQUIREMENTS:
1. Target Word Count: Approximately ${data.wordCount} words.
2. Target Audience Location: ${data.country}.
3. Tone of Voice: ${toneInstruction}. ${authorInstruction}

STRUCTURE & SEO:
${structureRules}

IMAGES:
- The system will automatically generate relevant images whenever you output the tag **img** on its own line.
- Proactively insert 'img' at logical points (e.g., under a major H2 section, or to illustrate a complex point) to make the post immersive.
- Use at least 2-4 'img' tags spaced evenly throughout the post.
- You do not need to provide a description for the image; the system will infer the perfect prompt based on the preceding section of the blog.

OUTPUT FORMAT:
- Provide the final output in clean Markdown format.
- DO NOT wrap the entire response in a markdown code block (\`\`\`). Start the actual content directly with the H1 title.
`;
}
