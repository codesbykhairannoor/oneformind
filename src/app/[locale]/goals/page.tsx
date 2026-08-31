'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GoalHeader from './components/GoalHeader';
import GoalStats from './components/GoalStats';
import GoalCard, { GoalItem } from './components/GoalCard';
import GoalModal from './components/GoalModal';
import NeuralBridge from '@/components/NeuralBridge';
import GatedPage from '@/components/GatedPage';
import { Milestone } from './components/MilestoneItem';
import { Target, Sparkles } from 'lucide-react';

export default function GoalsPage() {
    const t = useTranslations();
    const [currentTab, setCurrentTab] = useState<'active' | 'completed'>('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);

    const [hasMounted, setHasMounted] = useState(false);

    const [goals, setGoals] = useState<GoalItem[]>([]);

    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { data: fetchedGoals } = useSWR('/api/goals', fetcher);

    useEffect(() => {
        if (fetchedGoals) {
            const mapped = fetchedGoals.map((g: any) => ({
                id: g.id,
                title: g.title,
                color: g.color || '#6366f1',
                type: g.type,
                status: g.status,
                priority: g.priority,
                reward: g.reward || '',
                start_date: g.startDate ? g.startDate.split('T')[0] : '',
                end_date: g.endDate ? g.endDate.split('T')[0] : '',
                category: g.category || '',
                milestones: (g.milestones || []).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    is_completed: m.completed,
                    completed: m.completed,
                })),
            }));
            setGoals(mapped);
        }
        setHasMounted(true);
    }, [fetchedGoals]);

    // Stats Calculation
    const activeGoals = goals.filter(g => g.status !== 'completed');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const displayedGoals = currentTab === 'active' ? activeGoals : completedGoals;

    let totalMilestones = 0;
    let completedMilestones = 0;
    let totalProgressSum = 0;

    goals.forEach(g => {
        const ms = g.milestones || [];
        totalMilestones += ms.length;
        const comp = ms.filter(m => m.is_completed || m.completed).length;
        completedMilestones += comp;
        const p = ms.length === 0 ? 0 : Math.round((comp / ms.length) * 100);
        totalProgressSum += p;
    });

    const avgProgress = goals.length === 0 ? 0 : Math.round(totalProgressSum / goals.length);

    const urgentGoal = activeGoals.find(g => g.end_date);
    const urgentDaysLeft = urgentGoal ? Math.max(0, Math.ceil((new Date(urgentGoal.end_date as string).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;

    const stats = {
        avg_progress: avgProgress,
        top_goal_title: activeGoals[0]?.title || 'No Active Vision',
        top_goal_progress: activeGoals[0]?.milestones?.length 
            ? Math.round((activeGoals[0].milestones.filter(m => m.is_completed || m.completed).length / activeGoals[0].milestones.length) * 100)
            : 0,
        urgent_goal_title: urgentGoal?.title || activeGoals[0]?.title || 'No Active Vision',
        urgent_goal_days_left: urgentDaysLeft,
        milestones_completed: completedMilestones,
        milestones_total: totalMilestones,
        active: activeGoals.length,
        completed: completedGoals.length
    };

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
        try {
            if (editingGoal) {
                const res = await fetch(`/api/goals/${editingGoal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, category: form.category, type: form.type,
                        startDate: form.start_date, endDate: form.end_date, status: form.status,
                        reward: form.reward, priority: form.priority, color: form.color
                    })
                });
                if (res.ok) {
                    setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...form } : g));
                }
            } else {
                const res = await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title, category: form.category, type: form.type || 'daily',
                        startDate: form.start_date, endDate: form.end_date, status: 'active',
                        reward: form.reward, priority: form.priority, color: form.color
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    const newGoal: GoalItem = { ...form, id: data.id, milestones: [] };
                    setGoals(prev => [newGoal, ...prev]);
                }
            }
        } catch (error) {
            console.error('Failed to save goal:', error);
        }
        setIsModalOpen(false);
    };

    const handleDeleteGoal = async (id: number | string) => {
        if (typeof window !== 'undefined' && window.confirm('Hapus Goal ini? Data akan hilang selamanya.')) {
            try {
                await fetch(`/api/goals/${id}`, { method: 'DELETE' });
                setGoals(prev => prev.filter(g => g.id !== id));
            } catch (error) {
                console.error('Failed to delete goal:', error);
            }
        }
    };

    const handleCompleteGoal = async (goal: GoalItem) => {
        try {
            await fetch(`/api/goals/${goal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) });
            setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: 'completed' } : g));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsActive = async (goal: GoalItem) => {
        try {
            await fetch(`/api/goals/${goal.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'active' }) });
            setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: 'active' } : g));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddMilestone = async (goal: GoalItem) => {
        try {
            const res = await fetch(`/api/goals/${goal.id}/milestones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Langkah Baru', completed: false, order: (goal.milestones?.length || 0) + 1 })
            });
            if (res.ok) {
                const data = await res.json();
                const newMs: Milestone = { id: data.id, title: data.title, is_completed: data.completed, completed: data.completed };
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
        try {
            await fetch(`/api/goals/${goal.id}/milestones/${m.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: nextState })
            });
            setGoals(prev => prev.map(g => g.id === goal.id ? {
                ...g, milestones: (g.milestones || []).map(item => item.id === m.id ? { ...item, is_completed: nextState, completed: nextState } : item)
            } : g));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMilestone = async (goal: GoalItem, mId: number | string | null | undefined) => {
        if (!mId) return;
        try {
            await fetch(`/api/goals/${goal.id}/milestones/${mId}`, { method: 'DELETE' });
            setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: (g.milestones || []).filter(m => m.id !== mId) } : g));
        } catch (error) {
            console.error(error);
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
                {/* 1:1 from Goal/Index.vue line 92-176 */}
                <div className="goal-tracker-page min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
                <GoalHeader onAddClick={handleOpenCreateModal} />

                <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-8 pb-24 min-w-0">
                    <NeuralBridge module="Goal" />

                    {/* TABS NAVIGATION */}
                    <div className="flex items-center gap-2 mb-6 bg-white dark:bg-slate-900 p-1.5 rounded-2xl w-fit shadow-sm border border-slate-100 dark:border-slate-800 relative z-10">
                        <button 
                            type="button"
                            onClick={() => setCurrentTab('active')}
                            className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                                currentTab === 'active' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {t('goal_tab_progress') || 'In Progress'}
                            <span className="ml-1 opacity-70">({stats.active})</span>
                        </button>
                        <button 
                            type="button"
                            onClick={() => setCurrentTab('completed')}
                            className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                                currentTab === 'completed' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {t('goal_tab_completed') || 'Completed'}
                            <span className="ml-1 opacity-70">({stats.completed})</span>
                        </button>
                    </div>

                    {/* Global Stats Section */}
                    <GoalStats stats={stats} goals={goals} />

                    {/* Goals Grid */}
                    {displayedGoals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {displayedGoals.map((goal) => (
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
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-6 relative">
                                <Target className="w-12 h-12 stroke-[2] animate-pulse" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center animate-bounce shadow-lg">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                                {t('goal_empty_title') || 'Belum Ada Target'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                                {t('goal_empty_desc') || 'Mulai rancang masa depan Anda. Tetapkan target besar pertama Anda dan pecah menjadi langkah-langkah kecil yang bisa dicapai.'}
                            </p>
                            <button 
                                type="button"
                                onClick={handleOpenCreateModal} 
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Target className="w-4.5 h-4.5 stroke-[3]" />
                                <span>{t('goal_create_new') || 'Buat Target Baru'}</span>
                            </button>
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
                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
