import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    // Standalone is required for Docker/Coolify, but must be undefined on Vercel to prevent .next/next-server.js.nft.json ENOENT crash
    output: process.env.VERCEL ? undefined : 'standalone',

    // Enable React Compiler for automatic memoization
    reactCompiler: true,

    // Enable gzip/brotli compression for all responses
    compress: true,

    // Remove X-Powered-By header to reduce response size & hide stack info
    poweredByHeader: false,

    // Enable Turbopack for development (10x faster builds)
    turbopack: {},

    // Enable Next.js Image Optimization (uses Vercel's built-in CDN + WebP/AVIF)
    // Removed `unoptimized: true` so images get resized, cached, and served as WebP
    images: {
        formats: ['image/avif', 'image/webp'],
        // Allow caching images for 1 day on CDN
        minimumCacheTTL: 86400,
    },

    // Optimize heavy package imports (tree-shake only used icons/modules)
    experimental: {
        optimizePackageImports: ['chart.js', 'react-chartjs-2', 'sweetalert2', 'lucide-react', '@supabase/supabase-js'],
    },

    // HTTP Cache Headers — tuned for Cloudflare CDN
    async headers() {
        return [
            {
                // Public images/icons in /public
                source: '/images/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
                ],
            },
            {
                // Root English & Indonesian landing pages: edge cache 1 hour, serve stale up to 1 day + Vary: Accept for Markdown negotiation
                source: '/',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vary', value: 'Accept' },
                ],
            },
            {
                source: '/id',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vary', value: 'Accept' },
                ],
            },
            {
                // Marketing/public pages (English/default): edge cache 1 hour, serve stale up to 1 day
                source: '/:path(features|solutions|resources|pricing|compare|about|contact|blog|changelog|security|company|affiliates)/:subpath*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vary', value: 'Accept' },
                ],
            },
            {
                // Marketing/public pages (Indonesian /id prefix): edge cache 1 hour, serve stale up to 1 day
                source: '/id/:path(features|solutions|resources|pricing|compare|about|contact|blog|changelog|security|company|affiliates)/:subpath*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vercel-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                    { key: 'Vary', value: 'Accept' },
                ],
            },
            {
                // API routes: NEVER cache (always private, always fresh)
                source: '/api/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'private, no-store, no-cache' },
                    { key: 'Pragma', value: 'no-cache' },
                ],
            },
            {
                // All authenticated dashboard routes: never cache
                source: '/:locale(en|id)/(dashboard|habits|finance|planner|goals|journal|coach|calendar|jobs|study|settings|billing|profile|payment|verify-email|confirm-password|reset-password|forgot-password)/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'private, no-store, no-cache' },
                    { key: 'Pragma', value: 'no-cache' },
                ],
            },
            {
                // Security headers for all pages (OWASP Secure Headers & rfc-st/humble A+ baseline)
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
                    { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.paypal.com https://www.sandbox.paypal.com https://app.lemonsqueezy.com https://static.cloudflareinsights.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' data: https://fonts.gstatic.com",
                            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://api.lemonsqueezy.com https://passport.duitku.com https://sandbox.duitku.com https://cloudflareinsights.com",
                            "frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://app.lemonsqueezy.com https://passport.duitku.com https://sandbox.duitku.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self' https://accounts.google.com https://*.supabase.co",
                            "frame-ancestors 'none'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);
