'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';

// PERF: In-memory cache to store loaded translation dictionaries.
// Prevents redundant network requests or dynamic imports on subsequent language switches.
const messageCache: Record<string, Messages> = {};

type Messages = Record<string, string>;

async function loadMessages(locale: string): Promise<Messages> {
  if (messageCache[locale]) {
    return messageCache[locale];
  }
  let loaded: Messages;
  if (locale === 'id') {
    const mod = await import('../messages/id.json');
    loaded = mod.default as unknown as Messages;
  } else {
    const mod = await import('../messages/en.json');
    loaded = mod.default as unknown as Messages;
  }
  messageCache[locale] = loaded;
  return loaded;
}

export default function InstantIntlProvider({
  children,
  initialLocale,
  initialMessages,
}: {
  children: React.ReactNode;
  initialLocale: string;
  initialMessages?: Messages;
}) {
  if (initialMessages && !messageCache[initialLocale]) {
    messageCache[initialLocale] = initialMessages;
  }

  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState<Messages | null>(initialMessages || null);
  const loadedLocaleRef = useRef<string | null>(initialMessages ? initialLocale : null);

  // Preload alternate language in background during idle time for 0ms language switches
  useEffect(() => {
    const alternateLocale = initialLocale === 'id' ? 'en' : 'id';
    const timer = typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(() => loadMessages(alternateLocale))
      : setTimeout(() => loadMessages(alternateLocale), 300);

    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(timer);
      } else {
        clearTimeout(timer);
      }
    };
  }, [initialLocale]);

  // Load messages for the current locale if changed or not provided
  useEffect(() => {
    if (loadedLocaleRef.current === locale && messages) return;
    loadedLocaleRef.current = locale;
    loadMessages(locale).then(setMessages);
  }, [locale, messages]);

  // Sync state if initialLocale changes externally
  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Don't render children until messages are loaded
  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSwitcherListener locale={locale} setLocale={setLocale} setMessages={setMessages} />
      {children}
    </NextIntlClientProvider>
  );
}

function LocaleSwitcherListener({
  locale,
  setLocale,
  setMessages,
}: {
  locale: string;
  setLocale: (l: string) => void;
  setMessages: (m: Messages) => void;
}) {
  useEffect(() => {
    const handleSwitch = (e: CustomEvent<{ locale: string }>) => {
      const newLocale = e.detail.locale;
      if (newLocale && newLocale !== locale) {
        // Instant synchronous update if message dictionary is already cached in memory
        if (messageCache[newLocale]) {
          setMessages(messageCache[newLocale]);
          setLocale(newLocale);
        } else {
          loadMessages(newLocale).then((msgs) => {
            setMessages(msgs);
            setLocale(newLocale);
          });
        }

        try {
          localStorage.setItem('tranvas_locale', newLocale);
          document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = newLocale;

          // Update URL in browser address bar smoothly without triggering Next.js RSC route transition/refresh
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            let targetPath = currentPath;
            if (newLocale === 'id') {
              if (!currentPath.startsWith('/id')) {
                targetPath = currentPath === '/' ? '/id' : `/id${currentPath}`;
              }
            } else {
              if (currentPath.startsWith('/id')) {
                const stripped = currentPath.replace(/^\/id(\/|$)/, '/');
                targetPath = stripped || '/';
              }
            }
            const currentSearch = window.location.search;
            const currentHash = window.location.hash;
            window.history.replaceState(window.history.state, '', `${targetPath}${currentSearch}${currentHash}`);
          }
        } catch (err) {
          console.error('Error switching locale:', err);
        }
      }
    };

    window.addEventListener('switch-locale' as any, handleSwitch);
    return () => {
      window.removeEventListener('switch-locale' as any, handleSwitch);
    };
  }, [locale, setLocale, setMessages]);

  return null;
}

