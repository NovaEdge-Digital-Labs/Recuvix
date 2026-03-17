import JSZip from "jszip";
import { LanguageConfig } from "../config/languageConfig";

interface VersionData {
    language: LanguageConfig;
    blogHtml: string;
    blogMarkdown: string;
    seoMeta: Record<string, unknown>;
}

interface ZipPackagerInput {
    versions: VersionData[];
    hreflangHtml: string;
    hreflangJson: Record<string, unknown>;
    topic: string;
}

export async function packageMultilingualZip(input: ZipPackagerInput): Promise<Blob> {
    const zip = new JSZip();
    const { versions, hreflangHtml, hreflangJson } = input;

    // 1. Create language folders
    versions.forEach((v) => {
        const folder = zip.folder(v.language.code);
        if (folder) {
            folder.file("blog.html", v.blogHtml);
            folder.file("blog.md", v.blogMarkdown);
            folder.file("seo-meta.json", JSON.stringify(v.seoMeta, null, 2));
        }
    });

    // 2. Add root files
    zip.file("hreflang.html", hreflangHtml);
    zip.file("hreflang.json", JSON.stringify(hreflangJson, null, 2));

    // 3. Create summary CSV
    let csvContent = "Language,Words,Focus Keyword,Meta Title\n";
    versions.forEach((v) => {
        const wordCount = v.blogMarkdown.split(/\s+/).length;
        const focusKeyword = v.seoMeta?.focusKeyword || "";
        const metaTitle = v.seoMeta?.metaTitle || "";
        csvContent += `"${v.language.name}","${wordCount}","${focusKeyword}","${metaTitle}"\n`;
    });
    zip.file("summary.csv", csvContent);

    // 4. Generate the ZIP blob
    return await zip.generateAsync({ type: "blob" });
}
