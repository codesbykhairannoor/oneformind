import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}