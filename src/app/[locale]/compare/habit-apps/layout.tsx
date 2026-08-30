import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habit Apps | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}