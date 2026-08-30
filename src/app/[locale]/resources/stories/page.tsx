'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, ArrowRight, Star, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function SuccessStoriesPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Siapa saja pengguna yang telah membagikan cerita sukses di Tranvas?',
            a: 'Pengguna kami terdiri dari profesional, pengusaha, kreator konten, dan pelajar dari berbagai penjuru dunia.'
        },
        {
            q: 'Bagaimana cara mengirimkan cerita transformasi saya sendiri?',
            a: 'Anda dapat mengeklik tombol "Share Your Story" di halaman ini untuk mengirimkan cerita pengalaman penggunaan Anda.'
        },
        {
            q: 'Apakah cerita sukses yang ditampilkan merupakan testimoni asli?',
            a: 'Ya, seluruh testimoni dan angka pencapaian diverifikasi langsung dari komunitas pengguna aktif Tranvas.'
        }
    ];

    const wallOfLove = [
        { text: t('stories_user_1_text'), role: 'Digital Strategist', initials: 'RJ', color: 'bg-indigo-100 text-indigo-600' },
        { text: t('stories_user_2_text'), role: 'Creative Director', initials: 'AG', color: 'bg-indigo-600 text-white', dark: true },
        { text: t('stories_user_3_text'), role: 'Product Designer', initials: 'SJ', color: 'bg-emerald-100 text-emerald-600' },
        { text: t('stories_user_4_text'), role: 'Fullstack Engineer', initials: 'BW', color: 'bg-amber-100 text-amber-600' },
    ];

    const hallOfFame = [
        { id: 1, name: t('sto_hof_1_name'), title: t('sto_hof_1_title'), desc: t('sto_hof_1_desc'), icon: '💰' },
        { id: 2, name: t('sto_hof_2_name'), title: t('sto_hof_2_title'), desc: t('sto_hof_2_desc'), icon: '👑' },
        { id: 3, name: t('sto_hof_3_name'), title: t('sto_hof_3_title'), desc: t('sto_hof_3_desc'), icon: '🏗️' },
        { id: 4, name: t('sto_hof_4_name'), title: t('sto_hof_4_title'), desc: t('sto_hof_4_desc'), icon: '🧘' },
    ];

    return (
        <GuestLayout>
            <main id="success-stories" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-32 px-6 relative overflow-hidden bg-white border-b border-gray-100">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-20" />

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                ⭐ {t('stories_hero_badge')}
                            </div>

                            <h1 className="text-5xl md:text-7xl mb-8 leading-[1.1] text-gray-900 tracking-tight font-black">
                                {t('stories_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('stories_hero_title_2')}
                                </span>
                            </h1>

                            <p className="text-xl text-gray-500 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('stories_hero_desc')}
                            </p>
                        </div>

                        {/* Featured Story Card */}
                        <div className="relative w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-15" />

                            <div className="relative bg-white/90 rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-10 transform transition hover:scale-[1.01] duration-500">
                                {/* Card Header */}
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                    <div className="text-left">
                                        <h3 className="font-black text-gray-900 text-2xl mb-1">Featured Story</h3>
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Early Adopter Spotlight</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="space-y-6 text-left">
                                    <div className="relative">
                                        <span className="absolute -top-4 -left-2 text-6xl text-indigo-100 font-serif opacity-50 font-black">“</span>
                                        <p className="text-xl md:text-2xl font-bold text-gray-800 leading-snug relative z-10 pl-6">
                                            {t('stories_main_quote')}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-600 leading-relaxed italic">{t('stories_main_body')}</p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 flex items-center justify-center font-black text-indigo-700">
                                        JD
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-gray-900 leading-none">Verified User</p>
                                        <p className="text-sm text-indigo-600 font-bold mt-1">Tranvas Power User</p>
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div style={{ animationDuration: '4000ms' }} className="absolute -right-6 -bottom-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 z-20 animate-bounce hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">✨</div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                            <p className="font-black text-indigo-900 text-sm">Top Contributor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: WALL OF LOVE GRID */}
                <section className="py-24 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl text-gray-900 mb-4 font-black">{t('stories_wall_title')}</h2>
                            <p className="text-gray-500 text-lg">{t('stories_wall_desc')}</p>
                        </div>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {/* Card 1 */}
                            <div className="break-inside-avoid bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 relative group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">RJ</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Verified User</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Digital Strategist</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">"{t('stories_user_1_text')}"</p>
                            </div>

                            {/* Card 2 — Inverted dark */}
                            <div className="break-inside-avoid bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-white/5 text-8xl italic font-black">“</div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">AG</div>
                                    <div>
                                        <p className="font-bold">Verified User</p>
                                        <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Creative Director</p>
                                    </div>
                                </div>
                                <p className="leading-relaxed font-medium relative z-10 text-slate-300">"{t('stories_user_2_text')}"</p>
                            </div>

                            {/* Card 3 */}
                            <div className="break-inside-avoid bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">SJ</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Verified User</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Product Designer</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">"{t('stories_user_3_text')}"</p>
                            </div>

                            {/* Card 4 */}
                            <div className="break-inside-avoid bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg">BW</div>
                                    <div>
                                        <p className="font-bold text-gray-900">Verified User</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Fullstack Engineer</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed font-medium">"{t('stories_user_4_text')}"</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: METRICS OF IMPACT */}
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                            <div className="space-y-2">
                                <h3 className="text-6xl text-gray-900 font-black tracking-tighter">10k<span className="text-indigo-600">+</span></h3>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('stories_stat_1')}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-6xl text-gray-900 font-black tracking-tighter">500k</h3>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('stories_stat_2')}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-6xl text-gray-900 font-black tracking-tighter">98<span className="text-indigo-600">%</span></h3>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('stories_stat_3')}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-6xl text-gray-900 font-black tracking-tighter">4.9<span className="text-indigo-600">/5</span></h3>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t('stories_stat_4')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: BY THE NUMBERS */}
                <section className="py-32 bg-indigo-600 text-white text-center">
                    <div className="max-w-7xl mx-auto px-6 space-y-16">
                        <div className="space-y-4">
                            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900 }} className="font-black">
                                {t('sto_numbers_title')}
                            </h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8 }} className="text-indigo-200">{t('sto_numbers_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="space-y-2">
                                <div className="text-7xl font-black">2M+</div>
                                <div className="text-xl font-bold text-indigo-200 uppercase tracking-widest">{t('sto_num1')}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-7xl font-black">315%</div>
                                <div className="text-xl font-bold text-indigo-200 uppercase tracking-widest">{t('sto_num2')}</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-7xl font-black">99%</div>
                                <div className="text-xl font-bold text-indigo-200 uppercase tracking-widest">{t('sto_num3')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: FEATURED INTERVIEWS */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl text-slate-900 mb-4 font-black">{t('sto_interviews_title')}</h2>
                        <p className="text-xl text-slate-500 mb-16">{t('sto_interviews_desc')}</p>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="h-80 rounded-[3rem] bg-slate-900 overflow-hidden relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://i.pravatar.cc/400?u=sarah" alt="Interview 1" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-900 to-transparent">
                                    <h3 className="text-2xl font-black text-white">{t('sto_int1')}</h3>
                                </div>
                            </div>
                            <div className="h-80 rounded-[3rem] bg-indigo-900 overflow-hidden relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://i.pravatar.cc/400?u=budi" alt="Interview 2" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-indigo-900 to-transparent">
                                    <h3 className="text-2xl font-black text-white">{t('sto_int2')}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: HALL OF FAME */}
                <section className="py-32 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-5xl text-slate-900 mb-6 font-black">{t('sto_hof_title')}</h2>
                        <p className="text-xl text-slate-500 mb-16">{t('sto_hof_desc')}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {hallOfFame.map((item) => (
                                <div key={item.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-left">
                                    {/* Decorative Number */}
                                    <div className="absolute -top-4 -right-4 text-8xl text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-black">0{item.id}</div>

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl mb-8 shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">{item.name}</h3>
                                        <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-6">{item.title}</p>
                                        <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SHARE YOUR STORY CTA */}
                <section className="py-24 px-6 bg-gray-50">
                    <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-indigo-500">
                        {/* Animated orbs */}
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50 animate-pulse" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-7xl mb-8 text-white tracking-tight leading-none font-black">
                                {t('stories_cta_title')}
                            </h2>
                            <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                                {t('stories_cta_desc')}
                            </p>
                            <div className="flex justify-center">
                                <a href="mailto:tranvasapp@gmail.com" className="bg-white text-indigo-600 px-12 py-5 rounded-full font-black text-lg hover:bg-indigo-50 transition transform hover:scale-105 shadow-xl flex items-center gap-3">
                                    {t('stories_cta_btn')}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                            <p className="mt-8 text-sm text-indigo-300 font-bold uppercase tracking-[0.2em]">{t('stories_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Success Stories (FAQ)
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
