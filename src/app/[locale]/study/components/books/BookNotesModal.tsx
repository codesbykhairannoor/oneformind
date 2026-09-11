'use client';

import React from 'react';
import { X } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { BookItem } from '../../types/books';

interface BookNotesModalProps {
    isOpen: boolean;
    book: BookItem | null;
    isIndo: boolean;
    onClose: () => void;
    onSaveNotes: (id: string, notes: string) => void;
}

export default function BookNotesModal({
    isOpen,
    book,
    isIndo,
    onClose,
    onSaveNotes
}: BookNotesModalProps) {
    if (!isOpen || !book) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150 space-y-5">
                    
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                {book.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">{book.author}</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            {isIndo ? 'Rangkuman & Gagasan Utama (Key Takeaways)' : 'Notes & Key Ideas'}
                        </label>
                        <textarea
                            rows={6}
                            value={book.summary_notes || ''}
                            onChange={(e) => onSaveNotes(book.id, e.target.value)}
                            placeholder={isIndo ? 'Tulis kutipan penting, argumen kunci, atau ide yang dapat diterapkan...' : 'Write key insights, quotes, and actionable ideas...'}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none resize-none leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md"
                        >
                            {isIndo ? 'Selesai' : 'Done'}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
