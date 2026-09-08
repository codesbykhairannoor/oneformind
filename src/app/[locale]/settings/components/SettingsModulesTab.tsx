'use client';

import { useTranslations } from 'next-intl';

interface SettingsModulesTabProps {
    modules: Record<string, boolean>;
    onToggleModule: (key: string) => void;
}

export default function SettingsModulesTab({
    modules,
    onToggleModule,
}: SettingsModulesTabProps) {
    const t = useTranslations();

    const emojiMap: Record<string, string> = {
        habit: '🌱',
        planner: '📋',
        finance: '💸',
        journal: '📓',
        calendar: '📅',
        job: '💼',
        goal: '🎯'
    };

    const labelMap: Record<string, string> = {
        habit: t('settings_notification_module_habit'),
        planner: t('settings_notification_module_planner'),
        finance: t('settings_notification_module_finance'),
        journal: t('settings_notification_module_journal'),
        calendar: t('module_calendar_title'),
        job: t('module_job_title'),
        goal: t('module_goal_title')
    };

    const descMap: Record<string, string> = {
        habit: t('module_habit_desc'),
        planner: t('module_planner_desc'),
        finance: t('module_finance_desc'),
        journal: t('module_journal_desc'),
        calendar: t('module_calendar_desc'),
        job: t('module_job_desc'),
        goal: t('module_goal_desc')
    };

    return (
        <div className="space-y-10 pb-12">
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-800 dark:text-white tracking-tight">
                    {t('settings_modules_title')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400 mt-1">
                    {t('settings_modules_desc')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(modules).map(([key, enabled]) => (
                    <div
                        key={key}
                        id={`module-card-${key}`}
                        className="group flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/40 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                                {emojiMap[key]}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm capitalize">
                                    {labelMap[key]}
                                </h4>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                    {descMap[key]}
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                                id={`module-toggle-${key}`}
                                checked={enabled}
                                type="checkbox"
                                className="sr-only peer"
                                onChange={() => onToggleModule(key)}
                            />
                            <div className="w-11 h-6 bg-slate-100 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner border border-slate-100 dark:border-slate-700" />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
