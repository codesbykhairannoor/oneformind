'use client';

import { useTranslations } from 'next-intl';

export default function SecondBrainFramework() {
    const t = useTranslations();

    return (
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-7xl mb-6 font-black">{t('brain_sol_title')}</h2>
                    <p className="text-indigo-300 text-xl font-medium">{t('brain_sol_desc')}</p>
                </div>

                {/* Vertical Process Pathway */}
                <div className="relative space-y-12 before:absolute before:inset-0 before:ml-12 md:before:ml-[50%] md:before:-translate-x-px md:before:w-0.5 before:bg-indigo-800 before:-z-10">
                    
                    {/* Step 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-indigo-600 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">🎣</div>
                        <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-indigo-500/50 transition duration-300">
                            <h3 className="text-2xl font-bold text-indigo-400 mb-3">{t('brain_step_1_title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_1_desc')}</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:even:flex-row group">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-blue-600 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">🗄️</div>
                        <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-blue-500/50 transition duration-300 md:ml-auto">
                            <h3 className="text-2xl font-bold text-blue-400 mb-3">{t('brain_step_2_title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_2_desc')}</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-emerald-500 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">✨</div>
                        <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-emerald-500/50 transition duration-300">
                            <h3 className="text-2xl font-bold text-emerald-400 mb-3">{t('brain_step_3_title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_3_desc')}</p>
                        </div>
                    </div>
                </div>

                {/* Bento Hub */}
                <div className="relative w-full max-w-4xl mx-auto mt-32 rounded-[3rem] bg-slate-950 p-3 shadow-2xl border border-slate-800">
                    <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] blur-3xl opacity-20 -z-10"></div>
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative text-left">
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl font-black select-none">🧠</div>
                            <h3 className="text-3xl text-white font-black">{t('brain_hub_title')}</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 relative z-10">
                            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-indigo-400/20 rounded-xl flex items-center justify-center text-2xl select-none">⚡</div>
                                    <h4 className="font-bold text-indigo-200 text-lg">{t('brain_hub_inbox_title')}</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_hub_inbox_desc')}</p>
                            </div>
                            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center text-2xl select-none">🏡</div>
                                    <h4 className="font-bold text-blue-200 text-lg">{t('brain_hub_os_title')}</h4>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_hub_os_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
