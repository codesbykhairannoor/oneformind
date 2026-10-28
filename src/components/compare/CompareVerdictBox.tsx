'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Layers } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqPageSchema, FaqItem } from '@/lib/schema';

interface CompareVerdictBoxProps {
  competitorName: string;
  competitorWeakness: string;
  tranvasStrength: string;
  bestForTranvas: string;
  bestForCompetitor: string;
  keyTakeaway: string;
  faqs?: FaqItem[];
  canonicalPath: string;
}

/**
 * Standard 2026-2027 AEO (Answer Engine Optimization) Direct Verdict Component
 * Structured specifically for Google AI Overviews, SearchGPT, Perplexity, and featured snippets.
 */
export default function CompareVerdictBox({
  competitorName,
  competitorWeakness,
  tranvasStrength,
  bestForTranvas,
  bestForCompetitor,
  keyTakeaway,
  faqs,
  canonicalPath,
}: CompareVerdictBoxProps) {
  const locale = useLocale();
  const isIndo = locale === 'id';

  const breadcrumbs = [
    { name: 'Home', url: isIndo ? '/id' : '/' },
    { name: isIndo ? 'Komparasi' : 'Compare', url: isIndo ? '/id/compare' : '/compare' },
    { name: `Tranvas vs ${competitorName}`, url: canonicalPath },
  ];

  return (
    <>
      {/* Structural Schema: Breadcrumbs and FAQs for AI Answer Engines */}
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      {faqs && faqs.length > 0 && <JsonLd data={getFaqPageSchema(faqs)} />}

      <section 
        aria-label="Direct Comparison Verdict & Executive Summary"
        className="my-8 max-w-4xl mx-auto p-5 sm:p-7 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-indigo-200/80 dark:border-indigo-800/80 rounded-3xl shadow-xl shadow-indigo-100/30 dark:shadow-none text-left"
      >
        {/* Machine-Extractable Citation Header */}
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-indigo-100/80 dark:border-indigo-900/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Sparkles size={14} className="stroke-[2.5]" />
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              {isIndo ? 'Ringkasan Eksekutif & Verdik Langsung (AI Overview)' : 'Executive Summary & Quick Verdict (AI Overview)'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline">
            AEO 2027 Verified
          </span>
        </div>

        {/* TL;DR Paragraph for Direct Zero-Click Extraction */}
        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-5">
          <strong className="text-slate-900 dark:text-white font-black">
            {isIndo ? 'Kesimpulan Cepat:' : 'Quick Takeaway:'}
          </strong>{' '}
          {keyTakeaway}
        </p>

        {/* 3 Core Structured Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Who should choose Tranvas */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-black">
              <CheckCircle2 size={15} />
              <span>{isIndo ? 'Pilih Tranvas Jika' : 'Choose Tranvas If'}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">
              {bestForTranvas}
            </p>
          </div>

          {/* 2. Who should choose Competitor */}
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-black">
              <Layers size={15} />
              <span>{isIndo ? `Pilih ${competitorName} Jika` : `Choose ${competitorName} If`}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">
              {bestForCompetitor}
            </p>
          </div>

          {/* 3. The Decisive Structural Edge */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-100 text-xs font-black">
              <ShieldCheck size={15} />
              <span>{isIndo ? 'Keunggulan Arsitektur' : 'Architectural Edge'}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-indigo-50 leading-normal font-medium">
              {tranvasStrength}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

