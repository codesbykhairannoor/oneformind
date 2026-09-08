'use client';

import React from 'react';
import { 
    Target, Dumbbell, DollarSign, Briefcase, GraduationCap, 
    Sparkles, Users, Plane, Palette, Heart, Code, Music, 
    BookOpen, Camera, Gamepad2 
} from 'lucide-react';

export const archetypes = [
    { id: 'fitness', icon: Dumbbell, color: '#f43f5e', label: 'Fitness' },
    { id: 'wealth', icon: DollarSign, color: '#10b981', label: 'Wealth' },
    { id: 'career', icon: Briefcase, color: '#6366f1', label: 'Career' },
    { id: 'learning', icon: GraduationCap, color: '#8b5cf6', label: 'Learning' },
    { id: 'spiritual', icon: Sparkles, color: '#f59e0b', label: 'Spiritual' },
    { id: 'social', icon: Users, color: '#0ea5e9', label: 'Social' },
    { id: 'travel', icon: Plane, color: '#ec4899', label: 'Travel' },
    { id: 'creative', icon: Palette, color: '#f97316', label: 'Creative' },
    { id: 'health', icon: Heart, color: '#ef4444', label: 'Health' },
    { id: 'coding', icon: Code, color: '#14b8a6', label: 'Coding' },
    { id: 'music', icon: Music, color: '#d946ef', label: 'Music' },
    { id: 'reading', icon: BookOpen, color: '#84cc16', label: 'Reading' },
    { id: 'photography', icon: Camera, color: '#6b7280', label: 'Photography' },
    { id: 'gaming', icon: Gamepad2, color: '#eab308', label: 'Gaming' },
    { id: 'other', icon: Target, color: '#0f172a', label: 'Other' },
];

interface GoalArchetypesGridProps {
    selectedArchetype: string;
    onSelectArchetype: (arch: typeof archetypes[0]) => void;
    t: any;
}

export default function GoalArchetypesGrid({
    selectedArchetype,
    onSelectArchetype,
    t
}: GoalArchetypesGridProps) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                {t('goal_archetypes') || 'Choose template'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {archetypes.map((arch) => {
                    const ArchIcon = arch.icon;
                    const isSelected = selectedArchetype === arch.id;
                    return (
                        <button 
                            key={arch.id}
                            type="button"
                            onClick={() => onSelectArchetype(arch)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 group ${
                                isSelected 
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                                    : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                        >
                            <ArchIcon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                            <span className={`text-[8px] font-black text-center mt-2 leading-tight transition-colors ${
                                isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
                            }`}>
                                {arch.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
