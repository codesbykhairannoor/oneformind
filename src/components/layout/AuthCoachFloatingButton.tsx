'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthCoachFloatingButtonProps {
    pathname: string | null;
    onClick: () => void;
}

export default function AuthCoachFloatingButton({ pathname, onClick }: AuthCoachFloatingButtonProps) {
    if (pathname?.includes('/coach')) return null;

    return (
        <button
            type="button"
            onClick={onClick}
            className="hidden md:block fixed bottom-10 right-10 z-[100] group"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <div className="relative w-14 h-14 bg-slate-900 dark:bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 active:scale-95 ring-4 ring-white dark:ring-slate-950 group-hover:ring-indigo-50 dark:group-hover:ring-indigo-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles size={24} strokeWidth={2} className="text-white group-hover:rotate-[20deg] transition-transform duration-500 relative z-10" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse z-20" />
                </div>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-2.5 rounded-2xl whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-2xl border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    <span>Neural AI Coach (Quantum)</span>
                </div>
            </div>
        </button>
    );
}
