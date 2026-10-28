'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import {
  ChevronDown,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Quote
} from 'lucide-react';
import { getBlogPostBySlug, BLOG_POSTS, BlogPost } from '@/lib/blogPosts';
import JsonLd from '@/components/seo/JsonLd';
import { getArticleSchema, getBreadcrumbSchema, getFaqPageSchema } from '@/lib/schema';

export default function DynamicBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = useLocale();
  const isIndo = locale === 'id';
  const t = useTranslations();

  const post = getBlogPostBySlug(slug);

  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for Table of Contents
  useEffect(() => {
    if (!post) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    post.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: isIndo ? '/id' : '/' },
    { name: 'Resources', url: isIndo ? '/id/resources' : '/resources' },
    { name: 'Blog', url: isIndo ? '/id/resources/blog' : '/resources/blog' },
    { name: post.title, url: isIndo ? `/id/resources/blog/${post.slug}` : `/resources/blog/${post.slug}` },
  ];

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `/resources/blog/${post.slug}`,
    datePublished: post.isoDate,
    image: post.image,
    authorName: post.author.name,
    category: post.category,
  }, locale);

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
  const faqSchema = getFaqPageSchema(post.faqs);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <GuestLayout>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* Reading Progress Indicator */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <main id="blog-article-page" className="overflow-x-hidden bg-white">
        {/* SECTION 1: ARTICLE HERO */}
        <header className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 bg-slate-50/70 border-b border-slate-200/70">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb Nav */}
            <nav
              aria-label="Breadcrumbs"
              className="flex flex-wrap justify-center items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6"
            >
              <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
              <span>/</span>
              <Link href="/resources/blog" className="hover:text-indigo-600 transition">Blog</Link>
              <span>/</span>
              <span className="text-slate-600 truncate max-w-[220px]">{post.category}</span>
            </nav>

            {/* Category Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-wider mb-6 shadow-sm"
              style={{ backgroundColor: post.categoryColor }}
            >
              <span>{post.icon}</span>
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {post.subtitle}
            </p>

            {/* Author & Meta Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 pt-6 border-t border-slate-200/60 max-w-xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                  {post.author.avatar}
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-xs sm:text-sm">{post.author.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{post.author.role}</p>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-300 hidden sm:block" />

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Calendar size={14} className="text-indigo-500" />
                <span>{post.date}</span>
              </div>

              <div className="h-4 w-px bg-slate-300 hidden sm:block" />

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock size={14} className="text-indigo-500" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 2: ARTICLE BODY & SIDEBAR */}
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Main Article Content (8 cols) */}
            <article className="lg:col-span-8 space-y-10">

              {/* Cover Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* AEO Executive Summary / Key Takeaways Box */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 via-purple-50/40 to-white rounded-3xl border-2 border-indigo-200/70 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Sparkles size={16} />
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-indigo-900 uppercase tracking-wider">
                    {isIndo ? 'Poin Kunci & Ringkasan Eksekutif (Key Takeaways)' : 'Executive Summary & Key Takeaways'}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {post.takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm sm:text-base">
                      <span className="w-5 h-5 rounded-full bg-indigo-600/10 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">✓</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Sections */}
              <div className="space-y-12">
                {post.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32 space-y-5">
                    {section.level === 'h2' ? (
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug pt-4 border-t border-slate-100">
                        {section.title}
                      </h2>
                    ) : (
                      <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
                        {section.title}
                      </h3>
                    )}

                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                        {p}
                      </p>
                    ))}

                    {section.callout && (
                      <div className={`p-5 sm:p-6 rounded-2xl border text-sm sm:text-base my-6 ${section.callout.type === 'tip'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : section.callout.type === 'important'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-indigo-50/70 border-indigo-200 text-indigo-950 italic'
                        }`}>
                        <div className="flex items-start gap-3">
                          <span className="shrink-0 mt-0.5">
                            {section.callout.type === 'tip' && <Lightbulb size={20} className="text-emerald-600" />}
                            {section.callout.type === 'important' && <AlertCircle size={20} className="text-amber-600" />}
                            {section.callout.type === 'quote' && <Quote size={20} className="text-indigo-600" />}
                          </span>
                          <p className="font-medium leading-relaxed">
                            {section.callout.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Author Bio Card */}
              <div className="p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left mt-16">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                  {post.author.avatar}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Written by</span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{post.author.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 mb-2">{post.author.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{post.author.bio}</p>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="pt-12 border-t border-slate-200 space-y-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-indigo-600" size={24} />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isIndo ? 'Pertanyaan Sering Diajukan (FAQ)' : 'Frequently Asked Questions'}
                  </h2>
                </div>
                <div className="space-y-4">
                  {post.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-6 py-4 text-left font-black text-slate-900 flex justify-between items-center text-sm sm:text-base gap-4"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`transform transition-transform shrink-0 ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={18} />
                      </button>
                      {openFaq === idx && (
                        <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </article>

            {/* Sticky Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-8 sticky top-28">

              {/* Share Card */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Share2 size={14} />
                  {isIndo ? 'Bagikan Wawasan' : 'Share Article'}
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 transition"
                  >
                    <span>{copied ? 'Link Tersalin!' : 'Salin Tautan'}</span>
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} className="text-slate-400" />}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 transition"
                  >
                    <span>Bagikan di X (Twitter)</span>
                    <span className="text-xs text-slate-400">𝕏</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 transition"
                  >
                    <span>Bagikan di LinkedIn</span>
                    <span className="text-xs text-blue-600 font-bold">in</span>
                  </a>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <BookOpen size={14} />
                  {isIndo ? 'Daftar Isi' : 'Table of Contents'}
                </h3>
                <nav className="space-y-2">
                  {post.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${activeId === section.id
                          ? 'bg-indigo-600 text-white font-black translate-x-1 shadow-sm'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                        }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Newsletter Widget */}
              <div className="p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl text-white shadow-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Newsletter</span>
                <h3 className="text-lg font-black mt-1 mb-2">Tranvas Weekly Dispatch</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Dapatkan intisari produktivitas, atomic habits, dan personal finance langsung ke inbox Anda setiap Senin pagi.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:bg-white/20"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-white text-indigo-900 rounded-xl font-black text-xs hover:bg-indigo-50 transition shadow-md"
                  >
                    Berlangganan Gratis
                  </button>
                </form>
              </div>

            </aside>
          </div>
        </div>

        {/* SECTION 3: RELATED POSTS */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Explore More</span>
                <h2 className="text-2xl font-black text-slate-900">
                  {isIndo ? 'Artikel Terkait Lainnya' : 'Related Articles'}
                </h2>
              </div>
              <Link
                href="/resources/blog"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel, idx) => (
                <Link
                  key={idx}
                  href={`/resources/blog/${rel.slug}`}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider shadow-sm"
                        style={{ backgroundColor: rel.categoryColor }}
                      >
                        {rel.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <span>{rel.date}</span>
                      <span>•</span>
                      <span>{rel.readTime}</span>
                    </div>
                    <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-3">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-auto">
                      {rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </GuestLayout>
  );
}

