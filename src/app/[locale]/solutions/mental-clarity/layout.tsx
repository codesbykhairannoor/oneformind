import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mental Health — Journaling & Mindfulness',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}