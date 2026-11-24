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
    path: '/resources/api',
    title: isId ? "Dokumentasi API Tranvas, OpenAPI 3.1 & Agen AI" : "Tranvas API, OpenAPI 3.1 & AI Agent Docs",
    description: isId ? "Dokumentasi resmi API Tranvas, spesifikasi OpenAPI 3.1, metadata OAuth 2.0 (RFC 8414 & 9728), dan standar llms.txt untuk agen AI." : "Official Tranvas API documentation, OpenAPI 3.1 spec, OAuth 2.0 PKCE metadata (RFC 8414 & 9728), and llms.txt standards for AI agents.",
  });
}

export default async function ApiDocsLayout({
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
    { name: isId ? "Dokumentasi API" : "API Docs", url: isId ? '/id/resources/api' : '/resources/api' },
  ];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
