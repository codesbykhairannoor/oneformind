import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atomic Habits — Small Steps, Big Results',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}