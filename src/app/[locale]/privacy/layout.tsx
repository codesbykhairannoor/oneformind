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
    title: 'Privacy Policy — How We Protect Your Data',
    description: 'Understand how Tranvas safeguards, encrypts, and handles your personal data, habits, finances, and journal entries with strict privacy standards.',
  });
}

export default function PrivacyAliasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
