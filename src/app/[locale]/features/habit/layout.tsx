import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Habit | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}