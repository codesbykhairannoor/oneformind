'use client';

import React from 'react';
import { BookOpen, Bookmark, CheckCircle2, Search, Plus } from 'lucide-react';
import { BookStatus, BookCategory } from '../../types/books';

interface BookFilterBarProps {
    statusFilter: BookStatus | 'all';
    categoryFilter: BookCategory | 'all';
    searchQuery: string;
    readingNowCount: number;
    wantToReadCount: number;
    completedCount: number;
    totalBooksCount: number;
    isIndo: boolean;
    onStatusChange: (status: BookStatus | 'all') => void;
    onCategoryChange: (cat: BookCategory | 'all') => void;
    onSearchChange: (query: string) => void;
    onAddBookClick: () => void;
}

export default function BookFilterBar({
    statusFilter,
    categoryFilter,
    searchQuery,
    readingNowCount,
    wantToReadCount,
    completedCount,
    totalBooksCount,
    isIndo,
    onStatusChange,
    onCategoryChange,
    onSearchChange,
    onAddBookClick
}: BookFilterBarProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            
            {/* Status Tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
                <button
                    type="button"
                    onClick={() => onStatusChange('reading')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        statusFilter === 'reading'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                    <BookOpen size={13} />
                    <span>{isIndo ? 'Sedang Dibaca' : 'Reading'} ({readingNowCount})</span>
                </button>

                <button
                    type="button"
                    onClick={() => onStatusChange('to_read')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        statusFilter === 'to_read'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                    <Bookmark size={13} />
                    <span>{isIndo ? 'Ingin Dibaca' : 'Queue'} ({wantToReadCount})</span>
                </button>

                <button
                    type="button"
                    onClick={() => onStatusChange('completed')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        statusFilter === 'completed'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                    <CheckCircle2 size={13} />
                    <span>{isIndo ? 'Selesai' : 'Completed'} ({completedCount})</span>
                </button>

                <button
                    type="button"
                    onClick={() => onStatusChange('all')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        statusFilter === 'all'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                    <span>{isIndo ? 'Semua' : 'All'} ({totalBooksCount})</span>
                </button>
            </div>

            {/* Category, Search & Add Action */}
            <div className="flex items-center gap-2.5 flex-wrap">
                
                {/* Category Dropdown */}
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value as any)}
                    className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                    <option value="all">{isIndo ? 'Semua Kategori' : 'All Categories'}</option>
                    <option value="academic">{isIndo ? '🎓 Akademik / Textbook' : '🎓 Academic'}</option>
                    <option value="tech">{isIndo ? '💻 Software & Tech' : '💻 Tech & Code'}</option>
                    <option value="self_growth">{isIndo ? '🚀 Self-Growth' : '🚀 Self-Growth'}</option>
                    <option value="philosophy">{isIndo ? '🧠 Filsafat' : '🧠 Philosophy'}</option>
                    <option value="fiction">{isIndo ? '📚 Fiksi' : '📚 Fiction'}</option>
                </select>

                {/* Search Input */}
                <div className="relative min-w-[140px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={isIndo ? 'Cari judul/penulis...' : 'Search title/author...'}
                        className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                    />
                </div>

                {/* Add Book Button */}
                <button
                    type="button"
                    onClick={onAddBookClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition"
                >
                    <Plus size={14} />
                    <span>{isIndo ? 'Tambah Buku' : 'Add Book'}</span>
                </button>

            </div>

        </div>
    );
}
