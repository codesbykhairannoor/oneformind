'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GoalHeader from './components/GoalHeader';
import GoalStats from './components/GoalStats';
import GoalCard, { GoalItem } from './components/GoalCard';
import GoalModal from './components/GoalModal';
import GoalFilterBar, { GoalViewMode, GoalSortOption } from './components/GoalFilterBar';
import GoalKanbanView from './components/GoalKanbanView';
import GoalTimelineView from './components/GoalTimelineView';
import GoalWheelOfLifeView from './components/GoalWheelOfLifeView';
import GoalCelebrationModal from './components/GoalCelebrationModal';
import GoalDeleteModal from './components/GoalDeleteModal';
import GoalNotesModal from './components/GoalNotesModal';
import GatedPage from '@/components/GatedPage';
import { Milestone } from './components/MilestoneItem';
import { 
    calculateGoalProgress, 
    calculateGoalPace, 
    calculateGlobalGoalStats 
} from './lib/goalPaceCalculator';
import { Target, Sparkles, Plus } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';
import { useActiveModules } from '@/hooks/useActiveModules';
import { saveCategoryBundle, removeCategoryBundle } from './lib/goalCategories';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GoalsPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const { isTabActive } = useActiveModules();
    const isHabitActive = isTabActive('habit');
    const isFinanceActive = isTabActive('finance');

    const [isExportOpen, setIsExportOpen] = useState(false);

    const [currentTab, setCurrentTab] = useState<'active' | 'completed'>('active');
    const [viewMode, setViewMode] = useState<GoalViewMode>('gallery');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedTimeHorizon, setSelectedTimeHorizon] = useState('weekly');
    const [sortBy, setSortBy] = useState<GoalSortOption>('deadline');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

    // Custom Bilingual Delete Modal state
    const [goalToDelete, setGoalToDelete] = useState<GoalItem | null>(null);
    const [isDeletingGoal, setIsDeletingGoal] = useState(false);

    const [celebratingGoal, setCelebratingGoal] = useState<GoalItem | null>(null);
    const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

    // Notes & Reflection Modal state
    const [notesGoal, setNotesGoal] = useState<GoalItem | null>(null);

    const [hasMounted, setHasMounted] = useState(false);

    const currentMonthKey = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }, []);

    const { data: fetchedGoals, mutate: mutateGoals } = useSWR('/api/goals', fetcher);
    const { data: fetchedHabits, mutate: mutateHabits } = useSWR(isHabitActive ? '/api/habits?period=all' : null, fetcher);
    const { data: fetchedSavings } = useSWR(isFinanceActive ? '/api/finance/savings' : null, fetcher);

    const parsedGoals = useMemo(() => {
        if (!fetchedGoals || !Array.isArray(fetchedGoals)) return null;

        // Build Title Map and Child Count Map for Parent-Child Goal Hierarchy
        const titleMap = new Map<string, string>();
        const childCountMap = new Map<string, number>();

        fetchedGoals.forEach((g: any) => {
            titleMap.set(String(g.id), g.title || '');
            let meta: any = {};
            const rawSpecific = g.specific_days || g.specificDays;
            if (rawSpecific && typeof rawSpecific === 'string') {
                try { meta = JSON.parse(rawSpecific); } catch {}
            } else if (rawSpecific && typeof rawSpecific === 'object') {
                meta = rawSpecific;
            }
            const pId = g.parent_goal_id ?? g.parentGoalId ?? meta.parent_goal_id ?? meta.parentGoalId;
            if (pId) {
                childCountMap.set(String(pId), (childCountMap.get(String(pId)) || 0) + 1);
            }
        });

        const mappedGoals = fetchedGoals.map((g: any) => {
            // Parse specific_days / metadata
            let meta: any = {};
            const rawSpecific = g.specific_days || g.specificDays;
            if (rawSpecific && typeof rawSpecific === 'string') {
                try { meta = JSON.parse(rawSpecific); } catch {}
            } else if (rawSpecific && typeof rawSpecific === 'object') {
                meta = rawSpecific;
            }

            const parentGoalId = g.parent_goal_id ?? g.parentGoalId ?? meta.parent_goal_id ?? meta.parentGoalId ?? null;
            const parentGoalTitle = parentGoalId ? (titleMap.get(String(parentGoalId)) || null) : null;
            const childGoalsCount = childCountMap.get(String(g.id)) || 0;

            const rawGoalStartDate = g.start_date || g.startDate || meta.start_date || meta.startDate || null;
            const rawGoalEndDate = g.end_date || g.endDate || meta.end_date || meta.endDate || null;
            const goalStartDate = rawGoalStartDate ? String(rawGoalStartDate).split('T')[0] : null;
            const goalEndDate = rawGoalEndDate ? String(rawGoalEndDate).split('T')[0] : null;

            const linkedSource = g.linked_source || meta.linked_source || 'manual';
            const linkedAccountId = g.linked_account_id ?? meta.linked_account_id ?? null;
            let linkedAccountTitle = g.linked_account_title || meta.linked_account_title || null;
            const linkedHabitIds: (number | string)[] = Array.isArray(g.linked_habit_ids)
                ? g.linked_habit_ids
                : (Array.isArray(meta.linked_habit_ids) ? meta.linked_habit_ids : []);

            // Dynamic live balance sync from Finance savings (Only if Finance module active)
            let dynamicCurrentValue = Number(g.current_value ?? g.currentValue ?? 0);
            if (isFinanceActive && linkedSource === 'finance_savings' && linkedAccountId && Array.isArray(fetchedSavings)) {
                const matchedSaving = fetchedSavings.find((s: any) => String(s.id) === String(linkedAccountId));
                if (matchedSaving) {
                    dynamicCurrentValue = Number(matchedSaving.currentAmount ?? dynamicCurrentValue);
                    linkedAccountTitle = matchedSaving.title || linkedAccountTitle;
                }
            }

            const linkedHabits: any[] = [];
            const todayStr = new Date().toISOString().split('T')[0];

            if (isHabitActive && fetchedHabits && Array.isArray(fetchedHabits)) {
                // Collect linked habit names from linkedHabitIds
                const linkedHabitIdsSet = new Set(linkedHabitIds.map((id: any) => String(id)));
                const linkedHabitNamesSet = new Set<string>();
                fetchedHabits.forEach((fh: any) => {
                    if (linkedHabitIdsSet.has(String(fh.id))) {
                        const n = (fh.name || '').trim().toLowerCase();
                        if (n) linkedHabitNamesSet.add(n);
                    }
                });

                const seenHabitNames = new Set<string>();
                fetchedHabits.forEach((h: any) => {
                    if (h.isArchived || h.is_archived || h.archived) return;

                    let hMeta: any = {};
                    if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
                        try { hMeta = JSON.parse(h.status); } catch {}
                    } else if (h.status && typeof h.status === 'object') {
                        hMeta = h.status;
                    }

                    const norm = (h.name || '').trim().toLowerCase();
                    const isExplicitlyLinked = linkedHabitIdsSet.has(String(h.id)) || (norm && linkedHabitNamesSet.has(norm));
                    const isMatched = isExplicitlyLinked ||
                                      (hMeta.goalId && String(hMeta.goalId) === String(g.id)) ||
                                      (hMeta.goalTitle && hMeta.goalTitle.trim().toLowerCase() === (g.title || '').trim().toLowerCase());

                    if (isMatched && !seenHabitNames.has(norm)) {
                        seenHabitNames.add(norm);

                        // Find all instances of this habit across periods to aggregate logs and select primary instance
                        const matchingInstances = fetchedHabits.filter((fh: any) => (fh.name || '').trim().toLowerCase() === norm);
                        const primaryInstance = matchingInstances.find((fh: any) => fh.period === currentMonthKey) || matchingInstances[matchingInstances.length - 1] || h;

                        // Aggregate logs across all periods for this habit
                        const allHabitLogs: any[] = [];
                        matchingInstances.forEach((inst: any) => {
                            if (Array.isArray(inst.logs)) {
                                allHabitLogs.push(...inst.logs);
                            }
                        });

                        // 1. Boundary filter: Only count logs on/after goal start_date (and on/before end_date), de-duplicated by date
                        const seenDates = new Set<string>();
                        const validLogs = allHabitLogs.filter((l: any) => {
                            const isDone = l.status === 'completed' || l.completed || l.value === 1;
                            if (!isDone) return false;
                            const logDate = l.date ? String(l.date).split('T')[0] : '';
                            if (!logDate || seenDates.has(logDate)) return false;
                            if (goalStartDate && logDate < goalStartDate) return false;
                            if (goalEndDate && logDate > goalEndDate) return false;
                            seenDates.add(logDate);
                            return true;
                        });

                        const completedCheckIns = validLogs.length;
                        const isCompletedToday = allHabitLogs.some((l: any) => {
                            const logDate = l.date ? String(l.date).split('T')[0] : '';
                            return logDate === todayStr && (l.status === 'completed' || l.completed || l.value === 1);
                        });

                        // 2. Denominator: How many check-ins needed to reach 100%?
                        const freqType = primaryInstance.frequencyType || hMeta.frequencyType || 'daily';
                        const freqDays = Array.isArray(primaryInstance.frequencyDays) ? primaryInstance.frequencyDays : (Array.isArray(hMeta.frequencyDays) ? hMeta.frequencyDays : []);
                        const freqCount = Number(primaryInstance.frequencyCount || hMeta.frequencyCount) || (freqDays.length > 0 ? freqDays.length : 7);
                        const timeHorizon = g.time_horizon || g.timeHorizon || meta.time_horizon || 'monthly';

                        let targetCheckIns = 30;
                        if (g.type === 'habit_frequency' && Number(g.target_value) > 0) {
                            targetCheckIns = Number(g.target_value);
                        } else if (timeHorizon === 'weekly') {
                            targetCheckIns = (freqType === 'weekly_days' || freqType === 'weekly_count') ? Math.max(1, freqCount) : 7;
                        } else if (timeHorizon === 'monthly') {
                            targetCheckIns = (freqType === 'weekly_days' || freqType === 'weekly_count') ? Math.max(1, freqCount * 4) : 30;
                        } else if (timeHorizon === 'quarterly') {
                            targetCheckIns = (freqType === 'weekly_days' || freqType === 'weekly_count') ? Math.max(1, freqCount * 12) : 90;
                        } else if (timeHorizon === 'yearly') {
                            targetCheckIns = (freqType === 'weekly_days' || freqType === 'weekly_count') ? Math.max(1, freqCount * 52) : 365;
                        } else {
                            targetCheckIns = Number(primaryInstance.monthlyTarget) || 30;
                        }

                        const consistency = Math.min(100, Math.round((completedCheckIns / targetCheckIns) * 100));

                        linkedHabits.push({
                            id: primaryInstance.id,
                            name: primaryInstance.name,
                            icon: primaryInstance.icon || '🌱',
                            color: primaryInstance.color,
                            consistencyPercent: consistency,
                            streak: completedCheckIns,
                            completedToday: isCompletedToday,
                            frequencyType: freqType,
                            frequencyDays: freqDays,
                            completedCount: completedCheckIns,
                            targetCount: targetCheckIns
                        });
                    }
                });
            }

            return {
                id: g.id,
                title: g.title,
                icon: meta.icon || g.icon || '🎯',
                color: g.color || '#6366f1',
                type: g.type || 'milestones',
                status: g.status || 'active',
                priority: g.priority || 'important',
                category: g.category || 'other',
                time_horizon: g.time_horizon || g.timeHorizon || meta.time_horizon || 'yearly',
                is_north_star: Boolean(g.is_north_star || g.isNorthStar || meta.is_north_star),
                parent_goal_id: parentGoalId,
                parent_goal_title: parentGoalTitle,
                child_goals_count: childGoalsCount,
                start_value: Number(g.start_value ?? g.startValue ?? 0),
                current_value: dynamicCurrentValue,
                target_value: Number(g.target_value ?? g.targetValue ?? 10),
                unit: g.unit || (isIndo ? 'buku' : 'books'),
                currency: g.currency || 'IDR',
                core_why: g.core_why || g.coreWhy || meta.core_why || '',
                obstacle: g.obstacle || meta.obstacle || '',
                obstacle_plan: g.obstacle_plan || g.obstaclePlan || meta.obstacle_plan || '',
                reward: g.reward || meta.reward || '',
                notes: g.notes || meta.notes || '',
                startDate: goalStartDate,
                start_date: goalStartDate || '',
                endDate: goalEndDate,
                end_date: goalEndDate || '',
                cover_image_url: g.cover_image_url || g.coverImageUrl || '',
                linked_source: linkedSource,
                linked_account_id: linkedAccountId,
                linked_account_title: linkedAccountTitle,
                linked_habit_ids: linkedHabitIds,
                linked_habits: linkedHabits,
                specific_days: rawSpecific,
                milestones: (g.milestones || []).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    is_completed: Boolean(m.completed || m.is_completed),
                    completed: Boolean(m.completed || m.is_completed),
                    weight: Number(m.weight || 1),
                    target_date: m.target_date || m.targetDate || null
                })),
            };
        });

        // Pass 2: Connect Sub-Goals (Children) to Parent Goals and Compute Rollup Progress
        const parentChildrenMap = new Map<string, any[]>();
        mappedGoals.forEach((g: any) => {
            if (g.parent_goal_id) {
                const pid = String(g.parent_goal_id);
                if (!parentChildrenMap.has(pid)) parentChildrenMap.set(pid, []);
                parentChildrenMap.get(pid)!.push(g);
            }
        });

        // Multi-pass bottom-up convergence: ensures Weekly -> Monthly -> Quarterly -> Yearly cascade seamlessly
        for (let iter = 0; iter < 3; iter++) {
            mappedGoals.forEach((parent: any) => {
                const children = parentChildrenMap.get(String(parent.id)) || [];
                if (children.length > 0) {
                    const childSummaries = children.map((c: any) => ({
                        id: c.id,
                        title: c.title,
                        time_horizon: c.time_horizon,
                        progress: calculateGoalProgress(c),
                        status: c.status
                    }));

                    // Rolling Wave Cadence Denominator:
                    // Prevents a monthly goal with only 1 weekly goal from prematurely showing 100% complete
                    const parentHorizon = parent.time_horizon || 'yearly';
                    const hasWeeklyChildren = childSummaries.some((c: any) => c.time_horizon === 'weekly');
                    const hasMonthlyChildren = childSummaries.some((c: any) => c.time_horizon === 'monthly' || c.time_horizon === 'sprint');
                    const hasQuarterlyChildren = childSummaries.some((c: any) => c.time_horizon === 'quarterly');

                    let expectedDenominator = childSummaries.length;
                    if (parentHorizon === 'monthly') {
                        if (hasWeeklyChildren) {
                            expectedDenominator = Math.max(4, childSummaries.length);
                        }
                    } else if (parentHorizon === 'quarterly') {
                        if (hasMonthlyChildren) {
                            expectedDenominator = Math.max(3, childSummaries.length);
                        } else if (hasWeeklyChildren) {
                            expectedDenominator = Math.max(12, childSummaries.length);
                        }
                    } else if (parentHorizon === 'yearly') {
                        if (hasQuarterlyChildren) {
                            expectedDenominator = Math.max(4, childSummaries.length);
                        } else if (hasMonthlyChildren) {
                            expectedDenominator = Math.max(12, childSummaries.length);
                        }
                    }

                    const sumProgress = childSummaries.reduce((acc: number, c: any) => acc + c.progress, 0);
                    const avgProgress = Math.min(100, Math.round(sumProgress / expectedDenominator));

                    parent.child_goals = childSummaries;
                    parent.child_goals_count = children.length;
                    parent.child_goals_expected_count = expectedDenominator;
                    parent.child_goals_avg_progress = avgProgress;
                }
            });
        }

        return mappedGoals;
    }, [fetchedGoals, fetchedHabits, fetchedSavings, isIndo]);

    const [goals, setGoals] = useState<GoalItem[]>(parsedGoals || []);

    useEffect(() => {
        if (parsedGoals) {
            setGoals(parsedGoals);
        }
        setHasMounted(true);
    }, [parsedGoals]);

    // Calculate Global Statistics
    const globalStats = useMemo(() => {
        return calculateGlobalGoalStats(goals);
    }, [goals]);

    // Filter & Sort Pipeline
    const filteredGoals = useMemo(() => {
        return goals.filter((g) => {
            // Tab Status Filter (In Progress vs Completed)
            if (currentTab === 'active' && g.status === 'completed') return false;
            if (currentTab === 'completed' && g.status !== 'completed') return false;

            // Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = g.title.toLowerCase().includes(q);
                const matchCat = (g.category || '').toLowerCase().includes(q);
                const matchWhy = (g.core_why || '').toLowerCase().includes(q);
                const matchMilestone = (g.milestones || []).some(m => m.title.toLowerCase().includes(q));
                if (!matchTitle && !matchCat && !matchWhy && !matchMilestone) return false;
            }

            // Category Filter
            if (selectedCategory !== 'all' && g.category !== selectedCategory) {
                return false;
            }

            // Priority Filter
            if (selectedPriority !== 'all' && g.priority !== selectedPriority) {
                return false;
            }

            // Time Horizon Filter
            if (selectedTimeHorizon !== 'all') {
                const th = g.time_horizon || 'yearly';
                if (selectedTimeHorizon === 'monthly') {
                    if (th !== 'monthly' && th !== 'sprint') return false;
                } else if (selectedTimeHorizon === 'quarterly') {
                    if (th !== 'quarterly') return false;
                } else if (selectedTimeHorizon === 'yearly') {
                    if (th !== 'yearly') return false;
                } else if (selectedTimeHorizon === 'weekly') {
                    if (th !== 'weekly') return false;
                } else {
                    if (th !== selectedTimeHorizon) return false;
                }
            }

            return true;
        }).sort((a, b) => {
            // North Star priority always first if sorting by default/priority
            if (a.is_north_star && !b.is_north_star) return -1;
            if (!a.is_north_star && b.is_north_star) return 1;

            if (sortBy === 'deadline') {
                if (!a.end_date) return 1;
                if (!b.end_date) return -1;
                return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
            }
            if (sortBy === 'progress_desc') {
                return calculateGoalProgress(b) - calculateGoalProgress(a);
            }
            if (sortBy === 'progress_asc') {
                return calculateGoalProgress(a) - calculateGoalProgress(b);
            }
            if (sortBy === 'priority') {
                const prioWeight: Record<string, number> = { vital: 3, important: 2, optional: 1 };
                return (prioWeight[b.priority || 'important'] || 0) - (prioWeight[a.priority || 'important'] || 0);
            }
            if (sortBy === 'newest') {
                return Number(b.id || 0) - Number(a.id || 0);
            }
            return 0;
        });
    }, [goals, currentTab, searchQuery, selectedCategory, selectedPriority, selectedTimeHorizon, sortBy]);

    // Category Counts Map
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        goals.forEach(g => {
            const cat = g.category || 'other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [goals]);

    // Actions
    const handleOpenCreateModal = () => {
        setEditingGoal(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (goal: GoalItem) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleSaveGoal = async (form: GoalItem) => {
        setIsModalOpen(false);
        const specificMetadata = JSON.stringify({
            icon: form.icon || '🎯',
            start_value: form.start_value,
            unit: form.unit,
            currency: form.currency,
            linked_source: form.linked_source || 'manual',
            linked_account_id: form.linked_account_id || null,
            linked_account_title: form.linked_account_title || null,
            linked_habit_ids: form.linked_habit_ids || [],
            parent_goal_id: form.parent_goal_id ? Number(form.parent_goal_id) : null,
            time_horizon: form.time_horizon || 'yearly',
            is_north_star: Boolean(form.is_north_star),
            core_why: form.core_why || '',
            obstacle: form.obstacle || '',
            obstacle_plan: form.obstacle_plan || '',
            reward: form.reward || '',
            notes: form.notes || '',
            progress_type: form.type || 'milestones'
        });

        if (form.category && form.category !== 'other') {
            saveCategoryBundle({
                name: form.category,
                icon: form.icon || '🎯',
                color: form.color || '#6366f1'
            });
        }

        try {
            if (editingGoal) {
                // Optimistic update
                setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...form, icon: form.icon || '🎯', specific_days: specificMetadata } : g));
                const res = await fetch(`/api/goals/${editingGoal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, 
                        category: form.category, 
                        type: form.type || 'milestones',
                        status: form.status || 'active',
                        priority: form.priority || 'important',
                        time_horizon: form.time_horizon || 'yearly',
                        is_north_star: form.is_north_star,
                        parentGoalId: form.parent_goal_id ? Number(form.parent_goal_id) : null,
                        parent_goal_id: form.parent_goal_id ? Number(form.parent_goal_id) : null,
                        start_value: Number(form.start_value || 0),
                        startValue: Number(form.start_value || 0),
                        current_value: Number(form.current_value || 0),
                        currentValue: Number(form.current_value || 0),
                        target_value: Number(form.target_value || 0),
                        targetValue: Number(form.target_value || 0),
                        unit: form.unit,
                        currency: form.currency,
                        core_why: form.core_why,
                        obstacle: form.obstacle,
                        obstacle_plan: form.obstacle_plan,
                        reward: form.reward,
                        color: form.color,
                        startDate: form.start_date || null, 
                        start_date: form.start_date || null,
                        endDate: form.end_date || null,
                        end_date: form.end_date || null,
                        coverImageUrl: form.cover_image_url || null,
                        cover_image_url: form.cover_image_url || null,
                        specificDays: specificMetadata,
                        specific_days: specificMetadata
                    })
                });
                if (res.ok) {
                    await mutateGoals();
                } else {
                    const errText = await res.text().catch(() => '');
                    let errMsg = '';
                    try {
                        const parsed = JSON.parse(errText);
                        errMsg = parsed.error || parsed.message || '';
                    } catch {
                        errMsg = errText;
                    }
                    if (!errMsg) {
                        errMsg = isIndo ? 'Gagal memperbarui target' : 'Failed to update goal';
                    }
                    console.error('Failed to update goal:', errMsg);
                    alert(errMsg);
                    await mutateGoals();
                }
            } else {
                // Optimistic update
                const tempId = Date.now();
                setGoals(prev => [{ ...form, id: tempId, icon: form.icon || '🎯', milestones: form.milestones || [], status: 'active', specific_days: specificMetadata }, ...prev]);
                const res = await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, 
                        category: form.category, 
                        type: form.type || 'milestones',
                        status: 'active',
                        priority: form.priority || 'important',
                        time_horizon: form.time_horizon || 'yearly',
                        is_north_star: form.is_north_star,
                        parentGoalId: form.parent_goal_id ? Number(form.parent_goal_id) : null,
                        parent_goal_id: form.parent_goal_id ? Number(form.parent_goal_id) : null,
                        start_value: Number(form.start_value || 0),
                        startValue: Number(form.start_value || 0),
                        current_value: Number(form.current_value || 0),
                        currentValue: Number(form.current_value || 0),
                        target_value: Number(form.target_value || 0),
                        targetValue: Number(form.target_value || 0),
                        unit: form.unit,
                        currency: form.currency,
                        core_why: form.core_why,
                        obstacle: form.obstacle,
                        obstacle_plan: form.obstacle_plan,
                        reward: form.reward,
                        color: form.color,
                        startDate: form.start_date || null, 
                        start_date: form.start_date || null,
                        endDate: form.end_date || null,
                        end_date: form.end_date || null,
                        coverImageUrl: form.cover_image_url || null,
                        cover_image_url: form.cover_image_url || null,
                        specificDays: specificMetadata,
                        specific_days: specificMetadata,
                        milestones: form.milestones || []
                    })
                });
                if (res.ok) {
                    const saved = await res.json().catch(() => null);
                    if (saved && saved.id) {
                        setGoals(prev => prev.map(g => g.id === tempId ? { ...g, ...saved, icon: form.icon || '🎯', milestones: saved.milestones || form.milestones || [] } : g));
                    }
                    await mutateGoals();
                } else {
                    const errText = await res.text().catch(() => '');
                    let errMsg = '';
                    try {
                        const parsed = JSON.parse(errText);
                        errMsg = parsed.error || parsed.message || '';
                    } catch {
                        errMsg = errText;
                    }
                    if (!errMsg) {
                        errMsg = isIndo ? 'Gagal menyimpan target' : 'Failed to create goal';
                    }
                    console.error('Failed to create goal:', errMsg);
                    alert(errMsg);
                    // Revert optimistic insert
                    setGoals(prev => prev.filter(g => g.id !== tempId));
                    await mutateGoals();
                }
            }
        } catch (error) {
            console.error('Failed to save goal:', error);
            await mutateGoals();
        }
    };

    const handleSaveGoalNotes = async (
        targetGoal: GoalItem, 
        updatedNotes: string, 
        updatedWoop?: { core_why?: string; obstacle?: string; obstacle_plan?: string; reward?: string }
    ) => {
        // Optimistically update goals state
        setGoals(prev => prev.map(g => {
            if (String(g.id) !== String(targetGoal.id)) return g;
            return {
                ...g,
                notes: updatedNotes,
                ...(updatedWoop ? updatedWoop : {})
            };
        }));
        setNotesGoal(prev => prev && String(prev.id) === String(targetGoal.id) ? {
            ...prev,
            notes: updatedNotes,
            ...(updatedWoop ? updatedWoop : {})
        } : prev);

        let meta: any = {};
        if (targetGoal.specific_days && typeof targetGoal.specific_days === 'string') {
            try { meta = JSON.parse(targetGoal.specific_days); } catch {}
        } else if (targetGoal.specific_days && typeof targetGoal.specific_days === 'object') {
            meta = Object.assign({}, targetGoal.specific_days as Record<string, any>);
        }
        meta.notes = updatedNotes;
        if (updatedWoop?.core_why !== undefined) meta.core_why = updatedWoop.core_why;
        if (updatedWoop?.obstacle !== undefined) meta.obstacle = updatedWoop.obstacle;
        if (updatedWoop?.obstacle_plan !== undefined) meta.obstacle_plan = updatedWoop.obstacle_plan;
        if (updatedWoop?.reward !== undefined) meta.reward = updatedWoop.reward;

        const specificMetadata = JSON.stringify(meta);

        try {
            await fetch(`/api/goals/${targetGoal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: targetGoal.title,
                    notes: updatedNotes,
                    core_why: updatedWoop?.core_why ?? targetGoal.core_why,
                    obstacle: updatedWoop?.obstacle ?? targetGoal.obstacle,
                    obstacle_plan: updatedWoop?.obstacle_plan ?? targetGoal.obstacle_plan,
                    reward: updatedWoop?.reward ?? targetGoal.reward,
                    specificDays: specificMetadata,
                    specific_days: specificMetadata
                })
            });
            await mutateGoals();
        } catch (err) {
            console.error('Failed to update goal notes:', err);
        }
    };

    const handleDeleteCategory = async (categoryToDelete: string) => {
        if (!categoryToDelete || categoryToDelete === 'other') return;
        removeCategoryBundle(categoryToDelete);

        // Optimistically update goals state
        setGoals(prev => prev.map(g => (g.category === categoryToDelete ? { ...g, category: 'other' } : g)));

        if (selectedCategory === categoryToDelete) {
            setSelectedCategory('all');
        }

        try {
            const affectedGoals = (goals || []).filter(g => g.category === categoryToDelete);

            await Promise.all(
                affectedGoals.map(async (g) => {
                    await fetch(`/api/goals/${g.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ category: 'other' })
                    }).catch(err => console.error(`Failed to update category for goal ${g.id}:`, err));
                })
            );

            await mutateGoals();
        } catch (err) {
            console.error('Failed to delete category:', err);
            await mutateGoals();
        }
    };

    const handleRequestDeleteGoal = (goalOrId: GoalItem | number | string) => {
        if (typeof goalOrId === 'object' && goalOrId !== null) {
            setGoalToDelete(goalOrId);
        } else {
            const found = goals.find(g => String(g.id) === String(goalOrId));
            if (found) {
                setGoalToDelete(found);
            } else {
                setGoalToDelete({ id: goalOrId, title: isIndo ? 'Target ini' : 'This goal' } as GoalItem);
            }
        }
    };

    const handleConfirmDeleteGoal = async () => {
        if (!goalToDelete) return;
        const targetId = goalToDelete.id;
        setIsDeletingGoal(true);
        // Optimistic UI update
        setGoals(prev => prev.filter(g => g.id !== targetId));
        try {
            await fetch(`/api/goals/${targetId}`, { method: 'DELETE' });
            await mutateGoals();
            setGoalToDelete(null);
        } catch (error) {
            console.error('Failed to delete goal:', error);
            await mutateGoals();
        } finally {
            setIsDeletingGoal(false);
        }
    };

    const handleCompleteGoal = async (goal: GoalItem) => {
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: 'completed' } : g));
        setCelebratingGoal(goal);
        setIsCelebrationOpen(true);

        try {
            await fetch(`/api/goals/${goal.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ status: 'completed' }) 
            });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    const handleMarkAsActive = async (goal: GoalItem) => {
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: 'active' } : g));
        try {
            await fetch(`/api/goals/${goal.id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ status: 'active' }) 
            });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    const handleToggleNorthStar = async (goal: GoalItem) => {
        const nextState = !goal.is_north_star;
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, is_north_star: nextState } : g));
        try {
            await fetch(`/api/goals/${goal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_north_star: nextState })
            });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    const handleQuickIncrement = async (goal: GoalItem, delta: number) => {
        const current = Number(goal.current_value) || 0;
        const target = Number(goal.target_value) || 0;
        const nextVal = Math.max(0, current + delta);

        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, current_value: nextVal } : g));

        if (nextVal >= target && target > 0 && goal.status !== 'completed') {
            setCelebratingGoal({ ...goal, current_value: nextVal });
            setIsCelebrationOpen(true);
        }

        try {
            await fetch(`/api/goals/${goal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_value: nextVal })
            });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    // Milestones Handlers
    const handleAddMilestone = async (goal: GoalItem) => {
        try {
            const res = await fetch(`/api/goals/${goal.id}/milestones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: isIndo ? 'Langkah Baru' : 'New Step', 
                    completed: false, 
                    order: (goal.milestones?.length || 0) + 1 
                })
            });
            if (res.ok) {
                const data = await res.json();
                const newMs: Milestone = { 
                    id: data.id, 
                    title: data.title, 
                    is_completed: data.completed, 
                    completed: data.completed 
                };
                setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: [...(g.milestones || []), newMs] } : g));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveMilestone = async (goal: GoalItem, data: Milestone) => {
        try {
            await fetch(`/api/goals/${goal.id}/milestones/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: data.title })
            });
            setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: (g.milestones || []).map(m => m.id === data.id ? { ...m, ...data } : m) } : g));
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleMilestone = async (goal: GoalItem, m: Milestone) => {
        const nextState = !(m.is_completed || m.completed);
        const updatedMilestones = (goal.milestones || []).map(ms => ms.id === m.id ? { ...ms, is_completed: nextState, completed: nextState } : ms);
        
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: updatedMilestones } : g));

        const updatedGoal = { ...goal, milestones: updatedMilestones };
        if (calculateGoalProgress(updatedGoal) >= 100 && goal.status !== 'completed') {
            setCelebratingGoal(updatedGoal);
            setIsCelebrationOpen(true);
        }

        try {
            await fetch(`/api/goals/${goal.id}/milestones/${m.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: nextState })
            });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    const handleDeleteMilestone = async (goal: GoalItem, mId: number | string | null | undefined) => {
        if (!mId) return;
        const idNum = Number(mId);
        setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: (g.milestones || []).filter(ms => ms.id !== idNum) } : g));
        try {
            await fetch(`/api/goals/${goal.id}/milestones/${idNum}`, { method: 'DELETE' });
            mutateGoals();
        } catch (error) {
            console.error(error);
            mutateGoals();
        }
    };

    const handleToggleHabitToday = async (habitId: number | string, currentDone: boolean) => {
        const nextDone = !currentDone;
        const todayStr = new Date().toISOString().split('T')[0];

        // Optimistic UI update across all goals that link this habit
        setGoals(prev => prev.map(g => {
            if (!g.linked_habits || g.linked_habits.length === 0) return g;
            const updatedHabits = g.linked_habits.map(h => {
                if (String(h.id) === String(habitId)) {
                    const newStreak = nextDone ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 0) - 1);
                    return {
                        ...h,
                        completedToday: nextDone,
                        streak: newStreak
                    };
                }
                return h;
            });
            return { ...g, linked_habits: updatedHabits };
        }));

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: todayStr,
                    status: nextDone ? 'completed' : 'empty'
                })
            });
            mutateHabits();
            mutateGoals();
        } catch (e) {
            console.error('Failed to toggle habit log from goal card', e);
            mutateHabits();
            mutateGoals();
        }
    };

    if (!hasMounted) {
        return (
            <AuthenticatedLayout>
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <GatedPage feature="goals">
                <div className="goal-tracker-page min-h-screen bg-slate-50/50 dark:bg-slate-950/50 w-full max-w-full overflow-x-hidden">
                    
                    {/* Header Top Bar */}
                    <GoalHeader onAddClick={handleOpenCreateModal} />

                    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24 min-w-0">
                        {/* TABS NAVIGATION (Active / In Progress vs Completed) */}
                        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 p-1.5 rounded-2xl w-fit max-w-full overflow-x-auto no-scrollbar shadow-sm border border-slate-200/80 dark:border-slate-800 relative z-10">
                            <button 
                                type="button"
                                onClick={() => setCurrentTab('active')}
                                className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                                    currentTab === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {isIndo ? 'Sedang Berjalan' : 'In Progress'}
                                <span className="ml-1 opacity-70">({globalStats.activeCount})</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setCurrentTab('completed')}
                                className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                                    currentTab === 'completed' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {isIndo ? 'Telah Tercapai 🏆' : 'Completed 🏆'}
                                <span className="ml-1 opacity-70">({globalStats.completedCount})</span>
                            </button>
                        </div>

                        {/* Global Stats Command Center */}
                        <GoalStats stats={globalStats} goals={goals} />

                        {/* Search, Time Horizon & Multi-View Filter Bar */}
                        <GoalFilterBar 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedPriority={selectedPriority}
                            setSelectedPriority={setSelectedPriority}
                            selectedTimeHorizon={selectedTimeHorizon}
                            setSelectedTimeHorizon={setSelectedTimeHorizon}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            totalCount={goals.length}
                            filteredCount={filteredGoals.length}
                            categoryCounts={categoryCounts}
                            onOpenExportModal={() => setIsExportOpen(true)}
                            onDeleteCategory={handleDeleteCategory}
                        />

                        {/* VIEW MODE RENDERER */}
                        {goals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-6 relative">
                                    <Target className="w-12 h-12 stroke-[2] animate-pulse" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center animate-bounce shadow-lg">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                                    {isIndo ? 'Rancang Target & Visi Pertama Anda' : 'Begin Your First Vision'}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-8 leading-relaxed text-xs sm:text-sm">
                                    {isIndo 
                                        ? 'Pilih tipe target (Angka, Finansial, OKR), tetapkan tanggal, dan tentukan motivasi utama untuk mulai mewujudkannya.'
                                        : 'Define your vision using metric counter, financial currency, or OKR milestones to start executing today.'}
                                </p>
                                <button 
                                    type="button"
                                    onClick={handleOpenCreateModal} 
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 text-xs sm:text-sm"
                                >
                                    <Plus className="w-4.5 h-4.5 stroke-[3]" />
                                    <span>{isIndo ? 'Buat Target Baru' : 'Create New Goal'}</span>
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* 1. GALLERY GRID VIEW */}
                                {viewMode === 'gallery' && (
                                    filteredGoals.length === 0 ? (
                                        <div className="py-16 text-center bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/60 dark:border-slate-800">
                                            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Tidak ada target yang sesuai dengan filter pencarian.' : 'No goals match your search and filter criteria.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                                            {filteredGoals.map((goal) => (
                                                <GoalCard
                                                    key={goal.id}
                                                    goal={goal}
                                                    onEdit={handleOpenEditModal}
                                                    onDelete={handleRequestDeleteGoal}
                                                    onOpenNotes={setNotesGoal}
                                                    onSaveMilestone={handleSaveMilestone}
                                                    onAddMilestone={handleAddMilestone}
                                                    onToggleMilestone={handleToggleMilestone}
                                                    onDeleteMilestone={handleDeleteMilestone}
                                                    onCompleteGoal={handleCompleteGoal}
                                                    onMarkAsActive={handleMarkAsActive}
                                                    onToggleNorthStar={handleToggleNorthStar}
                                                    onQuickIncrement={handleQuickIncrement}
                                                    onToggleHabitToday={handleToggleHabitToday}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* 2. KANBAN PIPELINE VIEW */}
                                {viewMode === 'kanban' && (
                                    <GoalKanbanView 
                                        goals={filteredGoals}
                                        onEdit={handleOpenEditModal}
                                        onDelete={handleRequestDeleteGoal}
                                        onOpenNotes={setNotesGoal}
                                        onQuickIncrement={handleQuickIncrement}
                                        onCompleteGoal={handleCompleteGoal}
                                        onMarkAsActive={handleMarkAsActive}
                                        onAddClick={handleOpenCreateModal}
                                    />
                                )}

                                {/* 3. TIMELINE ROADMAP VIEW */}
                                {viewMode === 'timeline' && (
                                    <GoalTimelineView 
                                        goals={filteredGoals}
                                        onEdit={handleOpenEditModal}
                                    />
                                )}

                                {/* 4. WHEEL OF LIFE BALANCE VIEW */}
                                {viewMode === 'wheel_of_life' && (
                                    <GoalWheelOfLifeView 
                                        goals={goals}
                                        onEdit={handleOpenEditModal}
                                    />
                                )}
                            </div>
                        )}

                    </div>

                    {/* Create / Edit Goal Modal */}
                    <GoalModal 
                        show={isModalOpen}
                        goal={editingGoal}
                        allGoals={goals}
                        defaultTimeHorizon={selectedTimeHorizon}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveGoal}
                        onDeleteCategory={handleDeleteCategory}
                    />

                    {/* Goal Notes & Reflection Modal (with Journal Sync) */}
                    <GoalNotesModal
                        isOpen={Boolean(notesGoal)}
                        onClose={() => setNotesGoal(null)}
                        goal={notesGoal}
                        onSaveNotes={handleSaveGoalNotes}
                    />

                    {/* Victory Celebration Modal */}
                    <GoalCelebrationModal
                        goal={celebratingGoal}
                        isOpen={isCelebrationOpen}
                        onClose={() => setIsCelebrationOpen(false)}
                    />

                    {/* Universal Export Modal (CSV & JSON) */}
                    <ExportModal
                        isOpen={isExportOpen}
                        onClose={() => setIsExportOpen(false)}
                        moduleType="goals"
                        currentData={goals}
                    />

                    {/* Custom Bilingual Delete Confirmation Modal */}
                    <GoalDeleteModal
                        goal={goalToDelete}
                        isOpen={Boolean(goalToDelete)}
                        isDeleting={isDeletingGoal}
                        onClose={() => setGoalToDelete(null)}
                        onConfirm={handleConfirmDeleteGoal}
                    />

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
