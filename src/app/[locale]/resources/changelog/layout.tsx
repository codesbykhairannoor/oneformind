import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Changelog — What's New",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}