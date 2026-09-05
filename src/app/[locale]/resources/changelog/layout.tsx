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
    path: '/resources/changelog',
    title: 'Changelog — What is New in Tranvas',
    description: 'Stay updated on new features, product improvements, bug fixes, and performance upgrades released in the Tranvas ecosystem.',
  });
}

export default function ChangelogResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
