import { SeoMetaResponse } from '../types';
import { generateSlug } from '../utils/slugGenerator';
import { getLocaleData } from '../utils/countryLocaleMap';

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
    companyName?: string;
    thumbnailUrl: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    metaTitle?: string;
    metaDescription?: string;
}): SeoMetaResponse {
    const slug = generateSlug(data.blogTitle);
    const localeData = getLocaleData(data.country);

    // Clean URL making sure no double slashes
    const baseUrl = data.websiteUrl.endsWith('/') ? data.websiteUrl.slice(0, -1) : data.websiteUrl;
    const canonicalUrl = `${baseUrl}/${slug}`;

    // Prefer LLM generated title, fallback to blogTitle
    let title = data.metaTitle || data.blogTitle;
    if (title.length > 60) title = title.substring(0, 57) + '...';

    // Prefer LLM generated description, fallback to template
    let description = data.metaDescription;
    if (!description) {
        const baseDesc = `Learn all about ${data.focusKeyword} in our latest guide: ${data.blogTitle}. `;
        const cta = 'Read now!';
        description = baseDesc + cta;
    }
    if (description.length > 160) {
        description = description.substring(0, 157) + '...';
    }

    const brandName = data.companyName || data.websiteUrl.replace(/https?:\/\//, '').split('/')[0];

    const openGraph = {
        'og:title': title,
        'og:description': description,
        'og:image': data.thumbnailUrl,
        'og:url': canonicalUrl,
        'og:type': 'article',
        'og:locale': localeData.locale,
        'og:site_name': brandName,
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
            name: brandName,
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
