'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Camera, Trash2, Sparkles, Zap, ShieldCheck, 
    Tag, HelpCircle, Lightbulb, AlertTriangle, CheckCircle2, ChevronRight, X,
    CalendarCheck2, Eye, Pencil
} from 'lucide-react';
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
    onImportPlanner?: () => void;
    isImportingPlanner?: boolean;
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
    isInsertingBrief = false,
    onImportPlanner,
    isImportingPlanner = false
}: JournalEditorBodyProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [customTagInput, setCustomTagInput] = useState('');
    const [previewMode, setPreviewMode] = useState(false);

    // Lightweight markdown → HTML renderer (no external lib)
    const renderMarkdown = (md: string): string => {
        if (!md) return '';
        let html = md
            // Escape HTML
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            // Headings
            .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
            // Bold + italic
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Blockquote
            .replace(/^&gt; (.+)$/gm, '<blockquote class="md-bq">$1</blockquote>')
            // Horizontal rule
            .replace(/^---$/gm, '<hr class="md-hr" />')
            // Checklist items
            .replace(/^- \[x\] (.+)$/gm, '<div class="md-check done"><span class="md-cb">✅</span><span>$1</span></div>')
            .replace(/^- \[ \] (.+)$/gm, '<div class="md-check"><span class="md-cb">⬜</span><span>$1</span></div>')
            // List items
            .replace(/^  - (.+)$/gm, '<div class="md-subli">↳ $1</div>')
            .replace(/^- (.+)$/gm, '<div class="md-li">• $1</div>')
            // Numbered list
            .replace(/^(\d+)\. (.+)$/gm, '<div class="md-oli"><span class="md-num">$1.</span><span>$2</span></div>')
            // Paragraphs (blank lines → break)
            .replace(/\n\n/g, '</p><p class="md-p">')
            .replace(/\n/g, '<br />');
        return `<p class="md-p">${html}</p>`;
    };

    const renderedHtml = useMemo(() => renderMarkdown(content), [content]);

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
            
            {/* MAIN WRITING CANVAS */}
            <div className={`p-6 sm:p-10 rounded-[2.5rem] shadow-sm border relative transition-all duration-300 ${
                isZenMode 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
            }`}>
                
                {/* Date, Privacy Indicator & Quick Brief Tools */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-[10px] font-black tracking-widest text-indigo-500 uppercase flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1.5 rounded-xl">
                            <span>📅</span>
                            <span>{dateStr}</span>
                        </div>

                        {isPrivacyBlur && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/40 px-2.5 py-1.5 rounded-xl animate-pulse">
                                <ShieldCheck className="w-3 h-3" />
                                <span>{isIndo ? 'Mode Privasi Blur Aktif' : 'Privacy Camouflage Active'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* 1-Click Life OS Brief Button */}
                        <button
                            type="button"
                            onClick={onInsertLifeOSBrief}
                            disabled={isInsertingBrief}
                            className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                            <Zap className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                            <span>{isInsertingBrief ? (isIndo ? 'Menyisipkan...' : 'Injecting...') : (isIndo ? '+ Rekap Cepat OS' : '+ Quick OS Brief')}</span>
                        </button>

                        {/* Import Planner Log Button */}
                        {onImportPlanner && (
                            <button
                                type="button"
                                onClick={onImportPlanner}
                                disabled={isImportingPlanner}
                                className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 text-xs font-black transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                            >
                                <CalendarCheck2 className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <span>{isImportingPlanner ? (isIndo ? 'Mengimpor Log...' : 'Importing...') : (isIndo ? '🌙 Impor Log Planner' : '🌙 Import Planner Log')}</span>
                            </button>
                        )}
                    </div>
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

                {/* Cover Image Upload & URL Input Preview */}
                <div className="mb-8 group relative">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageUpload}
                    />

                    {imageUrl ? (
                        <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm max-h-[400px] bg-slate-100 dark:bg-slate-800">
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
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:flex-1 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                            >
                                <Camera className="w-5 h-5" />
                                <span className="text-xs font-bold">
                                    {isIndo ? 'Upload Foto / Memori Visual' : 'Upload Cover Photo'}
                                </span>
                            </button>

                            <div className="w-full sm:flex-1 flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                                <input
                                    type="url"
                                    placeholder={isIndo ? 'Atau tempel Link URL Foto (https://...)' : 'Or paste Image URL (https://...)'}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = (e.target as HTMLInputElement).value.trim();
                                            if (val) setImageUrl(val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (val) setImageUrl(val);
                                    }}
                                    className="w-full text-xs bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Write / Preview Toggle */}
                <div className="flex items-center justify-end mb-4 gap-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(false)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                                !previewMode
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            <Pencil size={11} />
                            <span>{isIndo ? 'Tulis' : 'Write'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewMode(true)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                                previewMode
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            <Eye size={11} />
                            <span>{isIndo ? 'Preview' : 'Preview'}</span>
                        </button>
                    </div>
                </div>

                {/* Textarea Canvas with Privacy Camouflage */}
                <div className="relative min-h-[360px] mb-6">
                    {previewMode ? (
                        <div
                            className={`w-full min-h-[380px] p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 text-slate-800 dark:text-slate-100 leading-relaxed overflow-y-auto journal-preview ${
                                isPrivacyBlur ? 'filter blur-[5px] hover:blur-none transition-all duration-300' : ''
                            }`}
                            style={{ fontFamily: selectedFont, fontSize: selectedFontSize }}
                            dangerouslySetInnerHTML={{ __html: renderedHtml || `<p class="md-empty">${isIndo ? 'Belum ada isi tulisan...' : 'Nothing written yet...'}</p>` }}
                        />
                    ) : (
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
                    )}
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

        </main>
    );
}

