'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SecurityPage() {
    const t = useTranslations();
    const [activeSection, setActiveSection] = useState('infra');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });
        
        const sections = document.querySelectorAll('.lg\\:col-span-3 > [id]');
        sections.forEach((s) => observer.observe(s));
        
        return () => observer.disconnect();
    }, []);

    const faqs = [
        {
            q: 'Di mana data pengguna OneForMind disimpan?',
            a: 'Semua data disimpan di infrastruktur cloud tersertifikasi ISO 27001 dengan enkripsi penuh di server Singapura & Frankfurt.'
        },
        {
            q: 'Apakah tim OneForMind dapat membaca catatan atau jurnal pribadi saya?',
            a: 'Tidak. Seluruh data sensitif dienkripsi di tingkat aplikasi sehingga tidak dapat dibaca oleh siapa pun termasuk pengembang.'
        },
        {
            q: 'Apakah ada program Bug Bounty untuk peneliti keamanan?',
            a: 'Ya, kami menerima laporan celah keamanan secara bertanggung jawab di security@oneformind.com.'
        }
    ];

    return (
        <GuestLayout>
            <header className="relative pt-40 pb-32 px-6 bg-slate-950 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]"></div>

                <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    
                    <div className="animate-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] mb-8 uppercase tracking-widest ">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {t('sec_badge')}
                        </div>

                        <h1 className="text-6xl md:text-8xl text-white tracking-tighter leading-[0.9] mb-8 font-black">
                            {t('sec_title_1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
                                {t('sec_title_2')}
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-xl leading-relaxed mb-12">
                            {t('sec_subtitle')}
                        </p>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">{t('sec_stat_1_label')}</p>
                                <p className="text-white font-black text-xl group-hover:text-emerald-400 transition">{t('sec_stat_1_val')}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-indigo-500/50 transition">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">{t('sec_stat_2_label')}</p>
                                <p className="text-white font-black text-xl group-hover:text-indigo-400 transition">{t('sec_stat_2_val')}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-purple-500/50 transition">
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1 tracking-widest">{t('sec_stat_3_label')}</p>
                                <p className="text-white font-black text-xl group-hover:text-purple-400 transition">{t('sec_stat_3_val')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:flex justify-center items-center">
                        <div className="relative w-full aspect-square max-w-md">
                            <div className="absolute inset-0 border-2 border-dashed border-emerald-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
                            <div className="absolute inset-10 border border-indigo-500/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-56 h-56 bg-slate-900 rounded-[3.5rem] border border-white/10 shadow-[0_0_120px_-20px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                    <svg className="w-24 h-24 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    <div className="mt-4 font-mono text-[8px] text-emerald-500 tracking-[0.3em] font-black uppercase opacity-60">{t('sec_locked_label')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6">
                    
                    <div className="grid lg:grid-cols-4 gap-12 lg:gap-20 relative">
                        
                        <aside className="hidden lg:block lg:col-span-1 relative">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group">
                                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                                    <h3 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                                        <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                                        {t('sec_toc_title')}
                                    </h3>
                                    <nav className="space-y-2 font-bold text-base text-slate-500">
                                        {[
                                            { id: 'infra', num: '01', label: t('sec_toc_1') },
                                            { id: 'enc', num: '02', label: t('sec_toc_2') },
                                            { id: 'app', num: '03', label: t('sec_toc_3') },
                                            { id: 'sov', num: '04', label: t('sec_toc_4') },
                                        ].map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className={`block px-4 py-3 rounded-xl transition hover:bg-slate-50 hover:text-indigo-600 ${
                                                    activeSection === item.id ? 'bg-indigo-50 text-indigo-600' : ''
                                                }`}
                                            >
                                                {item.num}. {item.label}
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl group-hover:scale-150 transition duration-500"></div>
                                    <h4 className="font-black text-sm mb-2 relative z-10">{t('sec_alert_title')}</h4>
                                    <p className="text-[10px] text-slate-400 mb-6 leading-relaxed relative z-10">{t('sec_alert_desc')}</p>
                                    <a href="mailto:oneformindapp@gmail.com" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-400 hover:gap-4 transition-all">
                                        {t('sec_alert_btn')} <span>→</span>
                                    </a>
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-3 space-y-16">
                            
                            <div id="infra" className="scroll-mt-32 bg-white rounded-[4rem] p-10 md:p-16 border border-slate-200 shadow-sm overflow-hidden group">
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-slate-200 shrink-0 group-hover:-rotate-6 transition duration-500 font-black">☁️</div>
                                    <div>
                                        <h2 className="text-4xl md:text-5xl text-slate-900 mb-8 tracking-tighter font-black">{t('sec_h2_infrastructure')}</h2>
                                        <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">{t('sec_p_infrastructure')}</p>
                                        
                                        <div className="grid sm:grid-cols-3 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900 text-sm tracking-tight border-b-2 border-indigo-100 pb-2 inline-block">{t('sec_li_infra_1_title')}</h4>
                                                <p className="text-[13px] text-slate-500 leading-relaxed">{t('sec_li_infra_1_desc')}</p>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900 text-sm tracking-tight border-b-2 border-emerald-100 pb-2 inline-block">{t('sec_li_infra_2_title')}</h4>
                                                <p className="text-[13px] text-slate-500 leading-relaxed">{t('sec_li_infra_2_desc')}</p>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-900 text-sm tracking-tight border-b-2 border-purple-100 pb-2 inline-block">{t('sec_li_infra_3_title')}</h4>
                                                <p className="text-[13px] text-slate-500 leading-relaxed">{t('sec_li_infra_3_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="enc" className="scroll-mt-32 bg-slate-950 rounded-[4rem] p-10 md:p-16 text-white shadow-3xl relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition duration-1000"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl border border-white/10 shrink-0 shadow-lg group-hover:rotate-6 transition duration-500 font-black">🔐</div>
                                    <div>
                                        <h2 className="text-4xl md:text-5xl text-white mb-8 tracking-tighter font-black">{t('sec_h2_encryption')}</h2>
                                        <p className="text-xl text-indigo-100 font-medium mb-12 leading-relaxed opacity-80 decoration-indigo-500 underline decoration-4 underline-offset-8">{t('sec_p_encryption')}</p>
                                        
                                        <div className="grid sm:grid-cols-2 gap-10">
                                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition group/item">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover/item:scale-110 transition">⚡</div>
                                                <h4 className="font-black text-white text-xl mb-4">{t('sec_li_enc_1_title')}</h4>
                                                <p className="text-[13px] text-indigo-100 opacity-60 leading-relaxed">{t('sec_li_enc_1_desc')}</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition group/item">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover/item:scale-110 transition">💎</div>
                                                <h4 className="font-black text-white text-xl mb-4">{t('sec_li_enc_2_title')}</h4>
                                                <p className="text-[13px] text-indigo-100 opacity-60 leading-relaxed">{t('sec_li_enc_2_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="app" className="scroll-mt-32 bg-white rounded-[4rem] p-10 md:p-16 border border-slate-200 shadow-sm relative group overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl"></div>
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-indigo-100 shrink-0 group-hover:scale-110 transition duration-500 text-white font-black">🛡️</div>
                                    <div>
                                        <h2 className="text-4xl md:text-5xl text-slate-900 mb-8 tracking-tighter font-black">{t('sec_h2_application')}</h2>
                                        <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">{t('sec_p_application')}</p>

                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <div className="flex gap-5 p-6 bg-slate-50 rounded-3xl">
                                                <span className="text-emerald-500 font-black text-3xl shrink-0 mt-1 font-black">✓</span>
                                                <div>
                                                    <h5 className="font-black text-slate-900 text-base mb-2">{t('sec_li_app_1_title')}</h5>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{t('sec_li_app_1_desc')}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-5 p-6 bg-slate-50 rounded-3xl">
                                                <span className="text-emerald-500 font-black text-3xl shrink-0 mt-1 font-black">✓</span>
                                                <div>
                                                    <h5 className="font-black text-slate-900 text-base mb-2">{t('sec_li_app_2_title')}</h5>
                                                    <p className="text-xs text-slate-500 leading-relaxed">{t('sec_li_app_2_desc')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="sov" className="scroll-mt-32 bg-emerald-50 rounded-[4rem] p-10 md:p-16 border border-emerald-100 group relative overflow-hidden">
                                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-emerald-200 shrink-0 group-hover:rotate-12 transition duration-500 text-white font-black">👑</div>
                                    <div>
                                        <h2 className="text-4xl md:text-5xl text-emerald-950 mb-8 tracking-tighter font-black">{t('sec_h2_sovereignty')}</h2>
                                        <p className="text-2xl text-emerald-900/80 font-black leading-relaxed italic border-l-8 border-emerald-300 pl-10">
                                            {t('sec_p_sovereignty')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <section className="pt-8 space-y-8">
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                                    Pertanyaan Keamanan & Privasi (FAQ)
                                </h2>
                                <div className="max-w-3xl mx-auto space-y-4">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                                className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center group text-sm md:text-base"
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
                            </section>

                        </div>
                    </div>

                </div>
            </section>

            <section className="py-40 px-6 bg-white border-t border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] text-4xl mb-12 shadow-2xl rotate-3 font-black">🛡️</div>
                    <h2 className="text-6xl md:text-8xl mb-10 text-slate-950 tracking-tighter leading-[0.8] font-black">{t('sec_cta_title')}</h2>
                    <p className="text-2xl text-slate-500 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                        {t('sec_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-flex items-center gap-6 bg-indigo-600 text-white px-14 py-6 rounded-full font-black text-2xl hover:bg-indigo-700 hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] transition transform hover:-translate-y-2 active:scale-95">
                        <span>⚡</span> {t('sec_cta_btn')}
                    </Link>
                </div>
            </section>

        </GuestLayout>
    );
}
