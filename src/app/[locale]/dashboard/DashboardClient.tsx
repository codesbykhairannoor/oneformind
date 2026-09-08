'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { useGating } from '@/hooks/useGating';
import DashboardHero from '@/app/[locale]/dashboard/components/DashboardHero';
import DashboardQuickToolbar from '@/app/[locale]/dashboard/components/DashboardQuickToolbar';
import DashboardTodayTasks from '@/app/[locale]/dashboard/components/DashboardTodayTasks';
import DashboardAiGatingBanner from '@/app/[locale]/dashboard/components/DashboardAiGatingBanner';
import DashboardSidebarWidgets from '@/app/[locale]/dashboard/components/DashboardSidebarWidgets';

export default function DashboardClient({ user, synergy, locale }: { user: any; synergy: any; locale: string }) {
    const t = useTranslations();
    const [loadingInsight] = useState(false);
    const [globalInsight] = useState<any>({
        summary: 'Performa habit dan planner Anda sangat konsisten minggu ini. Tingkat penyelesaian tugas pagi mencapai 85%.'
    });

    const { isExplorer, isAiEnabled, trial, isTrialActive } = useGating();

    const plannerData = synergy.planner;

    const trend = [
        { day: 'Mon', score: 65 },
        { day: 'Tue', score: 80 },
        { day: 'Wed', score: 45 },
        { day: 'Thu', score: 90 },
        { day: 'Fri', score: 70 },
        { day: 'Sat', score: 85 },
        { day: 'Sun', score: 100 },
    ];

    const overallScore = Math.round((synergy.habits.percent + 80 + synergy.goals.top_goal.percent + (synergy.journal.is_written ? 100 : 0)) / 4);
    const trendMax = Math.max(...trend.map((d) => d.score), 1);

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
                        
                        {/* Main Column */}
                        <div className="space-y-6 lg:col-span-8">
                            <DashboardTodayTasks
                                plannerData={plannerData}
                                synergy={synergy}
                                t={t}
                            />

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

                        {/* Sidebar Column */}
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
