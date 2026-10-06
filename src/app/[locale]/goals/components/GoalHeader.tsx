'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Plus, Target } from 'lucide-react';
import ModuleHeader from '@/components/layout/ModuleHeader';

interface GoalHeaderProps {
    onAddClick: () => void;
}

export default function GoalHeader({ onAddClick }: GoalHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    return (
        <ModuleHeader
            icon={<Target size={18} strokeWidth={2.5} />}
            title={isIndo ? 'Pelacak Target & Visi Hidup' : 'Goal & Vision Mastery'}
            subtitle={isIndo ? 'Sistem eksekusi mandiri, target tahunan & milestone' : 'Self-contained execution system, annual targets & milestones'}
            actions={
                <div className="flex items-center gap-2">
                    <button 
                        type="button"
                        onClick={onAddClick} 
                        className="h-10 px-4 sm:px-5 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 gap-2 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>
                            {isIndo ? 'Buat Target Baru' : 'Set New Goal'}
                        </span>
                    </button>
                </div>
            }
        />
    );
}
