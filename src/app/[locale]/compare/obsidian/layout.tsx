import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tranvas vs Obsidian | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}