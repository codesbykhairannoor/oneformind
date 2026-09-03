import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neural OS AI — Powered by Gemini Brain',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}