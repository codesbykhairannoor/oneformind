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
    path: '/solutions/career-accelerator',
    title: isId ? "Akselerator Karir: Pipeline Lamaran & Skill Mastery" : "Career Accelerator: Job Pipeline & Skill Mastery OS",
    description: isId ? "Percepat langkah karir Anda dengan menyatukan papan Kanban lamaran kerja, persiapan wawancara, jadwal belajar, dan target karir." : "Land top roles faster by unifying your job application Kanban, interview prep sprints, daily study habits, and career milestones.",
  });
}

export default async function CareerAcceleratorSolutionLayout({
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
    { name: isId ? "Akselerator Karir" : "Career Accelerator", url: isId ? '/id/solutions/career-accelerator' : '/solutions/career-accelerator' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
