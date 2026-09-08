'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Mail, Sparkles } from 'lucide-react';

export default function SettingsHelpTab() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white mb-2">
                    {t('settings_page_help_title')}
                </h3>
                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 dark:text-slate-400">
                    {t('settings_page_help_subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                    href="mailto:tranvasapp@gmail.com" 
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group"
                >
                    <Mail className="w-8 h-8 text-indigo-600 mb-3" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {t('help_support_direct_title')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                        {t('help_support_direct_desc')}
                    </p>
                </a>

                <a 
                    href="/coach" 
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all group"
                >
                    <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Assistant</h4>
                    <p className="text-xs text-slate-500 mt-1">
                        {locale === 'id' ? 'Dapatkan bantuan instant 24/7 melalui AI Life Coach.' : 'Get instant 24/7 help through our AI Life Coach.'}
                    </p>
                </a>
            </div>
        </div>
    );
}
