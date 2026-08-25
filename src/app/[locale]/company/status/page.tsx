'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function StatusPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const services = [
        { name: t('stat_core_name'), desc: t('stat_core_desc'), icon: '⚙️' },
        { name: t('stat_auth_name'), desc: t('stat_auth_desc'), icon: '🔐' },
        { name: t('stat_sync_name'), desc: t('stat_sync_desc'), icon: '☁️' },
        { name: t('stat_web_name'), desc: t('stat_web_desc'), icon: '🌐' },
        { name: t('stat_finance_name'), desc: t('stat_finance_desc'), icon: '💹' },
    ];

    const faqs = [
        {
            q: 'Bagaimana status sistem OneForMind dipantau?',
            a: 'Sistem dipantau secara otomatis 24/7 dari 12 lokasi jaringan global dengan interval 60 detik.'
        },
        {
            q: 'Di mana saya bisa melaporkan gangguan jika terjadi insiden?',
            a: 'Anda dapat menghubungi tim teknis kami melalui email support atau halaman kontak.'
        },
        {
            q: 'Berapa komitmen SLA uptime OneForMind?',
            a: 'SLA ketersediaan sistem kami ditetapkan pada tingkat minimal 99.9% per bulan.'
        }
    ];

    // Generate 60 deterministic height bars for 90-day Uptime chart
    const bars = [
        95, 100, 98, 100, 96, 100, 100, 97, 99, 100,
        94, 100, 100, 99, 98, 100, 100, 96, 100, 100,
        97, 100, 99, 100, 100, 95, 100, 98, 100, 100,
        100, 96, 99, 100, 100, 97, 100, 98, 100, 100,
        99, 100, 100, 96, 100, 98, 100, 100, 97, 100,
        100, 99, 100, 98, 100, 100, 96, 100, 99, 100
    ];

    return (
        <GuestLayout>
            <header className="pt-32 pb-20 px-6 bg-white relative border-b border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-8 uppercase tracking-widest border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        {t('stat_hero_badge')}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl mb-10 text-slate-900 tracking-tight leading-tight font-black">
                        {t('stat_hero_title')}
                    </h1>

                    <div className="bg-emerald-500 text-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-emerald-200/50 flex flex-col items-center justify-center relative overflow-hidden group animate-in zoom-in-95 duration-1000 delay-200 w-full max-w-2xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="text-[36px] leading-[1.1] md:text-6xl mb-4 md:mb-6 group-hover:scale-110 transition duration-500 transform font-black">✅</div>
                            <h2 className="text-2xl md:text-4xl uppercase tracking-widest text-center font-black">{t('stat_hero_operational')}</h2>
                            <p className="mt-3 text-emerald-100 font-bold text-xs md:text-sm opacity-90 text-center">{t('stat_hero_last_check')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-16 md:py-24 bg-white border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 md:mb-12 text-center">{t('stat_metrics_title')}</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border border-slate-100 text-center group flex flex-col justify-center items-center">
                            <div className="text-2xl md:text-3xl mb-3 group-hover:animate-bounce font-black">⚡</div>
                            <div className="text-3xl md:text-4xl text-slate-900 mb-1 tracking-tighter font-black">142<span className="text-xl md:text-2xl text-slate-500">ms</span></div>
                            <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{t('stat_metrics_latency')}</div>
                        </div>
                        
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600 text-white text-center shadow-xl shadow-indigo-200 transform hover:-translate-y-1 transition duration-500 flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                            <div className="text-2xl md:text-3xl mb-3 relative z-10 font-black">💎</div>
                            <div className="text-3xl md:text-4xl mb-1 tracking-tighter relative z-10 font-black">100%</div>
                            <div className="text-[10px] md:text-xs font-black text-indigo-200 uppercase tracking-widest mt-1 relative z-10">{t('stat_metrics_success')}</div>
                        </div>

                        <div className="col-span-2 md:col-span-1 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50 border border-slate-100 text-center group flex flex-col justify-center items-center">
                            <div className="text-2xl md:text-3xl mb-3 group-hover:rotate-12 transition transform origin-bottom font-black">🛡️</div>
                            <div className="text-3xl md:text-4xl text-slate-900 mb-1 tracking-tighter font-black">99.9%</div>
                            <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{t('stat_metrics_uptime')}</div>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-16 p-6 md:p-8 bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0 mb-6 md:mb-8">
                                <div>
                                    <h3 className="text-white font-black text-base md:text-lg mb-1">{t('stat_history_title')}</h3>
                                    <p className="text-slate-400 text-xs font-bold">{t('stat_history_empty')}</p>
                                </div>
                                <div className="text-emerald-400 font-black text-xs md:text-sm uppercase tracking-widest">{t('stat_history_uptime')}</div>
                            </div>
                            
                            <div className="flex gap-[2px] md:gap-1 items-end h-10 md:h-12 w-full">
                                {bars.map((height, i) => {
                                    const color = height > 95 ? 'bg-emerald-500' : (height > 80 ? 'bg-emerald-600' : 'bg-emerald-400');
                                    return (
                                        <div key={i} className={`flex-1 ${color} rounded-t-sm md:rounded-full opacity-50 transition-all duration-500 group-hover:opacity-100 md:group-hover:scale-y-110 origin-bottom`} style={{ height: `${height}%` }}></div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between mt-3 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>90 Days ago</span>
                                <span>Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-10 md:mb-12 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl text-slate-900 mb-3 font-black">{t('stat_service_title')}</h2>
                        <p className="text-slate-500 font-medium text-sm md:text-base">{t('stat_service_desc')}</p>
                    </div>

                    <div className="grid gap-3 md:gap-4 mb-24">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg hover:border-indigo-100 transition duration-300 group">
                                
                                <div className="flex items-start sm:items-center gap-4 md:gap-6">
                                    <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-2xl group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-base md:text-lg leading-tight">{service.name}</h3>
                                        <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 pr-4 sm:pr-0">{service.desc}</p>
                                    </div>
                                </div>
                                
                                <div className="self-end sm:self-auto shrink-0 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 text-emerald-700 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest border border-emerald-100">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    {t('stat_status_ok')}
                                </div>
                            </div>
                        ))}
                    </div>

                    <section className="space-y-8">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Pemantauan Sistem (FAQ)
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
            </section>

            <footer className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl text-slate-900 mb-6 leading-tight font-black">
                        {t('stat_cta_title')}
                    </h2>
                    <p className="text-slate-500 text-base md:text-lg mb-10 max-w-xl mx-auto font-medium">
                        {t('stat_cta_desc')}
                    </p>
                    <Link href="/resources/community" className="inline-flex items-center justify-center bg-slate-900 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-indigo-600 transition-colors transform hover:-translate-y-1 shadow-xl hover:shadow-indigo-500/30">
                        {t('stat_cta_btn')} →
                    </Link>
                </div>
            </footer>
        </GuestLayout>
    );
}
