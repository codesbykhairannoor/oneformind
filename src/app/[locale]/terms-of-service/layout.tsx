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
    title: 'Terms of Service — User Agreement & Rules',
    description: 'Review the Terms of Service governing your account, usage rights, subscription plans, and service commitments on the Tranvas platform.',
  });
}

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
