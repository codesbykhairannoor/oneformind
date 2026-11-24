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
    path: '/features/habit',
    title: isId ? "Habit Tracker 28 Hari & Heatmap Streak Atomik" : "28-Day Atomic Habit Tracker & Streak Heatmap App",
    description: isId ? "Bangun kebiasaan konsisten dengan habit matrix 28 hari, heatmap ala GitHub, jadwal fleksibel, dan analitik streak harian di Tranvas." : "Build lasting daily routines with Tranvas 28-day habit matrix, GitHub-style consistency heatmap, flexible scheduling, and streak analytics.",
  });
}

export default async function HabitFeatureLayout({
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
    { name: isId ? "Habit Tracker" : "Habit Tracker", url: isId ? '/id/features/habit' : '/features/habit' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
