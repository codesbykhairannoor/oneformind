'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import JournalEditorHeader from './components/JournalEditorHeader';
import JournalEditorBody from './components/JournalEditorBody';

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

        const fetchJournal = async () => {
            try {
                const res = await fetch('/api/journals');
                if (res.ok) {
                    const data = await res.json();
                    const item = data.find((j: any) => String(j.id) === String(journalId));
                    if (item) {
                        setTitle(item.title || '');
                        
                        let rawContent = item.content || '';
                        const txt = document.createElement("textarea");
                        txt.innerHTML = rawContent;
                        rawContent = txt.value;

                        if (rawContent.includes('<')) {
                            rawContent = rawContent.replace(/<br\s*[\/]?>/gi, '\n')
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
                        setImageUrl(item.imagePath || null);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch journal:', error);
            }
        };
        fetchJournal();
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

    const handleSave = async () => {
        if (!title && !content) return;
        setIsSaving(true);

        const sentimentMap: Record<string, string> = {
            awesome: 'Sentimen sangat positif dan berorientasi pada pencapaian tinggi (High Productivity & Optimism).',
            good: 'Fokus kerja mendalam dengan kestabilan emosi yang baik.',
            okay: 'Suasana hati netral, direkomendasikan untuk melakukan aktivitas penyegaran.',
            sad: 'Kecenderungan sentimen melow, disarankan untuk istirahat sejenak.',
            angry: 'Tingkat stres tinggi, prioritaskan teknik pernapasan dalam.',
        };
        const aiSentiment = sentimentMap[mood] || 'Sentimen netral.';

        try {
            if (journalId) {
                await fetch(`/api/journals/${journalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        content,
                        mood,
                        imagePath: imageUrl,
                        aiSentiment
                    })
                });
            } else {
                await fetch('/api/journals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title || 'Untitled Entry',
                        content,
                        date: new Date().toISOString(),
                        mood,
                        imagePath: imageUrl,
                        aiSentiment
                    })
                });
            }
        } catch (error) {
            console.error('Failed to save journal:', error);
        }

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
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 relative selection:bg-indigo-100 dark:selection:bg-indigo-900/40 pb-32 transition-colors duration-500 ${isZenMode ? 'bg-slate-950 text-white' : ''}`}>
            
            <JournalEditorHeader
                t={t}
                isZenMode={isZenMode}
                isBold={isBold}
                setIsBold={setIsBold}
                isItalic={isItalic}
                setIsItalic={setIsItalic}
                isBullet={isBullet}
                setIsBullet={setIsBullet}
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
                setIsZenMode={setIsZenMode}
                handleSave={handleSave}
                isSaving={isSaving}
                fontFamilies={fontFamilies}
                fontSizes={fontSizes}
            />

            <JournalEditorBody
                t={t}
                isZenMode={isZenMode}
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
            />
        </div>
    );
}
