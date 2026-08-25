import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trello | OneForMind',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}