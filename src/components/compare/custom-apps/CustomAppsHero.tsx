'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CustomAppsHero() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 1: HEADER */}
            <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-orange-200">
                            ⚠️ {t('blank_badge')}
                        </div>
                        
                        <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                            {t('blank_hero_title_1')}<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('blank_hero_title_2')}</span>
                        </h1>
                        
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('blank_hero_desc') }} />
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                {t('blank_hero_cta')} →
                            </Link>
                            <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('blank_hero_note')}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                        <div className="absolute top-10 right-10 w-72 h-64 bg-gray-50 border border-gray-200 rounded-xl p-4 transform rotate-6 opacity-60 shadow-lg z-0 flex flex-col gap-2">
                            <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="flex gap-2">
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                            </div>
                            <div className="absolute bottom-4 right-4 text-gray-300 font-mono text-xs">#REF! ERROR</div>
                        </div>

                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Zero-Configuration Dashboard: Displaying an automated monthly overview with budget usage and performance insights.">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📊</div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('blank_mockup_status')}</span>
                            </div>
                            <h3 className="font-black text-2xl text-gray-900 mb-2">{t('blank_mockup_title')}</h3>
                            <p className="text-gray-400 text-sm mb-6">{t('blank_mockup_subtitle')}</p>
                            
                            <div className="space-y-4">
                                 <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span>{t('blank_mockup_stat_1')}</span>
                                    <span className="text-indigo-600">75%</span>
                                </div>
                                 <div className="flex items-center gap-3 text-sm font-bold text-indigo-600 bg-indigo-50 p-3 rounded-xl">
                                    <span className="animate-pulse">●</span> {t('blank_mockup_insight')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* EXPLORE MORE ALTERNATIVES */}
            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-gray-900">Explore Other Custom App Alternatives</h2>
                        <p className="text-gray-500 mt-2">See how Tranvas replaces other popular workspace tools.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/compare/spreadsheet" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📊</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Spreadsheet Alternative</h3>
                                <p className="text-sm text-gray-500">Stop building trackers from scratch.</p>
                            </div>
                        </Link>
                        <Link href="/compare/notion" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📝</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Notion Alternative</h3>
                                <p className="text-sm text-gray-500">Escape the infinite setup loop.</p>
                            </div>
                        </Link>
                        <Link href="/compare/obsidian" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">🧠</div>
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Obsidian Alternative</h3>
                                <p className="text-sm text-gray-500">Actionable structure over linked chaos.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
