'use client';

import React from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface JournalEditorBodyProps {
    t: any;
    isZenMode: boolean;
    dateStr: string;
    title: string;
    setTitle: (val: string) => void;
    mood: string;
    setMood: (val: string) => void;
    moods: { slug: string; emoji: string; label: string }[];
    imageUrl: string | null;
    setImageUrl: (url: string | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    content: string;
    setContent: (val: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    selectedFont: string;
    selectedFontSize: string;
    isBold: boolean;
    isItalic: boolean;
}

export default function JournalEditorBody({
    t,
    isZenMode,
    dateStr,
    title,
    setTitle,
    mood,
    setMood,
    moods,
    imageUrl,
    setImageUrl,
    fileInputRef,
    handleImageUpload,
    content,
    setContent,
    textareaRef,
    selectedFont,
    selectedFontSize,
    isBold,
    isItalic
}: JournalEditorBodyProps) {
    return (
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
    );
}
