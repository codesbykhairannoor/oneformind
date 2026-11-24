'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Sparkles, CheckCircle2, Layers, ShieldCheck } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFaqPageSchema } from '@/lib/schema';
import { getCompareSeoConfig } from '@/lib/compareSeoData';

interface CompareGeoSectionProps {
  slug: string;
  /** Set false if the page already renders CompareVerdictBox with its own JSON-LD */
  includeVerdictAndSchema?: boolean;
  /** Set false if the page already renders a semantic HTML <table> */
  includeTable?: boolean;
  /** Set false if the page already renders a visible SSR FAQ section */
  includeFaqSection?: boolean;
}

/**
 * Standardized 2026 GEO & AEO Comparison Module
 * Ensures every /compare/* route ships:
 * 1. BreadcrumbList + FAQPage JSON-LD (exact localized canonical path)
 * 2. Executive Summary & Quick Verdict (direct AI Overview citation block)
 * 3. Semantic HTML <table> comparison matrix (machine-extractable for Perplexity & Google AI)
 * 4. Always-in-SSR-DOM FAQ items matching FAQPage JSON-LD
 */
export default function CompareGeoSection({
  slug,
  includeVerdictAndSchema = true,
  includeTable = true,
  includeFaqSection = false,
}: CompareGeoSectionProps) {
  const locale = useLocale();
  const isIndo = locale === 'id';
  const config = getCompareSeoConfig(slug);

  if (!config) return null;

  const data = isIndo ? config.id : config.en;
  const canonicalPath = isIndo ? `/id/compare/${slug}` : `/compare/${slug}`;

  const breadcrumbs = [
    { name: 'Home', url: isIndo ? '/id' : '/' },
    { name: isIndo ? 'Komparasi' : 'Compare', url: isIndo ? '/id/compare/notion' : '/compare/notion' },
    { name: `Tranvas vs ${config.brandName}`, url: canonicalPath },
  ];

  return (
    <>
      {includeVerdictAndSchema && (
        <>
          <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
          <JsonLd data={getFaqPageSchema(data.faqs)} />
        </>
      )}

      <section
        aria-label={`Tranvas vs ${config.brandName} Executive Summary and Feature Matrix`}
        className="py-16 px-6 bg-white border-t border-slate-200"
      >
        <div className="max-w-5xl mx-auto space-y-12">
          {includeVerdictAndSchema && (
            <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/70 border-2 border-indigo-200/80 rounded-3xl shadow-lg shadow-indigo-100/30 text-left">
              <div className="flex items-center justify-between gap-3 mb-4 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Sparkles size={14} className="stroke-[2.5]" />
                  </span>
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-700">
                    {isIndo
                      ? `Ringkasan Eksekutif: Tranvas vs ${config.brandName}`
                      : `Executive Verdict: Tranvas vs ${config.brandName}`}
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                  2026 Comparison
                </span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed mb-6">
                <strong className="text-slate-900 font-black">
                  {isIndo ? 'Kesimpulan Cepat: ' : 'Quick Takeaway: '}
                </strong>
                {data.keyTakeaway}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-1.5">
                  <h3 className="flex items-center gap-1.5 text-indigo-600 text-xs font-black">
                    <CheckCircle2 size={15} />
                    <span>{isIndo ? 'Pilih Tranvas Jika' : 'Choose Tranvas If'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {data.bestForTranvas}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <h3 className="flex items-center gap-1.5 text-slate-700 text-xs font-black">
                    <Layers size={15} />
                    <span>{isIndo ? `Pilih ${config.brandName} Jika` : `Choose ${config.brandName} If`}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {data.bestForCompetitor}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 space-y-1.5">
                  <h3 className="flex items-center gap-1.5 text-indigo-100 text-xs font-black">
                    <ShieldCheck size={15} />
                    <span>{isIndo ? 'Keunggulan Arsitektur' : 'Architectural Edge'}</span>
                  </h3>
                  <p className="text-xs text-indigo-50 leading-relaxed font-medium">
                    {data.tranvasStrength}
                  </p>
                </div>
              </div>
            </div>
          )}

          {includeTable && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  {isIndo
                    ? `Perbandingan Fitur: Tranvas vs ${config.brandName}`
                    : `Feature-by-Feature Matrix: Tranvas vs ${config.brandName}`}
                </h2>
                <p className="text-sm sm:text-base text-slate-500">
                  {isIndo
                    ? 'Ringkasan terstruktur untuk membandingkan cakupan, habit, keuangan, setup, dan nilai langganan.'
                    : 'Side-by-side breakdown across daily execution, habits, personal finance, setup effort, and value.'}
                </p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th scope="col" className="p-4 border-b border-slate-200 font-bold text-slate-600 w-1/4">
                        {isIndo ? 'Aspek' : 'Capability'}
                      </th>
                      <th scope="col" className="p-4 border-b border-slate-200 font-bold text-slate-500 w-3/8">
                        {config.brandName}
                      </th>
                      <th scope="col" className="p-4 border-b-2 border-indigo-600 font-black text-indigo-700 bg-indigo-50/70 w-3/8">
                        Tranvas Life OS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data.tableRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <th scope="row" className="p-4 font-bold text-slate-900 align-top">
                          {row.feature}
                        </th>
                        <td className="p-4 text-slate-600 align-top">
                          {row.competitor}
                        </td>
                        <td className="p-4 font-semibold text-indigo-900 bg-indigo-50/35 align-top">
                          <span className="text-indigo-600 font-black mr-1.5">✓</span>
                          {row.tranvas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {includeFaqSection && (
            <div className="space-y-6 pt-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center">
                {isIndo
                  ? `FAQ: Alternatif ${config.brandName}`
                  : `Frequently Asked Questions: ${config.brandName} Alternative`}
              </h2>
              <div className="space-y-4">
                {data.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="group bg-slate-50 border border-slate-200 rounded-2xl p-6"
                  >
                    <summary className="cursor-pointer font-black text-slate-900 text-sm sm:text-base list-none flex items-center justify-between gap-4">
                      <span>{faq.q}</span>
                      <span className="text-indigo-600 font-bold text-lg group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-3 pt-3 border-t border-slate-200/70 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
