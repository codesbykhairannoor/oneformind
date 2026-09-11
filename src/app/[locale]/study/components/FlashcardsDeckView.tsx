'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    Layers, Sparkles, RotateCw, CheckCircle2, 
    XCircle, HelpCircle, Plus, ChevronLeft, ChevronRight,
    Trash2, BrainCircuit, BookOpen, Shuffle
} from 'lucide-react';
import { CourseRecord } from './CourseCard';
import ModalPortal from '@/components/ModalPortal';

export interface FlashcardItem {
    id: string;
    course_name: string;
    question: string;
    answer: string;
    mastery_score: number; // 0 = unlearned, 1 = learning, 2 = mastered
}

interface FlashcardsDeckViewProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
}

const STORAGE_KEY = 'tranvas_study_flashcards';

export default function FlashcardsDeckView({ courses, terms }: FlashcardsDeckViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [cards, setCards] = useState<FlashcardItem[]>([]);
    const [selectedDeckCourse, setSelectedDeckCourse] = useState<string>('all');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        course_name: courses[0]?.course_name || '',
        question: '',
        answer: ''
    });

    // Load initial flashcards
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setCards(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        } else {
            const defaults: FlashcardItem[] = [
                {
                    id: '1',
                    course_name: courses[0]?.course_name || (isIndo ? 'Pemrograman Web' : 'Web Engineering'),
                    question: isIndo ? 'Apa perbedaan utama antara React Server Components (RSC) dan Client Components?' : 'What is the key difference between React Server Components (RSC) and Client Components?',
                    answer: isIndo ? 'RSC dieksekusi di server dan mengirim 0 KB client-side JavaScript bundle, sedangkan Client Components dieksekusi di browser untuk state dan interactivity.' : 'RSC executes on the server and ships 0 KB client-side JavaScript, whereas Client Components execute in the browser for local state and interactivity.',
                    mastery_score: 1
                },
                {
                    id: '2',
                    course_name: courses[0]?.course_name || (isIndo ? 'Pemrograman Web' : 'Web Engineering'),
                    question: isIndo ? 'Kapan sebaiknya menggunakan dynamic rendering vs static rendering di Next.js?' : 'When should you use dynamic rendering vs static rendering in Next.js?',
                    answer: isIndo ? 'Gunakan static rendering untuk konten yang jarang berubah (blog, landing page), dan dynamic rendering jika data bergantung pada user headers/cookies/searchParams per request.' : 'Use static rendering for content that rarely changes (blogs, docs), and dynamic rendering when data depends on per-request cookies/headers/searchParams.',
                    mastery_score: 2
                },
                {
                    id: '3',
                    course_name: courses[1]?.course_name || (isIndo ? 'Algoritma & Struktur Data' : 'Data Structures'),
                    question: isIndo ? 'Berapa kompleksitas waktu algoritma Dijkstra dengan Priority Queue (Min-Heap)?' : 'What is the time complexity of Dijkstra algorithm with a Min-Heap Priority Queue?',
                    answer: isIndo ? 'O((V + E) log V), di mana V adalah jumlah vertex dan E adalah jumlah edge graf.' : 'O((V + E) log V), where V is the number of vertices and E is the number of edges.',
                    mastery_score: 0
                },
                {
                    id: '4',
                    course_name: courses[1]?.course_name || (isIndo ? 'Algoritma & Struktur Data' : 'Data Structures'),
                    question: isIndo ? 'Apa prinsip dasar Dynamic Programming (Memoization vs Tabulation)?' : 'What is the core principle of Dynamic Programming (Memoization vs Tabulation)?',
                    answer: isIndo ? 'Memoization menggunakan pendekatan Top-Down dengan rekursi + cache tabel. Tabulation menggunakan pendekatan Bottom-Up dengan iterasi mengisi tabel array.' : 'Memoization is Top-Down using recursion + cache table. Tabulation is Bottom-Up using iteration to fill table array sequentially.',
                    mastery_score: 2
                }
            ];
            setCards(defaults);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        }
    }, [courses, isIndo]);

    const saveCards = (newCards: FlashcardItem[]) => {
        setCards(newCards);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
    };

    // Filtered deck
    const activeDeck = cards.filter(c => selectedDeckCourse === 'all' || c.course_name === selectedDeckCourse);
    const activeCard = activeDeck[currentIndex] || null;

    // Reset index if out of bounds
    useEffect(() => {
        if (currentIndex >= activeDeck.length) {
            setCurrentIndex(0);
        }
        setIsFlipped(false);
    }, [selectedDeckCourse, activeDeck.length]);

    // Handle grade response
    const handleGrade = (score: number) => {
        if (!activeCard) return;
        const updated = cards.map(c => c.id === activeCard.id ? { ...c, mastery_score: score } : c);
        saveCards(updated);
        setIsFlipped(false);
        if (currentIndex < activeDeck.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handleCreateCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) return;

        const newCard: FlashcardItem = {
            id: Date.now().toString(),
            course_name: formData.course_name || (courses[0]?.course_name || 'Umum'),
            question: formData.question,
            answer: formData.answer,
            mastery_score: 0
        };

        const updated = [newCard, ...cards];
        saveCards(updated);
        setIsAddModalOpen(false);
        setFormData({
            course_name: courses[0]?.course_name || '',
            question: '',
            answer: ''
        });
    };

    const handleDeleteCard = (id: string) => {
        const updated = cards.filter(c => c.id !== id);
        saveCards(updated);
    };

    // Stats
    const totalDeckCards = activeDeck.length;
    const masteredCount = activeDeck.filter(c => c.mastery_score === 2).length;
    const masteryPct = totalDeckCards > 0 ? Math.round((masteredCount / totalDeckCards) * 100) : 0;

    return (
        <div className="space-y-6">
            
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-sm">
                
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={18} className="text-indigo-500" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {isIndo ? 'Deck Active Recall' : 'Active Recall Decks'}
                        </h3>
                    </div>

                    <select
                        value={selectedDeckCourse}
                        onChange={(e) => setSelectedDeckCourse(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                    >
                        <option value="all">{isIndo ? 'Semua Deck Matakuliah' : 'All Course Decks'}</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.course_name}>{c.course_name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mastery Indicator */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <Sparkles size={13} className="text-indigo-500" />
                        <span>{masteredCount}/{totalDeckCards} {isIndo ? 'Dikuasai' : 'Mastered'} ({masteryPct}%)</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition"
                    >
                        <Plus size={15} />
                        <span>{isIndo ? 'Buat Kartu Baru' : 'New Flashcard'}</span>
                    </button>
                </div>

            </div>

            {/* 3D Flashcard Player Area */}
            {activeDeck.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                        <Layers size={28} />
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {isIndo ? 'Belum Ada Flashcard di Deck Ini' : 'No Flashcards in this Deck'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isIndo ? 'Tambahkan pertanyaan dan jawaban untuk mengasah ingatan jangka panjang.' : 'Add question-answer pairs to build active recall neural connections.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-2xl shadow-md"
                    >
                        {isIndo ? 'Tambah Flashcard Pertama' : 'Create First Card'}
                    </button>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Card Counter & Subject Pill */}
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {activeCard?.course_name}
                        </span>
                        <span className="text-xs font-mono font-black text-slate-400">
                            {currentIndex + 1} / {totalDeckCards}
                        </span>
                    </div>

                    {/* The 3D Interactive Flip Card */}
                    <div 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="cursor-pointer min-h-[320px] sm:min-h-[380px] rounded-[3rem] p-8 sm:p-12 relative flex flex-col justify-between transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 group select-none"
                    >
                        {/* Top Indicator */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <RotateCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
                                <span>{isFlipped ? (isIndo ? 'JAWABAN / PENJELASAN' : 'ANSWER / SOLUTION') : (isIndo ? 'PERTANYAAN / KONSEP' : 'QUESTION / CONCEPT')}</span>
                            </span>

                            {activeCard?.mastery_score === 2 && (
                                <span className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                                    <CheckCircle2 size={14} />
                                    <span>{isIndo ? 'Tuntas Dikuasai' : 'Mastered'}</span>
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="my-auto py-6 text-center">
                            {isFlipped ? (
                                <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed animate-in fade-in zoom-in-95 duration-200">
                                    {activeCard?.answer}
                                </p>
                            ) : (
                                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug animate-in fade-in zoom-in-95 duration-200">
                                    {activeCard?.question}
                                </h3>
                            )}
                        </div>

                        {/* Bottom Instruction */}
                        <div className="text-center">
                            <span className="text-[11px] text-slate-400 font-semibold">
                                {isFlipped ? (isIndo ? 'Ketuk kartu untuk kembali' : 'Tap to flip back') : (isIndo ? 'Ketuk kartu untuk melihat jawaban' : 'Tap card to reveal answer')}
                            </span>
                        </div>
                    </div>

                    {/* Mastery Response Buttons (Appears after flipping) */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => handleGrade(0)}
                            className="p-3 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-black transition active:scale-95 flex flex-col sm:flex-row items-center justify-center gap-1.5"
                        >
                            <XCircle size={16} />
                            <span>{isIndo ? 'Sulit / Lupa' : 'Hard / Forgot'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleGrade(1)}
                            className="p-3 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-black transition active:scale-95 flex flex-col sm:flex-row items-center justify-center gap-1.5"
                        >
                            <HelpCircle size={16} />
                            <span>{isIndo ? 'Lumayan Ingat' : 'Good / Recalled'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleGrade(2)}
                            className="p-3 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-black transition active:scale-95 flex flex-col sm:flex-row items-center justify-center gap-1.5"
                        >
                            <CheckCircle2 size={16} />
                            <span>{isIndo ? 'Paham Banget' : 'Mastered'}</span>
                        </button>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsFlipped(false);
                                setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalDeckCards - 1));
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                        >
                            <ChevronLeft size={14} />
                            <span>{isIndo ? 'Sebelumnya' : 'Previous'}</span>
                        </button>

                        {activeCard && (
                            <button
                                type="button"
                                onClick={() => handleDeleteCard(activeCard.id)}
                                className="text-slate-400 hover:text-rose-500 p-2 rounded-xl text-xs flex items-center gap-1 transition"
                            >
                                <Trash2 size={13} />
                                <span>{isIndo ? 'Hapus Kartu' : 'Delete'}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                setIsFlipped(false);
                                setCurrentIndex(prev => (prev < totalDeckCards - 1 ? prev + 1 : 0));
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                        >
                            <span>{isIndo ? 'Berikutnya' : 'Next'}</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>

                </div>
            )}

            {/* Create Flashcard Modal */}
            {isAddModalOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
                            
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                {isIndo ? 'Buat Flashcard Baru' : 'Add New Flashcard'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                {isIndo ? 'Format pertanyaan singkat dan jawaban presisi untuk melatih ingatan aktif.' : 'Short questions and clear answers build effective recall loops.'}
                            </p>

                            <form onSubmit={handleCreateCard} className="space-y-4">
                                {/* Course Selection */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {terms.course || (isIndo ? 'Matakuliah' : 'Course')}
                                    </label>
                                    <select
                                        value={formData.course_name}
                                        onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                                        className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
                                    >
                                        {courses.map(c => (
                                            <option key={c.id} value={c.course_name}>{c.course_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Question Front */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Sisi Depan (Pertanyaan / Konsep)' : 'Front Side (Question / Concept)'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        placeholder={isIndo ? 'Contoh: Apa kegunaan hook useEffect with dependency array kosong?' : 'e.g. What is the purpose of useEffect with an empty dependency array?'}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                {/* Answer Back */}
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        {isIndo ? 'Sisi Belakang (Jawaban / Solusi)' : 'Back Side (Answer / Solution)'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        placeholder={isIndo ? 'Contoh: Menjalankan side effect hanya satu kali saat komponen pertama kali dipasang (mount).' : 'e.g. Executes side effect once when component mounts.'}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                {/* Actions */}
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
                                        {isIndo ? 'Simpan Kartu' : 'Save Flashcard'}
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </ModalPortal>
            )}

        </div>
    );
}
