import DocsLayout from '@/components/docs/DocsLayout';
import ParamTable from '@/components/docs/ParamTable';
import Tabs from '@/components/docs/Tabs';
import Tab from '@/components/docs/Tab';
import CodeBlock from '@/components/docs/CodeBlock';

export default function BlogGenerationPage() {
    return (
        <DocsLayout
            title="Blog Generation"
            description="Learn how Recuvix generates complete, long-form, SEO-optimized blog posts from a single topic input."
        >
            <section>
                <h2>How it works</h2>
                <p>
                    Recuvix uses advanced multi-agent workflows to research, outline, write, and optimize every blog post. Every generated blog undergoes a 7-step process:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <CheckItem text="Semantic research of the topic" />
                    <CheckItem text="SEO competitor analysis" />
                    <CheckItem text="H1-H4 structured outlining" />
                    <CheckItem text="Humanized content writing" />
                    <CheckItem text="JSON-LD Schema injection" />
                    <CheckItem text="AI image & thumbnail creation" />
                    <CheckItem text="Focus keyword optimization" />
                </ul>
            </section>

            <section className="mt-12">
                <h2>Input parameters</h2>
                <ParamTable params={[
                    {
                        name: "topic",
                        type: "string",
                        required: true,
                        description: "The primary topic or title for the blog. Minimum 5 characters."
                    },
                    {
                        name: "country",
                        type: "string",
                        required: true,
                        description: "Target country for local SEO. e.g. 'India', 'USA', 'UK'."
                    },
                    {
                        name: "tone",
                        type: "enum",
                        required: false,
                        description: "Writing tone. 'Professional', 'Conversational', 'Journalistic'.",
                        default: "Professional"
                    },
                    {
                        name: "wordCount",
                        type: "number",
                        required: false,
                        description: "Target word count. Range: 300 to 5000.",
                        default: "1500"
                    },
                    {
                        name: "outputFormat",
                        type: "enum",
                        required: false,
                        description: "File format for the result. 'html' | 'md' | 'xml'.",
                        default: "html"
                    },
                ]} />
            </section>

            <section className="mt-12">
                <h2>Output formats</h2>
                <Tabs items={['HTML', 'Markdown', 'XML (WordPress)']}>
                    <Tab>
                        <p className="text-sm text-[#999] mb-4">
                            Full HTML document with inline CSS and responsive design. Ready to be pasted into any custom CMS or static site generator.
                        </p>
                        <CodeBlock language="html" filename="blog.html">
                            {`<!DOCTYPE html>
<html lang="en">
<head>
  <title>How to Rank for Digital Marketing in India | Recuvix</title>
  <meta name="description" content="Discover the best SEO strategies..." />
  <script type="application/ld+json">
    {"@context": "https://schema.org", "@type": "Article", ...}
  </script>
</head>
<body>
  <article>...</article>
</body>
</html>`}
                        </CodeBlock>
                    </Tab>
                    <Tab>
                        <p className="text-sm text-[#999] mb-4">
                            Clean Markdown with YAML frontmatter. Compatible with Ghost, Notion, Dev.to, and Hashnode.
                        </p>
                        <CodeBlock language="markdown" filename="blog.md">
                            {`---
title: How to Rank for Digital Marketing in India
slug: rank-digital-marketing-india
description: Meta description here
focus_keyword: digital marketing india
date: 2026-03-17
thumbnail: https://cdn.cloudinary.com/...
---

# How to Rank for Digital Marketing in India
Content starts here...`}
                        </CodeBlock>
                    </Tab>
                    <Tab>
                        <p className="text-sm text-[#999] mb-4">
                            WordPress eXtended RSS (WXR) format. Includes SEO meta fields compatible with Yoast SEO and RankMath.
                        </p>
                        <CodeBlock language="xml" filename="blog.xml">
                            {`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Your Blog Title</title>
      <content:encoded><![CDATA[...]]></content:encoded>
      <wp:postmeta>
        <wp:meta_key>_yoast_wpseo_title</wp:meta_key>
        <wp:meta_value>SEO Title</wp:meta_value>
      </wp:postmeta>
    </item>
  </channel>
</rss>`}
                        </CodeBlock>
                    </Tab>
                </Tabs>
            </section>
        </DocsLayout>
    );
}

function CheckItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-2 p-3 rounded-lg bg-[#0d0d0d] border border-[#111] text-xs text-[#999]">
            <span className="text-[#e8ff47]">✓</span>
            {text}
        </li>
    );
}
