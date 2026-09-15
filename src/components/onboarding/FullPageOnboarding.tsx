'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { 
    useActiveModules, 
    MODULE_PRESETS, 
    ALL_MODULE_KEYS, 
    ModuleKey,
    MAX_FREE_ACTIVE_MODULES 
} from '@/hooks/useActiveModules';
import { 
    Sparkles, 
    Check, 
    ArrowRight, 
    Layers, 
    ShieldCheck, 
    Zap, 
    X,
    Globe,
    Compass,
    Rocket,
    SlidersHorizontal,
    ChevronRight,
    Star
} from 'lucide-react';

interface FullPageOnboardingProps {
    isStandalonePage?: boolean;
    onClose?: () => void;
}

export default function FullPageOnboarding({ 
    isStandalonePage = false, 
    onClose 
}: FullPageOnboardingProps) {
    const locale = useLocale();
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState<string>(locale);
    const isIndo = currentLocale === 'id';

    const {
        activeKeys,
        isUnlimited,
        toggleTab,
        applyPreset
    } = useActiveModules();

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedPersona, setSelectedPersona] = useState<string>('scholar');
    const [selectedTabKeys, setSelectedTabKeys] = useState<ModuleKey[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (activeKeys.length > 0) {
            setSelectedTabKeys(activeKeys);
        } else {
            // Default preset
            setSelectedTabKeys(['study', 'planner', 'habit']);
        }
    }, [activeKeys]);

    const handleSwitchLang = (lang: string) => {
        setCurrentLocale(lang);
        window.dispatchEvent(new CustomEvent('switch-locale', { detail: { locale: lang } }));
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

    const moduleDetailsMap: Record<string, { idName: string; enName: string; idDesc: string; enDesc: string; badge: string }> = {
        habit: {
            idName: 'Pelacak Kebiasaan',
            enName: 'Habit Tracker',
            idDesc: 'Bangun kebiasaan harian kuantitatif (ml, reps, menit) & lacak streak tanpa putus.',
            enDesc: 'Build daily quantitative habits (ml, reps, mins) & maintain atomic streaks.',
            badge: 'Daily OS'
        },
        planner: {
            idName: 'Agenda & Timeline',
            enName: 'Daily Planner',
            idDesc: 'Jadwalkan jam kerja harian, alokasi waktu (time-blocking), dan daftar prioritas.',
            enDesc: 'Schedule daily work hours, time-blocking blocks, and task priorities.',
            badge: 'Time OS'
        },
        finance: {
            idName: 'Manajemen Keuangan',
            enName: 'Finance Command',
            idDesc: 'Pantau arus kas multi-dompet, pos tabungan impian, dan batasan anggaran bulanan.',
            enDesc: 'Multi-wallet cashflow, savings pots, and monthly budget limits.',
            badge: 'Money OS'
        },
        study: {
            idName: 'Akademik & Studi',
            enName: 'Study & Academic',
            idDesc: 'Simulasi IPK/GPA, jadwalkan kuliah, daftar tugas, dan ringkasan buku.',
            enDesc: 'GPA simulator, course scheduling, assignment tracker, and book library.',
            badge: 'Knowledge OS'
        },
        journal: {
            idName: 'Jurnal & Refleksi',
            enName: 'Reflective Journal',
            idDesc: 'Catat refleksi emosional harian, evaluasi diri, dan jurnal pemikiran.',
            enDesc: 'Daily emotional reflections, self-evaluation, and thought archives.',
            badge: 'Mind OS'
        },
        calendar: {
            idName: 'Kalender Master',
            enName: 'Master Calendar',
            idDesc: 'Pusat kalender kegiatan, event mendatang, dan deadline penting.',
            enDesc: 'Master calendar hub, upcoming events, and critical deadlines.',
            badge: 'Events OS'
        },
        job: {
            idName: 'Pusat Karier & Kerja',
            enName: 'Jobs & Career',
            idDesc: 'Lacak pipeline lamaran kerja, catatan wawancara, dan recruiter CRM.',
            enDesc: 'Job application funnel, interview logs, and recruiter CRM.',
            badge: 'Career OS'
        },
        goal: {
            idName: 'Target Strategis',
            enName: 'Strategic Goals',
            idDesc: 'Target jangka panjang, breakdown milestone mingguan, dan visi hidup.',
            enDesc: 'Long-term goal OKRs, weekly milestone breakdown, and vision board.',
            badge: 'Vision OS'
        }
    };

    const handlePersonaClick = async (presetId: string) => {
        setSelectedPersona(presetId);
        const preset = MODULE_PRESETS.find(p => p.id === presetId);
        if (preset) {
            setSelectedTabKeys(preset.modules);
            await applyPreset(presetId);
        }
    };

    const handleSelectModule = async (key: ModuleKey) => {
        const isSelected = selectedTabKeys.includes(key);
        if (isSelected) {
            if (selectedTabKeys.length <= 1) return; // Keep at least 1 tab
            const next = selectedTabKeys.filter(k => k !== key);
            setSelectedTabKeys(next);
            await toggleTab(key);
        } else {
            const next = [...selectedTabKeys, key];
            setSelectedTabKeys(next);
            await toggleTab(key);
        }
    };

    const handleFinishOnboarding = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem('tranvas_tab_setup_completed', 'true');
        } catch (e) {
            console.error(e);
        }

        if (onClose) {
            onClose();
        } else {
            router.push('/dashboard');
        }
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
            
            {/* AMBIENT GLOW BACKGROUND */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

            {/* TOP BAR */}
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between relative z-20 border-b border-slate-800/60">
                
                {/* Brand Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
                        T
                    </div>
                    <div>
                        <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                            <span>Tranvas OS</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                v2.5 Setup
                            </span>
                        </h1>
                        <p className="text-[11px] font-medium text-slate-400">
                            {isIndo ? 'Sistem Operasi Kehidupan Terpadu' : 'Unified Life Operating System'}
                        </p>
                    </div>
                </div>

                {/* Right Actions: Lang Switcher & Skip/Close */}
                <div className="flex items-center gap-3">
                    {/* Bilingual Language Switcher */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => handleSwitchLang('id')}
                            className={`px-3 py-1.5 rounded-xl transition-all ${
                                isIndo 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🇮🇩 ID
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchLang('en')}
                            className={`px-3 py-1.5 rounded-xl transition-all ${
                                !isIndo 
                                    ? 'bg-indigo-600 text-white shadow-sm' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🇺🇸 EN
                        </button>
                    </div>

                    {!isStandalonePage && (
                        <button
                            type="button"
                            onClick={handleFinishOnboarding}
                            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
                            title={isIndo ? 'Tutup Setup' : 'Close Setup'}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* STEP PROGRESS INDICATOR BAR */}
            <div className="w-full bg-slate-900/50 border-b border-slate-800/40 py-3 relative z-10">
                <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
                    {[
                        { step: 1, labelId: '1. Persona & Tujuan', labelEn: '1. Persona & Goals' },
                        { step: 2, labelId: '2. Kustomisasi Modul', labelEn: '2. Custom Workspace Tabs' },
                        { step: 3, labelId: '3. Peluncuran Workspace', labelEn: '3. Launch Workspace' },
                    ].map(s => {
                        const isActiveStep = currentStep === s.step;
                        const isDone = currentStep > s.step;

                        return (
                            <button
                                key={s.step}
                                type="button"
                                onClick={() => setCurrentStep(s.step)}
                                className={`flex items-center gap-2 transition-all ${
                                    isActiveStep 
                                        ? 'text-indigo-400 font-black' 
                                        : isDone 
                                        ? 'text-emerald-400 font-bold' 
                                        : 'text-slate-500 font-medium'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    isActiveStep 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/20' 
                                        : isDone 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                        : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {isDone ? <Check size={14} strokeWidth={3} /> : s.step}
                                </div>
                                <span className="text-xs hidden sm:inline">
                                    {isIndo ? s.labelId : s.labelEn}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10 flex flex-col justify-between">
                
                {/* ================= STEP 1: PERSONA & LIFE GOAL SELECTION ================= */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        
                        {/* Headline */}
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                                <Compass size={14} className="text-indigo-400" />
                                <span>{isIndo ? 'Langkah 1 dari 3: Kenali Persona Anda' : 'Step 1 of 3: Identify Your Persona'}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                                {isIndo ? 'Pilih Gaya Hidup & Target Utama Anda Hari Ini' : 'Choose Your Primary Goal & Lifestyle Today'}
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {isIndo 
                                    ? 'Pilih paket awal yang sesuai dengan prioritas hidup Anda saat ini. Anda bebas menambah atau menyembunyikan modul kapan saja.' 
                                    : 'Select a preset tailored to your current priorities. You can enable or hide any module anytime.'}
                            </p>
                        </div>

                        {/* Persona Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MODULE_PRESETS.map((preset) => {
                                const isSelected = selectedPersona === preset.id;

                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => handlePersonaClick(preset.id)}
                                        className={`p-5 rounded-3xl border text-left transition-all relative flex flex-col justify-between group overflow-hidden ${
                                            isSelected 
                                                ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30 scale-[1.02]' 
                                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 inline-block">
                                                    {preset.emoji}
                                                </span>
                                                {isSelected && (
                                                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                                        <Check size={10} strokeWidth={3} />
                                                        <span>{isIndo ? 'Terpilih' : 'Selected'}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                                                {isIndo ? preset.labelId : preset.labelEn}
                                            </h3>

                                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                                {isIndo ? preset.descId : preset.descEn}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                {isIndo ? 'Fokus Utama:' : 'Primary Focus:'}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                {preset.modules.map(m => (
                                                    <span key={m} className="px-2 py-0.5 rounded-lg bg-slate-800 text-xs font-bold border border-slate-700/50">
                                                        {emojiMap[m]} {isIndo ? moduleDetailsMap[m]?.idName.split(' ')[0] : moduleDetailsMap[m]?.enName.split(' ')[0]}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                <span>{isIndo ? 'Lanjut Kustomisasi Tab' : 'Continue to Custom Tabs'}</span>
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 2: INTERACTIVE 8-MODULE CUSTOMIZER ================= */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        
                        {/* Headline */}
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold">
                                <SlidersHorizontal size={14} className="text-indigo-400" />
                                <span>{isIndo ? 'Langkah 2 dari 3: Pilih Tab Produktivitas Anda' : 'Step 2 of 3: Customize Workspace Tabs'}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                                {isIndo ? 'Pilih Modul yang Ingin Ditampilkan' : 'Select Modules to Display on Navigation'}
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {isIndo 
                                    ? 'Aktifkan modul yang Anda butuhkan dan sembunyikan modul yang belum diperlukan agar tampilan tetap terfokus.' 
                                    : 'Enable the modules you need and hide unused ones to keep your workspace navigation focused.'}
                            </p>
                        </div>

                        {/* Live Selection Counter Pill */}
                        <div className="flex items-center justify-center">
                            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-black shadow-lg">
                                <Layers size={16} className="text-indigo-400" />
                                <span className="text-slate-200">
                                    {isIndo ? 'Modul Aktif di Navigasi:' : 'Active Modules on Nav:'} <strong className="text-indigo-400">{selectedTabKeys.length} / 8</strong>
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-black tracking-wider border border-emerald-500/30">
                                    {isIndo ? 'Siap Digunakan' : 'Ready to Use'}
                                </span>
                            </div>
                        </div>

                        {/* 8 Module Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                            {ALL_MODULE_KEYS.map((key) => {
                                const details = moduleDetailsMap[key];
                                const isSelected = selectedTabKeys.includes(key);
                                const isMaxReached = selectedTabKeys.length >= MAX_FREE_ACTIVE_MODULES && !isSelected && !isUnlimited;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        disabled={isMaxReached}
                                        onClick={() => handleSelectModule(key)}
                                        className={`p-4 rounded-3xl border text-left transition-all relative flex flex-col justify-between ${
                                            isSelected 
                                                ? 'bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg' 
                                                : isMaxReached
                                                ? 'bg-slate-900/40 border-slate-800/60 opacity-40 cursor-not-allowed'
                                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 inline-block">
                                                    {emojiMap[key]}
                                                </span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                                    isSelected 
                                                        ? 'bg-indigo-600 text-white' 
                                                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                                                }`}>
                                                    {details?.badge}
                                                </span>
                                            </div>

                                            <h3 className={`text-sm font-black transition-colors ${
                                                isSelected ? 'text-indigo-300' : 'text-white'
                                            }`}>
                                                {isIndo ? details?.idName : details?.enName}
                                            </h3>

                                            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                                                {isIndo ? details?.idDesc : details?.enDesc}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                            {isSelected ? (
                                                <span className="text-[11px] font-black text-indigo-400 flex items-center gap-1">
                                                    <Check size={12} strokeWidth={3} />
                                                    <span>{isIndo ? 'Aktif di Navigasi' : 'Active on Nav'}</span>
                                                </span>
                                            ) : isMaxReached ? (
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {isIndo ? 'Batas Modul Terpakai' : 'Module Limit Reached'}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-400 hover:text-white">
                                                    + {isIndo ? 'Pilih Tab Ini' : 'Select Tab'}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition"
                            >
                                &larr; {isIndo ? 'Kembali ke Langkah 1' : 'Back to Step 1'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                <span>{isIndo ? 'Tinjau & Peluncuran' : 'Review & Launch'}</span>
                                <ArrowRight size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 3: TIER SUMMARY & WORKSPACE LAUNCH ================= */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
                        
                        {/* Headline */}
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                                <Rocket size={14} className="text-emerald-400" />
                                <span>{isIndo ? 'Langkah 3 dari 3: Konfigurasi Selesai' : 'Step 3 of 3: System Ready'}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                                {isIndo ? 'Workspace Siap Digunakan Hari Ini' : 'Your Personal Workspace is Ready'}
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {isIndo 
                                    ? 'Sistem produktivitas Anda telah siap digunakan. Anda bebas menyesuaikan tampilan modul kapan saja.' 
                                    : 'Your productivity system is ready. You can customize active modules anytime.'}
                            </p>
                        </div>

                        {/* Selected System Summary Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                            
                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                                <div>
                                    <h3 className="text-base font-black text-white">
                                        {isIndo ? 'Modul Aktif di Navigasi Anda:' : 'Your Configured Workspace Modules:'}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {isIndo ? `${selectedTabKeys.length} modul aktif di navigasi & sidebar` : `${selectedTabKeys.length} modules active on navigation & sidebar`}
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black">
                                    {isIndo ? 'Paket Explorer' : 'Explorer Plan'}
                                </span>
                            </div>

                            {/* Active Tab Pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {selectedTabKeys.map((key) => {
                                    const details = moduleDetailsMap[key];
                                    return (
                                        <div key={key} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-center gap-3">
                                            <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                                                {emojiMap[key]}
                                            </span>
                                            <div>
                                                <h4 className="text-xs font-black text-white">
                                                    {isIndo ? details?.idName : details?.enName}
                                                </h4>
                                                <span className="text-[10px] font-bold text-indigo-400">
                                                    ✓ {isIndo ? 'Aktif' : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 14-Day Free Trial Upgrade Banner */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-pink-950/80 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white">
                                            {isIndo ? 'Ingin Akses Fitur Power-User (Batch Entry, PDF/CSV Export) + AI Coach?' : 'Want Power-User Engines (Batch Entry, PDF/CSV Exports) + AI Coach?'}
                                        </h4>
                                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                                            {isIndo 
                                                ? 'Coba 14 Hari Free Trial dengan Kartu Kredit ($0 Hari Ini, Batal Kapan Saja).' 
                                                : 'Try 14-Day Free Trial with Card ($0 Today, Cancel Anytime).'}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/billing"
                                    onClick={handleFinishOnboarding}
                                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs shrink-0 shadow-lg transition active:scale-95 text-center"
                                >
                                    {isIndo ? 'Mulai Trial 14 Hari' : 'Start 14-Day Trial'} &rarr;
                                </Link>
                            </div>

                        </div>

                        {/* Final Launch Button */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition"
                            >
                                &larr; {isIndo ? 'Kembali ke Langkah 2' : 'Back to Step 2'}
                            </button>

                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={handleFinishOnboarding}
                                className={`px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 ${
                                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Rocket size={18} strokeWidth={2.5} />
                                )}
                                <span>{isIndo ? 'Luncurkan Workspace Anda' : 'Launch Your Workspace'}</span>
                            </button>
                        </div>
                    </div>
                )}

            </main>

            {/* FOOTER */}
            <footer className="w-full border-t border-slate-900 py-4 text-center text-xs text-slate-600 relative z-20">
                Tranvas OS &copy; 2026 • {isIndo ? 'Hak Cipta Dilindungi' : 'All Rights Reserved'}
            </footer>
        </div>
    );
}
