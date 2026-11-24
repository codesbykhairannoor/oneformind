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
    path: '/resources/guide',
    title: isId ? "Panduan Pengguna & Quickstart Tranvas Life OS" : "Tranvas Life OS User Guide & Quickstart Handbook",
    description: isId ? "Panduan langkah demi langkah menguasai Tranvas dalam 10 menit: time-blocking, habit 28 hari, budgeting zero-based, dan WOOP goals." : "Step-by-step handbook to master Tranvas in 10 minutes: daily time-blocking, 28-day habits, zero-based budgets, and WOOP goal cascading.",
  });
}

export default async function GuideLayout({
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
    { name: isId ? "Panduan" : "User Guide", url: isId ? '/id/resources/guide' : '/resources/guide' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
