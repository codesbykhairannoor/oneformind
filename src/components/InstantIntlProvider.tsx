'use client';

import React, { useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
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

  // Sync HTML lang attribute and watch for external changes
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const handleSwitch = (e: CustomEvent<{ locale: string }>) => {
      const newLocale = e.detail.locale;
      if (messagesMap[newLocale] && newLocale !== locale) {
        setLocale(newLocale);
        localStorage.setItem('oneformind_locale', newLocale);

        // Update URL path prefix silently without refreshing the page
        const currentPathname = window.location.pathname;
        let newPathname = currentPathname;

        if (currentPathname.startsWith('/en/')) {
          newPathname = currentPathname.replace('/en/', `/${newLocale}/`);
        } else if (currentPathname.startsWith('/id/')) {
          newPathname = currentPathname.replace('/id/', `/${newLocale}/`);
        } else if (currentPathname === '/en') {
          newPathname = `/${newLocale}`;
        } else if (currentPathname === '/id') {
          newPathname = `/${newLocale}`;
        } else {
          // If no prefix is present (localePrefix: 'as-needed')
          if (newLocale === 'id') {
            if (!currentPathname.startsWith('/id')) {
              newPathname = `/id${currentPathname === '/' ? '' : currentPathname}`;
            }
          } else {
            if (currentPathname.startsWith('/id/')) {
              newPathname = currentPathname.replace('/id/', '/');
            } else if (currentPathname === '/id') {
              newPathname = '/';
            }
          }
        }

        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        window.history.replaceState(null, '', `${newPathname}${currentSearch}${currentHash}`);
      }
    };

    window.addEventListener('switch-locale' as any, handleSwitch);
    return () => {
      window.removeEventListener('switch-locale' as any, handleSwitch);
    };
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}
