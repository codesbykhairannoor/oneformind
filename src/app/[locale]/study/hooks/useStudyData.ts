import { useState, useMemo, useEffect } from 'react';
import { CourseRecord } from '../components/CourseCard';
import { ArchiveItem } from '../components/ClassroomView';
import { AssignmentItem } from '../components/AssignmentRadar';
import { FlashcardItem } from '../components/FlashcardsDeckView';
import { BookItem, ReadingGoal } from '../types/books';

export function useStudyData(t: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [userSettings, setUserSettings] = useState<Record<string, any>>({});
    const [rawUserData, setRawUserData] = useState<Record<string, any>>({});
    const hasCompletedSetup = Boolean(userSettings.education_level);
    const [academicRecords, setAcademicRecords] = useState<CourseRecord[]>([]);

    // Supabase-synced Study Modules
    const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
    const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
    const [books, setBooks] = useState<BookItem[]>([]);
    const [readingGoal, setReadingGoal] = useState<ReadingGoal>({ year: 2026, target_books: 20 });
    const [focusStats, setFocusStats] = useState<{ completedSessions: number; totalFocusMinutes: number }>({
        completedSessions: 0,
        totalFocusMinutes: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, coursesRes] = await Promise.all([
                    fetch('/api/user'),
                    fetch('/api/study/courses')
                ]);
                
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setRawUserData(userData);
                    if (userData.settings) {
                        if (userData.settings.study) {
                            setUserSettings(userData.settings.study);
                        }
                        if (Array.isArray(userData.settings.study_assignments)) {
                            setAssignments(userData.settings.study_assignments);
                        }
                        if (Array.isArray(userData.settings.study_flashcards)) {
                            setFlashcards(userData.settings.study_flashcards);
                        }
                        if (Array.isArray(userData.settings.study_books)) {
                            setBooks(userData.settings.study_books);
                        }
                        if (userData.settings.study_reading_goal) {
                            setReadingGoal(userData.settings.study_reading_goal);
                        }
                        if (userData.settings.study_focus_stats) {
                            setFocusStats(userData.settings.study_focus_stats);
                        }
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
                        archives: (c.archives || []).map((a: any) => ({
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
                console.error("Failed to load study data from Supabase", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

    // Generic Supabase user settings saver
    const saveToSupabaseSettings = async (partialKey: string, value: any) => {
        try {
            const userRes = await fetch('/api/user');
            if (userRes.ok) {
                const userData = await userRes.json();
                const newSettings = { ...userData.settings, [partialKey]: value };
                await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings: newSettings })
                });
            }
        } catch (error) {
            console.error(`Failed to save ${partialKey} to Supabase:`, error);
        }
    };

    const saveUserSettings = async (updatedSettings: Record<string, any>) => {
        setUserSettings(updatedSettings);
        await saveToSupabaseSettings('study', updatedSettings);
    };

    const handleSaveAssignments = async (newAssignments: AssignmentItem[]) => {
        setAssignments(newAssignments);
        await saveToSupabaseSettings('study_assignments', newAssignments);
    };

    const handleSaveFlashcards = async (newFlashcards: FlashcardItem[]) => {
        setFlashcards(newFlashcards);
        await saveToSupabaseSettings('study_flashcards', newFlashcards);
    };

    const handleSaveBooks = async (newBooks: BookItem[]) => {
        setBooks(newBooks);
        await saveToSupabaseSettings('study_books', newBooks);
    };

    const handleSaveReadingGoal = async (newGoal: ReadingGoal) => {
        setReadingGoal(newGoal);
        await saveToSupabaseSettings('study_reading_goal', newGoal);
    };

    const handleSaveFocusStats = async (newStats: { completedSessions: number; totalFocusMinutes: number }) => {
        setFocusStats(newStats);
        await saveToSupabaseSettings('study_focus_stats', newStats);
    };

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

    const filteredCourses = useMemo(() => {
        return academicRecords.filter(r => Number(r.semester) === Number(selectedSemester));
    }, [academicRecords, selectedSemester]);

    const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);

    const activeCourseReactive = useMemo(() => {
        if (!selectedCourse) return null;
        return academicRecords.find(r => r.id === selectedCourse.id) || null;
    }, [selectedCourse, academicRecords]);

    const handleSetupCompleted = (level: string, settingsData: Record<string, any>) => {
        saveUserSettings(settingsData);
    };

    const handleAddSemester = (num: number) => {
        setManuallyAddedSemesters(prev => [...prev, num]);
        setSelectedSemester(num);
    };

    const handleDeleteSemester = async (sem: number | string) => {
        if (confirm(`Yakin ingin menghapus ${terms.semester} ${sem} beserta seluruh data mata kuliah di dalamnya?`)) {
            const toDelete = academicRecords.filter(r => Number(r.semester) === Number(sem));
            
            const updated = academicRecords.filter(r => Number(r.semester) !== Number(sem));
            setAcademicRecords(updated);
            
            setManuallyAddedSemesters(prev => prev.filter(s => s !== Number(sem)));
            if (Number(selectedSemester) === Number(sem)) {
                const remaining = availableSemesters.filter(s => s !== Number(sem));
                setSelectedSemester(remaining.length > 0 ? remaining[0] : 1);
            }

            for (const course of toDelete) {
                await fetch(`/api/study/courses?id=${course.id}`, { method: 'DELETE' });
            }
        }
    };

    const handleAddCourseSubmit = async (data: { course_name: string; sks: number; grade: string }) => {
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
        } catch(e) {
            console.error("Failed to add course to Supabase", e);
        }
    };

    const handleEditCourseSubmit = async (courseId: number | string, data: { course_name: string; sks: number; grade: string }) => {
        try {
            const res = await fetch('/api/study/courses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: courseId,
                    courseName: data.course_name,
                    semester: Number(selectedSemester),
                    sks: data.sks,
                    grade: data.grade
                })
            });
            if (res.ok) {
                setAcademicRecords(prev => prev.map(r => r.id === courseId ? {
                    ...r,
                    course_name: data.course_name,
                    sks: data.sks,
                    grade: data.grade
                } : r));
            }
        } catch(e) {
            console.error("Failed to update course in Supabase", e);
        }
    };

    const handleBatchEditGrades = async (updates: { id: number | string; grade: string }[]) => {
        try {
            await Promise.all(updates.map(u => {
                const course = academicRecords.find(c => String(c.id) === String(u.id));
                if (!course) return Promise.resolve();
                return fetch('/api/study/courses', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: u.id,
                        courseName: course.course_name,
                        semester: course.semester,
                        sks: course.sks,
                        grade: u.grade
                    })
                });
            }));

            setAcademicRecords(prev => prev.map(c => {
                const up = updates.find(u => String(u.id) === String(c.id));
                return up ? { ...c, grade: up.grade } : c;
            }));
        } catch (e) {
            console.error('Failed to batch update course grades', e);
        }
    };

    const handleDeleteCourse = async (id: number | string) => {
        if (confirm(`Hapus ${terms.course} ini?`)) {
            setAcademicRecords(prev => prev.filter(r => r.id !== id));
            if (selectedCourse?.id === id) setSelectedCourse(null);
            
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
        } catch(e) {
            console.error("Failed to add archive to Supabase", e);
        }
    };

    const handleDeleteArchive = async (id: number | string) => {
        if (!activeCourseReactive) return;
        
        setAcademicRecords(prev => prev.map(r => {
            if (r.id === activeCourseReactive.id) {
                return {
                    ...r,
                    archives: (r.archives || []).filter(a => a.id !== id)
                };
            }
            return r;
        }));
        
        await fetch(`/api/study/archives?id=${id}`, { method: 'DELETE' });
    };

    return {
        isLoading,
        userSettings,
        rawUserData,
        hasCompletedSetup,
        terms,
        selectedSemester,
        setSelectedSemester,
        availableSemesters,
        filteredCourses,
        allCourses: academicRecords,
        selectedCourse,
        setSelectedCourse,
        activeCourseReactive,
        assignments,
        flashcards,
        books,
        readingGoal,
        focusStats,
        handleSaveAssignments,
        handleSaveFlashcards,
        handleSaveBooks,
        handleSaveReadingGoal,
        handleSaveFocusStats,
        handleSetupCompleted,
        handleAddSemester,
        handleDeleteSemester,
        handleAddCourseSubmit,
        handleEditCourseSubmit,
        handleDeleteCourse,
        handleAddArchive,
        handleDeleteArchive,
        handleBatchEditGrades,
        saveUserSettings
    };
}
