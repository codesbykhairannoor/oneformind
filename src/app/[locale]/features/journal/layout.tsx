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
    path: '/features/journal',
    title: 'Digital Journal — Capture Your Thoughts',
    description: 'Reflect with private digital journaling, emotional check-ins, mood tracking, and AI-assisted weekly retrospectives.',
  });
}

export default function JournalFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
