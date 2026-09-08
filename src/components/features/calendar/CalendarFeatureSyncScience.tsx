'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface CalendarFeatureSyncScienceProps {
    t: any;
}

export default function CalendarFeatureSyncScience({ t }: CalendarFeatureSyncScienceProps) {
    return (
        <>
            {/* SECTION 3.5: ECOSYSTEM SYNC (NETWORK GRAPH VISUAL) */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-200">
                                {t('calendar_sync_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                {t('calendar_sync_title')}
                            </h2>
                            <p className="text-gray-600 text-xl mb-12 leading-relaxed font-medium">
                                {t('calendar_sync_desc')}
                            </p>
                            
                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">💰</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_finance_title')}</h4>
                                        <p className="text-gray-500 text-sm font-medium">{t('calendar_node_finance_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">💼</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_job_title')}</h4>
                                        <p className="text-gray-500 text-sm font-medium">{t('calendar_node_job_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">📔</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_journal_title')}</h4>
                                        <p className="text-gray-500 text-sm font-medium">{t('calendar_node_journal_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full relative h-[500px] flex items-center justify-center">
                            <div className="relative z-20 w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_0_60px_rgba(79,70,229,0.4)] animate-pulse border-4 border-white transform hover:scale-110 transition duration-500 cursor-pointer font-black">
                                🗓️
                            </div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 500 500">
                                    <line x1="250" y1="250" x2="100" y2="150" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                    <line x1="250" y1="250" x2="400" y2="100" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                    <line x1="250" y1="250" x2="400" y2="400" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                    <line x1="250" y1="250" x2="100" y2="400" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                </svg>
                                
                                <div className="absolute top-[15%] left-[20%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-emerald-50 transform hover:-translate-y-2 transition duration-500 group cursor-pointer shadow-emerald-100/50 font-black">
                                    <div className="absolute -inset-2 bg-emerald-400/10 rounded-[2rem] -z-10 animate-ping opacity-20"></div>
                                    💰
                                </div>
                                
                                <div className="absolute top-[10%] right-[15%] w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-indigo-50 transform hover:scale-105 transition duration-500 group cursor-pointer shadow-indigo-100/50 font-black">
                                    <div className="absolute -inset-2 bg-indigo-400/10 rounded-[2.5rem] -z-10 animate-pulse"></div>
                                    💼
                                </div>
                                
                                <div className="absolute bottom-[10%] right-[15%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-purple-50 transform hover:rotate-12 transition duration-500 group cursor-pointer shadow-purple-100/50 font-black">
                                    <div className="absolute -inset-1 bg-purple-400/10 rounded-[2rem] -z-10"></div>
                                    📔
                                </div>
                                
                                <div className="absolute bottom-[15%] left-[20%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-amber-50 transform hover:-rotate-12 transition duration-500 group cursor-pointer shadow-amber-100/50 font-black">
                                    🌱
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 0.8; }
                    }
                    .animate-pulse {
                        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                `}</style>
            </section>

            {/* SECTION 4: SCIENTIFIC PILLAR */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 w-full relative h-[450px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl shadow-2xl"></div>
                            <div className="relative w-64 h-64 bg-white border border-indigo-100 rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(79,70,229,0.15)] group">
                                <span className="text-6xl group-hover:scale-125 transition duration-700 font-black">🧬</span>
                                <div className="absolute -inset-8 border-2 border-dashed border-indigo-200 rounded-full animate-spin-slow"></div>
                                <div className="absolute -inset-16 border border-dotted border-indigo-100 rounded-full animate-spin-slow-reverse"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-xl animate-bounce">01</div>
                                <div className="absolute bottom-1/4 -right-12 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg animate-pulse">02</div>
                            </div>
                        </div>

                        <div className="flex-1 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-widest mb-8 border border-indigo-100 rounded-full">
                                🧩 {t('calendar_science_badge')}
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight font-black">
                                {t('calendar_science_title')}
                            </h2>
                            
                            <div className="bg-indigo-50/50 border-l-8 border-indigo-500 p-10 rounded-r-[2rem] shadow-sm mb-12">
                                <p className="text-gray-700 text-2xl leading-relaxed italic font-medium">
                                    {t('calendar_science_desc')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                    <span className="text-[10px] text-indigo-500 uppercase block mb-1">Architecture</span>
                                    <span className="font-bold text-gray-900">Cognitive Load Theory</span>
                                </div>
                                <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                    <span className="text-[10px] text-purple-500 uppercase block mb-1">Biological Sync</span>
                                    <span className="font-bold text-gray-900">Circadian Rhythm</span>
                                </div>
                                <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                    <span className="text-[10px] text-emerald-500 uppercase block mb-1">Execution System</span>
                                    <span className="font-bold text-gray-900">Time Blocking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: CALENDAR FLOW */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest mb-8 border border-blue-500/20">
                            📅 {t('calendar_ai_promo_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('calendar_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('calendar_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
                            {t('calendar_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative">
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <div key={i} className="h-32 bg-white/5 rounded-lg overflow-hidden relative">
                                        {(i === 2 || i === 4) && (
                                            <div className="absolute inset-x-1 top-4 bottom-12 bg-blue-600/30 border-x border-blue-500/50 flex flex-col items-center justify-center">
                                                <span className="text-[8px] text-blue-300 opacity-60">PRIME TIME</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: PHILOSOPHICAL QUOTE */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('calendar_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs">{t('calendar_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
