'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';

export default function RefundPage() {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState('guarantee');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });
        
        const sections = document.querySelectorAll('main [id]');
        sections.forEach((s) => observer.observe(s));
        
        return () => observer.disconnect();
    }, []);

    return (
        <GuestLayout>
            <header className="relative pt-32 pb-24 px-6 bg-slate-900 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-[10px] mb-8 uppercase tracking-widest ">
                        🛑 {t('refund_badge')}
                    </div>

                    <h1 className="text-5xl md:text-8xl text-white tracking-tighter leading-[0.85] mb-8 font-black">
                        {t('refund_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-rose-300">
                            {t('refund_title_2')}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-bold">
                        {t('refund_subtitle')}
                    </p>

                    <div className="flex justify-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest pt-8">
                        <span>{t('refund_effective_date')}</span>
                        <span>•</span>
                        <span>DOC_ID: RFD-2026-FINAL-BINDING</span>
                    </div>
                </div>
            </header>

            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 relative">
                    
                    <aside className="hidden lg:block w-1/4 shrink-0 relative">
                        <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
                            
                            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                <span className="w-1 h-3 bg-rose-500 rounded-full"></span>
                                {t('refund_nav_title')}
                            </h3>
                            <nav className="space-y-1 font-bold text-base text-slate-500">
                                {[
                                    { id: 'guarantee', label: t('refund_nav_1') },
                                    { id: 'process', label: t('refund_nav_2') },
                                    { id: 'cancellation', label: t('refund_nav_3') },
                                    { id: 'exclusion', label: t('refund_nav_4') },
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block px-4 py-3 rounded-2xl transition hover:bg-slate-50 hover:text-rose-600 ${
                                            activeSection === item.id ? 'bg-rose-50 text-rose-600' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <main className="w-full lg:w-3/4">
                        <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm prose prose-lg prose-indigo max-w-none text-slate-600 mb-16">
                            
                            <div className="flex items-center gap-6 p-10 bg-slate-900 rounded-[3rem] text-white not-prose mb-16 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-transparent"></div>
                                <div className="text-6xl group-hover:rotate-12 transition font-black">🛡️</div>
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black mb-2 tracking-tight">{t('refund_merchant_protection_title')}</h4>
                                    <p className="text-slate-400 font-bold leading-relaxed mb-0">
                                        {t('refund_merchant_protection_desc')}
                                    </p>
                                </div>
                            </div>

                            <h2 id="guarantee" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('refund_h2_guarantee')}</h2>
                            <p className="font-bold text-slate-800">{t('refund_p_guarantee')}</p>
                            <ul className="marker:text-rose-600 font-bold italic">
                                <li>{t('refund_li_guarantee_1')}</li>
                                <li>{t('refund_li_guarantee_2')}</li>
                            </ul>

                            <h2 id="process" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('refund_h2_process')}</h2>
                            <p>{t('refund_p_process')}</p>
                            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 not-prose mb-12 shadow-inner">
                                <div className="space-y-6">
                                    <p className="font-bold text-slate-900 m-0">{t('refund_user_responsibility_title')}</p>
                                    <div className="flex items-center gap-6">
                                        <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-rose-500 border border-slate-200 shadow-sm shrink-0">01</span>
                                        <p className="m-0 text-slate-800 font-bold">{t('refund_li_process_1')}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-rose-500 border border-slate-200 shadow-sm shrink-0">02</span>
                                        <p className="m-0 text-slate-800 font-bold">{t('refund_li_process_2')}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-rose-500 border border-slate-200 shadow-sm shrink-0">03</span>
                                        <p className="m-0 text-slate-800 font-bold">{t('refund_li_process_3')}</p>
                                    </div>
                                </div>
                            </div>

                            <h2 id="cancellation" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('refund_h2_cancellation')}</h2>
                            <p>{t('refund_p_cancellation')}</p>
                            <ul className="font-bold">
                                <li>{t('refund_li_cancellation_1')}</li>
                                <li>{t('refund_li_cancellation_2')}</li>
                            </ul>

                            <h2 id="exclusion" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('refund_h2_exclusion')}</h2>
                            <div className="p-8 bg-rose-50 rounded-3xl border border-rose-100 text-rose-900 text-sm leading-relaxed font-black uppercase">
                                🚫 {t('refund_p_exclusion')}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden group mb-12">
                            <div className="relative z-10 text-center">
                                <h3 className="text-4xl mb-6 tracking-tight font-black">{t('refund_cta_title')}</h3>
                                <p className="text-slate-400 text-xl mb-12 max-w-xl mx-auto opacity-80 font-bold leading-relaxed">
                                    {t('refund_cta_desc')}
                                </p>
                                <div className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-black text-indigo-300 w-fit mx-auto ">
                                    {t('refund_contact_label')}
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </section>
        </GuestLayout>
    );
}
