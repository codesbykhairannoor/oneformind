'use client';

import React, { useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import enMessages from '@/messages/en.json';
import idMessages from '@/messages/id.json';

const messagesMap: Record<string, any> = {
  en: enMessages,
  id: idMessages,
};

export default function InstantIntlProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: string;
}) {
  const [locale, setLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  // Sync state if initialLocale changes externally (e.g. user manually changes URL prefix)
  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const handleSwitch = (e: CustomEvent<{ locale: string }>) => {
      const newLocale = e.detail.locale;
      if (messagesMap[newLocale] && newLocale !== locale) {
        setLocale(newLocale);
        localStorage.setItem('oneformind_locale', newLocale);

        // Manual prefix-aware path calculation to keep Next.js router in sync
        let newPathname = pathname;
        if (newLocale === 'id') {
          // Add '/id' prefix if not already present
          if (!pathname.startsWith('/id/') && pathname !== '/id') {
            newPathname = `/id${pathname === '/' ? '' : pathname}`;
          }
        } else {
          // Remove '/id' prefix for English ('as-needed' localePrefix)
          if (pathname.startsWith('/id/')) {
            newPathname = pathname.replace('/id/', '/');
          } else if (pathname === '/id') {
            newPathname = '/';
          }
        }

        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        router.replace(`${newPathname}${currentSearch}${currentHash}`);
      }
    };

    window.addEventListener('switch-locale' as any, handleSwitch);
    return () => {
      window.removeEventListener('switch-locale' as any, handleSwitch);
    };
  }, [locale, pathname, router]);

  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
