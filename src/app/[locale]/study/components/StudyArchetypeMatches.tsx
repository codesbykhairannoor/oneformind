'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';

interface StudyArchetypeMatchesProps {
    competency?: Record<string, any> | null;
}

export default function StudyArchetypeMatches({ competency }: StudyArchetypeMatchesProps) {
    const t = useTranslations();

    const archetypes: Record<string, number> = competency?.archetypes || {
        'Fullstack Software Engineer': 95,
        'Frontend Technical Lead': 90,
        'Backend Architect': 86,
        'AI / Machine Learning Engineer': 82
    };

    const hasArchetypes = Object.keys(archetypes).length > 0;

    return (
        // 1:1 from StudyArchetypeMatches.vue line 36-71
        <div className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-[0_10px_45px_-4px_rgba(0,0,0,0.03)] hover:shadow-2xl transition duration-500">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                {t('study_archetype_title') || 'Career Archetypes Match'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">
                {t('study_archetype_subtitle') || 'Predicted by our Scikit-Learn local classifier models'}
            </p>

            {hasArchetypes ? (
                <div className="space-y-5 mb-8 mt-2">
                    {Object.entries(archetypes).map(([archetype, score]) => (
                        <div key={archetype} className="space-y-2.5">
                            <div className="flex items-center justify-between text-sm md:text-base font-black">
                                <span className="text-slate-800 dark:text-slate-200">{archetype}</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 md:h-4 overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 shadow-sm"
                                    style={{ width: `${score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 text-center text-slate-400 dark:text-slate-600 text-sm font-semibold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl mb-6">
                    {t('study_upload_to_run_ml') || 'Upload coursework data to run ML archetype prediction.'}
                </div>
            )}
        </div>
    );
}
