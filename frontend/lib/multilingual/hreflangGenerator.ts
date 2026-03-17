export interface HreflangVersion {
    languageCode: string;
    hreflang: string;
}

export interface HreflangGeneratorInput {
    versions: HreflangVersion[];
    baseUrl: string;
    slug: string;
}

export function generateHreflangHtml(input: HreflangGeneratorInput): string {
    const { versions, baseUrl, slug } = input;

    const links = versions.map((v) => {
        const url = v.languageCode === "en"
            ? `${baseUrl}/blog/${slug}`
            : `${baseUrl}/${v.languageCode}/blog/${slug}`;

        return `<link rel="alternate" hreflang="${v.hreflang}" href="${url}" />`;
    });

    // Add x-default (usually English)
    const defaultUrl = `${baseUrl}/blog/${slug}`;
    links.unshift(`<link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);

    return links.join("\n");
}

export function generateHreflangJson(input: HreflangGeneratorInput): Record<string, string> {
    const { versions, baseUrl, slug } = input;
    const result: Record<string, string> = {};

    result["x-default"] = `${baseUrl}/blog/${slug}`;

    versions.forEach((v) => {
        const url = v.languageCode === "en"
            ? `${baseUrl}/blog/${slug}`
            : `${baseUrl}/${v.languageCode}/blog/${slug}`;
        result[v.hreflang] = url;
    });

    return result;
}
