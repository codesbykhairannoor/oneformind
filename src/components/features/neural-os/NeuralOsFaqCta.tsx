'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface NeuralOsFaqCtaProps {
    t: any;
}

export default function NeuralOsFaqCta({ t }: NeuralOsFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Apakah Neural OS mengumpulkan atau menjual data pribadi saya?',
            a: 'Tidak sama sekali. Neural OS beroperasi dengan filosofi Ephemeral Context di mana data hanya diproses secara sementara untuk rekomendasi dan tidak pernah dijual.'
        },
        {
            q: 'Bagaimana cara kerja sintesis antar modul di Neural OS?',
            a: 'AI secara pintar menghubungkan titik-titik antar modul—seperti korelasi antara anggaran keuangan dengan tingkat stres harian di jurnal Anda.'
        },
        {
            q: 'Apakah saya bisa mematikan saran AI jika ingin menggunakan aplikasi secara manual?',
            a: 'Tentu saja. Anda memiliki kendali penuh atas semua fitur AI dan dapat mematikannya kapan saja dari menu pengaturan.'
        }
    ];

    return (
        <>
            {/* SECTION 7: FINAL CTA */}
            <section className="py-40 px-6 text-center relative overflow-hidden bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-5xl md:text-[6rem] mb-10 leading-[0.9] tracking-tight text-slate-900 font-black">
                        {t('neural_cta_title')}
                    </h2>
                    <p className="text-slate-500 text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('neural_cta_desc')}
                    </p>
                    
                    <div className="flex flex-col items-center gap-6">
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-16 py-8 rounded-[2.5rem] text-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition transform hover:-translate-y-2 active:scale-95 group font-bold">
                            {t('neural_cta_btn')}
                        </Link>
                        <div className="flex items-center gap-3 text-sm text-slate-400 tracking-widest font-bold">
                            {t('neural_cta_note')}
                        </div>
                    </div>
                </div>

                {/* Huge Gradient Background */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1500px] h-[600px] bg-gradient-to-t from-indigo-50/50 via-white to-white rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Neural OS (FAQ)
                    </h2>
                    <div className="space-y-4 text-left">
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
        </>
    );
}
