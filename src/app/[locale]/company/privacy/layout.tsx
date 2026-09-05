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
    path: '/privacy-policy',
    title: 'Privacy Policy — Data Security Standards',
    description: 'Learn about Tranvas data protection, end-to-end security protocols, and strict privacy commitments to our users.',
  });
}

export default function CompanyPrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
