'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, BookOpen, GraduationCap, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ModalPortal from '@/components/ModalPortal';

interface AcademicSetupProps {
    user: Record<string, any>;
    hasCompletedSetup: boolean;
    onSetupCompleted: (level: string, settingsData: Record<string, any>) => void;
}

export default function AcademicSetup({
    user,
    hasCompletedSetup,
    onSetupCompleted
}: AcademicSetupProps) {
    const t = useTranslations();
    const [showSetupModal, setShowSetupModal] = useState(false);

    const [educationLevel, setEducationLevel] = useState(user.settings?.education_level || 'kuliah');
    const [major, setMajor] = useState(user.settings?.major || '');
    const [studentId, setStudentId] = useState(user.settings?.student_id || '');
    const [currentSemester, setCurrentSemester] = useState(user.settings?.current_semester || 1);
    const [customTerm, setCustomTerm] = useState(user.settings?.custom_term || '');

    if (hasCompletedSetup) return null;

    const submitSetup = (e: React.FormEvent) => {
        e.preventDefault();
        const settingsData = {
            education_level: educationLevel,
            major,
            student_id: studentId,
            current_semester: Number(currentSemester) || 1,
            custom_term: customTerm
        };
        setShowSetupModal(false);
        onSetupCompleted(educationLevel, settingsData);
    };

    return (
        // 1:1 from AcademicSetup.vue line 48-129
        <div className="max-w-[1600px] w-full md:w-[95%] mx-auto px-4 sm:px-8 py-12">
            
            {/* Empty State Banner */}
            <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm dark:shadow-none transition-all duration-500 max-w-4xl mx-auto mb-12">
                <div className="flex flex-col items-center gap-5">
                    <span className="text-6xl animate-bounce mb-2">🎓</span>
                    <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 transition-colors duration-500">
                        {t('study_profile_not_set') || 'Profil Studi Belum Diatur'}
                    </h4>
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 px-8 max-w-lg mx-auto transition-colors duration-500 leading-relaxed">
                        {t('study_profile_not_set_desc') || 'Mulai organisasikan seluruh modul, tugas, dan target nilai Anda secara cerdas. Mari sesuaikan sistem ini dengan profil akademis Anda sekarang!'}
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowSetupModal(true)}
                        className="mt-4 bg-indigo-600 text-white font-black py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all outline-none flex items-center gap-2"
                    >
                        {t('study_start_setup') || 'Mulai Setup'} <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Neural Portfolio Banner */}
            <div className="max-w-[1600px] w-full mx-auto pb-12">
                <Link
                    href="/study/portfolio"
                    className="group relative flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] border-2 border-indigo-50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                >
                    <div className="flex items-center gap-6 mb-4 sm:mb-0">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">✨</span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-slate-800 dark:text-white font-black text-xl mb-1">Neural Portfolio</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
                                {t('study_portfolio_banner_desc') || 'Kembangkan reputasi akademis & portofolio kompetensi otomatis berbasis AI.'}
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-2 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        {t('study_explore_ai_space') || 'Jelajahi Ruang AI'} <ChevronRight className="h-5 w-5" />
                    </div>
                </Link>
            </div>

            {/* Setup Wizard Modal */}
            {showSetupModal && (
                <ModalPortal><div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-indigo-600 p-6 text-center relative shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowSetupModal(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <GraduationCap className="h-12 w-12 text-white/90 mx-auto mb-2" />
                            <h2 className="text-2xl font-black text-white">{t('study_profile_title') || 'Profil Akademik'}</h2>
                        </div>
                        
                        <form onSubmit={submitSetup} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                                    {t('study_edu_level_label') || 'Tingkat Pendidikan'}
                                </label>
                                <select
                                    value={educationLevel}
                                    onChange={(e) => setEducationLevel(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                >
                                    <option value="kuliah">{t('study_edu_level_uni') || 'Perguruan Tinggi / Kuliah'}</option>
                                    <option value="sma">{t('study_edu_level_hs') || 'SMA / SMK / MA'}</option>
                                    <option value="smp">{t('study_edu_level_ms') || 'SMP / MTs'}</option>
                                    <option value="sd">{t('study_edu_level_es') || 'SD / MI'}</option>
                                    <option value="lainnya">{t('study_edu_level_other') || 'Lainnya (Bootcamp / Kursus)'}</option>
                                </select>
                            </div>

                            {educationLevel === 'lainnya' && (
                                <div>
                                    <label className="block text-[11px] font-black tracking-wide text-indigo-500 mb-2">
                                        {t('study_custom_term_label') || 'Custom Term (misal: Batch, Term, Phase)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={customTerm}
                                        onChange={(e) => setCustomTerm(e.target.value)}
                                        placeholder="e.g. Batch"
                                        className="w-full px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                                    {t('study_major_label') || 'Jurusan / Program Studi'}
                                </label>
                                <input
                                    type="text"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    placeholder={t('study_major_placeholder') || 'Cth: Teknik Informatika'}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                                        {t('study_student_id_label') || 'NIM / NISN'}
                                    </label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        placeholder={t('study_student_id_placeholder') || '12345678'}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-2">
                                        {t('study_semester_label') || 'Semester'}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={currentSemester}
                                        onChange={(e) => setCurrentSemester(e.target.value)}
                                        placeholder="1"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 mt-2"
                            >
                                {t('study_save_start') || 'Simpan & Mulai'}
                            </button>
                        </form>
                    </div>
                </div></ModalPortal>
            )}

        </div>
    );
}
