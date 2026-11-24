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
    path: '/features/goal',
    title: isId ? "Goal Tracker WOOP & Pemecahan Milestone Terukur" : "WOOP Goal Tracker & Quarterly Milestone Cascading",
    description: isId ? "Ubah visi tahunan menjadi milestone mingguan dengan kerangka sains WOOP yang terhubung langsung ke tugas dan habit harian." : "Turn ambitious annual visions into weekly milestones using the science-backed WOOP framework linked directly to your daily tasks and habits.",
  });
}

export default async function GoalFeatureLayout({
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
    { name: isId ? "Goal Tracker" : "Goal Tracker", url: isId ? '/id/features/goal' : '/features/goal' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
