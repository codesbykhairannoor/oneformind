'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    useActiveModules, 
    MODULE_PRESETS, 
    ALL_MODULE_KEYS, 
    ModuleKey,
    MAX_FREE_ACTIVE_MODULES 
} from '@/hooks/useActiveModules';
import { 
    Sparkles, 
    Check, 
    ArrowRight, 
    Layers, 
    Lock, 
    X 
} from 'lucide-react';

export default function ActiveModulesSetupModal() {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const {
        modules,
        activeKeys,
        activeCount,
        maxAllowed,
        isUnlimited,
        toggleTab,
        applyPreset
    } = useActiveModules();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedTabKeys, setSelectedTabKeys] = useState<ModuleKey[]>([]);

    useEffect(() => {
        try {
            const hasSeen = localStorage.getItem('tranvas_tab_setup_completed');
            if (!hasSeen && !isUnlimited) {
                // Auto show onboarding on first visit if not completed
                setIsOpen(true);
            }
        } catch (e) {
            console.error(e);
        }
    }, [isUnlimited]);

    useEffect(() => {
        setSelectedTabKeys(activeKeys);
    }, [activeKeys]);

    if (!isOpen) return null;

    const emojiMap: Record<string, string> = {
        habit: '🌱',
        planner: '📋',
        finance: '💸',
        study: '🎓',
        journal: '📓',
        calendar: '📅',
        job: '💼',
        goal: '🎯'
    };

    const labelMap: Record<string, { id: string; en: string }> = {
        habit: { id: 'Kebiasaan', en: 'Habits' },
        planner: { id: 'Agenda', en: 'Daily Planner' },
        finance: { id: 'Keuangan', en: 'Finance' },
        study: { id: 'Akademik & Buku', en: 'Study & Books' },
        journal: { id: 'Jurnal Refleksi', en: 'Journal' },
        calendar: { id: 'Kalender', en: 'Calendar' },
        job: { id: 'Karier & Kerja', en: 'Jobs' },
        goal: { id: 'Target Strategis', en: 'Goals' }
    };

    const handleSelectModule = async (key: ModuleKey) => {
        const isSelected = selectedTabKeys.includes(key);
        if (isSelected) {
            setSelectedTabKeys(prev => prev.filter(k => k !== key));
            await toggleTab(key);
        } else {
            if (selectedTabKeys.length >= MAX_FREE_ACTIVE_MODULES) {
                return; // Can't select more than 3
            }
            setSelectedTabKeys(prev => [...prev, key]);
            await toggleTab(key);
        }
    };

    const handleApplyPresetClick = async (presetId: string) => {
        const preset = MODULE_PRESETS.find(p => p.id === presetId);
        if (preset) {
            setSelectedTabKeys(preset.modules);
            await applyPreset(presetId);
        }
    };

    const handleComplete = () => {
        try {
            localStorage.setItem('tranvas_tab_setup_completed', 'true');
        } catch (e) {
            console.error(e);
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                {/* Background decorative glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={handleComplete}
                    className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="text-center max-w-md mx-auto mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3">
                        <Sparkles size={12} />
                        <span>{isIndo ? 'Setup Awal Tranvas OS' : 'Initial Tranvas Setup'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pilih 3 Tab Utama Anda' : 'Choose Your Power Trio'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {isIndo
                            ? 'Fokus pada hal terpenting. Anda bebas mengganti 3 tab ini kapan saja selama 30 hari ke depan sebelum terkunci.'
                            : 'Focus on what moves the needle. You can freely swap these 3 tabs anytime during your first 30 days.'}
                    </p>
                </div>

                {/* Selection Counter Pill */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black">
                        <Layers size={14} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-slate-800 dark:text-slate-200">
                            {selectedTabKeys.length} / {MAX_FREE_ACTIVE_MODULES} {isIndo ? 'Tab Terpilih' : 'Tabs Chosen'}
                        </span>
                        {selectedTabKeys.length === MAX_FREE_ACTIVE_MODULES && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
                        )}
                    </div>
                </div>

                {/* Quick Preset Packs */}
                <div className="mb-6">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                        {isIndo ? 'Atau Pilih Paket Rekomendasi 1-Klik:' : 'Or Select a Recommended Trio:'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {MODULE_PRESETS.slice(0, 4).map((preset) => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleApplyPresetClick(preset.id)}
                                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-lg">{preset.emoji}</span>
                                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                                        {isIndo ? preset.labelId.split('(')[0] : preset.labelEn.split('(')[0]}
                                    </p>
                                </div>
                                <div className="mt-2 text-[10px] text-slate-400">
                                    {preset.modules.map(m => emojiMap[m]).join(' ')}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 8 Module Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    {ALL_MODULE_KEYS.map((key) => {
                        const isSelected = selectedTabKeys.includes(key);
                        const isMaxReached = selectedTabKeys.length >= MAX_FREE_ACTIVE_MODULES && !isSelected;

                        return (
                            <button
                                key={key}
                                type="button"
                                disabled={isMaxReached}
                                onClick={() => handleSelectModule(key)}
                                className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 relative ${
                                    isSelected
                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                                        : isMaxReached
                                        ? 'opacity-40 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                )}
                                <span className="text-2xl">{emojiMap[key]}</span>
                                <span className={`text-xs font-bold ${
                                    isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {isIndo ? labelMap[key]?.id : labelMap[key]?.en}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 3-Step Lifecycle & AI Coach Note */}
                <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Sparkles size={13} className="text-indigo-500 shrink-0" />
                        <span>{isIndo ? 'Mekanisme 3 Tab & Aturan Fitur:' : '3-Tab Mechanics & Tier Rules:'}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10.5px]">
                        <li>{isIndo ? 'Masa fleksibel 30 hari: bebas menukar 3 tab aktif Anda kapan saja di menu Pengaturan.' : '30-day trial: freely swap your 3 active tabs anytime in Settings.'}</li>
                        <li>{isIndo ? 'Setelah 30 hari: 3 tab yang Anda gunakan akan terkunci permanen.' : 'After 30 days: your 3 active tabs will permanently lock.'}</li>
                        <li className="font-semibold text-indigo-600 dark:text-indigo-400">{isIndo ? 'Neural AI Coach hanya terbuka eksklusif di paket Quantum Plan (tidak termasuk di Free atau Architect).' : 'Neural AI Coach is exclusively available on Quantum Plan (not included in Free or Architect).'}</li>
                    </ul>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400">
                        {isIndo ? 'Bisa diubah kapan saja di Pengaturan' : 'Can be changed in Settings anytime'}
                    </span>
                    <button
                        type="button"
                        onClick={handleComplete}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        <span>{isIndo ? 'Mulai Gunakan Tranvas' : 'Launch Workspace'}</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
