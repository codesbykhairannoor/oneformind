import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spreadsheet | Tranvas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}