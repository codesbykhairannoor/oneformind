'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface JournalFeatureHeroProps {
    t: any;
}

export default function JournalFeatureHero({ t }: JournalFeatureHeroProps) {
    return (
        <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                        <span className="text-lg">📔</span> {t('journal_hero_badge')}
                    </div>
                    
                    <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                        {t('journal_hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {t('journal_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                        {t('journal_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                            {t('journal_hero_cta_1')}
                        </Link>
                        <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                            {t('journal_hero_cta_2')}
                        </a>
                    </div>
                </div>

                {/* Floating Mockup Centered (Clean Editor Vibe) */}
                <div className="max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-2xl"></div>
                    <div className="relative bg-white/80 rounded-[3rem] border border-white shadow-2xl p-8 md:p-16 text-left transform transition hover:scale-[1.01] duration-500">
                        
                        {/* Cover Image area */}
                        <div className="h-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 w-full opacity-80 rounded-t-[2.5rem]"></div>
                        
                        <div className="p-8 md:p-12 relative">
                            {/* Floating Emoji Icon */}
                            <div className="absolute -top-12 left-8 text-6xl bg-white rounded-2xl p-2 shadow-sm font-black select-none">🧠</div>
                            
                            <div className="flex justify-between items-start mt-4 mb-6">
                                <div>
                                    <h3 className="font-black text-gray-900 text-3xl mb-2">{t('journal_mockup_title')}</h3>
                                    <p className="text-sm font-bold text-indigo-500 flex items-center gap-2">
                                        <span>📅 {t('journal_mockup_date')}</span>
                                    </p>
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
                                    <span className="text-sm font-bold text-gray-500">Mood:</span>
                                    <span className="text-xl">✨</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 text-lg text-gray-600 font-serif leading-relaxed">
                                <p>{t('journal_mockup_text_1')}</p>
                                <p className="opacity-60">{t('journal_mockup_text_2')}</p>
                                
                                {/* Skeleton lines for writing illusion */}
                                <div className="pt-4 space-y-3 opacity-30">
                                    <div className="h-3 w-full bg-gray-300 rounded-full"></div>
                                    <div className="h-3 w-5/6 bg-gray-300 rounded-full"></div>
                                    <div className="h-3 w-4/6 bg-gray-300 rounded-full"></div>
                                </div>
                            </div>

                            {/* Floating Writing Indicator */}
                            <div className="absolute right-8 bottom-8 flex items-center gap-2 text-indigo-500 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-full animate-bounce [animation-duration:2000ms]">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                                {t('journal_mockup_typing')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
