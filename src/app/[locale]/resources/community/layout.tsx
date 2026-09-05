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
    path: '/resources/community',
    title: 'Community — Connect with Fellow Builders',
    description: 'Join a vibrant community of intentional individuals, share productivity systems, exchange habit tips, and grow together.',
  });
}

export default function CommunityResourceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
