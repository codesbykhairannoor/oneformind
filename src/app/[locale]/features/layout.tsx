import { Metadata } from 'next';
import { constructPageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';
  return constructPageMetadata({
    locale,
    path: '/features',
    title: isId ? "8 Fitur Life OS Terpadu: Planner, Habit & Finance" : "8-in-1 Life OS Features: Planner, Habits & Finance",
    description: isId ? "Jelajahi 8 modul terpadu Tranvas: Daily Planner, Habit Matrix 28 Hari, Finance OS, WOOP Goals, Jurnal, Career Kanban, Study Tracker, dan Kalender." : "Explore all 8 integrated Tranvas modules: Daily Planner, 28-Day Habit Matrix, Zero-Based Finance OS, WOOP Goals, Journal, Career Kanban, Study, and Calendar.",
  });
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
