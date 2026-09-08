'use client';

import React from 'react';

interface GoalFeatureAscentOrbitProps {
    t: any;
}

export default function GoalFeatureAscentOrbit({ t }: GoalFeatureAscentOrbitProps) {
    return (
        <>
            {/* SECTION 2: VERTICAL ASCENT (STRATEGY HIERARCHY) */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        
                        {/* Vertical Path Visual */}
                        <div className="flex-1 w-full animate-in fade-in slide-in-from-left-8 duration-700 text-left">
                            <div className="relative pt-12">
                                <div className="relative py-20 pl-24">
                                    {/* The Line */}
                                    <div className="absolute left-16 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-500 via-indigo-500 to-indigo-100 rounded-full"></div>
                                    
                                    {/* Moonshot (Top) */}
                                    <div className="relative mb-24 animate-in fade-in slide-in-from-top-8 duration-700">
                                        <div className="absolute -left-16 top-0 w-12 h-12 bg-white rounded-full border-4 border-amber-500 shadow-xl z-10 flex items-center justify-center text-lg">🔥</div>
                                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative group hover:scale-105 transition duration-500">
                                            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-transparent rounded-[3rem] -z-10 opacity-20 blur-xl group-hover:opacity-40"></div>
                                            <h4 className="text-amber-500 uppercase tracking-widest text-xs mb-4">{t('goal_level_moonshot')}</h4>
                                            <p className="text-2xl italic tracking-tight">{t('goal_moonshot_example')}</p>
                                        </div>
                                    </div>

                                    {/* Milestone (Middle) */}
                                    <div className="relative mb-24 ml-12 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
                                        <div className="absolute -left-28 top-4 w-16 h-[2px] bg-indigo-500"></div>
                                        <div className="absolute -left-32 top-2 w-8 h-8 bg-white rounded-full border-4 border-indigo-500 shadow-lg z-10 flex items-center justify-center text-xs">⭐</div>
                                        <div className="bg-white border-2 border-indigo-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition duration-500">
                                            <h4 className="text-indigo-600 uppercase tracking-widest text-xs mb-4">{t('goal_milestone_number')}</h4>
                                            <p className="text-xl text-gray-900 tracking-tight">{t('goal_milestone_example')}</p>
                                            <div className="mt-6 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Task (Bottom) */}
                                    <div className="relative ml-24 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
                                        <div className="absolute -left-40 top-4 w-32 h-[2px] bg-indigo-200"></div>
                                        <div className="absolute -left-44 top-2 w-8 h-8 bg-white rounded-full border-4 border-indigo-200 shadow-lg z-10 flex items-center justify-center text-xs">📝</div>
                                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl opacity-60">
                                            <p className="font-bold text-gray-600">{t('goal_task_example')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-amber-100">
                                {t('goal_ascent_badge')}
                            </div>
                            <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                {t('goal_ascent_title')}
                            </h2>
                            <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                {t('goal_ascent_desc')}
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group">
                                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:rotate-12 transition font-black">🏔️</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter">{t('goal_moonshot_label')}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{t('goal_moonshot_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group">
                                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:-rotate-12 transition font-black">🎯</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter">{t('goal_milestones_label')}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{t('goal_milestones_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 3: MOMENTUM ORBIT (CIRCULAR PROGRESSION) */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-3xl -mr-96 -mt-96"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        
                        <div className="flex-1 order-2 lg:order-1 relative">
                            <div className="w-full aspect-square max-w-lg mx-auto relative group flex items-center justify-center">
                                {/* Outer Ring */}
                                <div className="absolute inset-0 border-[16px] border-indigo-100 rounded-full"></div>
                                
                                {/* Progress Ring */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray="600 200" className="text-indigo-600 transition-all duration-1000"></circle>
                                </svg>
                                
                                {/* Inner Ring */}
                                <div className="absolute inset-16 border border-indigo-50/50 rounded-full"></div>
                                
                                {/* Center Display */}
                                <div className="relative z-10 text-center bg-white w-2/3 aspect-square rounded-full shadow-[0_40px_80px_rgba(79,70,229,0.15)] flex flex-col items-center justify-center border border-indigo-50 transform group-hover:scale-105 transition duration-700">
                                    <span className="text-sm text-indigo-600 uppercase tracking-[0.3em] mb-4">{t('goal_momentum_velocity')}</span>
                                    <span className="text-7xl md:text-8xl text-gray-900 leading-none font-black">84<span className="text-3xl text-indigo-300 font-black">%</span></span>
                                    <div className="mt-6 flex items-center gap-3 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                                        <span className="animate-ping w-2 h-2 bg-emerald-500 rounded-full"></span> {t('goal_momentum_peak')}
                                    </div>
                                </div>

                                {/* Orbiting Planet */}
                                <div className="absolute w-12 h-12 bg-amber-500 rounded-2xl shadow-2xl shadow-amber-400 border-4 border-white transform rotate-45 -translate-y-[48%] animate-spin-slow origin-[0_500%]" style={{ transformOrigin: '0 500%' }}></div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900 text-white text-xs uppercase tracking-[0.2em] mb-8 shadow-2xl">
                                {t('goal_performance_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight tracking-tight font-black">
                                {t('goal_momentum_title')}
                            </h2>
                            <p className="text-gray-600 text-xl mb-12 leading-relaxed">
                                {t('goal_momentum_desc')}
                            </p>
                            <div className="grid gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 flex gap-8 items-start group">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl shrink-0 flex items-center justify-center text-3xl group-hover:scale-110 transition font-black">⚡</div>
                                    <div className="text-left">
                                        <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('goal_impl_speed_title')}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{t('goal_impl_speed_desc')}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 flex gap-8 items-start group">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl shrink-0 flex items-center justify-center text-3xl group-hover:rotate-12 transition font-black">🔥</div>
                                    <div className="text-left">
                                        <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('goal_streak_title')}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{t('goal_streak_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
