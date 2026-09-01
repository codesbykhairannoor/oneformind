import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Script from 'next/script';
import InstantIntlProvider from "@/components/InstantIntlProvider";

import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap", // PERF: Use font-display:swap to prevent invisible text during font load
});

export const metadata: Metadata = {
  title: "Tranvas | The Unified Life Operating System",
  description: "The all-in-one productivity OS for growth, clarity, and control.",
};

// PERF: Pre-generate both locale routes at build time so they're served
// from Vercel CDN edge cache with zero server function invocations.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}


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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7PNK1P4WZN" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7PNK1P4WZN');
          `}
        </Script>
          <InstantIntlProvider initialLocale={locale}>
            {children}
          </InstantIntlProvider>
      </body>
    </html>
  );
}
