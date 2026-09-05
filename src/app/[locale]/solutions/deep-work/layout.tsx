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
    path: '/solutions/deep-work',
    title: 'Deep Work — Uninterrupted Focus & Flow',
    description: 'Eliminate digital distractions, schedule focused deep work blocks, and achieve state of flow with science-backed focus tools.',
  });
}

export default function DeepWorkSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
