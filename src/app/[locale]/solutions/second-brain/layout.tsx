import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Second Brain — Your Digital Knowledge Map',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}