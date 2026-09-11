'use client';

import React from 'react';
import { Edit3, Trash2, CheckCircle2, FileText, Star } from 'lucide-react';
import { BookItem } from '../../types/books';
import { COVER_GRADIENTS, getCategoryBadge } from './constants';

interface BookCardProps {
    book: BookItem;
    isIndo: boolean;
    onUpdatePages: (id: string, newPage: number) => void;
    onEdit: (book: BookItem) => void;
    onDelete: (id: string) => void;
    onOpenNotes: (book: BookItem) => void;
}

export default function BookCard({
    book,
    isIndo,
    onUpdatePages,
    onEdit,
    onDelete,
    onOpenNotes
}: BookCardProps) {
    const progressPct = book.total_pages > 0 
        ? Math.round((book.current_page / book.total_pages) * 100) 
        : 0;
    const catBadge = getCategoryBadge(book.category, isIndo);

    return (
        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between group">
            
            {/* Top: Cover Spine & Meta Details */}
            <div className="space-y-4">
                <div className="flex gap-4">
                    
                    {/* Stylized Book Spine Cover */}
                    <div className={`w-24 h-32 rounded-2xl bg-gradient-to-br ${book.cover_color || COVER_GRADIENTS[0]} p-3 text-white shadow-md flex flex-col justify-between shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                        <div className="text-[9px] font-black uppercase tracking-wider opacity-75 line-clamp-1">
                            {book.author}
                        </div>
                        <div className="text-[11px] font-black leading-tight line-clamp-3">
                            {book.title}
                        </div>
                        <div className="flex items-center justify-between text-[8px] font-mono opacity-80 pt-1 border-t border-white/20">
                            <span>{book.total_pages}p</span>
                            <span>{progressPct}%</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${catBadge.color} truncate max-w-[120px]`}>
                                {catBadge.label}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    type="button"
                                    onClick={() => onEdit(book)}
                                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                                    title={isIndo ? 'Edit Buku' : 'Edit Book'}
                                >
                                    <Edit3 size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(book.id)}
                                    className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500"
                                    title={isIndo ? 'Hapus Buku' : 'Delete Book'}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                            {book.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold truncate">
                            {book.author}
                        </p>

                        {book.linked_course_name && (
                            <span className="inline-block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-full">
                                🔗 {book.linked_course_name}
                            </span>
                        )}
                    </div>

                </div>

                {/* Progress Tracker Slider & Quick Bump Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500 dark:text-slate-400">
                            {isIndo ? 'Kemajuan Membaca' : 'Progress'}
                        </span>
                        <span className="font-mono font-black text-slate-800 dark:text-slate-200">
                            {book.current_page} / {book.total_pages} hal ({progressPct}%)
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                        ></div>
                    </div>

                    {/* Quick Page Bump Buttons */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onUpdatePages(book.id, book.current_page + 5)}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                            >
                                +5p
                            </button>
                            <button
                                type="button"
                                onClick={() => onUpdatePages(book.id, book.current_page + 10)}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                            >
                                +10p
                            </button>
                            <button
                                type="button"
                                onClick={() => onUpdatePages(book.id, book.current_page + 25)}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                            >
                                +25p
                            </button>
                        </div>

                        {book.status === 'completed' ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={12} />
                                <span>{isIndo ? 'Tamat' : 'Done'}</span>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onUpdatePages(book.id, book.total_pages)}
                                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {isIndo ? 'Selesaikan' : 'Finish'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom: Notes Trigger & Star Rating */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={() => onOpenNotes(book)}
                    className="flex items-center gap-1.5 text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                >
                    <FileText size={13} className="text-indigo-500" />
                    <span>{book.summary_notes ? (isIndo ? 'Catatan & Rangkuman' : 'Notes & Key Ideas') : (isIndo ? '+ Tulis Catatan' : '+ Add Note')}</span>
                </button>

                {book.rating && (
                    <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: book.rating }).map((_, i) => (
                            <Star key={i} size={11} className="fill-current" />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
