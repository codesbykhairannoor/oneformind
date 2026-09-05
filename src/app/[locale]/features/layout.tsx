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
    path: '/features',
    title: 'Features Overview — All-in-One Life Operating System',
    description: 'Explore the 8 core modules of Tranvas: Task Planner, Atomic Habits, Smart Finance, Mindful Journal, Gemini Neural OS AI, and more.',
  });
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
