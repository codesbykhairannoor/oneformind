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
    path: '/resources/stories',
    title: 'Success Stories — User Transformations',
    description: 'Discover inspiring stories and real results from individuals and creators who transformed their habits and focus with Tranvas.',
  });
}

export default function StoriesResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
