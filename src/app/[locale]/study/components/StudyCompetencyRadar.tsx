'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3 } from 'lucide-react';

interface StudyCompetencyRadarProps {
    competency?: Record<string, any> | null;
}

export default function StudyCompetencyRadar({ competency }: StudyCompetencyRadarProps) {
    const t = useTranslations();
    const competencies = competency?.competencies || {
        'Software Architecture': 92,
        'Data Structures & Algorithms': 88,
        'Database Systems': 85,
        'Web Development': 90,
        'Machine Learning': 78,
        'System Design': 84
    };

    const hasData = Object.keys(competencies).length > 0;

    return (
        // 1:1 from StudyCompetencyRadar.vue line 152-173
        <div className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 shadow-[0_10px_45px_-4px_rgba(0,0,0,0.03)] hover:shadow-2xl transition duration-500">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                {t('study_radar_title') || 'Competency Radar'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">
                {t('study_radar_subtitle') || 'Derived from your verified academic records'}
            </p>

            {!hasData ? (
                <div className="h-80 w-full flex flex-col items-center justify-center text-center px-4">
                    <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center justify-center mb-4 text-slate-400">
                        <BarChart3 className="h-6 w-6 opacity-50" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                        {t('study_no_competency_radar') || 'Belum Ada Data Kompetensi'}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px]">
                        {t('study_no_competency_desc') || 'Unggah data atau arsip perkuliahan untuk menganalisis radar kompetensi.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(competencies).map(([label, score]) => (
                        <div key={label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>{label}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{String(score)}%</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-700 shadow-sm"
                                    style={{ width: `${Number(score)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
