import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tranvas vs Notion | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}