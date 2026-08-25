'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function CommunityPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('help_faq_q1') || 'Bagaimana cara bergabung ke komunitas Discord & Telegram resmi OneForMind?',
            a: t('help_faq_a1') || 'Anda dapat bergabung secara gratis dengan mengeklik tombol Discord atau Telegram yang tersedia di halaman ini.'
        },
        {
            q: t('help_faq_q2') || 'Apakah ada sesi webinar atau acara rutin di dalam komunitas?',
            a: t('help_faq_a2') || 'Ya, komunitas kami menyelenggarakan sesi mingguan seperti Deep Work Sprint dan Workshop Produktivitas.'
        },
        {
            q: t('help_faq_q3') || 'Bagaimana aturan dasar menjaga kenyamanan komunitas?',
            a: t('help_faq_a3') || 'Komunitas kami memegang teguh 3 aturan utama: Berbagi Pengetahuan, Menghargai Sesama, dan Tanpa Spam.'
        }
    ];

    const guidelines = [
        { id: '01', title: t('comm_guide_1'), desc: t('comm_guide_1_desc') },
        { id: '02', title: t('comm_guide_2'), desc: t('comm_guide_2_desc') },
        { id: '03', title: t('comm_guide_3'), desc: t('comm_guide_3_desc') },
    ];

    return (
        <GuestLayout>
            <main id="community-page" className="overflow-x-hidden bg-white text-slate-900">
                {/* SECTION 1: HERO */}
                <header className="pt-48 pb-32 px-6 relative bg-white">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:64px_64px] -z-10" />
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-50 text-slate-900 font-black text-[10px] mb-12 uppercase tracking-[0.3em] border border-slate-100 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                            {t('comm_hero_badge')}
                        </div>

                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 0.95 }} className="text-slate-900 tracking-tighter font-black">
                            {t('comm_hero_title')}
                        </h1>

                        <p className="text-2xl text-slate-400 mb-20 leading-relaxed max-w-3xl mx-auto font-medium italic">
                            {t('comm_hero_desc')}
                        </p>

                        {/* Premium Avatars Pile */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center justify-center -space-x-5">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl transform hover:-translate-y-2 hover:scale-110 transition duration-500">
                                        <img src={`https://i.pravatar.cc/150?u=user_${i}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                                    12k+
                                </div>
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest opacity-50">{t('comm_hero_social')}</p>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE HUB (Discord / TG) */}
                <section className="py-24 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-10">
                            
                            {/* DISCORD CARD */}
                            <div className="group p-16 rounded-[4rem] bg-indigo-600 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 transform hover:-translate-y-2 transition-all duration-700">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10 space-y-6">
                                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 border border-white/20 group-hover:rotate-12 transition">
                                        <span className="text-4xl font-black">💬</span>
                                    </div>
                                    <h2 className="text-5xl mb-6 tracking-tight font-black">{t('comm_discord_title')}</h2>
                                    <p className="text-indigo-100 text-xl mb-12 leading-relaxed opacity-80">{t('comm_discord_desc')}</p>
                                    <a href="#" className="inline-flex items-center gap-4 bg-white text-indigo-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:shadow-2xl transition transform active:scale-95 shadow-lg shadow-indigo-900/20">
                                        {t('comm_btn_discord')} <ArrowRight size={20} />
                                    </a>
                                </div>
                            </div>

                            {/* TELEGRAM CARD */}
                            <div className="group p-16 rounded-[4rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
                                <div className="relative z-10 space-y-6">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 border border-blue-100 group-hover:-rotate-12 transition">
                                        <span className="text-4xl font-black">✈️</span>
                                    </div>
                                    <h2 className="text-5xl text-slate-900 mb-6 tracking-tight font-black">{t('comm_tg_title')}</h2>
                                    <p className="text-slate-500 text-xl mb-12 leading-relaxed opacity-70">{t('comm_tg_desc')}</p>
                                    <a href="#" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-slate-800 transition transform active:scale-95 shadow-xl shadow-slate-200">
                                        {t('comm_btn_tg')} <ArrowRight size={20} />
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3: GUIDELINES & EVENTS */}
                <section className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-32">
                        
                        {/* GUIDELINES */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl text-slate-900 mb-6 tracking-tight font-black">{t('comm_guidelines_title')}</h2>
                                <div className="w-24 h-2 bg-indigo-600 rounded-full" />
                            </div>
                            <div className="space-y-8">
                                {guidelines.map((g, idx) => (
                                    <div key={idx} className="flex items-start gap-8 p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:rotate-12 transition">
                                            {g.id}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-2xl font-black text-slate-900 mb-3">{g.title}</h4>
                                            <p className="text-slate-500 text-lg leading-relaxed opacity-80">{g.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EVENTS */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl text-slate-900 mb-6 tracking-tight font-black">{t('comm_events_title')}</h2>
                                <div className="w-24 h-2 bg-slate-900 rounded-full" />
                            </div>
                            <div className="space-y-6">
                                {[1, 2].map((e) => (
                                    <div key={e} className="p-10 rounded-[3rem] border-2 border-slate-50 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 group space-y-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">{t('comm_event_badge')}</span>
                                            <span className="text-sm font-bold text-slate-300">{t('comm_event_date')}</span>
                                        </div>
                                        <h4 className="text-3xl text-slate-900 mb-8 group-hover:text-indigo-600 transition font-black">{t(`comm_event_${e}`)}</h4>
                                        <a href="#" className="inline-flex items-center gap-3 text-lg font-black text-slate-900 group-hover:gap-6 transition-all duration-300">
                                            {t('comm_event_cta')} <ArrowRight size={18} />
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* MEMBER SPOTLIGHT */}
                            <div className="mt-16 p-12 bg-slate-900 rounded-[3.5rem] text-white overflow-hidden relative shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                                            <span className="text-4xl font-black">👑</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black">{t('comm_spotlight_title')}</h3>
                                            <p className="text-indigo-300 font-bold text-sm">{t('comm_spotlight_sub')}</p>
                                        </div>
                                    </div>
                                    <p className="text-indigo-100/60 text-lg leading-relaxed mb-6 font-medium">{t('comm_spotlight_desc')}</p>
                                    <div className="h-2 w-full bg-white/5 rounded-full">
                                        <div className="w-1/3 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION: MENTORS */}
                <section className="py-24 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl text-slate-900 mb-4 font-black">{t('com_mentors_title')}</h2>
                        <p className="text-xl text-slate-500 mb-16">{t('com_mentors_desc')}</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 border border-slate-100 rounded-[2rem] shadow-lg hover:-translate-y-2 transition-transform bg-slate-50 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-indigo-100 mb-6 flex items-center justify-center text-2xl">🧠</div>
                                <h3 className="font-bold text-2xl mb-2">{t('com_mentor1')}</h3>
                            </div>
                            <div className="p-8 border border-slate-100 rounded-[2rem] shadow-lg hover:-translate-y-2 transition-transform bg-slate-50 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 mb-6 flex items-center justify-center text-2xl">⚡</div>
                                <h3 className="font-bold text-2xl mb-2">{t('com_mentor2')}</h3>
                            </div>
                            <div className="p-8 border border-slate-100 rounded-[2rem] shadow-lg hover:-translate-y-2 transition-transform bg-slate-50 space-y-4">
                                <div className="w-20 h-20 rounded-full bg-amber-100 mb-6 flex items-center justify-center text-2xl">💰</div>
                                <h3 className="font-bold text-2xl mb-2">{t('com_mentor3')}</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: GLOBAL NETWORK */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                        <h2 className="text-5xl mb-6 z-10 text-center font-black">{t('com_global_title')}</h2>
                        <p className="text-xl text-slate-400 mb-16 z-10 text-center">{t('com_global_desc')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full text-center z-10">
                            <div>
                                <h4 className="text-7xl text-indigo-400 mb-2 font-black">10k+</h4>
                                <p className="text-xl font-medium">{t('com_stat1')}</p>
                            </div>
                            <div>
                                <h4 className="text-7xl text-emerald-400 mb-2 font-black">50+</h4>
                                <p className="text-xl font-medium">{t('com_stat2')}</p>
                            </div>
                            <div>
                                <h4 className="text-7xl text-amber-400 mb-2 font-black">1M+</h4>
                                <p className="text-xl font-medium">{t('com_stat3')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: VALUE */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <h2 className="text-4xl text-slate-900 mb-6 font-black">{t('com_value_title')}</h2>
                        <p className="text-2xl text-slate-500 font-medium italic">"{t('com_value_desc')}"</p>
                    </div>
                </section>

                {/* SECTION 4: FINAL SOCIAL PROOF */}
                <section className="py-32 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <h2 className="text-4xl text-slate-900 mb-12 tracking-tight font-black">{t('comm_cta_title')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                            <span className="text-2xl font-black italic tracking-tighter">Mindful.</span>
                            <span className="text-2xl font-black italic tracking-tighter">Productive.</span>
                            <span className="text-2xl font-black italic tracking-tighter">Connected.</span>
                            <span className="text-2xl font-black italic tracking-tighter">OneForMind.</span>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Komunitas (FAQ)
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
