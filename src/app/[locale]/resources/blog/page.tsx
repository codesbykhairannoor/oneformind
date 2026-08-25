'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function BlogIndexPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('help_faq_q1') || 'Seberapa sering artikel artikel baru dipublikasikan di Blog OneForMind?',
            a: t('help_faq_a1') || 'Kami menerbitkan artikel panduan produktivitas dan wawasan manajemen diri 2-3 kali setiap minggu.'
        },
        {
            q: t('help_faq_q2') || 'Apakah saya bisa berlangganan buletin email secara gratis?',
            a: t('help_faq_a2') || 'Ya, Anda dapat memasukkan email pada formulir buletin untuk menerima ringkasan mingguan tanpa biaya.'
        },
        {
            q: t('help_faq_q3') || 'Bagaimana cara berkontribusi menulis di blog OneForMind?',
            a: t('help_faq_a3') || 'Kami menerima tulisan tamu dari pakar produktivitas dan praktisi Atomic Habits melalui email tim redaksi.'
        }
    ];

    const posts = [
        {
            slug: 'mastering-atomic-habits-in-daily-life',
            title: 'Mastering Atomic Habits: How Small 1% Improvements Compounding Every Day',
            excerpt: 'Learn the exact psychological framework behind habit stacking, identity shift, and friction reduction.',
            category: 'Methodology',
            categoryColor: '#4f46e5',
            date: 'Aug 18, 2026',
            readTime: '5 min read',
            icon: '🌱'
        },
        {
            slug: 'deep-work-framework-for-modern-professionals',
            title: 'The Deep Work Blueprint: Eliminating Context Switching for Peak Focus',
            excerpt: 'How to structure your day into uninterrupted 90-minute focus blocks without burning out.',
            category: 'Focus',
            categoryColor: '#9333ea',
            date: 'Aug 15, 2026',
            readTime: '7 min read',
            icon: '⚡'
        },
        {
            slug: 'financial-clarity-with-oneformind-finance-os',
            title: 'Financial Peace of Mind: Bridging Daily Spending with Long-Term Wealth',
            excerpt: 'A zero-based budgeting system built inside your productivity workflow to eliminate money anxiety.',
            category: 'Finance OS',
            categoryColor: '#059669',
            date: 'Aug 10, 2026',
            readTime: '6 min read',
            icon: '💰'
        },
        {
            slug: 'building-a-second-brain-for-personal-knowledge',
            title: 'Building a Second Brain: Organising Notes, Insights, and Ideas Effortlessly',
            excerpt: 'Stop forgetting great ideas. Transform your digital journal into an active knowledge retrieval hub.',
            category: 'Second Brain',
            categoryColor: '#d97706',
            date: 'Aug 05, 2026',
            readTime: '8 min read',
            icon: '🧠'
        }
    ];

    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <GuestLayout>
            <main id="blog-index" className="overflow-x-hidden bg-white">
                {/* SECTION 1: HERO (EDITORIAL STYLE - MATCHED WITH STORIES) */}
                <header className="pt-24 md:pt-32 pb-20 md:pb-32 px-6 relative overflow-hidden bg-white border-b border-gray-100">
                    {/* Subtle Background: Grid & Glow */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-20" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both space-y-8">
                            
                            {/* Editorial Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] md:text-xs uppercase tracking-wider shadow-sm border border-indigo-200">
                                ⭐ {t('blog_hero_badge')}
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-7xl leading-[1.1] text-gray-900 tracking-tight font-black">
                                {t('blog_hero_title_1')} <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('blog_hero_title_2')}</span>
                            </h1>

                            {/* Featured Editorial Card */}
                            <div className="relative w-full max-w-4xl mx-auto group pt-4">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur opacity-15 transition duration-500 group-hover:opacity-25" />
                                
                                <Link href="/resources/post" className="block relative bg-white rounded-[3rem] overflow-hidden border border-white shadow-2xl transform transition duration-500 hover:scale-[1.01]">
                                    <div className="h-[300px] md:h-[450px] relative overflow-hidden bg-indigo-900">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
                                        
                                        {/* Pattern Overlay */}
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                                        
                                        {/* Featured Content Info (Overlay) */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-left bg-gradient-to-t from-black/80 via-transparent to-transparent space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 w-fit">
                                                {t('blog_feat_label')}
                                            </div>
                                            <h2 className="text-2xl md:text-4xl text-white leading-tight max-w-2xl group-hover:text-indigo-200 transition font-black">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-white/80 font-medium text-sm md:text-base max-w-xl line-clamp-2">
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: BLOG GRID */}
                <section className="py-24 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {remainingPosts.map((post, idx) => (
                                <article key={idx} className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-500">
                                    <Link href="/resources/post" className="block aspect-[16/10] overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-5xl italic text-indigo-200/30 tracking-tighter font-black">OneForMind</div>
                                        
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 shadow-sm border border-slate-100/50" style={{ color: post.categoryColor }}>
                                                {post.category}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                                {post.date}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                                                {post.readTime}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                                            <Link href="/resources/post">
                                                {post.title}
                                            </Link>
                                        </h3>

                                        <p className="text-slate-600 text-sm font-medium mb-8 line-clamp-2">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs">✨</div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Team OneForMind</span>
                                            </div>
                                            <Link href="/resources/post" className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-2 group/btn">
                                                Read Post 
                                                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE NEWSLETTER CTA */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 border border-indigo-100">
                        {/* Light Decorative Blobs */}
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white rounded-full blur-3xl opacity-60 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10 md:w-1/2 space-y-4">
                            <div className="inline-block bg-white text-indigo-600 font-bold text-xs px-4 py-2 rounded-full mb-6 uppercase tracking-widest border border-indigo-100 shadow-sm">
                                💌 {t('blog_news_badge')}
                            </div>
                            <h2 className="text-3xl md:text-5xl text-slate-900 mb-4 leading-tight font-black">
                                {t('blog_news_title')}
                            </h2>
                            <p className="text-slate-600 text-lg font-medium">
                                {t('blog_news_desc')}
                            </p>
                        </div>

                        <div className="relative z-10 w-full md:w-1/2">
                            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="email" 
                                    placeholder={t('blog_news_placeholder')} 
                                    className="w-full bg-white border border-slate-200 text-slate-900 font-medium px-6 py-4 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 placeholder-slate-400 transition shadow-sm" 
                                    required 
                                />
                                <button type="submit" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 transition shadow-md shrink-0">
                                    {t('blog_news_btn')}
                                </button>
                            </form>
                            <p className="text-slate-600 text-xs mt-4 font-medium">
                                {t('blog_news_note')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Blog Insights (FAQ)
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
            </main>
        </GuestLayout>
    );
}
