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
    path: '/features/calendar',
    title: 'Smart Calendar — Sync Your Schedules',
    description: 'Unify your deadlines, events, scheduled tasks, and habit commitments in one seamless interactive calendar view.',
  });
}

export default function CalendarFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
