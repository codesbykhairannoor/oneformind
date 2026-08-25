'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Trash2 } from 'lucide-react';

export interface Milestone {
    id?: number | string | null;
    _key?: string;
    title: string;
    is_completed?: boolean;
    completed?: boolean;
    target_date?: string | null;
    is_saving?: boolean;
}

interface MilestoneItemProps {
    milestone: Milestone;
    onToggle?: () => void;
    onSave?: (data: Milestone) => void;
    onDelete?: () => void;
    onUpdateTitle?: (title: string) => void;
}

export default function MilestoneItem({ milestone, onToggle, onSave, onDelete, onUpdateTitle }: MilestoneItemProps) {
    const t = useTranslations();
    const [editTitle, setEditTitle] = useState(milestone.title || '');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isInputFocused) {
            setEditTitle(milestone.title || '');
        }
    }, [milestone.title, isInputFocused]);

    const isCompleted = milestone.is_completed || milestone.completed;

    const debouncedSave = (newTitle: string) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            if (newTitle.trim() !== '') {
                onSave?.({
                    ...milestone,
                    title: newTitle.trim()
                });
            }
        }, 500);
    };

    const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEditTitle(val);
        onUpdateTitle?.(val);
        debouncedSave(val);
    };

    const handleSave = () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (editTitle.trim() !== '') {
            onSave?.({
                ...milestone,
                title: editTitle.trim()
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
        if (e.key === 'Escape') {
            setIsInputFocused(false);
            setEditTitle(milestone.title || '');
        }
    };

    return (
        // 1:1 from MilestoneItem.vue line 116-156
        <div className={`flex items-center group/ms gap-3 py-1.5 px-3 bg-transparent hover:bg-slate-50/50 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 relative border border-transparent hover:border-slate-100 dark:hover:border-slate-800 ${milestone.is_saving ? 'opacity-70' : ''}`}>
            
            <button 
                type="button"
                onClick={() => !milestone.is_saving && onToggle?.()}
                disabled={milestone.is_saving}
                className={`flex-shrink-0 w-[18px] h-[18px] rounded-lg border-2 flex items-center justify-center transition-all duration-300 focus:outline-none disabled:cursor-not-allowed ${
                    isCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
            >
                {isCompleted && <Check className="w-3 h-3 stroke-[4]" />}
            </button>

            <div className="flex-grow flex flex-col min-w-0">
                <input 
                    type="text"
                    value={editTitle}
                    onChange={handleTitleInput}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { setIsInputFocused(false); handleSave(); }}
                    onFocus={() => setIsInputFocused(true)}
                    placeholder={t('milestone_placeholder') || 'Identify next step...'}
                    className={`w-full bg-transparent border-none focus:ring-0 p-0 text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCompleted 
                            ? 'text-slate-400 dark:text-slate-500 line-through font-medium' 
                            : 'text-slate-700 dark:text-slate-200 font-black'
                    }`}
                />
            </div>

            <button 
                type="button"
                onClick={() => !milestone.is_saving && onDelete?.()}
                disabled={milestone.is_saving}
                className="opacity-100 md:opacity-0 md:group-hover/ms:opacity-100 p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-all rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:outline-none shrink-0 disabled:cursor-not-allowed"
                title="Hapus Step"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>

            {milestone.is_saving && (
                <div className="absolute right-3 bottom-1">
                    <div className="w-2 h-2 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
