'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Sparkles, ArrowRight } from 'lucide-react';
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

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-800 dark:text-white tracking-tight">
                    {t('settings_billing_section_title')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 mt-1">
                    {t('settings_billing_section_desc')}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="space-y-3 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t('settings_billing_current_label')}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">{planLabel}</span>
                            {trial.isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    {locale === 'id' ? `⚡ Trial: ${trial.daysRemaining} Hari Tersisa` : `⚡ Trial: ${trial.daysRemaining} Days Left`}
                                </span>
                            ) : isPremium ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {t('settings_billing_active_badge')}
                                </span>
                            ) : null}
                        </div>

                        {trial.isActive && (
                            <div className="max-w-md pt-1">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                                    <span>{locale === 'id' ? `Hari ke-${trial.daysUsed + 1} dari 14` : `Day ${trial.daysUsed + 1} of 14`}</span>
                                    <span>{trial.percentRemaining}% tersisa</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, Math.max(8, ((14 - trial.daysRemaining) / 14) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {premiumUntilFormatted ? (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                <span className="text-slate-500 dark:text-slate-400">
                                    {trial.isActive ? (locale === 'id' ? 'Masa percobaan berakhir pada: ' : 'Trial expires on: ') : `${t('billing_valid_until')}: `}
                                </span>
                                <span className="font-semibold">{premiumUntilFormatted}</span>
                            </p>
                        ) : (
                            !isExplorer && isPremium && (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {t('settings_billing_no_expiry')}
                                </p>
                            )
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/billing')}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/40 transition hover:bg-indigo-700 dark:shadow-none"
                    >
                        {trial.isActive ? (locale === 'id' ? 'Kunci Diskon Pro (40%)' : 'Lock Pro Discount (40%)') : t('settings_billing_open_pricing')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-600/50 pt-4">
                    {t('settings_billing_pricing_note')}
                </p>
            </div>
        </div>
    );
}
