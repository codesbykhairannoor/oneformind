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
    path: '/solutions/second-brain',
    title: isId ? "Second Brain Aktif: Tangkap Ide, Jurnal & Eksekusi" : "Actionable Second Brain: Capture, Journal & Execute",
    description: isId ? "Ubah ide menjadi eksekusi nyata—gabungkan catatan refleksi Markdown, modul belajar, dan jadwal tindakan harian di Tranvas." : "Turn captured ideas into real daily execution—combine Markdown reflections, study notes, and time-blocked action items in Tranvas.",
  });
}

export default async function SecondBrainSolutionLayout({
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
    { name: isId ? "Second Brain" : "Second Brain", url: isId ? '/id/solutions/second-brain' : '/solutions/second-brain' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
