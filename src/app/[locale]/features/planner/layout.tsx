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
    path: '/features/planner',
    title: isId ? "Daily Planner Time-Blocking & Matriks Eisenhower" : "Time-Blocked Daily Planner & Eisenhower Matrix",
    description: isId ? "Atasi jadwal padat dengan Daily Planner Tranvas: time-blocking harian, Matriks Eisenhower, 3 tugas utama, dan fokus deep work." : "Eliminate overwhelm with Tranvas Daily Planner: time-blocking, Eisenhower Matrix prioritization, 3 Most Important Tasks, and deep work focus.",
  });
}

export default async function PlannerFeatureLayout({
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
    { name: isId ? "Daily Planner" : "Daily Planner", url: isId ? '/id/features/planner' : '/features/planner' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
