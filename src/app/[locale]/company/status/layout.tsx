import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status & Service Uptime',
  description: 'Real-time operational status, incident history, and uptime metrics for the Tranvas global infrastructure.',
};

export default function CompanyStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
