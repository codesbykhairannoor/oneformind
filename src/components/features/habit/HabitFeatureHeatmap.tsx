'use client';

import React from 'react';

interface HabitFeatureHeatmapProps {
    t: any;
    opacities: number[];
}

export default function HabitFeatureHeatmap({ t, opacities }: HabitFeatureHeatmapProps) {
    return (
        <>
            {/* SECTION 2: THE CONSISTENCY GRID */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                                {t('habit_heatmap_badge')}
                            </div>
                            <h2 className="text-4xl md:text-5xl text-gray-900 mb-6 leading-tight font-black">
                                {t('habit_heatmap_title')}
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {t('habit_heatmap_desc')}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-3xl text-emerald-600 font-black">{t('habit_mockup_days')}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">{t('habit_heatmap_label_1')}</span>
                                </div>
                                <div className="w-px h-10 bg-gray-100"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl text-indigo-600 font-black">{t('habit_mockup_percent')}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">{t('habit_heatmap_label_2')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-gray-50 rounded-[3.5rem] p-8 md:p-12 border border-blue-50/50 shadow-inner relative group animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <div className="grid grid-cols-10 sm:grid-cols-14 gap-2">
                                {Array.from({ length: 98 }).map((_, i) => {
                                    const opacity = opacities[i % opacities.length];
                                    const color = i % 8 === 0 ? 'bg-gray-200' : (opacity > 60 ? 'bg-indigo-600' : 'bg-indigo-400');
                                    
                                    const opacityClass = opacity === 20 ? 'opacity-20' : 
                                                         opacity === 40 ? 'opacity-40' :
                                                         opacity === 60 ? 'opacity-60' :
                                                         opacity === 80 ? 'opacity-80' : 'opacity-100';

                                    return (
                                        <div key={i} className={`aspect-square rounded-sm ${color} ${opacityClass} hover:scale-150 transition cursor-default group/cell relative`}>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[8px] rounded opacity-0 group-hover/cell:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                                                {t('habit_heatmap_day')} {i+1}: {t('habit_heatmap_status')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>{t('habit_heatmap_less')}</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-indigo-200"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-indigo-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></div>
                                </div>
                                <span>{t('habit_heatmap_more')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: STREAK MOMENTUM TIMELINE */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/10 blur-3xl rounded-full"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">{t('habit_streak_badge')}</span>
                        <h2 className="text-4xl md:text-5xl mb-6 font-black">{t('habit_streak_title')}</h2>
                        <p className="text-indigo-100 text-lg opacity-80">{t('habit_streak_desc')}</p>
                    </div>

                    <div className="relative mt-32">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent -translate-x-1/2 opacity-30 hidden md:block"></div>
                        
                        <div className="space-y-40 text-left">
                            {/* Level 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0 relative">
                                <div className="flex-1 md:text-right md:pr-16 animate-in slide-in-from-left-12 duration-700">
                                    <h3 className="text-3xl mb-4 text-indigo-400 font-black">{t('habit_level_1_title')}</h3>
                                    <p className="text-white/60 text-lg">{t('habit_level_1_desc')}</p>
                                </div>
                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 border-4 border-slate-900 shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center justify-center text-3xl z-10 transform rotate-12 group hover:rotate-0 transition duration-500 font-black">🚀</div>
                                <div className="flex-1 md:pl-16 animate-in slide-in-from-right-12 duration-700">
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition duration-500">
                                        <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">🔧</div>
                                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 block">{t('habit_bento_action_label')}</span>
                                        <p className="text-white text-lg">{t('habit_bento_action_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Level 2 */}
                            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0 relative">
                                <div className="flex-1 order-2 md:order-1 md:text-right md:pr-16 animate-in slide-in-from-left-12 duration-700">
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition duration-500 text-left">
                                        <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">☯️</div>
                                        <span className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-2 block">{t('habit_level_2_shift_label')}</span>
                                        <p className="text-white text-lg">{t('habit_level_2_shift_desc')}</p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-[1.5rem] bg-purple-600 border-4 border-slate-900 shadow-[0_0_30px_rgba(147,51,234,0.4)] flex items-center justify-center text-3xl z-10 -rotate-12 group hover:rotate-0 transition duration-500 order-1 md:order-2 font-black">⚡</div>
                                <div className="flex-1 order-3 md:pl-16 animate-in slide-in-from-right-12 duration-700">
                                    <h3 className="text-3xl mb-4 text-purple-400 font-black">{t('habit_level_2_title')}</h3>
                                    <p className="text-white/60 text-lg">{t('habit_level_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
