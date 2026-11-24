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
    path: '/pricing',
    title: isId ? "Harga Tranvas: Satu Life OS Menggantikan 5+ Aplikasi" : "Pricing: One Unified Life OS Replacing 5+ Apps",
    description: isId ? "Harga transparan Tranvas Life OS. Dapatkan seluruh 8 modul—Planner, Habits, Finance, Goals, Journal, Jobs, Study, dan Calendar." : "Transparent pricing for Tranvas Life OS. Get all 8 modules—Planner, Habits, Finance, Goals, Journal, Jobs, Study, and Calendar—in one plan.",
  });
}

export default async function PricingLayout({
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
    { name: isId ? "Harga" : "Pricing", url: isId ? '/id/pricing' : '/pricing' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
