'use client';

import React, { RefObject } from 'react';
import { Paperclip, Mic } from 'lucide-react';
import { QuickAction } from '../types';

interface CoachWelcomeViewProps {
    firstName: string;
    newMessage: string;
    setNewMessage: (val: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onInput: (e: React.SyntheticEvent<HTMLTextAreaElement>) => void;
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isRecording: boolean;
    onStartRecording: () => void;
    onSendMessage: () => void;
    imagePreview: string | null;
    isLoading: boolean;
    quickActions: QuickAction[];
    onQuickActionClick: (prompt: string) => void;
}

export default function CoachWelcomeView({
    firstName,
    newMessage,
    setNewMessage,
    onKeyDown,
    onInput,
    textareaRef,
    fileInputRef,
    onFileChange,
    isRecording,
    onStartRecording,
    onSendMessage,
    imagePreview,
    isLoading,
    quickActions,
    onQuickActionClick,
}: CoachWelcomeViewProps) {
    return (
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-10 md:py-16">
            <div className="relative mb-7 md:mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-3xl opacity-[0.18] scale-[2.5]"></div>
                <div className="relative w-[68px] h-[68px] md:w-[80px] md:h-[80px] rounded-[1.4rem] md:rounded-[1.6rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-300/30 dark:shadow-none select-none">
                    <span className="text-3xl md:text-4xl">✦</span>
                </div>
            </div>

            <h1 className="text-[2rem] md:text-[2.75rem] font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight mb-2">
                Hai {firstName},
            </h1>
            <p className="text-[15px] md:text-base text-slate-400 dark:text-slate-500 text-center mb-8 md:mb-10 max-w-[280px] md:max-w-sm leading-relaxed">
                Apa yang ingin kamu capai hari ini?
            </p>

            {/* Big Input Box */}
            <div className="w-full max-w-xl md:max-w-2xl relative group/box mb-8 md:mb-10">
                <div className="absolute -inset-[2px] rounded-[1.6rem] bg-gradient-to-r from-rose-400 via-purple-500 to-emerald-400 opacity-0 group-focus-within/box:opacity-70 transition-all duration-700 blur-[3px] pointer-events-none"></div>

                <div className="relative bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-white/[0.08] group-focus-within/box:border-transparent rounded-[1.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300 overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={onKeyDown}
                        onInput={onInput}
                        rows={3}
                        placeholder="Tanyakan apa saja kepada Neural OS..."
                        className="w-full bg-transparent px-5 pt-5 pb-3 text-[15px] font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 border-none focus:ring-0 resize-none leading-relaxed max-h-40 custom-scrollbar outline-none"
                    ></textarea>

                    <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-slate-50 dark:border-white/[0.04]">
                        <div className="flex items-center gap-1">
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                title="Lampirkan gambar"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-500 transition-all"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <button 
                                type="button"
                                onClick={onStartRecording}
                                title="Rekam suara"
                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                    isRecording ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-500'
                                }`}
                            >
                                <Mic className="w-4 h-4" />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                        </div>

                        <button 
                            type="button"
                            onClick={onSendMessage}
                            disabled={(!newMessage.trim() && !imagePreview) || isLoading}
                            className="h-9 px-5 rounded-[0.875rem] bg-indigo-600 text-white text-[13px] font-black hover:bg-indigo-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2"
                        >
                            <span>Kirim</span>
                            <kbd className="hidden sm:inline text-[10px] opacity-60 font-bold not-italic">↵</kbd>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Action Chips */}
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] text-center mb-5">
                Mulai dengan cepat
            </p>

            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 px-2 w-full max-w-xl md:max-w-2xl justify-start md:justify-center no-scrollbar">
                {quickActions.map((action) => (
                    <button 
                        key={action.label}
                        type="button"
                        onClick={() => onQuickActionClick(action.prompt)}
                        className="flex flex-col items-center gap-2.5 group shrink-0 w-[72px]"
                    >
                        <div 
                            className="w-[56px] h-[56px] rounded-full flex items-center justify-center text-2xl transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-1.5 group-active:scale-95"
                            style={{
                                background: action.color + '14',
                                border: '1.5px solid ' + action.color + '30',
                                boxShadow: '0 4px 16px ' + action.color + '12'
                            }}
                        >
                            {action.emoji}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>

            <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.25em] mt-10 md:mt-12">
                Powered by Gemini Intelligence
            </p>
        </div>
    );
}
