'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

export default function LandingBottomCTA() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    return (
        <section className="py-16 sm:py-28 lg:py-36 px-4 sm:px-6 text-center relative overflow-hidden bg-slate-950 border-t border-slate-900">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-emerald-600/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow max-w-[100vw]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xs mb-6 sm:mb-8 tracking-wider uppercase border border-indigo-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{isId ? 'SISTEM SIAP PAKAI' : 'READY-TO-USE LIFE OS'}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.12] tracking-[-0.035em] text-white font-black max-w-3xl mx-auto">
                    {t('cta_final_title')}
                </h2>

                <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-xl mx-auto font-normal leading-relaxed">
                    {t('cta_final_desc')}
                </p>
                
                <div className="flex flex-col items-center gap-6">
                    <Link 
                        href="/register" 
                        onClick={() => trackCTAClick('final_cta_section', 'Get Started Free', '/register')}
                        className="relative overflow-hidden group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 font-sans cursor-pointer text-center"
                    >
                        <span className="relative z-10">{t('cta_final_btn')}</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    </Link>

                    {/* Compliant Trust Badges (No Free Tier Mentions) */}
                    <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-4 sm:gap-x-6 text-xs sm:text-sm font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span> {isId ? '8 Modul Siap Pakai' : '8 Complete Modules Ready'}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span> {isId ? 'Setup dalam 30 Detik' : '30-Second Instant Setup'}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold">✓</span> {isId ? '100% Private & Terenkripsi' : '100% Private & Encrypted'}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
