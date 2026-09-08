'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import ModalPortal from '@/components/ModalPortal';
import dynamic from 'next/dynamic';

const HabitTrendChart = dynamic(() => import('./components/HabitTrendChart'), { ssr: false });
const HabitDetailModal = dynamic(() => import('./components/HabitDetailModal'), { ssr: false });
const HabitTimerModal = dynamic(() => import('./components/HabitTimerModal'), { ssr: false });
const HabitNoteModal = dynamic(() => import('./components/HabitNoteModal'), { ssr: false });

import {
    Plus,
    Minus,
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
    ArrowRight,
    Volume2,
    VolumeX,
    BarChart2,
    Play,
    MessageSquare,
    Coffee,
    ShieldCheck,
    Clock,
    Target,
    Activity,
    Layers
} from 'lucide-react';

import {
    playCheckSound,
    playUncheckSound,
    playTriumphSound,
    triggerConfetti,
    isSoundEnabled,
    setSoundEnabled
} from '@/lib/habitAudio';

import { HabitItem } from './components/HabitDetailModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HabitsClient({ initialDateStr, initialHabits }: { initialDateStr: string; initialHabits: any[] }) {
    usePageTitle('Habits Tracker');
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    // 1. Date & Period State
    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = String(todayObj.getMonth() + 1).padStart(2, '0');
    const todayDay = String(todayObj.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
    const initialMonthKey = `${todayYear}-${todayMonth}`;

    const [currentMonthKey, setCurrentMonthKey] = useState(initialMonthKey);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(todayYear);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(todayObj.getMonth());
    const [showHint, setShowHint] = useState(true);

    // Audio sound toggle state
    const [soundActive, setSoundActive] = useState(true);
    useEffect(() => {
        setSoundActive(isSoundEnabled());
    }, []);

    const toggleSound = () => {
        const next = !soundActive;
        setSoundActive(next);
        setSoundEnabled(next);
    };

    // Filter by Time of Day / Type
    const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'quit'>('all');

    // Sync selected year/month to currentMonthKey so SWR fetches new data
    useEffect(() => {
        const newKey = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
        setCurrentMonthKey(newKey);
    }, [selectedYear, selectedMonthIndex]);

    // 2. Mobile Date Selector Strip State
    const [selectedMobileDate, setSelectedMobileDate] = useState(todayStr);

    // 3. Modals State
    const [detailModalHabit, setDetailModalHabit] = useState<HabitItem | null>(null);
    const [timerModalHabit, setTimerModalHabit] = useState<HabitItem | null>(null);
    const [noteModalData, setNoteModalData] = useState<{ habit: HabitItem; dateStr: string; notes: string } | null>(null);

    // Numeric Quick Adjust Popover State
    const [numericPopover, setNumericPopover] = useState<{
        habitId: number;
        dateStr: string;
        currentVal: number;
        targetVal: number;
        unit: string;
    } | null>(null);

    // 4. Habits Main State (Fetching & Parsing)
    const { data: fetchedHabits, mutate: mutateHabits } = useSWR(`/api/habits?period=${currentMonthKey}`, fetcher, {
        keepPreviousData: true,
    });

    const parsedHabits = useMemo(() => {
        if (!fetchedHabits || !Array.isArray(fetchedHabits)) return null;
        return fetchedHabits.map((h: any): HabitItem => {
            // Parse metadata from status column if stored as JSON
            let extraMeta: any = {};
            if (h.status && h.status.startsWith('{')) {
                try {
                    extraMeta = JSON.parse(h.status);
                } catch {}
            }

            const habitType = extraMeta.habitType || (h.name.toLowerCase().includes('berhenti') || h.name.toLowerCase().includes('quit') || h.name.toLowerCase().includes('stop') ? 'negative' : 'positive');
            const measurementType = extraMeta.measurementType || (extraMeta.targetValue ? 'numeric' : 'boolean');
            const unit = extraMeta.unit || 'x';
            const targetValue = extraMeta.targetValue || (measurementType === 'numeric' ? 10 : 1);
            const frequencyType = extraMeta.frequencyType || 'daily';
            const frequencyDays = extraMeta.frequencyDays || [0, 1, 2, 3, 4, 5, 6];
            const frequencyCount = extraMeta.frequencyCount || 7;
            const timeOfDay = extraMeta.timeOfDay || 'anytime';

            const logsMap: Record<string, { status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest'; value?: number; notes?: string }> = {};
            if (h.logs) {
                h.logs.forEach((log: any) => {
                    const dateStr = new Date(log.date).toISOString().split('T')[0];
                    let logNotes = log.notes || '';
                    let logVal: number | undefined = undefined;

                    // Parse JSON notes if it contains value
                    if (logNotes && logNotes.startsWith('{')) {
                        try {
                            const parsedNote = JSON.parse(logNotes);
                            logVal = parsedNote.val;
                            logNotes = parsedNote.note || '';
                        } catch {}
                    }

                    logsMap[dateStr] = {
                        status: log.status as any,
                        value: logVal,
                        notes: logNotes
                    };
                });
            }

            return {
                id: h.id,
                name: h.name,
                icon: h.icon || '🎯',
                color: h.color || '#6366f1',
                period: h.period,
                monthlyTarget: h.monthlyTarget || 25,
                position: h.position || 0,
                status: h.status,
                habitType,
                measurementType,
                unit,
                targetValue,
                frequencyType,
                frequencyDays,
                frequencyCount,
                timeOfDay,
                logs: logsMap
            };
        });
    }, [fetchedHabits]);

    const [habits, setHabits] = useState<HabitItem[]>(parsedHabits ?? []);
    const [isLoaded, setIsLoaded] = useState(parsedHabits !== null);

    useEffect(() => {
        if (parsedHabits !== null) {
            setHabits(parsedHabits);
            setIsLoaded(true);
        }
    }, [parsedHabits]);

    useEffect(() => {
        if (currentMonthKey !== initialMonthKey) {
            setSelectedMobileDate(`${currentMonthKey}-01`);
        } else {
            setSelectedMobileDate(todayStr);
        }

        const fetchUserMood = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    if (data.settings?.currentMood) {
                        setSelectedMood(data.settings.currentMood);
                    }
                }
            } catch (e) {}
        };
        fetchUserMood();
    }, [currentMonthKey]);

    // 5. Mood Reflection State
    const [selectedMood, setSelectedMood] = useState('happy');
    const [showMoodDropdown, setShowMoodDropdown] = useState(false);

    const moodOptions = [
        { code: 'happy', icon: '😄', label_key: isIndo ? 'Sangat Berenergi' : 'High Energy', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' },
        { code: 'neutral', icon: '😐', label_key: isIndo ? 'Biasa Saja' : 'Neutral', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
        { code: 'sad', icon: '😔', label_key: isIndo ? 'Lelah / Stres' : 'Fatigued / Stressed', color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' },
        { code: 'calm', icon: '🧘', label_key: isIndo ? 'Tenang & Fokus' : 'Calm & Focused', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10' }
    ];
    const currentMoodData = moodOptions.find(m => m.code === selectedMood) || moodOptions[0];

    const handleSelectMood = async (moodCode: string) => {
        setSelectedMood(moodCode);
        setShowMoodDropdown(false);
        try {
            const userRes = await fetch('/api/user');
            if (userRes.ok) {
                const userData = await userRes.json();
                const newSettings = { ...userData.settings, currentMood: moodCode };
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings: newSettings })
                });
            }
        } catch (error) {
            console.error('Failed to save user mood', error);
        }
    };

    // 6. Single Habit Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formIcon, setFormIcon] = useState('🧘');
    const [formColor, setFormColor] = useState('#6366f1');
    const [formTarget, setFormTarget] = useState(25);
    const [formType, setFormType] = useState<'positive' | 'negative'>('positive');
    const [formMeasure, setFormMeasure] = useState<'boolean' | 'numeric'>('boolean');
    const [formUnit, setFormUnit] = useState('ml');
    const [formTargetValue, setFormTargetValue] = useState(2000);
    const [formFreqType, setFormFreqType] = useState<'daily' | 'weekly_days'>('daily');
    const [formFreqDays, setFormFreqDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
    const [formTimeOfDay, setFormTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

    // 7. Batch Habit Modal State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchRows, setBatchRows] = useState([
        { name: '', icon: '⚡', color: '#6366f1', target: 25, timeOfDay: 'morning' as const },
        { name: '', icon: '💧', color: '#10b981', target: 25, timeOfDay: 'morning' as const }
    ]);
    const [openBatchIconDropdown, setOpenBatchIconDropdown] = useState<number | null>(null);

    // 8. Delete & Copy Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

    // Palettes
    const iconList = ['🧘', '🏋️', '📚', '💧', '🏃', '🎨', '🍳', '💻', '💤', '🧠', '🌱', '🎯', '🔥', '✨', '📝', '🎸', '🍎', '🚴', '💊', '🚭', '☕', '🚶'];
    const colorPalette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#06b6d4'];

    const monthNames = isIndo
        ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Compute month dates dynamically from currentMonthKey
    const [mkYear, mkMonth] = currentMonthKey.split('-').map(Number);
    const daysInCurrentMonth = new Date(mkYear, mkMonth, 0).getDate();
    const currentTodayDay = todayObj.getDate();
    const monthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => {
        const dayNum = i + 1;
        const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
        const dateString = `${mkYear}-${String(mkMonth).padStart(2, '0')}-${formattedDay}`;
        const dayNames = isIndo ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dateObj = new Date(mkYear, mkMonth - 1, dayNum);
        const dayIndex = dateObj.getDay();
        const dayName = dayNames[dayIndex];
        return {
            dayNum,
            dayNumber: dayNum,
            dayName,
            dayIndex,
            dateString,
            isToday: dateString === todayStr,
            isFuture: currentMonthKey === initialMonthKey ? dayNum > currentTodayDay : (currentMonthKey > initialMonthKey)
        };
    });

    // Helper: Determine habit day status (scheduled vs rest vs completed vs relapse)
    const getHabitDayInfo = (habit: HabitItem, day: typeof monthDates[0]) => {
        const isScheduled = habit.frequencyType !== 'weekly_days' || (habit.frequencyDays && habit.frequencyDays.includes(day.dayIndex));
        const log = habit.logs[day.dateString];
        const rawStatus = log?.status || 'empty';
        const value = log?.value;
        const notes = log?.notes;

        let status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest' = rawStatus;

        if (habit.habitType === 'negative') {
            // For quit habit, if not relapse, past and today are clean by default
            if (rawStatus === 'relapse') {
                status = 'relapse';
            } else if (!day.isFuture) {
                status = 'completed'; // Clean
            }
        } else {
            if (!isScheduled && rawStatus === 'empty') {
                status = 'rest';
            }
        }

        return { status, isScheduled, value, notes, hasNote: Boolean(notes && notes.length > 0) };
    };

    // Toggle Habit Log Status
    const toggleStatus = async (habitId: number, dateString: string, forceStatus?: 'completed' | 'skipped' | 'relapse') => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const currentLog = targetHabit.logs[dateString];
        const currentStatus = currentLog?.status || 'empty';
        let nextStatus: 'completed' | 'skipped' | 'empty' | 'relapse' = 'completed';

        if (targetHabit.habitType === 'negative') {
            // Quit habit toggle: Clean -> Relapse -> Clean
            nextStatus = currentStatus === 'relapse' ? 'empty' : 'relapse';
            if (nextStatus === 'relapse') {
                playUncheckSound();
            } else {
                playCheckSound();
            }
        } else {
            if (forceStatus) {
                nextStatus = currentStatus === forceStatus ? 'empty' : forceStatus;
            } else {
                if (currentStatus === 'empty' || currentStatus === 'skipped') {
                    nextStatus = 'completed';
                    playCheckSound();
                } else {
                    nextStatus = 'empty';
                    playUncheckSound();
                }
            }
        }

        // Optimistic UI update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const updatedLogs = {
                    ...h.logs,
                    [dateString]: {
                        status: nextStatus,
                        value: currentLog?.value,
                        notes: currentLog?.notes
                    }
                };
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        // API Call
        try {
            const notePayload = currentLog?.notes ? currentLog.notes : undefined;
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateString, status: nextStatus, notes: notePayload })
            });
        } catch (e) {
            console.error('Failed to toggle habit log', e);
        }
    };

    // Save Contextual Micro-Note
    const handleSaveNote = async (habitId: number, dateStr: string, noteText: string) => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const currentLog = targetHabit.logs[dateStr];
        const currentStatus = currentLog?.status || (targetHabit.habitType === 'negative' ? 'completed' : 'empty');

        // Optimistic update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const updatedLogs = {
                    ...h.logs,
                    [dateStr]: {
                        status: currentStatus,
                        value: currentLog?.value,
                        notes: noteText
                    }
                };
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: currentStatus,
                    notes: noteText
                })
            });
        } catch (e) {
            console.error('Failed to save habit note', e);
        }
    };

    // Adjust Numeric Value for Quantitative Habits
    const handleUpdateNumericValue = async (habitId: number, dateStr: string, newValue: number) => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const targetVal = targetHabit.targetValue || 10;
        const currentLog = targetHabit.logs[dateStr];
        const isDone = newValue >= targetVal;
        const nextStatus: 'completed' | 'empty' = isDone ? 'completed' : 'empty';

        if (isDone && currentLog?.status !== 'completed') {
            playCheckSound();
        }

        // Optimistic update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const updatedLogs = {
                    ...h.logs,
                    [dateStr]: {
                        status: nextStatus,
                        value: newValue,
                        notes: currentLog?.notes
                    }
                };
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        // Encode value into notes or payload
        try {
            const noteObj = { val: newValue, note: currentLog?.notes || '' };
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: nextStatus,
                    notes: JSON.stringify(noteObj)
                })
            });
        } catch (e) {
            console.error('Failed to update numeric habit log', e);
        }

        setNumericPopover(null);
    };

    // Calculate processed habits with Loop Habit Strength and Rest-Day Resilient Streaks
    const processedHabits = useMemo(() => {
        const todayDayNum = mkYear === todayYear && mkMonth === parseInt(todayMonth) ? parseInt(todayDay) : daysInCurrentMonth;

        return habits.map(h => {
            let completedCount = 0;
            let scheduledDaysCount = 0;

            monthDates.forEach(day => {
                const info = getHabitDayInfo(h, day);
                if (info.isScheduled) {
                    scheduledDaysCount++;
                    if (info.status === 'completed') {
                        completedCount++;
                    }
                }
            });

            const effectiveTarget = h.frequencyType === 'weekly_days'
                ? scheduledDaysCount
                : h.monthlyTarget;
            const progressPercent = Math.min(100, Math.round((completedCount / (effectiveTarget || 1)) * 100));

            // 1. Calculate Active Streak (Rest Day Resilient)
            let streak = 0;
            let bestStreak = 0;
            let tempStreak = 0;

            for (let d = 1; d <= todayDayNum; d++) {
                const dayObj = monthDates[d - 1];
                if (!dayObj) continue;
                const info = getHabitDayInfo(h, dayObj);

                if (h.habitType === 'negative') {
                    if (info.status !== 'relapse') {
                        tempStreak++;
                        if (tempStreak > bestStreak) bestStreak = tempStreak;
                    } else {
                        tempStreak = 0;
                    }
                } else {
                    if (info.status === 'completed') {
                        tempStreak++;
                        if (tempStreak > bestStreak) bestStreak = tempStreak;
                    } else if (info.status === 'rest') {
                        // Rest day does NOT break streak!
                        continue;
                    } else {
                        tempStreak = 0;
                    }
                }
            }

            // Streak counting backwards from today
            for (let d = todayDayNum; d >= 1; d--) {
                const dayObj = monthDates[d - 1];
                if (!dayObj) continue;
                const info = getHabitDayInfo(h, dayObj);

                if (h.habitType === 'negative') {
                    if (info.status !== 'relapse') streak++;
                    else break;
                } else {
                    if (info.status === 'completed') {
                        streak++;
                    } else if (info.status === 'rest') {
                        // Keep walking past rest days
                        continue;
                    } else {
                        break;
                    }
                }
            }

            // 2. Calculate Loop Habit Strength Index (Exponential Smoothing)
            let strength = 0.5; // Starts at 50%
            for (let d = 1; d <= todayDayNum; d++) {
                const dayObj = monthDates[d - 1];
                if (!dayObj) continue;
                const info = getHabitDayInfo(h, dayObj);

                if (info.status === 'rest') {
                    // Carry over previous strength without penalty
                    continue;
                } else if (info.status === 'completed') {
                    strength = strength * 0.95 + 1.0 * 0.05;
                } else if (info.status === 'relapse' || info.status === 'empty' || info.status === 'skipped') {
                    strength = strength * 0.95 + 0.0 * 0.05;
                }
            }
            const habitStrength = Math.round(strength * 100);

            return {
                ...h,
                progress_count: completedCount,
                progress_percent: progressPercent,
                streak,
                best_streak: Math.max(bestStreak, streak),
                habit_strength: habitStrength,
                is_stagnant: completedCount === 0 && todayDayNum > 7
            };
        });
    }, [habits, monthDates, mkYear, mkMonth, todayYear, todayMonth, todayDay, daysInCurrentMonth]);

    // Filtered habits by time of day or quit type
    const filteredHabits = useMemo(() => {
        if (activeFilter === 'all') return processedHabits;
        if (activeFilter === 'quit') return processedHabits.filter(h => h.habitType === 'negative');
        return processedHabits.filter(h => h.timeOfDay === activeFilter);
    }, [processedHabits, activeFilter]);

    const overallPercentage = Math.round(
        processedHabits.reduce((acc, h) => acc + (h.progress_percent || 0), 0) / (processedHabits.length || 1)
    );

    const topHabit = [...processedHabits].sort((a, b) => (b.progress_count || 0) - (a.progress_count || 0))[0];
    const totalCompletions = processedHabits.reduce((acc, h) => acc + (h.progress_count || 0), 0);

    // Active Streak (consecutive days with >= 1 habit completed)
    let currentStreak = 0;
    const todayDayNumForStreak = mkYear === todayYear && mkMonth === parseInt(todayMonth) ? parseInt(todayDay) : daysInCurrentMonth;
    for (let d = todayDayNumForStreak; d >= 1; d--) {
        const dayObj = monthDates[d - 1];
        if (!dayObj) continue;
        const anyDone = processedHabits.some(h => getHabitDayInfo(h, dayObj).status === 'completed');
        if (anyDone) currentStreak++;
        else break;
    }

    // Perfect Days Count
    let perfectDaysCount = 0;
    for (let d = 1; d <= todayDayNumForStreak; d++) {
        const dayObj = monthDates[d - 1];
        if (!dayObj) continue;
        const allDone = processedHabits.length > 0 && processedHabits.every(h => {
            const info = getHabitDayInfo(h, dayObj);
            return info.status === 'completed' || info.status === 'rest';
        });
        if (allDone) perfectDaysCount++;
    }

    // Today Progress
    const todayObjInfo = monthDates.find(d => d.dateString === todayStr);
    const todayScheduledHabits = todayObjInfo ? processedHabits.filter(h => getHabitDayInfo(h, todayObjInfo).isScheduled) : processedHabits;
    const todayCompletedCount = todayObjInfo
        ? todayScheduledHabits.filter(h => getHabitDayInfo(h, todayObjInfo).status === 'completed').length
        : 0;
    const todayProgress = Math.round((todayCompletedCount / (todayScheduledHabits.length || 1)) * 100);

    // Trigger celebration when today hits 100%
    useEffect(() => {
        if (todayProgress === 100 && todayScheduledHabits.length > 0 && isLoaded) {
            playTriumphSound();
            triggerConfetti();
        }
    }, [todayProgress, todayScheduledHabits.length, isLoaded]);

    // Modal Form Handlers
    const openCreateModal = () => {
        setEditingHabitId(null);
        setFormName('');
        setFormIcon('🧘');
        setFormColor('#6366f1');
        setFormTarget(25);
        setFormType('positive');
        setFormMeasure('boolean');
        setFormUnit('ml');
        setFormTargetValue(2000);
        setFormFreqType('daily');
        setFormFreqDays([1, 2, 3, 4, 5]);
        setFormTimeOfDay('morning');
        setShowCreateModal(true);
    };

    const editHabit = (habit: HabitItem) => {
        setEditingHabitId(habit.id);
        setFormName(habit.name);
        setFormIcon(habit.icon);
        setFormColor(habit.color);
        setFormTarget(habit.monthlyTarget);
        setFormType(habit.habitType || 'positive');
        setFormMeasure(habit.measurementType || 'boolean');
        setFormUnit(habit.unit || 'ml');
        setFormTargetValue(habit.targetValue || 2000);
        setFormFreqType((habit.frequencyType as any) || 'daily');
        setFormFreqDays(habit.frequencyDays || [1, 2, 3, 4, 5]);
        setFormTimeOfDay(habit.timeOfDay || 'morning');
        setShowCreateModal(true);
    };

    const submitSingleHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        const metadata = {
            habitType: formType,
            measurementType: formMeasure,
            unit: formUnit,
            targetValue: formTargetValue,
            frequencyType: formFreqType,
            frequencyDays: formFreqDays,
            timeOfDay: formTimeOfDay
        };

        const statusPayload = JSON.stringify(metadata);

        try {
            if (editingHabitId) {
                // OPTIMISTIC UPDATE
                setHabits(prev => prev.map(h => h.id === editingHabitId ? {
                    ...h,
                    name: formName,
                    icon: formIcon,
                    color: formColor,
                    monthlyTarget: formTarget,
                    habitType: formType,
                    measurementType: formMeasure,
                    unit: formUnit,
                    targetValue: formTargetValue,
                    frequencyType: formFreqType,
                    frequencyDays: formFreqDays,
                    timeOfDay: formTimeOfDay,
                    status: statusPayload
                } : h));

                fetch(`/api/habits/${editingHabitId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formName,
                        icon: formIcon,
                        color: formColor,
                        monthlyTarget: formTarget,
                        status: statusPayload
                    })
                }).catch(e => console.error('Failed to update habit', e));
            } else {
                // OPTIMISTIC CREATE
                const tempId = Date.now();
                const newHabit: HabitItem = {
                    id: tempId,
                    name: formName,
                    icon: formIcon,
                    color: formColor,
                    period: currentMonthKey,
                    monthlyTarget: formTarget,
                    position: habits.length > 0 ? Math.max(...habits.map(h => h.position)) + 1 : 1,
                    habitType: formType,
                    measurementType: formMeasure,
                    unit: formUnit,
                    targetValue: formTargetValue,
                    frequencyType: formFreqType,
                    frequencyDays: formFreqDays,
                    timeOfDay: formTimeOfDay,
                    status: statusPayload,
                    logs: {}
                };
                setHabits(prev => [...prev, newHabit]);

                fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formName,
                        icon: formIcon,
                        color: formColor,
                        period: currentMonthKey,
                        monthlyTarget: formTarget,
                        status: statusPayload
                    })
                })
                .then(res => res.json())
                .then(realHabit => {
                    setHabits(prev => prev.map(h => h.id === tempId ? { ...newHabit, id: realHabit.id } : h));
                })
                .catch(e => {
                    console.error('Failed to create habit', e);
                    setHabits(prev => prev.filter(h => h.id !== tempId));
                });
            }
        } catch (error) {
            console.error('Failed to submit habit', error);
        }
        setShowCreateModal(false);
    };

    const confirmDelete = (habit: HabitItem) => {
        setHabitToDelete(habit);
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        if (habitToDelete) {
            const targetId = habitToDelete.id;
            setHabits(prev => prev.filter(h => h.id !== targetId));
            fetch(`/api/habits/${targetId}`, { method: 'DELETE' }).catch(error => {
                console.error('Failed to delete habit', error);
            });
        }
        setShowDeleteModal(false);
        setHabitToDelete(null);
    };

    const submitBatchHabits = async () => {
        const validRows = batchRows.filter(r => r.name.trim() !== '');
        if (validRows.length === 0) return;

        const tempHabits: HabitItem[] = validRows.map((r, i) => {
            const meta = { habitType: 'positive', measurementType: 'boolean', timeOfDay: r.timeOfDay, frequencyType: 'daily' };
            return {
                id: Date.now() + i,
                name: r.name,
                icon: r.icon,
                color: r.color,
                period: currentMonthKey,
                monthlyTarget: r.target,
                position: (habits.length > 0 ? Math.max(...habits.map(h => h.position)) : 0) + i + 1,
                timeOfDay: r.timeOfDay,
                status: JSON.stringify(meta),
                logs: {}
            };
        });

        setHabits(prev => [...prev, ...tempHabits]);

        validRows.forEach(async (r, i) => {
            try {
                const meta = { habitType: 'positive', measurementType: 'boolean', timeOfDay: r.timeOfDay, frequencyType: 'daily' };
                const res = await fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: r.name,
                        icon: r.icon,
                        color: r.color,
                        period: currentMonthKey,
                        monthlyTarget: r.target,
                        status: JSON.stringify(meta)
                    })
                });
                if (res.ok) {
                    const realHabit = await res.json();
                    setHabits(prev => prev.map(h => h.id === tempHabits[i].id ? { ...tempHabits[i], id: realHabit.id } : h));
                }
            } catch (e) {
                console.error('Failed to submit batch habit', e);
            }
        });

        setShowBatchModal(false);
        setBatchRows([
            { name: '', icon: '⚡', color: '#6366f1', target: 25, timeOfDay: 'morning' },
            { name: '', icon: '💧', color: '#10b981', target: 25, timeOfDay: 'morning' }
        ]);
    };

    const handleCopyPreviousHabits = async () => {
        try {
            const res = await fetch(`/api/habits?action=copy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetPeriod: currentMonthKey })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                mutateHabits();
                alert(isIndo ? `Berhasil menyalin ${data.copied_count} habit dari bulan lalu!` : `Successfully copied ${data.copied_count} habits from last month!`);
            } else {
                alert(data.error || (isIndo ? 'Gagal menyalin habit dari bulan lalu' : 'Failed to copy habits'));
            }
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                
                {/* HABIT HEADER */}
                <div className="relative z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-all duration-500">
                    <div className="w-full px-4 md:px-8 py-4">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                            
                            {/* Page Title & Time of Day Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-800">
                                    <p className="text-[13px] font-black tracking-wide text-slate-800 dark:text-slate-200">
                                        Habit Tracker
                                    </p>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 border border-indigo-100/50">
                                        Pro OS
                                    </span>
                                </div>

                                {/* Filter Pills */}
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeFilter === 'all'
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {t('habits_filter_all') || 'Semua'} ({processedHabits.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('morning')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeFilter === 'morning'
                                                ? 'bg-amber-500 text-white shadow-sm'
                                                : 'text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                        }`}
                                    >
                                        🌅 {isIndo ? 'Pagi' : 'Morning'}
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('afternoon')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeFilter === 'afternoon'
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                                        }`}
                                    >
                                        ☀️ {isIndo ? 'Siang' : 'Afternoon'}
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('evening')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeFilter === 'evening'
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                                        }`}
                                    >
                                        🌙 {isIndo ? 'Malam' : 'Evening'}
                                    </button>
                                    <button
                                        onClick={() => setActiveFilter('quit')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                            activeFilter === 'quit'
                                                ? 'bg-rose-500 text-white shadow-sm'
                                                : 'text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                        }`}
                                    >
                                        🛡️ {isIndo ? 'Bebas Kebiasaan' : 'Quit Habits'}
                                    </button>
                                </div>
                            </div>

                            {/* Right Controls: Period, Sound, Today Meter, Add Button */}
                            <div className="flex flex-wrap items-center gap-3">
                                
                                {/* Sound Toggle */}
                                <button
                                    onClick={toggleSound}
                                    className={`p-2.5 rounded-xl border transition-all ${
                                        soundActive
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                                    }`}
                                    title={soundActive ? (isIndo ? 'Suara Dopamine Aktif' : 'Sound Effects ON') : (isIndo ? 'Suara Hening' : 'Sound Effects Muted')}
                                >
                                    {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                </button>

                                {/* Period Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                                        className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-3 pr-2.5 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-300 transition-all text-xs"
                                    >
                                        <div className="flex flex-col text-left leading-none">
                                            <span className="text-[9px] text-slate-400">{isIndo ? 'Periode' : 'Period'}</span>
                                            <span className="font-black">{monthNames[selectedMonthIndex]} {selectedYear}</span>
                                        </div>
                                        <ChevronDown size={12} className={`text-indigo-500 transition-transform ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isPeriodDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[60]">
                                            <div className="flex items-center justify-between mb-4">
                                                <button onClick={() => setSelectedYear(selectedYear - 1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <span className="text-lg font-black text-slate-800 dark:text-slate-100">{selectedYear}</span>
                                                <button onClick={() => setSelectedYear(selectedYear + 1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
                                                    <ChevronRight size={16} />
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
                                                        className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                                                            selectedMonthIndex === index
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500'
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
                                <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 leading-none mb-0.5">{isIndo ? 'Hari Ini' : 'Today'}</p>
                                        <p className="text-base font-black text-slate-700 dark:text-slate-200 leading-none">{todayProgress}%</p>
                                    </div>
                                    <div className="relative w-9 h-9">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="3.5" />
                                            <circle
                                                cx="18"
                                                cy="18"
                                                r="15"
                                                fill="none"
                                                className="stroke-indigo-600 transition-all duration-700"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                style={{ strokeDasharray: `${todayProgress}, 100` }}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Add Habit Button */}
                                <button
                                    onClick={openCreateModal}
                                    className="px-4 py-2.5 flex items-center gap-2 text-white rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 text-xs"
                                >
                                    <Plus size={15} strokeWidth={3} />
                                    <span className="font-black">{t('habits_add_btn') || 'Tambah Habit'}</span>
                                </button>
                            </div>

                        </div>

                        {/* Hint Banner */}
                        {showHint && (
                            <div className="flex items-center justify-between mt-3 p-2 bg-indigo-50/60 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/60 dark:border-indigo-500/20">
                                <div className="flex items-center gap-6 px-2 overflow-x-auto no-scrollbar text-[10px] font-bold text-indigo-950/70 dark:text-indigo-300">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-4 h-4 bg-indigo-600 text-white rounded-md flex items-center justify-center text-[8px] font-black">✓</span>
                                        <span>{isIndo ? 'Klik kiri untuk centang' : 'Left click to complete'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 border-l border-indigo-200 dark:border-indigo-800 pl-6">
                                        <span className="w-4 h-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md flex items-center justify-center text-[8px] font-black">☕</span>
                                        <span>{isIndo ? 'Hari istirahat terjaga (Rest Day)' : 'Rest days protect streaks'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 border-l border-indigo-200 dark:border-indigo-800 pl-6">
                                        <span className="w-4 h-4 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-md flex items-center justify-center text-[8px] font-black">•</span>
                                        <span>{isIndo ? 'Klik titik untuk catatan harian' : 'Click dot for micro-notes'}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowHint(false)} className="p-1 text-indigo-400 hover:text-indigo-600">
                                    <X size={13} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* HABIT MATRIX GRID */}
                <div className="w-full md:max-w-[96%] mx-auto md:px-2 pt-2 md:pt-6 pb-12">
                    {filteredHabits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 mx-4 md:mx-0">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center text-3xl mb-4 text-indigo-500">
                                ✨
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                                {activeFilter === 'all' 
                                    ? (t('habits_empty_title') || 'Belum Ada Habit') 
                                    : (isIndo ? 'Tidak Ada Habit di Kategori Ini' : 'No Habits in this Filter')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto mb-6">
                                {isIndo ? 'Mulai bangun rutinitas positif Anda hari ini atau salin dari bulan sebelumnya.' : 'Start building positive routines today or copy from last month.'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={openCreateModal}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={15} strokeWidth={3} />
                                    <span>{t('habits_add_btn') || 'Tambah Habit'}</span>
                                </button>
                                <button
                                    onClick={handleCopyPreviousHabits}
                                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl hover:bg-slate-200 transition active:scale-95 flex items-center gap-2"
                                >
                                    <ArrowRight size={15} strokeWidth={3} />
                                    <span>{isIndo ? 'Salin dari Bulan Lalu' : 'Copy from Last Month'}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* MOBILE LAYOUT (<md) */}
                            <div className="md:hidden space-y-4">
                                
                                {/* Date Strip */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
                                    {monthDates.map(day => (
                                        <button
                                            key={day.dateString}
                                            onClick={() => setSelectedMobileDate(day.dateString)}
                                            className={`flex-shrink-0 w-12 py-2.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                                                selectedMobileDate === day.dateString
                                                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                                                    : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                                            }`}
                                        >
                                            <span className="text-[9px] font-bold opacity-80">{day.dayName}</span>
                                            <span className="text-sm font-black">{day.dayNumber}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Habit Cards */}
                                <div className="space-y-3 px-4">
                                    {filteredHabits.map(habit => {
                                        const selectedDayObj = monthDates.find(d => d.dateString === selectedMobileDate) || monthDates[0];
                                        const dayInfo = getHabitDayInfo(habit, selectedDayObj);
                                        const isDone = dayInfo.status === 'completed';
                                        const isRelapse = dayInfo.status === 'relapse';
                                        const isRest = dayInfo.status === 'rest';

                                        return (
                                            <div
                                                key={habit.id}
                                                className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all"
                                            >
                                                {/* Icon */}
                                                <div
                                                    onClick={() => setDetailModalHabit(habit)}
                                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 cursor-pointer"
                                                    style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                                                >
                                                    {habit.icon}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0" onClick={() => setDetailModalHabit(habit)}>
                                                    <div className="flex items-center justify-between gap-1">
                                                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                                                            {habit.name}
                                                        </h4>
                                                        {habit.streak > 1 && (
                                                            <span className="text-[9px] font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                                                {habit.streak} 🔥
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between gap-2 mt-2">
                                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{ width: `${habit.progress_percent}%`, backgroundColor: habit.color }}
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-500">
                                                            {habit.progress_count}/{habit.monthlyTarget}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {/* Timer Trigger */}
                                                    {(habit.unit === 'min' || habit.unit === 'menit' || habit.name.toLowerCase().includes('meditasi') || habit.name.toLowerCase().includes('baca')) && (
                                                        <button
                                                            onClick={() => setTimerModalHabit(habit)}
                                                            className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
                                                        >
                                                            <Play size={14} fill="currentColor" />
                                                        </button>
                                                    )}

                                                    {/* Toggle / Counter Button */}
                                                    {habit.measurementType === 'numeric' ? (
                                                        <button
                                                            onClick={() => setNumericPopover({
                                                                habitId: habit.id,
                                                                dateStr: selectedMobileDate,
                                                                currentVal: dayInfo.value || 0,
                                                                targetVal: habit.targetValue || 10,
                                                                unit: habit.unit || ''
                                                            })}
                                                            className={`px-3 h-11 rounded-2xl font-black text-xs flex items-center gap-1 ${
                                                                isDone
                                                                    ? 'bg-emerald-500 text-white shadow-md'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            <span>{dayInfo.value || 0}</span>
                                                            <span className="text-[9px] opacity-70">/{habit.targetValue}</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => toggleStatus(habit.id, selectedMobileDate)}
                                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                                                                isDone
                                                                    ? 'shadow-md text-white'
                                                                    : isRelapse
                                                                    ? 'bg-rose-500 text-white'
                                                                    : isRest
                                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400'
                                                            }`}
                                                            style={isDone ? { backgroundColor: habit.color } : {}}
                                                        >
                                                            {isDone && <Check size={18} strokeWidth={3.5} />}
                                                            {isRelapse && <span className="text-xs font-black">⚠️</span>}
                                                            {isRest && <Coffee size={16} />}
                                                            {!isDone && !isRelapse && !isRest && <Plus size={16} strokeWidth={2.5} />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* DESKTOP MATRIX GRID (≥md) */}
                            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                                <div className="overflow-x-auto custom-scrollbar select-none relative">
                                    
                                    {/* Sticky Table Header */}
                                    <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex shadow-xs">
                                        
                                        {/* Left Sticky Header */}
                                        <div className="sticky left-0 z-40 bg-slate-50 dark:bg-slate-950 w-72 shrink-0 border-r border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between font-bold text-slate-400 text-xs shadow-md">
                                            <span>{isIndo ? 'Nama Habit' : 'Habit Name'}</span>
                                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                                {filteredHabits.length} {isIndo ? 'Habit' : 'Habits'}
                                            </span>
                                        </div>

                                        {/* Dates Columns */}
                                        <div className="flex items-center px-4 py-3 gap-1.5">
                                            {monthDates.map(day => (
                                                <div key={day.dateString} className="w-8 shrink-0 flex flex-col items-center gap-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400">{day.dayName}</span>
                                                    <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                                                        day.isToday 
                                                            ? 'bg-indigo-600 text-white shadow-xs' 
                                                            : 'text-slate-600 dark:text-slate-300'
                                                    }`}>
                                                        {day.dayNumber}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Right Sticky Header */}
                                        <div className="sticky right-0 z-40 bg-slate-50 dark:bg-slate-950 w-36 shrink-0 border-l border-slate-100 dark:border-slate-800 p-4 flex items-center justify-end font-bold text-slate-400 text-xs shadow-md">
                                            <span>{isIndo ? 'Progres & Skor' : 'Progress & Score'}</span>
                                        </div>
                                    </div>

                                    {/* Habit Rows */}
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                        {filteredHabits.map(habit => (
                                            <div key={habit.id} className="flex transition-colors duration-150 group relative hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                                
                                                {/* Left Sticky Info Column */}
                                                <div className="sticky left-0 z-30 w-72 shrink-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-r border-slate-100 dark:border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
                                                    <div className="cursor-grab text-slate-300 dark:text-slate-700 hover:text-indigo-500 opacity-30 group-hover:opacity-100 transition-opacity p-0.5">
                                                        <GripVertical size={15} />
                                                    </div>

                                                    <div 
                                                        onClick={() => setDetailModalHabit(habit)}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105"
                                                        style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                                                    >
                                                        {habit.icon}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <h4 
                                                                onClick={() => setDetailModalHabit(habit)}
                                                                className="font-bold text-xs truncate text-slate-800 dark:text-slate-200 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                                            >
                                                                {habit.name}
                                                            </h4>
                                                            {habit.streak > 1 && (
                                                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md text-[9px] font-black animate-pulse">
                                                                    {habit.streak}🔥
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400 mt-1">
                                                            <span>🎯 {habit.monthlyTarget} {isIndo ? 'hari' : 'days'}</span>
                                                            {habit.measurementType === 'numeric' && (
                                                                <span>• {habit.targetValue}{habit.unit}</span>
                                                            )}
                                                            {habit.frequencyType === 'weekly_days' && (
                                                                <span className="text-indigo-500 font-bold">• {habit.frequencyDays?.length}x/mgg</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quick Action Floating Hover Bubble */}
                                                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-full absolute right-2 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 z-50">
                                                        {(habit.unit === 'min' || habit.unit === 'menit' || habit.name.toLowerCase().includes('meditasi') || habit.name.toLowerCase().includes('baca')) && (
                                                            <button onClick={() => setTimerModalHabit(habit)} className="p-1 text-slate-400 hover:text-indigo-600" title={t('habits_timer_tooltip') || 'Timer'}>
                                                                <Play size={12} fill="currentColor" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => setDetailModalHabit(habit)} className="p-1 text-slate-400 hover:text-indigo-600" title={t('habits_detail_tooltip') || 'Detail'}>
                                                            <BarChart2 size={12} />
                                                        </button>
                                                        <button onClick={() => editHabit(habit)} className="p-1 text-slate-400 hover:text-indigo-600" title="Edit">
                                                            <Edit3 size={12} />
                                                        </button>
                                                        <button onClick={() => confirmDelete(habit)} className="p-1 text-slate-400 hover:text-rose-500" title="Delete">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Date Grid Cells */}
                                                <div className="flex items-center px-4 py-2.5 gap-1.5 pointer-events-auto">
                                                    {monthDates.map(day => {
                                                        const info = getHabitDayInfo(habit, day);
                                                        const isDone = info.status === 'completed';
                                                        const isRelapse = info.status === 'relapse';
                                                        const isRest = info.status === 'rest';
                                                        const isSkipped = info.status === 'skipped';

                                                        return (
                                                            <div key={day.dateString} className="w-8 shrink-0 flex justify-center relative">
                                                                
                                                                {/* Quantitative Cell */}
                                                                {habit.measurementType === 'numeric' && !isRest ? (
                                                                    <button
                                                                        onClick={() => setNumericPopover({
                                                                            habitId: habit.id,
                                                                            dateStr: day.dateString,
                                                                            currentVal: info.value || 0,
                                                                            targetVal: habit.targetValue || 10,
                                                                            unit: habit.unit || ''
                                                                        })}
                                                                        disabled={day.isFuture}
                                                                        className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 text-[9px] font-black ${
                                                                            isDone
                                                                                ? 'shadow-xs text-white'
                                                                                : (info.value || 0) > 0
                                                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                                                                : day.isFuture
                                                                                ? 'bg-slate-50 dark:bg-slate-950 opacity-30 cursor-not-allowed'
                                                                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-400'
                                                                        }`}
                                                                        style={isDone ? { backgroundColor: habit.color } : {}}
                                                                    >
                                                                        <span>{info.value || 0}</span>
                                                                    </button>
                                                                ) : (
                                                                    /* Standard Boolean / Quit / Rest Cell */
                                                                    <button
                                                                        onClick={() => {
                                                                            if (isRest) return;
                                                                            toggleStatus(habit.id, day.dateString);
                                                                        }}
                                                                        onContextMenu={(e) => {
                                                                            e.preventDefault();
                                                                            if (isRest || day.isFuture) return;
                                                                            setNoteModalData({
                                                                                habit,
                                                                                dateStr: day.dateString,
                                                                                notes: info.notes || ''
                                                                            });
                                                                        }}
                                                                        disabled={day.isFuture}
                                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${
                                                                            isDone
                                                                                ? 'shadow-xs text-white'
                                                                                : isRelapse
                                                                                ? 'bg-rose-500 text-white shadow-xs'
                                                                                : isRest
                                                                                ? 'bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-default'
                                                                                : isSkipped
                                                                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                                                                : day.isFuture
                                                                                ? 'bg-slate-50 dark:bg-slate-950 opacity-30 cursor-not-allowed'
                                                                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                                                                        } ${day.isToday && !isDone && !isRest ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                                                        style={isDone ? { backgroundColor: habit.color, boxShadow: `0 3px 10px ${habit.color}30` } : {}}
                                                                    >
                                                                        {isDone && <Check size={13} strokeWidth={3.5} className="animate-in zoom-in duration-200" />}
                                                                        {isRelapse && <span className="text-[10px] font-black">⚠️</span>}
                                                                        {isRest && <Coffee size={12} className="opacity-60" />}
                                                                        {isSkipped && <span className="text-xs font-black">-</span>}
                                                                    </button>
                                                                )}

                                                                {/* Micro-Note Dot Badge Indicator */}
                                                                {info.hasNote && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setNoteModalData({ habit, dateStr: day.dateString, notes: info.notes || '' });
                                                                        }}
                                                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 dark:bg-amber-300 rounded-full ring-2 ring-white dark:ring-slate-900"
                                                                        title={info.notes}
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Right Sticky Progress Column */}
                                                <div className="sticky right-0 z-30 w-36 shrink-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-l border-slate-100 dark:border-slate-800 p-3.5 flex flex-col justify-center shadow-md">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                                                            {habit.progress_count}
                                                            <span className="text-[10px] text-slate-400 font-medium">/{habit.monthlyTarget}</span>
                                                        </span>
                                                        <span className="text-[10px] font-black text-indigo-500">
                                                            {habit.habit_strength || habit.progress_percent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${habit.progress_percent}%`, backgroundColor: habit.color }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* STATS & METRICS SECTION */}
                <div className="pb-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0 md:max-w-[96%] mx-auto">
                        
                        {/* Consistency Score Card */}
                        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                    {isIndo ? 'Konsistensi Bulan Ini' : 'Monthly Consistency'}
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{overallPercentage}</span>
                                    <span className="text-base font-black text-indigo-500">%</span>
                                </div>
                            </div>
                            <div className="h-16 mt-4">
                                <HabitTrendChart overallPercentage={overallPercentage} />
                            </div>
                        </div>

                        {/* MVP Habit Card */}
                        <div className="md:col-span-4 bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                            {topHabit && (
                                <>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block mb-2">
                                            🏆 {isIndo ? 'Habit Terbaik' : 'MVP Habit'}
                                        </span>
                                        <div className="text-3xl mb-1">{topHabit.icon}</div>
                                        <div className="text-base font-black truncate">{topHabit.name}</div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-baseline">
                                        <span className="text-[10px] font-bold text-indigo-200">{isIndo ? 'Total Selesai' : 'Completed'}</span>
                                        <span className="text-2xl font-black">{topHabit.progress_count}x</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 3 Mini Stat Cards (Streak, Perfect Days, Total Logs) */}
                        <div className="md:col-span-4 grid grid-cols-3 gap-3">
                            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-3xl p-4 flex flex-col justify-between">
                                <span className="text-xl">🔥</span>
                                <div>
                                    <div className="text-[9px] font-black text-orange-500 uppercase">{isIndo ? 'Streak' : 'Streak'}</div>
                                    <div className="text-xl font-black text-orange-600 dark:text-orange-400">{currentStreak}d</div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-4 flex flex-col justify-between">
                                <span className="text-xl">🌟</span>
                                <div>
                                    <div className="text-[9px] font-black text-emerald-500 uppercase">{isIndo ? 'Perfect' : 'Perfect'}</div>
                                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{perfectDaysCount}d</div>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl p-4 flex flex-col justify-between">
                                <span className="text-xl">📝</span>
                                <div>
                                    <div className="text-[9px] font-black text-blue-500 uppercase">{isIndo ? 'Total' : 'Logs'}</div>
                                    <div className="text-xl font-black text-blue-600 dark:text-blue-400">{totalCompletions}x</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* NUMERIC QUICK ADJUST POPOVER */}
                {numericPopover && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-slate-950/50" onClick={() => setNumericPopover(null)} />
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 w-full max-w-xs relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1">
                                    {isIndo ? 'Input Progres Harian' : 'Update Daily Progress'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 mb-4">
                                    {numericPopover.dateStr} • Target: {numericPopover.targetVal} {numericPopover.unit}
                                </p>

                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <button
                                        onClick={() => setNumericPopover({
                                            ...numericPopover,
                                            currentVal: Math.max(0, numericPopover.currentVal - 100)
                                        })}
                                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-lg flex items-center justify-center"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={numericPopover.currentVal}
                                        onChange={(e) => setNumericPopover({
                                            ...numericPopover,
                                            currentVal: Number(e.target.value)
                                        })}
                                        className="w-24 text-center font-black text-xl py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 outline-none"
                                    />
                                    <button
                                        onClick={() => setNumericPopover({
                                            ...numericPopover,
                                            currentVal: numericPopover.currentVal + 100
                                        })}
                                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-lg flex items-center justify-center"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setNumericPopover(null)}
                                        className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500"
                                    >
                                        {isIndo ? 'Batal' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateNumericValue(numericPopover.habitId, numericPopover.dateStr, numericPopover.currentVal)}
                                        className="flex-1 py-2.5 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-lg"
                                    >
                                        {isIndo ? 'Simpan' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* MODALS: DETAIL, TIMER, NOTE */}
                <HabitDetailModal
                    habit={detailModalHabit}
                    isOpen={Boolean(detailModalHabit)}
                    onClose={() => setDetailModalHabit(null)}
                    locale={locale}
                />

                <HabitTimerModal
                    habit={timerModalHabit}
                    isOpen={Boolean(timerModalHabit)}
                    onClose={() => setTimerModalHabit(null)}
                    onComplete={(habitId) => {
                        toggleStatus(habitId, todayStr, 'completed');
                    }}
                    locale={locale}
                />

                <HabitNoteModal
                    habit={noteModalData?.habit || null}
                    dateStr={noteModalData?.dateStr || todayStr}
                    initialNotes={noteModalData?.notes || ''}
                    isOpen={Boolean(noteModalData)}
                    onClose={() => setNoteModalData(null)}
                    onSave={handleSaveNote}
                    locale={locale}
                />

                {/* SINGLE CREATE / EDIT HABIT MODAL */}
                {showCreateModal && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowCreateModal(false)} />
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                                            {editingHabitId ? (isIndo ? 'Edit Habit' : 'Edit Habit') : (isIndo ? 'Tambah Habit Baru' : 'Add New Habit')}
                                        </h3>
                                        {!editingHabitId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateModal(false);
                                                    setShowBatchModal(true);
                                                }}
                                                className="text-[10px] font-black tracking-tight px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition flex items-center gap-1.5 w-fit border border-indigo-100 dark:border-indigo-500/30 mt-2"
                                            >
                                                <span>⚡</span> Batch Mode
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                        <X size={16} />
                                    </button>
                                </div>

                                <form onSubmit={submitSingleHabit} className="space-y-4">
                                    
                                    {/* Habit Type (Positive vs Negative) */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                            {isIndo ? 'Tipe Kebiasaan' : 'Habit Type'}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormType('positive')}
                                                className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
                                                    formType === 'positive'
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                <span>✨</span> {isIndo ? 'Membangun (+)' : 'Build (+)'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormType('negative')}
                                                className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border ${
                                                    formType === 'negative'
                                                        ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-xs'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                <span>🛡️</span> {isIndo ? 'Hentikan (Quit)' : 'Quit (Avoid)'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Name Input */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            {isIndo ? 'Nama Habit' : 'Habit Name'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder={formType === 'positive' ? 'Misal: Meditasi Pagi 15 Menit...' : 'Misal: Berhenti Merokok / No Sugar...'}
                                            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                            required
                                        />
                                    </div>

                                    {/* Measurement Mode (Boolean vs Numeric) */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            {isIndo ? 'Metode Pengukuran' : 'Measurement'}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormMeasure('boolean')}
                                                className={`py-2 rounded-xl text-xs font-bold border ${
                                                    formMeasure === 'boolean'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                ✓ {isIndo ? 'Centang Selesai' : 'Checkmark'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormMeasure('numeric')}
                                                className={`py-2 rounded-xl text-xs font-bold border ${
                                                    formMeasure === 'numeric'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                🔢 {isIndo ? 'Angka & Satuan' : 'Numeric Value'}
                                            </button>
                                        </div>

                                        {formMeasure === 'numeric' && (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div>
                                                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Target Harian</label>
                                                    <input
                                                        type="number"
                                                        value={formTargetValue}
                                                        onChange={(e) => setFormTargetValue(Number(e.target.value))}
                                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Satuan</label>
                                                    <select
                                                        value={formUnit}
                                                        onChange={(e) => setFormUnit(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none"
                                                    >
                                                        <option value="ml">ml (Air)</option>
                                                        <option value="halaman">Halaman</option>
                                                        <option value="menit">Menit</option>
                                                        <option value="km">km</option>
                                                        <option value="reps">Reps</option>
                                                        <option value="gelas">Gelas</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Frequency Selection (Daily vs Specific Days) */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            {isIndo ? 'Frekuensi & Jadwal' : 'Frequency'}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormFreqType('daily')}
                                                className={`py-2 rounded-xl text-xs font-bold border ${
                                                    formFreqType === 'daily'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                {isIndo ? 'Setiap Hari' : 'Every Day'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormFreqType('weekly_days')}
                                                className={`py-2 rounded-xl text-xs font-bold border ${
                                                    formFreqType === 'weekly_days'
                                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                {isIndo ? 'Hari Tertentu' : 'Specific Days'}
                                            </button>
                                        </div>

                                        {formFreqType === 'weekly_days' && (
                                            <div className="flex gap-1 justify-between bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                {[
                                                    { day: 1, label: isIndo ? 'Sen' : 'Mon' },
                                                    { day: 2, label: isIndo ? 'Sel' : 'Tue' },
                                                    { day: 3, label: isIndo ? 'Rab' : 'Wed' },
                                                    { day: 4, label: isIndo ? 'Kam' : 'Thu' },
                                                    { day: 5, label: isIndo ? 'Jum' : 'Fri' },
                                                    { day: 6, label: isIndo ? 'Sab' : 'Sat' },
                                                    { day: 0, label: isIndo ? 'Min' : 'Sun' }
                                                ].map(item => {
                                                    const isSelected = formFreqDays.includes(item.day);
                                                    return (
                                                        <button
                                                            key={item.day}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setFormFreqDays(formFreqDays.filter(d => d !== item.day));
                                                                } else {
                                                                    setFormFreqDays([...formFreqDays, item.day]);
                                                                }
                                                            }}
                                                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                                                                isSelected
                                                                    ? 'bg-indigo-600 text-white shadow-xs'
                                                                    : 'bg-white dark:bg-slate-800 text-slate-400'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Time of Day */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            {isIndo ? 'Waktu Pelaksanaan' : 'Time of Day'}
                                        </label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[
                                                { code: 'morning', label: '🌅 Pagi' },
                                                { code: 'afternoon', label: '☀️ Siang' },
                                                { code: 'evening', label: '🌙 Malam' },
                                                { code: 'anytime', label: '🔄 Bebas' }
                                            ].map(t => (
                                                <button
                                                    key={t.code}
                                                    type="button"
                                                    onClick={() => setFormTimeOfDay(t.code as any)}
                                                    className={`py-2 rounded-xl text-[11px] font-bold border ${
                                                        formTimeOfDay === t.code
                                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-500/10'
                                                            : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Icon Picker */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pilih Ikon</label>
                                        <div className="grid grid-cols-8 gap-1.5 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 max-h-24 overflow-y-auto">
                                            {iconList.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormIcon(icon)}
                                                    className={`h-9 rounded-xl text-lg flex items-center justify-center transition ${
                                                        formIcon === icon ? 'bg-white dark:bg-slate-800 shadow-xs ring-2 ring-indigo-500 scale-105' : 'opacity-60'
                                                    }`}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Picker */}
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Warna Label</label>
                                        <div className="flex flex-wrap gap-2">
                                            {colorPalette.map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setFormColor(c)}
                                                    className={`w-7 h-7 rounded-full border-2 transition ${
                                                        formColor === c ? 'ring-2 ring-indigo-500 border-white scale-110' : 'border-transparent'
                                                    }`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Target Slider */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Bulanan</label>
                                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{formTarget} {isIndo ? 'Hari' : 'Days'}</span>
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

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        {editingHabitId && (
                                            <button
                                                type="button"
                                                onClick={executeDelete}
                                                className="w-12 h-12 rounded-xl text-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center border border-rose-100 shrink-0"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg transition"
                                        >
                                            {editingHabitId ? (isIndo ? 'Update Habit' : 'Update Habit') : (isIndo ? 'Simpan Habit' : 'Save Habit')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* BATCH HABIT MODAL */}
                {showBatchModal && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-slate-950/60" onClick={() => setShowBatchModal(false)} />
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden">
                                
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl text-white">⚡</div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Batch Habit Creation</h3>
                                            <p className="text-[10px] font-bold text-slate-400">{isIndo ? 'Tambah beberapa habit sekaligus' : 'Create multiple habits at once'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowBatchModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">✕</button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                                    {batchRows.map((row, index) => (
                                        <div key={index} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                                                    Habit #{index + 1}
                                                </span>
                                                <button
                                                    onClick={() => setBatchRows(batchRows.filter((_, i) => i !== index))}
                                                    disabled={batchRows.length <= 1}
                                                    className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 flex items-center justify-center"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 block mb-1">Nama Habit</label>
                                                    <input
                                                        type="text"
                                                        value={row.name}
                                                        onChange={(e) => {
                                                            const upd = [...batchRows];
                                                            upd[index].name = e.target.value;
                                                            setBatchRows(upd);
                                                        }}
                                                        placeholder="Misal: Minum Air 2L..."
                                                        className="w-full text-xs font-bold h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 block mb-1">Waktu</label>
                                                    <select
                                                        value={row.timeOfDay}
                                                        onChange={(e) => {
                                                            const upd = [...batchRows];
                                                            upd[index].timeOfDay = e.target.value as any;
                                                            setBatchRows(upd);
                                                        }}
                                                        className="w-full text-xs font-bold h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none"
                                                    >
                                                        <option value="morning">🌅 Pagi</option>
                                                        <option value="afternoon">☀️ Siang</option>
                                                        <option value="evening">🌙 Malam</option>
                                                        <option value="anytime">🔄 Bebas</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => setBatchRows([...batchRows, { name: '', icon: '🎯', color: '#8b5cf6', target: 25, timeOfDay: 'morning' }])}
                                        className="w-full py-3 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-2xl text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14} /> + {isIndo ? 'Tambah Baris Habit' : 'Add Habit Row'}
                                    </button>
                                </div>

                                <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Total: {batchRows.length}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setShowBatchModal(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500">
                                            {isIndo ? 'Batal' : 'Cancel'}
                                        </button>
                                        <button onClick={submitBatchHabits} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg">
                                            {isIndo ? 'Simpan Semua' : 'Save All'}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* DELETE CONFIRMATION MODAL */}
                {showDeleteModal && habitToDelete && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="fixed inset-0 bg-slate-950/60" onClick={() => setShowDeleteModal(false)} />
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🗑️</div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">{isIndo ? 'Hapus Habit Ini?' : 'Delete Habit?'}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                    {isIndo ? 'Kebiasaan ini dan seluruh riwayat catatannya akan dihapus permanen.' : 'This habit and all its logged history will be permanently deleted.'}
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {isIndo ? 'Batal' : 'Cancel'}
                                    </button>
                                    <button onClick={executeDelete} className="flex-1 py-3 rounded-xl font-black text-xs bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none">
                                        {isIndo ? 'Hapus Permanen' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
