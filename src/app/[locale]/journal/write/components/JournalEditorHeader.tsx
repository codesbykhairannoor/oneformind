'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { 
    ArrowLeft, Save, Bold, Italic, List, ListOrdered, Quote, 
    CheckSquare, Type, ChevronDown, Mic, MicOff, Sparkles, 
    Eye, EyeOff, CheckCircle2, Clock
} from 'lucide-react';

interface JournalEditorHeaderProps {
    isZenMode: boolean;
    setIsZenMode: (val: boolean) => void;
    isPrivacyBlur: boolean;
    setIsPrivacyBlur: (val: boolean) => void;
    wordCount: number;
    readTimeMinutes: number;
    isBold: boolean;
    setIsBold: (val: boolean) => void;
    isItalic: boolean;
    setIsItalic: (val: boolean) => void;
    selectedFont: string;
    setSelectedFont: (font: string) => void;
    selectedFontSize: string;
    setSelectedFontSize: (size: string) => void;
    showFontMenu: boolean;
    setShowFontMenu: (show: boolean) => void;
    showSizeMenu: boolean;
    setShowSizeMenu: (show: boolean) => void;
    isListening: boolean;
    toggleVoiceRecognition: () => void;
    onInsertMarkdown: (prefix: string, suffix?: string, defaultText?: string) => void;
    handleSave: () => void;
    isSaving: boolean;
    lastSavedTime?: string | null;
    fontFamilies: { name: string; value: string }[];
    fontSizes: { label: string; value: string }[];
}

export default function JournalEditorHeader({
    isZenMode,
    setIsZenMode,
    isPrivacyBlur,
    setIsPrivacyBlur,
    wordCount,
    readTimeMinutes,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    selectedFont,
    setSelectedFont,
    selectedFontSize,
    setSelectedFontSize,
    showFontMenu,
    setShowFontMenu,
    showSizeMenu,
    setShowSizeMenu,
    isListening,
    toggleVoiceRecognition,
    onInsertMarkdown,
    handleSave,
    isSaving,
    lastSavedTime,
    fontFamilies,
    fontSizes
}: JournalEditorHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    return (
        <header className={`sticky top-0 z-50 border-b px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-all duration-300 ${
            isZenMode 
                ? 'bg-slate-950/90 border-slate-900 text-white backdrop-blur-md' 
                : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800'
        }`}>
            {/* Left: Back Link & Word / Read Stats */}
            <div className="flex items-center gap-3">
                <Link
                    href="/journal"
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-xl"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{isIndo ? 'Kembali' : 'Back'}</span>
                </Link>

                {/* Live Word Count & Reading Time */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>{wordCount} {isIndo ? 'kata' : 'words'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {readTimeMinutes} {isIndo ? 'mnt baca' : 'min read'}
                    </span>
                    {lastSavedTime && (
                        <>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {isIndo ? 'Tersimpan' : 'Saved'} {lastSavedTime}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Middle: Integrated Rich Markdown & Style Toolbar */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 justify-center">
                {/* Bold */}
                <button
                    type="button"
                    onClick={() => {
                        setIsBold(!isBold);
                        onInsertMarkdown('**', '**', isIndo ? 'teks tebal' : 'bold text');
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        isBold ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isIndo ? 'Tebal (Ctrl+B)' : 'Bold (Ctrl+B)'}
                >
                    <Bold className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Italic */}
                <button
                    type="button"
                    onClick={() => {
                        setIsItalic(!isItalic);
                        onInsertMarkdown('*', '*', isIndo ? 'teks miring' : 'italic text');
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        isItalic ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isIndo ? 'Miring (Ctrl+I)' : 'Italic (Ctrl+I)'}
                >
                    <Italic className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Bullet List */}
                <button
                    type="button"
                    onClick={() => onInsertMarkdown('\n- ', '', isIndo ? 'Poin refleksi' : 'Bullet point')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                    title={isIndo ? 'Daftar Poin' : 'Bullet List'}
                >
                    <List className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Numbered List */}
                <button
                    type="button"
                    onClick={() => onInsertMarkdown('\n1. ', '', isIndo ? 'Langkah pertama' : 'First item')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                    title={isIndo ? 'Daftar Nomor' : 'Numbered List'}
                >
                    <ListOrdered className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Quote Block */}
                <button
                    type="button"
                    onClick={() => onInsertMarkdown('\n> ', '', isIndo ? 'Kutipan / Pelajaran penting' : 'Key quote / takeaway')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                    title={isIndo ? 'Kutipan Refleksi' : 'Quote Block'}
                >
                    <Quote className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Checklist */}
                <button
                    type="button"
                    onClick={() => onInsertMarkdown('\n- [ ] ', '', isIndo ? 'Tindakan nyata hari ini' : 'Action item')}
                    className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all active:scale-95"
                    title={isIndo ? 'Kotak Ceklis' : 'Checklist'}
                >
                    <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center" />

                {/* Font Family Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => { setShowFontMenu(!showFontMenu); setShowSizeMenu(false); }}
                        className="h-9 px-2.5 rounded-xl flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 font-bold text-xs active:scale-95"
                        title={isIndo ? 'Pilih Jenis Font' : 'Choose Font Family'}
                    >
                        <Type className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    {showFontMenu && (
                        <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95">
                            {fontFamilies.map((font) => (
                                <button
                                    key={font.value}
                                    type="button"
                                    onClick={() => { setSelectedFont(font.value); setShowFontMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-between ${
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
                        className="h-9 px-2.5 rounded-xl flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 font-bold text-xs active:scale-95"
                        title={isIndo ? 'Ukuran Huruf' : 'Font Size'}
                    >
                        <span className="text-xs">Aa</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    {showSizeMenu && (
                        <div className="absolute top-full mt-2 left-0 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-[100] animate-in fade-in zoom-in-95">
                            {fontSizes.map((size) => (
                                <button
                                    key={size.value}
                                    type="button"
                                    onClick={() => { setSelectedFontSize(size.value); setShowSizeMenu(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-between ${
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

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 self-center" />

                {/* Privacy Camouflage (Blur Mode) Toggle */}
                <button
                    type="button"
                    onClick={() => setIsPrivacyBlur(!isPrivacyBlur)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        isPrivacyBlur 
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-200 dark:shadow-none' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isIndo ? (isPrivacyBlur ? 'Matikan Mode Privasi Blur' : 'Aktifkan Mode Privasi Blur (Anti-Intip)') : (isPrivacyBlur ? 'Disable Privacy Blur' : 'Enable Privacy Camouflage Blur')}
                >
                    {isPrivacyBlur ? <EyeOff className="w-4 h-4 stroke-[2.5]" /> : <Eye className="w-4 h-4 stroke-[2.5]" />}
                </button>

                {/* Voice to Text */}
                <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        isListening ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isIndo ? 'Dikte Suara (Voice to Text)' : 'Voice to Text'}
                >
                    {isListening ? <MicOff className="w-4 h-4 stroke-[2.5]" /> : <Mic className="w-4 h-4 stroke-[2.5]" />}
                </button>

                {/* Zen Focus Mode */}
                <button
                    type="button"
                    onClick={() => setIsZenMode(!isZenMode)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        isZenMode ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={isIndo ? 'Mode Fokus Zen' : 'Zen Focus Mode'}
                >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                </button>
            </div>

            {/* Right: Save Button */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black tracking-wide px-5 py-2 rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? (isIndo ? 'Menyimpan...' : 'Saving...') : (isIndo ? 'Simpan Jurnal' : 'Save Entry')}</span>
                </button>
            </div>
        </header>
    );
}

