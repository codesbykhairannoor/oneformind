'use client';

import React from 'react';
import Link from 'next/link';
import { 
    ArrowLeft, Save, Bold, Italic, List, Type, ChevronDown, 
    Mic, MicOff, Sparkles 
} from 'lucide-react';

interface JournalEditorHeaderProps {
    t: any;
    isZenMode: boolean;
    isBold: boolean;
    setIsBold: (val: boolean) => void;
    isItalic: boolean;
    setIsItalic: (val: boolean) => void;
    isBullet: boolean;
    setIsBullet: (val: boolean) => void;
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
    setIsZenMode: (val: boolean) => void;
    handleSave: () => void;
    isSaving: boolean;
    fontFamilies: { name: string; value: string }[];
    fontSizes: { label: string; value: string }[];
}

export default function JournalEditorHeader({
    t,
    isZenMode,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isBullet,
    setIsBullet,
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
    setIsZenMode,
    handleSave,
    isSaving,
    fontFamilies,
    fontSizes
}: JournalEditorHeaderProps) {
    return (
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
    );
}
