'use client';

import React, { RefObject } from 'react';
import { Paperclip, Mic, Send, Square } from 'lucide-react';

interface CoachInputBarProps {
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
    onRemoveImage: () => void;
    isLoading: boolean;
    onStopLoading: () => void;
    editingIndex: number | null;
}

export default function CoachInputBar({
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
    onRemoveImage,
    isLoading,
    onStopLoading,
    editingIndex,
}: CoachInputBarProps) {
    return (
        <div className="shrink-0 border-t border-slate-100 dark:border-white/[0.05] bg-white/95 dark:bg-[#0a0a0a]/95 px-4 pt-3 pb-4 md:pb-5 z-10">
            {imagePreview && (
                <div className="flex items-center gap-2 mb-2 w-fit">
                    <div className="relative p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                        <button 
                            type="button"
                            onClick={onRemoveImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black hover:bg-rose-600 transition-colors shadow-md"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                <div className="flex items-end gap-2 bg-[#f4f4f5] dark:bg-[#1c1c1c] border border-transparent dark:border-white/[0.06] rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400/30 dark:focus-within:ring-indigo-600/25 transition-all shadow-sm">
                    <div className="flex items-center gap-0.5 shrink-0 pb-1">
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Lampirkan gambar"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/5 transition-all"
                        >
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button 
                            type="button"
                            onClick={onStartRecording}
                            title="Rekam suara"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isRecording ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 animate-pulse' : 'text-slate-400 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/5'
                            }`}
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={onKeyDown}
                        onInput={onInput}
                        rows={1}
                        placeholder={editingIndex !== null ? 'Revisi pesanmu...' : 'Pesan...'}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none py-2 min-h-[36px] max-h-[180px] leading-relaxed custom-scrollbar outline-none"
                    ></textarea>

                    {isLoading ? (
                        <button 
                            type="button"
                            onClick={onStopLoading}
                            className="w-9 h-9 shrink-0 mb-0.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-90 shadow-md"
                            title="Stop"
                        >
                            <Square className="w-3.5 h-3.5 fill-current" />
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={onSendMessage}
                            disabled={!newMessage.trim() && !imagePreview}
                            className="w-9 h-9 shrink-0 mb-0.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shadow-md shadow-indigo-200 dark:shadow-none"
                            title="Kirim (Enter)"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <p className="text-[9px] font-bold text-center text-slate-400 dark:text-slate-700 mt-2 uppercase tracking-widest">
                    Enter untuk kirim · Shift+Enter baris baru · Gemini AI
                </p>
            </div>
        </div>
    );
}
