'use client';

import React from 'react';
import { X, Camera, Trash2, LucideIcon } from 'lucide-react';
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
    onRemoveCover?: () => void;
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
    onRemoveCover,
    fileInputRef,
    onFileChange
}: GoalModalHeaderProps) {
    return (
        <div className="relative h-28 sm:h-36 bg-slate-100 dark:bg-slate-950 shrink-0 group rounded-t-[2.5rem] overflow-hidden">
            {imagePreview ? (
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20"></div>
                </div>
            ) : (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white/10"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${form.color || '#6366f1'}, #4f46e5)` }}
                >
                    <HeaderIcon className="w-20 h-20 stroke-[1] animate-pulse" />
                </div>
            )}

            <div className="absolute inset-x-6 bottom-4 flex justify-between items-end gap-3 z-10">
                <div className="flex-grow min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-[9px] font-black tracking-tight mb-1 backdrop-blur-sm">
                        {goal?.id ? (t('goal_edit') || 'Update vision') : (t('goal_new') || 'Create new vision')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md truncate pr-2">
                        {form.title || (t('goal_placeholder_title') || 'What is your dream?')}
                    </h2>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    {imagePreview && (
                        <button
                            type="button"
                            onClick={onRemoveCover}
                            className="px-2.5 sm:px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md backdrop-blur-md active:scale-95"
                            title="Hapus Cover"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Hapus Cover</span>
                        </button>
                    )}
                    <button 
                        type="button"
                        onClick={onUploadClick}
                        className="px-3 sm:px-3.5 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md backdrop-blur-md active:scale-95"
                        title={imagePreview ? "Ganti Cover" : "Unggah Gambar Cover"}
                    >
                        {isUploading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Camera className="w-3.5 h-3.5" />
                        )}
                        <span>{imagePreview ? 'Ganti Cover' : 'Upload Cover'}</span>
                    </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
            </div>

            <button 
                type="button" 
                onClick={onClose} 
                className="absolute top-4 right-4 w-8 h-8 bg-black/30 hover:bg-black/50 border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-20"
                title="Tutup"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
