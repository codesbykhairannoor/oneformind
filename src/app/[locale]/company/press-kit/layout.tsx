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
    path: '/company/press-kit',
    title: 'Press Kit — Media Assets & Brand Guidelines',
    description: 'Download official Tranvas brand logos, product screenshots, founder bios, and press media assets.',
  });
}

export default function CompanyPressKitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
