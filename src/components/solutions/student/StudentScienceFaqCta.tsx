'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function StudentScienceFaqCta() {
    const t = useTranslations();

    const faqs = [
        {
            q: t('student_faq_q1'),
            a: t('student_faq_a1')
        },
        {
            q: t('student_faq_q2'),
            a: t('student_faq_a2')
        },
        {
            q: t('student_faq_q3'),
            a: t('student_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: SCIENTIFIC PILLAR */}
            <section className="py-32 bg-slate-50 relative overflow-hidden border-t border-gray-100">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(79,70,229,0.05)_2px,transparent_2px)] [background-size:100px_100px] opacity-30"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-white border-2 border-indigo-100 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group">
                        
                        <div className="absolute top-0 left-0 w-full h-8 border-b border-indigo-50 flex items-center px-6">
                            <div className="text-[8px] font-mono text-indigo-300 uppercase tracking-widest font-bold">Dimension_A: 1280px x 800px</div>
                        </div>
                        <div className="absolute top-0 right-0 h-full w-8 border-l border-indigo-50 flex flex-col items-center py-6">
                            <div className="text-[8px] font-mono text-indigo-300 uppercase tracking-widest font-bold rotate-90 whitespace-nowrap">Scale: 1:1</div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-[10px] uppercase tracking-[0.2em] mb-8 shadow-lg shadow-indigo-200 font-bold">
                                    🧬 {t('student_science_badge')}
                                </div>
                                
                                <h2 className="text-5xl leading-[1.1] md:text-6xl text-gray-900 mb-8 tracking-tight font-black animate-[fadeIn_0.5s]">
                                    {t('student_science_title')}
                                </h2>
                                
                                <div className="relative py-10 px-8 bg-indigo-50/50 rounded-2xl border-l-4 border-indigo-500 mb-10">
                                    <p className="text-gray-700 text-xl md:text-2xl leading-relaxed italic font-medium">
                                        "{t('student_science_desc')}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 font-bold text-gray-600 text-sm">
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                        <span>{t('student_science_topic_1')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                        <span>{t('student_science_topic_2')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span>{t('student_science_topic_3')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative hidden lg:block">
                                <div className="relative w-full aspect-square bg-indigo-50/30 rounded-full border-2 border-dashed border-indigo-100 p-12 animate-spin-slow flex items-center justify-center">
                                    <div className="w-48 h-48 bg-white border border-indigo-100 rounded-[2rem] shadow-xl flex items-center justify-center text-5xl transform rotate-12 group-hover:rotate-0 transition duration-700 font-black select-none">📚</div>
                                    
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-16 h-16 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-bounce select-none">🧠</div>
                                    <div className="absolute bottom-1/4 -right-4 w-14 h-14 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-xl select-none font-bold">⏳</div>
                                    <div className="absolute bottom-1/4 -left-4 w-12 h-12 bg-white border border-indigo-100 rounded-2xl shadow-lg flex items-center justify-center text-lg select-none font-bold">📁</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 9: FAQ */}
            <section className="py-32 bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('student_faq_title')}</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10: STUDENT CTA */}
            <section className="py-24 px-6 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-indigo-600 -z-20"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 -z-10 "></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <h2 className="text-6xl md:text-6xl mb-8 text-white tracking-tight font-black leading-tight">{t('student_cta_title')}</h2>
                    <p className="text-indigo-100 text-xl md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                        {t('student_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-block bg-white text-indigo-900 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition transform hover:scale-105 shadow-2xl">
                        {t('student_cta_btn')}
                    </Link>
                </div>
            </section>
        </>
    );
}
