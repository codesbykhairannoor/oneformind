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
import { FolderOpen, Trash2, Sparkles, ChevronRight, Loader2 } from 'lucide-react';

export default function StudyPage() {
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(true);

    // User Settings State
    const [userSettings, setUserSettings] = useState<Record<string, any>>({});
    const hasCompletedSetup = Boolean(userSettings.education_level);

    // Academic Records State
    const [academicRecords, setAcademicRecords] = useState<CourseRecord[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, coursesRes] = await Promise.all([
                    fetch('/api/user'),
                    fetch('/api/study/courses')
                ]);
                
                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData.settings && userData.settings.study) {
                        setUserSettings(userData.settings.study);
                    }
                }
                
                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    setAcademicRecords(coursesData.map((c: any) => ({
                        id: c.id,
                        course_name: c.courseName,
                        semester: c.semester,
                        sks: c.sks,
                        grade: c.grade,
                        archives: c.archives.map((a: any) => ({
                            id: a.id,
                            meeting_tag: a.meetingTag,
                            type: a.type,
                            file_name: a.fileName,
                            file_path: a.filePath,
                            link_url: a.linkUrl
                        }))
                    })));
                }
            } catch (error) {
                console.error("Failed to load study data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Dynamic Terms calculation
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

    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [manuallyAddedSemesters, setManuallyAddedSemesters] = useState<number[]>([]);

    useEffect(() => {
        if (userSettings.current_semester) {
            setSelectedSemester(Number(userSettings.current_semester));
        }
    }, [userSettings.current_semester]);

    const saveUserSettings = async (updatedSettings: Record<string, any>) => {
        setUserSettings(updatedSettings);
        try {
            const userRes = await fetch('/api/user');
            if (userRes.ok) {
                const userData = await userRes.json();
                const newSettings = { ...userData.settings, study: updatedSettings };
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings: newSettings })
                });
            }
        } catch (error) {
            console.error("Failed to save user settings", error);
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

    const handleDeleteSemester = async (sem: number | string) => {
        if (confirm(`Yakin ingin menghapus ${terms.semester} ${sem} beserta seluruh data mata kuliah di dalamnya?`)) {
            const toDelete = academicRecords.filter(r => Number(r.semester) === Number(sem));
            
            // UI optimistic update
            const updated = academicRecords.filter(r => Number(r.semester) !== Number(sem));
            setAcademicRecords(updated);
            
            setManuallyAddedSemesters(prev => prev.filter(s => s !== Number(sem)));
            if (Number(selectedSemester) === Number(sem)) {
                const remaining = availableSemesters.filter(s => s !== Number(sem));
                setSelectedSemester(remaining.length > 0 ? remaining[0] : 1);
            }

            // DB sync
            for (const course of toDelete) {
                await fetch(`/api/study/courses?id=${course.id}`, { method: 'DELETE' });
            }
        }
    };

    const handleAddCourseSubmit = async (data: { course_name: string; sks: number; grade: string }) => {
        setIsAddCourseModalOpen(false);
        try {
            const res = await fetch('/api/study/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseName: data.course_name,
                    semester: Number(selectedSemester),
                    sks: data.sks,
                    grade: data.grade
                })
            });
            if (res.ok) {
                const newCourse = await res.json();
                setAcademicRecords(prev => [...prev, {
                    id: newCourse.id,
                    course_name: newCourse.courseName,
                    semester: newCourse.semester,
                    sks: newCourse.sks,
                    grade: newCourse.grade,
                    archives: []
                }]);
            }
        } catch(e) {}
    };

    const handleEditCourseSubmit = async (data: { course_name: string; sks: number; grade: string }) => {
        if (!editingCourse) return;
        setIsEditCourseModalOpen(false);
        try {
            const res = await fetch('/api/study/courses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingCourse.id,
                    courseName: data.course_name,
                    semester: Number(selectedSemester),
                    sks: data.sks,
                    grade: data.grade
                })
            });
            if (res.ok) {
                setAcademicRecords(prev => prev.map(r => r.id === editingCourse.id ? {
                    ...r,
                    course_name: data.course_name,
                    sks: data.sks,
                    grade: data.grade
                } : r));
            }
        } catch(e) {}
    };

    const handleDeleteCourse = async (id: number | string) => {
        if (confirm(`Hapus ${terms.course} ini?`)) {
            // Optimistic update
            setAcademicRecords(prev => prev.filter(r => r.id !== id));
            if (selectedCourse?.id === id) setSelectedCourse(null);
            
            // DB Sync
            await fetch(`/api/study/courses?id=${id}`, { method: 'DELETE' });
        }
    };

    const handleAddArchive = async (archive: ArchiveItem) => {
        if (!activeCourseReactive) return;
        try {
            const res = await fetch('/api/study/archives', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: activeCourseReactive.id,
                    meetingTag: archive.meeting_tag,
                    type: archive.type,
                    fileName: archive.file_name,
                    filePath: archive.file_path,
                    linkUrl: archive.link_url
                })
            });
            
            if (res.ok) {
                const newArchive = await res.json();
                setAcademicRecords(prev => prev.map(r => {
                    if (r.id === activeCourseReactive.id) {
                        return {
                            ...r,
                            archives: [...(r.archives || []), {
                                id: newArchive.id,
                                meeting_tag: newArchive.meetingTag,
                                type: newArchive.type,
                                file_name: newArchive.fileName,
                                file_path: newArchive.filePath,
                                link_url: newArchive.linkUrl
                            }]
                        };
                    }
                    return r;
                }));
            }
        } catch(e) {}
    };

    const handleDeleteArchive = async (id: number | string) => {
        if (!activeCourseReactive) return;
        
        // Optimistic update
        setAcademicRecords(prev => prev.map(r => {
            if (r.id === activeCourseReactive.id) {
                return {
                    ...r,
                    archives: (r.archives || []).filter(a => a.id !== id)
                };
            }
            return r;
        }));
        
        // DB Sync
        await fetch(`/api/study/archives?id=${id}`, { method: 'DELETE' });
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
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
