'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface GoalFeatureHeroProps {
    t: any;
}

export default function GoalFeatureHero({ t }: GoalFeatureHeroProps) {
    return (
        <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                        <span className="text-lg">🎯</span> {t('goal_hero_badge')}
                    </div>
                    
                    <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                        {t('goal_hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {t('goal_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                        {t('goal_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                            {t('goal_hero_cta_1')}
                        </Link>
                        <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                            {t('goal_hero_cta_2')}
                        </a>
                    </div>
                </div>

                {/* Floating Mockup Centered */}
                <div className="max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                    
                    <div className="bg-white/80 rounded-t-[3rem] border-x border-t border-gray-200 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 overflow-hidden h-auto min-h-[400px]">
                        <div className="w-full text-left">
                            
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                <div className="text-left">
                                    <h3 className="font-black text-gray-900 text-2xl mb-1">{t('goal_mockup_title')} 🏆</h3>
                                </div>
                                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-3">
                                    <span className="text-2xl">⚡</span>
                                    <div className="text-left">
                                        <span className="text-[10px] font-bold uppercase block leading-none opacity-70 mb-0.5">{t('goal_mockup_momentum_label')}</span>
                                        <span className="font-black text-lg leading-tight">{t('goal_mockup_streak')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {/* Task 1 (Done) */}
                                <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                    <div className="flex-1 text-left opacity-60 line-through">
                                        <p className="font-bold text-gray-900">{t('goal_mockup_task_1')}</p>
                                        <p className="text-sm text-gray-500">{t('goal_mockup_time_1')}</p>
                                    </div>
                                </div>
                                
                                {/* Task 2 (Done) */}
                                <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                    <div className="flex-1 text-left opacity-60 line-through">
                                        <p className="font-bold text-gray-900">{t('goal_mockup_task_2')}</p>
                                        <p className="text-sm text-gray-500">{t('goal_mockup_time_1')}</p>
                                    </div>
                                </div>

                                {/* Task 3 (Active/Pending) */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-sm transform scale-[1.02]">
                                    <div className="w-8 h-8 rounded-full border-2 border-indigo-300 flex items-center justify-center"></div>
                                    <div className="flex-1 text-left">
                                        <p className="font-bold text-indigo-900">{t('goal_mockup_task_3')}</p>
                                        <p className="text-sm text-indigo-600">{t('goal_mockup_milestone_label')}</p>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Element (Level Up Badge) */}
                    <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms] text-left">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl font-black">🎉</div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('goal_mockup_alert_1')}</p>
                                <p className="font-black text-indigo-900 text-sm">{t('goal_mockup_alert_2')}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
