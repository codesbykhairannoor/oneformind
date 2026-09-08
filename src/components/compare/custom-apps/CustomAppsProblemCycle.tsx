'use client';

import { useTranslations } from 'next-intl';

export default function CustomAppsProblemCycle() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 2: REDESIGN - THE CYCLE */}
            <section className="py-[80px] bg-white px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16 md:flex md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('blank_cycle_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('blank_cycle_desc')}</p>
                        </div>
                        <div className="hidden md:block text-5xl text-gray-200 rotate-90 font-black">⤵</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
                        <div className="md:col-span-7 bg-gradient-to-br from-purple-50 to-white p-10 rounded-[2.5rem] border border-purple-100 relative overflow-hidden group hover:border-purple-300 transition-all duration-300">
                            <div className="absolute top-0 right-0 bg-purple-100 w-32 h-32 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 font-black">✨</div>
                                <h3 className="text-2xl mb-3 text-gray-900 font-bold">{t('blank_cycle_1_title')}</h3>
                                <p className="text-gray-500 leading-relaxed">{t('blank_cycle_1_desc')}</p>
                            </div>
                        </div>

                        <div className="md:col-span-5 row-span-2 bg-gray-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-3xl border border-gray-700 mb-6 font-black">🤯</div>
                                    <h3 className="text-2xl mb-3 font-bold">{t('blank_cycle_2_title')}</h3>
                                    <p className="text-gray-400 leading-relaxed">{t('blank_cycle_2_desc')}</p>
                                </div>
                                <div className="mt-8 p-4 bg-gray-800/50 rounded-2xl border border-gray-700 ">
                                    <div className="flex gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-7 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg shadow-gray-100 relative group hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="w-14 h-14 shrink-0 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-3xl font-black">🏚️</div>
                                <div>
                                    <h3 className="text-2xl mb-2 text-gray-900 font-bold">{t('blank_cycle_3_title')}</h3>
                                    <p className="text-gray-500 leading-relaxed">{t('blank_cycle_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: REDESIGN - THE PROBLEM */}
            <section className="py-[80px] px-6 bg-gray-950 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-2 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-[2rem] transform rotate-3 scale-95 opacity-50"></div>
                            <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-[2rem] shadow-2xl">
                                <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                        <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded w-24"></div>
                                </div>
                                <div className="space-y-4">
                                    {[100, 80, 60, 40].map((opacity, i) => (
                                        <div key={i} className={`flex items-center gap-4 opacity-${opacity}`}>
                                            <div className="w-6 h-6 border-2 border-gray-700 rounded bg-transparent"></div>
                                            <div className="flex-1 h-3 bg-gray-800 rounded"></div>
                                            <div className="w-16 h-3 bg-red-900/50 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="absolute -top-6 -right-6 bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-900/50 transform rotate-12">
                                    {t('blank_chaos_badge')}
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-1">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-8 text-white">
                                {t('blank_prob_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{t('blank_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-400 mb-10 border-l-4 border-gray-800 pl-6">
                                {t('blank_prob_desc')}
                            </p>
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-red-500 text-xl mt-1">✕</span>
                                    <p className="text-gray-300 font-medium">{t('blank_prob_point_1')}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-red-500 text-xl mt-1">✕</span>
                                    <p className="text-gray-300 font-medium">{t('blank_prob_point_2')}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-red-500 text-xl mt-1">✕</span>
                                    <p className="text-gray-300 font-medium">{t('blank_prob_point_3')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
