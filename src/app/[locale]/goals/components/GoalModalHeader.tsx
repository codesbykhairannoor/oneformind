'use client';

import React from 'react';
import { X, Upload, LucideIcon } from 'lucide-react';
import { GoalItem } from './GoalCard';

interface GoalModalHeaderProps {
    goal?: GoalItem | null;
    form: GoalItem;
    imagePreview: string | null;
    isUploading: boolean;
    HeaderIcon: LucideIcon;
    t: any;
    onClose: () => void;
    onUploadClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function GoalModalHeader({
    goal,
    form,
    imagePreview,
    isUploading,
    HeaderIcon,
    t,
    onClose,
    onUploadClick,
    fileInputRef,
    onFileChange
}: GoalModalHeaderProps) {
    return (
        <div className="relative h-44 bg-slate-100 dark:bg-slate-950 shrink-0 group rounded-t-[2.5rem] overflow-hidden">
            {imagePreview ? (
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
            ) : (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white/10"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${form.color || '#6366f1'}, #4f46e5)` }}
                >
                    <HeaderIcon className="w-24 h-24 stroke-[1] animate-pulse" />
                </div>
            )}

            <div className="absolute inset-x-6 bottom-5 flex justify-between items-end">
                <div className="flex-grow min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-black tracking-tight mb-1.5">
                        {goal?.id ? (t('goal_edit') || 'Update vision') : (t('goal_new') || 'Create new vision')}
                    </span>
                    <h2 className="text-2xl font-black text-white drop-shadow-md truncate pr-4">
                        {form.title || (t('goal_placeholder_title') || 'What is your dream?')}
                    </h2>
                </div>
                
                <button 
                    type="button"
                    onClick={onUploadClick}
                    className="shrink-0 w-11 h-11 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110 active:scale-95 shadow-xl"
                    title="Unggah Gambar Cover"
                >
                    {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Upload className="w-4.5 h-4.5" />
                    )}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
            </div>

            <button type="button" onClick={onClose} className="absolute top-5 right-5 w-9 h-9 bg-black/20 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
                <X className="w-4.5 h-4.5" />
            </button>
        </div>
    );
}
