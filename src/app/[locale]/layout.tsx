import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import InstantIntlProvider from "@/components/InstantIntlProvider";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OneForMind | Productivity OS",
  description: "The all-in-one productivity OS for growth, clarity, and control.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} antialiased`} suppressHydrationWarning>
      <body className="selection:bg-indigo-100 selection:text-indigo-700 font-sans min-h-screen flex flex-col bg-white text-slate-900" suppressHydrationWarning>
        <SessionProviderWrapper>
          <InstantIntlProvider initialLocale={locale}>
            {children}
          </InstantIntlProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
