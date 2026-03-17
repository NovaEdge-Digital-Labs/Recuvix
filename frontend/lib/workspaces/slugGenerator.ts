export function generateWorkspaceSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except hyphen and space
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '')        // Trim hyphens from ends
        .slice(0, 50);                // Max length 50
}

export async function ensureUniqueSlug(
    baseSlug: string,
    supabase: any
): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const { data } = await supabase
            .from('workspaces')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (!data) return slug;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}
