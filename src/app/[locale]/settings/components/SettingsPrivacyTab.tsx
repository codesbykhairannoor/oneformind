'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { 
    Download, Database, Sparkles, CheckCircle2, 
    CalendarCheck, CheckSquare, Wallet, GraduationCap, 
    BookOpen, Calendar, Briefcase, Target, ShieldCheck, 
    FileSpreadsheet, FileJson
} from 'lucide-react';
import ExportModal, { ExportModuleType } from '@/components/export/ExportModal';

export default function SettingsPrivacyTab() {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const t = useTranslations();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<ExportModuleType>('all');

    const handleOpenExport = (moduleType: ExportModuleType) => {
        setSelectedModule(moduleType);
        setIsExportOpen(true);
    };

    const modules = [
        {
            type: 'habits' as ExportModuleType,
            title: isIndo ? 'Kebiasaan (Habits)' : 'Habits Tracker',
            desc: isIndo ? 'Daftar rutinitas, frekuensi, riwayat checklist, dan log harian.' : 'Routine tracker, streak counts, completion logs, and frequencies.',
            icon: CalendarCheck,
            color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40'
        },
        {
            type: 'planner' as ExportModuleType,
            title: isIndo ? 'Planner & Tugas' : 'Planner & Tasks',
            desc: isIndo ? 'Manajemen tugas harian, estimasi menit, prioritas, dan status penyelesaian.' : 'Daily tasks, estimated minutes, priorities, and completion status.',
            icon: CheckSquare,
            color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/40'
        },
        {
            type: 'finance' as ExportModuleType,
            title: isIndo ? 'Keuangan (Finance)' : 'Finance Transactions',
            desc: isIndo ? 'Catatan pemasukan, pengeluaran, nominal rupiah, kategori, dan dompet.' : 'Income, expense transactions, categories, and account logs.',
            icon: Wallet,
            color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40'
        },
        {
            type: 'study' as ExportModuleType,
            title: isIndo ? 'Akademik (Study)' : 'Academic Courses',
            desc: isIndo ? 'Daftar mata kuliah, jumlah SKS, nama dosen, ruang kelas, dan target nilai.' : 'Courses, credit hours (SKS), professors, room info, and grading targets.',
            icon: GraduationCap,
            color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/40'
        },
        {
            type: 'journal' as ExportModuleType,
            title: isIndo ? 'Jurnal Harian' : 'Daily Journal',
            desc: isIndo ? 'Catatan refleksi diri, evaluasi harian, mood, dan highlight momentum.' : 'Self-reflections, daily mood ratings, gratitude, and highlights.',
            icon: BookOpen,
            color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40'
        },
        {
            type: 'calendar' as ExportModuleType,
            title: isIndo ? 'Kalender & Acara' : 'Calendar Events',
            desc: isIndo ? 'Jadwal janji temu, acara penting, lokasi, dan sinkronisasi agenda.' : 'Scheduled events, meetings, locations, and timeblocks.',
            icon: Calendar,
            color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40'
        },
        {
            type: 'jobs' as ExportModuleType,
            title: isIndo ? 'Pelacak Karir (Jobs)' : 'Career & Job Tracker',
            desc: isIndo ? 'Portofolio lamaran kerja, nama perusahaan, gaji yang ditawarkan, dan interview.' : 'Job applications, company records, offered salaries, and interview schedules.',
            icon: Briefcase,
            color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900/40'
        },
        {
            type: 'goals' as ExportModuleType,
            title: isIndo ? 'Target & Visi (Goals)' : 'Goals & Milestones',
            desc: isIndo ? 'Sasaran jangka panjang, milestone OKR, metrik kemajuan, dan status target.' : 'Life visions, OKR milestones, numeric targets, and progress metrics.',
            icon: Target,
            color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/40'
        }
    ];

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header Section */}
            <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isIndo ? 'Ekspor & Cadangan Data Portabel' : 'Data Export & Portable Backups'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isIndo 
                        ? 'Kendali penuh atas data hidup Anda. Ekspor seluruh riwayat aktivitas atau per modul ke format CSV (kompatibel Excel tanpa mojibake) atau JSON terstruktur.'
                        : 'Full ownership of your personal life data. Export your entire database or individual modules into RFC 4180 CSV (Excel-ready) or structured JSON.'}
                </p>
            </div>

            {/* MASTER HERO CARD: ALL-IN-ONE BACKUP */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/20 p-6 sm:p-8 shadow-xl shadow-indigo-500/5">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                                <Database className="w-3 h-3" />
                                {isIndo ? 'Cadangan Master Universal' : 'Universal Master Backup'}
                            </span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                                8 {isIndo ? 'Modul Sekaligus' : 'Modules Bundled'}
                            </span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">
                            {isIndo ? 'Ekspor Seluruh Database OneForMind' : 'Export Complete Life Database'}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
                            {isIndo 
                                ? 'Unduh salinan komprehensif yang mencakup Habits, Planner, Keuangan, Studi, Jurnal, Kalender, Lamaran Pekerjaan, dan Target dalam satu file arsip yang rapi.'
                                : 'Download a comprehensive unified bundle containing all your habits, planner tasks, transactions, study plans, journals, calendar, jobs, and goals.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                                CSV (UTF-8 BOM Excel)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileJson className="w-4 h-4 text-amber-500" />
                                JSON (Full Schemas)
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                                {isIndo ? 'Semua Waktu / Per Tahun / Per Bulan' : 'All-time / Per Year / Per Month'}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={() => handleOpenExport('all')}
                        className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-3.5 text-sm font-black transition-all shadow-lg shadow-indigo-600/25 shrink-0"
                    >
                        <Download className="w-4 h-4 stroke-[3]" />
                        <span>{isIndo ? 'Ekspor Seluruh Data' : 'Export Master Backup'}</span>
                    </button>
                </div>
            </div>

            {/* INDIVIDUAL MODULE EXPORTS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {isIndo ? 'Ekspor Berdasarkan Modul Tertentu' : 'Export by Specific Module'}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isIndo ? 'Pilih tab spesifik yang ingin Anda unduh datanya secara terpisah.' : 'Choose an individual tab to download filtered records independently.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.map((m) => {
                        const Icon = m.icon;
                        return (
                            <div 
                                key={m.type}
                                className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md"
                            >
                                <div className="flex items-start gap-3.5 mb-4">
                                    <div className={`p-3 rounded-2xl border ${m.color} shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h5 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                            {m.title}
                                        </h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-medium">
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        CSV & JSON
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenExport(m.type)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 text-xs font-bold transition active:scale-95"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{isIndo ? 'Ekspor' : 'Export'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Privacy & Standards Note */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                    {isIndo 
                        ? 'Semua file ekspor dienkode langsung di browser Anda. Karakter bahasa Indonesia dan simbol mata uang terlindungi dengan UTF-8 Byte Order Mark (BOM) agar dapat dibuka langsung di Microsoft Excel, Google Sheets, LibreOffice, atau software analisis data tanpa format teks yang rusak.'
                        : 'All exports are prepared locally on your browser. International characters and currencies are protected with UTF-8 Byte Order Mark (BOM) ensuring zero mojibake when opened in Microsoft Excel or Google Sheets.'}
                </div>
            </div>

            {/* Universal Export Modal Dialog */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                moduleType={selectedModule}
            />
        </div>
    );
}

