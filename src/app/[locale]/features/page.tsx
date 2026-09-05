'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { 
  CheckCircle2, 
  Calendar, 
  Wallet, 
  BookOpen, 
  Sparkles, 
  Briefcase, 
  Target, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  BarChart3,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export default function FeaturesIndexPage() {
  const t = useTranslations();

  const features = [
    {
      id: 'planner',
      title: 'Daily & Weekly Task Planner',
      titleId: 'Perencana Tugas Harian & Mingguan',
      description: 'Organize high-impact priorities with time-blocking, Eisenhower matrix categorization, and sub-task nesting designed for unstoppable focus.',
      icon: Clock,
      href: '/features/planner',
      badge: 'Core OS',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-500/20',
      tagColor: 'text-blue-600 dark:text-blue-400',
      highlights: ['Time-blocking execution', 'Priority matrices', 'Recurring sprint tasks']
    },
    {
      id: 'habit',
      title: 'Atomic Habit Tracker & Streaks',
      titleId: 'Pelacak Kebiasaan & Rentetan',
      description: 'Build long-term compounding consistency with GitHub-style heatmap matrices, streak milestones, and behavioral trigger cues.',
      icon: CheckCircle2,
      href: '/features/habit',
      badge: 'Consistency',
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-500/20',
      tagColor: 'text-emerald-600 dark:text-emerald-400',
      highlights: ['Heatmap visual grids', 'Target frequencies', 'Zero-friction daily check-in']
    },
    {
      id: 'finance',
      title: 'Smart Personal Finance & Budgeting',
      titleId: 'Keuangan Pribadi & Penganggaran Pintar',
      description: 'Track cash flow, monthly expense allocations, multi-asset net worth, and savings goals with automated visual analytics.',
      icon: Wallet,
      href: '/features/finance',
      badge: 'Wealth & Control',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      borderColor: 'border-amber-200 dark:border-amber-500/20',
      tagColor: 'text-amber-600 dark:text-amber-400',
      highlights: ['Monthly cashflow budgets', 'Asset & net worth tracking', 'Category breakdowns']
    },
    {
      id: 'journal',
      title: 'Mindful Journal & Reflection',
      titleId: 'Jurnal Harian & Refleksi Pikiran',
      description: 'Capture daily stream-of-consciousness thoughts, emotional check-ins, gratitude logs, and evening reflections in a private space.',
      icon: BookOpen,
      href: '/features/journal',
      badge: 'Mental Clarity',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
      borderColor: 'border-purple-200 dark:border-purple-500/20',
      tagColor: 'text-purple-600 dark:text-purple-400',
      highlights: ['Mood analytics', 'Markdown rich journal', 'Guided prompt templates']
    },
    {
      id: 'neural-os',
      title: 'Gemini Neural OS AI Assistant',
      titleId: 'Asisten AI Gemini Neural OS',
      description: 'Leverage hyper-contextual AI coaching to breakdown monolithic goals, generate structured action plans, and synthesize insights.',
      icon: Sparkles,
      href: '/features/neural-os',
      badge: 'AI Intelligence',
      color: 'from-violet-600 to-indigo-600',
      bgColor: 'bg-violet-50 dark:bg-violet-500/10',
      borderColor: 'border-violet-200 dark:border-violet-500/20',
      tagColor: 'text-violet-600 dark:text-violet-400',
      highlights: ['Automated subtask generator', 'Weekly performance reviews', 'Contextual life coaching']
    },
    {
      id: 'job',
      title: 'Career Pipeline & Job Tracker',
      titleId: 'Pelacak Lamaran Kerja & Karir',
      description: 'Streamline your job search with a dedicated Kanban pipeline, interview tracking stages, salary benchmarks, and resume follow-up alerts.',
      icon: Briefcase,
      href: '/features/job',
      badge: 'Career Growth',
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
      borderColor: 'border-cyan-200 dark:border-cyan-500/20',
      tagColor: 'text-cyan-600 dark:text-cyan-400',
      highlights: ['Visual Kanban pipeline', 'Offer & salary comparison', 'Applied date logs']
    },
    {
      id: 'goal',
      title: 'Visionary Goals & Milestones',
      titleId: 'Target & Milestone Visi Hidup',
      description: 'Connect high-level life aspirations to quarterly milestones and tangible daily execution rituals for quantifiable progress.',
      icon: Target,
      href: '/features/goal',
      badge: 'Life Vision',
      color: 'from-rose-600 to-red-600',
      bgColor: 'bg-rose-50 dark:bg-rose-500/10',
      borderColor: 'border-rose-200 dark:border-rose-500/20',
      tagColor: 'text-rose-600 dark:text-rose-400',
      highlights: ['Quarterly OKRs', 'Milestone completion bars', 'Life domain categorization']
    },
    {
      id: 'calendar',
      title: 'Integrated Life Calendar',
      titleId: 'Kalender Terpadu Semua Aktivitas',
      description: 'Unify deadlines, habit schedules, scheduled deep work blocks, and milestones into a synchronized, single timeline view.',
      icon: Calendar,
      href: '/features/calendar',
      badge: 'Scheduling',
      color: 'from-teal-600 to-emerald-600',
      bgColor: 'bg-teal-50 dark:bg-teal-500/10',
      borderColor: 'border-teal-200 dark:border-teal-500/20',
      tagColor: 'text-teal-600 dark:text-teal-400',
      highlights: ['Unified activity feed', 'Day/Week/Month views', 'Interactive event booking']
    }
  ];

  return (
    <GuestLayout>
      <main id="features-hub" className="overflow-x-hidden min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              Unified Productivity Operating System
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              Powerful Features for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Total Life Clarity and Control
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
              Replace a dozen disconnected productivity apps with one interconnected workspace. Tranvas harmonizes your daily habits, task scheduling, personal finance, journaling, and long-term milestones.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Explore the 8 Core Modules
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto text-base">
              Every tool in Tranvas feeds into a single unified knowledge model, unlocking cross-domain clarity and predictive insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => {
              const IconComp = f.icon;
              return (
                <div
                  key={f.id}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 ${f.bgColor} ${f.borderColor} border rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-7 h-7" />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${f.bgColor} ${f.tagColor} border ${f.borderColor}`}>
                        {f.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                      {f.description}
                    </p>

                    {/* Bullet Highlights */}
                    <ul className="space-y-2.5 mb-8 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      {f.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link */}
                  <Link
                    href={f.href}
                    className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <span>Learn more about {f.id}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* VALUE PROPOSITION / SYSTEM SYNERGY */}
        <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Connected Knowledge Model</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Your daily habits inform your goal progress. Your budget goals sync with career timelines. No data silos.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Strict Privacy & Zero Ads</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Your personal entries, finances, and journal thoughts are strictly confidential and encrypted at rest.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Compounding Progress</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Small daily micro-wins compound into life-defining transformations using scientific behavioral psychology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6">
            Ready to upgrade how you run your life?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base font-medium mb-8 max-w-2xl mx-auto">
            Join thousands of professionals, students, creators, and builders who use Tranvas to achieve daily clarity.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-500/25 transition-all hover:scale-105"
          >
            Start Your Journey Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </main>
    </GuestLayout>
  );
}
