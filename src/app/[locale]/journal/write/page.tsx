'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from '@/i18n/routing';
import { 
    ArrowLeft, Save, Trash2, Camera, Bold, 
    Italic, List, Type, ChevronDown, Mic, MicOff, Sparkles 
} from 'lucide-react';

interface JournalWritePageProps {
    params?: Promise<{
        locale?: string;
        id?: string;
    }>;
}

export default function JournalWritePage({ params }: JournalWritePageProps) {
    const t = useTranslations();
    const router = useRouter();
    const resolvedParams = params ? React.use(params) : null;
    const journalId = resolvedParams?.id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string>('awesome');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isBullet, setIsBullet] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Inter, sans-serif');
    const [selectedFontSize, setSelectedFontSize] = useState('1.125rem');
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showSizeMenu, setShowSizeMenu] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (!journalId) return;

        const saved = localStorage.getItem('oneformind_journals');
        if (saved) {
            try {
                const list = JSON.parse(saved);
                const item = list.find((j: any) => String(j.id) === String(journalId));
                if (item) {
                    setTitle(item.title || '');
                    setContent(item.content || '');
                    setMood(item.mood || 'awesome');
                    setImageUrl(item.imageUrl || null);
                    return;
                }
            } catch (e) {
                console.error(e);
            }
        }

        // Fallbacks if not found in localStorage
        if (journalId === '1') {
            setTitle('Eksplorasi Arsitektur Next.js 16 & AI OS');
            setContent('Hari ini berhasil menyusun modularisasi komponen Journal dan Study Portfolio dengan performa tinggi.');
            setMood('awesome');
        } else if (journalId === '2') {
            setTitle('Refleksi Sesi Deep Work');
            setContent('Fokus menyelesaikan perbaikan rute middleware dan memastikan semua halaman memuat cepat.');
            setMood('good');
        }
    }, [journalId]);

    const dateStr = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const moods = [
        { slug: 'awesome', emoji: '🤩', label: 'Luar Biasa' },
        { slug: 'good', emoji: '😊', label: 'Senang' },
        { slug: 'okay', emoji: '😐', label: 'Biasa Saja' },
        { slug: 'sad', emoji: '😢', label: 'Sedih' },
        { slug: 'angry', emoji: '😡', label: 'Marah' },
    ];

    const fontFamilies = [
        { name: "Modern Sans", value: "Inter, sans-serif" },
        { name: "Elegant Serif", value: "Lora, serif" },
        { name: "Classic Serif", value: "Playfair Display, serif" },
        { name: "Noble Serif", value: "Merriweather, serif" },
        { name: "Design Mono", value: "JetBrains Mono, monospace" },
        { name: "Modern Writing", value: "Outfit, sans-serif" },
    ];

    const fontSizes = [
        { label: "Normal", value: "1.125rem" },
        { label: "Medium", value: "1.25rem" },
        { label: "Large", value: "1.5rem" },
        { label: "Extra", value: "1.875rem" },
    ];

    const handleSave = () => {
        if (!title && !content) return;
        setIsSaving(true);

        const saved = localStorage.getItem('oneformind_journals');
        let list = [];
        if (saved) {
            try {
                list = JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        }

        const sentimentMap: Record<string, string> = {
            awesome: 'Sentimen sangat positif dan berorientasi pada pencapaian tinggi (High Productivity & Optimism).',
            good: 'Fokus kerja mendalam dengan kestabilan emosi yang baik.',
            okay: 'Suasana hati netral, direkomendasikan untuk melakukan aktivitas penyegaran.',
            sad: 'Kecenderungan sentimen melow, disarankan untuk istirahat sejenak.',
            angry: 'Tingkat stres tinggi, prioritaskan teknik pernapasan dalam.',
        };

        if (journalId) {
            // Edit existing entry
            list = list.map((j: any) => {
                if (String(j.id) === String(journalId)) {
                    return {
                        ...j,
                        title,
                        content,
                        mood,
                        imageUrl,
                        ai_sentiment: sentimentMap[mood] || 'Sentimen netral.'
                    };
                }
                return j;
            });
        } else {
            // Add new entry
            const newJournal = {
                id: Date.now().toString(),
                title: title || 'Untitled Entry',
                content,
                date: new Date().toISOString(),
                mood,
                imageUrl,
                ai_sentiment: sentimentMap[mood] || 'Sentimen netral.'
            };
            list = [newJournal, ...list];
        }

        localStorage.setItem('oneformind_journals', JSON.stringify(list));

        setTimeout(() => {
            setIsSaving(false);
            router.push('/journal');
        }, 600);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    const toggleVoiceRecognition = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Browser Anda tidak mendukung Voice to Text.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        try {
            const rec = new SpeechRecognition();
            rec.lang = 'id-ID';
            rec.continuous = true;
            rec.interimResults = false;

            rec.onstart = () => setIsListening(true);
            rec.onend = () => setIsListening(false);
            rec.onresult = (event: any) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                setContent(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognitionRef.current = rec;
            rec.start();
        } catch (e) {
            console.error('Speech recognition error', e);
        }
    };

    return (
        // 1:1 from JournalEntry.vue line 65-214 + TiptapEditor.vue toolbar
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 relative selection:bg-indigo-100 dark:selection:bg-indigo-900/40 pb-32 transition-colors duration-500 ${isZenMode ? 'bg-slate-950 text-white' : ''}`}>
            
            {/* Sticky Navigation & Rich Toolbar Header */}
            <header className={`sticky top-0 z-50 border-b px-4 md:px-6 py-4 flex items-center justify-between shadow-sm transition-all duration-500 ${isZenMode ? 'bg-slate-950/80 border-slate-900 text-white' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur border-slate-100 dark:border-slate-800'}`}>
                <Link
                    href="/journal"
                    className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 md:px-4 py-2 rounded-xl"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('btn_back_dashboard') || 'Kembali ke Dashboard'}</span>
                </Link>

                {/* Integrated Rich Text Toolbar */}
                <div className="flex flex-wrap items-center gap-1 md:gap-2 justify-center">
                    {/* Bold */}
                    <button
                        type="button"
                        onClick={() => setIsBold(!isBold)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isBold ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4 stroke-[3]" />
                    </button>

                    {/* Italic */}
                    <button
                        type="button"
                        onClick={() => setIsItalic(!isItalic)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isItalic ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center"></div>

                    {/* Font Family Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setShowFontMenu(!showFontMenu); setShowSizeMenu(false); }}
                            className="h-10 px-3 rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 font-bold active:scale-95"
                        >
                            <Type className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                        {showFontMenu && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-[100]">
                                {fontFamilies.map((font) => (
                                    <button
                                        key={font.value}
                                        type="button"
                                        onClick={() => { setSelectedFont(font.value); setShowFontMenu(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-between ${
                                            selectedFont === font.value ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Font Size Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => { setShowSizeMenu(!showSizeMenu); setShowFontMenu(false); }}
                            className="h-10 px-3 rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 font-bold active:scale-95"
                        >
                            <span className="text-xs">Aa</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                        {showSizeMenu && (
                            <div className="absolute top-full mt-2 left-0 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-[100]">
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.value}
                                        type="button"
                                        onClick={() => { setSelectedFontSize(size.value); setShowSizeMenu(false); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-between ${
                                            selectedFontSize === size.value ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <span>{size.label}</span>
                                        <span className="text-[9px] opacity-40">{size.value}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center"></div>

                    {/* Bullet List */}
                    <button
                        type="button"
                        onClick={() => setIsBullet(!isBullet)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isBullet ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4 stroke-[3]" />
                    </button>

                    {/* Voice to Text */}
                    <button
                        type="button"
                        onClick={toggleVoiceRecognition}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Voice to Text"
                    >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* Zen Focus Mode Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsZenMode(!isZenMode)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isZenMode ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        title="Zen Focus Mode"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-[10px] md:text-xs font-black tracking-widest px-4 md:px-6 py-2 md:py-2.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? (t('status_saving') || 'Saving...') : (t('btn_save_manual') || 'Save')}</span>
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
                <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border relative transition-colors duration-500 ${isZenMode ? 'bg-slate-900 border-slate-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                    
                    <div className="text-[10px] font-black tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                        <span>📅</span>
                        <span>{dateStr}</span>
                    </div>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('journal_title_placeholder') || 'Beri judul harimu...'}
                        className="w-full text-3xl md:text-5xl font-black text-slate-800 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 border-none bg-transparent focus:ring-0 p-0 mb-8 tracking-tight leading-tight transition-colors duration-500 outline-none"
                    />

                    {/* Mood Selector */}
                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 mr-2">
                            {t('journal_mood_label') || 'Mood hari ini:'}
                        </span>
                        {moods.map((item) => (
                            <button
                                key={item.slug}
                                type="button"
                                onClick={() => setMood(item.slug)}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl text-xl md:text-2xl flex items-center justify-center transition-all border-2 ${
                                    mood === item.slug
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/50 scale-110 shadow-sm'
                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0'
                                }`}
                                title={item.label}
                            >
                                {item.emoji}
                            </button>
                        ))}
                    </div>

                    {/* Image Attachment */}
                    <div className="mb-10 group relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleImageUpload}
                        />

                        {imageUrl ? (
                            <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                                <img src={imageUrl} alt="Journal Attachment" className="w-full h-auto max-h-[500px] object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10 cursor-pointer"
                                >
                                    <Trash2 className="w-5 h-5 stroke-[2.5]" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer relative overflow-hidden group"
                            >
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="text-[9px] font-black tracking-widest">
                                    {t('journal_add_photo') || 'Sisipkan foto jurnal'}
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Rich Content Area */}
                    <div className="min-h-[400px]">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t('journal_placeholder') || 'Mulai menulis cerita harimu...'}
                            style={{
                                fontFamily: selectedFont,
                                fontSize: selectedFontSize,
                                fontWeight: isBold ? 'bold' : 'normal',
                                fontStyle: isItalic ? 'italic' : 'normal'
                            }}
                            className="w-full min-h-[350px] p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}
