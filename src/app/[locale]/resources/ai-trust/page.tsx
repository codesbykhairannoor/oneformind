'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { ChevronDown } from 'lucide-react';

export default function AiTrustPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('help_faq_q1') || 'Apakah data pribadi saya digunakan untuk melatih model AI umum?',
            a: t('help_faq_a1') || 'Tidak sama sekali. Tranvas menggunakan model Ephemeral Context yang berarti data Anda diproses secara sementara untuk menghasilkan analisis lalu dihapus dari memori pemrosesan.'
        },
        {
            q: t('help_faq_q2') || 'Bagaimana Neural OS menjaga kerahasiaan catatan keuangan dan jurnal?',
            a: t('help_faq_a2') || 'Seluruh data dienkripsi dari ujung ke ujung (end-to-end encryption) dan AI hanya membaca snapshot kontekstual saat Anda secara eksplisit meminta analisis On-Demand.'
        },
        {
            q: t('help_faq_q3') || 'Apakah saya bisa mematikan fitur AI di Tranvas?',
            a: t('help_faq_a3') || 'Ya, Anda memiliki kontrol penuh untuk mematikan atau mengaktifkan modul Neural OS kapan saja sesuai kenyamanan Anda.'
        }
    ];

    return (
        <GuestLayout>
            <main id="ai-trust" className="overflow-x-hidden bg-white">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                    {/* TECH HEADER */}
                    <header className="relative pt-32 pb-24 px-6 bg-slate-950 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] mb-8 uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                System Transparency Report v2.5
                            </div>

                            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1 }} className="text-white tracking-tighter font-black">
                                Neural OS <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                                    Architecture
                                </span>
                            </h1>

                            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                                Transparency is the foundation of trust. Explore how our unified productivity AI integrates with your life while upholding the highest ethical standards.
                            </p>
                        </div>
                    </header>

                    {/* CORE PRINCIPLES */}
                    <section className="py-24 bg-white">
                        <div className="max-w-5xl mx-auto px-6">
                            <div className="grid gap-12">
                                {/* Principle 1 */}
                                <article className="group bg-slate-50 p-10 md:p-16 rounded-[3.5rem] border border-slate-100 hover:border-indigo-600/30 transition duration-500">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition font-black">🛡️</div>
                                        <div className="prose prose-lg max-w-none flex-1">
                                            <h2 className="text-3xl text-slate-900 mb-6 tracking-tight font-black">The Data Sovereignty Protocol</h2>
                                            <p className="text-slate-600 leading-relaxed italic border-l-4 border-indigo-500 pl-6 mb-8 text-xl font-bold">
                                                "Our AI reads to assist, not to memorize."
                                            </p>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                Tranvas operates on a strictly <strong>Ephemeral Context</strong> model. Your personal data—tasks, journals, and finance transactions—are never used to train global AI models. We utilize Large Language Models (LLMs) as high-speed processing cores that receive temporary snapshots of your request to generate insights, which are then cleared from the processing memory.
                                            </p>
                                        </div>
                                    </div>
                                </article>

                                {/* Principle 2 */}
                                <article className="group bg-slate-50 p-10 md:p-16 rounded-[3.5rem] border border-slate-100 hover:border-indigo-600/30 transition duration-500">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition font-black">🔗</div>
                                        <div className="prose prose-lg max-w-none flex-1">
                                            <h2 className="text-3xl text-slate-900 mb-6 tracking-tight font-black">Logical Bridge Technology</h2>
                                            <p className="text-slate-600 font-medium leading-relaxed mb-6">
                                                The power of Neural OS lies in its ability to find the <strong>Indirect Friction</strong> between modules. For example, it might identify that your spending habits on weekends are directly hindering your 'Travel Goal', or that certain task categories in your Planner correlate with lower sentiment scores in your Journal.
                                            </p>
                                            <div className="bg-indigo-600 p-8 rounded-3xl text-white my-10 shadow-2xl space-y-4">
                                                <h4 className="text-white font-black text-xl">The Synergy Map:</h4>
                                                <ul className="list-none p-0 space-y-3 font-medium">
                                                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-indigo-300 rounded-full" /> Finance Core → Reward Loop Regulation</li>
                                                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-indigo-300 rounded-full" /> Journal Sentiment → Procrastination Analysis</li>
                                                    <li className="flex items-center gap-3"><span className="w-2 h-2 bg-indigo-300 rounded-full" /> Habit Heatmaps → Energy Management</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                {/* Principle 3 */}
                                <article className="group bg-slate-50 p-10 md:p-16 rounded-[3.5rem] border border-slate-100 hover:border-indigo-600/30 transition duration-500">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition font-black">🧠</div>
                                        <div className="prose prose-lg max-w-none flex-1">
                                            <h2 className="text-3xl text-slate-900 mb-6 tracking-tight font-black">AI On-Demand Philosophy</h2>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                We believe in <strong>Human-Centric AI</strong>. This is why we've moved advanced analytics like Sentiment Analysis and Module Audits to an On-Demand model. We respect your digital cognitive load, ensuring that AI only intervenes when you explicitly request its surgical focus.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    {/* SYSTEM STATUS / VERIFICATION */}
                    <aside className="py-24 bg-slate-950 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-10" />
                        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-white font-black">Built for Audit-Readiness</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="max-w-2xl mx-auto font-medium">Tranvas follows the highest standards for AI safety and data portability.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black tracking-widest text-xs uppercase">E-E-A-T COMPLIANT</div>
                                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black tracking-widest text-xs uppercase">GDPR ALIGNED</div>
                                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black tracking-widest text-xs uppercase">ZERO-TRAINING MODEL</div>
                            </div>
                        </div>
                    </aside>

                    {/* Mandatory FAQ Section */}
                    <section className="py-28 bg-slate-50 border-t border-slate-200">
                        <div className="max-w-4xl mx-auto px-6 space-y-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                                Pertanyaan Transparansi AI (FAQ)
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
