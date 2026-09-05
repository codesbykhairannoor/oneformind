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
    path: '/solutions/second-brain',
    title: 'Second Brain — Digital Knowledge Map',
    description: 'Capture, organize, and synthesize ideas, notes, and insights into an interconnected personal knowledge management system.',
  });
}

export default function SecondBrainSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
