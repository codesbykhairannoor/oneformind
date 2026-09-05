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
    path: '/resources/guide',
    title: 'User Guide — Master the Tranvas Life OS',
    description: 'Comprehensive guides, tutorials, and walkthroughs to help you get the most out of Tranvas modules and advanced features.',
  });
}

export default function GuideResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
