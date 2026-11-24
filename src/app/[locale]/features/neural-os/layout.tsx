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
    path: '/features/neural-os',
    title: isId ? "Neural OS: Asisten AI Privat untuk Life OS Anda" : "Neural OS: Privacy-First AI Coach for Your Life OS",
    description: isId ? "Dapatkan analisis kontekstual lintas habit, keuangan, dan jadwal fokus dengan Tranvas Neural OS yang menjaga privasi data penuh." : "Get contextual weekly insights across habits, finances, and focus blocks with Tranvas Neural OS—designed with strict privacy and data sovereignty.",
  });
}

export default async function NeuralOsFeatureLayout({
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
    { name: isId ? "Neural OS" : "Neural OS", url: isId ? '/id/features/neural-os' : '/features/neural-os' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
