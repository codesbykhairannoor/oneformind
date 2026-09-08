'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AcademicHeader from './components/AcademicHeader';
import AcademicSetup from './components/AcademicSetup';
import ClassroomView from './components/ClassroomView';
import StudyCourseList from './components/StudyCourseList';
import StudyModalsContainer from './components/StudyModalsContainer';
import { useStudyData } from './hooks/useStudyData';
import { CourseRecord } from './components/CourseCard';
import { Loader2 } from 'lucide-react';

export default function StudyPage() {
    const t = useTranslations();
    const {
        isLoading,
        userSettings,
        hasCompletedSetup,
        terms,
        selectedSemester,
        setSelectedSemester,
        availableSemesters,
        filteredCourses,
        setSelectedCourse,
        activeCourseReactive,
        handleSetupCompleted,
        handleAddSemester,
        handleDeleteSemester,
        handleAddCourseSubmit,
        handleEditCourseSubmit,
        handleDeleteCourse,
        handleAddArchive,
        handleDeleteArchive
    } = useStudyData(t);

    // Modals visibility state
    const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
    const [isAddArchiveModalOpen, setIsAddArchiveModalOpen] = useState(false);
    const [prefillArchiveTag, setPrefillArchiveTag] = useState('');

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

                                <StudyCourseList
                                    t={t}
                                    terms={terms}
                                    selectedSemester={selectedSemester}
                                    filteredCourses={filteredCourses}
                                    onSelectCourse={(c) => setSelectedCourse(c)}
                                    onEditCourse={(c) => { setEditingCourse(c); setIsEditCourseModalOpen(true); }}
                                    onDeleteCourse={handleDeleteCourse}
                                    onDeleteSemester={handleDeleteSemester}
                                    onAddCourseClick={() => setIsAddCourseModalOpen(true)}
                                />
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

                        <StudyModalsContainer
                            terms={terms}
                            selectedSemester={selectedSemester}
                            isAddSemesterModalOpen={isAddSemesterModalOpen}
                            onCloseAddSemesterModal={() => setIsAddSemesterModalOpen(false)}
                            onAddSemesterSubmit={(num) => { handleAddSemester(num); setIsAddSemesterModalOpen(false); }}
                            isAddCourseModalOpen={isAddCourseModalOpen}
                            onCloseAddCourseModal={() => setIsAddCourseModalOpen(false)}
                            onAddCourseSubmit={(data) => { handleAddCourseSubmit(data); setIsAddCourseModalOpen(false); }}
                            isEditCourseModalOpen={isEditCourseModalOpen}
                            editingCourse={editingCourse}
                            onCloseEditCourseModal={() => setIsEditCourseModalOpen(false)}
                            onEditCourseSubmit={(data) => { if (editingCourse) { handleEditCourseSubmit(editingCourse.id, data); setIsEditCourseModalOpen(false); } }}
                            activeCourseReactive={activeCourseReactive}
                            isAddArchiveModalOpen={isAddArchiveModalOpen}
                            prefillArchiveTag={prefillArchiveTag}
                            onCloseAddArchiveModal={() => setIsAddArchiveModalOpen(false)}
                            onAddArchiveSubmit={handleAddArchive}
                        />
                    </>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
