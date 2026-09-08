'use client';

import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { ChatSession } from '../types';

interface CoachSidebarProps {
    isOpen: boolean;
    sessions: ChatSession[];
    currentSessionId: string;
    onStartNewChat: () => void;
    onSwitchSession: (id: string) => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export default function CoachSidebar({
    isOpen,
    sessions,
    currentSessionId,
    onStartNewChat,
    onSwitchSession,
    onDeleteSession,
}: CoachSidebarProps) {
    return (
        <aside 
            className={`${
                isOpen 
                    ? 'flex fixed md:relative h-full w-64 md:w-56 top-0 left-0 z-[70] md:z-auto' 
                    : 'hidden md:flex md:w-0 md:overflow-hidden'
            } flex-col shrink-0 bg-white dark:bg-[#0c0c0c] border-r border-slate-100 dark:border-white/[0.06] transition-all duration-300 overflow-hidden`}
        >
            {/* New Chat Button */}
            <div className="p-3 border-b border-slate-100 dark:border-white/[0.05]">
                <button 
                    type="button"
                    onClick={onStartNewChat}
                    className="w-full flex items-center gap-2.5 px-3 h-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 text-sm font-semibold transition-colors group"
                >
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black group-hover:scale-110 transition-transform shadow-sm">
                        +
                    </div>
                    <span>Chat Baru</span>
                </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 custom-scrollbar">
                {sessions.length > 0 && (
                    <p className="px-3 py-2 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                        Riwayat
                    </p>
                )}

                {sessions.map((session) => (
                    <div key={session.id} className="relative group">
                        <button 
                            type="button"
                            onClick={() => onSwitchSession(session.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-start gap-2.5 ${
                                currentSessionId === session.id 
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                            <div className="min-w-0 flex-1 pr-6">
                                <p className="font-semibold text-xs truncate">{session.title}</p>
                                <p className="text-[10px] opacity-50 mt-0.5">{session.date}</p>
                            </div>
                        </button>
                        
                        <button 
                            type="button"
                            onClick={(e) => onDeleteSession(session.id, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                            title="Hapus Percakapan"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {sessions.length === 0 && (
                    <div className="px-3 py-8 text-center">
                        <p className="text-[11px] text-slate-400 dark:text-slate-600">
                            Belum ada percakapan
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
