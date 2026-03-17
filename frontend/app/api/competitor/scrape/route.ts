import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { validateCompetitorUrl } from '@/lib/competitor/urlSafetyValidator';
import { scrapeRequestSchema } from '@/lib/validators/competitorSchemas';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = scrapeRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: result.error.format()
            }, { status: 400 });
        }

        const { url } = result.data;

        // 1. SSRF Protection & Domain Validation
        const validation = validateCompetitorUrl(url);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.reason }, { status: 400 });
        }

        // 2. Fetch the URL
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; Recuvix/1.0; +https://recuvix.in/bot)',
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                signal: controller.signal,
                redirect: 'follow',
            });

            clearTimeout(timeout);

            if (!response.ok) {
                if (response.status === 404) {
                    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
                }
                if (response.status === 403) {
                    return NextResponse.json({ error: 'Site blocked analysis (403 Forbidden)' }, { status: 403 });
                }
                return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: 502 });
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('text/html')) {
                return NextResponse.json({ error: 'URL does not point to a web page' }, { status: 422 });
            }

            const html = await response.text();

            // 3. Parse HTML
            const $ = cheerio.load(html);

            // 4. Extract Data
            const title = $('title').text().trim() ||
                $('meta[property="og:title"]').attr('content') || '';

            const metaDescription = $('meta[name="description"]').attr('content') ||
                $('meta[property="og:description"]').attr('content') || '';

            const h1 = $('h1').first().text().trim();

            const h2s = $('h2').map((_, el) => $(el).text().trim()).get()
                .filter(t => t.length > 2);

            const h3s = $('h3').map((_, el) => $(el).text().trim()).get()
                .filter(t => t.length > 2);

            const publishDate = $('meta[property="article:published_time"]').attr('content') ||
                $('time[datetime]').attr('datetime') ||
                $('[class*="date"], [class*="publish"]').first().text().trim() || null;

            const author = $('meta[name="author"]').attr('content') ||
                $('[rel="author"]').first().text().trim() ||
                $('[class*="author"]').first().text().trim() || null;

            const hasSchemaMarkup = $('script[type="application/ld+json"]').length > 0;

            const schemaTypes: string[] = [];
            $('script[type="application/ld+json"]').each((_, el) => {
                try {
                    const data = JSON.parse($(el).html() || '{}');
                    if (data['@type']) {
                        if (Array.isArray(data['@type'])) {
                            schemaTypes.push(...data['@type']);
                        } else {
                            schemaTypes.push(data['@type']);
                        }
                    }
                } catch { }
            });

            const imageCount = $('img').length;

            const domain = validation.url.hostname;
            const internalLinks = $('a[href]').filter((_, el) => {
                const href = $(el).attr('href');
                return !!href && (href.startsWith('/') || href.includes(domain));
            }).length;

            const externalLinks = $('a[href]').filter((_, el) => {
                const href = $(el).attr('href');
                return !!href && href.startsWith('http') && !href.includes(domain);
            }).length;

            const hasFaq = hasSchemaMarkup && schemaTypes.includes('FAQPage') ||
                $('h2, h3').filter((_, el) => {
                    const text = $(el).text().toLowerCase();
                    return text.includes('faq') || text.includes('frequently asked') || text.includes('common questions');
                }).length > 0;

            const hasTable = $('table').length > 0;
            const hasVideo = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0;
            const hasCodeBlock = $('pre, code').length > 0;

            // 5. Clean & Extract Content Text
            const $clean = cheerio.load(html);
            $clean('script, style, nav, header, footer, aside, [class*="sidebar"], [class*="menu"], [class*="ad"], [id*="sidebar"], [id*="menu"], [id*="ad"]').remove();

            const rawText = $clean('body').text();
            const contentText = rawText
                .replace(/\s+/g, ' ')
                .replace(/\n+/g, ' ')
                .trim()
                .slice(0, 15000);

            const wordCount = contentText.split(/\s+/).filter(Boolean).length;
            const readingTimeMinutes = Math.ceil(wordCount / 200);
            const paragraphCount = $('p').length;

            return NextResponse.json({
                data: {
                    url,
                    title,
                    metaDescription,
                    h1,
                    h2s,
                    h3s,
                    wordCount,
                    paragraphCount,
                    imageCount,
                    internalLinks,
                    externalLinks,
                    hasSchemaMarkup,
                    schemaTypes: Array.from(new Set(schemaTypes)),
                    publishDate,
                    author,
                    contentText,
                    readingTimeMinutes,
                    hasFaq,
                    hasTable,
                    hasVideo,
                    hasCodeBlock,
                    scrapedAt: new Date().toISOString(),
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const fetchError = error as any;
            if (fetchError.name === 'AbortError') {
                return NextResponse.json({ error: 'Timeout fetching URL' }, { status: 408 });
            }
            throw fetchError;
        }

    } catch (err: unknown) {
        const error = err as any;
        console.error('Scrape error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
