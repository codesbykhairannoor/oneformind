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
    path: '/terms-of-service',
    title: 'Terms of Service — Legal Terms & Agreement',
    description: 'Read the legal terms of service and acceptable usage guidelines for the Tranvas life operating system platform.',
  });
}

export default function CompanyTermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
