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
    path: '/features/job',
    title: isId ? "Career Pipeline & Tracker Lamaran Kerja Kanban" : "Career Kanban & Job Application Pipeline Tracker",
    description: isId ? "Pantau lamaran kerja, jadwal wawancara, follow-up rekruter, dan penawaran gaji dalam papan Kanban terstruktur di Tranvas." : "Track job applications, interview stages, recruiter follow-ups, and salary offers in a structured Kanban pipeline connected to your daily goals.",
  });
}

export default async function JobFeatureLayout({
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
    { name: isId ? "Career Pipeline" : "Career Pipeline", url: isId ? '/id/features/job' : '/features/job' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
