import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Second Brain | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}