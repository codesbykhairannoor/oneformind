'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, Mail, MessageSquare } from 'lucide-react';

export default function GuidePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('help_faq_q1') || 'Berapa lama waktu yang dibutuhkan untuk menguasai Tranvas User Guide?',
            a: t('help_faq_a1') || 'Panduan dasar dapat dipelajari dalam 10 menit. Sistem telah dirancang tanpa konfigurasi rumit.'
        },
        {
            q: t('help_faq_q2') || 'Apakah ada video masterclass gratis untuk mempelajari sistem ini?',
            a: t('help_faq_a2') || 'Ya, seluruh modul video masterclass dapat diakses secara gratis langsung dari halaman panduan ini.'
        },
        {
            q: t('help_faq_q3') || 'Bagaimana cara mendapatkan sertifikasi Tranvas Mastery?',
            a: t('help_faq_a3') || 'Anda cukup mengikuti 3 alur sertifikasi: Pelajari Modul, Terapkan Workflow, dan Ambil Lencana Kelulusan.'
        }
    ];

    const modules = [
        { icon: '🌱', key: '1' },
        { icon: '💰', key: '2' },
        { icon: '🗓️', key: '3' },
        { icon: '📔', key: '4' },
    ];

    const startSteps = [1, 2, 3];
    const articles = [
        { icon: '🎯', key: '1', readTime: '3' },
        { icon: '💸', key: '2', readTime: '4' },
        { icon: '⚡', key: '3', readTime: '5' }
    ];

    return (
        <GuestLayout>
            <main id="user-guide" className="overflow-x-hidden bg-white text-slate-900">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    {/* SECTION 1: HERO */}
                    <header className="pt-32 pb-32 px-6 relative overflow-hidden bg-white border-b border-gray-100">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-20" />

                        {/* FLOATER ICONS */}
                        <div className="hidden xl:block absolute left-20 top-1/2 -translate-y-1/2 space-y-12 animate-in slide-in-from-left-12 duration-1000">
                            <div style={{ animationDuration: '4000ms' }} className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center text-2xl animate-bounce">🌱</div>
                            <div style={{ animationDuration: '5000ms', animationDelay: '500ms' }} className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center text-2xl animate-bounce ml-12">💰</div>
                        </div>

                        <div className="hidden xl:block absolute right-20 top-1/2 -translate-y-1/2 space-y-12 animate-in slide-in-from-right-12 duration-1000">
                            <div style={{ animationDuration: '4200ms', animationDelay: '300ms' }} className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center text-2xl animate-bounce">📔</div>
                            <div style={{ animationDuration: '3800ms' }} className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center text-2xl animate-bounce mr-12">⚡</div>
                        </div>

                        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider shadow-sm border border-indigo-200">
                                📚 {t('guide_hero_badge')}
                            </div>

                            <h1 className="text-5xl md:text-7xl leading-[1.1] text-gray-900 tracking-tight font-black">
                                {t('guide_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('guide_hero_title_2')}
                                </span>
                            </h1>

                            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('guide_hero_desc')}
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-2xl mx-auto group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-15 group-focus-within:opacity-30 transition duration-500" />
                                <div className="relative flex items-center bg-white/90 rounded-[2rem] shadow-2xl border border-white overflow-hidden p-2 transition-all duration-300">
                                    <div className="text-2xl pl-5 pr-2">🔍</div>
                                    <input
                                        type="text"
                                        placeholder={t('guide_search_placeholder')}
                                        className="w-full py-4 px-2 text-lg text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 font-bold"
                                    />
                                    <button className="hidden sm:flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 transition px-8 py-4 rounded-full text-white font-black text-sm mr-1 shadow-lg shadow-indigo-200 active:scale-95">
                                        {t('guide_search_btn')}
                                        <div className="flex items-center gap-0.5 opacity-60 font-mono text-[10px] bg-black/20 px-2 py-1 rounded-lg uppercase">
                                            <span>⌘</span><span>K</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Quick Tags */}
                            <div className="mt-12 flex flex-wrap justify-center items-center gap-3">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mr-2">{t('guide_popular_search')}</span>
                                <a href="#" className="px-5 py-2 bg-white text-gray-600 rounded-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition shadow-sm border border-gray-100">{t('guide_tag_1')}</a>
                                <a href="#" className="px-5 py-2 bg-white text-gray-600 rounded-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition shadow-sm border border-gray-100">{t('guide_tag_2')}</a>
                                <a href="#" className="px-5 py-2 bg-white text-gray-600 rounded-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition shadow-sm border border-gray-100">{t('guide_tag_3')}</a>
                            </div>
                        </div>
                    </header>

                    {/* SECTION 2: MODULES GRID */}
                    <section className="py-24 bg-gray-50/50">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-xs font-black text-indigo-400 mb-4 uppercase tracking-[0.3em]">{t('guide_modules_badge')}</h2>
                                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 font-black">{t('guide_modules_title')}</h3>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {modules.map((mod) => (
                                    <a href="#" key={mod.key} className="group block bg-white rounded-[2.5rem] p-10 border border-gray-100 hover:shadow-2xl transition duration-500 space-y-6">
                                        <div className="w-16 h-16 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition duration-500 border border-gray-100 font-black">
                                            {mod.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900">{t(`guide_mod_${mod.key}_title`)}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{t(`guide_mod_${mod.key}_desc`)}</p>
                                        <span className="text-indigo-600 font-black text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                                            {t('guide_btn_learn')} <span aria-hidden="true">→</span>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: PATHWAY / GETTING STARTED */}
                    <section className="py-24 bg-white border-y border-gray-100">
                        <div className="max-w-4xl mx-auto px-6">
                            <div className="text-center mb-20 space-y-6">
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 font-black">{t('guide_start_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="max-w-2xl mx-auto font-medium">{t('guide_start_desc')}</p>
                            </div>

                            <div className="space-y-6">
                                {startSteps.map((step) => (
                                    <div key={step} className="group relative bg-gray-50 rounded-[2rem] p-8 md:p-10 border border-gray-100 flex flex-col md:flex-row gap-8 items-center hover:bg-indigo-50 transition duration-500">
                                        <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl text-indigo-600 shrink-0 border border-indigo-50 font-black">
                                            {step}
                                        </div>
                                        <div className="text-center md:text-left space-y-2">
                                            <h4 className="text-2xl font-black text-gray-900">{t(`guide_start_step_${step}_title`)}</h4>
                                            <p className="text-gray-500 leading-relaxed">{t(`guide_start_step_${step}_desc`)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: ARTICLES */}
                    <section className="py-24 bg-gray-50/50">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
                                <div className="text-center md:text-left space-y-2">
                                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 font-black">{t('guide_articles_title')}</h2>
                                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-medium">{t('guide_articles_desc')}</p>
                                </div>
                                <a href="#" className="bg-white px-8 py-4 rounded-full border border-gray-200 text-indigo-600 font-black text-sm hover:shadow-xl transition shadow-sm uppercase tracking-widest">
                                    {t('guide_btn_all')} →
                                </a>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {articles.map((art) => (
                                    <a href="#" key={art.key} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-500 flex flex-col">
                                        <div className="h-56 bg-indigo-600 relative overflow-hidden flex items-center justify-center text-6xl font-black">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90" />
                                            <span className="relative z-10 transform group-hover:scale-125 transition duration-500">
                                                {art.icon}
                                            </span>
                                        </div>
                                        <div className="p-8 flex flex-col flex-1 space-y-4">
                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition">{t(`guide_art_${art.key}_title`)}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed flex-1">{t(`guide_art_${art.key}_desc`)}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{art.readTime} {t('guide_read_time')}</span>
                                                <span className="text-indigo-600 font-bold text-sm">{t('guide_btn_read')} ↗</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5: PLAYBOOKS */}
                    <section className="py-32 bg-white">
                        <div className="max-w-7xl mx-auto px-6 space-y-6">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 font-black">{t('gui_playbooks_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-medium">{t('gui_playbooks_desc')}</p>
                            <div className="flex gap-8 overflow-x-auto pb-8 snap-x">
                                <div className="min-w-[300px] md:min-w-[400px] bg-slate-900 text-white p-12 rounded-[3rem] snap-start hover:scale-[1.02] transition-transform space-y-6">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl mb-8" />
                                    <h3 className="text-3xl font-black">{t('gui_pb1')}</h3>
                                </div>
                                <div className="min-w-[300px] md:min-w-[400px] bg-indigo-600 text-white p-12 rounded-[3rem] snap-start hover:scale-[1.02] transition-transform space-y-6">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl mb-8" />
                                    <h3 className="text-3xl font-black">{t('gui_pb2')}</h3>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: VIDEO MASTERCLASSES */}
                    <section className="py-24 bg-slate-50 border-t border-slate-100">
                        <div className="max-w-7xl mx-auto px-6 space-y-6">
                            <div className="text-center space-y-6">
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 font-black">{t('gui_video_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-medium">{t('gui_video_desc')}</p>
                            </div>
                            <div className="w-full h-96 bg-black rounded-[3rem] overflow-hidden relative shadow-2xl flex items-center justify-center group cursor-pointer">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 7: CERTIFICATION */}
                    <section className="py-32 bg-white">
                        <div className="max-w-5xl mx-auto px-6 text-center space-y-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="font-black">{t('gui_cert_title')}</h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xl font-bold">
                                <div className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-full">{t('gui_step1')}</div>
                                <div className="hidden md:block">➔</div>
                                <div className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-full">{t('gui_step2')}</div>
                                <div className="hidden md:block">➔</div>
                                <div className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-full">{t('gui_step3')}</div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 8: SUPPORT HUB */}
                    <section className="py-24 px-6 bg-white">
                        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl text-white">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />

                            <div className="relative z-10 space-y-8">
                                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 border border-slate-700 font-black">🙋‍♂️</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="font-black">
                                    {t('guide_support_title')}
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="text-indigo-100 max-w-2xl mx-auto font-medium">
                                    {t('guide_support_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <a href="mailto:tranvasapp@gmail.com" className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-3">
                                        <Mail size={20} /> {t('guide_btn_contact')}
                                    </a>
                                    <Link href="/resources/community" className="bg-white/5 text-white border border-white/10 px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition flex items-center justify-center gap-3">
                                        <MessageSquare size={20} /> {t('guide_btn_community')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mandatory FAQ Section */}
                    <section className="py-28 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-4xl mx-auto px-6 space-y-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                                Pertanyaan User Guide (FAQ)
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
                </div>
            </main>
        </GuestLayout>
    );
}
