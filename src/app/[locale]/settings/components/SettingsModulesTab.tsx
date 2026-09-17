'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
    useActiveModules, 
    ALL_MODULE_KEYS, 
    ModuleKey 
} from '@/hooks/useActiveModules';
import { 
    Check, 
    Sparkles, 
    AlertCircle, 
    ArrowRight, 
    Layers, 
    ShieldAlert, 
    RefreshCw,
    Save
} from 'lucide-react';

interface SettingsModulesTabProps {
    modules?: Record<string, boolean>;
    onToggleModule?: (key: string) => void;
}

export default function SettingsModulesTab({
    modules: initialModules,
    onToggleModule: initialOnToggle
}: SettingsModulesTabProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const {
        modules,
        activeCount,
        isSaving,
        toggleTab,
        persistModules
    } = useActiveModules();

    const [feedbackMessage, setFeedbackMessage] = useState<{
        type: 'error' | 'warning' | 'success';
        text: string;
    } | null>(null);

    const showFeedback = (type: 'error' | 'warning' | 'success', text: string) => {
        setFeedbackMessage({ type, text });
        setTimeout(() => setFeedbackMessage(null), 4000);
    };

    const handleSaveAndApply = async () => {
        await persistModules(modules);
        showFeedback(
            'success',
            isIndo
                ? '✓ Layout Navigasi & Sidebar Berhasil Diperbarui!'
                : '✓ Navigation & Sidebar Layout Successfully Saved & Updated!'
        );
    };

    const emojiMap: Record<string, string> = {
        habit: '🌱',
        planner: '📋',
        finance: '💸',
        study: '🎓',
        journal: '📓',
        calendar: '📅',
        job: '💼',
        goal: '🎯'
    };

    const labelMap: Record<string, { id: string; en: string }> = {
        habit: { id: 'Kebiasaan (Habits)', en: 'Habits & Streaks' },
        planner: { id: 'Agenda (Daily Planner)', en: 'Daily Planner' },
        finance: { id: 'Keuangan (Finance)', en: 'Finance & Budget' },
        study: { id: 'Akademik & Buku (Study)', en: 'Study & Book Tracker' },
        journal: { id: 'Jurnal Refleksi (Journal)', en: 'Reflective Journal' },
        calendar: { id: 'Kalender Master (Calendar)', en: 'Master Calendar' },
        job: { id: 'Karier & Lamaran (Jobs)', en: 'Jobs & Career' },
        goal: { id: 'Target Strategis (Goals)', en: 'Strategic Goals' }
    };

    const descMap: Record<string, { id: string; en: string }> = {
        habit: {
            id: 'Pelacak rutinitas harian, streaks berulang, dan pembentukan kebiasaan atomik.',
            en: 'Daily routine tracker, recurring streaks, and atomic habit formation.'
        },
        planner: {
            id: 'Manajemen tugas, prioritas matriks, to-do list, dan time-blocking harian.',
            en: 'Task management, Eisenhower priority matrix, and daily time-blocking.'
        },
        finance: {
            id: 'Pencatatan arus kas, alokasi dompet, limit budget bulanan, dan net worth.',
            en: 'Cashflow tracking, wallet allocations, monthly budgets, and net worth.'
        },
        study: {
            id: 'Jadwal kuliah, radar tugas, simulasi IPK, flashcards, dan pelacak buku bacaan.',
            en: 'Course schedules, assignment radar, GPA calculator, flashcards & books.'
        },
        journal: {
            id: 'Catatan refleksi malam, pelacak suasana hati (mood), dan ringkasan Life OS harian.',
            en: 'Evening reflections, mood tracking, and 1-click daily Life OS briefs.'
        },
        calendar: {
            id: 'Timeline terpadu yang menggabungkan agenda planner, kebiasaan, dan tenggat waktu.',
            en: 'Unified master timeline aggregating planner tasks, habits, and deadlines.'
        },
        job: {
            id: 'Pelacak lamaran pekerjaan, tahapan wawancara (interview), dan CV portofolio.',
            en: 'Job application pipeline, interview stages, and resume portfolio.'
        },
        goal: {
            id: 'Target jangka panjang, target North Star, dan evaluasi kecepatan milestone (OKR).',
            en: 'Long-term North Star goals, milestone pacing, and OKR execution.'
        }
    };

    const handleToggle = async (key: ModuleKey) => {
        const res = await toggleTab(key);
        if (res.success) {
            if (initialOnToggle) {
                initialOnToggle(key);
            }
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pusat Aktivasi & Kustomisasi Modul' : 'Module Activation & Customization Hub'}
                    </h3>
                    
                    {/* Status Badge & Save CTA */}
                    <div className="flex flex-wrap items-center gap-2">
                        {isSaving && (
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 animate-pulse">
                                <RefreshCw size={12} className="animate-spin" />
                                {isIndo ? 'Menyimpan...' : 'Saving...'}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                            <Layers size={13} />
                            {`${activeCount} / 8 ${isIndo ? 'Tab Aktif di Navigasi' : 'Tabs Active on Nav'}`}
                        </span>

                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleSaveAndApply}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                            <Save size={14} />
                            <span>{isIndo ? 'Simpan & Terapkan Layout' : 'Save & Apply Layout'}</span>
                        </button>
                    </div>
                </div>

                <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }} className="text-slate-500 dark:text-slate-400 mt-2 max-w-3xl">
                    {isIndo
                        ? 'Aktifkan modul yang Anda butuhkan dan sembunyikan modul yang belum diperlukan agar navigasi dan sidebar Anda tetap terfokus, rapi, dan bebas gangguan.'
                        : 'Enable the modules you need and hide unused ones to keep your sidebar navigation focused, clean, and distraction-free.'
                    }
                </p>
            </div>

            {/* Interactive Feedback Toast */}
            {feedbackMessage && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 border ${
                    feedbackMessage.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : feedbackMessage.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}>
                    {feedbackMessage.type === 'error' ? <ShieldAlert size={16} /> : feedbackMessage.type === 'warning' ? <AlertCircle size={16} /> : <Check size={16} />}
                    <span>{feedbackMessage.text}</span>
                </div>
            )}

            {/* SECTION: 8 CORE MODULES CARDS (CLEAN INDIVIDUAL CONTROLS) */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Pilih Modul Aktif (Aktifkan / Nonaktifkan)' : 'Select Active Modules (Enable / Disable)'}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                        {activeCount} / 8 {isIndo ? 'Aktif' : 'Active'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {ALL_MODULE_KEYS.map((key) => {
                        const isEnabled = Boolean(modules[key]);
                        const labels = labelMap[key] || { id: key, en: key };
                        const descs = descMap[key] || { id: '', en: '' };

                        return (
                            <div
                                key={key}
                                id={`module-card-${key}`}
                                className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                                    isEnabled
                                        ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-start gap-3.5 min-w-0 pr-3">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                                        isEnabled
                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 shadow-sm border border-indigo-100 dark:border-indigo-900/40'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 opacity-60'
                                    }`}>
                                        {emojiMap[key]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-bold text-sm tracking-tight ${
                                                isEnabled ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                                {isIndo ? labels.id : labels.en}
                                            </h4>
                                            {isEnabled && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {isIndo ? descs.id : descs.en}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 pl-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            id={`module-toggle-${key}`}
                                            checked={isEnabled}
                                            type="checkbox"
                                            className="sr-only peer"
                                            onChange={() => handleToggle(key)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner border border-slate-200 dark:border-slate-700" />
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STICKY SAVE & APPLY BAR AT THE BOTTOM */}
            <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-100 dark:border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h5 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{isIndo ? 'Status Konfigurasi Tab & Sidebar' : 'Tab & Sidebar Configuration'}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isIndo
                                ? `${activeCount} dari 8 modul aktif di navigasi`
                                : `${activeCount} of 8 modules active on navigation`
                            }
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={handleSaveAndApply}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
                    >
                        {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                        <span>{isIndo ? 'Simpan & Terapkan Layout' : 'Save & Apply Layout'}</span>
                    </button>
                </div>
            </div>

            {/* SYSTEM CORE & AI COACH NOTE */}
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-indigo-500 shrink-0" />
                    <span>
                        {isIndo 
                            ? 'Catatan: Tab Dashboard selalu aktif gratis. Fitur Neural AI Coach hanya terbuka khusus untuk Quantum Plan (tidak termasuk di Free atau Architect).'
                            : 'Note: Dashboard is always free. Neural AI Coach is an exclusive feature for Quantum Plan (not included in Free or Architect).'}
                    </span>
                </div>
                <Link
                    href="/billing"
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                    <span>{isIndo ? 'Lihat Detail Paket' : 'View Plan Details'}</span>
                    <ArrowRight size={12} />
                </Link>
            </div>
        </div>
    );
}
