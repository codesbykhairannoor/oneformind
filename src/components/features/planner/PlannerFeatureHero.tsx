'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface PlannerFeatureHeroProps {
    t: any;
}

export default function PlannerFeatureHero({ t }: PlannerFeatureHeroProps) {
    return (
        <header className="pt-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] -z-10"></div>
            
            <div className="max-w-5xl mx-auto text-center relative z-10 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-wider border border-indigo-200">
                    <span className="text-lg">📅</span> {t('planner_hero_badge')}
                </div>
                <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                    {t('planner_hero_title_1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">{t('planner_hero_title_2')}</span>
                </h1>
                <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto font-medium">
                    {t('planner_hero_desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                        {t('planner_hero_cta_1')}
                    </Link>
                    <a href="#how-it-works" className="bg-white text-gray-700 border border-gray-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition">
                        {t('planner_hero_cta_2')}
                    </a>
                </div>
            </div>

            {/* Hero Visual: Kanban Board Mockup (Trello Vibe) */}
            <div className="max-w-6xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                
                <div className="bg-gray-100/80 rounded-t-[2.5rem] border-x border-t border-gray-200 p-6 md:p-10 shadow-2xl flex gap-6 overflow-hidden h-[450px]">
                    
                    {/* Column 1: To Do */}
                    <div className="w-1/3 min-w-[300px] bg-gray-200/50 rounded-2xl p-4 flex flex-col gap-4 text-left">
                        <div className="flex justify-between items-center font-bold text-gray-700 px-2">
                            <span>{t('planner_mockup_col_1')}</span>
                            <span className="bg-gray-300 px-2 py-0.5 rounded-md text-xs">1</span>
                        </div>
                        {/* Task 3 (Pending) */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 cursor-pointer transform transition hover:-translate-y-1">
                            <div className="flex gap-2 mb-3">
                                <span className="w-10 h-2 rounded-full bg-blue-400"></span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm mb-2">{t('planner_mockup_task_3')}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">🕒 {t('planner_mockup_time_3')}</p>
                        </div>
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="w-1/3 min-w-[300px] bg-indigo-100/50 rounded-2xl p-4 flex flex-col gap-4 border border-indigo-100 text-left">
                        <div className="flex justify-between items-center font-bold text-indigo-900 px-2">
                            <span className="flex items-center gap-2">🔥 {t('planner_mockup_col_2')}</span>
                            <span className="bg-indigo-200 px-2 py-0.5 rounded-md text-xs text-indigo-800">1</span>
                        </div>
                        {/* Task 2 (Active) */}
                        <div className="bg-white p-4 rounded-xl shadow-md border-2 border-indigo-400 cursor-pointer transform scale-105 z-10 relative">
                            <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">
                                {t('planner_mockup_alert_1')}
                            </div>
                            <div className="flex gap-2 mb-3">
                                <span className="w-10 h-2 rounded-full bg-amber-500"></span>
                                <span className="w-10 h-2 rounded-full bg-indigo-500"></span>
                            </div>
                            <p className="font-bold text-indigo-950 text-sm mb-2">{t('planner_mockup_task_2')}</p>
                            <p className="text-xs text-indigo-600 font-bold flex items-center gap-1">⏳ {t('planner_mockup_time_2')}</p>
                        </div>
                    </div>

                    {/* Column 3: Done */}
                    <div className="w-1/3 min-w-[300px] bg-green-50/80 rounded-2xl p-4 flex flex-col gap-4 opacity-70 text-left">
                        <div className="flex justify-between items-center font-bold text-green-800 px-2">
                            <span>{t('planner_mockup_col_3')}</span>
                            <span className="bg-green-200 px-2 py-0.5 rounded-md text-xs">1</span>
                        </div>
                        {/* Task 1 (Done) */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
                            <div className="flex gap-2 mb-3">
                                <span className="w-10 h-2 rounded-full bg-red-500 opacity-50"></span>
                            </div>
                            <p className="font-bold text-gray-500 text-sm mb-2 line-through">{t('planner_mockup_task_1')}</p>
                            <p className="text-xs text-green-600 font-bold flex items-center gap-1">✓ {t('planner_mockup_title')}</p>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
