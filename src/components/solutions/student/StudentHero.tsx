'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function StudentHero() {
    const t = useTranslations();

    return (
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
    );
}
