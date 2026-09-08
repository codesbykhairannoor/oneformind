'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

export default function LandingHero() {
    const t = useTranslations();

    return (
        <header className="relative pt-24 pb-40 lg:pt-32 lg:pb-56 overflow-hidden bg-white">
            {/* High-End Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-full bg-indigo-50/40 rounded-full blur-2xl -z-10"></div>
            
            {/* Floating UI Elements (Hardware Accelerated) */}
            <div className="absolute top-32 left-[5%] w-16 h-16 bg-white/90 rounded-[1.5rem] shadow-[0_10px_40px_rgba(79,70,229,0.15)] flex items-center justify-center text-2xl animate-[float_6s_ease-in-out_infinite] hidden xl:flex border border-white/80 z-20 pointer-events-none transform-gpu will-change-transform rotate-6">
                <span className="relative drop-shadow-sm">🚀</span>
            </div>
            
            <div className="absolute top-56 left-[18%] w-12 h-12 bg-white/90 rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.15)] flex items-center justify-center text-xl animate-[bounce-slow_5s_ease-in-out_infinite_0.5s] hidden xl:flex border border-white/80 z-20 pointer-events-none transform-gpu will-change-transform -rotate-12">
                <span className="relative drop-shadow-sm">💎</span>
            </div>

            <div className="absolute top-24 right-[10%] w-20 h-20 bg-white/90 rounded-[2rem] shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex items-center justify-center text-3xl animate-[float_7s_ease-in-out_infinite_1s] hidden xl:flex border border-white/80 z-20 pointer-events-none transform-gpu will-change-transform -rotate-6">
                <span className="relative drop-shadow-sm">🧠</span>
            </div>

            <div className="absolute bottom-60 left-[8%] w-14 h-14 bg-white/90 rounded-2xl shadow-[0_15px_40px_rgba(168,85,247,0.15)] flex items-center justify-center text-2xl animate-[bounce-slow_6s_ease-in-out_infinite_1.5s] hidden xl:flex border border-white/80 z-20 pointer-events-none transform-gpu will-change-transform rotate-12">
                <span className="relative drop-shadow-sm">📈</span>
            </div>

            <div className="absolute bottom-80 right-[8%] w-16 h-16 bg-white/90 rounded-[1.5rem] shadow-[0_15px_40px_rgba(239,68,68,0.15)] flex items-center justify-center text-2xl animate-[float_5.5s_ease-in-out_infinite_0.2s] hidden xl:flex border border-white/80 z-20 pointer-events-none transform-gpu will-change-transform rotate-3">
                <span className="relative drop-shadow-sm">⚡</span>
            </div>

            <div className="absolute bottom-40 right-[20%] w-10 h-10 bg-white/80 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex items-center justify-center text-lg animate-[bounce-slow_4.5s_ease-in-out_infinite_2s] hidden xl:flex border border-white/50 z-20 pointer-events-none transform-gpu will-change-transform -rotate-6">
                <span className="relative drop-shadow-sm">🔥</span>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 font-bold text-[10px] mb-8 tracking-widest uppercase shadow-sm">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                    {t('hero_premium_badge')}
                </div>
                
                {/* Balanced Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 tracking-[-0.03em] text-slate-900 font-[900] leading-[1.05] max-w-6xl mx-auto">
                    {t('hero_premium_title_1')} 
                    <span className="text-indigo-600 block mt-2">
                        {t('hero_premium_title_2')}
                    </span>
                </h1>
                
                {/* Subheading */}
                <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium opacity-80">
                    {t('hero_premium_desc')}
                </p>
                
                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link 
                        href="/register" 
                        onClick={() => trackCTAClick('hero_primary', 'Start Exclusively', '/register')}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
                    >
                        {t('hero_premium_cta_primary')}
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                    <Link 
                        href="/about" 
                        onClick={() => trackCTAClick('hero_secondary', 'See Design Philosophy', '/about')}
                        className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all transform hover:-translate-y-1 active:scale-95 text-center"
                    >
                        {t('hero_premium_cta_secondary')}
                    </Link>
                </div>

                {/* CRO Frictionless Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500 max-w-xl mx-auto mb-20">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Free Forever Plan</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>No Credit Card Required</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Setup in 30 Seconds</span>
                    </div>
                </div>

                {/* High-Fidelity App UI */}
                <div className="relative max-w-6xl mx-auto mt-24">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full h-80 bg-gradient-to-b from-indigo-500/10 to-transparent blur-2xl rounded-full transform-gpu pointer-events-none"></div>
                    
                    {/* Core Value Visuals (3 Pillars) */}
                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Card 1: Habit Matrix */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl transform-gpu md:-translate-y-12 hover:-translate-y-16 transition-transform duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors transform-gpu"></div>
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">🌱</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{t('hero_card_1_title')}</h3>
                            <p className="text-sm text-slate-500 mb-8">{t('hero_card_1_desc')}</p>
                            
                            <div className="grid grid-cols-7 gap-1.5">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div key={i} className={`w-full aspect-square rounded-[4px] opacity-80 group-hover:opacity-100 transition-opacity ${i % 5 === 0 ? 'bg-emerald-100' : [300, 400, 500, 600][i % 4] ? 'bg-emerald-' + [300, 400, 500, 600][i % 4] : 'bg-emerald-500'}`} />
                                ))}
                            </div>
                        </div>

                        {/* Card 2: Finance OS */}
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transform-gpu hover:-translate-y-4 transition-transform duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors transform-gpu"></div>
                            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-indigo-500/30">💰</div>
                            <h3 className="text-xl font-black text-white mb-2">{t('hero_card_2_title')}</h3>
                            <p className="text-sm text-slate-400 mb-8">{t('hero_card_2_desc')}</p>
                            
                            <div className="space-y-3 relative z-10">
                                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs">☕</div>
                                        <span className="text-slate-300 text-sm font-medium">{t('hero_card_2_item_1')}</span>
                                    </div>
                                    <span className="text-white font-bold text-sm">-$4.50</span>
                                </div>
                                <div className="bg-indigo-600/20 p-4 rounded-2xl border border-indigo-500/30 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-500/30 text-indigo-300 rounded-full flex items-center justify-center text-xs">💼</div>
                                        <span className="text-indigo-200 text-sm font-medium">{t('hero_card_2_item_2')}</span>
                                    </div>
                                    <span className="text-indigo-400 font-bold text-sm">+$4,200</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Deep Focus */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl transform-gpu md:-translate-y-12 hover:-translate-y-16 transition-transform duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors transform-gpu"></div>
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">🎯</div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{t('hero_card_3_title')}</h3>
                            <p className="text-sm text-slate-500 mb-8">{t('hero_card_3_desc')}</p>
                            
                            <div className="relative">
                                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-6 h-6 rounded-full bg-amber-500 border-4 border-white shadow-sm flex-shrink-0"></div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 text-sm font-bold text-slate-700">{t('hero_card_3_item_1')}</div>
                                    </div>
                                    <div className="flex gap-4 items-center opacity-50">
                                        <div className="w-6 h-6 rounded-full bg-slate-300 border-4 border-white shadow-sm flex-shrink-0"></div>
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 text-sm font-medium text-slate-500 line-through">{t('hero_card_3_item_2')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating AI Decoration */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-auto bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl z-30 hidden md:flex items-center gap-4 transform-gpu animate-[float_4s_ease-in-out_infinite]">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md text-xl">✨</div>
                        <div className="pr-4">
                            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{t('hero_floating_ai_title')}</div>
                            <div className="text-white text-sm font-black">{t('hero_floating_ai_desc')}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) rotate(-3deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(6deg); }
                    50% { transform: translateY(10px) rotate(6deg); }
                }
                .animate-bounce-slow { animation: bounce-slow 6s ease-in-out infinite; }
                .animate-float { animation: float 8s ease-in-out infinite; }
            ` }} />
        </header>
    );
}
