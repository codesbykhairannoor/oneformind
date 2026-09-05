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
    path: '/resources/blog',
    title: 'Blog — Productivity & Growth Insights',
    description: 'Actionable articles, mental models, and deep dives on personal productivity, habit science, financial clarity, and intentional living.',
  });
}

export default function BlogResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
