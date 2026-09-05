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
    path: '/features/neural-os',
    title: 'Neural OS AI — Powered by Gemini Brain',
    description: 'Experience proactive AI intelligence across your habits, tasks, and notes with Gemini-powered neural recommendations.',
  });
}

export default function NeuralOsFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
