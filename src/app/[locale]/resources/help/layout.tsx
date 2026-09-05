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
    path: '/resources/help',
    title: 'Help Center — FAQs & Knowledge Base',
    description: 'Find instant answers to frequently asked questions, account settings, billing troubleshooting, and feature guides.',
  });
}

export default function HelpResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
