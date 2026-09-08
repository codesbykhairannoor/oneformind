'use client';

import { useTranslations } from 'next-intl';

export default function StudentProblem() {
    const t = useTranslations();

    return (
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
    );
}
