import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Calendar | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}