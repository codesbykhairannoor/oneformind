'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, LifeBuoy, ShieldCheck, BookOpen, CreditCard } from 'lucide-react';

export default function HelpPage() {
    const t = useTranslations();
    const [search, setSearch] = useState('');
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Bagaimana cara menghubungi tim bantuan teknis Tranvas?',
            a: 'Anda dapat mengirimkan email langsung ke tranvasapp@gmail.com atau bergabung ke kanal komunitas resmi.'
        },
        {
            q: 'Apakah ada garansi pengembalian dana 30 hari?',
            a: 'Ya, garansi pengembalian dana penuh 100% berlaku dalam 30 hari pertama tanpa syarat rumit.'
        },
        {
            q: 'Apakah status server Tranvas selalu online?',
            a: 'Sistem kami beroperasi dengan Service Level Agreement (SLA) 99.9% Uptime dan latensi kurang dari 50ms.'
        }
    ];

    const categories = [
        { key: 'help_cat_1', icon: LifeBuoy },
        { key: 'help_cat_2', icon: ShieldCheck },
        { key: 'help_cat_3', icon: BookOpen },
        { key: 'help_cat_4', icon: CreditCard },
    ];

    const popularQuestions = [
        t('help_popular_q1'),
        t('help_popular_q2'),
        t('help_popular_q3'),
        t('help_popular_q4'),
        t('help_popular_q5'),
        t('help_popular_q6'),
    ];

    const faqItems = [
        { q: t('help_faq_q1'), a: t('help_faq_a1') },
        { q: t('help_faq_q2'), a: t('help_faq_a2') },
        { q: t('help_faq_q3'), a: t('help_faq_a3') },
    ];

    return (
        <GuestLayout>
            <main id="help-center" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-48 pb-32 px-6 relative bg-white overflow-hidden border-b border-gray-100">
                    {/* Premium Dot-Grid Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

                    <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
                        {/* Premium Icon */}
                        <div className="w-20 h-20 bg-white border border-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-indigo-100/50 transform rotate-3 hover:rotate-0 transition duration-500">
                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 font-black text-[10px] mb-8 uppercase tracking-[0.25em] border border-emerald-100/50 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            {t('help_status_all_ok')}
                        </div>

                        <h1 className="text-6xl md:text-8xl mb-10 leading-[1] text-slate-900 tracking-tighter font-black">
                            {t('help_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">{t('help_hero_title_2')}</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 mb-16 leading-relaxed max-w-2xl mx-auto font-medium opacity-80">
                            {t('help_hero_desc')}
                        </p>

                        {/* Modern Search Bar */}
                        <div className="relative max-w-2xl mx-auto mb-16 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.8rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                            <div className="relative flex items-center bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden p-2 shadow-sm transition-all duration-500">
                                <div className="pl-6 pr-2 text-slate-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t('help_search_placeholder')}
                                    className="w-full py-5 px-3 text-lg text-slate-900 bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 font-bold"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[1.8rem] font-black text-sm transition shadow-xl shadow-indigo-200 active:scale-95 ml-2">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: ICONIC CATEGORIES */}
                {!search && (
                    <section className="py-24 bg-white border-t border-slate-50">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categories.map((cat, idx) => {
                                    const IconComponent = cat.icon;
                                    return (
                                        <a href="#" key={idx} className="group p-10 rounded-[3rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500 block">
                                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition duration-500 border border-indigo-100 opacity-70 group-hover:opacity-100">
                                                <IconComponent size={32} />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition">
                                                {t(`${cat.key}_title`)}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                {t(`${cat.key}_desc`)}
                                            </p>
                                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition duration-500">
                                                Explore <span>→</span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* SECTION 3: POPULAR & FAQ SPLIT */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24">
                            {/* TOP ARTICLES */}
                            <div className="space-y-8">
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900 }} className="text-slate-900 font-black">
                                    {t('help_popular_title')}
                                </h2>
                                <div className="grid gap-4">
                                    {popularQuestions.map((q, idx) => (
                                        <a href="#" key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 hover:translate-x-2 transition duration-300 flex items-center justify-between group">
                                            <div className="flex items-center gap-5">
                                                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                                                    0{idx + 1}
                                                </span>
                                                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{q}</span>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ ACCORDION */}
                            <div className="space-y-8">
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900 }} className="text-slate-900 font-black">
                                    {t('help_faq_title')}
                                </h2>
                                <div className="space-y-4">
                                    {faqItems.map((item, idx) => (
                                        <div key={idx} className={`bg-white rounded-3xl border border-slate-200 overflow-hidden transition shadow-sm ${activeFaq === idx ? 'ring-2 ring-indigo-500' : ''}`}>
                                            <button
                                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                                className="w-full px-8 py-8 flex items-center justify-between text-left font-bold text-slate-900 text-xl"
                                            >
                                                <span>{item.q}</span>
                                                <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition ${activeFaq === idx ? 'rotate-180 bg-indigo-600 text-white' : ''}`}>
                                                    <ChevronDown size={18} />
                                                </div>
                                            </button>
                                            {activeFaq === idx && (
                                                <div className="px-8 pb-8 text-slate-500 text-lg leading-relaxed border-t border-slate-100 pt-6">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: PRODUCT SUPPORT */}
                {!search && (
                    <section className="py-32 bg-white">
                        <div className="max-w-7xl mx-auto px-6 space-y-16">
                            <div className="text-center space-y-4">
                                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }} className="text-gray-900 font-black">
                                    {t('help_support_title')}
                                </h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="text-gray-500">{t('help_support_desc')}</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="p-10 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 text-center space-y-4 hover:bg-white hover:shadow-2xl transition">
                                    <div className="text-4xl font-black">🎥</div>
                                    <h3 className="text-xl font-bold text-gray-900">{t('help_support_1_title')}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{t('help_support_1_desc')}</p>
                                </div>
                                <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 text-center space-y-4 hover:bg-white hover:shadow-2xl transition">
                                    <div className="text-4xl font-black">📖</div>
                                    <h3 className="text-xl font-bold text-gray-900">{t('help_support_2_title')}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{t('help_support_2_desc')}</p>
                                </div>
                                <div className="p-10 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 text-center space-y-4 hover:bg-white hover:shadow-2xl transition">
                                    <div className="text-4xl font-black">🔧</div>
                                    <h3 className="text-xl font-bold text-gray-900">{t('help_support_3_title')}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{t('help_support_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SECTION 5: VIDEO TUTORIALS */}
                {!search && (
                    <section className="py-24 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-6 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900 }} className="text-slate-900 font-black">
                                    {t('hlp_tuts_title')}
                                </h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="text-slate-500">{t('hlp_tuts_desc')}</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((v) => (
                                    <div key={v} className="h-48 bg-slate-200 rounded-3xl flex items-center justify-center hover:bg-slate-300 transition cursor-pointer text-2xl font-black text-slate-600">
                                        ▶ Video #{v}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* SECTION 6: CHEATSHEETS */}
                {!search && (
                    <section className="py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-6 space-y-12">
                            <div className="space-y-4">
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900 }} className="text-slate-900 font-black">
                                    {t('hlp_cheat_title')}
                                </h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="text-slate-500">{t('hlp_cheat_desc')}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-10 border-2 border-dashed border-indigo-200 rounded-[2rem] bg-indigo-50/30 space-y-2">
                                    <h3 className="text-2xl font-bold text-indigo-900">{t('hlp_ch1')}</h3>
                                </div>
                                <div className="p-10 border-2 border-dashed border-emerald-200 rounded-[2rem] bg-emerald-50/30 space-y-2">
                                    <h3 className="text-2xl font-bold text-emerald-900">{t('hlp_ch2')}</h3>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SECTION 7: SYSTEM SLA */}
                {!search && (
                    <section className="py-24 bg-slate-900 text-white">
                        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
                            <div className="space-y-4">
                                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900 }} className="font-black">
                                    {t('hlp_sla_title')}
                                </h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="text-slate-400">{t('hlp_sla_desc')}</p>
                            </div>
                            <div className="flex flex-col md:flex-row justify-center gap-16">
                                <div className="space-y-2">
                                    <h4 className="text-6xl text-emerald-400 font-black">99.9%</h4>
                                    <p className="text-lg font-bold">{t('hlp_sla1')}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-6xl text-indigo-400 font-black">&lt; 50ms</h4>
                                    <p className="text-lg font-bold">{t('hlp_sla2')}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SECTION 8: CONTACT CTA */}
                <section className="py-32 px-6 bg-slate-50 relative overflow-hidden border-t border-gray-200">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white -z-10" />

                    <div className="max-w-6xl mx-auto bg-indigo-950 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl text-white">
                        {/* Decorative Orb */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-[2rem] text-4xl mb-10 border border-white/20 shadow-inner font-black">
                                🆘
                            </div>
                            <h2 className="text-4xl md:text-7xl text-white mb-8 tracking-tight leading-tight font-black">
                                {t('help_cta_title')}
                            </h2>
                            <p className="text-lg md:text-2xl text-indigo-200 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
                                {t('help_cta_desc')}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                                <a href="mailto:tranvasapp@gmail.com" className="inline-flex items-center justify-center gap-4 bg-white text-indigo-950 px-12 py-6 rounded-3xl font-black text-xl hover:bg-indigo-50 shadow-2xl transition transform hover:-translate-y-1 w-full sm:w-auto active:scale-95">
                                    {t('help_cta_btn')}
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                                <Link href="/resources/community" className="text-white font-black text-xl hover:text-indigo-300 transition-colors py-4">
                                    {t('help_cta_community')} →
                                </Link>
                            </div>

                            <p className="mt-12 text-sm font-bold text-indigo-400/50 uppercase tracking-[0.3em]">{t('help_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Help Center (FAQ)
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
