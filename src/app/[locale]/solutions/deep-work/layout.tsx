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
    path: '/solutions/deep-work',
    title: isId ? "Sistem Deep Work: Blok Fokus 90 Menit & Flow State" : "Deep Work System: 90-Minute Focus & Flow State",
    description: isId ? "Hentikan context switching, lindungi blok fokus 90 menit, dan capai flow state maksimal dengan sistem time-blocking Tranvas." : "Eliminate context switching, protect 90-minute ultradian focus blocks, and achieve peak flow state with Tranvas time-blocking tools.",
  });
}

export default async function DeepWorkSolutionLayout({
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
    { name: isId ? "Solusi Deep Work" : "Deep Work Solution", url: isId ? '/id/solutions/deep-work' : '/solutions/deep-work' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
