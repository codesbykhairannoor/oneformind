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
    path: '/solutions/mental-clarity',
    title: isId ? "Sistem Mental Clarity: Jurnal Refleksi & Ketenangan" : "Mental Clarity System: Mindful Journaling & Calm",
    description: isId ? "Redakan kelelahan mental dengan ritual shutdown sore, jurnal refleksi, pelacakan mood, dan perencanaan prioritas tenang." : "Clear cognitive clutter with evening shutdown rituals, gratitude journaling, mood tracking, and calm priority planning.",
  });
}

export default async function MentalClaritySolutionLayout({
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
    { name: isId ? "Mental Clarity" : "Mental Clarity", url: isId ? '/id/solutions/mental-clarity' : '/solutions/mental-clarity' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
