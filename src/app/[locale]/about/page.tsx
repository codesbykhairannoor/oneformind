'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Apa visi utama dibalik pembuatan Tranvas?',
            a: 'Visi kami adalah menciptakan satu sistem operasi hidup terpadu yang membebaskan manusia dari beban kognitif akibat fragmentasi puluhan aplikasi produktivitas.'
        },
        {
            q: 'Siapa tim pengembang dibalik Tranvas?',
            a: 'Tranvas dirancang dan dibangun oleh tim independen yang berfokus pada metodologi Atomic System, Deep Work, dan AI Life OS.'
        },
        {
            q: 'Bagaimana alur peta jalan (roadmap) pengembangan Tranvas?',
            a: 'Kami terus memperbarui sistem dari Fase 01 (Core Engine), Fase 02 (Synergy & Analytics), hingga Fase 03 (Neural OS AI Coaching).'
        }
    ];

    const laws = [
        { id: '01', title: t('about_philosophy_law1_title'), desc: t('about_philosophy_law1_desc') },
        { id: '02', title: t('about_philosophy_law2_title'), desc: t('about_philosophy_law2_desc') },
        { id: '03', title: t('about_philosophy_law3_title'), desc: t('about_philosophy_law3_desc') },
    ];

    const manifestoPillars = [
        { icon: '🛡️', title: t('manifesto_1_title'), desc: t('manifesto_1_desc') },
        { icon: '🔄', title: t('manifesto_2_title'), desc: t('manifesto_2_desc') },
        { icon: '✨', title: t('manifesto_3_title'), desc: t('manifesto_3_desc') },
    ];

    const roadmapItems = [
        { phase: '01', title: t('about_roadmap_v1_title'), desc: t('about_roadmap_v1_desc'), status: 'active', icon: '🏗️' },
        { phase: '02', title: t('about_roadmap_v2_title'), desc: t('about_roadmap_v2_desc'), status: 'next', icon: '⚡' },
        { phase: '03', title: t('about_roadmap_v3_title'), desc: t('about_roadmap_v3_desc'), status: 'future', icon: '🧠' },
    ];

    return (
        <GuestLayout>
            <main id="about-monument" className="overflow-x-hidden">
                {/* SECTION 1: HERO SECTION */}
                <header className="pt-32 pb-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] mb-10 tracking-[0.2em] border border-indigo-100 uppercase">
                        {t('about_badge')}
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', fontWeight: 900, lineHeight: 0.95 }} className="mb-10 text-slate-900 tracking-tight font-black">
                        {t('about_title_1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900">
                            {t('about_title_2')}
                        </span>
                    </h1>

                    <p style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="text-slate-500 max-w-3xl mx-auto font-medium">
                        {t('about_desc')}
                    </p>
                </header>

                {/* SECTION 2: STORY SECTION (FRICTION CRISIS) */}
                <section className="py-40 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
                            <div className="space-y-10">
                                <div className="h-1 w-20 bg-indigo-600" />
                                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 0.9 }} className="text-slate-900 tracking-tighter font-black">
                                    {t('story_1_title')}
                                </h2>
                                <div className="space-y-6">
                                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-600 font-medium">
                                        {t('story_1_p1')}
                                    </p>
                                    <p className="text-indigo-600 text-2xl leading-tight font-black italic">
                                        "{t('story_1_p2')}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-10">
                                    <div className="group">
                                        <div className="text-5xl mb-4 group-hover:-rotate-12 transition duration-500 font-black">🧠</div>
                                        <div className="h-px w-full bg-slate-200 mb-4 group-hover:bg-indigo-600 transition" />
                                        <div className="font-black text-slate-900 text-xs uppercase tracking-wider">{t('story_1_card_1')}</div>
                                    </div>
                                    <div className="group">
                                        <div className="text-5xl mb-4 group-hover:rotate-12 transition duration-500 font-black">📡</div>
                                        <div className="h-px w-full bg-slate-200 mb-4 group-hover:bg-indigo-600 transition" />
                                        <div className="font-black text-slate-900 text-xs uppercase tracking-wider">{t('story_1_card_2')}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-slate-900 rounded-[5rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 border-[12px] border-white relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-slate-900 to-indigo-950 opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 bg-indigo-600 text-white rounded-full flex items-center justify-center text-5xl animate-pulse shadow-2xl font-black">
                                            🌌
                                        </div>
                                    </div>

                                    {/* Schematic Overlay */}
                                    <div className="absolute bottom-10 left-10 p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
                                        <div className="text-[10px] text-white/40 font-black tracking-[0.4em] mb-2 uppercase">System Status</div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="w-1 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: STORY SECTION (FLOW) */}
                <section className="py-40 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="aspect-[4/3] bg-indigo-600 rounded-[5rem] overflow-hidden -rotate-3 hover:rotate-0 transition-all duration-700 border-[12px] border-slate-50 shadow-2xl relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-900 opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center text-9xl">🌱</div>
                                    <div className="absolute top-10 right-10 bg-white px-4 py-2 rounded-full shadow-xl font-black text-[10px] text-indigo-600 tracking-widest uppercase">Growth</div>
                                    <div className="absolute bottom-20 left-10 bg-white px-4 py-2 rounded-full shadow-xl font-black text-[10px] text-indigo-600 tracking-widest uppercase">Clarity</div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2 space-y-10">
                                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-[0.3em] uppercase">The Transition</div>
                                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 0.9 }} className="text-slate-900 tracking-tighter font-black">
                                    {t('story_2_title')}
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-600 font-medium">
                                    {t('story_2_p1')}
                                </p>
                                <div className="p-12 bg-indigo-600 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                                    <p className="text-2xl font-black italic leading-tight relative z-10">
                                        "{t('story_2_quote')}"
                                    </p>
                                </div>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }} className="text-slate-500 font-bold">
                                    {t('story_2_p2')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: MANIFESTO SECTION */}
                <section className="py-40 bg-indigo-600 text-white relative overflow-hidden rounded-[5rem] mx-6">
                    <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-24">
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-black text-[10px] tracking-[0.4em] border border-white/20 uppercase">
                                {t('manifesto_badge')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 0.85 }} className="tracking-tighter font-black">
                                {t('manifesto_title')}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {manifestoPillars.map((pillar, idx) => (
                                <div key={idx} className="bg-white/5 p-12 rounded-[4rem] border border-white/10 hover:border-white transition duration-500 space-y-6">
                                    <div className="w-20 h-20 bg-white text-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-xl font-black">
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight">{pillar.title}</h3>
                                    <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }} className="text-indigo-100/80 font-bold">
                                        {pillar.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 5: CORE PHILOSOPHY */}
                <section className="py-40 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6 space-y-24">
                        <div className="flex flex-col lg:flex-row gap-12 items-end">
                            <div className="lg:w-2/3 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-[0.3em] uppercase">
                                    📚 {t('about_philosophy_badge')}
                                </div>
                                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 0.9 }} className="text-slate-900 tracking-tighter font-black">
                                    {t('about_philosophy_title')}
                                </h2>
                            </div>
                            <div className="lg:w-1/3 pb-4 w-full">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-1/3" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {laws.map((law) => (
                                <div key={law.id} className="group flex flex-col md:flex-row gap-12 items-start p-12 md:p-16 rounded-[5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition duration-500">
                                    <div className="text-7xl md:text-8xl text-indigo-200 group-hover:text-indigo-600 transition duration-500 leading-none font-black">
                                        {law.id}
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <h3 className="text-3xl md:text-4xl text-slate-900 tracking-tight font-black">{law.title}</h3>
                                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 font-bold">
                                            {law.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 6: BOARD OF VISIONARIES / TEAM SECTION */}
                <section className="py-40 bg-slate-950 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900 }} className="text-center tracking-tighter italic font-black">
                            {t('team_title')}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* THE BUILDER */}
                            <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[5rem] space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-xl font-black">
                                        🏗️
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black mb-2">{t('dev_name')}</h3>
                                        <div className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                                            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase">
                                                {t('dev_role')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="text-indigo-100/70 font-black italic">
                                    "{t('dev_desc')}"
                                </p>
                            </div>

                            {/* THE VISIONARY */}
                            <div className="bg-white/5 border border-white/10 p-12 md:p-16 rounded-[5rem] space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-purple-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-xl font-black">
                                        🛰️
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black mb-2">{t('user_name')}</h3>
                                        <div className="inline-block px-4 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full">
                                            <span className="text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase">
                                                {t('user_role')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="text-purple-100/70 font-black italic">
                                    "{t('user_desc')}"
                                </p>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <a href="https://x.com/Tranvas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-white hover:text-indigo-400 transition group">
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase">{t('team_connect')}</span>
                                <span className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition font-black">𝕏</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: PRODUCT EVOLUTION (ROADMAP) */}
                <section className="py-40 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 space-y-24">
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-[0.4em] uppercase">
                                🗺️ {t('about_roadmap_badge')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 0.85 }} className="text-slate-900 tracking-tighter font-black">
                                {t('about_roadmap_title')}
                            </h2>
                        </div>

                        <div className="relative max-w-5xl mx-auto space-y-24">
                            {roadmapItems.map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse text-center md:text-right' : 'text-center md:text-left'}`}>
                                    <div className="md:w-1/2 space-y-4">
                                        <div className="text-indigo-600 font-black text-6xl opacity-30">{item.phase}</div>
                                        <div className="text-4xl">{item.icon}</div>
                                        <h3 className="text-3xl font-black text-slate-900">{item.title}</h3>
                                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 font-bold">{item.desc}</p>
                                    </div>
                                    <div className="md:w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Tentang Visi & Tim (FAQ)
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

                {/* SECTION 8: FINAL CTA */}
                <section className="py-32 bg-indigo-50 border-t border-indigo-100 text-center relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
                        <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.05 }} className="text-indigo-950 font-black">
                            {t('cta_about_title')}
                        </h2>
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.8 }} className="text-indigo-700/70 max-w-2xl mx-auto font-medium">
                            {t('cta_about_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-14 py-6 rounded-[2.5rem] font-black text-xl hover:bg-indigo-700 shadow-xl transition transform hover:-translate-y-2">
                            {t('cta_about_btn')}
                        </Link>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                            {t('cta_about_sub')}
                        </p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
