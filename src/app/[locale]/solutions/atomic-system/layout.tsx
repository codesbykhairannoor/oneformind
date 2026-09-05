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
    path: '/solutions/atomic-system',
    title: 'Atomic Habits — Small Steps, Big Results',
    description: 'Implement the James Clear Atomic Habits methodology with 1% daily improvements, habit cues, tracking, and identity shifts.',
  });
}

export default function AtomicSystemSolutionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
