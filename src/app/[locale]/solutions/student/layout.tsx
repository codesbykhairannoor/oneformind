import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Students | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}