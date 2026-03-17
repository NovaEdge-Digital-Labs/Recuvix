export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price: number;
    priceInPaise: number;
    features: string[];
    popular?: boolean;
    badge?: string | null;
}

export const creditPacks: CreditPack[] = [
    {
        id: 'starter',
        name: 'Starter Pack',
        credits: 10,
        price: 499,
        priceInPaise: 49900,
        features: [
            '10 AI-generated blogs',
            'All output formats included',
            'SEO meta pack per blog',
            'Thumbnails included',
            'Credits never expire',
        ],
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro Pack',
        credits: 50,
        price: 1999,
        priceInPaise: 199900,
        badge: 'Most Popular',
        features: [
            '50 AI-generated blogs',
            'All output formats included',
            'Full SEO meta pack',
            'Thumbnails included',
            'Priority generation queue',
            'Credits never expire',
        ],
        popular: true,
    },
    {
        id: 'agency',
        name: 'Agency Pack',
        credits: 200,
        price: 5999,
        priceInPaise: 599900,
        badge: 'Best for Agencies',
        features: [
            '200 AI-generated blogs',
            'All output formats included',
            'Full SEO meta pack',
            'Thumbnails included',
            'Bulk generation support',
            'Multilingual generation',
            'Credits never expire',
        ],
        popular: false,
    },
    {
        id: 'mega',
        name: 'Mega Pack',
        credits: 500,
        price: 11999,
        priceInPaise: 1199900,
        badge: 'Maximum Value',
        features: [
            '500 AI-generated blogs',
            'All output formats included',
            'Full SEO meta pack + thumbnails',
            'Bulk + multilingual generation',
            'Credits never expire',
            'Dedicated support',
        ],
        popular: false,
    },
]

export const CREDIT_PACKS = creditPacks; // For backward compatibility if needed
export type CreditPackId = 'starter' | 'pro' | 'agency' | 'mega';
