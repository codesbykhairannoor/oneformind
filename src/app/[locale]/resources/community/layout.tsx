import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';
  return constructPageMetadata({
    locale,
    path: '/resources/community',
    title: isId ? "Komunitas Tranvas: Produktivitas & Habit Builders" : "Tranvas Community: Builders, Creators & Focus Hub",
    description: isId ? "Bergabung dengan komunitas individu ambisius yang membangun konsistensi habit 28 hari, kejelasan finansial, dan fokus deep work." : "Connect with ambitious individuals building 28-day habit streaks, financial clarity, and calm deep work systems inside Tranvas.",
  });
}

export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === 'id';
  const breadcrumbs = [
    { name: 'Home', url: isId ? '/id' : '/' },
    { name: isId ? "Komunitas" : "Community", url: isId ? '/id/resources/community' : '/resources/community' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
