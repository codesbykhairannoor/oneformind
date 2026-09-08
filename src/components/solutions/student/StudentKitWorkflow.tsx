'use client';

import { useTranslations } from 'next-intl';

export default function StudentKitWorkflow() {
    const t = useTranslations();

    return (
        <>
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
        </>
    );
}
