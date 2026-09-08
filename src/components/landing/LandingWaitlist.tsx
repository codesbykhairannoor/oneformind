'use client';

import { useTranslations } from 'next-intl';

export default function LandingWaitlist() {
    const t = useTranslations();

    return (
        <section className="py-48 bg-white overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <div className="relative bg-slate-950 rounded-[3rem] p-12 md:p-20 shadow-2xl overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    
                    <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-300 font-bold text-[10px] mb-8 tracking-[0.2em] uppercase border border-white/10">
                                {t('eco_coming_soon')}
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight font-[900] tracking-tight">
                                {t('waitlist_title')}
                            </h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-0 opacity-80">
                                {t('waitlist_desc')}
                            </p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner">
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder={t('waitlist_input_placeholder')}
                                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                                    required
                                />
                                <button type="submit" className="w-full bg-white text-slate-950 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition transform active:scale-95 shadow-lg">
                                    {t('waitlist_btn')}
                                </button>
                            </form>

                            <p className="mt-6 text-[10px] text-slate-500 font-bold text-center tracking-widest uppercase opacity-60">
                                {t('waitlist_note')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
