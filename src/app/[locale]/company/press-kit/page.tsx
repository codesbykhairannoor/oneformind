'use client';

import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';

export default function PressKitPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            {/* ================================================================= */}
            {/* SECTION 1: HERO - MEDIA CENTER */}
            {/* ================================================================= */}
            <header className="pt-40 pb-20 px-6 text-center relative overflow-hidden bg-white">
                {/* Soft Decorative Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-50/50 via-white to-white rounded-full blur-3xl -z-10"></div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-700 font-black text-[10px] mb-8 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                        🚀 {t('press_kit_title')}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl mb-8 leading-[0.95] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-black">
                        {t('press_kit_subtitle')}
                    </h1>
                    
                    <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                        {t('press_kit_bio_desc')}
                    </p>
                </div>
            </header>

            {/* ================================================================= */}
            {/* SECTION 2: BENTO ASSET GRID */}
            {/* ================================================================= */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* BIG CARD: PRIMARY BRANDING */}
                        <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-[3rem] p-10 overflow-hidden relative group">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-slate-900 mb-4">{t('press_kit_logo_title')}</h2>
                                <p className="text-slate-500 font-medium mb-8 max-w-md">{t('press_kit_logo_desc')}</p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <a href="/favicon.svg" download className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                        {t('press_kit_download_svg')}
                                    </a>
                                    <a href="/favicon.png" download className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition">
                                        {t('press_kit_download_png')}
                                    </a>
                                </div>
                            </div>
                            
                            {/* Visual Decoration */}
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white rounded-full border border-slate-100 flex items-center justify-center rotate-12 group-hover:rotate-0 transition duration-700">
                                <img src="/favicon.svg" className="w-40 h-40 opacity-20" alt="Logo" />
                            </div>
                        </div>

                        {/* SMALL CARD: COLOR PALETTE */}
                        <div className="md:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white overflow-hidden relative">
                            <h2 className="text-2xl font-black mb-4 relative z-10">{t('press_kit_colors_title')}</h2>
                            <p className="text-slate-400 text-sm font-medium mb-10 relative z-10">{t('press_kit_colors_desc')}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#4f46e5] border border-white/10 group-hover:scale-110 transition"></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Indigo</p>
                                        <p className="font-bold text-sm">#4F46E5</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-white/10 group-hover:scale-110 transition"></div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deep Slate</p>
                                        <p className="font-bold text-sm">#0F172A</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        </div>

                        {/* FULL CARD: MOCKUPS */}
                        <div className="md:col-span-12 bg-white border border-slate-200 rounded-[3rem] p-4 overflow-hidden group">
                            <div className="p-10 pb-0">
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{t('press_kit_mockups_title')}</h2>
                                <p className="text-slate-500 font-medium mb-10">{t('press_kit_mockups_desc')}</p>
                            </div>
                            
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-100 aspect-[21/9]">
                                <img src="/images/press_kit_branding.png" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" alt="Mockup Presentation" />
                            </div>
                        </div>

                        {/* MEDIUM CARD: MISSION */}
                        <div className="md:col-span-6 bg-indigo-50 border border-indigo-100 rounded-[3rem] p-12">
                            <h2 className="text-2xl font-black text-indigo-900 mb-6">{t('press_kit_foundation_title')}</h2>
                            <p className="text-indigo-900/70 font-bold leading-relaxed">
                                {t('press_kit_foundation_desc')}
                            </p>
                        </div>

                        {/* MEDIUM CARD: CONTACT */}
                        <div className="md:col-span-6 bg-white border border-slate-200 rounded-[3rem] p-12 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-4">{t('press_kit_contact_title')}</h2>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {t('press_kit_contact_desc')}
                                </p>
                            </div>
                            
                            <div className="pt-10">
                                <a href="mailto:tranvasapp@gmail.com" className="text-xl font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group">
                                    tranvasapp@gmail.com
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
