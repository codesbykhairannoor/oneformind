'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function TermsPage() {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState('intro');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });
        
        const sections = document.querySelectorAll('main > div > [id]');
        sections.forEach((s) => observer.observe(s));
        
        return () => observer.disconnect();
    }, []);

    const faqs = [
        {
            q: 'Apakah akun saya dapat ditangguhkan jika melanggar ketentuan?',
            a: 'Ya, penangguhan akun berlaku jika terjadi aktivitas ilegal, spamming, atau percobaan eksploitasi sistem.'
        },
        {
            q: 'Bagaimana pemberitahuan perubahan syarat & ketentuan?',
            a: 'Setiap perubahan signifikan akan diumumkan 30 hari sebelumnya melalui email terdaftar.'
        },
        {
            q: 'Apakah data saya tetap aman saat langganan berakhir?',
            a: 'Anda tetap dapat mengakses data dalam mode baca (read-only) atau mengunduh ekspor data Anda.'
        }
    ];

    return (
        <GuestLayout>
            <header className="relative pt-32 pb-24 px-6 bg-slate-950 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono text-[10px] mb-8 uppercase tracking-widest ">
                        🚨 {t('terms_badge')}
                    </div>

                    <h1 className="text-5xl md:text-8xl text-white tracking-tighter leading-[0.85] mb-8 font-black">
                        {t('terms_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
                            {t('terms_title_2')}
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-bold">
                        {t('terms_subtitle')}
                    </p>

                    <div className="flex justify-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest pt-8 border-t border-white/5 w-fit mx-auto">
                        <span>{t('terms_effective_date')}</span>
                        <span>•</span>
                        <span>DOC_VER: 2026.B</span>
                    </div>
                </div>
            </header>

            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 relative">
                    
                    <aside className="hidden lg:block w-1/4 shrink-0 relative">
                        <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-900 mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                <span className="w-1 h-3 bg-rose-600 rounded-full"></span>
                                {t('terms_nav_title')}
                            </h3>
                            <nav className="space-y-1 font-bold text-base text-slate-500">
                                {[
                                    { id: 'intro', label: t('terms_nav_1') },
                                    { id: 'eligibility', label: t('terms_nav_2') },
                                    { id: 'rules', label: t('terms_nav_3') },
                                    { id: 'payment', label: t('terms_nav_4') },
                                    { id: 'intellectual', label: t('terms_nav_5') },
                                    { id: 'termination', label: t('terms_nav_6') },
                                    { id: 'dispute', label: t('terms_nav_7') },
                                    { id: 'liability', label: t('terms_nav_8') },
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
                        </div>
                    </aside>

                    <main className="w-full lg:w-3/4">
                        <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm prose prose-lg prose-indigo max-w-none text-slate-600 mb-16">
                            
                            <div className="mb-16 p-8 bg-rose-50 border-2 border-rose-200 rounded-[2.5rem] not-prose">
                                <h4 className="text-rose-900 font-black text-xl mb-4 flex items-center gap-3">
                                    <span>⚠️</span> {t('terms_notice_title')}
                                </h4>
                                <p className="text-rose-800 font-bold leading-relaxed m-0">
                                    {t('terms_notice_desc')}
                                </p>
                            </div>

                            <div id="intro" className="scroll-mt-32">
                                <p className="lead text-2xl text-slate-800 font-medium mb-12 leading-relaxed italic">
                                    {t('terms_intro_text')} {t('terms_intro_sub')}
                                </p>
                            </div>

                            <h2 id="eligibility" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_eligibility')}</h2>
                            <p>{t('terms_p_eligibility')}</p>
                            <ul className="marker:text-indigo-600 font-bold">
                                <li>{t('terms_eligibility_1')}</li>
                                <li>{t('terms_eligibility_2')}</li>
                            </ul>

                            <h2 id="rules" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_rules')}</h2>
                            <p>{t('terms_p_rules')}</p>

                            <h2 id="payment" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_payment')}</h2>
                            <p>{t('terms_p_payment')}</p>
                            <ul className="font-bold">
                                <li>{t('terms_li_payment_1_title')}: {t('terms_li_payment_1_desc')}</li>
                                <li className="text-rose-600">{t('terms_li_payment_2_title')}: {t('terms_li_payment_2_desc')}</li>
                            </ul>

                            <h2 id="intellectual" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_intellectual')}</h2>
                            <p>{t('terms_p_intellectual')}</p>

                            <h2 id="termination" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_termination')}</h2>
                            <p>{t('terms_p_termination')}</p>

                            <h2 id="dispute" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_dispute')}</h2>
                            <p>{t('terms_p_dispute')}</p>

                            <h2 id="liability" className="scroll-mt-32 font-black text-slate-900 text-4xl mb-8 font-black">{t('terms_h2_liability')}</h2>
                            <div className="p-8 bg-slate-900 rounded-3xl text-indigo-100 font-mono text-xs leading-relaxed border-l-[12px] border-rose-500 shadow-2xl">
                                {t('terms_legal_caps')}
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden group mb-12">
                            <div className="relative z-10 text-center">
                                <h3 className="text-4xl mb-6 tracking-tight font-black">{t('terms_cta_title')}</h3>
                                <p className="text-indigo-100 text-xl mb-12 max-w-xl mx-auto opacity-80 font-bold">
                                    {t('terms_cta_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <Link href="/register" className="px-12 py-5 bg-white text-indigo-600 rounded-full font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition active:scale-95 shadow-xl">
                                        {t('terms_cta_btn_agree')}
                                    </Link>
                                    <Link href="/" className="px-12 py-5 bg-indigo-500/50 text-white rounded-full font-black text-xl border border-white/20 hover:bg-indigo-500 transition">
                                        {t('terms_cta_btn_decline')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mandatory FAQ Section */}
                        <section className="mb-24 space-y-8">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                                Pertanyaan Syarat & Ketentuan (FAQ)
                            </h2>
                            <div className="max-w-3xl mx-auto space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center group text-sm md:text-base"
                                        >
                                            <span className="group-hover:text-indigo-600 transition">{faq.q}</span>
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
                        </section>
                    </main>
                </div>
            </section>
        </GuestLayout>
    );
}
