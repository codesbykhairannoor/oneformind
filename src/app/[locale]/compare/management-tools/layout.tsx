import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Management Tools | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}