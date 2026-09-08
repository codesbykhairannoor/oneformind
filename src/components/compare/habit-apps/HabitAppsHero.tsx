'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HabitAppsHero() {
    const t = useTranslations();

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            ` }} />

            {/* SECTION 1: HERO */}
            <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-green-200">
                            🌱 {t('habitap_badge')}
                        </div>
                        
                        <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                            {t('habitap_hero_title_1')}<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('habitap_hero_title_2')}</span>
                        </h1>
                        
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('habitap_hero_desc') }} />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                {t('habitap_hero_cta')} →
                            </Link>
                            <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('habitap_hero_note')}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                        <div className="absolute top-10 right-0 w-64 bg-gray-900 border-4 border-gray-800 rounded-xl p-6 transform rotate-12 opacity-80 shadow-2xl z-0 font-mono">
                            <div className="text-center text-red-500 text-xs mb-2 animate-pulse">💔 STREAK BROKEN</div>
                            <div className="flex justify-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gray-700 rounded-sm"></div>
                                <div className="w-8 h-8 bg-gray-700 rounded-sm"></div>
                                <div className="w-8 h-8 bg-transparent border-2 border-dashed border-gray-700 rounded-sm"></div>
                            </div>
                            <div className="bg-red-900/50 p-2 rounded text-center border border-red-900">
                                <p className="text-red-400 text-[10px] uppercase">Level Down</p>
                                <p className="text-white font-bold">-50 XP</p>
                            </div>
                        </div>

                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Growth Card">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('habitap_mockup_status')}</span>
                            </div>
                            <h3 className="font-black text-2xl text-gray-900 mb-2">{t('habitap_mockup_title')}</h3>
                            <p className="text-gray-400 text-sm mb-6">{t('habitap_mockup_desc')}</p>
                            
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="relative w-16 h-16 shrink-0">
                                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                        <path className="text-indigo-600 drop-shadow-lg" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-900">1%</div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{t('habitap_mockup_stat_1')}</p>
                                    <p className="text-xs text-gray-400">{t('habitap_mockup_stat_2')}</p>
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
                        <Link href="/compare/habitica" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-black">⚔️</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">vs Habitica</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_habitica_desc')}</p>
                        </Link>
                        
                        <Link href="/compare/streaks" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl font-black">🔗</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors">vs Streaks</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_streaks_desc')}</p>
                        </Link>
                        
                        <Link href="/compare/habitify" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">📱</div>
                                <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs Habitify</h3>
                            </div>
                            <p className="text-gray-500 text-sm">{t('explore_habitify_desc')}</p>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
