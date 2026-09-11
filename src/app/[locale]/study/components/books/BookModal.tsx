'use client';

import React from 'react';
import ModalPortal from '@/components/ModalPortal';
import { BookItem, BookCategory, BookStatus } from '../../types/books';
import { CourseRecord } from '../CourseCard';
import { COVER_GRADIENTS } from './constants';

interface BookModalProps {
    isOpen: boolean;
    isEdit: boolean;
    formData: {
        title: string;
        author: string;
        category: BookCategory;
        status: BookStatus;
        total_pages: number;
        current_page: number;
        cover_color: string;
        cover_url: string;
        linked_course_name: string;
        summary_notes: string;
        rating: number;
    };
    courses: CourseRecord[];
    isIndo: boolean;
    onClose: () => void;
    onChange: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function BookModal({
    isOpen,
    isEdit,
    formData,
    courses,
    isIndo,
    onClose,
    onChange,
    onSubmit
}: BookModalProps) {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
                    
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                        {isEdit ? (isIndo ? 'Edit Detail Buku' : 'Edit Book') : (isIndo ? 'Tambah Buku ke Rak Bacaan' : 'Add New Book to Shelf')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                        {isIndo ? 'Catat buku textbook perkuliahan atau literatur produktif untuk dipantau.' : 'Track academic textbooks and personal mastery books.'}
                    </p>

                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                {isIndo ? 'Judul Buku' : 'Book Title'}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => onChange('title', e.target.value)}
                                placeholder="e.g. Designing Data-Intensive Applications"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Author & Category */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {isIndo ? 'Penulis' : 'Author'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => onChange('author', e.target.value)}
                                    placeholder="Martin Kleppmann"
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {isIndo ? 'Kategori' : 'Category'}
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => onChange('category', e.target.value as BookCategory)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                >
                                    <option value="tech">{isIndo ? '💻 Software & Tech' : '💻 Tech'}</option>
                                    <option value="academic">{isIndo ? '🎓 Akademik / Textbook' : '🎓 Academic'}</option>
                                    <option value="self_growth">{isIndo ? '🚀 Self-Growth' : '🚀 Self-Growth'}</option>
                                    <option value="philosophy">{isIndo ? '🧠 Filsafat' : '🧠 Philosophy'}</option>
                                    <option value="fiction">{isIndo ? '📚 Fiksi' : '📚 Fiction'}</option>
                                </select>
                            </div>
                        </div>

                        {/* Pages & Status */}
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {isIndo ? 'Total Hal' : 'Total Pages'}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.total_pages}
                                    onChange={(e) => onChange('total_pages', parseInt(e.target.value) || 100)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {isIndo ? 'Halaman' : 'Current Page'}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max={formData.total_pages}
                                    value={formData.current_page}
                                    onChange={(e) => onChange('current_page', parseInt(e.target.value) || 0)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {isIndo ? 'Status' : 'Status'}
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => onChange('status', e.target.value as BookStatus)}
                                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                >
                                    <option value="reading">{isIndo ? 'Sedang Dibaca' : 'Reading'}</option>
                                    <option value="to_read">{isIndo ? 'Ingin Dibaca' : 'Queue'}</option>
                                    <option value="completed">{isIndo ? 'Selesai' : 'Completed'}</option>
                                </select>
                            </div>
                        </div>

                        {/* Linked Course */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                {isIndo ? 'Tautkan ke Mata Kuliah (Opsional)' : 'Link to Course (Optional)'}
                            </label>
                            <select
                                value={formData.linked_course_name}
                                onChange={(e) => onChange('linked_course_name', e.target.value)}
                                className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                            >
                                <option value="">{isIndo ? 'Buku Umum / Non-Matkul' : 'General / Independent Reading'}</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.course_name}>{c.course_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                {isIndo ? 'Batal' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                            >
                                {isIndo ? 'Simpan Buku' : 'Save Book'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
