import { wpRequest } from "./wpApiClient";
import { WPTag } from "./wpTypes";

/**
 * Finds or creates tags in WordPress and returns their IDs.
 */
export async function getOrCreateTagIds(params: {
    siteUrl: string;
    username: string;
    appPassword: string;
    tags: string[];
}): Promise<number[]> {
    const { tags, ...auth } = params;
    const tagIds: number[] = [];

    for (const tagName of tags) {
        try {
            // 1. Try to find existing tag
            const existingTags = await wpRequest<WPTag[]>({
                ...auth,
                endpoint: `/wp-json/wp/v2/tags?search=${encodeURIComponent(tagName)}`,
                method: "GET",
            });

            // Find exact match since search is fuzzy
            const exactMatch = existingTags.find(
                (t) => t.name.toLowerCase() === tagName.toLowerCase()
            );

            if (exactMatch) {
                tagIds.push(exactMatch.id);
                continue;
            }

            // 2. Create it if not found
            const newTag = await wpRequest<WPTag>({
                ...auth,
                endpoint: "/wp-json/wp/v2/tags",
                method: "POST",
                body: {
                    name: tagName,
                    // slugify simple version
                    slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                },
            });

            tagIds.push(newTag.id);
        } catch (err) {
            console.error(`Failed to handle tag "${tagName}":`, err);
            // Continue with other tags even if one fails
        }
    }

    return tagIds;
}
