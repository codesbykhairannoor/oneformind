'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lock, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useGating } from '@/hooks/useGating';
import { Link } from '@/i18n/routing';

interface GatedPageProps {
    feature: string;
    children: React.ReactNode;
}

export default function GatedPage({ feature, children }: GatedPageProps) {
    const t = useTranslations();
    const { canUse, isAiEnabled, isLoading } = useGating();

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 m-4 md:m-8">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">Memuat data...</p>
            </div>
        );
    }

    if (canUse(feature)) {
        return <>{children}</>;
    }

    const isQuantumRequired = feature === 'quantum' || feature === 'ai' || feature === 'neural_os' || feature === 'ai_coach';
    const tierName = isQuantumRequired ? 'Quantum' : 'Architect';
    const bgColors = isQuantumRequired 
        ? 'from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20' 
        : 'from-slate-200/50 via-slate-100/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-black';
    const iconColor = isQuantumRequired ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400';
    const badgeColor = isQuantumRequired ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

    return (
        <div className={`min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br ${bgColors} rounded-[3rem] m-4 md:m-8 border border-white/50 dark:border-slate-800/50 relative overflow-hidden`}>
            
            {/* Background embellishments */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl dark:shadow-none text-center transform transition-all hover:scale-[1.02] duration-500">
                <div className="flex justify-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 ${isQuantumRequired ? 'shadow-indigo-500/20' : ''}`}>
                        {isQuantumRequired ? (
                            <Sparkles className={`w-10 h-10 ${iconColor}`} strokeWidth={2} />
                        ) : (
                            <Lock className={`w-10 h-10 ${iconColor}`} strokeWidth={2} />
                        )}
                    </div>
                </div>
                
                <div className="inline-flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${badgeColor}`}>
                        {tierName} Tier
                    </span>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                    {t('dash_upgrade_tier_title') || `Akses ${tierName} Dibutuhkan`}
                </h2>
                
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    {t.rich('dash_upgrade_tier_desc', {
                        feature: t(`module_${feature}_title`) || feature,
                        tierName: tierName,
                        strong: (chunks) => <strong>{chunks}</strong>
                    })}
                </p>

                <div className="space-y-3">
                    <Link 
                        href="/billing"
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-white/10"
                    >
                        <span>{t('btn_upgrade') || 'Upgrade Sekarang'}</span>
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                    <Link 
                        href="/dashboard"
                        className="w-full flex items-center justify-center py-4 rounded-[1.5rem] text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {t('btn_back_dashboard') || 'Kembali ke Dashboard'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
