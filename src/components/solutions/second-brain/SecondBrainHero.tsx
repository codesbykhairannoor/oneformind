'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SecondBrainHero() {
    const t = useTranslations();

    return (
        <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white relative border-b border-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] -z-10"></div>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl opacity-60 animate-pulse -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000 -z-10"></div>
            
            <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-white/80 border border-indigo-100 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-3 hover:rotate-0 transition duration-300 font-black select-none">
                        🧠
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-widest border border-indigo-100 shadow-sm">
                    {t('brain_hero_badge')}
                </div>
                
                <h1 className="text-6xl md:text-7xl mb-6 leading-tight text-slate-900 tracking-tight font-black">
                    {t('brain_hero_title_1')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {t('brain_hero_title_2')}
                    </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
                    {t('brain_hero_desc')}
                </p>
                
                <div className="flex justify-center gap-4 mb-24">
                    <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition transform hover:-translate-y-1 font-bold">
                        {t('brain_hero_cta')}
                    </Link>
                </div>

                {/* Visual Bawah (Glassmorphism Nodes Network) */}
                <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-80 flex justify-center items-center rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl border border-slate-800 perspective-1000">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                    {/* Node 1: Capture */}
                    <div className="absolute left-4 md:left-12 top-8 md:top-16 bg-white/10 p-5 rounded-3xl border border-white/10 z-10 transform -rotate-6 animate-float shadow-2xl text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-sm select-none">📥</div>
                            <span className="font-bold text-indigo-100 text-sm">{t('brain_mockup_1')}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-white/20 rounded-full"></div>
                    </div>

                    {/* Node 2: Organize */}
                    <div className="absolute bg-indigo-600/20 p-8 rounded-[2.5rem] border border-indigo-400/30 shadow-[0_0_50px_rgba(79,70,229,0.3)] z-20 scale-110">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl mb-3 drop-shadow-lg font-black select-none">🔮</span>
                            <h4 className="font-black text-white tracking-widest uppercase text-sm">{t('brain_mockup_2')}</h4>
                        </div>
                    </div>

                    {/* Node 3: Execute */}
                    <div className="absolute right-4 md:right-12 bottom-8 md:bottom-16 bg-white/10 p-5 rounded-3xl border border-white/10 z-10 transform rotate-6 animate-float-reverse shadow-2xl text-left">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-sm select-none">📓</div>
                            <span className="font-bold text-indigo-100 text-sm">{t('brain_mockup_3')}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-serif italic max-w-[120px]">"{t('brain_mockup_3_quote')}"</p>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/4 w-32 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-indigo-400 transform -rotate-12 -z-10 opacity-50"></div>
                    <div className="absolute top-1/2 right-1/4 w-32 md:w-48 h-0.5 bg-gradient-to-l from-transparent via-indigo-400 to-indigo-400 transform rotate-12 -z-10 opacity-50"></div>
                </div>
            </div>
        </header>
    );
}
