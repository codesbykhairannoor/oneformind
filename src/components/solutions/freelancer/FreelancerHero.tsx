'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function FreelancerHero() {
    const t = useTranslations();

    return (
        <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50 relative border-b border-gray-100">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                
                <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                        💻 {t('freelance_hero_badge')}
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl mb-6 leading-[1.05] text-gray-900 tracking-tight font-black">
                        {t('freelance_hero_title_1')}
                        <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                            {t('freelance_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                        {t('freelance_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                            {t('freelance_hero_cta_1')}
                        </Link>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-4 text-sm font-bold text-gray-400">
                        <div className="flex -space-x-2">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white text-xs font-bold">SS</span>
                            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white text-xs font-bold">DF</span>
                            <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white text-xs font-bold">KN</span>
                        </div>
                        <p>{t('freelance_hero_social_proof')}</p>
                    </div>
                </div>

                {/* Floating Freelance Ecosystem */}
                <div className="lg:col-span-5 mt-0 relative z-10 w-full h-[500px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full blur-3xl opacity-20"></div>
                    
                    {/* Center Piece: Freelancer ID Card */}
                    <div className="absolute z-20 w-72 bg-white/90 rounded-3xl shadow-2xl border border-white p-6 transform hover:scale-105 transition duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5">
                                <img className="w-full h-full rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=U+M&background=fff&color=4f46e5" alt="User" />
                            </div>
                            <span className="bg-emerald-100 text-emerald-600 text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t('freelance_mockup_available')}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 mb-1">{t('freelance_mockup_role')}</h3>
                            <p className="text-xs font-medium text-gray-500 mb-4">{t('freelance_mockup_rating')}</p>
                            
                            <div className="flex gap-2 mb-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Laravel</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Vue.js</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Tailwind</span>
                            </div>
                            
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full w-[92%]"></div>
                            </div>
                            <p className="text-[10px] text-right font-bold text-gray-400 mt-1">{t('freelance_mockup_completion')}</p>
                        </div>
                    </div>

                    {/* Floating Item Top Right: Payment Received */}
                    <div className="absolute top-8 right-0 z-30 w-56 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 p-4 transform rotate-3 hover:rotate-0 transition duration-300 animate-bounce">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">💰</div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('freelance_mockup_payment_badge')}</p>
                                <p className="text-sm text-white font-bold">$ 1,250.00</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">{t('freelance_mockup_payment_from')}</p>
                    </div>

                    {/* Floating Item Bottom Left: Client Message */}
                    <div className="absolute bottom-12 left-0 z-30 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 p-4 transform -rotate-3 hover:rotate-0 transition duration-300">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-sm">👋</div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs text-gray-900 font-bold">{t('freelance_mockup_msg_name')}</p>
                                    <p className="text-[9px] font-bold text-gray-400">{t('freelance_mockup_msg_time')}</p>
                                </div>
                                <p className="text-[11px] font-medium text-gray-600 leading-tight">
                                    "{t('freelance_mockup_msg_text')}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Element: Project Milestone */}
                    <div className="absolute bottom-4 right-10 z-10 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-slate-100 flex items-center gap-2">
                        <span className="text-sky-500">🎯</span>
                        <p className="text-[10px] text-slate-700 uppercase tracking-wide font-bold">{t('freelance_mockup_milestone')}</p>
                    </div>

                </div>
            </div>
        </header>
    );
}
