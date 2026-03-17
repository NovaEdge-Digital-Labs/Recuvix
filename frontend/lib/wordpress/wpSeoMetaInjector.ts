/**
 * Builds meta object for Yoast SEO plugin
 */
export function buildYoastMeta(params: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    slug: string;
}): Record<string, string> {
    return {
        _yoast_wpseo_title: params.metaTitle,
        _yoast_wpseo_metadesc: params.metaDescription,
        _yoast_wpseo_focuskw: params.focusKeyword,
        _yoast_wpseo_canonical: "",
        "_yoast_wpseo_meta-robots-noindex": "0",
        "_yoast_wpseo_meta-robots-nofollow": "0",
    };
}

/**
 * Builds meta object for RankMath SEO plugin
 */
export function buildRankMathMeta(params: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
}): Record<string, string> {
    return {
        rank_math_title: params.metaTitle,
        rank_math_description: params.metaDescription,
        rank_math_focus_keyword: params.focusKeyword,
        rank_math_robots: '["index","follow"]',
    };
}
