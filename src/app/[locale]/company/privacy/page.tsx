'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';

export default function PrivacyPage() {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState('tldr');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [1, 2, 3];

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
            {/* 🔥 PREMIUM HEADER: THE DIGITAL VAULT 🔥 */}
            <header className="relative pt-32 pb-24 px-6 bg-slate-950 overflow-hidden border-b border-white/5">
                {/* 1. Tech Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-20" />

                {/* 2. Ambient Spotlights */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT: Typography & Status */}
                    <div className="animate-in slide-in-from-left-8 fade-in duration-700">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-[10px] mb-8 uppercase tracking-[0.2em]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            {t('privacy_badge')}
                        </div>

                        <h1 className="text-6xl md:text-8xl text-white tracking-tighter leading-[0.9] mb-8 font-black">
                            {t('privacy_title_1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                                {t('privacy_title_2')}
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-xl leading-relaxed mb-12 border-l-4 border-indigo-500/40 pl-8">
                            {t('privacy_subtitle')}
                        </p>

                        {/* Status Hub */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{t('privacy_status_protection')}</p>
                                <p className="text-white font-bold text-sm tracking-widest">{t('privacy_status_protection_val')}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{t('privacy_status_access')}</p>
                                <p className="text-emerald-400 font-bold text-sm">{t('privacy_status_access_val')}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{t('privacy_status_tracking')}</p>
                                <p className="text-white font-bold text-sm">{t('privacy_status_tracking_val')}</p>
                            </div>
                            <div className="col-span-1">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{t('privacy_status_protocol')}</p>
                                <p className="text-slate-300 font-bold text-[10px]">{t('privacy_status_protocol_val')}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Visual Shield */}
                    <div className="relative hidden lg:flex justify-center items-center animate-in zoom-in-50 fade-in duration-1000 delay-200">
                        <div className="relative w-96 h-96">
                            <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-[3rem] rotate-12 animate-pulse" />
                            <div className="absolute inset-4 border border-emerald-500/20 rounded-[2.5rem] -rotate-6 animate-[spin_20s_linear_infinite]" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 bg-gradient-to-br from-indigo-600/80 to-purple-800/80 rounded-[2.5rem] p-8 border border-white/20 shadow-[0_0_80px_-10px_rgba(79,70,229,0.5)] transform hover:scale-105 transition duration-500 group">
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                        <div className="text-[8px] font-mono text-white/50 tracking-widest uppercase">{t('privacy_locked_label')}</div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 w-[90%] transform origin-left animate-[grow_2s_ease-out]" />
                                        </div>
                                        <div className="h-1.5 w-2/3 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-300 w-[60%] transform origin-left animate-[grow_2.5s_ease-out_delay-300]" />
                                        </div>
                                        <div className="pt-6">
                                            <p className="text-white font-black text-xl leading-tight">{t('privacy_locked_title')}</p>
                                            <p className="text-indigo-200 text-[10px] mt-2 opacity-70">{t('privacy_locked_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN SECTION */}
            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 relative">
                    {/* SIDEBAR NAV */}
                    <aside className="hidden lg:block w-1/4 shrink-0 relative">
                        <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                <span className="w-1 h-3 bg-indigo-600 rounded-full" />
                                {t('privacy_toc_title')}
                            </h3>
                            <nav className="space-y-1 font-bold text-base text-slate-500">
                                {[
                                    { id: 'tldr', label: t('privacy_nav_1') },
                                    { id: 'collection', label: t('privacy_nav_2') },
                                    { id: 'usage', label: t('privacy_nav_3') },
                                    { id: 'security', label: t('privacy_nav_4') },
                                    { id: 'thirdparty', label: t('privacy_nav_5') },
                                    { id: 'rights', label: t('privacy_nav_6') },
                                    { id: 'contact', label: t('privacy_nav_7') },
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block px-4 py-3 rounded-2xl transition hover:bg-slate-50 hover:text-indigo-600 ${
                                            activeSection === item.id ? 'bg-indigo-50 text-indigo-600' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-12 pt-8 border-t border-slate-100">
                                <a href="#" className="flex items-center gap-3 text-xs font-black text-slate-900 hover:text-indigo-600 transition group">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    {t('privacy_download_pdf')}
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* PROSE CONTENT */}
                    <main className="w-full lg:w-3/4">
                        {/* TL;DR Grid */}
                        <div id="tldr" className="scroll-mt-32 mb-20">
                            <h2 className="text-3xl text-slate-900 mb-10 flex items-center gap-4 font-black">
                                <span className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200">⚡</span>
                                {t('privacy_tldr_title')}
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6 leading-relaxed">
                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                    <h3 className="font-black text-xl mb-3">{t('privacy_tldr_1_title')}</h3>
                                    <p className="text-indigo-100 text-sm">{t('privacy_tldr_1_desc')}</p>
                                </div>
                                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                                    <h3 className="font-black text-slate-900 text-xl mb-3">{t('privacy_tldr_2_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('privacy_tldr_2_desc')}</p>
                                </div>
                                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                                    <h3 className="font-black text-slate-900 text-xl mb-3">{t('privacy_tldr_3_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('privacy_tldr_3_desc')}</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] shadow-sm">
                                    <h3 className="font-black text-emerald-900 text-xl mb-3">{t('privacy_tldr_4_title')}</h3>
                                    <p className="text-emerald-700/80 text-sm">{t('privacy_tldr_4_desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Article Text Body */}
                        <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm prose prose-lg prose-indigo max-w-none text-slate-600 mb-16">
                            <p className="lead text-2xl text-slate-800 font-medium mb-16 leading-relaxed">
                                {t('privacy_doc_intro')}
                            </p>

                            <h2 id="collection" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_collection')}</h2>
                            <p>{t('privacy_p_collection')}</p>
                            <ul className="marker:text-indigo-600">
                                <li><strong>{t('privacy_li_collection_1_title')}:</strong> {t('privacy_li_collection_1_desc')}</li>
                                <li><strong>{t('privacy_li_collection_2_title')}:</strong> {t('privacy_li_collection_2_desc')} <span className="text-indigo-600 font-bold">{t('privacy_li_collection_2_strong')}</span></li>
                                <li><strong>{t('privacy_li_collection_3_title')}:</strong> {t('privacy_li_collection_3_desc')}</li>
                            </ul>

                            <h2 id="usage" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_usage')}</h2>
                            <p>{t('privacy_p_usage')}</p>
                            <ul>
                                <li>{t('privacy_li_usage_1')}</li>
                                <li>{t('privacy_li_usage_2')}</li>
                                <li>{t('privacy_li_usage_3')}</li>
                            </ul>

                            <div className="my-10 p-8 bg-rose-50 rounded-3xl border border-rose-100 flex gap-6 items-start">
                                <span className="text-3xl mt-1 font-black">🛡️</span>
                                <div className="not-prose">
                                    <h4 className="text-rose-900 font-black text-lg mb-2">{t('privacy_finance_note_title')}</h4>
                                    <p className="text-rose-800/80 text-sm leading-relaxed">{t('privacy_finance_note_desc')}</p>
                                </div>
                            </div>

                            <h2 id="security" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_security')}</h2>
                            <p>{t('privacy_p_security')}</p>

                            <h2 id="thirdparty" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_thirdparty')}</h2>
                            <p>{t('privacy_p_thirdparty')}</p>

                            <h2 id="rights" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_rights')}</h2>
                            <p>{t('privacy_p_rights')}</p>
                            <ul>
                                <li>{t('privacy_li_rights_1')}</li>
                                <li>{t('privacy_li_rights_2')}</li>
                                <li>{t('privacy_li_rights_3')}</li>
                            </ul>

                            <h2 id="contact" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('privacy_h2_contact')}</h2>
                            <p>{t('privacy_p_contact')}</p>
                            
                            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 not-prose flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-inner">
                                <div>
                                    <p className="font-black text-slate-900 text-lg mb-1">{t('privacy_contact_role')}</p>
                                    <a href={`mailto:${t('privacy_contact_email')}`} className="text-indigo-600 font-black text-2xl tracking-tighter hover:underline">
                                        {t('privacy_contact_email')}
                                    </a>
                                </div>
                                <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
                                    {t('privacy_contact_sla')}
                                </div>
                            </div>
                        </div>

                        {/* BENTO: PORTABILITY */}
                        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden mb-20 group">
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-1000" />
                            <div className="relative z-10">
                                <h3 className="text-4xl mb-6 font-black">{t('privacy_export_title')}</h3>
                                <p className="text-indigo-100 text-xl leading-relaxed mb-10 opacity-70 max-w-2xl">
                                    {t('privacy_export_desc')}
                                </p>
                                <ul className="grid sm:grid-cols-2 gap-4 list-none p-0">
                                    <li className="flex items-center gap-3 font-black text-sm text-emerald-400">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {t('privacy_export_point_1')}
                                    </li>
                                    <li className="flex items-center gap-3 font-black text-sm text-emerald-400">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {t('privacy_export_point_2')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* FAQ SECTION */}
                        <div className="mb-24">
                            <h2 className="text-4xl text-slate-900 mb-12 text-center tracking-tight font-black">
                                {t('privacy_faq_title')}
                            </h2>
                            <div className="max-w-3xl mx-auto space-y-4">
                                {faqs.map((i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center group"
                                        >
                                            <span className="group-hover:text-indigo-600 transition">{t(`privacy_faq_${i}_q`)}</span>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${openFaq === i ? 'rotate-180 bg-indigo-600 text-white' : 'bg-slate-50 text-slate-900'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </button>
                                        {openFaq === i && (
                                            <div className="px-8 pb-8 text-slate-600 leading-relaxed font-medium">
                                                {t(`privacy_faq_${i}_a`)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 px-6 bg-white border-t border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-5xl md:text-7xl mb-8 text-slate-900 tracking-tighter leading-none font-black">
                        {t('privacy_cta_title')}
                    </h2>
                    <p className="text-2xl text-slate-500 mb-14 leading-relaxed max-w-2xl mx-auto">
                        {t('privacy_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-flex items-center gap-4 bg-indigo-600 text-white px-12 py-5 rounded-full font-black text-xl hover:bg-indigo-700 hover:shadow-2xl transition transform hover:-translate-y-1 active:scale-95">
                        <span>⚡</span> {t('privacy_cta_btn')}
                    </Link>
                </div>
            </section>
        </GuestLayout>
    );
}
