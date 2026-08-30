import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Tracker | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}