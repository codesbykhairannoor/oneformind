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
    path: '/resources/ai-trust',
    title: isId ? "Keamanan Data, Privasi & Arsitektur AI Tranvas" : "AI Trust, Data Privacy & Security Architecture",
    description: isId ? "Pelajari bagaimana Tranvas melindungi data pribadi Anda dengan enkripsi, kedaulatan data penuh, dan kebijakan AI yang transparan." : "Learn how Tranvas protects your personal data with encryption, strict data sovereignty, zero ad tracking, and transparent AI policies.",
  });
}

export default async function AiTrustLayout({
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
    { name: isId ? "AI & Privasi" : "AI & Privacy", url: isId ? '/id/resources/ai-trust' : '/resources/ai-trust' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
