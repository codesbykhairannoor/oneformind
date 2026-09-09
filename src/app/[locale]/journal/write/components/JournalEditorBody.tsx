'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Camera, Trash2, Sparkles, LayoutTemplate, Zap, ShieldCheck, 
    Tag, HelpCircle, Lightbulb, AlertTriangle, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { JOURNAL_TEMPLATES, JournalTemplate } from '../../lib/journalTemplates';
import { analyzeJournalCognitive } from '../../lib/journalAi';

interface JournalEditorBodyProps {
    isZenMode: boolean;
    isPrivacyBlur: boolean;
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
    setContent: (val: string | ((prev: string) => string)) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    selectedFont: string;
    selectedFontSize: string;
    isBold: boolean;
    isItalic: boolean;
    onInsertLifeOSBrief: () => void;
    isInsertingBrief?: boolean;
}

export default function JournalEditorBody({
    isZenMode,
    isPrivacyBlur,
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
    isItalic,
    onInsertLifeOSBrief,
    isInsertingBrief = false
}: JournalEditorBodyProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [customTagInput, setCustomTagInput] = useState('');

    // Suggested popular tags
    const quickTags = [
        { label: '#refleksi', text: '#refleksi' },
        { label: '#produktivitas', text: '#produktivitas' },
        { label: '#syukur', text: '#syukur' },
        { label: '#stoik', text: '#stoik' },
        { label: '#ide', text: '#ide' },
        { label: '#evaluasi', text: '#evaluasi' }
    ];

    // Real-time dynamic cognitive analysis
    const cognitiveInsight = useMemo(() => {
        return analyzeJournalCognitive(content, mood, locale);
    }, [content, mood, locale]);

    // Handle template injection
    const handleApplyTemplate = (tmpl: JournalTemplate) => {
        const tmplContent = isIndo ? tmpl.contentTemplate.id : tmpl.contentTemplate.en;
        const tmplTitle = isIndo ? tmpl.title.id : tmpl.title.en;

        if (content.trim().length > 0) {
            const confirmReplace = window.confirm(
                isIndo 
                    ? 'Tambahkan template ini di akhir tulisanmu?' 
                    : 'Append this template to your current draft?'
            );
            if (!confirmReplace) return;
            setContent(prev => prev + '\n\n' + tmplContent);
        } else {
            setContent(tmplContent);
            if (!title) {
                setTitle(tmplTitle);
            }
        }
        setMood(tmpl.moodDefault);
        setSelectedTemplate(tmpl.id);
    };

    // Handle inserting quick tag
    const handleInsertTag = (tag: string) => {
        if (!content.includes(tag)) {
            setContent(prev => prev ? `${prev}\n\n${tag} ` : `${tag} `);
        }
    };

    const handleAddCustomTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && customTagInput.trim()) {
            e.preventDefault();
            const formatted = customTagInput.startsWith('#') ? customTagInput.trim() : `#${customTagInput.trim()}`;
            handleInsertTag(formatted);
            setCustomTagInput('');
        }
    };

    return (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6">
            
            {/* 1. TOP GUIDED TEMPLATES BAR & LIFE OS BRIEF CTA */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                                {isIndo ? 'Template Refleksi Terarah (Anti-Blank Page)' : 'Guided Reflection Templates'}
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-400">
                                {isIndo ? 'Pilih panduan struktur menulis sesuai fase harimu' : 'Pick a guided structure tailored to your daily flow'}
                            </p>
                        </div>
                    </div>

                    {/* 1-Click Life OS Brief Button */}
                    <button
                        type="button"
                        onClick={onInsertLifeOSBrief}
                        disabled={isInsertingBrief}
                        className="group flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                    >
                        <Zap className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span>{isInsertingBrief ? (isIndo ? 'Menyisipkan...' : 'Injecting...') : (isIndo ? '+ Sisipkan Rekap Hari Ini' : '+ Insert Today\'s OS Brief')}</span>
                    </button>
                </div>

                {/* Template Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                    {JOURNAL_TEMPLATES.map((tmpl) => {
                        const isSelected = selectedTemplate === tmpl.id;
                        return (
                            <button
                                key={tmpl.id}
                                type="button"
                                onClick={() => handleApplyTemplate(tmpl)}
                                className={`text-left p-2.5 rounded-2xl border transition-all active:scale-95 flex flex-col justify-between ${
                                    isSelected 
                                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-sm' 
                                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-base">{tmpl.icon}</span>
                                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate">
                                        {isIndo ? tmpl.title.id.split('(')[0] : tmpl.title.en.split('&')[0]}
                                    </span>
                                </div>
                                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 leading-tight">
                                    {isIndo ? tmpl.subtitle.id : tmpl.subtitle.en}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. MAIN WRITING CANVAS */}
            <div className={`p-6 sm:p-10 rounded-[2.5rem] shadow-sm border relative transition-all duration-300 ${
                isZenMode 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
            }`}>
                
                {/* Date & Privacy Indicator */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="text-[10px] font-black tracking-widest text-indigo-500 uppercase flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1 rounded-xl">
                        <span>📅</span>
                        <span>{dateStr}</span>
                    </div>

                    {isPrivacyBlur && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/40 px-2.5 py-1 rounded-xl animate-pulse">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{isIndo ? 'Mode Privasi Blur Aktif' : 'Privacy Camouflage Active'}</span>
                        </div>
                    )}
                </div>

                {/* Journal Title */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={isIndo ? 'Beri judul harimu...' : 'Title your reflection...'}
                    className={`w-full text-2xl sm:text-4xl font-black text-slate-800 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 border-none bg-transparent focus:ring-0 p-0 mb-6 tracking-tight leading-tight transition-all outline-none ${
                        isPrivacyBlur ? 'filter blur-[4px] hover:blur-none transition-all duration-200' : ''
                    }`}
                />

                {/* Mood Selector Pills */}
                <div className="flex flex-wrap items-center gap-2.5 mb-8">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 mr-1">
                        {isIndo ? 'Kondisi Mood:' : 'Daily Mood:'}
                    </span>
                    {moods.map((item) => (
                        <button
                            key={item.slug}
                            type="button"
                            onClick={() => setMood(item.slug)}
                            className={`px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition-all text-xs font-bold border ${
                                mood === item.slug
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600 scale-105 shadow-sm text-indigo-600 dark:text-indigo-400'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 grayscale hover:grayscale-0'
                            }`}
                        >
                            <span className="text-base">{item.emoji}</span>
                            <span className="text-[11px]">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Cover Image Upload Preview */}
                <div className="mb-8 group relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageUpload}
                    />

                    {imageUrl ? (
                        <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm max-h-[400px]">
                            <img src={imageUrl} alt="Journal Attachment" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setImageUrl(null)}
                                className="absolute top-4 right-4 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all scale-90 group-hover:scale-100 z-10"
                                title={isIndo ? 'Hapus Foto' : 'Remove Photo'}
                            >
                                <Trash2 className="w-4 h-4 stroke-[2.2]" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                        >
                            <Camera className="w-5 h-5" />
                            <span className="text-xs font-bold">
                                {isIndo ? 'Sisipkan Foto / Memori Visual' : 'Attach Photo / Visual Memory'}
                            </span>
                        </button>
                    )}
                </div>

                {/* Textarea Canvas with Privacy Camouflage */}
                <div className="relative min-h-[360px] mb-6">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={isIndo 
                            ? 'Tuliskan alur pikiranmu di sini, pilih template di atas, atau ketik bebas...' 
                            : 'Write your stream of consciousness, select a template above, or express freely...'}
                        style={{
                            fontFamily: selectedFont,
                            fontSize: selectedFontSize,
                            fontWeight: isBold ? 'bold' : 'normal',
                            fontStyle: isItalic ? 'italic' : 'normal'
                        }}
                        className={`w-full min-h-[380px] p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all resize-y ${
                            isPrivacyBlur 
                                ? 'filter blur-[5px] select-none hover:blur-none transition-all duration-300' 
                                : ''
                        }`}
                    />
                </div>

                {/* 3. TAGS MANAGER & QUICK CHIPS */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-indigo-500" />
                            {isIndo ? 'Label Cepat:' : 'Quick Tags:'}
                        </span>
                        {quickTags.map((tag) => (
                            <button
                                key={tag.text}
                                type="button"
                                onClick={() => handleInsertTag(tag.text)}
                                className="text-[10.5px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            onKeyDown={handleAddCustomTag}
                            placeholder={isIndo ? 'Tambah #tag (Enter)...' : 'Add #tag (Enter)...'}
                            className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

            </div>

            {/* 4. REAL-TIME COGNITIVE NEURAL AI INSIGHT BOX */}
            <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-3xl p-5 sm:p-6 border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{isIndo ? 'Analisa Kognitif Neural AI' : 'AI Neural Cognitive Analysis'}</span>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    {cognitiveInsight.mindsetTheme}
                                </span>
                            </h4>
                            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                {isIndo 
                                    ? 'Mendeteksi dinamika emosi, bias berpikir, dan menyajikan reframe Stoik secara real-time' 
                                    : 'Detecting emotional dynamics, thinking biases, and offering Stoic reframes in real-time'}
                            </p>
                        </div>
                    </div>

                    {cognitiveInsight.detectedDistortion && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            <span>{cognitiveInsight.detectedDistortion.name}</span>
                        </div>
                    )}
                </div>

                {/* Summary Quote */}
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200 italic leading-relaxed">
                    "{cognitiveInsight.summarySentence}"
                </div>

                {/* Distortion Reframe if any */}
                {cognitiveInsight.detectedDistortion && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-700 dark:text-amber-300">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>{isIndo ? 'Rekomendasi Stoik / CBT Reframe:' : 'Stoic / CBT Reframing Advice:'}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {cognitiveInsight.detectedDistortion.reframeAdvice}
                        </p>
                    </div>
                )}

                {/* Self-Reflection Question */}
                <div className="p-3.5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-0.5">
                            {isIndo ? 'Pertanyaan Refleksi Diri:' : 'Self-Inquiry Prompt:'}
                        </p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {cognitiveInsight.reflectionPrompt}
                        </p>
                    </div>
                </div>

            </div>

        </main>
    );
}

