import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ai Trust | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}