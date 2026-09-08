'use client';

import { useTranslations } from 'next-intl';

export default function FreelancerProblem() {
    const t = useTranslations();

    return (
        <section className="py-24 bg-white bg-pattern-dots relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h2 className="text-5xl md:text-5xl mb-6 text-gray-900 font-black">{t('freelance_prob_title')}</h2>
                    <p className="text-xl text-gray-500">{t('freelance_prob_desc')}</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gray-100 -z-10 rounded-full border-b-2 border-dashed border-gray-200"></div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition duration-300 relative group">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-indigo-600 group-hover:text-white transition font-bold">1</div>
                            <div className="text-4xl mb-4 mt-2 text-center font-black select-none">🤯</div>
                            <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_1_title')}</h3>
                            <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_1_desc')}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition duration-300 relative group delay-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-rose-500 group-hover:text-white transition font-bold">2</div>
                            <div className="text-4xl mb-4 mt-2 text-center font-black select-none">💸</div>
                            <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_2_title')}</h3>
                            <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_2_desc')}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-200 transition duration-300 relative group delay-200">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-amber-500 group-hover:text-white transition font-bold">3</div>
                            <div className="text-4xl mb-4 mt-2 text-center font-black select-none">🥱</div>
                            <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_3_title')}</h3>
                            <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
