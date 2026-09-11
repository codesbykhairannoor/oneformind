'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { BookMarked } from 'lucide-react';
import { BookItem, BookStatus, BookCategory, ReadingGoal } from '../types/books';
import { CourseRecord } from './CourseCard';
import BookGoalBanner from './books/BookGoalBanner';
import BookFilterBar from './books/BookFilterBar';
import BookCard from './books/BookCard';
import BookModal from './books/BookModal';
import BookNotesModal from './books/BookNotesModal';
import { STORAGE_KEY_BOOKS, STORAGE_KEY_GOAL, COVER_GRADIENTS } from './books/constants';

interface BookTrackerProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
}

export default function BookTracker({ courses, terms }: BookTrackerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [books, setBooks] = useState<BookItem[]>([]);
    const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('reading');
    const [categoryFilter, setCategoryFilter] = useState<BookCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [readingGoal, setReadingGoal] = useState<ReadingGoal>({ year: 2026, target_books: 20 });

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

    // Save helper
    const saveBooks = (updated: BookItem[]) => {
        setBooks(updated);
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(updated));
    };

    const handleSaveGoal = (newGoal: ReadingGoal) => {
        setReadingGoal(newGoal);
        localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(newGoal));
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

    const handleSaveNotes = (id: string, notes: string) => {
        if (activeBookForNotes && activeBookForNotes.id === id) {
            setActiveBookForNotes({ ...activeBookForNotes, summary_notes: notes });
        }
        const updated = books.map(b => b.id === id ? { ...b, summary_notes: notes } : b);
        saveBooks(updated);
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

    // Calculations
    const completedCount = books.filter(b => b.status === 'completed').length;
    const readingNowCount = books.filter(b => b.status === 'reading').length;
    const wantToReadCount = books.filter(b => b.status === 'to_read').length;
    const totalPagesRead = books.reduce((acc, curr) => acc + curr.current_page, 0);

    return (
        <div className="space-y-6">
            
            {/* Top Scoreboard: Reading Goal */}
            <BookGoalBanner
                readingGoal={readingGoal}
                completedCount={completedCount}
                readingNowCount={readingNowCount}
                wantToReadCount={wantToReadCount}
                totalPagesRead={totalPagesRead}
                isIndo={isIndo}
                onSaveGoal={handleSaveGoal}
            />

            {/* Controls & Search */}
            <BookFilterBar
                statusFilter={statusFilter}
                categoryFilter={categoryFilter}
                searchQuery={searchQuery}
                readingNowCount={readingNowCount}
                wantToReadCount={wantToReadCount}
                completedCount={completedCount}
                totalBooksCount={books.length}
                isIndo={isIndo}
                onStatusChange={setStatusFilter}
                onCategoryChange={setCategoryFilter}
                onSearchChange={setSearchQuery}
                onAddBookClick={() => { resetForm(); setEditingBook(null); setIsAddModalOpen(true); }}
            />

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
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            isIndo={isIndo}
                            onUpdatePages={handleUpdatePages}
                            onEdit={handleOpenEdit}
                            onDelete={handleDeleteBook}
                            onOpenNotes={(b) => { setActiveBookForNotes(b); setIsNotesModalOpen(true); }}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <BookModal
                isOpen={isAddModalOpen}
                isEdit={!!editingBook}
                formData={formData}
                courses={courses}
                isIndo={isIndo}
                onClose={() => setIsAddModalOpen(false)}
                onChange={(field, val) => setFormData(prev => ({ ...prev, [field]: val }))}
                onSubmit={handleSaveBook}
            />

            <BookNotesModal
                isOpen={isNotesModalOpen}
                book={activeBookForNotes}
                isIndo={isIndo}
                onClose={() => setIsNotesModalOpen(false)}
                onSaveNotes={handleSaveNotes}
            />

        </div>
    );
}
