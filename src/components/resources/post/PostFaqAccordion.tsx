'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
    q: string;
    a: string;
}

interface PostFaqAccordionProps {
    faqs: FaqItem[];
}

export default function PostFaqAccordion({ faqs }: PostFaqAccordionProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-28 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-6 space-y-12">
                <h2
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}
                    className="text-slate-900 text-center font-black"
                >
                    Pertanyaan Artikel (FAQ)
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown
                                    className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                                    size={20}
                                />
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
    );
}
