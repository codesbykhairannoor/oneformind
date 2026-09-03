import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Tracker — Focus on Professional Growth',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}