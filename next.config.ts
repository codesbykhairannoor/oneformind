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

    // Vercel Hobby Plan: no custom headers needed (handled by CDN)
    // But add security headers for marketing pages
    async headers() {
        return [
            {
                // Cache static marketing pages for 5 minutes on CDN (stale-while-revalidate 60s)
                source: '/:locale(en|id)/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=300, stale-while-revalidate=60',
                    },
                ],
                // Only for non-authenticated marketing routes
            },
            {
                // Never cache authenticated routes
                source: '/:locale(en|id)/(dashboard|habits|finance|planner|goals|journal|coach|calendar|jobs|study|settings|billing|profile|payment|verify-email|confirm-password|reset-password|forgot-password)/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'private, no-cache, no-store',
                    },
                ],
            },
        ];
    },
};
 
export default withNextIntl(nextConfig);

