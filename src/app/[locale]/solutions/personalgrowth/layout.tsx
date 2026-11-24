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
    path: '/solutions/personalgrowth',
    title: isId ? "Personal Growth OS: Target, Habit & Evaluasi Rutin" : "Personal Growth OS: Goals, Habits & Weekly Reviews",
    description: isId ? "Rancang pengembangan diri terukur dengan menyatukan WOOP goals, habit tracker 28 hari, jurnal refleksi, dan pelacakan skill." : "Design intentional self-improvement by uniting WOOP goal cascading, 28-day habit tracking, reflective journaling, and skill tracking.",
  });
}

export default async function PersonalGrowthSolutionLayout({
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
    { name: isId ? "Pengembangan Diri" : "Personal Growth", url: isId ? '/id/solutions/personalgrowth' : '/solutions/personalgrowth' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
