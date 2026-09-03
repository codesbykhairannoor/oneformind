import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Transparency — Our Commitment',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}