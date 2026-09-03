import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Students — Optimize Your Learning',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}