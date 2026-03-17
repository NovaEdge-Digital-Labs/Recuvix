import { LanguageConfig } from "../config/languageConfig";

interface LocalizedPromptInput {
    topic: string;
    language: LanguageConfig;
    country: string;
    tone: string;
    wordCount: number;
    focusKeyword?: string;
    secondaryKeywords?: string[];
    approvedOutline?: {
        h1: string;
        h2s: string[];
        focusKeyword: string;
    };
    authorDetails?: {
        name: string;
        website: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
        xHandle?: string;
    };
}

export function buildLocalizedBlogPrompt(input: LocalizedPromptInput): string {
    const {
        topic,
        language,
        country,
        tone,
        wordCount,
        focusKeyword,
        secondaryKeywords,
        approvedOutline,
        authorDetails,
    } = input;

    const keywordInstruction = focusKeyword
        ? `FOCUS KEYWORD (in ${language.nativeName}): 
  Write this keyword naturally in ${language.nativeName} — 
  do not transliterate, use the native-language equivalent 
  that people actually search for in ${language.primaryCountry}`
        : "";

    const secondaryKeywordsInstruction =
        secondaryKeywords && secondaryKeywords.length > 0
            ? `SECONDARY TOPICS: ${secondaryKeywords.join(", ")}`
            : "";

    const outlineSection = approvedOutline
        ? `
"APPROVED STRUCTURE — USE EXACTLY:
H1: ${approvedOutline.h1}
Note: Translate/adapt this title naturally into 
${language.nativeName}. Keep the SEO intent but make it 
sound native, not translated.

H2 SECTIONS (translate naturally, keep the same order):
${approvedOutline.h2s.map((h, i) => `${i + 1}. ${h}`).join("\n")}
Note: Each H2 must be translated to natural ${language.nativeName},
not word-for-word — adapt phrasing to sound native."`
        : `
"STRUCTURE REQUIREMENTS:
- H1: Compelling native-language title with the localized 
  focus keyword near the start
- 5-8 H2 sections depending on word count
- Each section 2-4 paragraphs
- One comparison table (use local brands/examples)
- One numbered or bulleted list
- FAQ section at the end (4-5 questions people actually 
  search for in ${language.primaryCountry})"`;

    const seoRequirements =
        ["zh", "ja", "ko"].includes(language.code)
            ? `- Title max ${language.seo.titleMaxChars} characters
   - Meta description max ${language.seo.descMaxChars} characters
   - For CJK languages: shorter paragraphs (3-4 sentences max)
   - Natural keyword density 2-3% for ${language.code === "zh" ? "Baidu" : "Google"} optimization`
            : `- Title max ${language.seo.titleMaxChars} characters
   - Meta description max ${language.seo.descMaxChars} characters
   - Natural keyword density 1-2%`;

    const authorBio = authorDetails?.name
        ? `
"AUTHOR BIO (in ${language.nativeName}, at end after FAQ):
Writer: ${authorDetails.name}
${authorDetails.website ? `Website: ${authorDetails.website}` : ""}
${authorDetails.instagram ? `Instagram: ${authorDetails.instagram}` : ""}
${authorDetails.facebook ? `Facebook: ${authorDetails.facebook}` : ""}
${authorDetails.youtube ? `YouTube: ${authorDetails.youtube}` : ""}
${authorDetails.xHandle ? `X (Twitter): ${authorDetails.xHandle}` : ""}
Format as <div class='author-bio'>"`
        : "";

    return `
You are an expert content writer and SEO specialist who is a
NATIVE ${language.nativeName} speaker. You write naturally in
${language.nativeName} the way educated professionals in
${language.primaryCountry} write — not translated, but native.

TASK: Write a complete, SEO-optimized blog post in
${language.nativeName} on the following topic.

TOPIC: ${topic}
LANGUAGE: ${language.nativeName} (${language.code})
TARGET MARKET: ${country} (${language.primaryCountry})
TONE: ${tone}
TARGET LENGTH: approximately ${wordCount} words
${keywordInstruction}
${secondaryKeywordsInstruction}

LANGUAGE-SPECIFIC WRITING INSTRUCTIONS:
${language.writingInstructions}

LOCAL MARKET CONTEXT:
Currency: ${language.localContext.currency} 
  (${language.localContext.currencySymbol})
Date format: ${language.localContext.dateFormat}
Key local brands to reference where natural: 
  ${language.localContext.exampleBrands.join(", ")}
Primary search engine(s): 
  ${language.localContext.searchEngines.join(", ")}

${outlineSection}

SEO REQUIREMENTS FOR ${language.name.toUpperCase()}:
${seoRequirements}

- All keywords must appear naturally — never stuffed
- Use semantic/LSI keywords in ${language.nativeName}
- Do not include keywords from other languages
- All dates, currencies, measurements in local format

CRITICAL RULES:
1. Write ENTIRELY in ${language.nativeName} — no mixing
   with English or other languages (technical terms in 
   ${language.nativeName} or widely accepted English tech 
   terms are the only exceptions)
2. NO EMOJIS anywhere in the blog
3. Cultural context must be specific to ${language.primaryCountry}
   — use examples, statistics, and brands from that market
4. Do not translate — generate natively
5. The blog must read as if written by a native expert,
   not produced by translation software

IMAGE PLACEHOLDERS: At every 2-3 H2 sections, insert:
[BLOGIMAGE: descriptive alt text in ${language.nativeName}]
Include 3-4 image placeholders total.

${authorBio}

OUTPUT FORMAT: Return ONLY clean HTML. No markdown.
No code fences. No explanation.
Start with <style> tag containing inline CSS.
Then <article> containing the full blog.
End with </article>.

CSS: Same requirements as master blog prompt but add:
- font-family: ${language.fontStack}
- For RTL languages: direction: rtl; text-align: right;
  on the article element
- For CJK: line-height: 1.9 (CJK needs more line spacing)
  font-size: 16px (slightly larger for readability)

BEGIN WRITING THE COMPLETE BLOG IN 
${language.nativeName.toUpperCase()} NOW.
`;
}
