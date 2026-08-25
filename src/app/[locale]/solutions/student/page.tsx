'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionStudentPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('student_faq_q1'),
            a: t('student_faq_a1')
        },
        {
            q: t('student_faq_q2'),
            a: t('student_faq_a2')
        },
        {
            q: t('student_faq_q3'),
            a: t('student_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-student" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative border-b border-gray-100">
                    <div className="mt-20 absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both relative z-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                🎓 {t('student_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl mb-6 leading-[1.05] text-gray-900 tracking-tight font-black">
                                {t('student_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('student_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('student_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('student_hero_cta_1')}
                                </Link>
                            </div>
                            
                            <div className="mt-8 flex items-center gap-4 text-sm font-bold text-gray-400">
                                <div className="flex -space-x-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white text-xs font-bold">SS</span>
                                    <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white text-xs font-bold">DF</span>
                                    <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white text-xs font-bold">KN</span>
                                </div>
                                <p>{t('student_hero_social_proof')}</p>
                            </div>
                        </div>

                        {/* Right: macOS App Window Mockup */}
                        <div className="lg:col-span-5 mt-0 relative z-10 w-full animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-400 to-rose-400 rounded-[2.5rem] blur opacity-20 "></div>
                            
                            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white flex flex-col h-[500px] overflow-hidden transform transition hover:scale-[1.01] duration-500">
                                
                                <div className="bg-gray-50/90 px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                        {t('student_mockup_title')}
                                    </div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="p-6 md:p-8 bg-gray-50/30 flex flex-col gap-6 overflow-hidden">
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Budget Widget */}
                                        <div className="bg-indigo-950 rounded-[1.5rem] p-5 shadow-md border border-indigo-900 transition duration-300">
                                            <div className="flex justify-between items-center mb-3">
                                                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider">{t('student_mockup_budget_label')}</p>
                                                <span className="bg-indigo-900 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md">{t('student_mockup_budget_status')}</span>
                                            </div>
                                            <h3 className="font-black text-2xl text-white">Rp 150.000</h3>
                                        </div>

                                        {/* Task Widget */}
                                        <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-rose-100 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="bg-rose-100 text-rose-700 text-[10px] uppercase px-3 py-1 rounded-full font-bold">{t('student_mockup_task_badge')}</span>
                                                <span className="text-rose-500 text-sm animate-pulse">⚠️</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-sm mb-1">{t('student_mockup_task_title')}</h4>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                                    <div className="bg-indigo-600 h-1.5 rounded-full w-[85%]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Schedule */}
                                    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                                            <h4 className="font-black text-gray-900 text-xs">{t('student_mockup_schedule_label')}</h4>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex gap-3 items-center">
                                                <p className="text-[10px] font-bold text-gray-400 w-8">10:00</p>
                                                <div className="flex-1 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-2">
                                                    <p className="text-xs font-bold text-indigo-900">{t('student_mockup_schedule_item_1')}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-3 items-center">
                                                <p className="text-[10px] font-bold text-gray-400 w-8">14:00</p>
                                                <div className="flex-1 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-2">
                                                    <p className="text-xs font-bold text-amber-900">{t('student_mockup_schedule_item_2')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                {/* SECTION 2: THE "STUDENT STRUGGLE" AWARENESS */}
                <section className="py-24 bg-white bg-pattern-dots relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('student_prob_title')}</h2>
                            <p className="text-xl text-gray-500">{t('student_prob_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 hover:-translate-y-2 transition duration-300">
                                <div className="text-4xl mb-4 font-black select-none">😵‍💫</div>
                                <h3 className="text-xl font-bold mb-3 text-rose-950">{t('student_prob_1_title')}</h3>
                                <p className="text-rose-900/70 font-medium">{t('student_prob_1_desc')}</p>
                            </div>
                            <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 hover:-translate-y-2 transition duration-300 delay-100">
                                <div className="text-4xl mb-4 font-black select-none">💸</div>
                                <h3 className="text-xl font-bold mb-3 text-amber-950">{t('student_prob_2_title')}</h3>
                                <p className="text-amber-900/70 font-medium">{t('student_prob_2_desc')}</p>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 hover:-translate-y-2 transition duration-300 delay-200">
                                <div className="text-4xl mb-4 font-black select-none">🥱</div>
                                <h3 className="text-xl font-bold mb-3 text-indigo-950">{t('student_prob_3_title')}</h3>
                                <p className="text-indigo-900/70 font-medium">{t('student_prob_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: SOLUTION HIGHLIGHT 1 (ACADEMIC & PROJECTS) */}
                <section className="py-24 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        
                        <div className="order-2 lg:order-1 relative h-[400px] bg-slate-900 rounded-[3rem] p-8 flex items-center justify-center overflow-hidden border border-slate-800 shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                            <div className="text-center relative z-10">
                                <div className="flex justify-center gap-4 mb-8">
                                    <div className="w-20 h-24 bg-indigo-500 rounded-xl transform -rotate-6 shadow-lg border border-indigo-400"></div>
                                    <div className="w-20 h-24 bg-rose-500 rounded-xl transform scale-110 shadow-lg border border-rose-400 -mt-4"></div>
                                    <div className="w-20 h-24 bg-emerald-500 rounded-xl transform rotate-6 shadow-lg border border-emerald-400"></div>
                                </div>
                                <div className="inline-block bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-full">
                                    {t('student_feat_1_visual_badge')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl text-2xl mb-6 font-black select-none">🎯</div>
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('student_feat_1_title')}</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                                {t('student_feat_1_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-gray-700">
                                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0 mt-0.5">✓</span> {t('student_feat_1_point_1')}</li>
                                <li className="flex items-start gap-4"><span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm shrink-0 mt-0.5">✓</span> {t('student_feat_1_point_2')}</li>
                            </ul>
                        </div>

                    </div>
                </section>

                {/* SECTION 4: SOLUTION HIGHLIGHT 2 (FINANCE SURVIVAL) */}
                <section className="py-24 bg-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl mb-6 font-black select-none">🍜</div>
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('student_feat_2_title')}</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                                {t('student_feat_2_desc')}
                            </p>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 font-bold">
                                <div className="flex justify-between items-center font-bold">
                                    <span className="text-gray-700">{t('student_feat_2_point_1')}</span>
                                    <span className="text-emerald-500">{t('student_feat_2_badge_1')}</span>
                                </div>
                                <div className="w-full h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center font-bold">
                                    <span className="text-gray-700">{t('student_feat_2_point_2')}</span>
                                    <span className="text-emerald-500">{t('student_feat_2_badge_2')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative h-[400px] bg-emerald-50 rounded-[3rem] p-8 flex items-center justify-center overflow-hidden border border-emerald-100 shadow-inner">
                            <div className="text-9xl transform hover:scale-110 transition duration-500 font-black select-none">💸</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: STUDENT SURVIVAL KIT (BENTO BOX) */}
                <section className="py-24 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-4 font-black">{t('student_bento_title')}</h2>
                            <p className="text-gray-500 text-lg font-medium">{t('student_bento_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition">
                                <div className="text-3xl mb-4 font-black select-none">📓</div>
                                <h3 className="text-xl font-bold mb-2">{t('student_bento_1_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('student_bento_1_desc')}</p>
                            </div>
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition">
                                <div className="text-3xl mb-4 font-black select-none">🌙</div>
                                <h3 className="text-xl font-bold mb-2">{t('student_bento_2_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('student_bento_2_desc')}</p>
                            </div>
                            <div className="bg-indigo-900 text-white rounded-[2rem] p-8 shadow-xl hover:-translate-y-1 transition relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
                                <div className="text-3xl mb-4 relative z-10 font-black select-none">🚀</div>
                                <h3 className="text-xl font-bold mb-2 relative z-10">{t('student_bento_3_title')}</h3>
                                <p className="text-indigo-200 text-sm relative z-10 font-medium leading-relaxed">{t('student_bento_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: STUDY WORKFLOW (UNIQUE A) */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-black select-none">📝</div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">1</div>
                                    <div className="text-white font-bold">{t('student_extra_1_step_1')}</div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 ml-8">
                                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold">2</div>
                                    <div className="text-white font-bold">{t('student_extra_1_step_2')}</div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 ml-16 text-emerald-400">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white">3</div>
                                    <div className="font-bold">{t('student_extra_1_step_3')}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-6 font-black">{t('student_extra_1_title')}</h2>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {t('student_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION: GRADES VS SLEEP (UNIQUE B) */}
                <section className="py-32 bg-indigo-50 border-y border-indigo-100">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl text-indigo-950 mb-8 font-black">{t('student_extra_2_title')}</h2>
                        <p className="text-xl text-indigo-800/70 leading-relaxed mb-12">
                            {t('student_extra_2_desc')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-bold text-xs uppercase text-indigo-400">
                            <div className="bg-white p-6 rounded-3xl shadow-sm">
                                <div className="text-2xl mb-2 select-none">😴</div>
                                <div>{t('student_extra_2_item_1')}</div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm">
                                <div className="text-2xl mb-2 select-none">📚</div>
                                <div>{t('student_extra_2_item_2')}</div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm">
                                <div className="text-2xl mb-2 select-none">🍔</div>
                                <div>{t('student_extra_2_item_3')}</div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-indigo-500 text-indigo-600">
                                <div className="text-2xl mb-2 select-none">💎</div>
                                <div>{t('student_extra_2_item_4')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-slate-50 relative overflow-hidden border-t border-gray-100">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(79,70,229,0.05)_2px,transparent_2px)] [background-size:100px_100px] opacity-30"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-white border-2 border-indigo-100 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group">
                            
                            <div className="absolute top-0 left-0 w-full h-8 border-b border-indigo-50 flex items-center px-6">
                                <div className="text-[8px] font-mono text-indigo-300 uppercase tracking-widest font-bold">Dimension_A: 1280px x 800px</div>
                            </div>
                            <div className="absolute top-0 right-0 h-full w-8 border-l border-indigo-50 flex flex-col items-center py-6">
                                <div className="text-[8px] font-mono text-indigo-300 uppercase tracking-widest font-bold rotate-90 whitespace-nowrap">Scale: 1:1</div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-[10px] uppercase tracking-[0.2em] mb-8 shadow-lg shadow-indigo-200 font-bold">
                                        🧬 {t('student_science_badge')}
                                    </div>
                                    
                                    <h2 className="text-5xl leading-[1.1] md:text-6xl text-gray-900 mb-8 tracking-tight font-black animate-[fadeIn_0.5s]">
                                        {t('student_science_title')}
                                    </h2>
                                    
                                    <div className="relative py-10 px-8 bg-indigo-50/50 rounded-2xl border-l-4 border-indigo-500 mb-10">
                                        <p className="text-gray-700 text-xl md:text-2xl leading-relaxed italic font-medium">
                                            "{t('student_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 font-bold text-gray-600 text-sm">
                                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                            <span>{t('student_science_topic_1')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                            <span>{t('student_science_topic_2')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span>{t('student_science_topic_3')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative hidden lg:block">
                                    <div className="relative w-full aspect-square bg-indigo-50/30 rounded-full border-2 border-dashed border-indigo-100 p-12 animate-spin-slow flex items-center justify-center">
                                        <div className="w-48 h-48 bg-white border border-indigo-100 rounded-[2rem] shadow-xl flex items-center justify-center text-5xl transform rotate-12 group-hover:rotate-0 transition duration-700 font-black select-none">📚</div>
                                        
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-16 h-16 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce select-none">🧠</div>
                                        <div className="absolute bottom-1/4 -right-4 w-14 h-14 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-xl select-none font-bold">⏳</div>
                                        <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-lg select-none font-bold">📁</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 9: FAQ */}
                <section className="py-32 bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('student_faq_title')}</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 10: STUDENT CTA */}
                <section className="py-24 px-6 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-indigo-600 -z-20"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 -z-10 "></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                        <h2 className="text-6xl md:text-6xl mb-8 text-white tracking-tight font-black leading-tight">{t('student_cta_title')}</h2>
                        <p className="text-indigo-100 text-xl md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('student_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-indigo-900 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition transform hover:scale-105 shadow-2xl">
                            {t('student_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 45s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
