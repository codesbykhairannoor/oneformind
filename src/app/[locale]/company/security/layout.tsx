import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return constructPageMetadata({
    locale,
    path: '/company/security',
    title: 'Security — Enterprise-Grade Protection',
    description: 'Learn how Tranvas implements bank-grade 256-bit encryption, row-level security, and continuous vulnerability monitoring.',
  });
}

export default function CompanySecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
