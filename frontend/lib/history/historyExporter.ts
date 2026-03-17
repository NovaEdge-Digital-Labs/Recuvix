import JSZip from 'jszip';

/**
 * Exporter for bundling blogs into a ZIP file.
 */
export const historyExporter = {
  /**
   * Export all provided blogs as a single ZIP.
   */
  async exportToZip(blogs: Array<{
    title: string;
    slug: string;
    html: string;
    markdown: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
  }>, filename: string = `recuvix-export-${new Date().toISOString().split('T')[0]}.zip`) {
    const zip = new JSZip();

    // Add a summary file
    const summary = blogs.map(b => ({
      title: b.title,
      slug: b.slug,
      wordCount: b.markdown.split(/\s+/).length
    }));
    zip.file("summary.json", JSON.stringify(summary, null, 2));

    // Create an index.html for easy browsing
    const indexHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recuvix Export History</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; background: #0f172a; color: white; }
          .blog-item { margin-bottom: 2rem; border-bottom: 1px solid #334155; padding-bottom: 1rem; }
          a { color: #e8ff47; text-decoration: none; }
          a:hover { text-underline-offset: 4px; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Blog Library Export</h1>
        <p>Exported on: ${new Date().toLocaleString()}</p>
        <div class="blog-list">
          ${blogs.map(b => `
            <div class="blog-item">
              <h2>${b.title}</h2>
              <p>
                <a href="${b.slug}/${b.slug}.html">View HTML</a> | 
                <a href="${b.slug}/${b.slug}.md">View Markdown</a>
              </p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
    zip.file("index.html", indexHtml);

    // Add each blog in its own folder
    for (const blog of blogs) {
      const folder = zip.folder(blog.slug);
      if (folder) {
        folder.file(`${blog.slug}.html`, blog.html);
        folder.file(`${blog.slug}.md`, blog.markdown);
        folder.file(`seo-meta.json`, JSON.stringify(blog.meta, null, 2));
      }
    }

    const content = await zip.generateAsync({ type: "blob" });

    // Using simple browser download if file-saver not available
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
