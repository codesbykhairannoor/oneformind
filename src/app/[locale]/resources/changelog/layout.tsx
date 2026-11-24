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
    path: '/resources/changelog',
    title: isId ? "Changelog Produk & Pembaruan Terbaru Tranvas" : "Product Changelog & Latest Life OS Releases",
    description: isId ? "Pantau pembaruan terbaru Tranvas Life OS, peningkatan performa, keamanan, dan penyempurnaan fitur di seluruh 8 modul." : "Track the latest Tranvas Life OS updates, performance upgrades, security hardening, and new workflow improvements across all 8 modules.",
  });
}

export default async function ChangelogLayout({
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
    { name: isId ? "Changelog" : "Changelog", url: isId ? '/id/resources/changelog' : '/resources/changelog' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
