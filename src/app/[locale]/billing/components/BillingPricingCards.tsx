'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Check, Lock, Sparkles, Star } from 'lucide-react';

interface BillingPricingCardsProps {
    isAnnual: boolean;
    userPlanIndex: number;
    isExplicitPaid: boolean;
    trialIsActive: boolean;
    onCheckout: (plan: string) => void;
}

export default function BillingPricingCards({
    isAnnual,
    userPlanIndex,
    isExplicitPaid,
    trialIsActive,
    onCheckout
}: BillingPricingCardsProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const planHierarchy = ['explorer', 'architect', 'quantum', 'legendary', 'lifetime'];

    const getBtnProps = (plan: string, baseClass: string, text: string) => {
        const targetIndex = planHierarchy.indexOf(plan.toLowerCase());
        if (targetIndex === userPlanIndex && isExplicitPaid) {
            return { disabled: true, text: t('pricing_btn_current'), className: "w-full py-5 rounded-[2rem] font-black text-xs flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default" };
        }
        if (targetIndex < userPlanIndex && isExplicitPaid) {
            return { disabled: true, text: "Unavailable", className: "w-full py-5 rounded-[2rem] font-black text-xs flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default opacity-50" };
        }
        if (plan.toLowerCase() === 'architect' && trialIsActive) {
            return { disabled: false, text: isAnnual ? (locale === 'id' ? 'Kunci Pro (Hemat 40%)' : 'Lock Pro (Save 40%)') : (locale === 'id' ? 'Langganan Pro' : 'Subscribe to Pro'), className: baseClass };
        }
        return { disabled: false, text, className: baseClass };
    };

    return (
        <section style={{ marginBottom: '80px' }} className="px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                {/* 1. Explorer */}
                <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl">
                    <div className="mb-8">
                        <span className="text-xs font-black tracking-wide text-slate-400 dark:text-slate-500 mb-6 block">{t('pricing_l1_name')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">{t('pricing_free')}</span>
                        </div>
                    </div>
                    
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_explorer_desc')}</p>

                    <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_habit_max5')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_daily_planner_tasks')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_basic_finance_simple')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_standard_dashboards')}</span>
                        </li>
                        <li className="flex items-start gap-4 opacity-40">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Lock className="text-slate-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-500">{t('pricing_f_journal_goals_jobs_locked')}</span>
                        </li>
                        <li className="flex items-start gap-4 opacity-40">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Lock className="text-slate-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-500">{t('pricing_f_advanced_ai_locked')}</span>
                        </li>
                    </ul>

                    <button type="button" disabled className="w-full py-5 rounded-[2rem] font-black text-xs flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default">
                        {userPlanIndex === 0 ? t('pricing_btn_current') : 'Unavailable'}
                    </button>
                </div>

                {/* 2. Architect */}
                <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 hover:shadow-2xl">
                    <div className="mb-8">
                        <span className="text-xs font-black tracking-wide text-slate-400 dark:text-slate-500 mb-6 block">{t('pricing_l2_name')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                                {isAnnual ? (isId ? 'Rp 79k' : '$6.50') : (isId ? 'Rp 99k' : '$8.99')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mb-1">/{t('pricing_per_month_short')}</span>
                        </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_architect_desc')}</p>

                    <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                        <li className="flex items-center justify-center py-2 mb-2 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10 w-full">
                            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t('pricing_feature_header_explorer_plus')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_all_tabs_open')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_unlimited_habit')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_the_vault')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_finance_trends')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_batch_planner')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_neural_sync')}</span>
                        </li>
                    </ul>

                    <button 
                        type="button" 
                        disabled={getBtnProps('architect', '', '').disabled}
                        onClick={() => onCheckout('Architect')} 
                        className={getBtnProps('architect', "w-full py-5 rounded-[2rem] font-black text-xs transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/40", '').className}
                    >
                        {getBtnProps('architect', '', t('pricing_btn_upgrade')).text}
                    </button>
                </div>

                {/* 3. Quantum (AI Recommended) */}
                <div className="group relative flex flex-col p-8 rounded-[3.5rem] border-2 border-indigo-500 shadow-[0_0_80px_rgba(79,70,229,0.15)] lg:scale-105 z-10 bg-slate-900 border-indigo-900 transition-all duration-700 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rounded-[3.5rem] overflow-hidden" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-indigo-600 text-white text-[9px] font-black tracking-[0.2em] uppercase shadow-lg border border-white/20 animate-pulse">
                        {t('pricing_badge_ai_rec')}
                    </div>

                    <div className="mb-8 relative z-10">
                        <span className="text-xs font-black tracking-wide text-indigo-400 mb-6 block">{t('pricing_l3_name')}</span>
                        <div className="flex items-baseline gap-2 text-white">
                            <span className="text-4xl lg:text-5xl font-black tracking-tighter">
                                {isAnnual ? (isId ? 'Rp 129k' : '$12.00') : (isId ? 'Rp 169k' : '$15.00')}
                            </span>
                            <span className="text-[10px] font-bold opacity-50 mb-1">/{t('pricing_per_month_short')}</span>
                        </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed min-h-[44px] mb-8 relative z-10">{t('pricing_quantum_desc')}</p>

                    <ul className="space-y-4 mb-10 flex-grow relative z-10 border-t border-white/5 pt-8">
                        <li className="flex items-center justify-center py-2 mb-2 bg-white/5 rounded-xl border border-white/10 w-full">
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{t('pricing_feature_header_architect_plus')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Sparkles className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-white">{t('pricing_f_neural_ai')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_ai_stacking')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_ai_audit')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_sentiment_ai')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-indigo-200">{t('feat_resume_ai')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-indigo-400 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-indigo-200">{t('pricing_f_early_access')}</span>
                        </li>
                    </ul>

                    <button 
                        type="button" 
                        disabled={getBtnProps('quantum', '', '').disabled}
                        onClick={() => onCheckout('Quantum')} 
                        className={getBtnProps('quantum', "relative w-full py-6 rounded-[2rem] bg-white text-slate-950 font-black text-xs hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] z-10", '').className}
                    >
                        {getBtnProps('quantum', '', t('pricing_btn_unleash')).text}
                    </button>
                </div>

                {/* 4. Legendary */}
                <div className="group relative flex flex-col p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-black transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-[8px] font-black tracking-widest whitespace-nowrap shadow-lg">
                        {t('pricing_badge_founder')}
                    </div>

                    <div className="mb-8">
                        <span className="text-xs font-black tracking-wide text-amber-600 dark:text-amber-500 mb-6 block">{t('pricing_l4_name')}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tighter">
                                {isId ? 'Rp 1.299k' : '$99.00'}
                            </span>
                        </div>
                        <div className="text-[9px] font-black text-amber-500 mt-1 uppercase tracking-tighter">{t('pricing_lifetime')}</div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed min-h-[44px] mb-8">{t('pricing_legendary_desc')}</p>

                    <ul className="space-y-4 mb-10 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                        <li className="flex items-center justify-center py-2 mb-2 bg-amber-500/5 rounded-xl border border-amber-500/10 w-full">
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{t('pricing_feature_header_quantum_plus')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Star className="text-amber-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_lifetime_access')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-amber-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_legendary_trial_ai')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_founder_badge')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_neural_sync')}</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 flex items-center justify-center shrink-0">
                                <Check className="text-emerald-500 w-[14px] h-[14px]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black leading-tight text-slate-700 dark:text-slate-200">{t('pricing_f_vvip_support')}</span>
                        </li>
                    </ul>

                    <button 
                        type="button" 
                        disabled={getBtnProps('legendary', '', '').disabled}
                        onClick={() => onCheckout('Legendary')} 
                        className={getBtnProps('legendary', "w-full py-5 rounded-[2rem] font-black text-xs transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-amber-500/40", '').className}
                    >
                        {getBtnProps('legendary', '', t('pricing_btn_legendary')).text}
                    </button>
                </div>
            </div>
        </section>
    );
}
