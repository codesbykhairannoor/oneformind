import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Five Apps | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}