'use client';

import { RefObject } from 'react';

interface FaqItem {
    q: string;
    a: string;
}

interface PostArticleContentProps {
    articleRef: RefObject<HTMLElement | null>;
    postTitle: string;
    faqs: FaqItem[];
}

export default function PostArticleContent({ articleRef, postTitle, faqs }: PostArticleContentProps) {
    return (
        <div className="col-span-12 lg:col-span-8 space-y-12">
            {/* Featured Image */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-slate-100 mb-20 animate-in fade-in zoom-in duration-1000">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80"
                    alt={postTitle}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform"
                    style={{ transitionDuration: '3s' }}
                />
            </div>

            {/* Article Body */}
            <article
                ref={articleRef as RefObject<HTMLElement>}
                id="article-payload"
                className="prose prose-slate prose-lg max-w-none
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
                    prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:font-medium
                    prose-li:text-slate-700 prose-li:font-medium
                    prose-img:rounded-3xl prose-img:shadow-xl
                    selection:bg-indigo-100 selection:text-indigo-700"
            >
                <h2>1. The Friction Tax of Fragmented Apps</h2>
                <p>
                    Modern high performers spend up to 20 minutes every day opening different applications to record simple actions: 1 minute for water intake, 2 minutes for expense logging, 5 minutes for daily planning. Over a month, this creates an enormous mental fatigue tax that silently erodes willpower and execution quality.
                </p>
                <p>
                    When habit tracking and financial logging exist in separate apps or unlinked Notion databases, context switching erodes willpower. By combining daily anchors into a single unified Life OS, consistency compounds automatically.
                </p>

                <h2>2. The Atomic Synergy Map</h2>
                <p>
                    Financial decisions do not happen in isolation—they are direct reflections of daily emotional habits and stress levels. Integrated journaling allows Neural OS to detect subtle patterns before they turn into impulsive spending or income gaps.
                </p>
                <p>
                    The key insight: <strong>behavior is upstream of money</strong>. When you can see your habit score alongside your savings rate on a single dashboard, you get the clearest mirror of your actual operating system.
                </p>

                <h3>Why Notion Falls Short</h3>
                <p>
                    Notion is a phenomenal general-purpose tool—but it is not a personal operating system. It requires extensive setup, yields zero behavioral insight, and offers no native automation between habit streaks and financial milestones.
                </p>

                <h2>3. Building the Unified Flow</h2>
                <p>
                    A practical Life OS requires three atomic layers: <strong>Morning Activation</strong> (3-habit anchor check-in), <strong>Midday Cashflow Pulse</strong> (1-tap expense record), and <strong>Evening Reflection</strong> (mood-to-spending correlation). Tranvas merges these into a single, sub-90-second daily ritual.
                </p>
            </article>

            {/* In-article FAQs */}
            <section className="mt-16 p-8 rounded-3xl border border-indigo-100 bg-indigo-50/40">
                <h2 className="text-xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-5">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 mb-2">{item.q}</h3>
                            <p className="text-sm text-slate-600 font-medium">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Hyperlocal Context */}
            <div className="mt-20 p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100/50 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2 italic">Hyperlocal Context: Jakarta, ID</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-bold">
                        This atomic module is geolocated for readers in and around <span className="text-slate-900">Jakarta, ID</span>. We prioritize regional data to calibrate your high-performance OS.
                    </p>
                </div>
            </div>

            {/* Prose style overrides */}
            <style>{`
                #article-payload h2 {
                    font-size: 1.875rem;
                    font-weight: 900;
                    color: #0f172a;
                    margin-top: 5rem;
                    margin-bottom: 2rem;
                    border-bottom: 4px solid rgba(99,102,241,0.1);
                    padding-bottom: 1rem;
                    display: inline-block;
                    letter-spacing: -0.025em;
                }
                #article-payload h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.015em;
                }
                #article-payload blockquote {
                    border-left: 8px solid #6366f1;
                    background: rgba(238,242,255,0.5);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    font-weight: 900;
                    color: #312e81;
                    font-style: normal;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    margin-bottom: 3rem;
                }
                #article-payload strong {
                    font-weight: 900;
                    color: #0f172a;
                    text-decoration: underline;
                    text-decoration-color: rgba(99,102,241,0.3);
                    text-decoration-thickness: 4px;
                    text-underline-offset: 4px;
                }
                #article-payload code {
                    background: #f1f5f9;
                    color: #6366f1;
                    padding: 2px 6px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 0.875rem;
                }
            `}</style>
        </div>
    );
}
