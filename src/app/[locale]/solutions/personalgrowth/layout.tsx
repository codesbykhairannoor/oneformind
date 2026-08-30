import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Growth | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}