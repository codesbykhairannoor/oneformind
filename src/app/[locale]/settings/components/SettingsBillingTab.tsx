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
                        ? 'Setiap pengguna mendapatkan akses gratis ke seluruh 8 modul Life OS utama. Anda dapat menyesuaikan tampilan modul di Pengaturan Modul. Upgrade ke Architect/Quantum untuk fitur AI Coach dan analitik mendalam.'
                        : 'Every user gets free access to all 8 core Life OS modules. Customize module visibility anytime in Module Settings. Upgrade to Architect/Quantum for AI Coach and deep analytics.'}
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
                            ? 'Pahami akses modul dan fitur eksklusif antar paket:'
                            : 'Understand module access and exclusive feature privileges by tier:'}
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
                                {isIndo ? 'Pondasi awal gratis tanpa kartu kredit dengan akses penuh ke seluruh 8 modul utama.' : 'Free foundation without credit card with full access to all 8 core modules.'}
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Akses Gratis Seluruh 8 Modul Life OS' : 'Free Access to All 8 Life OS Modules'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Bebas atur & tampilkan modul kapan saja' : 'Customize & toggle module display anytime'}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Gratis selamanya tanpa batas waktu' : 'Free forever with no time limits'}</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-400">
                                    <X size={14} className="text-rose-400 mt-0.5 shrink-0" />
                                    <span className="font-semibold text-rose-500/80">{isIndo ? 'AI Coach TIDAK tersedia' : 'AI Coach NOT included'}</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push('/billing')}
                            className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <span>{isIndo ? 'Buka Halaman Billing' : 'Open Billing Page'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Architect */}
                    <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">POPULER</span>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Advanced</span>
                            </div>
                            <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2">Architect</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {isIndo ? 'Akses fitur advanced, sinkronisasi mendalam & opsi trial AI Coach.' : 'Access advanced features, deep sync & AI Coach trial options.'}
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                                    <Check size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                                    <span>{isIndo ? 'Akses Fitur Advanced & Integrasi Lintas Modul' : 'Advanced Features & Cross-Module Integration'}</span>
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

                        <button
                            type="button"
                            onClick={() => router.push('/billing')}
                            className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <span>{isIndo ? 'Pilih / Upgrade ke Architect' : 'Select Architect Plan'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
                            className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isIndo ? 'Pilih / Upgrade ke Quantum' : 'Select Quantum Plan'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Direct Link Action Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h5 className="text-base font-black flex items-center justify-center sm:justify-start gap-2 text-white">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>{isIndo ? 'Pusat Tagihan, Riwayat Invoice, & Checkout' : 'Billing Hub, Invoices & Checkout'}</span>
                    </h5>
                    <p className="text-xs text-slate-300 max-w-lg">
                        {isIndo
                            ? 'Buka halaman billing utama untuk melihat detail metode pembayaran, riwayat langganan, atau upgrade instan.'
                            : 'Open the main billing page to manage payment methods, invoice receipts, or upgrade instantly.'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => router.push('/billing')}
                    className="shrink-0 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                    <span>{isIndo ? 'Buka Halaman Billing & Checkout' : 'Go to Billing & Checkout'}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                </button>
            </div>
        </div>
    );
}
