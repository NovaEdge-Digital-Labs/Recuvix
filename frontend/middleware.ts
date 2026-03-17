import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Tenant config cached per-request in header
const TENANT_HEADER = 'x-recuvix-tenant';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host')?.split(':')[0] || '';
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'recuvix.in';

    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // ─── MAINTENANCE MODE ─────────────────────
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    const { pathname } = request.nextUrl;

    if (isMaintenanceMode && pathname !== '/maintenance' && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
    }


    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    request.cookies.set(name, value);
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    request.cookies.set(name, '');
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh session if expired
    const { data: { user } } = await supabase.auth.getUser();

    // ─── TENANT DETECTION ─────────────────────
    let tenantConfig = null;

    const hostParts = hostname.split('.');
    const isSubdomain = hostParts.length > (baseDomain.split('.').length) &&
        !hostname.startsWith('www.') &&
        !hostname.startsWith('admin.');

    const isMainDomain =
        hostname === baseDomain ||
        hostname === 'www.' + baseDomain ||
        hostname === 'localhost' ||
        hostname.endsWith('.localhost') ||
        hostname === '127.0.0.1';

    if (isSubdomain || !isMainDomain) {
        // Look up tenant from slug (if on subdomain) or custom_domain
        let tenantSlug = null;
        if (isSubdomain) {
            tenantSlug = hostParts[0];
        }

        const query = supabase
            .from('wl_tenants')
            .select('id, slug, name, logo_url, favicon_url, colors, fonts, features, status, custom_domain');

        const { data } = tenantSlug
            ? await query.eq('slug', tenantSlug).single()
            : await query.eq('custom_domain', hostname).single();

        if (data) {
            tenantConfig = data;
        } else if (isSubdomain) {
            // Subdomain exists but no tenant found in DB
            return NextResponse.redirect(new URL('https://' + baseDomain + '/not-found', request.url));
        }
    }

    // ─── SUSPENDED TENANT ─────────────────────
    if (tenantConfig && (tenantConfig.status === 'suspended' || tenantConfig.status === 'pending')) {
        return NextResponse.rewrite(new URL('/tenant-unavailable', request.url));
    }

    // ─── FEATURE FLAG CHECK ───────────────────
    if (tenantConfig && pathname !== '/') {
        const featureRouteMap: Record<string, string> = {
            '/multilingual': 'multilingual',
            '/bulk': 'bulk_generation',
            '/voice': 'voice_studio',
            '/competitor': 'competitor_analyzer',
            '/research': 'keyword_research',
            '/repurpose': 'repurpose',
            '/linking': 'internal_linking',
            '/calendar': 'content_calendar',
            '/tracker': 'tracker',
        };

        const feature = Object.entries(featureRouteMap)
            .find(([route]) => pathname.startsWith(route))?.[1];

        const features = tenantConfig.features as Record<string, boolean>;
        if (feature && features[feature] === false) {
            return NextResponse.redirect(new URL('/?feature_disabled=1', request.url));
        }
    }

    // ─── INJECT TENANT INTO HEADERS ───────────
    const requestHeaders = new Headers(request.headers);
    if (tenantConfig) {
        const colors = tenantConfig.colors as any;
        const fonts = tenantConfig.fonts as any;
        const features = tenantConfig.features as any;

        requestHeaders.set(
            TENANT_HEADER,
            JSON.stringify({
                id: tenantConfig.id,
                slug: tenantConfig.slug,
                name: tenantConfig.name,
                colors: {
                    primary: colors.primary || '#e8ff47',
                    secondary: colors.secondary || '#111111',
                    background: colors.background || '#0a0a0a',
                    text: colors.text || '#f5f5f5',
                    card: colors.card || '#111111',
                    border: colors.border || '#27272a',
                },
                fonts: {
                    heading: fonts.heading || 'Syne',
                    body: fonts.body || 'DM Sans',
                },
                logoUrl: tenantConfig.logo_url,
                faviconUrl: tenantConfig.favicon_url,
                features: features,
            })
        );
    }

    // ─── AUTH ROUTING ─────────────────────────
    const protectedRoutes = [
        '/results', '/tracker', '/research',
        '/competitor', '/multilingual', '/bulk',
        '/history', '/profile', '/workspace',
        '/workspaces', '/repurpose', '/linking',
        '/calendar', '/voice', '/app'
    ];

    const isProtected = protectedRoutes.some(
        r => pathname === r || pathname.startsWith(r + '/')
    );

    if (isProtected && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Master Admin protection
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // If on tenant domain, we'll handle tenant admin later
        // For now, only main domain admin is master
        if (isMainDomain) {
            const adminKey = request.cookies.get('admin_key')?.value;
            if (adminKey !== process.env.ADMIN_SECRET_KEY) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }
    }

    response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/|public/).*)',
    ],
};
