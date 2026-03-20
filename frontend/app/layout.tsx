import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Outfit, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { headers } from 'next/headers';
import { buildGoogleFontsUrl } from '@/lib/wl/googleFontsBuilder';
import { TenantProvider, TenantConfig } from '@/context/TenantContext';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://recuvix.in'),
  title: {
    default: 'Recuvix — AI Blog Generation',
    template: '%s | Recuvix',
  },
  description: 'Generate fully humanized, SEO-optimized blog posts in 3 minutes. Images, thumbnails, and meta tags included.',
  keywords: ['AI blog writer', 'SEO blog generator', 'blog writing tool india', 'AI content creation'],
  authors: [{ name: 'Recuvix' }],
  creator: 'Recuvix Technologies',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://recuvix.in',
    siteName: 'Recuvix',
    title: 'Recuvix — AI Blog Generation',
    description: 'Generate SEO-optimized blogs in 3 minutes.',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Recuvix — AI Blog Generation',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recuvix — AI Blog Generation',
    description: 'Generate SEO blogs in 3 minutes',
    images: ['/og-image.png'],
    creator: '@recuvix',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import CookieBanner from "@/components/CookieBanner";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const tenantHeader = headersList.get('x-recuvix-tenant');
  let tenant: TenantConfig | null = null;
  try {
    tenant = tenantHeader ? JSON.parse(tenantHeader) : null;
  } catch (e) {
    console.error('Failed to parse tenant header:', e);
  }

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Recuvix',
    url: 'https://recuvix.in',
    logo: 'https://recuvix.in/logo.png',
    sameAs: [
      'https://twitter.com/recuvix',
      'https://linkedin.com/company/recuvix',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn(syne.variable, bebasNeue.variable, playfair.variable, dmSans.variable, jetbrainsMono.variable, outfit.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.target && e.target.tagName === 'IMG') {
                  e.stopImmediatePropagation();
                }
              }, true);
            `,
          }}
        />
        {tenant && (
          <>
            <title>{tenant.name}</title>
            <link rel="icon" href={tenant.faviconUrl || "/favicon.ico"} />
            {(tenant.fonts.heading !== 'Syne' || tenant.fonts.body !== 'DM Sans') && (

              <link
                href={buildGoogleFontsUrl(tenant.fonts.heading, tenant.fonts.body)}
                rel="stylesheet"
              />
            )}
            <style>{`
              :root {
                --color-accent: ${tenant.colors.primary};
                --color-surface: ${tenant.colors.secondary};
                --color-background: ${tenant.colors.background};
                --color-text: ${tenant.colors.text};
                --card: ${tenant.colors.card};
                --border: ${tenant.colors.border};
                --font-heading: '${tenant.fonts.heading}', var(--font-syne), sans-serif;
                --font-body: '${tenant.fonts.body}', var(--font-dm-sans), sans-serif;
              }
            `}</style>
          </>
        )}
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground min-h-screen">
        <TenantProvider tenant={tenant}>
          <AuthProvider>
            <WorkspaceProvider>
              <AppProvider>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster
                  position="bottom-right"
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: '#0d0d0d',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0f0f0',
                      fontFamily: 'Outfit, sans-serif',
                    },
                    classNames: {
                      success: 'toast-success',
                      error: 'toast-error',
                      warning: 'toast-warning',
                    },
                  }}
                />
                <Suspense fallback={null}>
                  <CookieBanner />
                </Suspense>
              </AppProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
