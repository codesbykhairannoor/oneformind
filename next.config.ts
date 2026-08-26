import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    images: {
        unoptimized: true
    }
};
 
export default withNextIntl(nextConfig);
