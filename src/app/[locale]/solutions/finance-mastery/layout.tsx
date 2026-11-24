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
    path: '/solutions/finance-mastery',
    title: isId ? "Finance Mastery: Cashflow Sehat & Kebiasaan Finansial" : "Finance Mastery: Zero-Based Budget & Wealth Habits",
    description: isId ? "Hentikan kebocoran uang dan bangun kekayaan jangka panjang dengan menghubungkan zero-based budgeting ke habit harian." : "Stop money leaks and build long-term net worth by connecting zero-based monthly budgeting directly to your daily routines and goals.",
  });
}

export default async function FinanceMasterySolutionLayout({
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
    { name: isId ? "Finance Mastery" : "Finance Mastery", url: isId ? '/id/solutions/finance-mastery' : '/solutions/finance-mastery' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
