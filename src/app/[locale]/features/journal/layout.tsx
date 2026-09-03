import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Journal — Capture Your Thoughts',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}