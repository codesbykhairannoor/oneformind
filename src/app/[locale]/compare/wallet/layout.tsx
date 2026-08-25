import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallet | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}