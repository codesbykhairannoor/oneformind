import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tranvas vs Todoist | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}