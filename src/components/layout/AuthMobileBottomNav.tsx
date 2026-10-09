'use client';

import React from 'react';
import { usePathname, Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { 
    LayoutDashboard, 
    CheckSquare, 
    Leaf, 
    CalendarDays, 
    BookOpen, 
    DollarSign
} from 'lucide-react';

interface AuthMobileBottomNavProps {
    moduleSettings?: Record<string, boolean>;
}

export default function AuthMobileBottomNav({ moduleSettings = {} }: AuthMobileBottomNavProps) {
    const pathname = usePathname();
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Core tabs to display on mobile bottom nav
    const navItems = [
        {
            key: 'dashboard',
            label: 'Home',
            href: '/dashboard',
            icon: LayoutDashboard,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: true
        },
        {
            key: 'planner',
            label: 'Planner',
            href: '/planner',
            icon: CheckSquare,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: moduleSettings.planner !== false
        },
        {
            key: 'habits',
            label: 'Habit',
            href: '/habits',
            icon: Leaf,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: moduleSettings.habit !== false
        },
        {
            key: 'calendar',
            label: isIndo ? 'Jadwal' : 'Calendar',
            href: '/calendar',
            icon: CalendarDays,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: moduleSettings.calendar !== false
        },
        {
            key: 'journal',
            label: isIndo ? 'Jurnal' : 'Journal',
            href: '/journal',
            icon: BookOpen,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: moduleSettings.journal !== false
        },
        {
            key: 'finance',
            label: 'Finance',
            href: '/finance',
            icon: DollarSign,
            activeColor: 'text-indigo-600 dark:text-indigo-400',
            activeBg: 'bg-indigo-50/90 dark:bg-indigo-500/15',
            enabled: moduleSettings.finance !== false
        }
    ].filter(item => item.enabled);

    const isItemActive = (href: string) => {
        if (href === '/dashboard' && (pathname === '/dashboard' || pathname === '/')) return true;
        return pathname?.startsWith(href);
    };

    return (
        <nav 
            aria-label="Mobile Navigation Dock"
            className="fixed bottom-2.5 inset-x-2 sm:inset-x-auto sm:w-[440px] sm:left-1/2 sm:-translate-x-1/2 z-[65] md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-1 py-1 transition-all duration-300"
        >
            <div className="grid grid-cols-6 items-center gap-0.5">
                {navItems.map((item) => {
                    const active = isItemActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 active:scale-95 relative ${
                                active
                                    ? `${item.activeColor} ${item.activeBg}`
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <Icon 
                                className={`w-[17px] h-[17px] transition-transform duration-150 ${
                                    active ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                                }`} 
                            />

                            <span className={`text-[9.5px] tracking-tight mt-0.5 leading-none transition-all select-none ${
                                active ? 'font-bold' : 'font-medium'
                            }`}>
                                {item.label}
                            </span>

                            {/* Subtle micro active indicator dot */}
                            {active && (
                                <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5 animate-in zoom-in-50 duration-150" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
