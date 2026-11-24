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
    path: '/solutions/atomic-system',
    title: isId ? "Sistem Atomic Habits: Konsistensi 1% Setiap Hari" : "Atomic Habits System: 1% Daily Identity Compounding",
    description: isId ? "Terapkan habit stacking, aturan 2 menit, dan streak visual 28 hari dalam satu Life OS untuk membentuk kebiasaan konsisten." : "Apply habit stacking, the 2-Minute Rule, and 28-day visual streaks inside one integrated Life OS built for effortless behavioral consistency.",
  });
}

export default async function AtomicSystemSolutionLayout({
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
    { name: isId ? "Sistem Atomik" : "Atomic System", url: isId ? '/id/solutions/atomic-system' : '/solutions/atomic-system' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
