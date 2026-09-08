'use client';

import { useTranslations } from 'next-intl';

export default function StudentSolutions() {
    const t = useTranslations();

    return (
        <>
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
        </>
    );
}
