'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function ChangelogPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('help_faq_q1') || 'Seberapa sering OneForMind merilis pembaruan fitur?',
            a: t('help_faq_a1') || 'Kami merilis pembaruan rutin setiap 2 minggu sekali untuk peningkatan performa dan penambahan fitur baru.'
        },
        {
            q: t('help_faq_q2') || 'Bagaimana cara mengajukan ide atau umpan balik fitur baru?',
            a: t('help_faq_a2') || 'Anda dapat mengirimkan saran fitur langsung melalui tombol pengajuan di halaman ini atau mengirimkan email ke oneformindapp@gmail.com.'
        },
        {
            q: t('help_faq_q3') || 'Apakah versi pembaruan aplikasi berjalan secara otomatis?',
            a: t('help_faq_a3') || 'Ya, sebagai aplikasi berbasis web modern, pembaruan berjalan otomatis tanpa perlu pengunduhan manual.'
        }
    ];

    const timelineItems = [
        { v: '1', align: 'right', color: 'indigo' },
        { v: '2', align: 'left', color: 'slate' },
        { v: '3', align: 'right', color: 'indigo' },
        { v: '4', align: 'left', color: 'slate' }
    ];

    return (
        <GuestLayout>
            <main id="changelog-page" className="overflow-x-hidden bg-white text-slate-900">
                {/* SECTION 1: HERO (CENTERED LIGHT MODE - INDIGO VIBE) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white relative border-b border-gray-100">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] -z-10" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8">
                        {/* Icon / Gambar Dulu */}
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-white border border-indigo-100 rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-3 hover:rotate-0 transition duration-300 font-black">
                                ✨
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs uppercase tracking-widest border border-indigo-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            {t('cl_hero_badge')}
                        </div>
                        
                        {/* Teks Utama */}
                        <h1 className="text-5xl md:text-7xl leading-tight text-gray-900 tracking-tight font-black">
                            {t('cl_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                                {t('cl_hero_title_2')}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium max-w-3xl mx-auto">
                            {t('cl_hero_desc')}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex flex-col items-center justify-center gap-8 pb-12">
                            <a href="#timeline" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.2)] transition transform hover:-translate-y-1">
                                {t('cl_hero_cta')}
                            </a>
                        </div>

                        {/* Visual Bawah (Release Note Mockup) */}
                        <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] bg-white p-3 shadow-2xl border border-gray-100 text-left transform perspective-1000 rotate-x-6 hover:rotate-x-0 transition-transform duration-700">
                            <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur-2xl opacity-10 -z-10" />
                            <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-gray-100 overflow-hidden relative flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6 z-10">
                                    <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
                                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">2.4</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-xl">{t('cl_mockup_title')}</h4>
                                            <p className="text-gray-500 text-sm font-medium">{t('cl_mockup_desc')}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 font-medium">
                                        <li className="flex items-center gap-3">
                                            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded uppercase">New</span>
                                            <span className="text-gray-700">Methodology Frameworks added to Solutions.</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Improved</span>
                                            <span className="text-gray-700">Pomodoro Timer sync speed increased by 40%.</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Fixed</span>
                                            <span className="text-gray-700">Journal entry date parsing bug resolved.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: STATS BANNERS */}
                <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                            <div>
                                <div className="text-5xl mb-2 font-black">{t('cl_stat_1_val')}</div>
                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">{t('cl_stat_1_label')}</p>
                            </div>
                            <div>
                                <div className="text-5xl mb-2 font-black">{t('cl_stat_2_val')}</div>
                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">{t('cl_stat_2_label')}</p>
                            </div>
                            <div>
                                <div className="text-5xl mb-2 font-black">{t('cl_stat_3_val')}</div>
                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">{t('cl_stat_3_label')}</p>
                            </div>
                            <div>
                                <div className="text-5xl mb-2 font-black">{t('cl_stat_4_val')}</div>
                                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">{t('cl_stat_4_label')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: EVOLUTION TIMELINE */}
                <section id="timeline" className="py-32 bg-slate-50 relative">
                    <div className="max-w-6xl mx-auto px-6 space-y-24">
                        <div className="text-center space-y-4">
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }} className="text-gray-900 font-black">
                                {t('cl_timeline_title')}
                            </h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                                {t('cl_timeline_desc')}
                            </p>
                        </div>

                        <div className="relative">
                            {/* Central Spine */}
                            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-indigo-100 transform md:-translate-x-1/2 rounded-full" />

                            <div className="space-y-24">
                                {timelineItems.map((item) => {
                                    const vMatch = parseInt(item.v);
                                    const isRight = item.align === 'right';
                                    const dotColor = item.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-800 text-white shadow-slate-200';
                                    const textColor = item.color === 'indigo' ? 'text-indigo-500' : 'text-slate-500';

                                    return (
                                        <div key={item.v} className="relative flex flex-col md:flex-row items-start md:items-center gap-8 group">
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-6 md:left-1/2 w-12 h-12 ${dotColor} rounded-full shadow-lg transform -translate-x-1/2 md:-translate-x-1/2 z-20 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center border-4 border-white`}>
                                                <span className="font-black text-xs">v2.{5 - vMatch}</span>
                                            </div>

                                            {isRight ? (
                                                <>
                                                    {/* Left Space (Empty for Desktop) */}
                                                    <div className="hidden md:block md:w-1/2 pr-16 text-right">
                                                        <span className={`text-lg font-black ${textColor} uppercase tracking-widest`}>
                                                            {t(`cl_item_${vMatch}_date`)}
                                                        </span>
                                                    </div>
                                                    {/* Right Content */}
                                                    <div className="pl-20 md:pl-16 md:w-1/2 w-full">
                                                        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                                            <span className={`md:hidden block text-xs font-black ${textColor} mb-4 uppercase tracking-widest`}>
                                                                {t(`cl_item_${vMatch}_date`)}
                                                            </span>
                                                            <h3 className="text-2xl font-black text-gray-900 mb-6">{t(`cl_item_${vMatch}_title`)}</h3>
                                                            <ul className="space-y-4">
                                                                <li className="flex items-start gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 1}`)}</span>
                                                                </li>
                                                                <li className="flex items-start gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 2}`)}</span>
                                                                </li>
                                                                <li className="flex items-start gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 3}`)}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Left Content (Reverse) */}
                                                    <div className="pl-20 md:pl-0 md:pr-16 md:w-1/2 w-full order-2 md:order-1 text-left md:text-right">
                                                        <div className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                                            <span className={`md:hidden block text-xs font-black ${textColor} mb-4 uppercase tracking-widest`}>
                                                                {t(`cl_item_${vMatch}_date`)}
                                                            </span>
                                                            <h3 className="text-2xl font-black text-gray-900 mb-6">{t(`cl_item_${vMatch}_title`)}</h3>
                                                            <ul className="space-y-4 text-left md:text-right inline-block w-full">
                                                                <li className="flex items-start md:flex-row-reverse gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 1}`)}</span>
                                                                </li>
                                                                <li className="flex items-start md:flex-row-reverse gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 2}`)}</span>
                                                                </li>
                                                                <li className="flex items-start md:flex-row-reverse gap-4">
                                                                    <span className={`${textColor} mt-1`}>✓</span>
                                                                    <span className="text-gray-600 font-medium">{t(`cl_feat_${(vMatch - 1) * 3 + 3}`)}</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    {/* Right Space (Empty for Desktop) */}
                                                    <div className="hidden md:block md:w-1/2 pl-16 text-left order-1 md:order-2">
                                                        <span className={`text-lg font-black ${textColor} uppercase tracking-widest`}>
                                                            {t(`cl_item_${vMatch}_date`)}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE ROADMAP (KANBAN) */}
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6 space-y-16">
                        <div className="text-center space-y-4">
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }} className="text-gray-900 font-black">
                                {t('cl_roadmap_title')}
                            </h2>
                            <p className="text-xl text-gray-500">{t('cl_roadmap_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                                    <h3 className="font-black text-indigo-900 uppercase tracking-widest text-sm">{t('cl_roadmap_col_1')}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-800">{t('cl_road_1')}</div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-800">{t('cl_road_2')}</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                                    <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm">{t('cl_roadmap_col_2')}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-700">{t('cl_road_3')}</div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-700">{t('cl_road_4')}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-200 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-gray-300" />
                                    <h3 className="font-black text-gray-500 uppercase tracking-widest text-sm">{t('cl_roadmap_col_3')}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-600">{t('cl_road_5')}</div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm font-bold text-gray-600">{t('cl_road_6')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: DARK ROADMAP */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
                        <div className="space-y-4">
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }} className="font-black">
                                {t('chg_roadmap_title')}
                            </h2>
                            <p className="text-xl text-slate-400">{t('chg_roadmap_desc')}</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 p-8 rounded-3xl bg-slate-800 border-l-4 border-indigo-500 shadow-xl space-y-2">
                                <h3 className="text-2xl font-bold">{t('chg_roadmap_1')}</h3>
                                <p className="text-slate-400">{t('chg_roadmap_1_d')}</p>
                            </div>
                            <div className="flex-1 p-8 rounded-3xl bg-slate-800 border-l-4 border-rose-500 shadow-xl space-y-2">
                                <h3 className="text-2xl font-bold">{t('chg_roadmap_2')}</h3>
                                <p className="text-slate-400">{t('chg_roadmap_2_d')}</p>
                            </div>
                            <div className="flex-1 p-8 rounded-3xl bg-slate-800 border-l-4 border-emerald-500 shadow-xl space-y-2">
                                <h3 className="text-2xl font-bold">{t('chg_roadmap_3')}</h3>
                                <p className="text-slate-400">{t('chg_roadmap_3_d')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: USER FEEDBACK */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <div className="text-center space-y-4">
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900 }} className="text-slate-900 font-black">
                                {t('chg_feedback_title')}
                            </h2>
                            <p className="text-xl text-slate-500">{t('chg_feedback_desc')}</p>
                        </div>
                        <div className="columns-1 md:columns-2 gap-8 space-y-8">
                            <div className="break-inside-avoid p-10 bg-indigo-50 rounded-3xl space-y-4">
                                <p className="text-xl italic font-bold text-slate-700">
                                    "{t('chg_fd1')}"
                                </p>
                                <span className="text-sm font-black text-indigo-600 block">@usera</span>
                            </div>
                            <div className="break-inside-avoid p-10 bg-rose-50 rounded-3xl space-y-4">
                                <p className="text-xl italic font-bold text-slate-700">
                                    "{t('chg_fd2')}"
                                </p>
                                <span className="text-sm font-black text-rose-600 block">@userb</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: BETA ACCESS */}
                <section className="py-32 bg-indigo-600 text-white text-center">
                    <div className="max-w-4xl mx-auto px-6 space-y-8">
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900 }} className="font-black">
                            {t('chg_beta_title')}
                        </h2>
                        <p className="text-xl text-indigo-100 font-medium">
                            {t('chg_beta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-indigo-900 px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition shadow-2xl">
                            Join Beta
                        </Link>
                    </div>
                </section>

                {/* SECTION 8: FEATURE REQUEST CTA */}
                <section className="py-32 px-6 bg-slate-50 relative overflow-hidden border-t border-gray-200">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-indigo-100/50 to-transparent rounded-t-full -z-10" />
                    
                    <div className="max-w-6xl mx-auto bg-white rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl border border-gray-100 space-y-8">
                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full text-4xl mx-auto font-black">
                                💡
                            </div>
                            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900 }} className="text-gray-900 font-black">
                                {t('cl_cta_title')}
                            </h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                                {t('cl_cta_desc')}
                            </p>
                            <a href="mailto:oneformindapp@gmail.com" className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] transition transform hover:-translate-y-1">
                                {t('cl_cta_btn')}
                            </a>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('cl_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Changelog (FAQ)
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
