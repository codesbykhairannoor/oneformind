'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function ManagementToolsHero() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 1: HEADER */}
            <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-blue-200">
                            🏢 {t('pm_badge')}
                        </div>
                        
                        <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                            {t('pm_hero_title_1')}<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('pm_hero_title_2')}</span>
                        </h1>
                        
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('pm_hero_desc') }} />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                {t('pm_hero_cta')} →
                            </Link>
                            <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('pm_hero_note')}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                        <div className="absolute top-4 right-4 w-72 bg-white border border-slate-200 rounded-xl p-5 transform rotate-6 opacity-70 shadow-xl z-0">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                                    <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                                </div>
                                <span className="text-[10px] text-red-500 font-bold font-mono">OVERDUE</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                            <div className="h-3 bg-slate-100 rounded w-2/3 mb-4"></div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded border border-red-100">BLOCKER</span>
                            </div>
                        </div>

                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Focus Card">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🎯</div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('pm_mockup_status')}</span>
                            </div>
                            <h3 className="font-black text-2xl text-gray-900 mb-2">{t('pm_mockup_title')}</h3>
                            <p className="text-gray-400 text-sm mb-6">{t('pm_mockup_desc')}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span> 
                                    {t('pm_mockup_item_1')}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                     <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span> 
                                    {t('pm_mockup_item_2')}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                    <span className="animate-pulse">●</span> {t('pm_mockup_item_3')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* EXPLORE MORE ALTERNATIVES */}
            <section className="py-[80px] bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900">Explore Other Project Management Alternatives</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mt-2">See how Tranvas replaces bloated corporate tools.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/compare/monday" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📊</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Monday Alternative</h3>
                                <p className="text-sm text-gray-500">Stop managing the management.</p>
                            </div>
                        </Link>
                        <Link href="/compare/trello" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📋</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Trello Alternative</h3>
                                <p className="text-sm text-gray-500">Beyond simple kanban boards.</p>
                            </div>
                        </Link>
                        <Link href="/compare/asana" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">🦄</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Asana Alternative</h3>
                                <p className="text-sm text-gray-500">Focus on work, not assigning it.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
