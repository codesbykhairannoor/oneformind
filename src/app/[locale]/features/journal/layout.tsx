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
    path: '/features/journal',
    title: isId ? "Jurnal Refleksi Markdown, Mood & Gratitude Harian" : "Mindful Markdown Journal, Mood & Reflection Hub",
    description: isId ? "Bangun kejernihan pikiran dengan jurnal Markdown bebas distraksi, pencatatan mood harian, gratitude, dan evaluasi mingguan." : "Build mental clarity with distraction-free Markdown journaling, daily mood check-ins, gratitude prompts, and weekly self-reflection reviews.",
  });
}

export default async function JournalFeatureLayout({
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
    { name: isId ? 'Fitur' : 'Features', url: isId ? '/id/features' : '/features' },
    { name: isId ? "Mindful Journal" : "Mindful Journal", url: isId ? '/id/features/journal' : '/features/journal' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
