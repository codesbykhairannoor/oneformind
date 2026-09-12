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
import NeuralBridge from '@/components/NeuralBridge';
import GatedPage from '@/components/GatedPage';
import { Milestone } from './components/MilestoneItem';
import { 
    calculateGoalProgress, 
    calculateGoalPace, 
    calculateGlobalGoalStats 
} from './lib/goalPaceCalculator';
import { Target, Sparkles, Plus } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function GoalsPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const [isExportOpen, setIsExportOpen] = useState(false);

    const [currentTab, setCurrentTab] = useState<'active' | 'completed'>('active');
    const [viewMode, setViewMode] = useState<GoalViewMode>('gallery');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedTimeHorizon, setSelectedTimeHorizon] = useState('all');
    const [sortBy, setSortBy] = useState<GoalSortOption>('deadline');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

    const [celebratingGoal, setCelebratingGoal] = useState<GoalItem | null>(null);
    const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

    const [hasMounted, setHasMounted] = useState(false);

    const { data: fetchedGoals, mutate: mutateGoals } = useSWR('/api/goals', fetcher);

    const parsedGoals = useMemo(() => {
        if (!fetchedGoals || !Array.isArray(fetchedGoals)) return null;
        return fetchedGoals.map((g: any) => ({
            id: g.id,
            title: g.title,
            color: g.color || '#6366f1',
            type: g.type || 'milestones',
            status: g.status || 'active',
            priority: g.priority || 'important',
            category: g.category || 'other',
            time_horizon: g.time_horizon || g.timeHorizon || 'yearly',
            is_north_star: Boolean(g.is_north_star || g.isNorthStar),
            start_value: Number(g.start_value ?? g.startValue ?? 0),
            current_value: Number(g.current_value ?? g.currentValue ?? 0),
            target_value: Number(g.target_value ?? g.targetValue ?? 10),
            unit: g.unit || (isIndo ? 'buku' : 'books'),
            currency: g.currency || 'IDR',
            core_why: g.core_why || g.coreWhy || '',
            obstacle: g.obstacle || '',
            obstacle_plan: g.obstacle_plan || g.obstaclePlan || '',
            reward: g.reward || '',
            start_date: g.startDate ? g.startDate.split('T')[0] : (g.start_date || ''),
            end_date: g.endDate ? g.endDate.split('T')[0] : (g.end_date || ''),
            cover_image_url: g.cover_image_url || g.coverImageUrl || '',
            milestones: (g.milestones || []).map((m: any) => ({
                id: m.id,
                title: m.title,
                is_completed: Boolean(m.completed || m.is_completed),
                completed: Boolean(m.completed || m.is_completed),
                weight: Number(m.weight || 1),
                target_date: m.target_date || m.targetDate || null
            })),
        }));
    }, [fetchedGoals, isIndo]);

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
            const isCompleted = g.status === 'completed' || calculateGoalProgress(g) >= 100;
            if (currentTab === 'active' && isCompleted) return false;
            if (currentTab === 'completed' && !isCompleted) return false;

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
                if (th !== selectedTimeHorizon) return false;
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
        try {
            if (editingGoal) {
                // Optimistic update
                setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...form } : g));
                const res = await fetch(`/api/goals/${editingGoal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, 
                        category: form.category, 
                        type: form.type,
                        status: form.status,
                        priority: form.priority,
                        time_horizon: form.time_horizon,
                        is_north_star: form.is_north_star,
                        start_value: form.start_value,
                        current_value: form.current_value,
                        target_value: form.target_value,
                        unit: form.unit,
                        currency: form.currency,
                        core_why: form.core_why,
                        obstacle: form.obstacle,
                        obstacle_plan: form.obstacle_plan,
                        reward: form.reward,
                        startDate: form.start_date, 
                        endDate: form.end_date,
                        coverImageUrl: form.cover_image_url,
                        cover_image_url: form.cover_image_url
                    })
                });
                if (res.ok) mutateGoals();
            } else {
                // Optimistic update
                const tempId = Date.now();
                setGoals(prev => [{ ...form, id: tempId, milestones: [], status: 'active' }, ...prev]);
                const res = await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, 
                        category: form.category, 
                        type: form.type || 'milestones',
                        status: 'active',
                        priority: form.priority,
                        time_horizon: form.time_horizon || 'yearly',
                        is_north_star: form.is_north_star,
                        start_value: form.start_value,
                        current_value: form.current_value,
                        target_value: form.target_value,
                        unit: form.unit,
                        currency: form.currency,
                        core_why: form.core_why,
                        obstacle: form.obstacle,
                        obstacle_plan: form.obstacle_plan,
                        reward: form.reward,
                        color: form.color,
                        startDate: form.start_date, 
                        endDate: form.end_date,
                        coverImageUrl: form.cover_image_url,
                        cover_image_url: form.cover_image_url
                    })
                });
                if (res.ok) mutateGoals();
            }
        } catch (error) {
            console.error('Failed to save goal:', error);
            mutateGoals();
        }
    };

    const handleDeleteGoal = async (id: number | string) => {
        if (typeof window !== 'undefined' && window.confirm(isIndo ? 'Hapus Target ini? Data akan dihapus.' : 'Delete this goal permanently?')) {
            setGoals(prev => prev.filter(g => g.id !== id));
            try {
                await fetch(`/api/goals/${id}`, { method: 'DELETE' });
                mutateGoals();
            } catch (error) {
                console.error('Failed to delete goal:', error);
                mutateGoals();
            }
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
                <div className="goal-tracker-page min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
                    
                    {/* Header Top Bar */}
                    <GoalHeader onAddClick={handleOpenCreateModal} />

                    <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-24 min-w-0">
                        <NeuralBridge module="Goal" />

                        {/* TABS NAVIGATION (Active / In Progress vs Completed) */}
                        <div className="flex items-center gap-2 mb-4 bg-white dark:bg-slate-900 p-1.5 rounded-2xl w-fit shadow-sm border border-slate-200/80 dark:border-slate-800 relative z-10">
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
                                                    onDelete={handleDeleteGoal}
                                                    onSaveMilestone={handleSaveMilestone}
                                                    onAddMilestone={handleAddMilestone}
                                                    onToggleMilestone={handleToggleMilestone}
                                                    onDeleteMilestone={handleDeleteMilestone}
                                                    onCompleteGoal={handleCompleteGoal}
                                                    onMarkAsActive={handleMarkAsActive}
                                                    onToggleNorthStar={handleToggleNorthStar}
                                                    onQuickIncrement={handleQuickIncrement}
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
                                        onDelete={handleDeleteGoal}
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
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveGoal}
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

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
