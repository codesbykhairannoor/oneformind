'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Sparkles, ChevronRight, Lock } from 'lucide-react';
import { useGating } from '@/hooks/useGating';

interface NeuralBridgeProps {
    module: string;
}

export default function NeuralBridge({ module }: NeuralBridgeProps) {
    const t = useTranslations();
    const { isArchitect } = useGating();
    const [synergy, setSynergy] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Check subscription — Neural Bridge is only for premium users with specific plans
    const hasAccess = isArchitect;

    const handleFetchSynergy = () => {
        setLoading(true);
        setTimeout(() => {
            setSynergy(`Analisis Neural AI terbaru: Terdeteksi konsistensi penulisan jurnal & penyelesaian tugas modul ${module}.`);
            setLoading(false);
        }, 600);
    };

    // If user doesn't have access, show upgrade teaser
    if (!hasAccess) {
        return (
            <div className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all duration-500">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shrink-0 shadow-lg">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-400 capitalize tracking-wide">
                                {t('neural_bridge_title') || 'Neural Bridge'}
                            </span>
                            <span className="text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-full tracking-wide uppercase">Architect+</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t('neural_bridge_locked_desc') || 'Upgrade ke plan Architect atau lebih tinggi untuk mengakses analisis Neural AI secara real-time.'}
                        </p>
                        <Link href="/billing" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                            <span>{t('btn_upgrade') || 'Upgrade Sekarang'}</span>
                            <ChevronRight className="w-3 h-3 stroke-[3]" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        // 1:1 from NeuralBridge.vue line 38-84
        <div className="group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/50 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                <Sparkles className="w-20 h-20" />
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-indigo-500 capitalize tracking-wide">
                            {t('neural_bridge_title') || 'Neural Bridge'}
                        </span>
                        {synergy && <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>}
                    </div>
                    
                    {loading ? (
                        <div className="space-y-2 py-1">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full animate-pulse"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3 animate-pulse"></div>
                        </div>
                    ) : synergy ? (
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                &ldquo;{synergy}&rdquo;
                            </p>
                        </div>
                    ) : (
                        <div className="py-1">
                            <button 
                                type="button" 
                                onClick={handleFetchSynergy} 
                                className="text-xs font-black text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 capitalize tracking-wide flex items-center gap-2 transition-all active:scale-95"
                            >
                                <span>{t('btn_get_intelligence') || 'Get Intelligence'}</span>
                                <ChevronRight className="w-3 h-3 stroke-[4]" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
