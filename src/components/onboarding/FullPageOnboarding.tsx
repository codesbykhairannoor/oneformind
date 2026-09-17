'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { 
    useActiveModules, 
    ALL_MODULE_KEYS, 
    ModuleKey 
} from '@/hooks/useActiveModules';
import { 
    Check, 
    ArrowRight, 
    ArrowLeft,
    Sparkles, 
    Compass, 
    Zap, 
    ShieldCheck, 
    SlidersHorizontal,
    Rocket,
    Globe,
    Layers,
    Clock,
    Flame,
    Target,
    BookOpen,
    DollarSign,
    Briefcase,
    Calendar as CalendarIcon,
    Smile,
    Award
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
        persistModules
    } = useActiveModules();

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedRole, setSelectedRole] = useState<string>('student');
    const [selectedGoals, setSelectedGoals] = useState<string[]>(['habits', 'planner', 'finance']);
    const [selectedTabKeys, setSelectedTabKeys] = useState<ModuleKey[]>([
        'habit', 'planner', 'finance', 'study', 'journal', 'calendar', 'job', 'goal'
    ]);
    const [workspaceName, setWorkspaceName] = useState<string>('Life OS');
    const [dailyFocusVibe, setDailyFocusVibe] = useState<string>('deep_work');
    const [isSaving, setIsSaving] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    useEffect(() => {
        if (activeKeys && activeKeys.length > 0) {
            setSelectedTabKeys(activeKeys);
        }
    }, [activeKeys]);

    const handleSwitchLang = (lang: string) => {
        setCurrentLocale(lang);
        window.dispatchEvent(new CustomEvent('switch-locale', { detail: { locale: lang } }));
    };

    // Role options (Step 1)
    const roles = [
        {
            id: 'student',
            icon: '🎓',
            titleId: 'Pelajar & Akademisi',
            titleEn: 'Student & Academic',
            descId: 'Fokus manajemen kuliah, IPK, tugas, dan kebiasaan belajar harian.',
            descEn: 'Focus on coursework, GPA tracking, assignments, and study routines.',
            defaultModules: ['study', 'planner', 'habit', 'journal', 'calendar'] as ModuleKey[]
        },
        {
            id: 'freelancer',
            icon: '💻',
            titleId: 'Freelancer & Kreator',
            titleEn: 'Freelancer & Creator',
            descId: 'Atur jadwal proyek, pantau arus kas klien, dan capai target income.',
            descEn: 'Manage client deliverables, monitor cashflow, and hit revenue goals.',
            defaultModules: ['planner', 'finance', 'goal', 'habit', 'calendar'] as ModuleKey[]
        },
        {
            id: 'career',
            icon: '💼',
            titleId: 'Profesional & Jobseeker',
            titleEn: 'Professional & Jobseeker',
            descId: 'Pipeline lamaran kerja, time-blocking jadwal kerja, dan kalender kegiatan.',
            descEn: 'Job search pipeline, interview prep, work time-blocking, and master calendar.',
            defaultModules: ['job', 'planner', 'calendar', 'journal', 'goal'] as ModuleKey[]
        },
        {
            id: 'growth',
            icon: '🌱',
            titleId: 'Personal Growth & Wellness',
            titleEn: 'Personal Growth & Wellness',
            descId: 'Bangun rutinitas atomic habit, refleksi emosional, dan target jangka panjang.',
            descEn: 'Build atomic habit streaks, reflective journaling, and strategic vision.',
            defaultModules: ['habit', 'journal', 'goal', 'planner', 'finance'] as ModuleKey[]
        },
        {
            id: 'all_rounder',
            icon: '⚡',
            titleId: 'All-Rounder (Life OS Penuh)',
            titleEn: 'All-Rounder (Full Life OS)',
            descId: 'Aktifkan seluruh 8 modul terpadu untuk integrasi kehidupan 360 derajat.',
            descEn: 'Activate all 8 unified modules for a complete 360-degree life operating system.',
            defaultModules: ['habit', 'planner', 'finance', 'study', 'journal', 'calendar', 'job', 'goal'] as ModuleKey[]
        }
    ];

    // Priority goals (Step 2)
    const goalOptions = [
        { id: 'habits', emoji: '🌱', labelId: 'Membangun kebiasaan harian konsisten (Streak)', labelEn: 'Build atomic daily habits & unbroken streaks' },
        { id: 'planner', emoji: '⏱️', labelId: 'Mengatur jadwal & time-blocking prioritas kerja', labelEn: 'Master daily time-blocking & task priorities' },
        { id: 'finance', emoji: '💰', labelId: 'Mengelola arus kas, tabungan, & anggaran bulanan', labelEn: 'Manage multi-wallet cashflow & savings goals' },
        { id: 'journal', emoji: '📓', labelId: 'Menjernihkan pikiran dengan refleksi & jurnal harian', labelEn: 'Clear mental clutter with daily reflective journaling' },
        { id: 'goals', emoji: '🎯', labelId: 'Mencapai target strategis & milestone jangka panjang', labelEn: 'Crush strategic goals & long-term milestones' },
        { id: 'jobs', emoji: '💼', labelId: 'Melacak lamaran kerja & mempersiapkan karier', labelEn: 'Track job application pipelines & career growth' },
        { id: 'study', emoji: '🎓', labelId: 'Meningkatkan IPK, tugas kuliah, & ringkasan buku', labelEn: 'Boost GPA, track assignments & library books' },
        { id: 'calendar', emoji: '📅', labelId: 'Menyatukan seluruh deadline penting dalam kalender', labelEn: 'Consolidate events & critical deadlines in one calendar' },
    ];

    // Modules catalog (Step 3)
    const modulesCatalog: { key: ModuleKey; emoji: string; nameId: string; nameEn: string; descId: string; descDesc: string; badge: string }[] = [
        {
            key: 'planner',
            emoji: '📋',
            nameId: 'Daily Planner',
            nameEn: 'Daily Planner',
            descId: 'Timeline jam kerja, time-blocking, dan checklist to-do prioritas.',
            descDesc: 'Daily time-blocking, task priorities, and schedule management.',
            badge: 'Time OS'
        },
        {
            key: 'habit',
            emoji: '🌱',
            nameId: 'Habit Tracker',
            nameEn: 'Habit Tracker',
            descId: 'Lacak kebiasaan kuantitatif harian dan jaga streak konsistensi.',
            descDesc: 'Quantitative daily habit metrics and atomic streak tracking.',
            badge: 'Atomic OS'
        },
        {
            key: 'finance',
            emoji: '💸',
            nameId: 'Finance OS',
            nameEn: 'Finance OS',
            descId: 'Catat transaksi multi-dompet, pos tabungan, dan batasan budget.',
            descDesc: 'Multi-wallet cashflow, savings pots, and monthly budget limits.',
            badge: 'Money OS'
        },
        {
            key: 'journal',
            emoji: '📓',
            nameId: 'Digital Journal',
            nameEn: 'Digital Journal',
            descId: 'Refleksi emosi harian, mood rating, dan arsip pemikiran penting.',
            descDesc: 'Daily emotional reflections, mood logs, and thought archives.',
            badge: 'Mind OS'
        },
        {
            key: 'goal',
            emoji: '🎯',
            nameId: 'Strategic Goals',
            nameEn: 'Strategic Goals',
            descId: 'Peta target jangka panjang, breakdown milestone, dan vision board.',
            descDesc: 'Long-term goal OKRs, milestone breakdown, and progress tracking.',
            badge: 'Vision OS'
        },
        {
            key: 'study',
            emoji: '🎓',
            nameId: 'Study & Academic',
            nameEn: 'Study & Academic',
            descId: 'Simulasi IPK, jadwal mata kuliah, deadline tugas, dan buku.',
            descDesc: 'GPA simulator, course schedules, assignment deadlines, and books.',
            badge: 'Study OS'
        },
        {
            key: 'job',
            emoji: '💼',
            nameId: 'Job Tracker',
            nameEn: 'Job Tracker',
            descId: 'Pipeline status lamaran kerja, catatan interview, dan CRM karier.',
            descDesc: 'Job application pipeline, interview notes, and recruiter CRM.',
            badge: 'Career OS'
        },
        {
            key: 'calendar',
            emoji: '📅',
            nameId: 'Smart Calendar',
            nameEn: 'Smart Calendar',
            descId: 'Pusat kalender visual untuk sinkronisasi seluruh event & tugas.',
            descDesc: 'Visual calendar hub consolidating all schedules and events.',
            badge: 'Events OS'
        },
    ];

    const handleSelectRole = (roleId: string) => {
        setSelectedRole(roleId);
        const r = roles.find(item => item.id === roleId);
        if (r) {
            setSelectedTabKeys(r.defaultModules);
        }
    };

    const toggleGoal = (goalId: string) => {
        setSelectedGoals(prev => 
            prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
        );
    };

    const toggleModule = (key: ModuleKey) => {
        setSelectedTabKeys(prev => {
            if (prev.includes(key)) {
                if (prev.length <= 1) return prev; // Keep at least 1 module active
                return prev.filter(k => k !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinishAndLaunch = async () => {
        setIsLaunching(true);
        setIsSaving(true);

        try {
            // Build modules map
            const nextModules: Record<string, boolean> = {};
            ALL_MODULE_KEYS.forEach(k => {
                nextModules[k] = selectedTabKeys.includes(k);
            });

            // Save to active modules system
            await persistModules(nextModules);

            // Sync full onboarding metadata to backend
            try {
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        settings: {
                            modules: nextModules,
                            tabs_activated_at: new Date().toISOString(),
                            onboarding_completed: true,
                            workspace_name: workspaceName,
                            daily_focus_vibe: dailyFocusVibe,
                            role: selectedRole,
                            goals: selectedGoals
                        }
                    })
                });
            } catch (err) {
                console.error('Failed to sync onboarding to backend:', err);
            }

            // Save onboarding metadata to localStorage
            localStorage.setItem('tranvas_tab_setup_completed', 'true');
            localStorage.setItem('tranvas_onboarding_profile', JSON.stringify({
                role: selectedRole,
                goals: selectedGoals,
                workspaceName,
                dailyFocusVibe,
                completedAt: new Date().toISOString()
            }));

            // Optional delay for a slick SaaS launching animation
            await new Promise(resolve => setTimeout(resolve, 800));

            if (onClose) {
                onClose();
            } else {
                router.push('/dashboard');
            }
        } catch (e) {
            console.error('Error completing onboarding:', e);
            router.push('/dashboard');
        } finally {
            setIsSaving(false);
            setIsLaunching(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
            
            {/* AMBIENT GLOW EFFECTS */}
            <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

            {/* TOP HEADER */}
            <header className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between relative z-20 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
                        T
                    </div>
                    <div>
                        <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                            <span>Tranvas Life OS</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Workspace Setup
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => handleSwitchLang('id')}
                            className={`px-3 py-1.5 rounded-xl transition-all ${
                                isIndo ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🇮🇩 ID
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchLang('en')}
                            className={`px-3 py-1.5 rounded-xl transition-all ${
                                !isIndo ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🇺🇸 EN
                        </button>
                    </div>
                </div>
            </header>

            {/* PROGRESS STEP BAR */}
            <div className="w-full bg-slate-900/50 border-b border-slate-800/40 py-3.5 relative z-10">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-2">
                    {[
                        { step: 1, labelId: 'Peran & Fokus', labelEn: 'Role & Focus' },
                        { step: 2, labelId: 'Prioritas Utama', labelEn: 'Key Priorities' },
                        { step: 3, labelId: 'Pilih Modul Tab', labelEn: 'Select Modules' },
                        { step: 4, labelId: 'Peluncuran', labelEn: 'Launch OS' },
                    ].map(item => {
                        const isDone = item.step < currentStep;
                        const isCurrent = item.step === currentStep;

                        return (
                            <div 
                                key={item.step} 
                                className={`flex items-center gap-2 transition-all ${
                                    isCurrent ? 'opacity-100' : isDone ? 'opacity-80' : 'opacity-40'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                                    isDone 
                                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                        : isCurrent 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/40' 
                                            : 'bg-slate-800 text-slate-400'
                                }`}>
                                    {isDone ? <Check size={14} strokeWidth={3} /> : item.step}
                                </div>
                                <span className={`text-xs font-bold hidden sm:inline ${
                                    isCurrent ? 'text-white' : 'text-slate-400'
                                }`}>
                                    {isIndo ? item.labelId : item.labelEn}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MAIN INTERACTIVE ONBOARDING BODY */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col justify-between relative z-10">
                
                {/* STEP 1: PERSONA / ROLE */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-wider uppercase mb-3">
                                <Sparkles size={13} />
                                <span>{isIndo ? 'Langkah 1 dari 4' : 'Step 1 of 4'}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {isIndo ? 'Apa fokus utama aktivitas Anda saat ini?' : "What's your primary focus right now?"}
                            </h2>
                            <p className="text-sm font-medium text-slate-400 mt-2">
                                {isIndo 
                                    ? 'Pilih persona Anda untuk menyesuaikan tata letak modul dan rekomendasi fitur terbaik.'
                                    : 'Select your persona to tailor the workspace layout and optimal workflow.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {roles.map(role => {
                                const isSelected = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleSelectRole(role.id)}
                                        className={`p-5 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                                            isSelected 
                                                ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/10' 
                                                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                                                {role.icon}
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                                isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-800'
                                            }`}>
                                                {isSelected && <Check size={12} strokeWidth={3} />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-base text-white mb-1">
                                                {isIndo ? role.titleId : role.titleEn}
                                            </h3>
                                            <p className="text-xs text-slate-400 leading-relaxed">
                                                {isIndo ? role.descId : role.descEn}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* STEP 2: CORE PRIORITIES & GOALS */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-wider uppercase mb-3">
                                <Target size={13} />
                                <span>{isIndo ? 'Langkah 2 dari 4' : 'Step 2 of 4'}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {isIndo ? 'Apa target terpenting yang ingin Anda capai?' : 'What are your top priorities to conquer?'}
                            </h2>
                            <p className="text-sm font-medium text-slate-400 mt-2">
                                {isIndo 
                                    ? 'Pilih beberapa fokus utama yang ingin Anda perbaiki dan lacak setiap hari.'
                                    : 'Select the key areas you want to track and master effortlessly.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {goalOptions.map(goal => {
                                const isSelected = selectedGoals.includes(goal.id);
                                return (
                                    <button
                                        key={goal.id}
                                        type="button"
                                        onClick={() => toggleGoal(goal.id)}
                                        className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                            isSelected 
                                                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                                                : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl shrink-0">{goal.emoji}</span>
                                            <span className="text-xs font-bold leading-snug">
                                                {isIndo ? goal.labelId : goal.labelEn}
                                            </span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-lg border shrink-0 flex items-center justify-center transition-all ${
                                            isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-800'
                                        }`}>
                                            {isSelected && <Check size={12} strokeWidth={3} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* STEP 3: DIRECT MODULE TAB SELECTION */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-wider uppercase mb-3">
                                    <Layers size={13} />
                                    <span>{isIndo ? 'Langkah 3 dari 4' : 'Step 3 of 4'}</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    {isIndo ? 'Pilih Modul Tab yang Ingin Diaktifkan' : 'Choose Your Active Module Tabs'}
                                </h2>
                                <p className="text-sm font-medium text-slate-400 mt-2">
                                    {isIndo 
                                        ? 'Seluruh 8 modul terbuka penuh secara default. Centang modul yang ingin Anda tampilkan di navigasi.'
                                        : 'All 8 modules are fully unlocked. Toggle whichever tabs you want active on your navigation.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                                <span className="text-xs font-bold text-slate-400">
                                    {isIndo ? 'Aktif:' : 'Active:'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black">
                                    {selectedTabKeys.length} / 8 {isIndo ? 'Modul' : 'Modules'}
                                </span>
                            </div>
                        </div>

                        {/* MODULES GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                            {modulesCatalog.map(mod => {
                                const isSelected = selectedTabKeys.includes(mod.key);
                                return (
                                    <button
                                        key={mod.key}
                                        type="button"
                                        onClick={() => toggleModule(mod.key)}
                                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative group min-h-[140px] ${
                                            isSelected 
                                                ? 'bg-slate-900 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10' 
                                                : 'bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between w-full mb-3">
                                            <span className="text-2xl">{mod.emoji}</span>
                                            <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                isSelected ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {mod.badge}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm text-white flex items-center justify-between mb-1">
                                                <span>{isIndo ? mod.nameId : mod.nameEn}</span>
                                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                                    isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                                                }`}>
                                                    {isSelected && <Check size={11} strokeWidth={3} />}
                                                </span>
                                            </h4>
                                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                                                {isIndo ? mod.descId : mod.descDesc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* LIVE PREVIEW BAR */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-400">
                                {isIndo ? '👀 Tampilan Tab Navigasi Anda:' : '👀 Live Navigation Tab Preview:'}
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                                    📊 Dashboard
                                </span>
                                {selectedTabKeys.map(k => {
                                    const m = modulesCatalog.find(item => item.key === k);
                                    if (!m) return null;
                                    return (
                                        <span key={k} className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1">
                                            <span>{m.emoji}</span>
                                            <span>{isIndo ? m.nameId : m.nameEn}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: WORKSPACE PERSONALIZATION & LAUNCH */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black tracking-wider uppercase mb-3">
                                <Rocket size={13} />
                                <span>{isIndo ? 'Langkah Terakhir' : 'Final Step'}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {isIndo ? 'Personalisasi & Luncurkan Workspace Anda' : 'Personalize & Launch Your Workspace'}
                            </h2>
                            <p className="text-sm font-medium text-slate-400 mt-2">
                                {isIndo 
                                    ? 'Beri nama ruang kerja Anda dan mulai bangun kehidupan yang lebih produktif & terarah.'
                                    : 'Name your workspace and embark on your unified productivity journey.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Workspace Name Input */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                        {isIndo ? 'Nama Ruang Kerja / Workspace' : 'Workspace Name'}
                                    </label>
                                    <input 
                                        type="text"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        placeholder="My Productivity OS"
                                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                        {isIndo ? 'Gaya Fokus Harian' : 'Daily Prime Vibe'}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'morning', icon: '☀️', labelId: 'Morning Clarity', labelEn: 'Morning' },
                                            { id: 'deep_work', icon: '⚡', labelId: 'Deep Sprint', labelEn: 'Deep Work' },
                                            { id: 'evening', icon: '🌙', labelId: 'Reflective', labelEn: 'Evening' },
                                        ].map(vibe => (
                                            <button
                                                key={vibe.id}
                                                type="button"
                                                onClick={() => setDailyFocusVibe(vibe.id)}
                                                className={`p-3 rounded-xl border text-center transition-all ${
                                                    dailyFocusVibe === vibe.id
                                                        ? 'bg-indigo-600 border-indigo-500 text-white font-black'
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                <div className="text-lg mb-1">{vibe.icon}</div>
                                                <div className="text-[10px] font-bold">{isIndo ? vibe.labelId : vibe.labelEn}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Summary Checklist Card */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                                        <Sparkles size={16} className="text-indigo-400" />
                                        <span>{isIndo ? 'Status Konfigurasi Life OS' : 'Life OS Setup Ready'}</span>
                                    </h4>

                                    <ul className="space-y-2.5 text-xs text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                <Check size={11} strokeWidth={3} />
                                            </div>
                                            <span>{selectedTabKeys.length} {isIndo ? 'Modul Produktivitas Diaktifkan' : 'Productivity Modules Active'}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                <Check size={11} strokeWidth={3} />
                                            </div>
                                            <span>{isIndo ? 'Dashboard & Daily Synergy Hub Tersinkronisasi' : 'Dashboard & Daily Synergy Hub Initialized'}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                <Check size={11} strokeWidth={3} />
                                            </div>
                                            <span>{isIndo ? 'Akses Penuh Tanpa Kunci Waktu' : 'Full Lifetime Customization Access'}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                                    {isIndo 
                                        ? '💡 Anda dapat mengubah kembali modul aktif kapan saja melalui menu Pengaturan.'
                                        : '💡 You can adjust your active modules anytime via Settings.'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BOTTOM NAVIGATION CONTROLS */}
                <div className="mt-10 pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            disabled={isLaunching}
                            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <ArrowLeft size={16} />
                            <span>{isIndo ? 'Kembali' : 'Back'}</span>
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 hover:translate-x-0.5 active:scale-95 cursor-pointer"
                        >
                            <span>{isIndo ? 'Lanjutkan' : 'Continue'}</span>
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFinishAndLaunch}
                            disabled={isLaunching}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-xl shadow-indigo-600/40 transition flex items-center gap-3 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75"
                        >
                            {isLaunching ? (
                                <span>{isIndo ? 'Menyiapkan Ruang Kerja...' : 'Launching Workspace...'}</span>
                            ) : (
                                <>
                                    <span>{isIndo ? 'Masuk ke Dashboard' : 'Launch Dashboard'}</span>
                                    <Rocket size={18} />
                                </>
                            )}
                        </button>
                    )}
                </div>

            </main>
        </div>
    );
}
