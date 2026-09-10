'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Briefcase, DollarSign, Dumbbell, GraduationCap, 
    Sparkles, Users, Palette, Plane, CheckCircle2, 
    ArrowUpRight, Target
} from 'lucide-react';
import { GoalItem, calculateGoalProgress } from '../lib/goalPaceCalculator';

interface GoalWheelOfLifeViewProps {
    goals: GoalItem[];
    onEdit: (goal: GoalItem) => void;
}

export default function GoalWheelOfLifeView({
    goals,
    onEdit
}: GoalWheelOfLifeViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const domains = [
        {
            id: 'career',
            title: isIndo ? 'Karier & Pekerjaan' : 'Career & Work',
            icon: Briefcase,
            color: '#6366f1',
            categories: ['career', 'coding']
        },
        {
            id: 'wealth',
            title: isIndo ? 'Keuangan & Aset' : 'Wealth & Finance',
            icon: DollarSign,
            color: '#10b981',
            categories: ['wealth']
        },
        {
            id: 'fitness',
            title: isIndo ? 'Kesehatan & Fisik' : 'Health & Fitness',
            icon: Dumbbell,
            color: '#f43f5e',
            categories: ['fitness', 'health']
        },
        {
            id: 'learning',
            title: isIndo ? 'Belajar & Pengembangan' : 'Learning & Growth',
            icon: GraduationCap,
            color: '#8b5cf6',
            categories: ['learning', 'reading']
        },
        {
            id: 'spiritual',
            title: isIndo ? 'Spiritualitas & Jiwa' : 'Mindfulness & Spiritual',
            icon: Sparkles,
            color: '#f59e0b',
            categories: ['spiritual']
        },
        {
            id: 'social',
            title: isIndo ? 'Sosial & Hubungan' : 'Social & Family',
            icon: Users,
            color: '#0ea5e9',
            categories: ['social']
        },
        {
            id: 'creative',
            title: isIndo ? 'Kreativitas & Hobi' : 'Creativity & Hobbies',
            icon: Palette,
            color: '#f97316',
            categories: ['creative', 'music', 'photography', 'gaming']
        },
        {
            id: 'travel',
            title: isIndo ? 'Petualangan & Gaya Hidup' : 'Travel & Lifestyle',
            icon: Plane,
            color: '#ec4899',
            categories: ['travel', 'other']
        }
    ];

    return (
        <div className="space-y-6">
            
            {/* Header info */}
            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-500" />
                        <span>{isIndo ? 'Keseimbangan Roda Hidup (Wheel of Life)' : 'Wheel of Life Balance'}</span>
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                        {isIndo 
                            ? 'Distribusi target impian Anda di 8 pilar kehidupan untuk memastikan pertumbuhan yang utuh, seimbang, dan tidak timpang sebelah.'
                            : 'Distribution of your vision across 8 core life domains to ensure holistic, multi-dimensional life growth.'}
                    </p>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center shrink-0">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block">
                        {isIndo ? 'Total Target' : 'Total Goals'}
                    </span>
                    <span className="text-xl font-black font-mono text-indigo-700 dark:text-indigo-300">
                        {goals.length}
                    </span>
                </div>
            </div>

            {/* 8 Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {domains.map((dom) => {
                    const domGoals = goals.filter(g => dom.categories.includes(g.category || 'other'));
                    const DomIcon = dom.icon;

                    let domProgressSum = 0;
                    domGoals.forEach(g => {
                        domProgressSum += calculateGoalProgress(g);
                    });
                    const domAvgProgress = domGoals.length === 0 ? 0 : Math.round(domProgressSum / domGoals.length);

                    return (
                        <div
                            key={dom.id}
                            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
                        >
                            {/* Domain Header */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div 
                                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                                        style={{ backgroundColor: dom.color }}
                                    >
                                        <DomIcon size={20} />
                                    </div>
                                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {domGoals.length} {isIndo ? 'Target' : 'Goals'}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                                        {dom.title}
                                    </h4>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-1">
                                        <span>{isIndo ? 'Tingkat Capaian' : 'Domain Mastery'}</span>
                                        <span className="font-mono font-black text-slate-700 dark:text-slate-200">{domAvgProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                                        <div 
                                            className="h-full rounded-full transition-all duration-700" 
                                            style={{ width: `${domAvgProgress}%`, backgroundColor: dom.color }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Goals in this Domain */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                {domGoals.slice(0, 3).map((g) => {
                                    const p = calculateGoalProgress(g);
                                    return (
                                        <div
                                            key={g.id}
                                            onClick={() => onEdit(g)}
                                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-between text-xs group"
                                        >
                                            <span className="font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                {g.title}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                                                {p}%
                                            </span>
                                        </div>
                                    );
                                })}

                                {domGoals.length === 0 && (
                                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 italic text-center py-2">
                                        {isIndo ? 'Belum ada target di pilar ini.' : 'No active goals in this pillar.'}
                                    </p>
                                )}

                                {domGoals.length > 3 && (
                                    <p className="text-[10px] font-bold text-slate-400 text-center">
                                        +{domGoals.length - 3} {isIndo ? 'target lainnya' : 'more goals'}
                                    </p>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}
