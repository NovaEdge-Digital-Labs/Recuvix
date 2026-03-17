import { BulkTopic } from "@/lib/validators/bulkSchemas";
import { generateSlug } from "@/lib/utils/slugGenerator";

export async function buildBulkZip(topics: BulkTopic[]): Promise<Blob> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // 1. Root files
    const completedTopics = topics.filter(t => t.status === "complete");

    // Create Summary CSV
    let csvContent = "position,title,slug,focus_keyword,word_count,generated_at,duration_seconds\n";
    completedTopics.forEach(t => {
        const slug = generateSlug(t.topic);
        csvContent += `${t.position},"${t.topic.replace(/"/g, '""')}",${slug},"${(t.focusKeyword || "").replace(/"/g, '""')}",${t.blogMarkdown.split(/\s+/).length},${t.completedAt},${t.durationSeconds}\n`;
    });
    zip.file("summary.csv", csvContent);

    // Create Root index.html
    const indexHtml = buildIndexHtml(completedTopics);
    zip.file("index.html", indexHtml);

    // 2. Blog folders
    for (const topic of completedTopics) {
        const slug = generateSlug(topic.topic);
        const folderName = `blog-${String(topic.position).padStart(2, '0')}-${slug}`;
        const folder = zip.folder(folderName);

        if (folder) {
            folder.file("blog.html", wrapInFullHtml(topic.blogHtml, topic.topic, topic.seoMeta));
            folder.file("blog.md", topic.blogMarkdown);
            // folder.file("blog.xml", topic.blogXml); // Add if implemented

            if (topic.seoMeta) {
                folder.file("seo-meta.json", JSON.stringify(topic.seoMeta, null, 2));
            }

            // In a real browser environment, we might need to fetch the thumbnail and add it
            // For now we'll just add the URL in the meta
        }
    }

    return await zip.generateAsync({ type: "blob" });
}

function buildIndexHtml(topics: BulkTopic[]): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuvix Bulk Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 40px; }
        .container { max-width: 1000px; mx-auto: auto; }
        h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; color: #e8ff47; }
        .stats { color: #888; margin-bottom: 40px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .card { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; transition: border-color 0.2s; }
        .card:hover { border-color: #e8ff47; }
        .card-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; display: block; color: #fff; text-decoration: none; }
        .card-meta { font-size: 12px; color: #666; display: flex; gap: 12px; margin-bottom: 16px; }
        .btn-group { display: flex; gap: 8px; }
        .btn { font-size: 12px; padding: 6px 12px; border-radius: 6px; background: #333; color: #fff; text-decoration: none; font-weight: 600; }
        .btn:hover { background: #444; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Recuvix Bulk Export</h1>
        <div class="stats">
            Generated on ${new Date().toLocaleDateString()} &middot; ${topics.length} Blogs &middot; ${topics.reduce((acc, t) => acc + (t.blogMarkdown.split(/\s+/).length), 0)} Words
        </div>
        <div class="grid">
            ${topics.map(t => {
        const slug = generateSlug(t.topic);
        const folderName = `blog-${String(t.position).padStart(2, '0')}-${slug}`;
        return `
                <div class="card">
                    <a href="${folderName}/blog.html" class="card-title">${t.topic}</a>
                    <div class="card-meta">
                        <span>${t.blogMarkdown.split(/\s+/).length} words</span>
                        <span>${t.focusKeyword || 'No keyword'}</span>
                    </div>
                    <div class="btn-group">
                        <a href="${folderName}/blog.html" class="btn">HTML</a>
                        <a href="${folderName}/blog.md" class="btn">MD</a>
                    </div>
                </div>
                `;
    }).join('')}
        </div>
    </div>
</body>
</html>
    `;
}

function wrapInFullHtml(content: string, title: string, seoMeta: Record<string, unknown> | null): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${seoMeta?.metaTitle || title}</title>
    <meta name="description" content="${seoMeta?.metaDescription || ''}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        h2 { font-size: 1.8rem; margin-top: 2rem; }
        img { max-width: 100%; height: auto; border-radius: 8px; margin: 2rem 0; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { font-family: monospace; }
    </style>
</head>
<body>
    <article>
        ${content}
    </article>
</body>
</html>
    `;
}
