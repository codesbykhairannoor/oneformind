import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Habit Tracker Apps | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}