import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Calendar — Sync Your Schedules',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}