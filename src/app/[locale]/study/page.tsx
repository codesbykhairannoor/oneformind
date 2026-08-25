'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AcademicHeader from './components/AcademicHeader';
import AcademicSetup from './components/AcademicSetup';
import CourseCard, { CourseRecord } from './components/CourseCard';
import ClassroomView, { ArchiveItem } from './components/ClassroomView';
import CourseModal from './components/CourseModal';
import SemesterModal from './components/SemesterModal';
import ArchiveModal from './components/ArchiveModal';
import { FolderOpen, Trash2, Sparkles, ChevronRight } from 'lucide-react';

export default function StudyPage() {
    const t = useTranslations();

    // User Settings State
    const [userSettings, setUserSettings] = useState<Record<string, any>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ofm_study_user_settings');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) {}
            }
        }
        return {
            education_level: 'kuliah',
            major: 'Teknik Informatika',
            current_semester: 1,
            student_id: '202600123'
        };
    });

    const hasCompletedSetup = Boolean(userSettings.education_level);

    // Dynamic Terms calculation matching 1:1 Index.vue line 51-64
    const terms = useMemo(() => {
        const level = userSettings.education_level || 'kuliah';
        const custom = userSettings.custom_term;

        if (level === 'kuliah') {
            return {
                semester: custom || t('study_term_semester_kuliah') || 'Semester',
                course: t('study_term_course_kuliah') || 'Mata Kuliah',
                sks: t('study_term_sks_kuliah') || 'SKS',
                grade: t('study_term_grade_kuliah') || 'Target Nilai',
                meeting: t('study_term_meeting_kuliah') || 'Pertemuan',
                ipk: t('study_term_ipk_kuliah') || 'IPK',
                ips: t('study_term_ips_kuliah') || 'IPS',
                total_sks: t('study_term_total_sks_kuliah') || 'Total SKS'
            };
        } else if (level === 'sma' || level === 'smk' || level === 'smp' || level === 'sd') {
            return {
                semester: custom || t('study_term_semester_school') || 'Semester',
                course: t('study_term_course_school') || 'Mata Pelajaran',
                sks: t('study_term_sks_school') || 'Jam Pelajaran',
                grade: t('study_term_grade_school') || 'Nilai Rapor',
                meeting: t('study_term_meeting_school') || 'Bab / Topik',
                ipk: t('study_term_ipk_school') || 'Rata-rata Rapor',
                ips: t('study_term_ips_school') || 'Nilai Semester',
                total_sks: t('study_term_total_sks_school') || 'Total Jam'
            };
        } else {
            return {
                semester: custom || 'Batch',
                course: 'Modul / Topik',
                sks: 'Beban Belajar',
                grade: 'Target Hasil',
                meeting: 'Sesi / Pertemuan',
                ipk: 'Skor Kelulusan',
                ips: 'Nilai Batch',
                total_sks: 'Total Beban'
            };
        }
    }, [userSettings, t]);

    // Academic Records State
    const [academicRecords, setAcademicRecords] = useState<CourseRecord[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ofm_study_academic_records');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) {}
            }
        }
        return [
            {
                id: 1,
                course_name: 'Pemrograman Web Lanjut',
                semester: 1,
                sks: 3,
                grade: 'A',
                archives: [
                    { id: 'arc_1', meeting_tag: 'Pertemuan 01 - Next.js App Router', type: 'Modul', file_name: 'Slide_01_NextJS.pdf', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                    { id: 'arc_2', meeting_tag: 'Pertemuan 01 - Next.js App Router', type: 'Catatan', link_url: 'https://nextjs.org/docs' },
                    { id: 'arc_3', meeting_tag: 'Pertemuan 02 - Tailwind & UI System', type: 'Soal', file_name: 'Tugas_01_UI_Layout.pdf', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
                ]
            },
            {
                id: 2,
                course_name: 'Algoritma & Struktur Data',
                semester: 1,
                sks: 4,
                grade: 'A-',
                archives: [
                    { id: 'arc_4', meeting_tag: 'Pertemuan 01 - Graph & Trees', type: 'Modul', file_name: 'Graph_Algorithms.pdf', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
                ]
            },
            {
                id: 3,
                course_name: 'Sistem Basis Data',
                semester: 1,
                sks: 3,
                grade: 'B+',
                archives: []
            }
        ];
    });

    const [selectedSemester, setSelectedSemester] = useState<number>(userSettings.current_semester || 1);
    const [manuallyAddedSemesters, setManuallyAddedSemesters] = useState<number[]>([]);

    const saveRecordsToStorage = (updated: CourseRecord[]) => {
        setAcademicRecords(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ofm_study_academic_records', JSON.stringify(updated));
        }
    };

    const saveUserSettings = (updatedSettings: Record<string, any>) => {
        setUserSettings(updatedSettings);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ofm_study_user_settings', JSON.stringify(updatedSettings));
        }
    };

    // Available Semesters computation
    const availableSemesters = useMemo(() => {
        const semsFromRecords = academicRecords.map(r => Number(r.semester));
        const semsSet = new Set([
            ...semsFromRecords,
            Number(selectedSemester),
            Number(userSettings.current_semester || 1),
            ...manuallyAddedSemesters
        ]);
        return Array.from(semsSet).sort((a, b) => b - a);
    }, [academicRecords, selectedSemester, userSettings.current_semester, manuallyAddedSemesters]);

    // Active Courses for selected semester
    const filteredCourses = useMemo(() => {
        return academicRecords.filter(r => Number(r.semester) === Number(selectedSemester));
    }, [academicRecords, selectedSemester]);

    // Selected Active Course for Classroom View
    const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);

    const activeCourseReactive = useMemo(() => {
        if (!selectedCourse) return null;
        return academicRecords.find(r => r.id === selectedCourse.id) || null;
    }, [selectedCourse, academicRecords]);

    // Modals visibility state
    const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
    const [isAddArchiveModalOpen, setIsAddArchiveModalOpen] = useState(false);
    const [prefillArchiveTag, setPrefillArchiveTag] = useState('');

    // Handlers
    const handleSetupCompleted = (level: string, settingsData: Record<string, any>) => {
        saveUserSettings(settingsData);
    };

    const handleAddSemester = (num: number) => {
        setManuallyAddedSemesters(prev => [...prev, num]);
        setSelectedSemester(num);
        setIsAddSemesterModalOpen(false);
    };

    const handleDeleteSemester = (sem: number | string) => {
        if (confirm(`Yakin ingin menghapus ${terms.semester} ${sem} beserta seluruh data mata kuliah di dalamnya?`)) {
            const updated = academicRecords.filter(r => Number(r.semester) !== Number(sem));
            saveRecordsToStorage(updated);
            setManuallyAddedSemesters(prev => prev.filter(s => s !== Number(sem)));
            if (Number(selectedSemester) === Number(sem)) {
                const remaining = availableSemesters.filter(s => s !== Number(sem));
                setSelectedSemester(remaining.length > 0 ? remaining[0] : 1);
            }
        }
    };

    const handleAddCourseSubmit = (data: { course_name: string; sks: number; grade: string }) => {
        const newRecord: CourseRecord = {
            id: 'course_' + Date.now(),
            course_name: data.course_name,
            semester: Number(selectedSemester),
            sks: data.sks,
            grade: data.grade,
            archives: []
        };
        saveRecordsToStorage([...academicRecords, newRecord]);
        setIsAddCourseModalOpen(false);
    };

    const handleEditCourseSubmit = (data: { course_name: string; sks: number; grade: string }) => {
        if (!editingCourse) return;
        const updated = academicRecords.map(r => r.id === editingCourse.id ? {
            ...r,
            course_name: data.course_name,
            sks: data.sks,
            grade: data.grade
        } : r);
        saveRecordsToStorage(updated);
        setIsEditCourseModalOpen(false);
    };

    const handleDeleteCourse = (id: number | string) => {
        if (confirm(`Hapus ${terms.course} ini?`)) {
            const updated = academicRecords.filter(r => r.id !== id);
            saveRecordsToStorage(updated);
            if (selectedCourse?.id === id) {
                setSelectedCourse(null);
            }
        }
    };

    const handleAddArchive = (archive: ArchiveItem) => {
        if (!activeCourseReactive) return;
        const updated = academicRecords.map(r => {
            if (r.id === activeCourseReactive.id) {
                return {
                    ...r,
                    archives: [...(r.archives || []), archive]
                };
            }
            return r;
        });
        saveRecordsToStorage(updated);
    };

    const handleDeleteArchive = (id: number | string) => {
        if (!activeCourseReactive) return;
        const updated = academicRecords.map(r => {
            if (r.id === activeCourseReactive.id) {
                return {
                    ...r,
                    archives: (r.archives || []).filter(a => a.id !== id)
                };
            }
            return r;
        });
        saveRecordsToStorage(updated);
    };

    return (
        <AuthenticatedLayout>
            {/* 1:1 from Index.vue line 452-568 */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors font-sans">
                
                {/* STATE 1: EMPTY STATE & SETUP */}
                {!hasCompletedSetup ? (
                    <AcademicSetup
                        user={{ settings: userSettings }}
                        hasCompletedSetup={hasCompletedSetup}
                        onSetupCompleted={handleSetupCompleted}
                    />
                ) : (
                    <>
                        {/* STATE 2: DASHBOARD (SEMESTER & DAFTAR MATKUL) */}
                        {!activeCourseReactive ? (
                            <>
                                <AcademicHeader
                                    userSettings={userSettings}
                                    terms={terms}
                                    availableSemesters={availableSemesters}
                                    selectedSemester={selectedSemester}
                                    onSelectSemester={setSelectedSemester}
                                    onDeleteSpecificSemester={handleDeleteSemester}
                                    onAddSemesterClick={() => setIsAddSemesterModalOpen(true)}
                                    onAddCourseClick={() => setIsAddCourseModalOpen(true)}
                                />

                                <div className="max-w-[1600px] w-full md:w-[95%] mx-auto px-4 sm:px-8 py-8">
                                    
                                    {/* Banner Portfolio — 1:1 from Index.vue line 476-487 */}
                                    <Link
                                        href="/study/portfolio"
                                        className="group relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden rounded-2xl border border-slate-800 transition-all hover:border-indigo-500/50 shadow-lg mb-8 hover:-translate-y-0.5"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/30">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-white font-bold text-sm sm:text-base tracking-wide">
                                                Neural Portfolio{' '}
                                                <span className="hidden sm:inline text-slate-400 font-normal ml-2">
                                                    &mdash; {t('study_portfolio_banner_sub') || 'Statistik & AI Competency Framework'}
                                                </span>
                                            </h3>
                                        </div>
                                        <ChevronRight className="relative z-10 h-5 w-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    {/* Course List Section Header */}
                                    <div className="flex items-end justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 group/header">
                                        <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                                            <FolderOpen className="h-5 w-5 text-slate-400" />
                                            Daftar {terms.course} ({terms.semester} {selectedSemester})
                                            
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSemester(selectedSemester)}
                                                className="ml-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-lg transition-colors opacity-0 group-hover/header:opacity-100"
                                                title={`Hapus ${terms.semester}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </h2>
                                    </div>

                                    {/* Grid Mata Kuliah */}
                                    {filteredCourses.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {filteredCourses.map((record) => (
                                                <CourseCard
                                                    key={record.id}
                                                    record={record}
                                                    terms={terms}
                                                    onClick={(c) => setSelectedCourse(c)}
                                                    onEdit={(c) => { setEditingCourse(c); setIsEditCourseModalOpen(true); }}
                                                    onDelete={handleDeleteCourse}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                                            <div className="h-16 w-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <FolderOpen className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-black text-slate-600 dark:text-slate-300 mb-1">
                                                Belum Ada Data {terms.course}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-6">
                                                Belum ada {terms.course} yang terdaftar pada {terms.semester} {selectedSemester}.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddCourseModalOpen(true)}
                                                className="px-6 py-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-full font-bold transition-colors"
                                            >
                                                + Tambah {terms.course} Pertama
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* STATE 3: RUANG KELAS / DETAIL MATKUL */
                            <ClassroomView
                                course={activeCourseReactive}
                                terms={terms}
                                onBack={() => setSelectedCourse(null)}
                                onAddArchiveClick={(tag) => {
                                    setPrefillArchiveTag(tag || '');
                                    setIsAddArchiveModalOpen(true);
                                }}
                                onDeleteArchive={handleDeleteArchive}
                            />
                        )}

                        {/* Modals */}
                        <SemesterModal
                            isOpen={isAddSemesterModalOpen}
                            onClose={() => setIsAddSemesterModalOpen(false)}
                            onSubmit={handleAddSemester}
                        />

                        <CourseModal
                            isOpen={isAddCourseModalOpen}
                            isEdit={false}
                            terms={terms}
                            selectedSemester={selectedSemester}
                            onClose={() => setIsAddCourseModalOpen(false)}
                            onSubmit={handleAddCourseSubmit}
                        />

                        <CourseModal
                            isOpen={isEditCourseModalOpen}
                            isEdit={true}
                            course={editingCourse}
                            terms={terms}
                            selectedSemester={selectedSemester}
                            onClose={() => setIsEditCourseModalOpen(false)}
                            onSubmit={handleEditCourseSubmit}
                        />

                        {activeCourseReactive && (
                            <ArchiveModal
                                isOpen={isAddArchiveModalOpen}
                                prefillTag={prefillArchiveTag}
                                course={activeCourseReactive}
                                terms={terms}
                                onClose={() => setIsAddArchiveModalOpen(false)}
                                onAddArchive={handleAddArchive}
                            />
                        )}
                    </>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
