import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notion | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}