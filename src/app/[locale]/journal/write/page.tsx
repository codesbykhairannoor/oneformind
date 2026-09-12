'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import JournalEditorHeader from './components/JournalEditorHeader';
import JournalEditorBody from './components/JournalEditorBody';
import { analyzeJournalCognitive } from '../lib/journalAi';

interface JournalWritePageProps {
    params?: Promise<{
        locale?: string;
        id?: string;
    }>;
}

export default function JournalWritePage({ params }: JournalWritePageProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const router = useRouter();
    const searchParams = useSearchParams();
    const habitFriction = searchParams ? searchParams.get('habitFriction') : null;
    const habitIcon = (searchParams ? searchParams.get('habitIcon') : null) || '🌱';

    const resolvedParams = params ? React.use(params) : null;
    const journalId = resolvedParams?.id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string>('okay');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isInsertingBrief, setIsInsertingBrief] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

    // Styling & Tools State
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Inter, sans-serif');
    const [selectedFontSize, setSelectedFontSize] = useState('1.125rem');
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [showSizeMenu, setShowSizeMenu] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);
    const [isPrivacyBlur, setIsPrivacyBlur] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    // 1. Fetch Existing Journal (Edit Mode) or Load Local Draft (New Mode)
    useEffect(() => {
        if (journalId) {
            const fetchJournal = async () => {
                try {
                    const res = await fetch('/api/journals');
                    if (res.ok) {
                        const data = await res.json();
                        const item = data.find((j: any) => String(j.id) === String(journalId));
                        if (item) {
                            setTitle(item.title || '');
                            
                            let rawContent = item.content || '';
                            if (rawContent.includes('<')) {
                                rawContent = rawContent
                                    .replace(/<br\s*[\/]?>/gi, '\n')
                                    .replace(/<\/p>/gi, '\n\n')
                                    .replace(/<\/div>/gi, '\n\n')
                                    .replace(/<\/h[1-6]>/gi, '\n\n')
                                    .replace(/<\/li>/gi, '\n')
                                    .replace(/<li[^>]*>/gi, '- ')
                                    .replace(/<[^>]+>/g, '')
                                    .replace(/\n{3,}/g, '\n\n')
                                    .trim();
                            }
                            
                            setContent(rawContent);
                            setMood(item.mood || 'awesome');
                            setImageUrl(item.imagePath || item.image_url || null);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch journal for edit:', error);
                }
            };
            fetchJournal();
        } else if (habitFriction) {
            // Guided Habit Friction Audit template
            setTitle(isIndo ? `🔍 Diagnostik Friksi: ${habitIcon} ${habitFriction}` : `🔍 Habit Friction Audit: ${habitIcon} ${habitFriction}`);
            setContent(isIndo ? `# 🔍 Diagnostik Friksi: ${habitIcon} ${habitFriction}

> "Jangan hukum diri sendiri saat kebiasaan terputus. Perlakukan ini sebagai eksperimen ilmiah untuk memperbaiki sistem lingkungan dan ekspektasi energi Anda."

### 1. 🧬 Analisis Akar Hambatan (Root Cause):
- [ ] Energi Rendah: Kelelahan, waktu tidur kurang, atau kehabisan willpower
- [ ] Friksi Lingkungan: Alat/pemicu tidak siap, lingkungan penuh distraksi
- [ ] Beban Mental Terlalu Berat: Target terlalu muluk saat hari sedang padat

### 2. 📝 Fakta Obyektif (Tanpa Menghakimi):
Apa yang sebenarnya terjadi pada jam pelaksanaan kebiasaan ini dalam beberapa hari terakhir?


### 3. 🛡️ Penyesuaian Sistem (Implementation Intention):
- **JIKA** [kondisi hambatan/lelah serupa terulang],
- **MAKA** saya akan [aktifkan Mode 2 Menit / siapkan pemicu 1 jam lebih awal].
` : `# 🔍 Habit Friction Audit: ${habitIcon} ${habitFriction}

> "Never blame lack of willpower for a broken streak. Audit the friction in your environment and energy like a scientist observing an experiment."

### 1. 🧬 Root Cause Analysis:
- [ ] Low Energy / Poor Sleep: Willpower depletion from work
- [ ] Environmental Friction: Trigger hidden, workspace unprepared
- [ ] High Cognitive Load: Target too ambitious on overloaded days

### 2. 📝 Objective Reality:
What actually happened during the scheduled habit window over the last few days?


### 3. 🛡️ Systemic Adjustment (Implementation Intention):
- **IF** [this obstacle occurs again],
- **THEN** I will [switch to the 2-Minute fallback / prepare cues earlier].
`);
            setMood('okay');
        } else {
            // Restore draft from localStorage if available
            try {
                const savedDraft = localStorage.getItem('tranvas_journal_draft');
                if (savedDraft) {
                    const parsed = JSON.parse(savedDraft);
                    if (parsed.content || parsed.title) {
                        setTitle(parsed.title || '');
                        setContent(parsed.content || '');
                        if (parsed.mood) setMood(parsed.mood);
                    }
                }
            } catch (e) {
                console.error('Draft restore error', e);
            }
        }
    }, [journalId, habitFriction, isIndo, habitIcon]);

    // 2. Auto-save Draft to LocalStorage every 5s if creating new
    useEffect(() => {
        if (journalId) return;
        if (!title && !content) return;

        const timeout = setTimeout(() => {
            try {
                localStorage.setItem('tranvas_journal_draft', JSON.stringify({
                    title,
                    content,
                    mood,
                    updatedAt: new Date().toISOString()
                }));
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setLastSavedTime(timeStr);
            } catch (e) {
                console.error('Draft auto-save error', e);
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [title, content, mood, journalId]);

    // Date formatting for header
    const dateStr = useMemo(() => {
        try {
            return new Date().toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return '';
        }
    }, [isIndo]);

    // Calculate Word Count & Reading Time
    const wordCount = useMemo(() => {
        const clean = content.replace(/<[^>]*>?/gm, ' ').replace(/#\w+/g, ' ');
        return clean.split(/\s+/).filter(Boolean).length;
    }, [content]);

    const readTimeMinutes = useMemo(() => {
        return Math.max(1, Math.ceil(wordCount / 180));
    }, [wordCount]);

    const moods = [
        { slug: 'awesome', emoji: '🤩', label: isIndo ? 'Luar Biasa' : 'Awesome' },
        { slug: 'good', emoji: '😊', label: isIndo ? 'Senang' : 'Good' },
        { slug: 'okay', emoji: '😐', label: isIndo ? 'Biasa Saja' : 'Okay' },
        { slug: 'sad', emoji: '😢', label: isIndo ? 'Sedih' : 'Sad' },
        { slug: 'angry', emoji: '😡', label: isIndo ? 'Marah / Stres' : 'Angry / Stressed' },
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
        { label: isIndo ? "Normal" : "Normal", value: "1.125rem" },
        { label: isIndo ? "Sedang" : "Medium", value: "1.25rem" },
        { label: isIndo ? "Besar" : "Large", value: "1.5rem" },
        { label: isIndo ? "Ekstra" : "Extra", value: "1.875rem" },
    ];

    // Markdown insertion helper
    const handleInsertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) {
            setContent(prev => `${prev}${prefix}${defaultText}${suffix}`);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end) || defaultText;
        const replacement = `${prefix}${selected}${suffix}`;
        
        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
        }, 10);
    };

    // 1-Click Life OS Brief Auto-Injection
    const handleInsertLifeOSBrief = async () => {
        setIsInsertingBrief(true);
        try {
            const dashRes = await fetch('/api/dashboard');
            let tasksCompleted = 0;
            let tasksTotal = 0;
            let habitsCompleted = 0;
            let expenseTotal = 0;

            if (dashRes.ok) {
                const dashData = await dashRes.json();
                tasksCompleted = dashData.planner?.completed || 0;
                tasksTotal = dashData.planner?.total || 0;
                habitsCompleted = dashData.habits?.completed || 0;
                expenseTotal = dashData.finance?.expense || 0;
            }

            const formattedExpense = isIndo 
                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(expenseTotal)
                : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(expenseTotal);

            const briefSection = isIndo ? `
---
### 📊 Rekap Hari Ini (Daily Life OS Brief)
- ✅ **Penyelesaian Tugas:** ${tasksCompleted}/${tasksTotal} tugas terlaksana
- 🔄 **Kebiasaan Harian:** ${habitsCompleted} habit konsisten
- 💰 **Pengeluaran Hari Ini:** ${formattedExpense}
---
` : `
---
### 📊 Today's Recap (Daily Life OS Brief)
- ✅ **Task Execution:** ${tasksCompleted}/${tasksTotal} tasks completed
- 🔄 **Daily Habits:** ${habitsCompleted} habits checked in
- 💰 **Today's Spend:** ${formattedExpense}
---
`;

            setContent(prev => prev ? `${prev.trim()}\n\n${briefSection.trim()}\n` : briefSection.trim());
        } catch (error) {
            console.error('Failed to inject Life OS Brief:', error);
        } finally {
            setIsInsertingBrief(false);
        }
    };

    // Save Action
    const handleSave = async () => {
        if (!title && !content) return;
        setIsSaving(true);

        try {
            if (journalId) {
                await fetch(`/api/journals/${journalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title || (isIndo ? 'Catatan Refleksi' : 'Daily Reflection'),
                        content,
                        mood,
                        imagePath: imageUrl,
                        image_url: imageUrl,
                        aiSentiment: ''
                    })
                });
            } else {
                await fetch('/api/journals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title || (isIndo ? 'Catatan Refleksi' : 'Daily Reflection'),
                        content,
                        date: new Date().toISOString(),
                        mood,
                        imagePath: imageUrl,
                        image_url: imageUrl,
                        aiSentiment: ''
                    })
                });
                // Clear local draft upon successful save
                try {
                    localStorage.removeItem('tranvas_journal_draft');
                } catch (e) {}
            }
        } catch (error) {
            console.error('Failed to save journal:', error);
        }

        setTimeout(() => {
            setIsSaving(false);
            router.push('/journal');
        }, 500);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImageUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleVoiceRecognition = () => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(isIndo ? 'Browser Anda belum mendukung Dikte Suara (Voice to Text).' : 'Your browser does not support Voice to Text.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        try {
            const rec = new SpeechRecognition();
            rec.lang = isIndo ? 'id-ID' : 'en-US';
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
        <div className={`min-h-screen relative selection:bg-indigo-100 dark:selection:bg-indigo-900/40 pb-32 transition-colors duration-300 ${
            isZenMode 
                ? 'bg-slate-950 text-white' 
                : 'bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-white'
        }`}>
            
            <JournalEditorHeader
                isZenMode={isZenMode}
                setIsZenMode={setIsZenMode}
                isPrivacyBlur={isPrivacyBlur}
                setIsPrivacyBlur={setIsPrivacyBlur}
                wordCount={wordCount}
                readTimeMinutes={readTimeMinutes}
                isBold={isBold}
                setIsBold={setIsBold}
                isItalic={isItalic}
                setIsItalic={setIsItalic}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                selectedFontSize={selectedFontSize}
                setSelectedFontSize={setSelectedFontSize}
                showFontMenu={showFontMenu}
                setShowFontMenu={setShowFontMenu}
                showSizeMenu={showSizeMenu}
                setShowSizeMenu={setShowSizeMenu}
                isListening={isListening}
                toggleVoiceRecognition={toggleVoiceRecognition}
                onInsertMarkdown={handleInsertMarkdown}
                handleSave={handleSave}
                isSaving={isSaving}
                lastSavedTime={lastSavedTime}
                fontFamilies={fontFamilies}
                fontSizes={fontSizes}
            />

            <JournalEditorBody
                isZenMode={isZenMode}
                isPrivacyBlur={isPrivacyBlur}
                dateStr={dateStr}
                title={title}
                setTitle={setTitle}
                mood={mood}
                setMood={setMood}
                moods={moods}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                content={content}
                setContent={setContent}
                textareaRef={textareaRef}
                selectedFont={selectedFont}
                selectedFontSize={selectedFontSize}
                isBold={isBold}
                isItalic={isItalic}
                onInsertLifeOSBrief={handleInsertLifeOSBrief}
                isInsertingBrief={isInsertingBrief}
            />
        </div>
    );
}

