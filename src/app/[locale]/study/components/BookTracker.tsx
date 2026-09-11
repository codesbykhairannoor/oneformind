'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    BookOpen, Bookmark, CheckCircle2, Star, 
    Plus, Trash2, Edit3, Sparkles, Filter, 
    Flame, Target, ChevronRight, BookMarked,
    FileText, ExternalLink, X, Check, Search,
    ArrowUpRight, Clock, Award
} from 'lucide-react';
import { BookItem, BookStatus, BookCategory, ReadingGoal } from '../types/books';
import { CourseRecord } from './CourseCard';
import ModalPortal from '@/components/ModalPortal';

interface BookTrackerProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
}

const STORAGE_KEY_BOOKS = 'tranvas_study_books';
const STORAGE_KEY_GOAL = 'tranvas_study_reading_goal';

const COVER_GRADIENTS = [
    'from-indigo-600 via-indigo-700 to-slate-900',
    'from-emerald-600 via-teal-700 to-slate-900',
    'from-purple-600 via-pink-700 to-slate-900',
    'from-amber-500 via-orange-600 to-slate-900',
    'from-blue-600 via-cyan-700 to-slate-900',
    'from-rose-600 via-red-700 to-slate-900'
];

export default function BookTracker({ courses, terms }: BookTrackerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [books, setBooks] = useState<BookItem[]>([]);
    const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('reading');
    const [categoryFilter, setCategoryFilter] = useState<BookCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [readingGoal, setReadingGoal] = useState<ReadingGoal>({ year: 2026, target_books: 20 });
    const [isEditingGoal, setIsEditingGoal] = useState(false);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [activeBookForNotes, setActiveBookForNotes] = useState<BookItem | null>(null);
    const [editingBook, setEditingBook] = useState<BookItem | null>(null);

    // Form state
    const [formData, setFormData] = useState<{
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
    }>({
        title: '',
        author: '',
        category: 'tech',
        status: 'reading',
        total_pages: 300,
        current_page: 0,
        cover_color: COVER_GRADIENTS[0],
        cover_url: '',
        linked_course_name: '',
        summary_notes: '',
        rating: 5
    });

    // Load initial data
    useEffect(() => {
        const savedBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
        const savedGoal = localStorage.getItem(STORAGE_KEY_GOAL);

        if (savedGoal) {
            try {
                setReadingGoal(JSON.parse(savedGoal));
            } catch (e) {}
        }

        if (savedBooks) {
            try {
                setBooks(JSON.parse(savedBooks));
            } catch (e) {}
        } else {
            const defaults: BookItem[] = [
                {
                    id: '1',
                    title: 'Designing Data-Intensive Applications',
                    author: 'Martin Kleppmann',
                    category: 'tech',
                    status: 'reading',
                    total_pages: 560,
                    current_page: 240,
                    cover_color: COVER_GRADIENTS[0],
                    rating: 5,
                    linked_course_name: courses[0]?.course_name || (isIndo ? 'Basis Data & Sistem Terdistribusi' : 'Database Systems'),
                    summary_notes: isIndo 
                        ? 'Bab 5 & 6 menjelaskan replikasi leader-follower, konsistensi eventual, dan partisi data terdistribusi.' 
                        : 'Chapters 5 & 6 cover leader-follower replication, eventual consistency, and distributed partitioning.',
                    started_at: '2026-02-01'
                },
                {
                    id: '2',
                    title: 'Atomic Habits: Perubahan Kecil Hasil Luar Biasa',
                    author: 'James Clear',
                    category: 'self_growth',
                    status: 'completed',
                    total_pages: 320,
                    current_page: 320,
                    cover_color: COVER_GRADIENTS[3],
                    rating: 5,
                    summary_notes: isIndo
                        ? 'Prinsip 4 hukum perubahan perilaku: Make it Obvious, Attractive, Easy, and Satisfying.'
                        : 'The 4 laws of behavior change: Make it Obvious, Attractive, Easy, and Satisfying.',
                    started_at: '2026-01-10',
                    finished_at: '2026-01-28'
                },
                {
                    id: '3',
                    title: 'Introduction to Algorithms (CLRS)',
                    author: 'Cormen, Leiserson, Rivest, Stein',
                    category: 'academic',
                    status: 'reading',
                    total_pages: 1312,
                    current_page: 450,
                    cover_color: COVER_GRADIENTS[1],
                    rating: 5,
                    linked_course_name: courses[1]?.course_name || (isIndo ? 'Algoritma & Struktur Data' : 'Algorithms'),
                    summary_notes: isIndo
                        ? 'Analisis formal kompleksitas Big-O, Master Theorem, dan Dynamic Programming.'
                        : 'Formal Big-O complexity proofs, Master Theorem, and Dynamic Programming.',
                    started_at: '2026-02-15'
                },
                {
                    id: '4',
                    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
                    author: 'Robert C. Martin',
                    category: 'tech',
                    status: 'to_read',
                    total_pages: 464,
                    current_page: 0,
                    cover_color: COVER_GRADIENTS[4],
                    summary_notes: ''
                }
            ];
            setBooks(defaults);
            localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(defaults));
        }
    }, [courses, isIndo]);

    // Save helpers
    const saveBooks = (updated: BookItem[]) => {
        setBooks(updated);
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(updated));
    };

    const saveGoal = (newGoal: ReadingGoal) => {
        setReadingGoal(newGoal);
        localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(newGoal));
        setIsEditingGoal(false);
    };

    // Quick page progress update
    const handleUpdatePages = (id: string, newPage: number) => {
        const updated = books.map(b => {
            if (b.id !== id) return b;
            const boundedPage = Math.max(0, Math.min(b.total_pages, newPage));
            const isFinished = boundedPage >= b.total_pages;

            return {
                ...b,
                current_page: boundedPage,
                status: isFinished ? ('completed' as BookStatus) : b.status === 'to_read' ? ('reading' as BookStatus) : b.status,
                finished_at: isFinished ? (b.finished_at || new Date().toISOString().split('T')[0]) : b.finished_at
            };
        });
        saveBooks(updated);
    };

    // Form submission
    const handleSaveBook = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (editingBook) {
            const updated = books.map(b => b.id === editingBook.id ? {
                ...b,
                title: formData.title,
                author: formData.author,
                category: formData.category,
                status: formData.status,
                total_pages: Number(formData.total_pages) || 100,
                current_page: Number(formData.current_page) || 0,
                cover_color: formData.cover_color,
                cover_url: formData.cover_url,
                linked_course_name: formData.linked_course_name,
                summary_notes: formData.summary_notes,
                rating: formData.rating
            } : b);
            saveBooks(updated);
            setEditingBook(null);
        } else {
            const newBook: BookItem = {
                id: Date.now().toString(),
                title: formData.title,
                author: formData.author || (isIndo ? 'Penulis Anonim' : 'Unknown Author'),
                category: formData.category,
                status: formData.status,
                total_pages: Number(formData.total_pages) || 100,
                current_page: Number(formData.current_page) || 0,
                cover_color: formData.cover_color,
                cover_url: formData.cover_url,
                linked_course_name: formData.linked_course_name,
                summary_notes: formData.summary_notes,
                rating: formData.rating,
                started_at: formData.status === 'reading' ? new Date().toISOString().split('T')[0] : undefined
            };
            saveBooks([newBook, ...books]);
        }

        setIsAddModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            category: 'tech',
            status: 'reading',
            total_pages: 300,
            current_page: 0,
            cover_color: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
            cover_url: '',
            linked_course_name: '',
            summary_notes: '',
            rating: 5
        });
    };

    const handleOpenEdit = (book: BookItem) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            category: book.category,
            status: book.status,
            total_pages: book.total_pages,
            current_page: book.current_page,
            cover_color: book.cover_color || COVER_GRADIENTS[0],
            cover_url: book.cover_url || '',
            linked_course_name: book.linked_course_name || '',
            summary_notes: book.summary_notes || '',
            rating: book.rating || 5
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteBook = (id: string) => {
        const updated = books.filter(b => b.id !== id);
        saveBooks(updated);
    };

    // Category labels & colors
    const getCategoryBadge = (cat: BookCategory) => {
        switch (cat) {
            case 'academic': return { label: isIndo ? '🎓 Akademik' : '🎓 Academic', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
            case 'tech': return { label: isIndo ? '💻 Software & Tech' : '💻 Tech & Code', color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' };
            case 'self_growth': return { label: isIndo ? '🚀 Self-Growth' : '🚀 Self-Growth', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
            case 'philosophy': return { label: isIndo ? '🧠 Filsafat & Pemikiran' : '🧠 Philosophy', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
            case 'fiction': return { label: isIndo ? '📚 Fiksi & Cerita' : '📚 Fiction', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
            default: return { label: isIndo ? '📖 Non-Fiksi' : '📖 General', color: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
        }
    };

    // Filtered books
    const filteredBooks = books.filter(book => {
        if (statusFilter !== 'all' && book.status !== statusFilter) return false;
        if (categoryFilter !== 'all' && book.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
        }
        return true;
    });

    // Stats calculations
    const completedCount = books.filter(b => b.status === 'completed').length;
    const readingNowCount = books.filter(b => b.status === 'reading').length;
    const wantToReadCount = books.filter(b => b.status === 'to_read').length;
    const totalPagesRead = books.reduce((acc, curr) => acc + curr.current_page, 0);
    const goalPercentage = readingGoal.target_books > 0 ? Math.min(100, Math.round((completedCount / readingGoal.target_books) * 100)) : 0;

    return (
        <div className="space-y-6">
            
            {/* Top Scoreboard: Yearly Reading Goal & Velocity */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none"></div>

                {/* Left: Target & Streak */}
                <div className="relative z-10 space-y-3 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-black tracking-wider">
                        <Flame size={13} className="text-amber-400" />
                        <span>{isIndo ? 'TARGET LITERASI TAHUNAN' : 'ANNUAL READING GOAL'}</span>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            {completedCount} <span className="text-lg text-indigo-300 font-bold">/ {readingGoal.target_books} {isIndo ? 'Buku Selesai' : 'Books Finished'}</span>
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
                            {goalPercentage}% {isIndo ? 'Tercapai' : 'Done'}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${goalPercentage}%` }}
                        ></div>
                    </div>

                    <p className="text-xs text-indigo-200/80">
                        {isIndo 
                            ? `Total ${totalPagesRead.toLocaleString()} halaman telah dibaca. Terus pertahankan momentum belajar dan literasi!` 
                            : `Total ${totalPagesRead.toLocaleString()} pages consumed. Maintain reading velocity and intellectual momentum!`}
                    </p>
                </div>

                {/* Right: Quick Stats & Goal Adjuster */}
                <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
                    <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 min-w-[100px]">
                        <span className="text-[10px] font-black uppercase text-indigo-200 block">
                            {isIndo ? 'Sedang Dibaca' : 'Reading Now'}
                        </span>
                        <span className="text-xl font-black font-mono mt-0.5 block">{readingNowCount}</span>
                    </div>

                    <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 min-w-[100px]">
                        <span className="text-[10px] font-black uppercase text-indigo-200 block">
                            {isIndo ? 'Ingin Dibaca' : 'Queue'}
                        </span>
                        <span className="text-xl font-black font-mono mt-0.5 block">{wantToReadCount}</span>
                    </div>

                    {isEditingGoal ? (
                        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/15 border border-white/20">
                            <input
                                type="number"
                                min="1"
                                max="200"
                                value={readingGoal.target_books}
                                onChange={(e) => setReadingGoal({ ...readingGoal, target_books: parseInt(e.target.value) || 1 })}
                                className="w-16 px-2 py-1.5 rounded-xl bg-white/20 text-white font-mono font-bold text-xs outline-none text-center"
                            />
                            <button
                                type="button"
                                onClick={() => saveGoal(readingGoal)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black"
                            >
                                <Check size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditingGoal(true)}
                            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-xs font-black text-indigo-200 transition active:scale-95 flex items-center gap-1.5"
                        >
                            <Target size={14} />
                            <span>{isIndo ? 'Atur Target' : 'Edit Goal'}</span>
                        </button>
                    )}
                </div>

            </div>

            {/* Filter Controls & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                
                {/* Status Tabs */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => setStatusFilter('reading')}
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
                        onClick={() => setStatusFilter('to_read')}
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
                        onClick={() => setStatusFilter('completed')}
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
                        onClick={() => setStatusFilter('all')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                            statusFilter === 'all'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <span>{isIndo ? 'Semua' : 'All'} ({books.length})</span>
                    </button>
                </div>

                {/* Right Actions: Category, Search & Add Book */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    
                    {/* Category Selector */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isIndo ? 'Cari judul/penulis...' : 'Search title/author...'}
                            className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                        />
                    </div>

                    {/* Add Book Button */}
                    <button
                        type="button"
                        onClick={() => { resetForm(); setEditingBook(null); setIsAddModalOpen(true); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-500/20 active:scale-95 transition"
                    >
                        <Plus size={14} />
                        <span>{isIndo ? 'Tambah Buku' : 'Add Book'}</span>
                    </button>

                </div>

            </div>

            {/* Books Shelf Grid */}
            {filteredBooks.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                        <BookMarked size={28} />
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {isIndo ? 'Tidak Ada Buku Ditemukan' : 'No Books in this View'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isIndo ? 'Tambahkan buku teks perkuliahan atau bacaan produktif baru ke rak digitalmu.' : 'Add academic textbooks or personal learning books to your digital shelf.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => { resetForm(); setEditingBook(null); setIsAddModalOpen(true); }}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-md"
                    >
                        {isIndo ? 'Tambah Buku Sekarang' : 'Add Book Now'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBooks.map((book) => {
                        const progressPct = book.total_pages > 0 ? Math.round((book.current_page / book.total_pages) * 100) : 0;
                        const catBadge = getCategoryBadge(book.category);

                        return (
                            <div
                                key={book.id}
                                className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-5 flex flex-col justify-between group"
                            >
                                {/* Top: Aesthetic Minimalist Book Cover & Metadata */}
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
                                                        onClick={() => handleOpenEdit(book)}
                                                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteBook(book.id)}
                                                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500"
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
                                                    onClick={() => handleUpdatePages(book.id, book.current_page + 5)}
                                                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                                                >
                                                    +5p
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdatePages(book.id, book.current_page + 10)}
                                                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[10px] font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                                                >
                                                    +10p
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdatePages(book.id, book.current_page + 25)}
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
                                                    onClick={() => handleUpdatePages(book.id, book.total_pages)}
                                                    className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    {isIndo ? 'Selesaikan' : 'Finish'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom: Notes Preview & Star Rating */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveBookForNotes(book); setIsNotesModalOpen(true); }}
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
                    })}
                </div>
            )}

            {/* Add / Edit Book Modal */}
            {isAddModalOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                {editingBook ? (isIndo ? 'Edit Detail Buku' : 'Edit Book') : (isIndo ? 'Tambah Buku ke Rak Bacaan' : 'Add New Book to Shelf')}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                {isIndo ? 'Catat buku textbook perkuliahan atau literatur produktif untuk dipantau.' : 'Track academic textbooks and personal mastery books.'}
                            </p>

                            <form onSubmit={handleSaveBook} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Judul Buku' : 'Book Title'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Designing Data-Intensive Applications"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Penulis' : 'Author'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as BookCategory })}
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

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Total Halaman' : 'Total Pages'}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.total_pages}
                                            onChange={(e) => setFormData({ ...formData, total_pages: parseInt(e.target.value) || 100 })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Halaman Saat Ini' : 'Current Page'}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max={formData.total_pages}
                                            value={formData.current_page}
                                            onChange={(e) => setFormData({ ...formData, current_page: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            {isIndo ? 'Status' : 'Status'}
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
                                            className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                        >
                                            <option value="reading">{isIndo ? 'Sedang Dibaca' : 'Reading'}</option>
                                            <option value="to_read">{isIndo ? 'Ingin Dibaca' : 'Queue'}</option>
                                            <option value="completed">{isIndo ? 'Selesai' : 'Completed'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Tautkan ke Mata Kuliah (Opsional)' : 'Link to Course (Optional)'}
                                    </label>
                                    <select
                                        value={formData.linked_course_name}
                                        onChange={(e) => setFormData({ ...formData, linked_course_name: e.target.value })}
                                        className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                    >
                                        <option value="">{isIndo ? 'Buku Umum / Non-Matkul' : 'General / Independent Reading'}</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.course_name}>{c.course_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
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
            )}

            {/* Reading Notes & Key Takeaways Modal */}
            {isNotesModalOpen && activeBookForNotes && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsNotesModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150 space-y-5">
                            
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                        {activeBookForNotes.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">{activeBookForNotes.author}</p>
                                </div>
                                <button onClick={() => setIsNotesModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    {isIndo ? 'Rangkuman & Gagasan Utama (Key Takeaways)' : 'Notes & Key Ideas'}
                                </label>
                                <textarea
                                    rows={6}
                                    value={activeBookForNotes.summary_notes || ''}
                                    onChange={(e) => {
                                        const newNotes = e.target.value;
                                        setActiveBookForNotes({ ...activeBookForNotes, summary_notes: newNotes });
                                        const updated = books.map(b => b.id === activeBookForNotes.id ? { ...b, summary_notes: newNotes } : b);
                                        saveBooks(updated);
                                    }}
                                    placeholder={isIndo ? 'Tulis kutipan penting, argumen kunci, atau ide yang dapat diterapkan...' : 'Write key insights, quotes, and actionable ideas...'}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none resize-none leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNotesModalOpen(false)}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-md"
                                >
                                    {isIndo ? 'Selesai' : 'Done'}
                                </button>
                            </div>

                        </div>
                    </div>
                </ModalPortal>
            )}

        </div>
    );
}
