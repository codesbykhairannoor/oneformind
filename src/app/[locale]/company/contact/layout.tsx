import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructPageMetadata({
    locale,
    path: '/contact',
    title: 'Contact Us — Support & Inquiries',
    description: 'Connect directly with our customer experience team for support, feature feedback, and partnership opportunities.',
  });
}

export default function CompanyContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
