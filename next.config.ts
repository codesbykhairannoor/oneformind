import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
 
const withNextIntl = createNextIntlPlugin();
 
const nextConfig: NextConfig = {
    // Required for Docker deployment
    output: 'standalone',

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
        optimizePackageImports: ['chart.js', 'react-chartjs-2', 'sweetalert2'],
    },

    // HTTP Cache Headers — tuned for Cloudflare CDN
    async headers() {
        return [
            {
                // Next.js static chunks: browser + CDN cache 1 year (content-hashed, immutable)
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                    { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                // Public images/icons in /public
                source: '/images/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
                ],
            },
            {
                // Marketing/public pages: edge cache 1 hour, serve stale up to 1 day
                source: '/:locale(en|id)/(|resources|pricing|compare|about|blog|changelog|security)/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
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
                // Security headers for all pages
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
        ];
    },
};
 
export default withNextIntl(nextConfig);

