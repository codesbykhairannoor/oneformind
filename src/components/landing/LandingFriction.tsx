'use client';

import { useTranslations } from 'next-intl';

export default function LandingFriction() {
    const t = useTranslations();

    const frictionApps = [
        { icon: '📅', name: 'fric_app_1' },
        { icon: '🌱', name: 'fric_app_2' },
        { icon: '💰', name: 'fric_app_3' },
        { icon: '📔', name: 'fric_app_4' },
        { icon: '🎯', name: 'fric_app_5' }
    ];

    return (
        <section className="py-32 bg-slate-900 relative overflow-hidden">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0,transparent_50%)]"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-[10px] mb-8 border border-indigo-500/20">
                            {t('fric_badge')}
                        </div>
                        <h2 className="text-[36px] leading-[1.1] md:text-6xl text-white mb-8 font-black">
                            {t('fric_title')}
                        </h2>
                        <p className="text-slate-400 text-xl leading-relaxed mb-12 font-medium">
                            {t('fric_desc')}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {frictionApps.map((app, idx) => (
                                <div key={idx} className="p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 group hover:bg-slate-800 transition">
                                    <div className="text-3xl mb-4 group-hover:scale-110 transition font-black">{app.icon}</div>
                                    <div className="text-[10px] font-black text-slate-500 tracking-widest">{t(app.name)}</div>
                                </div>
                            ))}
                            <div className="p-6 bg-red-500/10 rounded-[2rem] border border-red-500/20 flex flex-col justify-center items-center text-center">
                                <div className="text-red-400 font-black text-xs tracking-widest">{t('fric_chaos')}</div>
                                <div className="text-[10px] font-bold text-red-500/50">{t('fric_fragmented_data')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-600 rounded-[3.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-slate-800 p-12 rounded-[3.5rem] border border-slate-700 shadow-2xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-5xl mb-8 shadow-2xl shadow-indigo-500/50 animate-pulse font-black">
                                    🌌
                                </div>
                                <h3 className="text-3xl text-white mb-6 uppercase tracking-wider font-black">{t('fric_solution_title')}</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    {t('fric_solution_desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
