import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Apps | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}