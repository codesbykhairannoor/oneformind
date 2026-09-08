'use client';

import { useTranslations } from 'next-intl';

interface SettingsNotificationsTabProps {
    dailySummary: boolean;
    setDailySummary: (val: boolean) => void;
    habitReminders: boolean;
    setHabitReminders: (val: boolean) => void;
}

export default function SettingsNotificationsTab({
    dailySummary,
    setDailySummary,
    habitReminders,
    setHabitReminders,
}: SettingsNotificationsTabProps) {
    const t = useTranslations();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                    {t('settings_notif_page_title')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                    {t('settings_notif_page_desc')}
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {t('settings_notif_digest_title')}
                        </p>
                        <p className="text-xs text-slate-500">
                            {t('settings_notif_digest_desc')}
                        </p>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={dailySummary} 
                        onChange={(e) => setDailySummary(e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {t('settings_notif_habit_title')}
                        </p>
                        <p className="text-xs text-slate-500">
                            {t('settings_notif_habit_desc')}
                        </p>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={habitReminders} 
                        onChange={(e) => setHabitReminders(e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
