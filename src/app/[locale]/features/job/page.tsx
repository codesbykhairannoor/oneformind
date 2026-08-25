'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureJobPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('job_faq_q1'),
            a: t('job_faq_a1')
        },
        {
            q: t('job_faq_q2'),
            a: t('job_faq_a2')
        },
        {
            q: t('job_faq_q3'),
            a: t('job_faq_a3')
        }
    ];

    const radarItems = [
        {
            role: t('job_radar_role_1'),
            prev: t('job_radar_prev_1'),
            curr: t('job_radar_curr_1'),
            gain: t('job_radar_gain_1'),
            color: 'cyan'
        },
        {
            role: t('job_radar_role_2'),
            prev: t('job_radar_prev_2'),
            curr: t('job_radar_curr_2'),
            gain: t('job_radar_gain_2'),
            color: 'indigo'
        },
        {
            role: t('job_radar_role_3'),
            prev: t('job_radar_prev_3'),
            curr: t('job_radar_curr_3'),
            gain: t('job_radar_gain_3'),
            color: 'purple'
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-job" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + FLOATING JOB MOCKUP) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-gray-50 relative border-b border-gray-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                <span className="text-lg">💼</span> {t('job_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                                {t('job_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('job_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('job_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                    {t('job_hero_cta_1')}
                                </Link>
                                <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                                    {t('job_hero_cta_2')}
                                </a>
                            </div>
                        </div>

                        {/* Floating Mockup Centered */}
                        <div className="relative w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                            <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-8 md:p-12 shadow-2xl overflow-hidden min-h-[400px]">
                                
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6 text-left">
                                    <div>
                                        <h3 className="font-black text-white text-2xl mb-1">{t('job_mockup_title')}</h3>
                                    </div>
                                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-3">
                                        <span className="text-2xl">📊</span>
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold uppercase block leading-none opacity-70 mb-0.5">{t('job_mockup_status_label')}</span>
                                            <span className="font-black text-lg leading-tight">{t('job_mockup_streak')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 text-left">
                                    {/* Job 1 */}
                                    <div className="flex items-center gap-4 p-4 hover:bg-indigo-50/10 rounded-2xl transition border border-white/5 cursor-pointer bg-white/5">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-black">{t('job_mockup_grade_1')}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{t('job_mockup_task_1')}</p>
                                            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{t('job_mockup_time_1')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-gray-400">{t('job_mockup_time_ago_1')}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Job 2 */}
                                    <div className="flex items-center gap-4 p-4 hover:bg-indigo-50/10 rounded-2xl transition border border-white/5 cursor-pointer bg-white/5">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-black">{t('job_mockup_grade_2')}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{t('job_mockup_task_2')}</p>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t('job_mockup_time_2')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-gray-400">{t('job_mockup_time_ago_2')}</span>
                                        </div>
                                    </div>

                                    {/* Job 3 (Highlight) */}
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition border-2 border-green-200 hover:border-green-400 cursor-pointer shadow-sm transform scale-[1.02]">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl font-black">{t('job_mockup_grade_3')}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-green-900">{t('job_mockup_task_3')}</p>
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">{t('job_mockup_time_3')}</p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-400"></div>
                                    </div>
                                </div>

                                {/* Floating Element */}
                                <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms] text-left">
                                    <div className="h-6 w-24 bg-indigo-600/20 rounded-lg flex items-center justify-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                        <div className="h-1.5 w-12 bg-indigo-300 rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('job_mockup_alert_1')}</p>
                                    <p className="font-black text-indigo-900 text-sm">{t('job_mockup_alert_2')}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: OPPORTUNITY FUNNEL (PIPELINE VISUAL) */}
                <section id="how-it-works" className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-24 items-center">
                            
                            <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-100">
                                    {t('job_funnel_badge')}
                                </div>
                                <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                    {t('job_funnel_title')}
                                </h2>
                                <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                    {t('job_funnel_desc')}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl transition duration-500 cursor-default">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl group-hover:rotate-6 transition font-black">📩</div>
                                            <span className="font-black text-gray-900 uppercase tracking-tighter">{t('job_funnel_label_1')}</span>
                                        </div>
                                        <span className="text-2xl text-indigo-600 font-black">{t('job_funnel_stat_1')}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl transition duration-500 cursor-default">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:rotate-6 transition font-black">🤝</div>
                                            <span className="font-black text-gray-900 uppercase tracking-tighter">{t('job_funnel_label_2')}</span>
                                        </div>
                                        <span className="text-2xl text-purple-600 font-black">{t('job_funnel_stat_2')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="relative py-12 flex flex-col items-center">
                                    <div className="w-full space-y-4 relative z-10 text-left">
                                        
                                        {/* Applied Stage */}
                                        <div className="w-full bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                            <div className="flex justify-between items-center text-white">
                                                <div>
                                                    <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_1_label')}</h4>
                                                    <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_1_title')}</p>
                                                </div>
                                                <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_1_stat')}</span>
                                            </div>
                                        </div>

                                        {/* Interview Stage */}
                                        <div className="w-[90%] mx-auto bg-purple-600 p-8 rounded-[2.5rem] shadow-xl transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                            <div className="flex justify-between items-center text-white">
                                                <div>
                                                    <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_2_label')}</h4>
                                                    <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_2_title')}</p>
                                                </div>
                                                <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_2_stat')}</span>
                                            </div>
                                        </div>

                                        {/* Final Stage */}
                                        <div className="w-[75%] mx-auto bg-emerald-600 p-8 rounded-[2.5rem] shadow-lg transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                            <div className="flex justify-between items-center text-white">
                                                <div>
                                                    <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_3_label')}</h4>
                                                    <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_3_title')}</p>
                                                </div>
                                                <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_3_stat')}</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3: DECISION MATRIX (COMPARISON GRID) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-24 items-center">
                            
                            <div className="flex-1 order-2 lg:order-1">
                                <div className="grid grid-cols-2 gap-6 relative">
                                    {/* Axis Labels */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">{t('job_matrix_axis_y_top')}</div>
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">{t('job_matrix_axis_y_bottom')}</div>
                                    <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 transform -rotate-90 font-bold">{t('job_matrix_axis_x_left')}</div>
                                    <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 transform rotate-90 font-bold">{t('job_matrix_axis_x_right')}</div>
                                    
                                    {/* Matrix Cells */}
                                    <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                        <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🏢</span>
                                        <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_1')}</p>
                                    </div>
                                    
                                    <div className="aspect-square bg-indigo-600 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center transform scale-105 relative">
                                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter font-bold">{t('job_matrix_cell_highlight')}</div>
                                        <span className="text-4xl mb-4 text-white font-black">🚀</span>
                                        <p className="text-xs uppercase text-indigo-100 font-bold">{t('job_matrix_cell_2')}</p>
                                    </div>
                                    
                                    <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                        <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🏡</span>
                                        <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_3')}</p>
                                    </div>
                                    
                                    <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                        <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🧪</span>
                                        <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_4')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs uppercase tracking-[0.2em] mb-8 shadow-2xl">
                                    {t('job_matrix_badge')}
                                </div>
                                <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight tracking-tight font-black">
                                    {t('job_matrix_title')}
                                </h2>
                                <p className="text-gray-600 text-xl mb-12 leading-relaxed font-medium">
                                    {t('job_matrix_desc')}
                                </p>
                                <div className="grid gap-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition font-black">⚖️</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-2">{t('job_matrix_feature_title')}</h4>
                                            <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('job_matrix_feature_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: MARKET VALUE (SPLIT CONTENT) */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                    
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            
                            <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] uppercase tracking-[0.2em] mb-8 border border-cyan-500/20">
                                    {t('job_value_badge')}
                                </div>
                                <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                    {t('job_value_title')}
                                </h2>
                                <p className="text-slate-400 text-xl leading-relaxed font-medium mb-12">
                                    {t('job_value_desc')}
                                </p>
                                
                                <div className="space-y-12">
                                    <div className="flex gap-8 group cursor-default">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl group-hover:bg-cyan-500 transition duration-500 font-black">📈</div>
                                        <div>
                                            <h4 className="text-xl mb-2 uppercase tracking-tight group-hover:text-cyan-400 transition font-black">{t('job_insight_1_title')}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed">{t('job_insight_1_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-8 group cursor-default">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl group-hover:bg-indigo-500 transition duration-500 font-black">🏗️</div>
                                        <div>
                                            <h4 className="text-xl mb-2 uppercase tracking-tight group-hover:text-indigo-400 transition font-black">{t('job_insight_2_title')}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed">{t('job_insight_2_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full bg-slate-800/50 rounded-[3rem] p-1 border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-1000 text-left">
                                <div className="bg-slate-900 rounded-[2.8rem] p-10 overflow-hidden relative group">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition duration-700"></div>
                                    
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 font-bold">{t('job_radar_title')}</h3>
                                        <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-[10px] animate-pulse font-bold">{t('job_radar_live')}</div>
                                    </div>

                                    <div className="space-y-6">
                                        {radarItems.map((item, idx) => (
                                            <div key={idx} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-500/50 transition duration-500">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="font-bold text-slate-300">{item.role}</span>
                                                    <span className="text-cyan-400 text-xs font-bold">{item.gain}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-slate-500 text-xs line-through">Rp {item.prev}</span>
                                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden relative">
                                                        <div className="absolute inset-y-0 left-0 bg-cyan-500 w-full animate-grow origin-left"></div>
                                                    </div>
                                                    <span className="text-white font-bold">Rp {item.curr}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <style jsx>{`
                        @keyframes grow {
                            0% { transform: scaleX(0); }
                            100% { transform: scaleX(1); }
                        }
                        .animate-grow {
                            animation: grow 2s ease-out infinite;
                        }
                    `}</style>
                </section>

                {/* NEW SECTION: SCIENTIFIC PILLAR (E-E-A-T) - TERMINAL COMMAND STYLE */}
                <section className="py-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <div className="bg-black/50 border border-white/10 rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden group">
                            
                            {/* Terminal Header */}
                            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                </div>
                                <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Scientific_Core_Module.exe</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="p-8 md:p-16 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-widest mb-10 border border-indigo-500/30">
                                    🧬 {t('job_science_badge')}
                                </div>

                                <h2 className="text-4xl md:text-5xl font-mono text-emerald-400 mb-10 leading-tight font-black">
                                    <span className="text-white opacity-50 mr-4">&gt;</span>{t('job_science_title')}<span className="animate-pulse">_</span>
                                </h2>

                                <div className="bg-black/40 border-l-4 border-emerald-500 p-8 rounded-r-2xl mb-12">
                                    <p className="text-emerald-500/80 text-xl md:text-2xl font-mono leading-relaxed italic">
                                        {t('job_science_desc')}
                                    </p>
                                </div>

                                {/* System Parameters */}
                                <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
                                    <div>
                                        <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_01: Architecture</span>
                                        <h4 className="text-white font-mono text-lg mb-2 font-bold">Systems Thinking</h4>
                                        <p className="text-white/40 text-xs leading-relaxed font-mono">Optimizing the job search as a multi-stage deterministic framework for predictability.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_02: Optimization</span>
                                        <h4 className="text-white font-mono text-lg mb-2 font-bold">Iterative Feedback</h4>
                                        <p className="text-white/40 text-xs leading-relaxed font-mono">Continuous loop refinement based on recruiter interactions and pipeline velocity data.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_03: Core_Logic</span>
                                        <h4 className="text-white font-mono text-lg mb-2 font-bold">Pipeline Management</h4>
                                        <p className="text-white/40 text-xs leading-relaxed font-mono">Visualizing career transition as a funnel conversion process to maximize final placement ROI.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: JOB MATCHING */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest mb-8 border border-emerald-500/20">
                                🎯 {t('job_ai_promo_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('job_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('job_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-emerald-700 transition transform hover:-translate-y-1">
                                {t('job_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-32 h-32 rounded-full border-8 border-emerald-500/20 flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin-slow"></div>
                                        <span className="text-2xl text-white font-bold">96%</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400">Keyword Match: Structured Execution</div>
                                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400">Skill Alignment: High</div>
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
                            {t('job_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('job_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: BOTTOM CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-6xl mb-6 font-black">{t('job_cta_title')}</h2>
                            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                                {t('job_cta_desc')}
                            </p>
                            <Link href="/register" className="bg-white text-indigo-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-indigo-50 transition transform hover:scale-105 shadow-xl inline-block">
                                {t('job_cta_btn')}
                            </Link>
                            <p className="text-indigo-100 mt-8 text-sm font-medium opacity-80">{t('job_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Job Tracker (FAQ)
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
