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
    path: '/features/calendar',
    title: isId ? "Smart Calendar Terpadu untuk Tugas, Habit & Target" : "Unified Schedule Calendar for Tasks, Habits & Goals",
    description: isId ? "Lihat jadwal time-blocking, habit, studi, dan tenggat target Anda dalam satu kalender terpadu yang bersih dan bebas distraksi." : "See your time-blocked tasks, habit streaks, study schedules, and goal deadlines on one calm unified calendar built for focused execution.",
  });
}

export default async function CalendarFeatureLayout({
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
    { name: isId ? "Smart Calendar" : "Smart Calendar", url: isId ? '/id/features/calendar' : '/features/calendar' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
