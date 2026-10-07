'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

interface GuestFloatingPillProps {
    scrolled: boolean;
    mobileMenuOpen: boolean;
    user: any;
    pathname: string;
}

export default function GuestFloatingPill({
    scrolled,
    mobileMenuOpen,
    user,
    pathname
}: GuestFloatingPillProps) {
    const locale = useLocale();
    const isId = locale === 'id';

    if (!scrolled || mobileMenuOpen || user || pathname.includes('/register') || pathname.includes('/login')) {
        return null;
    }

    return (
        <aside aria-label="Quick Signup" className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3 p-1.5 pl-4 bg-slate-900/90 text-white backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-indigo-500/20 hover:scale-[1.03] transition-all">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">{isId ? 'Bangun Life OS Anda' : 'Build your Life OS'}</span>
                    <span className="text-emerald-400 font-black">{isId ? '• Gratis' : '• Free'}</span>
                </div>
                <Link
                    href="/register"
                    onClick={() => trackCTAClick('floating_pill', 'Start Free', '/register')}
                    className="relative overflow-hidden group px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-black transition-all shadow-md shadow-indigo-600/30 active:scale-95 flex items-center gap-1.5"
                >
                    <span className="relative z-10">{isId ? 'Mulai Gratis' : 'Start Free'}</span>
                    <svg className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>
            </div>
        </aside>
    );
}
