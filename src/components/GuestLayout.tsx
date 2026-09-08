'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

import GuestNavbar from './guest/GuestNavbar';
import GuestMobileMenu from './guest/GuestMobileMenu';
import GuestFooter from './guest/GuestFooter';
import GuestFloatingPill from './guest/GuestFloatingPill';

export default function GuestLayout({ children, user = null }: { children: React.ReactNode, user?: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [langOpen, setLangOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const cleanPath = pathname === '/' || pathname === '' ? '' : pathname;
    const enHref = cleanPath === '' ? '/' : cleanPath;
    const idHref = `/id${cleanPath}`;

    useEffect(() => {
        let ticking = false;
        let lastScrolled = typeof window !== 'undefined' ? window.scrollY > 20 : false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const isScrolled = window.scrollY > 20;
                    if (isScrolled !== lastScrolled) {
                        lastScrolled = isScrolled;
                        setScrolled(isScrolled);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = typeof window !== 'undefined' && 'requestIdleCallback' in window
            ? (window as any).requestIdleCallback(() => {
                const publicRoutes = [
                    '/features/planner',
                    '/features/habit',
                    '/features/finance',
                    '/features/journal',
                    '/features/goal',
                    '/features/neural-os',
                    '/pricing',
                    '/about',
                    '/login',
                    '/register'
                ];
                publicRoutes.forEach(route => router.prefetch(route));
            })
            : setTimeout(() => {
                const publicRoutes = ['/features/planner', '/features/habit', '/features/finance', '/pricing', '/login'];
                publicRoutes.forEach(route => router.prefetch(route));
            }, 1200);

        return () => {
            if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
                (window as any).cancelIdleCallback(timer);
            } else {
                clearTimeout(timer);
            }
        };
    }, [router]);

    const switchLang = (newLang: 'id' | 'en') => {
        window.dispatchEvent(new CustomEvent('switch-locale', { detail: { locale: newLang } }));
        setLangOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-700 relative">
            
            {/* PUBLIC NAVBAR */}
            <GuestNavbar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                scrolled={scrolled}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                langOpen={langOpen}
                setLangOpen={setLangOpen}
                locale={locale}
                idHref={idHref}
                enHref={enHref}
                switchLang={switchLang}
                user={user}
            />

            {/* MOBILE MENU */}
            <GuestMobileMenu
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                mobilePanel={mobilePanel}
                setMobilePanel={setMobilePanel}
                locale={locale}
                idHref={idHref}
                enHref={enHref}
                switchLang={switchLang}
                user={user}
            />

            {/* MAIN CONTENT */}
            <main className="flex-grow">
                {children}
            </main>

            {/* PUBLIC FOOTER */}
            <GuestFooter
                locale={locale}
                enHref={enHref}
                idHref={idHref}
                switchLang={switchLang}
            />

            {/* FLOATING SIGNUP PILL */}
            <GuestFloatingPill
                scrolled={scrolled}
                mobileMenuOpen={mobileMenuOpen}
                user={user}
                pathname={pathname}
            />

        </div>
    );
}
