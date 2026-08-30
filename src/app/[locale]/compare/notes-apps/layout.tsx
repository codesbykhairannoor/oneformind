import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Note-Taking Apps | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}