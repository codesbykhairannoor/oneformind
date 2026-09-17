'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import ModalPortal from '@/components/ModalPortal';
import { Lock, Sparkles, X, ChevronRight, Zap, FileSpreadsheet } from 'lucide-react';

export type ArchitectFeatureType = 
    | 'batch_planner' 
    | 'batch_habit' 
    | 'batch_finance' 
    | 'batch_general' 
    | 'export_data' 
    | 'recurring_tasks' 
    | 'general';

interface ArchitectUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: ArchitectFeatureType;
    customTitle?: string;
    customDescription?: string;
}

export default function ArchitectUpgradeModal({
    isOpen,
    onClose,
    feature = 'general',
    customTitle,
    customDescription,
}: ArchitectUpgradeModalProps) {
    const locale = useLocale();
    const router = useRouter();
    const isIndo = locale === 'id';

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        router.push('/billing');
    };

    // Feature-specific copy
    const getContent = () => {
        if (feature === 'batch_planner' || feature === 'batch_habit' || feature === 'batch_finance' || feature === 'batch_general') {
            return {
                badge: isIndo ? 'Fitur Eksklusif Architect Pro' : 'Architect Pro Feature',
                title: customTitle || (isIndo ? 'Buka Mesin Mode Batch (Massal)' : 'Unlock Batch Entry Engine'),
                desc: customDescription || (isIndo 
                    ? 'Mode Batch dirancang khusus untuk power users agar dapat memasukkan puluhan tugas, kebiasaan, dan transaksi dalam satu klik cepat.' 
                    : 'Batch Mode is designed for high-velocity power users to record dozens of tasks, habits, and transactions in a single click.'),
                perks: isIndo ? [
                    'Entri massal tak terbatas untuk Planner, Habits, dan Finance',
                    'Hemat hingga 80% waktu administrasi input harian Anda',
                    'Otomatis sinkron ke timeline hari ini dan analitik bulanan',
                ] : [
                    'Unlimited bulk entries for Planner, Habits, and Finance',
                    'Save up to 80% of your daily administrative routine',
                    'Instant auto-sync to today timeline and monthly analytics',
                ],
                icon: <Zap className="w-8 h-8 text-amber-500" />
            };
        }

        if (feature === 'export_data') {
            return {
                badge: isIndo ? 'Fitur Eksklusif Architect Pro' : 'Architect Pro Feature',
                title: customTitle || (isIndo ? 'Ekspor Data CSV & Backup JSON' : '1-Click CSV Export & JSON Backup'),
                desc: customDescription || (isIndo 
                    ? 'Unduh seluruh riwayat data produktivitas dan finansial Anda kapan saja dalam format standar industri tanpa batasan.' 
                    : 'Download your complete productivity and financial dataset anytime in industry-standard formats without limits.'),
                perks: isIndo ? [
                    'Ekspor RFC 4180 CSV siap olah di Excel & Google Sheets (UTF-8 BOM)',
                    'Backup hierarkis JSON untuk portabilitas data 100% independen',
                    'Cakupan data penuh sepanjang waktu (semua bulan & tahun)',
                ] : [
                    'RFC 4180 CSV exports ready for Excel & Google Sheets (UTF-8 BOM)',
                    'Structured JSON backups for 100% data portability & sovereignty',
                    'Full historical coverage across all months & years',
                ],
                icon: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
            };
        }

        return {
            badge: isIndo ? 'Fitur Eksklusif Architect Pro' : 'Architect Pro Feature',
            title: customTitle || (isIndo ? 'Tingkatkan ke Tier Architect' : 'Upgrade to Architect Tier'),
            desc: customDescription || (isIndo 
                ? 'Buka seluruh power tools efisiensi tinggi, batch engine, ekspor data, dan analitik tingkat lanjut.' 
                : 'Unlock high-velocity power tools, batch engines, data exports, and advanced analytics.'),
            perks: isIndo ? [
                'Mesin Batch Entry (Planner, Habits, & Finance)',
                '1-Klik Ekspor Data CSV & Portabilitas Backup JSON',
                'Integrasi Neural Bridge & Heatmap Konsistensi 365 Hari',
            ] : [
                'Batch Entry Engine (Planner, Habits, & Finance)',
                '1-Click CSV Data Export & JSON Backup Portability',
                'Neural Bridge Integration & 365-Day Consistency Heatmaps',
            ],
            icon: <Sparkles className="w-8 h-8 text-indigo-500" />
        };
    };

    const content = getContent();

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top Radiant Accent */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600" />

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-all z-10"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>

                    <div className="p-8 sm:p-10 text-center">
                        {/* Glowing Icon Container */}
                        <div className="relative inline-flex items-center justify-center mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xl">
                                {content.icon}
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                                    <Lock size={12} strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* Tier Badge */}
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-xs">
                                <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
                                {content.badge}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
                            {content.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-6">
                            {content.desc}
                        </p>

                        {/* Feature Perks Box */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left space-y-2.5 mb-8">
                            {content.perks.map((perk, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-[9px]">
                                        ✓
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                        {perk}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span>{isIndo ? 'Upgrade ke Architect Sekarang' : 'Upgrade to Architect Now'}</span>
                                <ChevronRight size={16} strokeWidth={3} />
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                {isIndo ? 'Nanti Saja (Tetap di Explorer)' : 'Maybe Later (Stay on Explorer)'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
