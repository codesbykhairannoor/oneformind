'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import AcademicHeader, { StudyActiveTab } from './components/AcademicHeader';
import AcademicSetup from './components/AcademicSetup';
import ClassroomView from './components/ClassroomView';
import StudyCourseList from './components/StudyCourseList';
import StudyModalsContainer from './components/StudyModalsContainer';
import GpaSimulator from './components/GpaSimulator';
import AssignmentRadar from './components/AssignmentRadar';
import StudyFocusRoom from './components/StudyFocusRoom';
import FlashcardsDeckView from './components/FlashcardsDeckView';
import BookTracker from './components/BookTracker';
import StudyPortfolioView from './components/StudyPortfolioView';
import { useStudyData } from './hooks/useStudyData';
import { CourseRecord } from './components/CourseCard';
import { Loader2 } from 'lucide-react';
import ExportModal from '@/components/export/ExportModal';

export default function StudyPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const {
        isLoading,
        userSettings,
        rawUserData,
        hasCompletedSetup,
        terms,
        selectedSemester,
        setSelectedSemester,
        availableSemesters,
        filteredCourses,
        allCourses,
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
    } = useStudyData(t);

    // Active tab in Study Hub
    const [activeTab, setActiveTab] = useState<StudyActiveTab>('courses');

    // Sync tab from URL search params if present
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab') as StudyActiveTab;
            if (tab && ['courses', 'assignments', 'focus', 'flashcards', 'books', 'portfolio'].includes(tab)) {
                setActiveTab(tab);
            }
        }
    }, []);

    // Modals visibility state
    const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
    const [isAddArchiveModalOpen, setIsAddArchiveModalOpen] = useState(false);
    const [prefillArchiveTag, setPrefillArchiveTag] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);

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
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 transition-colors font-sans">
                
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
                                    activeTab={activeTab}
                                    onSelectTab={setActiveTab}
                                    onSelectSemester={setSelectedSemester}
                                    onDeleteSpecificSemester={handleDeleteSemester}
                                    onAddSemesterClick={() => setIsAddSemesterModalOpen(true)}
                                    onAddCourseClick={() => setIsAddCourseModalOpen(true)}
                                    onOpenExportModal={() => setIsExportOpen(true)}
                                />

                                <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                                    
                                    {/* Interactive GPA Simulator Banner (hidden on portfolio tab for clean layout) */}
                                    {activeTab !== 'portfolio' && (
                                        <GpaSimulator
                                            courses={filteredCourses}
                                            allCourses={allCourses}
                                            terms={terms}
                                            userSettings={userSettings}
                                            onSaveBatchCourseGrades={handleBatchEditGrades}
                                            onSaveUserSettings={saveUserSettings}
                                        />
                                    )}

                                    {/* Active Tab View */}
                                    {activeTab === 'courses' && (
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
                                    )}

                                    {activeTab === 'assignments' && (
                                        <AssignmentRadar
                                            courses={filteredCourses}
                                            terms={terms}
                                            assignments={assignments}
                                            onSaveAssignments={handleSaveAssignments}
                                        />
                                    )}

                                    {activeTab === 'focus' && (
                                        <StudyFocusRoom
                                            courses={filteredCourses}
                                            terms={terms}
                                            focusStats={focusStats}
                                            onSaveFocusStats={handleSaveFocusStats}
                                        />
                                    )}

                                    {activeTab === 'flashcards' && (
                                        <FlashcardsDeckView
                                            courses={filteredCourses}
                                            terms={terms}
                                            cards={flashcards}
                                            onSaveFlashcards={handleSaveFlashcards}
                                        />
                                    )}

                                    {activeTab === 'books' && (
                                        <BookTracker
                                            courses={filteredCourses}
                                            terms={terms}
                                            books={books}
                                            readingGoal={readingGoal}
                                            onSaveBooks={handleSaveBooks}
                                            onSaveGoal={handleSaveReadingGoal}
                                        />
                                    )}

                                    {activeTab === 'portfolio' && (
                                        <StudyPortfolioView />
                                    )}

                                </main>
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

                        {/* EXPORT STUDY DATA MODAL */}
                        <ExportModal
                            isOpen={isExportOpen}
                            onClose={() => setIsExportOpen(false)}
                            moduleType="study"
                            currentData={allCourses}
                        />
                    </>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
