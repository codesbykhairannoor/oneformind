'use client';

import { useTranslations } from 'next-intl';

export default function HabitAppsProblemCycle() {
    const t = useTranslations();

    return (
        <>
            {/* THE CYCLE -> THE GAMIFICATION TRAP */}
            <section className="py-[80px] bg-white relative overflow-hidden border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">{t('habitap_cycle_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('habitap_cycle_desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-yellow-300 transition duration-300 relative group md:rotate-[-4deg] hover:rotate-0 z-10">
                            <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">🎮</div>
                            <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_1_title')}</h3>
                            <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_1_desc')}</p>
                        </div>
                        
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl transition duration-300 relative group z-20 md:scale-110">
                            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">STREAK LOST!</div>
                            <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">😱</div>
                            <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_2_title')}</h3>
                            <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_2_desc')}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-400 transition duration-300 relative group md:rotate-[4deg] hover:rotate-0 z-10">
                            <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">🏳️</div>
                            <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_3_title')}</h3>
                            <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE PROBLEM -> STREAK ANXIETY */}
            <section className="py-[80px] bg-gray-50 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 animate-in slide-in-from-bottom-12 fade-in duration-1000">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">⛓️</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                            {t('habitap_prob_title_1')} <span className="text-red-600 decoration-red-200 underline decoration-4 underline-offset-4">{t('habitap_prob_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mb-8">
                            {t('habitap_prob_desc')}
                        </p>
                        <ul className="space-y-4 font-bold text-gray-600">
                            <li className="flex items-center gap-4">
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                {t('habitap_prob_point_1')}
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                {t('habitap_prob_point_2')}
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                {t('habitap_prob_point_3')}
                            </li>
                        </ul>
                    </div>

                    <div className="order-1 lg:order-2 relative h-[500px] flex items-center justify-center animate-in slide-in-from-right-12 fade-in duration-1000 delay-200">
                        <div className="relative w-80 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-gray-800">October</span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">1 Day Missed</span>
                            </div>
                            
                            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                                {[...Array(20)].map((_, idx) => (
                                    <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center ${idx + 1 === 17 ? 'bg-red-500 text-white shadow-lg shadow-red-300 scale-110' : 'bg-green-100 text-green-700'}`}>
                                        {idx + 1}
                                    </div>
                                ))}
                                <div className="col-span-7 mt-2 h-0.5 bg-gray-100"></div>
                                {[...Array(8)].map((_, idx) => (
                                    <div key={idx + 21} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 opacity-50">
                                        {idx + 21}
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[110%] bg-white border border-red-100 p-4 rounded-xl shadow-2xl text-center transform rotate-3">
                                <p className="text-gray-900 font-bold mb-1">💀 Streak Reset to 0</p>
                                <p className="text-xs text-gray-500">You lost your 45-day progress.</p>
                                <button className="mt-3 w-full bg-gray-100 text-gray-400 text-xs py-2 rounded font-bold cursor-not-allowed">Repair (Paid)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
