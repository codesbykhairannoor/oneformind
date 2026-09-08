'use client';

import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';

export default function SettingsPrivacyTab() {
    const t = useTranslations();

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {t('settings_export_title')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t('settings_export_desc')}
                        </p>
                    </div>
                    <button 
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                    >
                        <Download className="w-4 h-4" />
                        <span>{t('settings_export_btn')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
