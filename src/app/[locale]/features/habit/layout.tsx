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
    path: '/features/habit',
    title: 'Habit Tracker — Build Consistency Every Day',
    description: 'Track daily routines and build atomic habits with visual streaks, frequency scheduling, progress analytics, and mindful reminders.',
  });
}

export default function HabitFeatureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
