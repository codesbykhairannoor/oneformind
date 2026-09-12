'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Sparkles, ArrowRight, Check, X, Lock, Brain, Layers, ShieldCheck } from 'lucide-react';
import { TrialStatus } from '@/lib/auth/subscription';

interface SettingsBillingTabProps {
    planLabel: string;
    trial: TrialStatus;
    isPremium: boolean;
    isExplorer: boolean;
    premiumUntilFormatted: string | null;
}

export default function SettingsBillingTab({
    planLabel,
    trial,
    isPremium,
    isExplorer,
    premiumUntilFormatted,
}: SettingsBillingTabProps) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const isIndo = locale === 'id';

    const totalDays = trial.totalDays || 30;

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-800 dark:text-white tracking-tight">
                    {t('settings_billing_section_title') || (isIndo ? 'Paket & Langganan Akun' : 'Plans & Billing')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 mt-1">
                    {isIndo 
                        ? 'Kelola tier akun Anda, pantau masa aktif percobaan, dan bandingkan kapabilitas fitur antar paket.'
                        : 'Manage your plan tier, track your trial period, and review feature privileges across tiers.'}
                </p>
            </div>

            {/* Current Plan Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="space-y-3 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t('settings_billing_current_label') || (isIndo ? 'Paket Anda Saat Ini' : 'Current Plan')}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{planLabel}</span>
                            {trial.isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    {isIndo ? `⚡ Trial: ${trial.daysRemaining} Hari Tersisa` : `⚡ Trial: ${trial.daysRemaining} Days Left`}
                                </span>
                            ) : isPremium ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {t('settings_billing_active_badge') || (isIndo ? 'Aktif' : 'Active')}
                                </span>
                            ) : null}
                        </div>

                        {trial.isActive && (
                            <div className="max-w-md pt-1">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                                    <span>{isIndo ? `Hari ke-${trial.daysUsed + 1} dari 14 (Trial Kartu Kredit: Semua Tab & AI Terbuka)` : `Day ${trial.daysUsed + 1} of 14 (Card Trial: All Tabs & AI Open)`}</span>
                                    <span>{trial.daysRemaining} {isIndo ? 'hari tersisa' : 'days left'}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, Math.max(5, ((14 - trial.daysRemaining) / 14) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {premiumUntilFormatted ? (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                <span className="text-slate-500 dark:text-slate-400">
                                    {trial.isActive ? (isIndo ? 'Masa percobaan 30 hari berakhir pada: ' : '30-day trial expires on: ') : `${t('billing_valid_until') || 'Berlaku hingga'}: `}
                                </span>
                                <span className="font-semibold">{premiumUntilFormatted}</span>
                            </p>
                        ) : (
                            !isExplorer && isPremium && (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {t('settings_billing_no_expiry') || (isIndo ? 'Langganan aktif tanpa batas waktu (Lifetime)' : 'Active lifetime subscription')}
                                </p>
                            )
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/billing')}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/40 transition hover:bg-indigo-700 dark:shadow-none"
                    >
                        <span>{trial.isActive ? (isIndo ? 'Upgrade / Buka Semua' : 'Upgrade Plans') : (isIndo ? 'Kelola Langganan' : 'Manage Subscription')}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-600/50 pt-4">
                    {isIndo
                        ? 'Tersedia 2 jalur: (1) Trial 14 Hari dengan Kartu Kredit yang membuka SEMUA 8 Tab + AI Coach ($0 hari ini, batal kapan saja), atau (2) Free 3-Tab tanpa kartu kredit dengan masa bebas tukar 30 hari.'
                        : 'Two trial options: (1) 14-Day Card Trial unlocking ALL 8 Tabs + AI Coach ($0 today, cancel anytime), or (2) Free 3-Tab tier with 30-day swap trial without a credit card.'}
                </p>
            </div>

            {/* Plan Comparison & Feature Rules Matrix */}
            <div>
                <div className="mb-4">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {isIndo ? 'Struktur Paket & Hak Akses Fitur' : 'Tier Privileges & Feature Rules'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isIndo
                            ? 'Pahami batasan tab dan akses fitur eksklusif antar paket:'
                            : 'Understand active tab limits and exclusive feature access by tier:'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free / Explorer */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase text-slate-400">FREE TIER</span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Rp 0</span>
                            </div>
                            <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2">Explorer</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {isIndo ? 'Pondasi awal gratis tanpa kartu kredit untuk fokus pada 3 tab esensial.' : 'Free foundation without credit card focused on 3 core tabs.'}
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Pilih 3 Tab Bebas (Tanpa Kartu Kredit)' : 'Pick 3 Free Tabs (No Card Needed)'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Bebas tukar 3 tab selama 30 hari' : 'Free to swap 3 tabs for 30 days'}</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-400">
                                    <Lock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <span>{isIndo ? '3 Tab terkunci permanen setelah 30 hari' : '3 Tabs lock after 30 days'}</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-400">
                                    <X size={14} className="text-rose-400 mt-0.5 shrink-0" />
                                    <span className="font-semibold text-rose-500/80">{isIndo ? 'AI Coach TIDAK tersedia' : 'AI Coach NOT included'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Architect */}
                    <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">POPULER</span>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Semua Tab</span>
                            </div>
                            <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2">Architect</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {isIndo ? 'Buka seluruh modul tanpa batas kuota tab & tanpa kunci permanen.' : 'Unlock all 8 modules without any tab limit or lock.'}
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                                    <Check size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Buka SEMUA 8 Tab Tanpa Batas' : 'Unlock ALL 8 Modules Unlimited'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-amber-700 dark:text-amber-300 font-semibold">{isIndo ? 'Trial 14 Hari Kartu Kredit ($0): Buka Semua Tab + AI' : '14-Day Card Trial ($0): Unlocks All Tabs + AI'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Sinkronisasi penuh lintas modul' : 'Full cross-tab integration'}</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-400">
                                    <X size={14} className="text-rose-400 mt-0.5 shrink-0" />
                                    <span className="font-semibold text-rose-500/80">{isIndo ? 'AI Coach setelah trial hanya di Quantum' : 'AI Coach post-trial requires Quantum'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Quantum */}
                    <div className="p-5 rounded-2xl border-2 border-purple-500/60 dark:border-purple-500/40 bg-gradient-to-b from-purple-50/40 to-pink-50/20 dark:from-purple-950/30 dark:to-slate-900 shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                                    AI POWERED
                                </span>
                                <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2">Quantum</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {isIndo ? 'Pengalaman Neural OS penuh dengan bimbingan asisten AI terpadu.' : 'Full Neural OS intelligence with dedicated 24/7 AI companion.'}
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Semua keunggulan Architect (8 Tab)' : 'All Architect features (8 Tabs)'}</span>
                                </li>
                                <li className="flex items-start gap-2 font-bold text-purple-700 dark:text-purple-300">
                                    <Sparkles size={14} className="text-purple-600 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Neural AI Life Coach 24/7' : '24/7 Neural AI Life Coach'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Audit otomatis habit & keuangan' : 'Automated habit & finance audits'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Analisis korelasi neuro-psikologis' : 'Predictive performance analytics'}</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push('/billing')}
                            className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black shadow-md shadow-indigo-400/20 transition-all hover:scale-[1.02]"
                        >
                            {isIndo ? 'Pilih Quantum Plan' : 'Select Quantum Plan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
