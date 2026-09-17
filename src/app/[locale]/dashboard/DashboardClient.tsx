'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useGating } from '@/hooks/useGating';
import { useActiveModules } from '@/hooks/useActiveModules';
import DashboardHero from '@/app/[locale]/dashboard/components/DashboardHero';
import DashboardQuickToolbar from '@/app/[locale]/dashboard/components/DashboardQuickToolbar';
import DashboardTodayTasks from '@/app/[locale]/dashboard/components/DashboardTodayTasks';
import DashboardStudyRadar from '@/app/[locale]/dashboard/components/DashboardStudyRadar';
import DashboardAiGatingBanner from '@/app/[locale]/dashboard/components/DashboardAiGatingBanner';
import DashboardSidebarWidgets from '@/app/[locale]/dashboard/components/DashboardSidebarWidgets';

export default function DashboardClient({ user, synergy, locale }: { user: any; synergy: any; locale: string }) {
    const t = useTranslations();
    const [loadingInsight] = useState(false);
    const [globalInsight] = useState<any>({
        summary: locale === 'id' 
            ? 'Performa habit, agenda, dan fokus akademik Anda terhubung harmonis minggu ini. Tetap pertahankan momentum!'
            : 'Your habits, planner tasks, and academic focus are harmoniously connected this week. Keep up the strong momentum!'
    });

    const { isExplorer, isAiEnabled, trial, isTrialActive } = useGating();
    const { isTabActive } = useActiveModules();

    const isHabitActive = isTabActive('habit');
    const isPlannerActive = isTabActive('planner');
    const isStudyActive = isTabActive('study');
    const isFinanceActive = isTabActive('finance');
    const isGoalActive = isTabActive('goal');
    const isJournalActive = isTabActive('journal');

    const plannerData = synergy?.planner || { upcoming: [], total: 0, completed: 0 };
    const trend = synergy?.trend || [];
    const trendMax = Math.max(...trend.map((d: any) => d.score), 1);

    // Calculate integrated Life Synergy score adaptively based on active modules with real data
    const activeScores: number[] = [];
    if (isHabitActive && synergy.habits && synergy.habits.total > 0) {
        activeScores.push(synergy.habits.percent || 0);
    }
    if (isPlannerActive && synergy.planner && synergy.planner.total > 0) {
        activeScores.push(Math.round((synergy.planner.completed / synergy.planner.total) * 100));
    }
    if (isGoalActive && synergy.goals?.top_goal && typeof synergy.goals.top_goal.percent === 'number') {
        activeScores.push(synergy.goals.top_goal.percent);
    }
    if (isJournalActive && synergy.journal?.is_written) {
        activeScores.push(100);
    }

    const hasAnyTrackedItems = (isHabitActive && (synergy.habits?.total || 0) > 0) ||
        (isPlannerActive && (synergy.planner?.total || 0) > 0) ||
        (isGoalActive && Boolean(synergy.goals?.top_goal)) ||
        (isJournalActive && Boolean(synergy.journal?.is_written));

    const overallScore = hasAnyTrackedItems
        ? (activeScores.length > 0 ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length) : 0)
        : 100;

    return (
        <AuthenticatedLayout user={user}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
                <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-gradient-to-b from-indigo-500/[0.06] to-transparent dark:from-indigo-500/10" />

                <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
                    
                    <DashboardHero
                        user={user}
                        synergy={synergy}
                        t={t}
                        overallScore={overallScore}
                    />

                    <DashboardQuickToolbar t={t} />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                        
                        {/* Main Column (8 Cols) */}
                        <div className="space-y-6 lg:col-span-8">
                            <DashboardTodayTasks
                                plannerData={plannerData}
                                synergy={synergy}
                                t={t}
                            />

                            {/* Academic Radar & Knowledge / Book Tracker (Only if Study module active) */}
                            {isStudyActive && synergy.study && (
                                <DashboardStudyRadar
                                    studyData={synergy.study}
                                    t={t}
                                    locale={locale}
                                />
                            )}

                            <DashboardAiGatingBanner
                                isAiEnabled={isAiEnabled}
                                isTrialActive={isTrialActive}
                                isExplorer={isExplorer}
                                trial={trial}
                                locale={locale}
                                loadingInsight={loadingInsight}
                                globalInsight={globalInsight}
                                t={t}
                            />
                        </div>

                        {/* Sidebar Column (4 Cols) */}
                        <DashboardSidebarWidgets
                            trend={trend}
                            trendMax={trendMax}
                            synergy={synergy}
                            t={t}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
