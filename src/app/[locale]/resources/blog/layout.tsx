import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Productivity Insights',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}