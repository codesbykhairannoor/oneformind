import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Planner — Focus on What Matters',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}