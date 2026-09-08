'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface CalendarFeatureHeroProps {
    t: any;
}

export default function CalendarFeatureHero({ t }: CalendarFeatureHeroProps) {
    return (
        <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                        <span className="text-lg">🗓️</span> {t('calendar_hero_badge')}
                    </div>
                    
                    <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                        {t('calendar_hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {t('calendar_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                        {t('calendar_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                            {t('calendar_hero_cta_1')}
                        </Link>
                        <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                            {t('calendar_hero_cta_2')}
                        </a>
                    </div>
                </div>

                {/* Floating Mockup Centered */}
                <div className="max-w-6xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                    
                    <div className="bg-white/80 rounded-t-[3rem] border-x border-t border-gray-100 p-6 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 overflow-hidden h-[500px]">
                        
                        {/* Left Side: Mini Calendar */}
                        <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-gray-900">{t('calendar_mockup_month')}</h4>
                                <div className="flex gap-2 text-gray-400">
                                    <span className="hover:text-indigo-600 cursor-pointer">◀</span>
                                    <span className="hover:text-indigo-600 cursor-pointer">▶</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-700">
                                <span className="text-gray-300">28</span><span className="text-gray-300">29</span><span className="text-gray-300">30</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">1</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">2</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">3</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">4 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"></span></span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">5</span>
                                <span className="p-1 bg-indigo-600 text-white rounded-lg cursor-pointer shadow-md shadow-indigo-200 font-bold">6</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">7 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">8</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">9</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">10 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span></span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">11</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">12</span>
                                <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">13</span>
                            </div>
                        </div>

                        {/* Right Side: Daily Agenda */}
                        <div className="w-full md:w-2/3 flex flex-col text-left">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="font-black text-gray-900 text-2xl">{t('calendar_mockup_today')}</h3>
                                    <p className="text-sm text-gray-500">{t('calendar_mockup_date')}</p>
                                </div>
                                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 font-bold text-sm">
                                    3 Events
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="text-right w-16 shrink-0 pt-1">
                                        <p className="text-xs font-bold text-gray-900">09:00</p>
                                        <p className="text-[10px] text-gray-400">10:30</p>
                                    </div>
                                    <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-2xl rounded-bl-lg group-hover:bg-blue-100 transition">
                                        <p className="font-bold text-blue-900 text-sm">{t('calendar_mockup_event_1')}</p>
                                        <p className="text-xs text-blue-700/70 mt-1 flex items-center gap-1">📍 {t('calendar_mockup_location_1')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group cursor-pointer relative">
                                    <div className="absolute left-16 top-4 w-full h-[1px] bg-rose-500 z-0"></div>
                                    <div className="absolute left-14 top-[14px] w-2 h-2 bg-rose-500 rounded-full z-10 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></div>
                                    
                                    <div className="text-right w-16 shrink-0 pt-1">
                                        <p className="text-xs font-bold text-gray-900">13:00</p>
                                        <p className="text-[10px] text-gray-400">14:00</p>
                                    </div>
                                    <div className="flex-1 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl rounded-bl-lg relative z-10 shadow-sm transform scale-[1.02]">
                                        <p className="font-bold text-rose-900 text-sm">{t('calendar_mockup_event_2')}</p>
                                        <p className="text-xs text-rose-700/70 mt-1 flex items-center gap-1">🎥 {t('calendar_mockup_location_2')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="text-right w-16 shrink-0 pt-1">
                                        <p className="text-xs font-bold text-gray-900">19:00</p>
                                        <p className="text-[10px] text-gray-400">20:00</p>
                                    </div>
                                    <div className="flex-1 bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-2xl rounded-bl-lg group-hover:bg-gray-100 transition">
                                        <p className="font-bold text-gray-700 text-sm">{t('calendar_mockup_event_3')}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">🧘‍♂️ {t('calendar_mockup_location_3')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Floating Alert */}
                    <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms] text-left">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-black">🔔</div>
                            <div>
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">{t('calendar_mockup_alert_1')}</p>
                                <p className="font-black text-gray-900 text-sm">{t('calendar_mockup_alert_2')}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
