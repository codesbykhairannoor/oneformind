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
            activeBg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
            enabled: true
        },
        {
            key: 'planner',
            label: isIndo ? 'Planner' : 'Planner',
            href: '/planner',
            icon: CheckSquare,
            activeColor: 'text-blue-600 dark:text-blue-400',
            activeBg: 'bg-blue-500/10 dark:bg-blue-400/10',
            enabled: moduleSettings.planner !== false
        },
        {
            key: 'habits',
            label: isIndo ? 'Habits' : 'Habits',
            href: '/habits',
            icon: Leaf,
            activeColor: 'text-emerald-600 dark:text-emerald-400',
            activeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
            enabled: moduleSettings.habit !== false
        },
        {
            key: 'calendar',
            label: isIndo ? 'Kalender' : 'Calendar',
            href: '/calendar',
            icon: CalendarDays,
            activeColor: 'text-sky-600 dark:text-sky-400',
            activeBg: 'bg-sky-500/10 dark:bg-sky-400/10',
            enabled: moduleSettings.calendar !== false
        },
        {
            key: 'journal',
            label: isIndo ? 'Jurnal' : 'Journal',
            href: '/journal',
            icon: BookOpen,
            activeColor: 'text-purple-600 dark:text-purple-400',
            activeBg: 'bg-purple-500/10 dark:bg-purple-400/10',
            enabled: moduleSettings.journal !== false
        },
        {
            key: 'finance',
            label: isIndo ? 'Keuangan' : 'Finance',
            href: '/finance',
            icon: DollarSign,
            activeColor: 'text-rose-600 dark:text-rose-400',
            activeBg: 'bg-rose-500/10 dark:bg-rose-400/10',
            enabled: moduleSettings.finance !== false
        }
    ].filter(item => item.enabled);

    const isItemActive = (href: string) => {
        if (href === '/dashboard' && (pathname === '/dashboard' || pathname === '/')) return true;
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[65] md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {navItems.map((item) => {
                    const active = isItemActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 active:scale-90 relative ${
                                active
                                    ? `${item.activeColor}`
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {/* Active background pill */}
                            {active && (
                                <div className={`absolute inset-0 rounded-2xl ${item.activeBg} -z-10 animate-in fade-in zoom-in-95 duration-200`} />
                            )}

                            <div className="relative">
                                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                                {active && (
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                                )}
                            </div>

                            <span className={`text-[9.5px] font-black tracking-tight mt-0.5 transition-all ${
                                active ? 'font-black scale-105' : 'font-semibold'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
