'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Sparkles, Brain, ArrowRight, LayoutDashboard, BookOpen, Target, ChevronRight } from 'lucide-react';

interface DashboardAiGatingBannerProps {
    isAiEnabled: boolean;
    isTrialActive: boolean;
    isExplorer: boolean;
    trial: any;
    locale: string;
    loadingInsight: boolean;
    globalInsight: any;
    t: any;
}

export default function DashboardAiGatingBanner({
    isAiEnabled,
    isTrialActive,
    isExplorer,
    trial,
    locale,
    loadingInsight,
    globalInsight,
    t
}: DashboardAiGatingBannerProps) {
    if (isAiEnabled) {
        return (
            <Link
                href="/coach"
                className="bento-card bento-card-hover block cursor-pointer rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white shadow-md dark:border-indigo-500/20 md:p-6"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-200">
                            <Sparkles size={12} className="text-indigo-300" />
                            {t('dash_neural_active') || 'Neural AI Active'}
                        </div>
                        {loadingInsight ? (
                            <div className="space-y-2">
                                <div className="h-5 bg-white/10 rounded-md w-full animate-pulse" />
                                <div className="h-5 bg-white/10 rounded-md w-4/5 animate-pulse" />
                            </div>
                        ) : (
                            <p className="text-base font-bold leading-snug md:text-lg">
                                {globalInsight?.summary || t('dash_neural_default_summary') || 'Analisis neuro-psikologis Anda menunjukkan fokus tinggi pada sesi pagi hari.'}
                            </p>
                        )}
                        <p className="mt-2 text-xs font-medium text-indigo-200/80 flex items-center gap-1">
                            {t('dash_open_hub') || 'Buka Neural AI Coach Hub'}
                            <ArrowRight size={12} />
                        </p>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                        <Brain size={28} className="text-indigo-200" />
                    </div>
                </div>
            </Link>
        );
    }

    if (!isAiEnabled) {
        return (
            <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/90 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/40 p-5 md:p-6 md:flex md:items-center md:justify-between md:gap-6 shadow-sm">
                <div className="flex gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Brain size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                                {locale === 'id' ? 'Eksklusif Quantum Plan' : 'Exclusive Quantum Plan'}
                            </span>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {locale === 'id' ? 'AI Life Coach 24/7' : '24/7 AI Life Coach'}
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {locale === 'id' ? 'Aktifkan Asisten Cerdas Neural OS' : 'Activate Neural OS AI Companion'}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {locale === 'id' 
                                ? 'AI Coach hanya tersedia pada paket Quantum Plan (tidak termasuk di Free atau Architect). Dapatkan audit kebiasaan, analisis keuangan, dan evaluasi fokus harian.' 
                                : 'AI Coach is exclusive to Quantum Plan (not included in Free or Architect). Unlock automated habit audits, cashflow intelligence, and real-time focus feedback.'}
                        </p>
                    </div>
                </div>
                <Link
                    href="/billing"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2.5 text-xs font-black text-white transition-all shadow-md shadow-indigo-300/30 dark:shadow-none md:mt-0 md:w-auto shrink-0 active:scale-95"
                >
                    <Sparkles size={14} />
                    <span>{locale === 'id' ? 'Upgrade ke Quantum' : 'Upgrade to Quantum'}</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('dash_architect_brief_title') || 'Modul Architect Aktif'}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('dash_architect_brief_desc') || 'Akses penuh ke modul Jurnal, Target, dan Kalender tanpa batas.'}
            </p>
            <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400">
                {t('dash_quantum_teaser') || 'Ingin rekomendasi otomatis AI? Nikmati Quantum AI Plan.'}
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                    href="/journal"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/10"
                >
                    <BookOpen className="text-indigo-500" size={18} />
                    {t('dash_journal_title') || 'Jurnal Harian'}
                    <ChevronRight className="ml-auto text-slate-400" size={16} />
                </Link>
                <Link
                    href="/goals"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/10"
                >
                    <Target className="text-amber-500" size={18} />
                    {t('dash_goal_progress') || 'Target Utama'}
                    <ChevronRight className="ml-auto text-slate-400" size={16} />
                </Link>
            </div>
        </div>
    );
}
