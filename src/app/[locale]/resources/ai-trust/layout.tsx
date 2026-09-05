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
    path: '/resources/ai-trust',
    title: 'AI Transparency — Security & Privacy Commitment',
    description: 'Learn how Tranvas uses AI ethically, safeguarding user privacy, encrypting sensitive data, and ensuring total user ownership.',
  });
}

export default function AiTrustResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
