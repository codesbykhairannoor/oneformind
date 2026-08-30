'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface TocItem {
    id: string;
    text: string;
    level: string;
}

export default function BlogPostPage() {
    const t = useTranslations();
    const [progress, setProgress] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const articleRef = useRef<HTMLElement>(null);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0) setProgress((window.scrollY / height) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // TOC + IntersectionObserver
    useEffect(() => {
        if (!articleRef.current) return;
        const headers = articleRef.current.querySelectorAll('h2, h3');
        const items: TocItem[] = [];
        headers.forEach((header, index) => {
            const id = `section-${index}`;
            header.setAttribute('id', id);
            items.push({ id, text: header.textContent || '', level: header.tagName });
        });
        setTocItems(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.getAttribute('id') || '');
                    }
                });
            },
            { rootMargin: '0px 0px -80% 0px' }
        );
        headers.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, []);

    const faqs = [
        {
            q: 'Mengapa menggabungkan pelacak kebiasaan dan keuangan dalam satu aplikasi lebih efektif dibanding template Notion?',
            a: 'Perilaku keuangan didorong oleh kebiasaan harian. Menyatukan keduanya dalam satu alur kerja mengurangi gesekan kognitif dan meningkatkan konsistensi.',
        },
        {
            q: 'Berapa lama waktu minimal yang dibutuhkan untuk membangun Personal Operating System?',
            a: 'Anda dapat membangun pengaturan awal hanya dalam 30 menit dengan berfokus pada 3 kebiasaan utama, 3 tugas prioritas, dan arus kas keuangan.',
        },
        {
            q: 'Apa itu Weekly Reset Framework?',
            a: 'Weekly Reset adalah proses peninjauan mingguan untuk merefleksikan pencapaian, merekonsiliasi keuangan, dan menyusun ulang prioritas tugas.',
        },
    ];

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const postTitle = 'Why Habit & Finance in One App Beats Notion Templates';

    const scrollTo = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' });
        }
    };

    void t;

    return (
        <GuestLayout>
            <main id="blog-post" className="overflow-x-hidden bg-white">
                {/* Reading Progress Bar */}
                <div className="fixed top-16 left-0 w-full h-[2px] z-[100] bg-slate-50">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-150"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* HEADER */}
                <header className="pt-24 md:pt-40 pb-12 md:pb-20 px-6 bg-slate-50/50 border-b border-slate-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <nav className="flex justify-center items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
                            <Link href="/" className="hover:text-indigo-600">Home</Link>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <Link href="/resources/blog" className="hover:text-indigo-600">Blog</Link>
                        </nav>

                        <span className="inline-flex px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                            Methodology
                        </span>

                        <h1 className="text-3xl md:text-7xl text-slate-900 leading-[1.1] mb-8 md:mb-12 tracking-tighter font-black">
                            {postTitle}
                        </h1>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center font-black text-indigo-600 text-sm">
                                    A
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Admin</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Field Commander</p>
                                </div>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
                            <time className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Aug 18, 2026
                            </time>
                        </div>
                    </div>
                </header>

                {/* 12-COL BODY */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 lg:gap-16 py-12 md:py-24 relative">

                    {/* Sidebar: Floating Share */}
                    <aside className="hidden lg:block col-span-1 sticky top-40 h-fit">
                        <div className="flex flex-col items-center gap-6">
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm group"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239h-2.19L17.607 20.65z" />
                                </svg>
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                        </div>
                    </aside>

                    {/* Main Content Core */}
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
                            ref={articleRef}
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
                    </div>

                    {/* Sidebar: TOC + OS CTA */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-40 h-fit space-y-12">
                        {/* Table of Contents */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-4">
                                On This Stream
                            </h4>
                            <div className="space-y-4">
                                {tocItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}
                                        className={`block text-[10px] font-black uppercase tracking-widest transition-all ${
                                            activeId === item.id
                                                ? 'text-indigo-600 translate-x-1'
                                                : item.level === 'H2'
                                                ? 'text-slate-500 hover:text-indigo-600'
                                                : 'text-slate-400 hover:text-indigo-600 pl-4 opacity-70'
                                        }`}
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Experience OS CTA */}
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700" />
                            <h5 className="text-sm font-black mb-4 relative z-10">Experience the OS</h5>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-6 relative z-10 uppercase tracking-wider">
                                Unify your habits, finances, and planning in one neural engine.
                            </p>
                            <Link
                                href="/register"
                                className="block w-full py-3 bg-indigo-600 text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition relative z-10"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* RELATED POSTS */}
                <section className="bg-slate-50/50 py-24 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <h3 className="text-2xl font-black text-slate-900 mb-12 uppercase tracking-tighter">
                            Synchronized Intelligence
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Build a Personal Operating System in 30 Minutes', img: 'photo-1484480974693-6ca0a78fb36b' },
                                { title: 'From Planner Chaos to Clarity: The Weekly Reset Framework', img: 'photo-1506905925346-21bda4d32df4' },
                                { title: 'Atomic Finance Habits That Compound Like Interest', img: 'photo-1550565118-3a14e8d0386f' },
                            ].map((rel, idx) => (
                                <Link
                                    key={idx}
                                    href="/resources/blog"
                                    className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                                >
                                    <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-6">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`https://images.unsplash.com/${rel.img}?w=600&q=75`}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 block italic">
                                        Module
                                    </span>
                                    <h4 className="font-black text-slate-900 text-lg leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                                        {rel.title}
                                    </h4>
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Read Module</span>
                                        <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MANDATORY FAQ */}
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
            </main>
        </GuestLayout>
    );
}
