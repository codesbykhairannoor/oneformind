'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import ModalPortal from '@/components/ModalPortal';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
);
import {
    Plus,
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Zap,
    TrendingUp,
    Sparkles,
    Trash2,
    Calendar,
    Folder,
    Smile,
    Meh,
    Frown,
    RotateCcw,
    X,
    GripVertical,
    HelpCircle,
    Info,
    Flame,
    Award,
    Edit3,
    ArrowRight
} from 'lucide-react';

interface HabitItem {
    id: number;
    name: string;
    icon: string;
    color: string;
    period: string;
    monthly_target: number;
    position: number;
    logs: Record<string, 'completed' | 'skipped' | 'empty'>;
}

export default function HabitsPage() {
    usePageTitle('Habits Tracker');
    const t = useTranslations();
    const locale = useLocale();

    // 1. Date & Period State
    const [currentMonthKey, setCurrentMonthKey] = useState('2026-08');
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(7); // August (0-indexed)
    const [showHint, setShowHint] = useState(true);

    // 2. Mobile Date Selector Strip State
    const todayStr = '2026-08-15';
    const [selectedMobileDate, setSelectedMobileDate] = useState(todayStr);

    // 3. Habits Main State
    const [habits, setHabits] = useState<HabitItem[]>([
        {
            id: 1,
            name: 'Meditasi Pagi 15 Menit',
            icon: '🧘',
            color: '#6366f1',
            period: '2026-08',
            monthly_target: 25,
            position: 1,
            logs: {
                '2026-08-01': 'completed',
                '2026-08-02': 'completed',
                '2026-08-03': 'completed',
                '2026-08-04': 'completed',
                '2026-08-05': 'completed',
                '2026-08-06': 'completed',
                '2026-08-07': 'skipped',
                '2026-08-08': 'completed',
                '2026-08-09': 'completed',
                '2026-08-10': 'completed',
                '2026-08-11': 'completed',
                '2026-08-12': 'completed',
                '2026-08-13': 'completed',
                '2026-08-14': 'completed',
                '2026-08-15': 'completed',
            }
        },
        {
            id: 2,
            name: 'Olahraga & Stretching',
            icon: '🏋️',
            color: '#10b981',
            period: '2026-08',
            monthly_target: 20,
            position: 2,
            logs: {
                '2026-08-01': 'completed',
                '2026-08-03': 'completed',
                '2026-08-05': 'completed',
                '2026-08-07': 'completed',
                '2026-08-09': 'completed',
                '2026-08-11': 'completed',
                '2026-08-13': 'completed',
                '2026-08-15': 'completed',
            }
        },
        {
            id: 3,
            name: 'Membaca Buku Non-Fiksi 20 Halaman',
            icon: '📚',
            color: '#f59e0b',
            period: '2026-08',
            monthly_target: 28,
            position: 3,
            logs: {
                '2026-08-01': 'completed',
                '2026-08-02': 'completed',
                '2026-08-04': 'completed',
                '2026-08-05': 'completed',
                '2026-08-06': 'completed',
                '2026-08-08': 'completed',
                '2026-08-10': 'completed',
                '2026-08-12': 'completed',
                '2026-08-14': 'completed',
                '2026-08-15': 'completed',
            }
        },
        {
            id: 4,
            name: 'Minum Air Putih 2.5 Liter',
            icon: '💧',
            color: '#3b82f6',
            period: '2026-08',
            monthly_target: 30,
            position: 4,
            logs: {
                '2026-08-01': 'completed',
                '2026-08-02': 'completed',
                '2026-08-03': 'completed',
                '2026-08-04': 'completed',
                '2026-08-05': 'completed',
                '2026-08-06': 'completed',
                '2026-08-07': 'completed',
                '2026-08-08': 'completed',
                '2026-08-09': 'completed',
                '2026-08-10': 'completed',
                '2026-08-11': 'completed',
                '2026-08-12': 'completed',
                '2026-08-13': 'completed',
                '2026-08-14': 'completed',
                '2026-08-15': 'completed',
            }
        }
    ]);

    const [isLoaded, setIsLoaded] = useState(false);

    // Persistence with localStorage
    useEffect(() => {
        const savedHabits = localStorage.getItem('oneformind_habits');
        if (savedHabits) {
            try {
                const parsed = JSON.parse(savedHabits);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setHabits(parsed);
                }
            } catch (e) {
                console.error('Failed to parse habits:', e);
            }
        }
        const savedMood = localStorage.getItem('oneformind_mood');
        if (savedMood) {
            setSelectedMood(savedMood);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('oneformind_habits', JSON.stringify(habits));
        }
    }, [habits, isLoaded]);

    // 4. Mood Reflection State
    const [selectedMood, setSelectedMood] = useState('happy');
    const [showMoodDropdown, setShowMoodDropdown] = useState(false);

    const moodOptions = [
        { code: 'happy', icon: '😄', label_key: 'Sangat Berenergi', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' },
        { code: 'neutral', icon: '😐', label_key: 'Biasa Saja', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
        { code: 'sad', icon: '😔', label_key: 'Lelah / Stres', color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' },
        { code: 'calm', icon: '🧘', label_key: 'Tenang & Fokus', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10' }
    ];
    const currentMoodData = moodOptions.find(m => m.code === selectedMood) || moodOptions[0];

    const handleSelectMood = (moodCode: string) => {
        setSelectedMood(moodCode);
        localStorage.setItem('oneformind_mood', moodCode);
        setShowMoodDropdown(false);
    };

    // 5. Single Habit Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formIcon, setFormIcon] = useState('🧘');
    const [formColor, setFormColor] = useState('#6366f1');
    const [formTarget, setFormTarget] = useState(25);

    // 6. Batch Habit Modal State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchRows, setBatchRows] = useState([
        { name: '', icon: '⚡', color: '#6366f1', target: 25 },
        { name: '', icon: '💧', color: '#10b981', target: 20 }
    ]);
    const [openBatchIconDropdown, setOpenBatchIconDropdown] = useState<number | null>(null);

    // 7. Delete & Copy Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);
    const [showCopyModal, setShowCopyModal] = useState(false);

    // 8. AI Neural Stacking Protocol State
    const [showAiStacking, setShowAiStacking] = useState(false);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);
    const [aiStackResult, setAiStackResult] = useState<any>(null);

    // Icon & Color Palettes (Matching Vue 1:1)
    const iconList = ['🧘', '🏋️', '📚', '💧', '🏃', '🎨', '🍳', '💻', '💤', '🧠', '🌱', '🎯', '🔥', '✨', '📝', '🎸', '🍎', '🚴'];
    const colorPalette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

    const monthNames = locale === 'id' 
        ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Compute month dates for August 2026 (31 days)
    const monthDates = Array.from({ length: 31 }, (_, i) => {
        const dayNum = i + 1;
        const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
        const dateString = `2026-08-${formattedDay}`;
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const dateObj = new Date(2026, 7, dayNum);
        const dayName = dayNames[dateObj.getDay()];
        return {
            dayNum,
            dayNumber: dayNum,
            dayName,
            dateString,
            isToday: dateString === todayStr,
            isFuture: dayNum > 15
        };
    });

    // Helper: Toggle Habit Log Status
    const toggleStatus = (habitId: number, dateString: string, forceStatus?: 'completed' | 'skipped') => {
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const currentStatus = h.logs[dateString] || 'empty';
                let nextStatus: 'completed' | 'skipped' | 'empty' = 'completed';

                if (forceStatus) {
                    nextStatus = currentStatus === forceStatus ? 'empty' : forceStatus;
                } else {
                    if (currentStatus === 'empty') nextStatus = 'completed';
                    else if (currentStatus === 'completed') nextStatus = 'empty';
                    else nextStatus = 'empty';
                }

                const updatedLogs = { ...h.logs, [dateString]: nextStatus };
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));
    };

    const getStatus = (habit: HabitItem, dateString: string) => {
        return habit.logs[dateString] || 'empty';
    };

    // Calculate processed habits data
    const processedHabits = habits.map(h => {
        const completedCount = Object.values(h.logs).filter(v => v === 'completed').length;
        const progressPercent = Math.min(100, Math.round((completedCount / h.monthly_target) * 100));

        let streak = 0;
        for (let d = 15; d >= 1; d--) {
            const dateStr = `2026-08-${d < 10 ? '0' + d : d}`;
            if (h.logs[dateStr] === 'completed') streak++;
            else break;
        }

        return {
            ...h,
            progress_count: completedCount,
            progress_percent: progressPercent,
            streak,
            is_stagnant: completedCount === 0
        };
    });

    const overallPercentage = Math.round(
        processedHabits.reduce((acc, h) => acc + h.progress_percent, 0) / (processedHabits.length || 1)
    );

    const chartData = {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
            {
                label: 'Progress',
                data: [40, 60, 45, 70, 55, 80, overallPercentage],
                borderColor: '#818cf8',
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    g.addColorStop(0, 'rgba(129,140,248,0.4)');
                    g.addColorStop(1, 'rgba(129,140,248,0)');
                    return g;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100 }
        }
    };

    const topHabit = [...processedHabits].sort((a, b) => b.progress_count - a.progress_count)[0];
    const totalCompletions = processedHabits.reduce((acc, h) => acc + h.progress_count, 0);

    // Active Streak (consecutive days with >= 1 habit completed)
    let currentStreak = 0;
    for (let d = 15; d >= 1; d--) {
        const dateStr = `2026-08-${d < 10 ? '0' + d : d}`;
        const anyDone = processedHabits.some(h => h.logs[dateStr] === 'completed');
        if (anyDone) currentStreak++;
        else break;
    }

    // Perfect Days Count (days where all habits are completed)
    let perfectDaysCount = 0;
    for (let d = 1; d <= 15; d++) {
        const dateStr = `2026-08-${d < 10 ? '0' + d : d}`;
        const allDone = processedHabits.length > 0 && processedHabits.every(h => h.logs[dateStr] === 'completed');
        if (allDone) perfectDaysCount++;
    }

    const todayCompletedCount = processedHabits.filter(h => h.logs[todayStr] === 'completed').length;
    const todayProgress = Math.round((todayCompletedCount / (processedHabits.length || 1)) * 100);

    // Form Handlers
    const openCreateModal = () => {
        setEditingHabitId(null);
        setFormName('');
        setFormIcon('🧘');
        setFormColor('#6366f1');
        setFormTarget(25);
        setShowCreateModal(true);
    };

    const editHabit = (habit: HabitItem) => {
        setEditingHabitId(habit.id);
        setFormName(habit.name);
        setFormIcon(habit.icon);
        setFormColor(habit.color);
        setFormTarget(habit.monthly_target);
        setShowCreateModal(true);
    };

    const submitSingleHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        if (editingHabitId) {
            setHabits(prev => prev.map(h => h.id === editingHabitId ? {
                ...h,
                name: formName,
                icon: formIcon,
                color: formColor,
                monthly_target: formTarget
            } : h));
        } else {
            const newHabit: HabitItem = {
                id: Date.now(),
                name: formName,
                icon: formIcon,
                color: formColor,
                period: currentMonthKey,
                monthly_target: formTarget,
                position: habits.length + 1,
                logs: {}
            };
            setHabits(prev => [...prev, newHabit]);
        }
        setShowCreateModal(false);
    };

    const confirmDelete = (habit: HabitItem) => {
        setHabitToDelete(habit);
        setShowDeleteModal(true);
    };

    const executeDelete = () => {
        if (habitToDelete) {
            setHabits(prev => prev.filter(h => h.id !== habitToDelete.id));
        }
        setShowDeleteModal(false);
        setHabitToDelete(null);
    };

    const submitBatchHabits = () => {
        const validRows = batchRows.filter(r => r.name.trim() !== '');
        if (validRows.length === 0) return;

        const newHabitsList: HabitItem[] = validRows.map((r, i) => ({
            id: Date.now() + i,
            name: r.name,
            icon: r.icon,
            color: r.color,
            period: currentMonthKey,
            monthly_target: r.target,
            position: habits.length + i + 1,
            logs: {}
        }));

        setHabits(prev => [...prev, ...newHabitsList]);
        setShowBatchModal(false);
        setBatchRows([
            { name: '', icon: '⚡', color: '#6366f1', target: 25 },
            { name: '', icon: '💧', color: '#10b981', target: 20 }
        ]);
    };

    const runAiStacking = () => {
        setAiAnalyzing(true);
        setShowAiStacking(true);
        setTimeout(() => {
            setAiAnalyzing(false);
            setAiStackResult({
                stack: 'Setelah minum air putih di pagi hari (Habit #4), saya akan langsung melakukan Meditasi Pagi (Habit #1) selama 15 menit.',
                reason: 'Mengaitkan kebiasaan minum air sebagai pengingat biologis utama (anchor trigger) akan meningkatkan tingkat penyelesaian meditasi hingga 40%.'
            });
        }, 1000);
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                
                {/* HABIT HEADER (Matching HabitHeader.vue 1:1) */}
                <div className="relative z-50 transition-all bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 duration-500">
                    <div className="w-full min-w-0 px-4 md:px-8 py-4">
                        <div className="flex flex-col items-stretch justify-between gap-4 min-w-0 md:flex-row md:items-center">
                            
                            {/* Page Title */}
                            <div className="flex items-center gap-2 w-full min-w-0 md:w-auto md:max-w-[min(100%,22rem)]">
                                <p className="shrink-0 text-[13px] font-black capitalize tracking-wide text-slate-700 dark:text-slate-300 mr-2 pr-4">
                                    Habit Tracker
                                </p>
                            </div>

                            <div className="flex min-w-0 flex-wrap items-center w-full gap-3 md:w-auto md:flex-nowrap md:justify-end">
                                
                                {/* Period Selector Button & Dropdown */}
                                <div className="relative min-w-0 flex-1 md:flex-none md:max-w-xs">
                                    <button 
                                        onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                                        className="w-full min-w-0 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-3 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all active:scale-95"
                                    >
                                        <div className="flex min-w-0 flex-1 flex-col items-start leading-none text-left">
                                            <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5">Periode Bulan</span>
                                            <span className="w-full truncate text-xs">{monthNames[selectedMonthIndex]} {selectedYear}</span>
                                        </div>
                                        <div className="p-1 bg-white dark:bg-slate-800 border shadow-sm rounded-lg border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                            <ChevronDown size={12} strokeWidth={3} className={`text-indigo-500 transition-transform duration-300 ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {isPeriodDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[60] origin-top-right">
                                            <div className="flex items-center justify-between px-2 mb-4">
                                                <button onClick={() => setSelectedYear(selectedYear - 1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600">
                                                    <ChevronLeft size={16} strokeWidth={3} />
                                                </button>
                                                <span className="text-lg font-black tracking-tighter text-slate-800 dark:text-slate-100">{selectedYear}</span>
                                                <button onClick={() => setSelectedYear(selectedYear + 1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600">
                                                    <ChevronRight size={16} strokeWidth={3} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                {monthNames.map((month, index) => (
                                                    <button 
                                                        key={month}
                                                        onClick={() => {
                                                            setSelectedMonthIndex(index);
                                                            setIsPeriodDropdownOpen(false);
                                                        }}
                                                        className={`py-3 rounded-2xl text-[10px] font-black transition-all ${
                                                            selectedMonthIndex === index
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                                                : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 dark:text-slate-400 hover:text-indigo-600'
                                                        }`}
                                                    >
                                                        {month.slice(0, 3)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Daily Progress Meter */}
                                <div className="hidden lg:flex items-center gap-3 px-4 border-l border-slate-100/80 dark:border-slate-800/80">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 leading-none mb-1 capitalize">Harian</p>
                                        <p className="text-lg font-black text-slate-700 dark:text-slate-200 leading-none">{todayProgress}%</p>
                                    </div>
                                    <div className="relative w-10 h-10">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4" />
                                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600 transition-all duration-1000" strokeWidth="4" strokeLinecap="round" style={{ strokeDasharray: `${todayProgress}, 100` }} />
                                        </svg>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={openCreateModal}
                                        className="h-[46px] shrink-0 px-5 flex items-center gap-3 text-white rounded-xl font-bold hover:-translate-y-0.5 active:translate-y-0 shadow-lg transition-all duration-300 whitespace-nowrap bg-indigo-600 shadow-indigo-100 dark:shadow-indigo-900/40 hover:bg-indigo-700"
                                    >
                                        <div className="bg-white/20 rounded-lg p-0.5 flex items-center justify-center">
                                            <Plus size={16} strokeWidth={3} />
                                        </div>
                                        <span className="hidden md:inline text-xs capitalize tracking-wide font-black">Tambah Habit</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Hint Banner */}
                        {showHint && (
                            <div className="flex items-center justify-between mt-4 p-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20">
                                <div className="flex items-center gap-6 px-2 overflow-x-auto no-scrollbar">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-[8px] rounded-md font-bold shadow-sm md:hidden px-1">Tap</span>
                                        <span className="hidden md:flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-[8px] rounded-md font-bold shadow-sm">L</span>
                                        <span className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-400 capitalize tracking-tight">
                                            <span className="md:hidden">Klik untuk Selesai</span>
                                            <span className="hidden md:inline">Klik Kiri untuk Selesai</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 border-l border-indigo-200/50 dark:border-indigo-800 pl-6">
                                        <span className="flex items-center justify-center px-1 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[8px] rounded-md font-bold border border-slate-200 dark:border-slate-700 shadow-sm md:hidden">Hold</span>
                                        <span className="hidden md:flex items-center justify-center w-5 h-5 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[8px] rounded-md font-bold border border-slate-200 dark:border-slate-700 shadow-sm">R</span>
                                        <span className="text-[10px] font-bold text-indigo-900/60 dark:text-indigo-400 capitalize tracking-tight">
                                            <span className="md:hidden">Tahan (Hold) untuk Skip</span>
                                            <span className="hidden md:inline">Klik Kanan / Hold untuk Skip</span>
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setShowHint(false)} className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-indigo-400 transition flex items-center justify-center">
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* HABIT MATRIX GRID (Matching HabitGrid.vue 1:1) */}
                <div className="w-full md:max-w-[95%] mx-auto md:px-2 pt-2 md:pt-8 pb-12">
                    
                    {/* MOBILE LAYOUT (<md) */}
                    <div className="md:hidden space-y-6">
                        <div className="relative">
                            <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth px-4 py-2">
                                {monthDates.map(day => (
                                    <button
                                        key={day.dateString}
                                        onClick={() => setSelectedMobileDate(day.dateString)}
                                        className={`flex-shrink-0 w-12 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${
                                            selectedMobileDate === day.dateString
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none scale-110'
                                                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'
                                        }`}
                                    >
                                        <span className="text-[10px] font-bold tracking-tighter opacity-80">{day.dayName}</span>
                                        <span className="text-sm font-black">{day.dayNumber}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Habit Items */}
                        <div className="space-y-3 px-4">
                            {processedHabits.map(habit => {
                                const status = getStatus(habit, selectedMobileDate);
                                return (
                                    <div
                                        key={habit.id}
                                        className={`bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all active:scale-[0.98] ${
                                            habit.is_stagnant ? 'opacity-60 grayscale-[0.4] scale-[0.97]' : ''
                                        }`}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform"
                                            style={{ backgroundColor: habit.color + '15', color: habit.color }}
                                        >
                                            {habit.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`font-bold text-sm flex items-center flex-wrap gap-1.5 ${habit.is_stagnant ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-white'}`}>
                                                    <span className="line-clamp-2 break-words leading-tight">{habit.name}</span>
                                                    {habit.is_stagnant && <span className="text-[8px] font-black bg-rose-50 text-rose-500 px-1 rounded-md">Dormant</span>}
                                                </h4>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => confirmDelete(habit)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-2">
                                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: habit.progress_percent + '%', backgroundColor: habit.color }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">{habit.progress_count}<span className="text-slate-400 font-bold">/{habit.monthly_target}</span></span>
                                                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{Math.round(habit.progress_percent)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleStatus(habit.id, selectedMobileDate)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                                                status === 'completed'
                                                    ? 'shadow-lg text-white'
                                                    : status === 'skipped'
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                                    : 'bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600'
                                            }`}
                                            style={status === 'completed' ? { backgroundColor: habit.color } : {}}
                                        >
                                            {status === 'completed' && <Check size={20} strokeWidth={4} />}
                                            {status === 'skipped' && <span className="text-xl font-black">-</span>}
                                            {status === 'empty' && <Plus size={20} strokeWidth={3} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESKTOP LAYOUT (≥md) */}
                    <div className="hidden md:block bg-white dark:bg-transparent md:rounded-[2.5rem] shadow-sm md:shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-transparent overflow-hidden relative">
                        <div className="overflow-x-auto custom-scrollbar relative select-none">
                            
                            {/* Sticky Header */}
                            <div className="sticky top-0 z-30 bg-white dark:bg-transparent border-b border-slate-100 dark:border-slate-800/50 flex shadow-sm dark:shadow-none">
                                <div className="sticky left-0 z-40 bg-white dark:bg-transparent w-72 shrink-0 border-r border-slate-100 dark:border-slate-800/50 p-4 flex items-center font-bold text-slate-400 dark:text-slate-500 text-xs capitalize shadow-[10px_0_20px_rgba(0,0,0,0.02)] dark:shadow-[10px_0_20px_rgba(0,0,0,0.2)]">
                                    <div className="w-8 shrink-0"></div>
                                    <span className="truncate">Nama Habit</span>
                                </div>
                                <div className="flex items-center px-4 py-3 gap-1.5">
                                    {monthDates.map(day => (
                                        <div key={day.dateString} className="w-8 shrink-0 flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 capitalize">{day.dayName}</span>
                                            <span className={`text-xs font-black ${day.isToday ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 rounded' : 'text-slate-600 dark:text-slate-300'}`}>
                                                {day.dayNumber}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex shrink-0 sticky right-0 z-40 bg-white dark:bg-transparent w-32 p-4 border-l border-slate-100 dark:border-slate-800/50 items-center justify-end font-bold text-slate-400 dark:text-slate-500 text-xs capitalize shadow-[-10px_0_20px_rgba(255,255,255,0.8)] dark:shadow-none">
                                    Total Log
                                </div>
                            </div>

                            {/* Habit Rows */}
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {processedHabits.map(habit => (
                                    <div key={habit.id} className="flex transition-colors duration-200 group relative bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        
                                        {/* Left Sticky Info */}
                                        <div className="sticky left-0 z-30 w-72 shrink-0 bg-white dark:bg-slate-900/40 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-r border-slate-100 dark:border-slate-800/50 p-4 flex items-center gap-3 shadow-[10px_0_20px_rgba(0,0,0,0.02)] dark:shadow-[10px_0_20px_rgba(0,0,0,0.2)]">
                                            <div className="drag-handle cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-700 hover:text-indigo-500 opacity-30 group-hover:opacity-100 transition-opacity p-1 -ml-2 shrink-0">
                                                <GripVertical size={16} />
                                            </div>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 shrink-0" style={{ color: habit.color }}>
                                                {habit.icon}
                                            </div>

                                            {/* Action Bubble (Desktop Hover) */}
                                            <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-800/95 px-1.5 py-1 rounded-full absolute right-2 top-2 shadow-xl border border-slate-200/50 dark:border-slate-700 z-50 transition-all opacity-0 scale-90 translate-x-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0">
                                                <button onClick={() => editHabit(habit)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition" title="Edit">
                                                    <Edit3 size={14} strokeWidth={2.5} />
                                                </button>
                                                <button onClick={() => confirmDelete(habit)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition" title="Hapus">
                                                    <Trash2 size={14} strokeWidth={2.5} />
                                                </button>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className={`font-bold truncate text-sm flex items-center gap-1.5 ${habit.is_stagnant ? 'text-slate-400 line-through decoration-rose-500/30' : 'text-slate-700 dark:text-slate-200'}`}>
                                                    {habit.name}
                                                    {habit.streak > 1 && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-black animate-pulse shadow-sm border border-orange-100/50 dark:border-orange-500/20">
                                                            {habit.streak} <span className="text-xs">🔥</span>
                                                        </span>
                                                    )}
                                                    {habit.is_stagnant && (
                                                        <span title="Habit ini sudah tidak dilakukan lebih dari 7 hari" className="text-[8px] font-black bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded-md cursor-help">Dormant</span>
                                                    )}
                                                </h4>
                                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-1.5 mt-0.5">
                                                    <span>🎯 Target: {habit.monthly_target} Hari</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-500" style={{ width: habit.progress_percent + '%', backgroundColor: habit.color }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Date Grid Cells */}
                                        <div className="flex items-center px-4 py-3 gap-1.5 pointer-events-auto">
                                            {monthDates.map(day => {
                                                const status = getStatus(habit, day.dateString);
                                                return (
                                                    <div key={day.dateString} className="w-8 shrink-0 flex justify-center">
                                                        <button
                                                            onClick={() => toggleStatus(habit.id, day.dateString)}
                                                            onContextMenu={(e) => {
                                                                e.preventDefault();
                                                                toggleStatus(habit.id, day.dateString, 'skipped');
                                                            }}
                                                            disabled={day.isFuture}
                                                            className={`scroll-mt-32 w-8 h-8 rounded-lg flex items-center justify-center relative outline-none transition-all duration-200 hover:scale-110 hover:z-20 active:scale-75 focus:ring-4 focus:ring-indigo-400 focus:z-30 focus:shadow-lg ${
                                                                status === 'completed'
                                                                    ? 'shadow-md text-white border-transparent z-10'
                                                                    : status === 'skipped'
                                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                                                    : day.isFuture
                                                                    ? 'bg-slate-50 dark:bg-slate-950 border-slate-50 dark:border-slate-900 opacity-30 cursor-not-allowed'
                                                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                                                            } ${day.isToday && status !== 'completed' ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}`}
                                                            style={status === 'completed' ? { backgroundColor: habit.color, boxShadow: `0 4px 12px ${habit.color}30` } : {}}
                                                        >
                                                            {status === 'completed' && <Check size={14} strokeWidth={4} className="text-white animate-in zoom-in duration-300" />}
                                                            {status === 'skipped' && <span className="text-xs font-black animate-in fade-in duration-300">-</span>}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Right Sticky Total Cell */}
                                        <div className="flex shrink-0 sticky right-0 z-30 w-32 bg-white dark:bg-slate-900/40 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-l border-slate-100 dark:border-slate-800/50 p-4 flex-col justify-center shadow-[-10px_0_20px_rgba(255,255,255,0.8)] dark:shadow-none">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-lg font-black text-slate-700 dark:text-slate-200">{habit.progress_count}</span>
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">{Math.round(habit.progress_percent)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-500" style={{ width: habit.progress_percent + '%', backgroundColor: habit.color }} />
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>



                {/* NEURAL BRIDGE COMPONENT (Matching NeuralBridge.vue 1:1) */}
                <div className="w-full md:max-w-[95%] mx-auto px-4 md:px-2 py-4">
                    <div className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                            <Sparkles size={80} />
                        </div>
                        
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-indigo-500 capitalize tracking-wide">Neural Bridge</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                </div>
                                
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "Konsistensi habit harian Anda saat ini mencapai {overallPercentage}%. Menjaga irama di sesi pagi akan memperkuat sinapsis fokus sepanjang hari."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HABIT STATISTICAL METRICS (Matching HabitStats.vue 1:1) */}
                <div className="mt-8 pb-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 px-4 md:px-0 md:max-w-[95%] mx-auto">

                        {/* Consistency Score Card */}
                        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold tracking-normal text-slate-400 block mb-1">
                                    Konsistensi Bulan Ini
                                </span>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{overallPercentage}</span>
                                    <span className="text-sm font-bold text-indigo-500 mb-1.5">%</span>
                                </div>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-24">
                                <Line data={chartData as any} options={chartOptions as any} />
                            </div>
                        </div>

                        {/* MVP Habit Card */}
                        <div className="md:col-span-3 bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            
                            {topHabit && (
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black tracking-wide text-indigo-200 block mb-3">
                                        🏆 Habit Terbaik (MVP)
                                    </span>
                                    <div className="text-3xl mb-1">{topHabit.icon}</div>
                                    <div className="text-lg font-black truncate">{topHabit.name}</div>
                                </div>
                            )}

                            {topHabit && (
                                <div className="mt-4 flex justify-between items-end relative z-10">
                                    <span className="text-[10px] font-bold text-indigo-200 leading-none">
                                        Total Selesai
                                    </span>
                                    <span className="text-2xl font-black leading-none">
                                        {topHabit.progress_count}<span className="text-sm text-indigo-200">x</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Interactive Mood Selector Button Card */}
                        <div className="md:col-span-4 relative">
                            <button
                                onClick={() => setShowMoodDropdown(!showMoodDropdown)}
                                className="w-full h-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 text-left transition hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-md"
                            >
                                <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner shrink-0 bg-slate-100 dark:bg-slate-800">
                                    {currentMoodData.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-black tracking-wide text-slate-400 block mb-1">
                                        Mood Bulan Ini
                                    </span>
                                    <div className="text-xl font-black truncate text-slate-800 dark:text-slate-100">
                                        {currentMoodData.label_key}
                                    </div>
                                </div>
                            </button>

                            {showMoodDropdown && (
                                <div className="absolute bottom-full mb-4 left-0 w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-30 grid grid-cols-2 gap-2">
                                    {moodOptions.map(m => (
                                        <button
                                            key={m.code}
                                            onClick={() => handleSelectMood(m.code)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                                                selectedMood === m.code ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30' : 'border border-transparent'
                                            }`}
                                        >
                                            <span className="text-xl">{m.icon}</span>
                                            <span className="font-bold text-[10px] truncate text-slate-600 dark:text-slate-300">{m.label_key}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Streak Widget */}
                        <div className="md:col-span-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-sm transform hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm text-orange-500 shrink-0">
                                🔥
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-wide text-orange-400 mb-1">Aktif Beruntun</div>
                                <div className="text-2xl font-black text-orange-600 dark:text-orange-400 leading-none">
                                    {currentStreak} <span className="text-sm font-bold opacity-70">Hari</span>
                                </div>
                            </div>
                        </div>

                        {/* Perfect Days Widget */}
                        <div className="md:col-span-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-sm transform hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm text-emerald-500 shrink-0">
                                🌟
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-wide text-emerald-500 mb-1">Hari Sempurna</div>
                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                    {perfectDaysCount} <span className="text-sm font-bold opacity-70">Hari</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Checkins Widget */}
                        <div className="md:col-span-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-sm transform hover:-translate-y-1 transition duration-300">
                            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm text-blue-500 shrink-0">
                                📝
                            </div>
                            <div>
                                <div className="text-[10px] font-black tracking-wide text-blue-400 mb-1">Total Eksekusi Log</div>
                                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
                                    {totalCompletions} <span className="text-sm font-bold opacity-70">Kali</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* SINGLE HABIT MODAL (Matching HabitModals.vue 1:1) */}
                {showCreateModal && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setShowCreateModal(false)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                            
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">
                                        {editingHabitId ? 'Edit Habit' : 'Tambah Habit Baru'}
                                    </h3>
                                    {!editingHabitId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setShowBatchModal(true);
                                            }}
                                            className="text-[10px] font-black tracking-tight px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition flex items-center gap-1.5 active:scale-95 w-fit border border-indigo-100 dark:border-indigo-500/30 mt-2 cursor-pointer"
                                        >
                                            <span>⚡</span> Batch Mode
                                        </button>
                                    )}
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 flex items-center justify-center transition">
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={submitSingleHabit} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nama Kebiasaan</label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="Misal: Meditasi Pagi 15 Menit..."
                                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Pilih Ikon</label>
                                    <div className="grid grid-cols-6 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 max-h-32 overflow-y-auto">
                                        {iconList.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormIcon(icon)}
                                                className={`h-10 rounded-xl text-xl flex items-center justify-center transition ${
                                                    formIcon === icon ? 'bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500 scale-105' : 'opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Warna Label</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {colorPalette.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setFormColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 border-transparent transition ${
                                                    formColor === c ? 'ring-2 ring-indigo-500 border-white scale-110' : ''
                                                }`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Bulanan</label>
                                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{formTarget} Hari / Bulan</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="31"
                                        value={formTarget}
                                        onChange={(e) => setFormTarget(Number(e.target.value))}
                                        className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {editingHabitId && (
                                        <button
                                            type="button"
                                            onClick={executeDelete}
                                            className="w-12 h-12 rounded-xl text-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center border border-rose-100 shrink-0"
                                            title="Hapus Habit"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 py-3.5 bg-indigo-600 text-white font-black text-sm rounded-2xl shadow-lg hover:bg-indigo-700 transition cursor-pointer"
                                    >
                                        {editingHabitId ? 'Update Habit' : 'Simpan Habit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div></ModalPortal>
                )}

                {/* BATCH HABIT MODAL (Matching HabitBatchModal.vue 1:1) */}
                {showBatchModal && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setShowBatchModal(false)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-0 w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden">
                            
                            {/* Modal Header */}
                            <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-20 shrink-0">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shadow-indigo-200 dark:shadow-none shrink-0 text-white">
                                        ⚡
                                    </div>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none mb-1">
                                            Batch Habit Creation
                                        </h3>
                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                            Tambah beberapa habit sekaligus dalam satu klik
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 md:gap-3">
                                    <button
                                        onClick={() => {
                                            setShowBatchModal(false);
                                            openCreateModal();
                                        }}
                                        type="button"
                                        className="hidden sm:flex text-[10px] font-black tracking-tight px-4 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all items-center gap-2"
                                    >
                                        <span>↩️</span> Single Mode
                                    </button>
                                    <button onClick={() => setShowBatchModal(false)} className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center font-bold">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50 p-4 md:p-8 space-y-4">
                                {batchRows.map((row, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group"
                                    >
                                        <div className="flex justify-between items-center mb-5">
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                                                Habit #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => setBatchRows(batchRows.filter((_, i) => i !== index))}
                                                disabled={batchRows.length <= 1}
                                                type="button"
                                                className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Col 1: Name and Target */}
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Nama Habit</label>
                                                    <input
                                                        type="text"
                                                        value={row.name}
                                                        onChange={(e) => {
                                                            const updated = [...batchRows];
                                                            updated[index].name = e.target.value;
                                                            setBatchRows(updated);
                                                        }}
                                                        placeholder="Misal: Morning Run 20 Menit..."
                                                        className="w-full text-xs font-bold h-12 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:bg-white focus:border-indigo-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Target Bulanan</label>
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="31"
                                                            value={row.target}
                                                            onChange={(e) => {
                                                                const updated = [...batchRows];
                                                                updated[index].target = Number(e.target.value);
                                                                setBatchRows(updated);
                                                            }}
                                                            className="w-full text-left text-xs font-black h-12 pl-4 pr-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 focus:bg-white focus:border-indigo-500 outline-none"
                                                        />
                                                        <span className="absolute right-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Hari</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Col 2: Icon and Color */}
                                            <div className="space-y-5">
                                                <div className="relative">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Ikon Habit</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                                        className="w-full h-12 flex items-center justify-between px-5 border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl hover:bg-white transition-all focus:border-indigo-500"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">{row.icon}</span>
                                                            <span className="text-[11px] font-bold text-slate-400">Pilih Ikon</span>
                                                        </div>
                                                        <ChevronDown size={16} className="text-slate-300" />
                                                    </button>

                                                    {openBatchIconDropdown === index && (
                                                        <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-4 grid grid-cols-5 gap-2 max-h-56 overflow-y-auto">
                                                            {iconList.map(icon => (
                                                                <button
                                                                    key={icon}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updated = [...batchRows];
                                                                        updated[index].icon = icon;
                                                                        setBatchRows(updated);
                                                                        setOpenBatchIconDropdown(null);
                                                                    }}
                                                                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl hover:bg-indigo-50 transition-all ${
                                                                        row.icon === icon ? 'bg-indigo-100 shadow-inner' : 'opacity-70'
                                                                    }`}
                                                                >
                                                                    {icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block">Warna Label</label>
                                                    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 min-h-[48px]">
                                                        {colorPalette.map(c => (
                                                            <button
                                                                key={c}
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = [...batchRows];
                                                                    updated[index].color = c;
                                                                    setBatchRows(updated);
                                                                }}
                                                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-125 shadow-sm relative"
                                                                style={{ backgroundColor: c }}
                                                            >
                                                                {row.color === c && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setBatchRows([...batchRows, { name: '', icon: '🎯', color: '#8b5cf6', target: 20 }])}
                                    type="button"
                                    className="mt-6 w-full py-4 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl text-indigo-600 dark:text-indigo-400 font-black tracking-tight text-[10px] hover:border-indigo-400 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    <span className="w-5 h-5 rounded-md bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs shadow-sm">+</span>
                                    + Tambah Baris Habit
                                </button>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 md:px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-20">
                                <div className="text-[10px] font-black text-slate-400 tracking-tight flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    Total Input: <span className="text-indigo-600 dark:text-indigo-400 text-sm font-black">{batchRows.length}</span>
                                </div>
                                
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button onClick={() => setShowBatchModal(false)} className="px-5 py-3.5 rounded-xl text-xs font-black text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition">
                                        Batal
                                    </button>
                                    
                                    <button onClick={submitBatchHabits} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xl shadow-indigo-200 dark:shadow-none transition active:scale-95">
                                        Simpan Semua Habit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div></ModalPortal>
                )}

                {/* COPY HABIT MODAL (Matching HabitModals.vue 1:1) */}
                {showCopyModal && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setShowCopyModal(false)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-indigo-100">📂</div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Salin Habit Bulan Lalu?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                Salin seluruh daftar habit aktif dari bulan sebelumnya ke periode {monthNames[selectedMonthIndex]} {selectedYear}?
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCopyModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition">Batal</button>
                                <button onClick={() => setShowCopyModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition">Salin Sekarang</button>
                            </div>
                        </div>
                    </div></ModalPortal>
                )}

                {/* DELETE CONFIRMATION MODAL (Matching HabitModals.vue 1:1) */}
                {showDeleteModal && habitToDelete && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setShowDeleteModal(false)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-rose-100">🗑️</div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Hapus Habit Ini?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                Kebiasaan <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{habitToDelete.name}</span> dan seluruh riwayat catatannya akan dihapus permanen.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition">Batal</button>
                                <button onClick={executeDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 dark:shadow-none transition">Hapus Permanen</button>
                            </div>
                        </div>
                    </div></ModalPortal>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
