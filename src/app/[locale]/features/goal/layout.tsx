import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Goal Tracker — Track Your Milestones',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}