import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

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
    title: isId ? 'Dokumentasi API & Integrasi Agen AI Tranvas' : 'Tranvas API & AI Agent Documentation',
    description: isId
      ? 'Dokumentasi resmi Tranvas API, spesifikasi OpenAPI 3.1, metadata OAuth 2.0 (RFC 8414 & 9728), dan standar llms.txt untuk developer dan agen AI.'
      : 'Official Tranvas API documentation, OpenAPI 3.1 specification, OAuth 2.0 PKCE scopes (RFC 8414 & 9728), and llms.txt discovery for developers and AI agents.',
  });
}

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
