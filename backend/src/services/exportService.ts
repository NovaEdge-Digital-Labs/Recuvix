import { z } from 'zod';
import { exportSchema } from '../validators/exportSchemas';

type ExportOptions = z.infer<typeof exportSchema>;

export function generateExportContent(options: ExportOptions): string {
  switch (options.outputFormat) {
    case 'html':
      return generateHtmlExport(options);
    case 'md':
      return generateMarkdownExport(options);
    case 'xml':
      return generateXmlExport(options);
    default:
      throw new Error('Unsupported format');
  }
}

function generateHtmlExport(options: ExportOptions): string {
  const { blogHtml, seoMeta, thumbnailUrl } = options;

  return `<!DOCTYPE html>
<html lang="${seoMeta.hreflang?.split('-')[0] || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${seoMeta.htmlMetaTags}
  <style>
    /* CSS Reset & Basic Styling */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #111; }
    h2 { font-size: 1.8rem; margin: 2rem 0 1rem; color: #222; }
    h3 { font-size: 1.4rem; margin: 1.5rem 0 0.8rem; }
    p { margin-bottom: 1.2rem; }
    ul, ol { margin-bottom: 1.2rem; padding-left: 2rem; }
    .hero-image { width: 100%; object-fit: cover; aspect-ratio: 1200/630; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <img src="${thumbnailUrl}" alt="${seoMeta.metaTitle}" class="hero-image" />
  <main>
    ${blogHtml}
  </main>
</body>
</html>`;
}

function generateMarkdownExport(options: ExportOptions): string {
  const { blogMarkdown, seoMeta, thumbnailUrl, blogTitle, writerName } = options;

  const frontmatter = `---
title: "${blogTitle.replace(/"/g, '\\"')}"
slug: "${seoMeta.slug}"
description: "${seoMeta.metaDescription.replace(/"/g, '\\"')}"
focus_keyword: "${seoMeta.focusKeyword}"
keywords: [${seoMeta.secondaryKeywords.map(k => `"${k}"`).join(', ')}]
author: "${writerName}"
date: "${new Date().toISOString()}"
thumbnail: "${thumbnailUrl}"
---

`;

  return frontmatter + `![${blogTitle}](${thumbnailUrl})\n\n` + blogMarkdown;
}

function generateXmlExport(options: ExportOptions): string {
  const { blogHtml, seoMeta, blogTitle, writerName } = options;
  const pubDate = new Date().toUTCString();

  // WordPress eXtended RSS (WXR)
  // Wrapping html in CDATA
  const cdataContent = `<![CDATA[${blogHtml}]]>`;
  const cdataTitle = `<![CDATA[${blogTitle}]]>`;

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>Exported Blog Post</title>
  <pubDate>${pubDate}</pubDate>
  <language>en</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <item>
    <title>${cdataTitle}</title>
    <link>http://localhost/${seoMeta.slug}</link>
    <pubDate>${pubDate}</pubDate>
    <dc:creator><![CDATA[${writerName}]]></dc:creator>
    <description></description>
    <content:encoded>${cdataContent}</content:encoded>
    <wp:post_name>${seoMeta.slug}</wp:post_name>
    <wp:status>draft</wp:status>
    <wp:post_type>post</wp:post_type>
    
    <!-- Yoast SEO specific meta values -->
    <wp:postmeta>
      <wp:meta_key><![CDATA[_yoast_wpseo_title]]></wp:meta_key>
      <wp:meta_value><![CDATA[${seoMeta.metaTitle}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_yoast_wpseo_metadesc]]></wp:meta_key>
      <wp:meta_value><![CDATA[${seoMeta.metaDescription}]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_yoast_wpseo_focuskw]]></wp:meta_key>
      <wp:meta_value><![CDATA[${seoMeta.focusKeyword}]]></wp:meta_value>
    </wp:postmeta>
  </item>
</channel>
</rss>`;
}
