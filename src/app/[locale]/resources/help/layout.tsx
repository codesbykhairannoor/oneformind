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
    path: '/resources/help',
    title: isId ? "Pusat Bantuan, FAQ & Dukungan Pengguna Tranvas" : "Tranvas Help Center, FAQ & Account Support",
    description: isId ? "Temukan jawaban cepat tentang sinkronisasi, privasi, langganan, habit streak, dompet keuangan, dan dukungan pelanggan Tranvas." : "Find quick answers on Tranvas sync, privacy, subscriptions, habit streaks, finance wallets, and contact our Jakarta support team.",
  });
}

export default async function HelpLayout({
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
    { name: isId ? "Pusat Bantuan" : "Help Center", url: isId ? '/id/resources/help' : '/resources/help' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
