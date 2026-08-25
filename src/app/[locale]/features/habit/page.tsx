'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureHabitPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('habit_faq_q1'),
            a: t('habit_faq_a1')
        },
        {
            q: t('habit_faq_q2'),
            a: t('habit_faq_a2')
        },
        {
            q: t('habit_faq_q3'),
            a: t('habit_faq_a3')
        },
        {
            q: t('seo_habit_faq_q_mindform'),
            a: t('seo_habit_faq_a_mindform')
        }
    ];

    // Seeded opacity values matching laravel backup rand(0, 4)
    const opacities = [
        20, 40, 60, 80, 100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60,
        60, 20, 80, 100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 20,
        100, 40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20, 100, 40,
        20, 80, 100, 40, 60, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80,
        40, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20, 100, 60, 20,
        80, 100, 40, 60, 80, 20, 100, 60, 20, 80, 100, 40, 60, 80, 20,
        100, 60, 20, 80, 100, 40, 60, 80
    ];

    return (
        <GuestLayout>
            <main id="feature-habit" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + FLOATING HABIT MOCKUP) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                <span className="text-lg">🌱</span> {t('habit_hero_badge')}
                            </div>
                            
                            <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                                {t('habit_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('habit_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('habit_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                    {t('habit_hero_cta_1')}
                                </Link>
                                <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                                    {t('habit_hero_cta_2')}
                                </a>
                            </div>
                        </div>

                        {/* Floating Mockup Centered */}
                        <div className="relative w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20"></div>
                            <div className="relative bg-white/90 rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-10 transform transition hover:scale-[1.02] duration-500">
                                
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6 text-left">
                                    <div>
                                        <h3 className="font-black text-gray-900 text-2xl mb-1">{t('habit_mockup_title')} ☀️</h3>
                                    </div>
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl border border-green-100 flex items-center gap-3">
                                        <span className="text-2xl">🔥</span>
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold uppercase block leading-none opacity-70 mb-0.5">{t('habit_mockup_streak_label')}</span>
                                            <span className="font-black text-lg leading-tight">{t('habit_mockup_streak')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 text-left">
                                    {/* Task 1 (Done) */}
                                    <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                        <div className="flex-1 opacity-60 line-through">
                                            <p className="font-bold text-gray-900">{t('habit_mockup_task_1')}</p>
                                            <p className="text-sm text-gray-500">{t('habit_mockup_time_1')}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Task 2 (Done) */}
                                    <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                        <div className="flex-1 opacity-60 line-through">
                                            <p className="font-bold text-gray-900">{t('habit_mockup_task_2')}</p>
                                            <p className="text-sm text-gray-500">{t('habit_mockup_time_2')}</p>
                                        </div>
                                    </div>

                                    {/* Task 3 (Active/Pending) */}
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-sm transform scale-[1.02]">
                                        <div className="w-8 h-8 rounded-full border-2 border-indigo-300 flex items-center justify-center"></div>
                                        <div className="flex-1">
                                            <p className="font-bold text-indigo-900">{t('habit_mockup_task_3')}</p>
                                            <p className="text-sm text-indigo-600">{t('habit_mockup_time_3')}</p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-400"></div>
                                    </div>
                                </div>

                                {/* Floating Element (Level Up Badge) */}
                                <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms]">
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl font-black">🏆</div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('habit_mockup_alert_1')}</p>
                                            <p className="font-black text-indigo-900 text-sm">{t('habit_mockup_alert_2')}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>

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
                                        
                                        // Simple opacity string map for safety in Tailwind
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
                            {/* Vertical Line */}
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

                {/* SECTION 4: MOOD CORRELATION */}
                <section className="py-24 bg-white bg-pattern-dots relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative animate-in zoom-in-95 duration-700 text-left">
                            <div className="absolute -inset-4 bg-indigo-50 rounded-[4rem] -z-10"></div>
                            <div className="grid grid-cols-2 gap-6 relative">
                                <div className="bg-yellow-50 p-8 rounded-[2.5rem] border border-yellow-100 flex flex-col items-center text-center shadow-sm transform hover:-translate-y-2 transition duration-500">
                                    <span className="text-5xl mb-6 font-black">😊</span>
                                    <span className="text-lg font-bold text-yellow-800">{t('habit_mood_stat_1_title')}</span>
                                    <span className="text-xs text-yellow-600/70 mt-2">{t('habit_mood_stat_1_desc')}</span>
                                </div>
                                <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col items-center text-center shadow-sm transform hover:-translate-y-2 transition duration-500 delay-100">
                                    <span className="text-5xl mb-6 font-black">💤</span>
                                    <span className="text-lg font-bold text-blue-800">{t('habit_mood_stat_2_title')}</span>
                                    <span className="text-xs text-blue-600/70 mt-2">{t('habit_mood_stat_2_desc')}</span>
                                </div>
                                <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center col-span-2 shadow-sm">
                                    <div className="w-full flex justify-between items-center mb-6">
                                        <div className="text-left">
                                            <span className="text-2xl text-indigo-900 leading-tight block font-bold">{t('habit_mood_correlation_title')}</span>
                                            <span className="text-xs text-indigo-600 uppercase tracking-widest mt-1 font-bold">{t('habit_mood_correlation_badge')}</span>
                                        </div>
                                        <span className="text-xl bg-white text-indigo-600 px-4 py-2 rounded-2xl shadow-sm font-black">+24%</span>
                                    </div>
                                    <div className="w-full h-3 bg-indigo-200 rounded-full overflow-hidden mb-6">
                                        <div className="w-[85%] h-full bg-indigo-600 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-both"></div>
                                    </div>
                                    <p className="text-sm text-indigo-800/80 font-medium italic">"{t('habit_mood_insight')}"</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-left animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm font-black">🧠</div>
                            <h2 className="text-4xl md:text-5xl text-gray-900 mb-8 leading-tight font-black">{t('habit_mood_title')}</h2>
                            <p className="text-gray-600 text-xl mb-10 leading-relaxed font-medium">
                                {t('habit_mood_desc')}
                            </p>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm shadow-sm font-black">👤</div>
                                        ))}
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm">{t('habit_mood_social_proof')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: IDENTITY BRIDGE (STACKED CARDS) */}
                <section className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                            
                            {/* Left Side: Copywriting */}
                            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] uppercase tracking-[0.2em] mb-6 lg:mb-8 shadow-sm border border-orange-200">
                                    {t('habit_identity_badge')}
                                </div>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-6 lg:mb-8 leading-tight tracking-tight font-black">
                                    {t('habit_identity_title')}
                                </h2>
                                <p className="text-gray-600 text-lg lg:text-xl leading-relaxed font-medium mb-10 lg:mb-12">
                                    {t('habit_identity_desc')}
                                </p>
                                
                                {/* Side Cards List */}
                                <div className="grid gap-4 lg:gap-6 text-left">
                                    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 lg:gap-6 items-center group hover:bg-orange-600 transition duration-500 hover:shadow-xl hover:scale-[1.02] lg:hover:scale-105 cursor-pointer">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex-shrink-0 flex items-center justify-center text-xl group-hover:bg-white/20 group-hover:text-white transition font-black">🏠</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 group-hover:text-white transition text-sm lg:text-base">{t('habit_card_1_title')}</h4>
                                            <p className="text-gray-500 text-xs lg:text-sm font-medium group-hover:text-orange-100 transition">{t('habit_card_1_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 lg:gap-6 items-center group hover:bg-orange-600 transition duration-500 hover:shadow-xl hover:scale-[1.02] lg:hover:scale-105 cursor-pointer">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex-shrink-0 flex items-center justify-center text-xl group-hover:bg-white/20 group-hover:text-white transition font-black">⏱️</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 group-hover:text-white transition text-sm lg:text-base">{t('habit_card_2_title')}</h4>
                                            <p className="text-gray-500 text-xs lg:text-sm font-medium group-hover:text-orange-100 transition">{t('habit_card_2_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Visual Stack */}
                            <div className="flex-1 relative w-full h-[350px] lg:h-[500px] mt-10 lg:mt-0">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Card 3 (Bottom) */}
                                    <div className="absolute w-[85%] lg:w-[80%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-[-4deg] lg:rotate-[-6deg] translate-y-12 lg:translate-y-20 opacity-40 blur-3xl lg:blur-sm"></div>
                                    
                                    {/* Card 2 (Middle) */}
                                    <div className="absolute w-[90%] lg:w-[85%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-[-2deg] lg:rotate-[-3deg] translate-y-6 lg:translate-y-10 opacity-70"></div>
                                    
                                    {/* Card 1 (Top) */}
                                    <div className="absolute w-full lg:w-[90%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_50px_rgba(249,115,22,0.12)] lg:shadow-[0_30px_60px_rgba(249,115,22,0.15)] border border-orange-100 flex flex-col items-center justify-center p-8 lg:p-12 text-center group hover:-translate-y-2 lg:hover:-translate-y-4 transition duration-700 z-10">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-orange-500 rounded-2xl lg:rounded-3xl flex items-center justify-center text-3xl lg:text-4xl text-white mb-4 lg:mb-6 shadow-xl shadow-orange-200 group-hover:rotate-12 transition duration-500 font-black">
                                            ⭐
                                        </div>
                                        <h3 className="text-xl lg:text-2xl text-gray-900 mb-2 font-black">{t('habit_card_3_title')}</h3>
                                        <p className="text-gray-500 text-sm lg:text-base font-medium leading-relaxed">{t('habit_card_3_desc')}</p>
                                        
                                        {/* Sparkle Decorations */}
                                        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 text-orange-400 animate-pulse text-lg">✨</div>
                                        <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 text-orange-400 animate-pulse delay-700 text-lg">✨</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEW SECTION: SCIENTIFIC PILLAR (E-E-A-T) - ATOMIC PROGRESS STYLE */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center">
                            
                            {/* Atomic Connector Visualization */}
                            <div className="flex items-center justify-center mb-16 relative">
                                <div className="w-24 h-24 rounded-full bg-indigo-600/10 flex items-center justify-center animate-pulse">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.6)]"></div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -left-12 w-8 h-8 rounded-full bg-purple-50/20 border border-purple-500/30 animate-bounce [animation-duration:3000ms]"></div>
                                <div className="absolute -bottom-8 -right-10 w-10 h-10 rounded-full bg-emerald-50/20 border border-emerald-500/30 animate-bounce [animation-duration:4000ms]"></div>
                            </div>

                            <div className="max-w-4xl w-full bg-white border-l-8 border-indigo-500 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] p-12 md:p-20 rounded-r-[3rem] relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[10rem] -z-10 opacity-50"></div>
                                
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-widest mb-8">
                                    🧬 {t('habit_science_badge')}
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl text-gray-900 mb-8 leading-tight font-black">
                                    {t('habit_science_title')}
                                </h2>
                                
                                <p className="text-gray-600 text-xl leading-relaxed mb-12 italic font-medium opacity-80 border-b border-gray-100 pb-12">
                                    {t('habit_science_desc')}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] w-full mb-2 font-bold">Verified Methods:</span>
                                    <div className="px-6 py-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs shadow-sm hover:scale-110 transition cursor-default font-bold">James Clear</div>
                                    <div className="px-6 py-3 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs shadow-sm hover:scale-110 transition cursor-default font-bold">BJ Fogg</div>
                                    <div className="px-6 py-3 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs shadow-sm hover:scale-110 transition cursor-default font-bold">Charles Duhigg</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: HABIT AUDIT */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                                🧠 {t('habit_ai_promo_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('habit_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('habit_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                                {t('habit_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition duration-700"></div>
                                <div className="relative space-y-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                        <p className="text-xs font-bold text-slate-300">Friction Audit Complete: Morning Workout</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                                        <p className="text-xs font-bold text-slate-300">Detected: 14% drop in consistency when mood is 'Tired'</p>
                                    </div>
                                    <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-left">
                                        <p className="text-indigo-400 text-[10px] uppercase mb-2 font-bold">Neural Solution</p>
                                        <p className="text-sm font-bold text-white leading-relaxed">Try Habit Stacking with 'Coffee' to reduce initial friction.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: PHILOSOPHICAL QUOTE */}
                <section className="py-32 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                        <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                            {t('habit_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('habit_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: BOTTOM CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-5xl mx-auto bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl mb-6 font-black">{t('habit_cta_title')}</h2>
                            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                                {t('habit_cta_desc')}
                            </p>
                            <Link href="/register" className="inline-block bg-white text-indigo-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition transform shadow-xl">
                                {t('habit_cta_btn')}
                            </Link>
                            <p className="mt-6 text-sm text-indigo-300">{t('habit_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Habit Tracker (FAQ)
                        </h2>
                        <div className="space-y-4 text-left">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
