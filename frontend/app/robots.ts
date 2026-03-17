import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/app/',
                    '/generating',
                    '/results',
                    '/history',
                    '/profile',
                    '/workspace',
                    '/workspaces',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };

}
