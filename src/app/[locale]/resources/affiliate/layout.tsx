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
    path: '/resources/affiliate',
    title: isId ? "Program Afiliasi Tranvas: Komisi Rutin & Partner" : "Tranvas Affiliate Program: Earn Recurring Rewards",
    description: isId ? "Bermitra dengan Tranvas dan raih komisi dengan membagikan Life Operating System 8-in-1 kepada audiens produktivitas Anda." : "Partner with Tranvas and earn recurring commissions by sharing the unified 8-in-1 Life Operating System with your productivity audience.",
  });
}

export default async function AffiliateLayout({
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
    { name: isId ? "Afiliasi" : "Affiliates", url: isId ? '/id/resources/affiliate' : '/resources/affiliate' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
