export type RepurposeFormat =
    | 'linkedin'
    | 'twitter'
    | 'email'
    | 'youtube'
    | 'instagram'
    | 'facebook'
    | 'whatsapp'
    | 'pinterest';

export interface RepurposeParams {
    blogTitle: string;
    blogPlainText: string;
    focusKeyword: string;
    country: string;
    authorName?: string;
    websiteUrl?: string;
    instagramHandle?: string;
    twitterHandle?: string;
    tone?: string;
    wordCount: number;
    customInstruction?: string;
}

export function buildRepurposePrompt(
    format: RepurposeFormat,
    params: RepurposeParams
): string {
    const {
        blogTitle,
        blogPlainText,
        focusKeyword,
        country,
        authorName,
        websiteUrl,
        instagramHandle,
        twitterHandle,
        wordCount,
        customInstruction,
    } = params;

    const author = authorName || 'the author';
    const content = blogPlainText.slice(0, 5000);
    const additionalInstruction = customInstruction
        ? `\nADDITIONAL INSTRUCTION: ${customInstruction}`
        : '';

    switch (format) {
        case 'linkedin':
            return `
You are an expert LinkedIn content writer who specialises in high-performing posts that get thousands of impressions.

BLOG TITLE: ${blogTitle}
FOCUS KEYWORD: ${focusKeyword}
COUNTRY: ${country}
AUTHOR: ${author}

BLOG CONTENT:
${content}

Write a LinkedIn post based on this blog.

RULES:
1. First 2 lines MUST be a compelling hook that makes people click "see more". Use one of:
   - A bold contrarian statement
   - A surprising statistic
   - A provocative question
   - A personal story opening
2. Total length: 1200-1900 characters
3. Use line breaks between paragraphs
4. Include 3-5 bullet points using ●
5. End with 1 clear question to drive comments
6. Add 3-5 hashtags at the very end
7. NO EMOJIS anywhere
8. Write in first person as ${author}
9. Professional but not corporate-speak
10. Do NOT start with "I" as the first word
${additionalInstruction}

Return ONLY the LinkedIn post text.
No explanations, no quotes around it.
`.trim();

        case 'twitter':
            const threadLength = Math.min(15, Math.max(8, Math.floor(wordCount / 200)));
            return `
You are an expert Twitter/X content creator who writes threads that go viral.

BLOG TITLE: ${blogTitle}
FOCUS KEYWORD: ${focusKeyword}
COUNTRY: ${country}

BLOG CONTENT:
${content}

Write a Twitter/X thread based on this blog.

RULES:
1. Thread length: ${threadLength} tweets
2. Each tweet MAX 270 characters (leave buffer)
3. Tweet 1: The hook. A bold claim, question, or stat. NO hashtags in tweet 1. No "🧵 thread"
4. Tweets 2 to N-2: Numbered like "2/" at start. Each tweet = one clear insight or tip. End each with natural flow to next.
5. Second-to-last tweet: "Here's the summary:" + 3 bullet points
6. Last tweet: CTA to read full blog + 2-3 relevant hashtags ${twitterHandle ? '+ ' + twitterHandle : ''}
7. NO EMOJIS anywhere in the thread
8. Each tweet must work standalone

Return the tweets separated by "---" between each.
Start each tweet directly with its content.
Example format:
Most people get SEO wrong. Here's what actually works in ${country}:

---

2/ The first mistake is targeting keywords...
${additionalInstruction}
`.trim();

        case 'email':
            return `
You are an expert email copywriter who writes newsletters people actually read.

BLOG TITLE: ${blogTitle}
FOCUS KEYWORD: ${focusKeyword}
COUNTRY: ${country}
AUTHOR: ${author}
WEBSITE: ${websiteUrl || 'our website'}

BLOG CONTENT:
${content}

Write a complete email newsletter HTML template.

OUTPUT FORMAT:
Return a JSON object with these exact fields:
{
  "subject": "email subject line (40-60 chars)",
  "preheader": "preview text (85-100 chars)",
  "html": "complete HTML email with inline CSS",
  "textVersion": "plain text version"
}

HTML EMAIL REQUIREMENTS:
1. Max width: 600px, centered
2. White background (#ffffff)
3. ALL CSS must be inline (no <style> tags)
4. Use HTML tables for layout (not flexbox/grid)
5. Email-safe fonts: Arial, Helvetica, sans-serif
6. Colors: body text #333333, headings #111111, accent #2563eb (a readable blue)
7. Structure:
   - Header: blog title as H1 with subtle top border
   - Intro: 1 personal paragraph from the author
   - 3-4 key sections (H2 + 2-3 sentences each)
   - Highlight box: one key quote or stat (background #f8f9fa, border-left 4px solid accent)
   - CTA button: "Read Full Article →" (background accent, white text, padding 12px 24px) href="[BLOG_URL_PLACEHOLDER]"
   - Footer: simple text with unsubscribe link "You're receiving this because you subscribed. [Unsubscribe]" (gray, 12px)
8. Mobile responsive: add meta viewport and @media queries for text sizing ONLY

SUBJECT LINE RULES:
- Create curiosity without clickbait
- Include a number if possible
- Under 60 chars

NO EMOJIS in the email body.
${additionalInstruction}

Return ONLY the JSON object. No other text.
`.trim();

        case 'youtube':
            const estDuration = Math.round(wordCount / 200);
            const targetWords = Math.round(wordCount * 0.6);
            return `
You are a professional YouTube scriptwriter who creates engaging educational videos.

BLOG TITLE: ${blogTitle}
TARGET COUNTRY: ${country}
ESTIMATED DURATION: ${estDuration} minutes
AUTHOR: ${author}

BLOG CONTENT:
${content}

Write a complete YouTube video script.

FORMAT RULES:
1. Start each section with a timestamp label: [INTRO - 0:00], [SECTION NAME - 0:45] etc
2. Stage directions in [SQUARE BRACKETS]: [SHOW: diagram], [B-ROLL: office footage], [PAUSE for effect]
3. Write in natural spoken language:
   - Use contractions (you'll, it's, we're)
   - Short sentences
   - "you" not "viewers" or "readers"
4. Transition phrases between sections: "Now that we've covered X, let's talk about Y"
5. Add [B-ROLL SUGGESTION: ...] lines throughout for video editors
6. Outro must include:
   "If you found this helpful, subscribe for more [TOPIC] content."
   "Link to read the full article is in the description."

SCRIPT LENGTH: ~${targetWords} words (spoken word is ~70% of written word count)

NO EMOJIS. Write the spoken words naturally.
${additionalInstruction}

Return ONLY the script. No JSON. No explanations.
`.trim();

        case 'instagram':
            return `
You are an Instagram content expert who writes captions that get saves and shares.

BLOG TITLE: ${blogTitle}
FOCUS KEYWORD: ${focusKeyword}
COUNTRY: ${country}
AUTHOR HANDLE: ${instagramHandle || '@yourbrand'}

BLOG CONTENT:
${blogPlainText.slice(0, 3000)}

Write an Instagram caption.

STRUCTURE:
1. First line (CRITICAL): Strong hook under 125 chars
   This is what shows before "more" button.
   Make it impossible not to click.
   Options: bold statement, curiosity gap, relatable pain point, surprising fact
2. Body: 2-4 short paragraphs, value-packed. Each paragraph max 2-3 sentences. Empty line between paragraphs
3. CTA line: "Save this post for later" or "Share with someone who needs to see this"
4. Empty line
5. Hashtags: exactly 20 hashtags. Mix: 5 large (1M+), 10 medium (50K-500K), 5 small/niche (1K-50K). All relevant to ${focusKeyword} and ${country}

TOTAL: under 2200 characters including hashtags

NO EMOJIS in the main caption body.
You may use emojis ONLY in the hashtag section.
${additionalInstruction}

Return ONLY the caption text with hashtags.
`.trim();

        case 'facebook':
            return `
You are a Facebook content strategist who writes posts that generate genuine engagement.

BLOG TITLE: ${blogTitle}
COUNTRY: ${country}
AUTHOR: ${author}

BLOG CONTENT:
${blogPlainText.slice(0, 3000)}

Write a Facebook post based on this blog.

CHOOSE the best format for this content:
A) Question format: Start with a question, give value, end with engagement question
B) Story format: Personal anecdote related to the blog topic, then key insights
C) List format: "X things about [topic]:" 3-5 punchy points, end with question

RULES:
1. Length: 150-300 words (optimal organic reach)
2. Conversational, warm tone
3. Write like you're talking to a friend
4. End with ONE engaging question
5. Add 2-3 hashtags at end only
6. NO EMOJIS
7. No corporate language
${additionalInstruction}

Return ONLY the Facebook post text.
`.trim();

        case 'whatsapp':
            return `
Write a WhatsApp broadcast message based on this blog.

BLOG TITLE: ${blogTitle}
AUTHOR: ${authorName || 'Us'}
COUNTRY: ${country}

BLOG CONTENT:
${blogPlainText.slice(0, 2000)}

RULES:
1. Start: "Hi there 👋" (one emoji allowed here)
2. One sentence hook about what they'll learn
3. Exactly 3 bullet points (key takeaways). Use • before each bullet
4. One line: "Full article here: [BLOG_LINK]"
5. Sign off: "- ${authorName || 'The Team'}"
6. TOTAL: under 400 characters
7. Plain text only (no markdown, no HTML)
8. Conversational, mobile-friendly
${additionalInstruction}

Return ONLY the WhatsApp message text.
`.trim();

        case 'pinterest':
            return `
Write Pinterest content for this blog post.

BLOG TITLE: ${blogTitle}
FOCUS KEYWORD: ${focusKeyword}
COUNTRY: ${country}

BLOG CONTENT:
${blogPlainText.slice(0, 2000)}

Return a JSON object with:
{
  "pinTitle": "Pin title (max 100 chars, keyword-rich, starts with strong action word or benefit)",
  "description": "Pin description (400-500 chars, natural language, weave in ${focusKeyword} and 3-4 related keywords naturally, end with soft CTA like 'Save for later' or 'Try this today', NO hashtags)"
}

PINTEREST SEO RULES:
- Keywords go in description naturally
- No hashtags (Pinterest is search-based)
- Aspirational/inspirational tone
- Focus on the transformation or benefit
- Target: someone searching to SOLVE a problem

Return ONLY the JSON. No other text.
${additionalInstruction}
`.trim();

        default:
            return '';
    }
}
