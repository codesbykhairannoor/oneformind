'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
    useActiveModules, 
    MODULE_PRESETS, 
    ALL_MODULE_KEYS, 
    ModuleKey,
    MAX_FREE_ACTIVE_MODULES 
} from '@/hooks/useActiveModules';
import { 
    Check, 
    Lock, 
    Sparkles, 
    Clock, 
    AlertCircle, 
    ArrowRight, 
    Layers, 
    ShieldAlert, 
    RefreshCw 
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
        activeKeys,
        activeCount,
        maxAllowed,
        daysRemaining,
        isLocked,
        isUnlimited,
        isSaving,
        toggleTab,
        applyPreset
    } = useActiveModules();

    const [feedbackMessage, setFeedbackMessage] = useState<{
        type: 'error' | 'warning' | 'success';
        text: string;
    } | null>(null);

    const showFeedback = (type: 'error' | 'warning' | 'success', text: string) => {
        setFeedbackMessage({ type, text });
        setTimeout(() => setFeedbackMessage(null), 4000);
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
        const isCurrentlyActive = Boolean(modules[key]);

        // If turning on and already 3 active
        if (!isCurrentlyActive && !isUnlimited && activeCount >= maxAllowed) {
            showFeedback(
                'warning',
                isIndo
                    ? 'Batas 3 tab aktif telah tercapai! Matikan salah satu tab yang aktif terlebih dahulu, atau pilih Paket Preset di bawah.'
                    : '3-Tab limit reached! Turn off one active tab first before activating this one, or select a Preset Trio below.'
            );
            return;
        }

        const res = await toggleTab(key);
        if (!res.success) {
            if (res.reason === 'locked') {
                showFeedback(
                    'error',
                    isIndo
                        ? '3 Tab Anda telah terkunci permanen setelah masa percobaan 30 hari. Silakan upgrade untuk membuka kunci modul.'
                        : 'Your 3 tabs are permanently locked after the 30-day grace period. Please upgrade to unlock all modules.'
                );
            } else if (res.reason === 'limit_reached') {
                showFeedback(
                    'warning',
                    isIndo
                        ? 'Batas 3 tab aktif tercapai. Nonaktifkan salah satu tab terlebih dahulu.'
                        : 'Limit of 3 active tabs reached. Disable one tab first.'
                );
            }
        } else {
            if (initialOnToggle) {
                initialOnToggle(key);
            }
        }
    };

    const handleApplyPreset = async (presetId: string) => {
        if (isLocked) {
            showFeedback(
                'error',
                isIndo
                    ? 'Tab sudah terkunci. Upgrade ke paket berbayar untuk mengubah modul.'
                    : 'Tabs are locked. Upgrade to change active modules.'
            );
            return;
        }

        const res = await applyPreset(presetId);
        if (res.success) {
            showFeedback(
                'success',
                isIndo ? 'Paket modul berhasil diterapkan!' : 'Module preset successfully applied!'
            );
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pusat Aktivasi Tab & Modul' : 'Active Modules & Tab Hub'}
                    </h3>
                    
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 animate-pulse">
                                <RefreshCw size={12} className="animate-spin" />
                                {isIndo ? 'Menyimpan...' : 'Saving...'}
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isUnlimited
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                : activeCount === maxAllowed
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                        }`}>
                            <Layers size={13} />
                            {isUnlimited
                                ? (isIndo ? 'Akses Penuh (Unlimited)' : 'Full Access (Unlimited)')
                                : `${activeCount} / ${maxAllowed} ${isIndo ? 'Tab Aktif' : 'Tabs Active'}`
                            }
                        </span>
                    </div>
                </div>

                <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }} className="text-slate-500 dark:text-slate-400 mt-2 max-w-3xl">
                    {isIndo
                        ? 'Pilih hingga 3 tab utama untuk membentuk sistem produktivitas terfokus Anda. Selama 30 hari pertama, Anda bebas menukar tab mana saja sebelum pilihan terkunci.'
                        : 'Choose up to 3 core tabs to build your distraction-free productivity stack. During your first 30 days, you can freely swap tabs before your trio locks.'
                    }
                </p>
            </div>

            {/* Banner: Grace Period Countdown or Lock State */}
            {!isUnlimited && (
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isLocked
                        ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                        : daysRemaining <= 7
                        ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                        : 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-200'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl shrink-0 ${
                                isLocked ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600'
                            }`}>
                                {isLocked ? <Lock size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">
                                    {isLocked
                                        ? (isIndo ? '3 Tab Anda Telah Terkunci Permanen' : 'Your 3 Tabs Are Permanently Locked')
                                        : (isIndo ? 'Masa Eksperimen Fleksibel Aktif' : 'Flexible 30-Day Trial Active')
                                    }
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                    {isLocked
                                        ? (isIndo
                                            ? 'Masa 30 hari telah usai. 3 tab aktif Anda telah dikunci. Ingin menukar tab atau membuka semua 8 modul?'
                                            : 'Your 30-day grace period has elapsed. Your 3 tabs are locked. Want to swap tabs or unlock all 8 modules?')
                                        : (isIndo
                                            ? `Anda memiliki sisa ${daysRemaining} hari lagi untuk bebas menukar 3 tab aktif ini sebelum dikunci otomatis.`
                                            : `You have ${daysRemaining} days remaining to freely test and swap your 3 active tabs before they lock.`)
                                    }
                                </p>
                            </div>
                        </div>

                        {isLocked ? (
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all shrink-0"
                            >
                                <Sparkles size={14} />
                                <span>{isIndo ? 'Buka Semua Modul' : 'Unlock All Modules'}</span>
                            </Link>
                        ) : (
                            <div className="text-right shrink-0">
                                <span className="inline-block px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-800 shadow-sm">
                                    {daysRemaining} {isIndo ? 'Hari Tersisa' : 'Days Left'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

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

            {/* SECTION: PRESET POWER TRIOS (1-CLICK APPLY) */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Paket Rekomendasi (1-Klik Terapkan)' : 'Recommended Power Trios (1-Click)'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                        {isIndo ? 'Pilih paket yang sesuai dengan fase hidup Anda' : 'Tailored to your current life season'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {MODULE_PRESETS.map((preset) => {
                        const isPresetActive = preset.modules.every(k => Boolean(modules[k])) && activeCount === preset.modules.length;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleApplyPreset(preset.id)}
                                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                                    isPresetActive
                                        ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-600 shadow-sm ring-1 ring-indigo-400'
                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm'
                                } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{preset.emoji}</span>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                {isIndo ? preset.labelId : preset.labelEn}
                                            </span>
                                        </div>
                                        {isPresetActive && (
                                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-black">
                                                {isIndo ? 'AKTIF' : 'ACTIVE'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {isIndo ? preset.descId : preset.descEn}
                                    </p>
                                </div>

                                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                        {preset.modules.map(m => emojiMap[m]).join(' ')}
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                        {isPresetActive ? (isIndo ? 'Diterapkan' : 'Applied') : (isIndo ? 'Pilih Paket' : 'Apply Trio')}
                                        <ArrowRight size={10} />
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION: 8 CORE MODULES CARDS */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Pilihan Kustom Seluruh Modul (Maks. 3 Aktif)' : 'All Available Modules (Max 3 Active)'}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                        {activeCount} / {isUnlimited ? '∞' : maxAllowed} {isIndo ? 'Slot Terpakai' : 'Slots Used'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                    {isLocked && !isEnabled ? (
                                        <div 
                                            title={isIndo ? 'Terkunci permanen setelah 30 hari' : 'Permanently locked after 30 days'}
                                            className="w-10 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 cursor-not-allowed"
                                        >
                                            <Lock size={12} />
                                        </div>
                                    ) : (
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
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SYSTEM CORE NOTE */}
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-indigo-500 shrink-0" />
                    <span>
                        {isIndo 
                            ? 'Catatan: Tab Dashboard dan Neural Coach AI selalu aktif sebagai pondasi sistem gratis tanpa memakan kuota 3 tab Anda.'
                            : 'Note: Dashboard and Neural Coach AI are always active as complimentary system foundations without counting towards your 3 slots.'}
                    </span>
                </div>
            </div>
        </div>
    );
}
