'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useActiveModules } from '@/hooks/useActiveModules';
import { 
    Bell, 
    Mail, 
    Clock, 
    Send, 
    Check, 
    AlertCircle, 
    Loader2, 
    Sparkles, 
    CheckCircle2, 
    Save, 
    Volume2, 
    ShieldCheck 
} from 'lucide-react';

interface NotificationConfig {
    email_enabled: boolean;
    daily_digest: boolean;
    digest_time: string;
    habit_reminder: boolean;
    habit_time: string;
    planner_reminder: boolean;
    planner_time: string;
    finance_reminder: boolean;
    finance_time: string;
    journal_reminder: boolean;
    journal_time: string;
    goal_reminder: boolean;
    goal_time: string;
    study_reminder: boolean;
    study_time: string;
    job_reminder: boolean;
    job_time: string;
}

const DEFAULT_NOTIFICATIONS: NotificationConfig = {
    email_enabled: true,
    daily_digest: true,
    digest_time: '07:00',
    habit_reminder: true,
    habit_time: '20:00',
    planner_reminder: true,
    planner_time: '08:00',
    finance_reminder: true,
    finance_time: '21:00',
    journal_reminder: true,
    journal_time: '21:30',
    goal_reminder: true,
    goal_time: '09:00',
    study_reminder: true,
    study_time: '19:00',
    job_reminder: true,
    job_time: '10:00',
};

interface SettingsNotificationsTabProps {
    userEmail?: string;
    initialSettings?: Partial<NotificationConfig>;
}

export default function SettingsNotificationsTab({
    userEmail,
    initialSettings
}: SettingsNotificationsTabProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const { modules } = useActiveModules();

    const [notifState, setNotifState] = useState<NotificationConfig>(() => ({
        ...DEFAULT_NOTIFICATIONS,
        ...initialSettings
    }));

    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

    // Fetch saved notification settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.settings?.notifications) {
                        setNotifState(prev => ({ ...prev, ...data.settings.notifications }));
                    }
                }
            } catch (err) {
                console.error('Failed to load notification settings:', err);
            }
        };
        fetchSettings();
    }, []);

    const showToast = (type: 'success' | 'error' | 'info', text: string) => {
        setFeedback({ type, text });
        setTimeout(() => setFeedback(null), 4000);
    };

    const handleToggleField = async (field: keyof NotificationConfig) => {
        const next = { ...notifState, [field]: !notifState[field] };
        setNotifState(next);
        await saveSettings(next);
    };

    const handleTimeChange = async (field: keyof NotificationConfig, value: string) => {
        const next = { ...notifState, [field]: value };
        setNotifState(next);
        await saveSettings(next);
    };

    const saveSettings = async (nextState: NotificationConfig) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    settings: {
                        notifications: nextState
                    }
                })
            });
            if (res.ok) {
                showToast('success', isIndo ? '✓ Pengaturan notifikasi berhasil disimpan!' : '✓ Notification settings saved!');
            }
        } catch (err) {
            showToast('error', isIndo ? 'Gagal menyimpan pengaturan notifikasi' : 'Failed to save notification settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendTestEmail = async (moduleType: string) => {
        setIsTesting(moduleType);
        try {
            const res = await fetch('/api/notifications/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleType, locale })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(
                    'success',
                    isIndo 
                        ? `✓ Email uji coba pengingat ${moduleType.toUpperCase()} berhasil dikirim ke ${data.deliveredTo}!`
                        : `✓ Test reminder email for ${moduleType.toUpperCase()} sent to ${data.deliveredTo}!`
                );
            } else {
                throw new Error(data.error || 'Gagal mengirim email');
            }
        } catch (err: any) {
            showToast('error', err.message || (isIndo ? 'Gagal mengirim email uji coba' : 'Failed to send test email'));
        } finally {
            setIsTesting(null);
        }
    };

    // Module definitions for notification settings
    const moduleNotifConfigs = [
        {
            key: 'habit',
            icon: '🌱',
            titleId: 'Pengingat Kebiasaan Harian (Habit Check-in)',
            titleEn: 'Daily Habit Check-in Reminder',
            descId: 'Kirim email pengingat untuk mencentang kebiasaan harian dan mempertahankan streak positif Anda.',
            descEn: 'Receive email reminders to check off daily habits and protect your active streaks.',
            toggleKey: 'habit_reminder' as keyof NotificationConfig,
            timeKey: 'habit_time' as keyof NotificationConfig,
            defaultTime: '20:00',
        },
        {
            key: 'planner',
            icon: '📋',
            titleId: 'Agenda Pagi & Tugas Prioritas (Planner Digest)',
            titleEn: 'Morning Agenda & Vital Tasks (Planner Digest)',
            descId: 'Kirim email ringkasan agenda to-do harian dan tugas berkode Vital sebelum hari produktif Anda dimulai.',
            descEn: 'Receive morning briefings of your daily planner agenda and high-impact vital tasks.',
            toggleKey: 'planner_reminder' as keyof NotificationConfig,
            timeKey: 'planner_time' as keyof NotificationConfig,
            defaultTime: '08:00',
        },
        {
            key: 'finance',
            icon: '💸',
            titleId: 'Audit Finansial & Limit Budget (Finance Check)',
            titleEn: 'Financial Audit & Budget Limit (Finance Check)',
            descId: 'Kirim email review pengeluaran berkala, sisa kuota anggaran bulanan, dan evaluasi tabungan.',
            descEn: 'Receive periodic cashflow summaries, remaining budget caps, and savings targets.',
            toggleKey: 'finance_reminder' as keyof NotificationConfig,
            timeKey: 'finance_time' as keyof NotificationConfig,
            defaultTime: '21:00',
        },
        {
            key: 'journal',
            icon: '📓',
            titleId: 'Refleksi Jurnal Malam & Mood Tracker (Journal Reminder)',
            titleEn: 'Evening Journal Reflection & Mood (Journal Reminder)',
            descId: 'Kirim email pengingat 5-menit sebelum tidur untuk merefleksikan pencapaian dan mencatat suasana hati.',
            descEn: 'Receive a 5-minute evening prompt before bedtime to reflect and log your daily mood.',
            toggleKey: 'journal_reminder' as keyof NotificationConfig,
            timeKey: 'journal_time' as keyof NotificationConfig,
            defaultTime: '21:30',
        },
        {
            key: 'goal',
            icon: '🎯',
            titleId: 'Evaluasi Milestone & Target Strategis (Goals Review)',
            titleEn: 'Milestone & Strategic OKR Review (Goals Review)',
            descId: 'Kirim email evaluasi mingguan untuk meninjau kecepatan pencapaian target North Star dan deadline OKR.',
            descEn: 'Receive weekly progress reviews on your North Star goals and OKR milestones.',
            toggleKey: 'goal_reminder' as keyof NotificationConfig,
            timeKey: 'goal_time' as keyof NotificationConfig,
            defaultTime: '09:00',
        },
        {
            key: 'study',
            icon: '🎓',
            titleId: 'Radar Belajar & Review Flashcard (Study Reminder)',
            titleEn: 'Study Radar & Flashcard Review (Study Reminder)',
            descId: 'Kirim email pengingat pengulangan berkala flashcard, tugas kuliah yang mendekati deadline, dan bacaan buku.',
            descEn: 'Receive spaced repetition flashcard alerts, assignment deadlines, and book reading goals.',
            toggleKey: 'study_reminder' as keyof NotificationConfig,
            timeKey: 'study_time' as keyof NotificationConfig,
            defaultTime: '19:00',
        },
        {
            key: 'job',
            icon: '💼',
            titleId: 'Pipa Lamaran Kerja & Interview (Jobs Follow-up)',
            titleEn: 'Job Application Pipeline & Interview (Jobs Follow-up)',
            descId: 'Kirim email pengingat follow-up perusahaan, jadwal wawancara kerja, dan persiapan portofolio.',
            descEn: 'Receive follow-up alerts for pending job applications, upcoming interviews, and career tasks.',
            toggleKey: 'job_reminder' as keyof NotificationConfig,
            timeKey: 'job_time' as keyof NotificationConfig,
            defaultTime: '10:00',
        },
    ];

    // Filter active and inactive modules dynamically
    const activeModuleConfigs = moduleNotifConfigs.filter(cfg => Boolean(modules[cfg.key]));
    const inactiveModuleConfigs = moduleNotifConfigs.filter(cfg => !modules[cfg.key]);

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pusat Notifikasi & Pengingat Email' : 'Email Notification & Reminder Hub'}
                    </h3>

                    {/* Master Switch */}
                    <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 px-4 py-2 rounded-2xl">
                        <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {isIndo ? 'Master Pengingat Email' : 'Master Email Reminders'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer ml-1">
                            <input
                                type="checkbox"
                                checked={notifState.email_enabled}
                                onChange={() => handleToggleField('email_enabled')}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                        </label>
                    </div>
                </div>

                <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }} className="text-slate-500 dark:text-slate-400 mt-2 max-w-3xl">
                    {isIndo
                        ? 'Atur jadwal pengingat email otomatis untuk setiap modul aktif Anda (Kebiasaan, Agenda Planner, Keuangan, Jurnal, Target, dsb) agar Anda tetap disiplin dan tidak melewatkan rutinitas harian.'
                        : 'Configure automated email reminders for each of your active modules (Habits, Planner, Finance, Journal, Goals, etc.) to keep your daily life OS consistent and on track.'
                    }
                </p>
            </div>

            {/* Feedback Toast */}
            {feedback && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 border ${
                    feedback.type === 'error'
                        ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}>
                    {feedback.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    <span>{feedback.text}</span>
                </div>
            )}

            {/* SYSTEM CORE: DAILY EXECUTIVE DIGEST */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
                            ✨
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                                    {isIndo ? 'Email Digest Harian (Executive Morning Brief)' : 'Daily Executive Morning Digest'}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                    System Core
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                                {isIndo
                                    ? 'Satu ringkasan eksekutif setiap pagi yang menggabungkan seluruh agenda penting, target kebiasaan, dan kondisi keuangan harian Anda.'
                                    : 'A unified morning executive summary combining your top agenda items, active habit goals, and financial health.'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:self-center shrink-0">
                        {/* Time Picker */}
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-xs">
                            <Clock size={13} className="text-slate-400" />
                            <input
                                type="time"
                                value={notifState.digest_time || '07:00'}
                                onChange={(e) => handleTimeChange('digest_time', e.target.value)}
                                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent border-none focus:outline-hidden"
                            />
                        </div>

                        {/* Test Email Button */}
                        <button
                            type="button"
                            disabled={isTesting === 'digest' || !notifState.email_enabled}
                            onClick={() => handleSendTestEmail('digest')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isTesting === 'digest' ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                            <span>{isIndo ? 'Uji Coba Kirim' : 'Send Test'}</span>
                        </button>

                        {/* Toggle */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifState.daily_digest && notifState.email_enabled}
                                onChange={() => handleToggleField('daily_digest')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                        </label>
                    </div>
                </div>
            </div>

            {/* DYNAMIC ACTIVE MODULE REMINDERS */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Pengingat Email Modul Aktif' : 'Active Module Email Reminders'}
                    </h4>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {activeModuleConfigs.length} {isIndo ? 'Modul Terhubung' : 'Modules Connected'}
                    </span>
                </div>

                <div className="space-y-3">
                    {activeModuleConfigs.map((cfg) => {
                        const isFieldActive = Boolean(notifState[cfg.toggleKey]) && notifState.email_enabled;
                        const currentTime = String(notifState[cfg.timeKey] || cfg.defaultTime);

                        return (
                            <div
                                key={cfg.key}
                                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                    isFieldActive
                                        ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                                        : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800'
                                }`}
                            >
                                <div className="flex items-start gap-3.5 min-w-0 pr-2">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                                        isFieldActive
                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 shadow-xs'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 opacity-60'
                                    }`}>
                                        {cfg.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-bold text-sm tracking-tight ${
                                                isFieldActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                                            }`}>
                                                {isIndo ? cfg.titleId : cfg.titleEn}
                                            </h4>
                                            {isFieldActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                            {isIndo ? cfg.descId : cfg.descEn}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                                    {/* Time Selector */}
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-xs">
                                        <Clock size={13} className="text-slate-400" />
                                        <input
                                            type="time"
                                            value={currentTime}
                                            onChange={(e) => handleTimeChange(cfg.timeKey, e.target.value)}
                                            className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent border-none focus:outline-hidden"
                                        />
                                    </div>

                                    {/* Test Email Button */}
                                    <button
                                        type="button"
                                        disabled={isTesting === cfg.key || !notifState.email_enabled}
                                        onClick={() => handleSendTestEmail(cfg.key)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                                        title={isIndo ? 'Kirim email uji coba ke inbox Anda' : 'Send test reminder email to your inbox'}
                                    >
                                        {isTesting === cfg.key ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                        <span className="hidden sm:inline">{isIndo ? 'Uji Coba' : 'Test'}</span>
                                    </button>

                                    {/* Individual Toggle */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isFieldActive}
                                            onChange={() => handleToggleField(cfg.toggleKey)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner border border-slate-200 dark:border-slate-700" />
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* INACTIVE MODULES NOTICE */}
            {inactiveModuleConfigs.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isIndo ? 'Modul yang Sedang Disembunyikan / Nonaktif:' : 'Currently Hidden / Disabled Modules:'}
                    </p>
                    <p className="leading-relaxed">
                        {isIndo
                            ? `Pengingat email untuk modul ${inactiveModuleConfigs.map(c => c.titleId.split(' ')[0]).join(', ')} otomatis dijeda karena modul tersebut saat ini disembunyikan di Pengaturan Modul. Aktifkan modul terlebih dahulu untuk mengaktifkan pengingat emailnya.`
                            : `Email reminders for ${inactiveModuleConfigs.map(c => c.titleEn.split(' ')[0]).join(', ')} are paused because they are currently hidden in Module Settings.`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
