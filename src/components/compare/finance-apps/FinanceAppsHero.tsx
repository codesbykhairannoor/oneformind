'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function FinanceAppsHero() {
    const t = useTranslations();

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }
            ` }} />

            {/* SECTION 1: HERO */}
            <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-indigo-50/50 relative border-b border-slate-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-200/30 to-indigo-200/30 rounded-full blur-2xl -z-10 "></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-emerald-200">
                            💰 {t('finapp_badge')}
                        </div>
                        
                        <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-slate-900 tracking-tight font-black">
                            {t('finapp_hero_title_1')}<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">{t('finapp_hero_title_2')}</span>
                        </h1>
                        
                        <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('finapp_hero_desc') }} />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                {t('finapp_hero_cta')} →
                            </Link>
                            <p className="py-4 text-sm text-slate-400 font-bold self-center">{t('finapp_hero_note')}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                        <div className="absolute top-10 right-0 w-64 bg-slate-900 border-4 border-slate-800 rounded-xl p-6 transform rotate-12 opacity-80 shadow-2xl z-0 font-mono">
                            <div className="text-center text-rose-500 text-[10px] mb-2 animate-pulse">⚠️ SYNC ERROR: BANK CONNECTION LOST</div>
                            <div className="space-y-2 opacity-50">
                                <div className="h-2 bg-slate-700 rounded w-full"></div>
                                <div className="h-2 bg-slate-700 rounded w-[80%]"></div>
                                <div className="h-2 bg-slate-700 rounded w-[90%]"></div>
                            </div>
                            <div className="mt-4 bg-slate-800 p-2 rounded text-center">
                                <p className="text-[8px] text-slate-500">RE-ENTER PASSWORD TO VIEW DATA</p>
                            </div>
                        </div>

                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Finance Card">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">💵</div>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{t('finapp_mockup_status')}</span>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 mb-2">{t('finapp_mockup_title')}</h3>
                            <p className="text-slate-400 text-sm mb-6">{t('finapp_mockup_desc')}</p>
                            
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                                     <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
                                     <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-emerald-200">✓</div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{t('finapp_mockup_stat_1')}</p>
                                    <p className="text-xs text-emerald-600 font-bold">{t('finapp_mockup_stat_2')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* EXPLORE MORE ALTERNATIVES */}
            <section className="py-[80px] px-6 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/compare/ynab" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-black">📈</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs YNAB</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_ynab_desc')}</p>
                        </Link>
                        
                        <Link href="/compare/wallet" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">💳</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Wallet App</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_wallet_desc')}</p>
                        </Link>
                        
                        <Link href="/compare/spendee" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">📊</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Spendee</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_spendee_desc')}</p>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
