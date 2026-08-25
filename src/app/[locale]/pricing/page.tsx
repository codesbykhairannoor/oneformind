'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link, useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import { ChevronDown, Check, Lock, Sparkles, Star } from 'lucide-react';

export default function PricingPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const { data: session } = useSession();
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const isId = locale === 'id';

    const faqs = [
        { q: t('pricing_faq_1_q'), a: t('pricing_faq_1_a') },
        { q: t('pricing_faq_2_q'), a: t('pricing_faq_2_a') },
        { q: t('pricing_faq_3_q'), a: t('pricing_faq_3_a') },
        { q: t('pricing_faq_4_q'), a: t('pricing_faq_4_a') },
    ];

    const features = [
        [t('pricing_f_active_habits'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_planner_engine'), t('pricing_v_batch'), t('pricing_v_batch'), t('pricing_v_ai_powered')],
        [t('pricing_f_vault_savings'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_ai_assistant'), '—', '—', t('pricing_v_247_access')],
        [t('pricing_f_life_insights'), t('pricing_v_basic'), t('pricing_v_advanced'), t('pricing_v_predictive')],
        [t('pricing_f_custom_modules'), '—', t('pricing_v_partial'), t('pricing_v_full')],
    ];

    const modules = [
        ['Journal Tracker', '—', '✓', '✓'],
        ['Goal Tracker', '—', '✓', '✓'],
        ['Job Application', '—', '✓', '✓'],
        ['Calendar Timeline', '—', '✓', '✓'],
    ];

    const handleCheckout = (planId: string) => {
        if (session?.user) {
            router.push(`/billing`);
            return;
        }

        const authString = localStorage.getItem('oneformind_auth');
        if (authString) {
            try {
                const auth = JSON.parse(authString);
                if (auth.isAuthenticated) {
                    router.push(`/billing`);
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }
        router.push(`/register?plan=${planId}`);
    };

    return (
        <GuestLayout user={session?.user}>
            <main id="pricing-page" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
                {/* HERO */}
                <header style={{ marginBottom: '80px' }} className="pt-32 pb-16 px-6 relative text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[800px] bg-[radial-gradient(circle_at_50%_0%,#4f46e515_0,transparent_50%)] -z-10" />
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-black text-[10px] mb-10 uppercase tracking-[0.3em] shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            {t('pricing_badge')}
                        </div>

                        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.95 }} className="text-slate-900 dark:text-white tracking-tighter font-black">
                            {t('pricing_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                                {t('pricing_title_2')}
                            </span>
                        </h1>

                        <p style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-bold">
                            {t('pricing_subtitle')}
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-6 pt-4">
                            <span className={`text-sm font-black transition-all duration-300 ${!isAnnual ? 'text-slate-900 dark:text-white scale-110' : 'text-slate-400 opacity-50'}`}>
                                {t('pricing_monthly')}
                            </span>

                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="relative w-20 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 transition-all duration-500 hover:scale-105 shadow-inner"
                            >
                                <div className={`w-6 h-6 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-xl transform transition-transform duration-500 ${isAnnual ? 'translate-x-10' : 'translate-x-0'}`} />
                            </button>

                            <span className={`text-sm font-black transition-all duration-300 ${isAnnual ? 'text-slate-900 dark:text-white scale-110' : 'text-slate-400 opacity-50'}`}>
                                {t('pricing_yearly')}
                            </span>

                            <div className="hidden sm:block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 animate-bounce">
                                {t('pricing_billing_save')}
                            </div>
                        </div>
                    </div>
                </header>

                {/* PRICING GRID */}
                <section style={{ marginBottom: '80px' }} className="pb-32 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                        {/* 1. Explorer */}
                        <div className="group relative flex flex-col p-10 rounded-[3rem] bg-white/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-4 transition-all duration-700 hover:shadow-2xl">
                            <div className="mb-10">
                                <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{t('pricing_l1_name')}</span>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">{t('pricing_free')}</span>
                                </div>
                            </div>
                            
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-10 leading-relaxed min-h-[48px]">{t('pricing_explorer_desc')}</p>

                            <ul className="space-y-4 mb-12 flex-grow">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_habit_max5')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_daily_planner_tasks')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_basic_finance_simple')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_standard_dashboards')}</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-40">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-[8px] font-black">🔒</div>
                                    <span className="text-xs font-bold text-slate-500">{t('pricing_f_journal_goals_jobs_locked')}</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-40">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-[8px] font-black">🔒</div>
                                    <span className="text-xs font-bold text-slate-500">{t('pricing_f_advanced_ai_locked')}</span>
                                </li>
                            </ul>

                            <button onClick={() => handleCheckout('Explorer')} className="w-full py-5 rounded-3xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-black text-xs text-center border border-slate-200 dark:border-slate-600 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none">
                                {t('pricing_free_btn')}
                            </button>
                        </div>

                        {/* 2. Architect */}
                        <div className="group relative flex flex-col p-10 rounded-[3rem] bg-white dark:bg-slate-800 border-4 border-indigo-50 dark:border-indigo-950/50 shadow-2xl hover:-translate-y-4 transition-all duration-700">
                            <div className="mb-10">
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-[0.2em] uppercase">{t('pricing_l2_name')}</span>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                                        {isAnnual ? (isId ? 'Rp 79k' : '$4.99') : (isId ? 'Rp 99k' : '$6.99')}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 tracking-tighter">/{t('pricing_per_month_short')}</span>
                                </div>
                            </div>

                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-10 leading-relaxed min-h-[48px]">{t('pricing_architect_desc')}</p>

                            <ul className="space-y-4 mb-12 flex-grow border-t border-slate-50 dark:border-slate-700 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl border border-indigo-100 dark:border-indigo-500/10">
                                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t('pricing_feature_header_explorer_plus')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-black italic">★</div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{t('pricing_f_all_tabs_open')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_unlimited_habit')} & {t('pricing_v_batch')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_the_vault')} ({t('feat_budgeting')} & {t('pricing_f_vault_savings')})</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_finance_trends')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_batch_planner')} & CRM</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_neural_sync')} & {t('pricing_storage_usage')}</span>
                                </li>
                            </ul>

                            <button onClick={() => handleCheckout('Architect')} className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95">
                                {t('pricing_pro_btn')}
                            </button>
                        </div>

                        {/* 3. Quantum (AI Recommended) */}
                        <div className="group relative flex flex-col p-10 rounded-[3.5rem] bg-slate-900 border-4 border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.15)] lg:scale-105 z-10 hover:-translate-y-4 transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rounded-[3.5rem] overflow-hidden" />
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-indigo-600 text-white text-[9px] font-black tracking-[0.2em] uppercase shadow-lg border border-white/20 animate-pulse">
                                {t('pricing_badge_ai_rec')}
                            </div>

                            <div className="mb-10 relative">
                                <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">{t('pricing_l3_name')}</span>
                                <div className="mt-4 flex items-baseline gap-1 text-white">
                                    <span className="text-4xl font-black">
                                        {isAnnual ? (isId ? 'Rp 109k' : '$6.99') : (isId ? 'Rp 159k' : '$9.99')}
                                    </span>
                                    <span className="text-xs font-bold opacity-50 tracking-tighter">/{t('pricing_per_month_short')}</span>
                                </div>
                            </div>

                            <p className="text-xs font-bold text-slate-400 mb-10 leading-relaxed min-h-[48px]">{t('pricing_quantum_desc')}</p>

                            <ul className="space-y-4 mb-12 flex-grow relative border-t border-white/5 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{t('pricing_feature_header_architect_plus')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[14px]">🤖</span>
                                    <span className="text-xs font-black text-white">{t('pricing_f_neural_ai')} ({t('pricing_v_unlimited')} Chat)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[8px] font-black animate-pulse">✨</div>
                                    <span className="text-xs font-bold text-indigo-200">{t('feat_ai_stacking')} & Behavioral Audit</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[8px] font-black">🧠</div>
                                    <span className="text-xs font-bold text-indigo-200">{t('feat_ai_audit')} & {t('pricing_f_ai_finance_insights')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[8px] font-black">📝</div>
                                    <span className="text-xs font-bold text-indigo-200">{t('feat_sentiment_ai')} & Mental Analysis</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[8px] font-black">📄</div>
                                    <span className="text-xs font-bold text-indigo-200">{t('feat_resume_ai')} & Job Matching</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-medium text-slate-400">{t('pricing_f_early_access')} AI</span>
                                </li>
                            </ul>

                            <button onClick={() => handleCheckout('Quantum')} className="relative w-full py-6 rounded-[2rem] bg-white text-slate-950 font-black text-xs hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                {t('pricing_btn_unleash_neural')}
                            </button>
                        </div>

                        {/* 4. Legendary */}
                        <div className="group relative flex flex-col p-10 rounded-[3rem] bg-white dark:bg-black border border-slate-200 dark:border-slate-800 hover:-translate-y-4 transition-all duration-700 hover:shadow-2xl">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-[8px] font-black tracking-widest whitespace-nowrap shadow-lg">
                                {t('pricing_badge_founder')}
                            </div>

                            <div className="mb-10">
                                <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 tracking-[0.2em] uppercase">{t('pricing_l4_name')}</span>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">{isId ? 'Rp 899k' : '$59.00'}</span>
                                </div>
                                <div className="text-[9px] font-black text-amber-500 mt-1 uppercase tracking-tighter">{t('pricing_lifetime')}</div>
                            </div>

                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-10 leading-relaxed min-h-[48px]">{t('pricing_legendary_desc')}</p>

                            <ul className="space-y-4 mb-12 flex-grow border-t border-slate-50 dark:border-slate-800 pt-8">
                                <li className="flex items-center justify-center py-2 mb-2 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{t('pricing_feature_header_quantum_plus')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[14px]">💎</span>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{t('pricing_f_lifetime_access')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-[8px] font-black">★</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_legendary_trial_ai')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_founder_badge')} & VIP</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[8px] font-black">✓</div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('pricing_f_neural_sync')}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-emerald-500">✓</div>
                                    <span className="text-xs font-medium text-slate-500">{t('pricing_f_vvip_support')}</span>
                                </li>
                            </ul>

                            <button onClick={() => handleCheckout('Legendary')} className="w-full py-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs hover:bg-black dark:hover:bg-slate-200 shadow-xl transition-all active:scale-95">
                                {t('pricing_l4_btn')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* EXPANDED COMPARISON TABLE */}
                <section style={{ marginBottom: '80px' }} className="py-40 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="max-w-6xl mx-auto px-6 space-y-12">
                        <div className="text-center space-y-2 mb-24">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                                {t('pricing_compare_title')}
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-bold uppercase tracking-[0.4em]">{t('pricing_compare_subtitle')}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest">
                                        <th className="p-8 opacity-60">{t('pricing_feature_col_name')}</th>
                                        <th className="p-8 text-center">Explorer</th>
                                        <th className="p-8 text-center text-indigo-400">{t('pricing_architect_title')}</th>
                                        <th className="p-8 text-center text-amber-500">{t('pricing_quantum_title')}+</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-700 text-xs font-bold">
                                    {features.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-200">{row[0]}</td>
                                            <td className="p-6 text-center text-slate-400">{row[1]}</td>
                                            <td className="p-6 text-center text-indigo-600 dark:text-indigo-400">{row[2]}</td>
                                            <td className="p-6 text-center text-amber-600 dark:text-amber-500">{row[3]}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                                        <td colSpan={4} className="p-4 px-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Modules</td>
                                    </tr>
                                    {modules.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-200">{row[0]}</td>
                                            <td className="p-6 text-center text-slate-200 dark:text-slate-800 text-xs">—</td>
                                            <td className="p-6 text-center text-emerald-500 text-xs font-black">✓</td>
                                            <td className="p-6 text-center text-emerald-500 text-xs font-black">✓</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-28 max-w-4xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-4">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                            {t('pricing_faq_title')}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-bold leading-relaxed border-t border-slate-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
