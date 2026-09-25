'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import useSWR, { mutate as globalMutate } from 'swr';
import { normalizeTime, normalizeDate } from '../utils/plannerMath';
import { usePlannerTimer } from './usePlannerTimer';
import { usePlannerDailyData } from './usePlannerDailyData';
import { usePlannerTaskCrud } from './usePlannerTaskCrud';
import { TaskItem, InboxTask, ScheduledHabitItem, ScheduledInterviewItem, ScheduledStudyItem } from '../types';
import { deserializeJobPayload, serializeJobPayload } from '@/app/[locale]/jobs/lib/jobAnalytics';
import { playCheckSound, playUncheckSound } from '@/lib/habitAudio';
import { useActiveModules } from '@/hooks/useActiveModules';

const habitsFetcher = (url: string) => fetch(url).then(res => res.json());

export function usePlannerState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const [selectedDate, setSelectedDate] = useState(dateParam || todayStr);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', date);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const timer = usePlannerTimer();
    const daily = usePlannerDailyData(selectedDate);
    const taskCrud = usePlannerTaskCrud(selectedDate);
    // Active modules checks
    const { isTabActive } = useActiveModules();
    const isHabitActive = isTabActive('habit');
    const isStudyActive = isTabActive('study');
    const isJobActive = isTabActive('job');
    const isJournalActive = isTabActive('journal');
    const isGoalActive = isTabActive('goal');

    // Goals SWR sync
    const { data: rawGoals, mutate: mutateGoals } = useSWR(isGoalActive ? '/api/goals' : null, habitsFetcher);

    // Habits SWR sync
    const { data: rawHabits, mutate: mutateHabits } = useSWR(isHabitActive ? '/api/habits' : null, habitsFetcher);
    const [scheduledHabits, setScheduledHabits] = useState<ScheduledHabitItem[]>([]);
    const [selectedHabitForModal, setSelectedHabitForModal] = useState<ScheduledHabitItem | null>(null);

    // User SWR sync (Study module assignments)
    const { data: rawUserData, mutate: mutateUser } = useSWR('/api/user', habitsFetcher);
    const [scheduledStudyTasks, setScheduledStudyTasks] = useState<ScheduledStudyItem[]>([]);
    const [selectedStudyForModal, setSelectedStudyForModal] = useState<ScheduledStudyItem | null>(null);

    // Jobs SWR sync (Multi-round interviews)
    const { data: rawJobs, mutate: mutateJobs } = useSWR(isJobActive ? '/api/jobs' : null, habitsFetcher);
    const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterviewItem[]>([]);
    const [selectedInterviewForModal, setSelectedInterviewForModal] = useState<ScheduledInterviewItem | null>(null);

    const [startHour, setStartHour] = useState(6);
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Rollover state
    const [unfinishedYesterdayTasks, setUnfinishedYesterdayTasks] = useState<TaskItem[]>([]);
    const [showRolloverBanner, setShowRolloverBanner] = useState(false);

    // Reset confirmation modal state
    const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

    useEffect(() => {
        if (dateParam && dateParam !== selectedDate) {
            setSelectedDate(dateParam);
        }
    }, [dateParam]);

    // Load initial data
    useEffect(() => {
        const savedStart = localStorage.getItem('planner_start_time');
        if (savedStart) setStartHour(parseInt(savedStart));
        
        setIsLoaded(false);

        // Compute yesterday's date string
        const [y, m, d] = selectedDate.split('-').map(Number);
        const yesterdayObj = new Date(y, m - 1, d - 1);
        const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

        const loadAll = async () => {
            try {
                const [tasksRes, dailyRes, yesterdayRes] = await Promise.all([
                    fetch(`/api/planner/tasks?date=${selectedDate}`, { cache: 'no-store' }),
                    fetch(`/api/planner/daily?date=${selectedDate}`, { cache: 'no-store' }),
                    fetch(`/api/planner/tasks?date=${yesterdayStr}`, { cache: 'no-store' }),
                ]);

                if (tasksRes.ok) {
                    const data = await tasksRes.json();
                    taskCrud.setTasks(Array.isArray(data) ? data.map((t: any) => ({
                        id: t.id,
                        date: normalizeDate(t.date),
                        title: t.title,
                        start_time: normalizeTime(t.startTime || t.start_time),
                        end_time: normalizeTime(t.endTime || t.end_time),
                        type: t.type,
                        notes: t.notes || '',
                        completed: t.isCompleted || t.completed || false
                    })) : []);
                }

                if (dailyRes.ok) {
                    const dailyData = await dailyRes.json();
                    daily.setAllDaily(dailyData);
                }

                // Check for unfinished tasks from yesterday
                if (yesterdayRes.ok) {
                    const isHandled = typeof window !== 'undefined' && localStorage.getItem('planner_rollover_handled_' + yesterdayStr);
                    if (isHandled) {
                        setUnfinishedYesterdayTasks([]);
                        setShowRolloverBanner(false);
                    } else {
                        const yData = await yesterdayRes.json();
                        if (Array.isArray(yData)) {
                            const unfinished = yData.filter((t: any) => !(t.isCompleted || t.completed));
                            if (unfinished.length > 0) {
                                setUnfinishedYesterdayTasks(unfinished.map((t: any) => ({
                                    id: t.id,
                                    date: normalizeDate(t.date),
                                    title: t.title,
                                    start_time: normalizeTime(t.startTime || t.start_time),
                                    end_time: normalizeTime(t.endTime || t.end_time),
                                    type: t.type,
                                    notes: t.notes || '',
                                    completed: false
                                })));
                                setShowRolloverBanner(true);
                            } else {
                                setUnfinishedYesterdayTasks([]);
                                setShowRolloverBanner(false);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load planner data:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadAll();

        const clockInterval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(clockInterval);
    }, [selectedDate]);

    // Reactively compute scheduled habits from rawHabits (Virtual Projection)
    useEffect(() => {
        if (!isHabitActive || !rawHabits || !Array.isArray(rawHabits)) {
            setScheduledHabits([]);
            return;
        }

        const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
        const currentDayOfWeek = new Date(sYear, sMonth - 1, sDay).getDay(); // 0: Sun, 1: Mon...

        const matched: ScheduledHabitItem[] = [];

        rawHabits.forEach((h: any) => {
            // Must not be archived
            if (h.isArchived || h.is_archived) return;

            let meta: any = {};
            if (typeof h.status === 'string' && h.status.startsWith('{')) {
                try { meta = JSON.parse(h.status); } catch {}
            } else if (typeof h.status === 'object' && h.status !== null) {
                meta = h.status;
            }

            const startTime = meta.startTime;
            if (!startTime) return; // Only time-scheduled habits appear on timeline

            // Explicit check: Must be synced to planner!
            const isPlannerSynced = Array.isArray(meta.syncedTabs) ? meta.syncedTabs.includes('planner') : true;
            if (!isPlannerSynced) return;

            // Date bounds check
            if (meta.startDate && selectedDate < meta.startDate) return;
            if (meta.endDate && selectedDate > meta.endDate) return;

            // Frequency check
            const freqType = meta.frequencyType || 'daily';
            if (freqType === 'weekly_days' && Array.isArray(meta.frequencyDays)) {
                if (!meta.frequencyDays.includes(currentDayOfWeek)) {
                    return;
                }
            }

            // Compute end time (+30 mins default)
            let endTime = meta.endTime;
            if (!endTime) {
                const [sH, sM] = startTime.split(':').map(Number);
                const total = (isNaN(sH) ? 8 : sH) * 60 + (isNaN(sM) ? 0 : sM) + 30;
                const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
                const endM = String(total % 60).padStart(2, '0');
                endTime = `${endH}:${endM}`;
            }

            // Status on selectedDate
            let isDone = false;
            let streakCount = 0;
            if (Array.isArray(h.logs)) {
                const logToday = h.logs.find((l: any) => {
                    const lDate = typeof l.date === 'string' ? l.date.split('T')[0] : '';
                    return lDate === selectedDate;
                });
                if (logToday && (logToday.status === 'completed' || Number(logToday.value) > 0)) {
                    isDone = true;
                }
                streakCount = h.logs.filter((l: any) => l.status === 'completed' || Number(l.value) > 0).length;
            }

            matched.push({
                id: h.id,
                name: h.name,
                icon: h.icon || '🌱',
                color: h.color || '#10b981',
                startTime,
                endTime,
                completed: isDone,
                streak: streakCount,
                notes: meta.notes || ''
            });
        });

        setScheduledHabits(matched);
    }, [rawHabits, selectedDate]);

    // Reactively compute scheduled interviews from rawJobs (Virtual Projection)
    useEffect(() => {
        if (!isJobActive || !rawJobs || !Array.isArray(rawJobs)) {
            setScheduledInterviews([]);
            return;
        }

        const matched: ScheduledInterviewItem[] = [];

        rawJobs.forEach((rawJ: any) => {
            const job = deserializeJobPayload(rawJ);
            if (!job.interview_rounds || !Array.isArray(job.interview_rounds)) return;

            job.interview_rounds.forEach((round) => {
                if (!round.scheduled_at) return;

                let roundDateStr = '';
                let startH = '10';
                let startM = '00';
                let endH = '11';
                let endM = '00';

                try {
                    const d = new Date(round.scheduled_at);
                    if (!isNaN(d.getTime())) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        roundDateStr = `${y}-${m}-${day}`;
                        startH = String(d.getHours()).padStart(2, '0');
                        startM = String(d.getMinutes()).padStart(2, '0');
                        const endD = new Date(d.getTime() + 60 * 60000);
                        endH = String(endD.getHours()).padStart(2, '0');
                        endM = String(endD.getMinutes()).padStart(2, '0');
                    } else if (typeof round.scheduled_at === 'string') {
                        roundDateStr = round.scheduled_at.split('T')[0].split(' ')[0];
                    }
                } catch {
                    if (typeof round.scheduled_at === 'string') {
                        roundDateStr = round.scheduled_at.split('T')[0].split(' ')[0];
                    }
                }

                if (normalizeDate(roundDateStr) !== normalizeDate(selectedDate)) return;

                matched.push({
                    id: round.id,
                    jobId: job.id,
                    company: job.company || 'Perusahaan',
                    jobTitle: job.title || 'Posisi Pekerjaan',
                    roundTitle: round.round_title || round.round_type || 'Interview',
                    roundType: round.round_type || 'user_interview',
                    scheduledAt: round.scheduled_at,
                    startTime: `${startH}:${startM}`,
                    endTime: `${endH}:${endM}`,
                    interviewerName: round.interviewer_name || '',
                    meetingLink: round.meeting_link || '',
                    status: round.status || 'upcoming',
                    notes: round.notes || ''
                });
            });
        });

        setScheduledInterviews(matched);
    }, [isJobActive, rawJobs, selectedDate]);

    // Study assignments from user.settings.study_assignments (Virtual Projection)
    const allStudyAssignments: any[] = (isStudyActive && Array.isArray(rawUserData?.settings?.study_assignments))
        ? rawUserData.settings.study_assignments
        : [];

    const pendingStudyAssignments = isStudyActive
        ? allStudyAssignments.filter((a: any) => a.status !== 'completed')
        : [];

    useEffect(() => {
        if (!isStudyActive || !Array.isArray(allStudyAssignments) || allStudyAssignments.length === 0) {
            setScheduledStudyTasks([]);
            return;
        }

        const matched: ScheduledStudyItem[] = [];

        allStudyAssignments.forEach((a: any) => {
            if (!a.due_date) return;
            const dueDateStr = String(a.due_date).split('T')[0].split(' ')[0];
            if (normalizeDate(dueDateStr) !== normalizeDate(selectedDate)) return;

            matched.push({
                id: String(a.id),
                courseName: a.course_name || 'Kuliah',
                title: a.title || 'Tugas Kuliah',
                dueDate: a.due_date,
                startTime: a.startTime || '19:00',
                endTime: a.endTime || '20:00',
                type: a.type || 'assignment',
                priority: a.priority || 'normal',
                completed: a.status === 'completed',
                description: a.description || ''
            });
        });

        setScheduledStudyTasks(matched);
    }, [isStudyActive, rawUserData, selectedDate]);

    // Combined Tasks + Habits + Interviews + Study metrics
    const activeTasks = taskCrud.tasks.filter(t => normalizeDate(t.date) === normalizeDate(selectedDate));
    const totalItems = activeTasks.length + scheduledHabits.length + scheduledInterviews.length + scheduledStudyTasks.length;
    const completedTasksCount = activeTasks.filter(t => t.completed).length;
    const completedHabitsCount = scheduledHabits.filter(h => h.completed).length;
    const completedInterviewsCount = scheduledInterviews.filter(i => i.status === 'completed' || i.status === 'passed').length;
    const completedStudyCount = scheduledStudyTasks.filter(s => s.completed).length;
    const completedCount = completedTasksCount + completedHabitsCount + completedInterviewsCount + completedStudyCount;
    const pendingCount = Math.max(0, totalItems - completedCount);
    const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Toggle Habit completion directly from Planner
    const toggleHabitStatus = async (habitId: number) => {
        const target = scheduledHabits.find(h => h.id === habitId);
        if (!target) return;

        const nextCompleted = !target.completed;
        const nextStatus = nextCompleted ? 'completed' : 'empty';

        // Optimistic UI update
        setScheduledHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                return {
                    ...h,
                    completed: nextCompleted,
                    streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
                };
            }
            return h;
        }));

        if (nextCompleted) {
            playCheckSound();
        } else {
            playUncheckSound();
        }

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    status: nextStatus,
                    value: nextCompleted ? 1 : 0
                })
            });
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to sync habit log from planner:', err);
        }
    };

    // Toggle Study Assignment completion directly from Planner
    const toggleStudyAssignmentCompleted = async (assignmentId: string) => {
        const target = scheduledStudyTasks.find(s => s.id === assignmentId) || allStudyAssignments.find((a: any) => String(a.id) === String(assignmentId));
        if (!target) return;

        const nextCompleted = !(target.completed || target.status === 'completed');
        const nextStatus = nextCompleted ? 'completed' : 'todo';

        // Optimistic UI update
        setScheduledStudyTasks(prev => prev.map(s => {
            if (s.id === assignmentId) {
                return { ...s, completed: nextCompleted };
            }
            return s;
        }));

        if (nextCompleted) {
            playCheckSound();
        } else {
            playUncheckSound();
        }

        try {
            const currentList = Array.isArray(rawUserData?.settings?.study_assignments) ? [...rawUserData.settings.study_assignments] : [];
            const updatedList = currentList.map((a: any) => {
                if (String(a.id) === String(assignmentId)) {
                    return { ...a, status: nextStatus };
                }
                return a;
            });

            const newSettings = {
                ...(rawUserData?.settings || {}),
                study_assignments: updatedList
            };

            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: newSettings })
            });

            await mutateUser();
            globalMutate('/api/user');
        } catch (err) {
            console.error('Failed to update study assignment status:', err);
        }
    };

    // Toggle Interview completion directly from Planner
    const toggleInterviewCompleted = async (jobId: string | number, roundId: string | number) => {
        if (!rawJobs || !Array.isArray(rawJobs)) return;
        const rawJ = rawJobs.find((j: any) => String(j.id) === String(jobId));
        if (!rawJ) return;

        const job = deserializeJobPayload(rawJ);
        const round = (job.interview_rounds || []).find((r: any) => String(r.id) === String(roundId));
        if (!round) return;

        const nextStatus = (round.status === 'completed' || round.status === 'passed') ? 'upcoming' : 'completed';

        // Optimistic UI update
        setScheduledInterviews(prev => prev.map(item => {
            if (String(item.id) === String(roundId)) {
                return { ...item, status: nextStatus };
            }
            return item;
        }));

        if (nextStatus === 'completed') {
            playCheckSound();
        } else {
            playUncheckSound();
        }

        try {
            const updatedRounds = (job.interview_rounds || []).map((r: any) => {
                if (String(r.id) === String(roundId)) {
                    return { ...r, status: nextStatus };
                }
                return r;
            });

            const updatedJob = { ...job, interview_rounds: updatedRounds };
            const payload = serializeJobPayload(updatedJob);

            await fetch(`/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            await mutateJobs();
            globalMutate('/api/jobs');
        } catch (err) {
            console.error('Failed to update interview status:', err);
        }
    };

    // Handle scheduling a study assignment onto timeline
    const handleScheduleStudyAssignment = async (assignmentId: string, startTime: string) => {
        const found = allStudyAssignments.find((a: any) => String(a.id) === String(assignmentId));
        if (!found) return;

        await taskCrud.scheduleInboxTask({
            id: Date.now(),
            title: `[📚 Kuliah] ${found.course_name ? `${found.course_name}: ` : ''}${found.title}`,
            type: 2
        }, startTime, 60);
    };

    // Handle scheduling a goal milestone onto timeline
    const handleScheduleGoalMilestone = async (milestone: any, goal: any, startTime?: string) => {
        const timeToUse = startTime || '09:00';
        const goalPrefix = goal?.title ? `[🎯 ${goal.title}] ` : '[🎯 Target] ';
        await taskCrud.scheduleInboxTask({
            id: Date.now(),
            title: `${goalPrefix}${milestone.title}`,
            type: 1 // Priority 1 (Urgent/Vital)
        }, timeToUse, 60);
    };

    // Toggle milestone completion directly from planner
    const handleToggleGoalMilestone = async (goalId: string | number, milestoneId: string | number, currentCompleted: boolean) => {
        const nextState = !currentCompleted;
        try {
            await fetch(`/api/goals/${goalId}/milestones/${milestoneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: nextState })
            });
            await mutateGoals();
            globalMutate('/api/goals');
        } catch (err) {
            console.error('Failed to toggle goal milestone in planner:', err);
        }
    };

    // Unlink habit from Planner schedule
    const unlinkHabitFromPlanner = async (habitId: number) => {
        if (!rawHabits || !Array.isArray(rawHabits)) return;
        const habit = rawHabits.find((h: any) => h.id === habitId);
        if (!habit) return;

        let meta: any = {};
        if (typeof habit.status === 'string' && habit.status.startsWith('{')) {
            try { meta = JSON.parse(habit.status); } catch {}
        } else if (typeof habit.status === 'object' && habit.status !== null) {
            meta = { ...habit.status };
        }

        const updatedSyncedTabs = Array.isArray(meta.syncedTabs)
            ? meta.syncedTabs.filter((tab: string) => tab !== 'planner')
            : [];

        meta.syncedTabs = updatedSyncedTabs;

        // Optimistic update
        setScheduledHabits(prev => prev.filter(h => h.id !== habitId));
        setSelectedHabitForModal(null);

        try {
            await fetch(`/api/habits/${habitId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: habit.name,
                    icon: habit.icon,
                    color: habit.color,
                    monthlyTarget: habit.monthlyTarget || habit.monthly_target || 30,
                    status: JSON.stringify(meta)
                })
            });
            await mutateHabits();
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to unlink habit from planner:', err);
        }
    };

    // Permanently delete habit from database
    const deleteHabitPermanently = async (habitId: number) => {
        // Optimistic update
        setScheduledHabits(prev => prev.filter(h => h.id !== habitId));
        setSelectedHabitForModal(null);

        try {
            await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
            await mutateHabits();
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to delete habit permanently:', err);
        }
    };

    // Trigger reset confirmation modal
    const requestResetBoard = () => {
        setShowResetConfirmModal(true);
    };

    // Confirm and execute atomic reset in database
    const confirmResetBoard = async () => {
        setShowResetConfirmModal(false);
        await taskCrud.resetBoardForDate(selectedDate);
    };

    // Execute rollover
    const handleAcceptRollover = async () => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const yesterdayObj = new Date(y, m - 1, d - 1);
        const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;
        try {
            localStorage.setItem('planner_rollover_handled_' + yesterdayStr, 'true');
        } catch (e) {}

        setShowRolloverBanner(false);
        if (unfinishedYesterdayTasks.length > 0) {
            await taskCrud.rolloverTasks(unfinishedYesterdayTasks, selectedDate);
            setUnfinishedYesterdayTasks([]);
        }
    };

    const handleDismissRollover = () => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const yesterdayObj = new Date(y, m - 1, d - 1);
        const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;
        try {
            localStorage.setItem('planner_rollover_handled_' + yesterdayStr, 'true');
        } catch (e) {}

        setShowRolloverBanner(false);
        setUnfinishedYesterdayTasks([]);
    };

    // Handle scheduling an inbox item to timeline
    const handleScheduleInboxTask = async (inboxTaskId: number, startTime: string) => {
        const found = daily.taskInbox.find(i => i.id === inboxTaskId);
        if (!found) return;

        // Schedule on timeline
        await taskCrud.scheduleInboxTask(found, startTime, 60);

        // Remove from inbox
        daily.handleSetTaskInbox(daily.taskInbox.filter(i => i.id !== inboxTaskId));
    };

    const handleSetStartHour = (h: number) => {
        setStartHour(h);
        localStorage.setItem('planner_start_time', h.toString());
    };

    return {
        selectedDate,
        handleDateChange,
        tasks: taskCrud.tasks,
        setTasks: taskCrud.setTasks,
        requestResetBoard,
        confirmResetBoard,
        showResetConfirmModal,
        setShowResetConfirmModal,
        notes: daily.notes,
        handleSetNotes: daily.handleSetNotes,
        meals: daily.meals,
        handleSetMeals: daily.handleSetMeals,
        waterGlasses: daily.waterGlasses,
        handleSetWaterGlasses: daily.handleSetWaterGlasses,
        taskInbox: daily.taskInbox,
        handleSetTaskInbox: daily.handleSetTaskInbox,
        saveStatus: daily.saveStatus,
        durationMinutes: timer.durationMinutes,
        pomodoroTime: timer.pomodoroTime,
        isTimerRunning: timer.isTimerRunning,
        focusedTaskTitle: timer.focusedTaskTitle,
        setTimerPreset: timer.setPreset,
        toggleTimer: timer.toggleTimer,
        resetTimer: timer.resetTimer,
        formatTimer: timer.formatTimer,
        focusOnTask: timer.focusOnTask,
        clearFocusedTask: timer.clearFocusedTask,
        startHour,
        handleSetStartHour,
        now,
        isLoaded,
        showTaskModal: taskCrud.showTaskModal,
        setShowTaskModal: taskCrud.setShowTaskModal,
        editingTaskId: taskCrud.editingTaskId,
        taskTitle: taskCrud.taskTitle,
        setTaskTitle: taskCrud.setTaskTitle,
        taskStartTime: taskCrud.taskStartTime,
        setTaskStartTime: taskCrud.setTaskStartTime,
        taskEndTime: taskCrud.taskEndTime,
        setTaskEndTime: taskCrud.setTaskEndTime,
        taskType: taskCrud.taskType,
        setTaskType: taskCrud.setTaskType,
        taskNotes: taskCrud.taskNotes,
        setTaskNotes: taskCrud.setTaskNotes,
        progressPercent,
        completedCount,
        pendingCount,
        toggleTask: taskCrud.toggleTask,
        openNewTaskModal: taskCrud.openNewTaskModal,
        editTask: taskCrud.editTask,
        submitSingleTask: taskCrud.submitSingleTask,
        submitBatchTasks: taskCrud.submitBatchTasks,
        handleMoveTask: taskCrud.handleMoveTask,
        handleScheduleInboxTask,
        handleScheduleStudyAssignment,
        goals: Array.isArray(rawGoals) ? rawGoals : [],
        handleScheduleGoalMilestone,
        handleToggleGoalMilestone,
        deleteTask: taskCrud.deleteTask,
        unfinishedYesterdayTasks,
        showRolloverBanner,
        handleAcceptRollover,
        handleDismissRollover,
        scheduledHabits,
        toggleHabitStatus,
        selectedHabitForModal,
        setSelectedHabitForModal,
        unlinkHabitFromPlanner,
        deleteHabitPermanently,
        scheduledStudyTasks,
        pendingStudyAssignments,
        selectedStudyForModal,
        setSelectedStudyForModal,
        toggleStudyAssignmentCompleted,
        scheduledInterviews,
        selectedInterviewForModal,
        setSelectedInterviewForModal,
        toggleInterviewCompleted,
        isHabitActive,
        isStudyActive,
        isJobActive,
        isJournalActive,
        isGoalActive
    };
}

