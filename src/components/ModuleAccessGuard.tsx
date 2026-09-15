'use client';

import React from 'react';
import { useActiveModules, ModuleKey } from '@/hooks/useActiveModules';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Lock, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface ModuleAccessGuardProps {
    moduleKey: ModuleKey;
    children: React.ReactNode;
}

export default function ModuleAccessGuard({ moduleKey, children }: ModuleAccessGuardProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const { isTabActive, hasHydrated, isUnlimited } = useActiveModules();

    if (!hasHydrated) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isActive = isTabActive(moduleKey);

    if (isActive) {
        return <>{children}</>;
    }

    const labelMap: Record<string, { id: string; en: string }> = {
        habit: { id: 'Kebiasaan (Habits)', en: 'Habits' },
        planner: { id: 'Agenda (Planner)', en: 'Planner' },
        finance: { id: 'Keuangan (Finance)', en: 'Finance' },
        study: { id: 'Akademik & Buku (Study)', en: 'Study' },
        journal: { id: 'Jurnal Refleksi (Journal)', en: 'Journal' },
        calendar: { id: 'Kalender Master (Calendar)', en: 'Calendar' },
        job: { id: 'Karier & Lamaran (Jobs)', en: 'Jobs' },
        goal: { id: 'Target Strategis (Goals)', en: 'Goals' }
    };

    const moduleName = isIndo ? labelMap[moduleKey]?.id || moduleKey : labelMap[moduleKey]?.en || moduleKey;

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5 shadow-lg">
                <Lock size={28} />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {isIndo ? `Modul ${moduleName} Tidak Aktif` : `${moduleName} Module Not Active`}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {isIndo
                    ? `Modul ini tidak termasuk dalam 3 tab aktif pilihan Anda. Untuk mengaksesnya, aktifkan modul di Pengaturan Modul atau upgrade paket Anda.`
                    : `This module is not currently active in your 3-tab trio. To use it, enable it in Settings or upgrade your plan.`
                }
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-all"
                >
                    <Layers size={14} />
                    <span>{isIndo ? 'Kelola 3 Tab Aktif' : 'Manage Active 3 Tabs'}</span>
                </Link>

                <Link
                    href="/billing"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs transition-all hover:bg-slate-800"
                >
                    <Sparkles size={14} className="text-indigo-400" />
                    <span>{isIndo ? 'Upgrade Akses Penuh' : 'Unlock All Modules'}</span>
                </Link>
            </div>
        </div>
    );
}
