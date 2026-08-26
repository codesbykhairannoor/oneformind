'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import {
    Sparkles,
    Target,
    Zap,
    TrendingUp,
    Brain,
    ArrowRight,
    Plus,
    ChevronRight,
    LayoutDashboard,
    Wallet,
    BookOpen,
    HelpCircle
} from 'lucide-react';

export default function DashboardClient({ user, synergy, locale }: { user: any; synergy: any; locale: string }) {
    const t = useTranslations();
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [globalInsight, setGlobalInsight] = useState<any>({
        summary: 'Performa habit dan planner Anda sangat konsisten minggu ini. Tingkat penyelesaian tugas pagi mencapai 85%.'
    });

    const isExplorer = false;
    const isAiEnabled = true;

    const plannerData = synergy.planner;

    const trend = [
        { day: 'Mon', score: 65 },
        { day: 'Tue', score: 80 },
        { day: 'Wed', score: 45 },
        { day: 'Thu', score: 90 },
        { day: 'Fri', score: 70 },
        { day: 'Sat', score: 85 },
        { day: 'Sun', score: 100 },
    ];

    const getGreetingKey = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'dash_greet_morning';
        if (hour < 15) return 'dash_greet_afternoon';
        if (hour < 19) return 'dash_greet_evening';
        return 'dash_greet_night';
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number ?? 0);
    };

    const overallScore = Math.round((synergy.habits.percent + 80 + synergy.goals.top_goal.percent + (synergy.journal.is_written ? 100 : 0)) / 4);
    const trendMax = Math.max(...trend.map((d) => d.score), 1);
    const plannerTaskCount = plannerData.total;

    return (
        <AuthenticatedLayout user={user}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
                <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-gradient-to-b from-indigo-500/[0.06] to-transparent dark:from-indigo-500/10" />

                <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
                    
                    {/* Hero Header */}
                    <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                {synergy.date_formatted}
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                                {t(getGreetingKey() as any) || 'Selamat Datang'},{' '}
                                <span className="text-indigo-600 dark:text-indigo-400">{user.name.split(' ')[0]}</span>
                            </h1>
                            <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                                {t('dash_today_subtitle') || 'Berikut ringkasan performa dan irama produktivitas Anda hari ini.'}
                            </p>
                        </div>

                        {/* Synergy Score Circle */}
                        <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/90">
                            <div className="relative flex h-14 w-14 items-center justify-center md:h-16 md:w-16">
                                <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="5"
                                        className="text-slate-100 dark:text-slate-800"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeDasharray="264"
                                        strokeDashoffset={264 - (264 * overallScore) / 100}
                                        className="text-indigo-500 transition-all duration-1000 dark:text-indigo-400"
                                    />
                                </svg>
                                <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white md:text-lg">{overallScore}%</span>
                            </div>
                            <div className="min-w-0 pr-1">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    {t('dash_synergy') || 'Synergy Pulse'}
                                </p>
                                <p className="text-xs font-medium leading-snug text-slate-600 dark:text-slate-300">
                                    {t('dash_pulse_desc') || 'Keseimbangan seluruh modul kehidupan.'}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Quick Action Toolbar */}
                    <div className="mb-8 overflow-x-auto scroll-smooth no-scrollbar">
                        <div className="flex w-max items-center gap-2">
                            <Link
                                href="/planner"
                                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                                {t('btn_add_task') || 'Tambah Tugas'}
                            </Link>
                            <Link
                                href="/finance"
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <TrendingUp size={14} strokeWidth={2.5} />
                                {t('btn_log_expense') || 'Catat Transaksi'}
                            </Link>
                            <Link
                                href="/habits"
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <Zap size={14} strokeWidth={2.5} />
                                {t('btn_check_habit') || 'Cek Kebiasaan'}
                            </Link>
                            <Link
                                href="/journal"
                                className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-[0.98] dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
                            >
                                <Brain size={14} strokeWidth={2.5} />
                                {t('btn_journal') || 'Refleksi Jurnal'}
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                        
                        {/* Main Column */}
                        <div className="space-y-6 lg:col-span-8">
                            
                            {/* Today's Tasks Section */}
                            <section className="bento-card bento-card-hover rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {t('dash_today') || 'Fokus Hari Ini'}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            {t('dash_planner_tasks_today') ? t('dash_planner_tasks_today', { count: plannerTaskCount }) : `${plannerTaskCount} tugas terjadwal untuk Anda`}
                                        </p>
                                    </div>
                                    <Link
                                        href="/planner"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                    >
                                        {t('dash_schedule') || 'Jadwal Lengkap'}
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {plannerData.upcoming.length > 0 ? (
                                    <div className="space-y-2">
                                        {plannerData.upcoming.map((task: any, index: number) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-slate-50/80 px-3 py-3 transition-all duration-300 hover:border-slate-200 dark:bg-white/[0.04] dark:hover:border-white/10 hover:translate-x-1"
                                                style={{ transitionDelay: `${index * 50}ms` }}
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="shrink-0 rounded-lg bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                                                        {task.start_time || '—'}
                                                    </span>
                                                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                        {task.title}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                                                    {t('dash_task_scheduled') || 'Terjadwal'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {t('dash_all_tasks_done') || 'Semua tugas hari ini selesai! Bagus sekali.'}
                                        </p>
                                        <Link
                                            href="/planner"
                                            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                                        >
                                            <Plus size={14} />
                                            {t('btn_add_task') || 'Tambah Tugas'}
                                        </Link>
                                    </div>
                                )}

                                {/* Habit Progress Bar */}
                                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                <Zap className="text-indigo-500" size={16} />
                                                {t('dash_habit_title') || 'Status Kebiasaan'}
                                            </span>
                                            <span className="text-[11px] font-medium text-slate-500">
                                                {synergy.habits.completed}/{synergy.habits.total} {t('dash_done') || 'Selesai'}
                                            </span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-indigo-600 transition-all duration-700 dark:bg-indigo-400"
                                                style={{ width: `${synergy.habits.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Link
                                        href="/habits"
                                        className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                                    >
                                        {t('btn_check_habit') || 'Cek Habit'}
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </section>

                            {/* Neural AI Insight Banner */}
                            {isAiEnabled ? (
                                <Link
                                    href="/coach"
                                    className="bento-card bento-card-hover block cursor-pointer rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white shadow-md dark:border-indigo-500/20 md:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-200">
                                                <Sparkles size={12} className="text-indigo-300" />
                                                {t('dash_neural_active') || 'Neural AI Active'}
                                            </div>
                                            {loadingInsight ? (
                                                <div className="space-y-2">
                                                    <div className="h-5 bg-white/10 rounded-md w-full animate-pulse" />
                                                    <div className="h-5 bg-white/10 rounded-md w-4/5 animate-pulse" />
                                                </div>
                                            ) : (
                                                <p className="text-base font-bold leading-snug md:text-lg">
                                                    {globalInsight?.summary || t('dash_neural_default_summary') || 'Analisis neuro-psikologis Anda menunjukkan fokus tinggi pada sesi pagi hari.'}
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs font-medium text-indigo-200/80 flex items-center gap-1">
                                                {t('dash_open_hub') || 'Buka Neural AI Coach Hub'}
                                                <ArrowRight size={12} />
                                            </p>
                                        </div>
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                                            <Brain size={28} className="text-indigo-200" />
                                        </div>
                                    </div>
                                </Link>
                            ) : isExplorer ? (
                                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:flex md:items-center md:justify-between md:gap-6 md:p-6">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-indigo-500/15 dark:text-indigo-300">
                                            <LayoutDashboard size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                {t('dash_explorer_rank') || 'Explorer Tier Active'}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {t('dash_explorer_desc') || 'Tingkatkan ke Architect atau Quantum AI untuk membuka modul tak terbatas.'}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/pricing"
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 md:mt-0 md:w-auto dark:bg-indigo-600 dark:hover:bg-indigo-500"
                                    >
                                        {t('dash_upgrade_tier') || 'Upgrade Sekarang'}
                                    </Link>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 md:p-6">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        {t('dash_architect_brief_title') || 'Modul Architect Aktif'}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {t('dash_architect_brief_desc') || 'Akses penuh ke modul Jurnal, Target, dan Kalender tanpa batas.'}
                                    </p>
                                    <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400">
                                        {t('dash_quantum_teaser') || 'Ingin rekomendasi otomatis AI? Nikmati Quantum AI Plan.'}
                                    </p>
                                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                                        <Link
                                            href="/journal"
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/10"
                                        >
                                            <BookOpen className="text-indigo-500" size={18} />
                                            {t('dash_journal_title') || 'Jurnal Harian'}
                                            <ChevronRight className="ml-auto text-slate-400" size={16} />
                                        </Link>
                                        <Link
                                            href="/goals"
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:bg-white/10"
                                        >
                                            <Target className="text-amber-500" size={18} />
                                            {t('dash_goal_progress') || 'Target Utama'}
                                            <ChevronRight className="ml-auto text-slate-400" size={16} />
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sidebar Column */}
                        <aside className="space-y-4 lg:col-span-4">
                            
                            {/* Widget 1: Weekly Rhythm Chart */}
                            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        {t('dash_weekly_rhythm') || 'Irama 7 Hari'}
                                    </h3>
                                    <div className="group relative">
                                        <HelpCircle size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
                                        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-2xl leading-relaxed">
                                            {t('dash_rhythm_info') || 'Melacak rata-rata penyelesaian Habit dan Planner Task Anda selama seminggu terakhir.'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col gap-4">
                                    <div className="flex h-24 items-end justify-between gap-1 mt-1">
                                        {trend.map((day, idx) => (
                                            <div key={idx} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1 group/bar">
                                                <div
                                                    className="w-full max-w-[28px] rounded-t-md bg-indigo-500/85 dark:bg-indigo-400/80 transition-all duration-500 group-hover/bar:bg-indigo-600 dark:group-hover/bar:bg-indigo-300"
                                                    style={{ height: `${Math.max(12, (day.score / trendMax) * 100)}%` }}
                                                    title={`${day.day}: ${day.score}%`}
                                                />
                                                <span className="truncate text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{day.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Widget 2: Finance Overview */}
                            <Link
                                href="/finance"
                                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                        <Wallet className="text-emerald-600 dark:text-emerald-400" size={18} />
                                        {t('dash_finance_overview') || 'Ringkasan Keuangan'}
                                    </span>
                                    <TrendingUp size={14} className="text-slate-400" />
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                            {t('dash_total_expenses') || 'Total Pengeluaran Bulan Ini'}
                                        </p>
                                        <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                                            {formatRupiah(synergy.finance.expense)}
                                        </p>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 dark:border-white/5">
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                            {t('dash_income') || 'Pemasukan Bulan Ini'}
                                        </p>
                                        <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                                            {formatRupiah(synergy.finance.income)}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Widget 3: Top Goal Progress */}
                            <Link
                                href="/goals"
                                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                        <Target className="text-amber-600 dark:text-amber-400" size={18} />
                                        {t('dash_goal_progress') || 'Target Utama'}
                                    </span>
                                    <ChevronRight size={14} className="text-slate-400" />
                                </div>
                                {synergy.goals.top_goal ? (
                                    <>
                                        <p className="line-clamp-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {synergy.goals.top_goal.title}
                                        </p>
                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                                style={{ width: `${synergy.goals.top_goal.percent}%` }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {t('dash_goal_empty_cta') || 'Belum ada target aktif. Buat sekarang!'}
                                    </p>
                                )}
                            </Link>

                            {/* Widget 4: Journal Status */}
                            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {t('dash_journal_title') || 'Jurnal Harian'}
                                    </span>
                                    <span
                                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                            synergy.journal.is_written
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                        }`}
                                    >
                                        {synergy.journal.is_written
                                            ? t('dash_journal_written_status') || 'Sudah Ditulis'
                                            : t('dash_pending') || 'Belum Ditulis'}
                                    </span>
                                </div>
                                <Link
                                    href="/journal"
                                    className="mt-3 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {synergy.journal.is_written
                                        ? t('dash_journal_continue') || 'Lihat / Edit Jurnal'
                                        : t('dash_journal_start') || 'Tulis Jurnal Hari Ini'}
                                </Link>
                            </div>

                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
