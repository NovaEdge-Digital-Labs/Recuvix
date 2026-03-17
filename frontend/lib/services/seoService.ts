import { SeoMetaResponse } from '@/lib/types';
import { generateSlug } from '@/lib/utils/slugGenerator';
import { getLocaleData } from '@/lib/utils/countryLocaleMap';

// Utility to create the HTML meta string
function buildHtmlMetaString(meta: Omit<SeoMetaResponse, 'htmlMetaTags'>): string {
    let html = `
    <title>${meta.metaTitle}</title>
    <meta name="description" content="${meta.metaDescription}" />
    <meta name="keywords" content="${[meta.focusKeyword, ...meta.secondaryKeywords].join(', ')}" />
  `;

    if (meta.hreflang) {
        html += `\n    <link rel="alternate" hreflang="${meta.hreflang}" href="${meta.openGraph['og:url']}" />`;
        html += `\n    <link rel="alternate" hreflang="x-default" href="${meta.openGraph['og:url']}" />`;
    }

    // Open Graph
    for (const [key, value] of Object.entries(meta.openGraph)) {
        html += `\n    <meta property="${key}" content="${value}" />`;
    }

    // Twitter
    for (const [key, value] of Object.entries(meta.twitterCard)) {
        html += `\n    <meta name="${key}" content="${value}" />`;
    }

    // JSON-LD
    html += `\n    <script type="application/ld+json">\n${JSON.stringify(meta.jsonLd, null, 2)}\n    </script>`;

    return html.trim();
}

export function generateSeoMeta(data: {
    blogTitle: string;
    blogContent: string;
    country: string;
    writerName: string;
    websiteUrl: string;
    thumbnailUrl: string;
    focusKeyword: string;
    secondaryKeywords: string[];
}): SeoMetaResponse {
    const slug = generateSlug(data.blogTitle);
    const localeData = getLocaleData(data.country);

    // Clean URL making sure no double slashes
    const baseUrl = data.websiteUrl.endsWith('/') ? data.websiteUrl.slice(0, -1) : data.websiteUrl;
    const canonicalUrl = `${baseUrl}/${slug}`;

    // Title max 60 chars. Let's just use the blog title directly, bounded.
    const title = data.blogTitle.length > 60 ? data.blogTitle.substring(0, 57) + '...' : data.blogTitle;

    // Truncate description from content (or we could extract first paragraph).
    // Usually the LLM provides an intro.
    // Instead, the prompt says "Meta description: 150-160 chars, include focus keyword, ends with a soft CTA like 'Learn more' or 'Read now'".
    // We don't have an LLM here, so we'll synthesize it from the title + keyword + CTA.
    const baseDesc = `Learn all about ${data.focusKeyword} in our latest guide: ${data.blogTitle}. `;
    const cta = 'Read now!';
    let description = baseDesc + cta;
    if (description.length > 160) {
        description = description.substring(0, 157) + '...';
    }

    const openGraph = {
        'og:title': title,
        'og:description': description,
        'og:image': data.thumbnailUrl,
        'og:url': canonicalUrl,
        'og:type': 'article',
        'og:locale': localeData.locale,
        'og:site_name': data.websiteUrl.replace(/https?:\/\//, ''),
    };

    const twitterCard = {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': data.thumbnailUrl,
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        image: [data.thumbnailUrl],
        author: {
            '@type': 'Person',
            name: data.writerName,
        },
        publisher: {
            '@type': 'Organization',
            name: data.websiteUrl,
            // Ideally logo goes here, but we don't strictly have access to the logo URL at this exact moment from the request unless passed
            logo: {
                '@type': 'ImageObject',
                url: data.thumbnailUrl // Fallback
            }
        },
        datePublished: new Date().toISOString(),
        description: description,
        inLanguage: localeData.locale,
        keywords: [data.focusKeyword, ...data.secondaryKeywords].join(', '),
    };

    const hreflang = data.country.toLowerCase() !== 'usa' ? localeData.hreflang : undefined;

    const resultBase = {
        slug,
        metaTitle: title,
        metaDescription: description,
        focusKeyword: data.focusKeyword,
        secondaryKeywords: data.secondaryKeywords,
        openGraph,
        twitterCard,
        jsonLd,
        hreflang,
    };

    return {
        ...resultBase,
        htmlMetaTags: buildHtmlMetaString(resultBase),
    };
}
