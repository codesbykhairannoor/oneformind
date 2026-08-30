import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Five Apps | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}