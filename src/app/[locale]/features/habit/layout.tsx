import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habit Tracker — Build Consistency Every Day',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}