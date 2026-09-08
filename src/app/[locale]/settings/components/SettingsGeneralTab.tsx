'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Save } from 'lucide-react';

interface SettingsGeneralTabProps {
    name: string;
    setName: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    onSave: (e: React.FormEvent) => void;
}

export default function SettingsGeneralTab({
    name,
    setName,
    email,
    setEmail,
    onSave,
}: SettingsGeneralTabProps) {
    const t = useTranslations();

    return (
        <form onSubmit={onSave} className="space-y-8 max-w-2xl">
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                    {t('profile_info_title')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                    {t('profile_info_desc')}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        {t('profile_label_name')}
                    </label>
                    <input 
                        type="text" 
                        value={name} 
                        placeholder={t('profile_placeholder_name')}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        {t('profile_label_email')}
                    </label>
                    <input 
                        type="email" 
                        value={email} 
                        placeholder={t('profile_placeholder_email')}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2">
                    <Save size={16} />
                    <span>{t('profile_btn_save')}</span>
                </button>
            </div>
        </form>
    );
}
