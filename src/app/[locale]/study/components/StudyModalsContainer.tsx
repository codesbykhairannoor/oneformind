'use client';

import React from 'react';
import SemesterModal from './SemesterModal';
import CourseModal from './CourseModal';
import ArchiveModal from './ArchiveModal';
import { CourseRecord } from './CourseCard';
import { ArchiveItem } from './ClassroomView';

interface StudyModalsContainerProps {
    terms: any;
    selectedSemester: number;
    isAddSemesterModalOpen: boolean;
    onCloseAddSemesterModal: () => void;
    onAddSemesterSubmit: (num: number) => void;
    isAddCourseModalOpen: boolean;
    onCloseAddCourseModal: () => void;
    onAddCourseSubmit: (data: { course_name: string; sks: number; grade: string }) => void;
    isEditCourseModalOpen: boolean;
    editingCourse: CourseRecord | null;
    onCloseEditCourseModal: () => void;
    onEditCourseSubmit: (data: { course_name: string; sks: number; grade: string }) => void;
    activeCourseReactive: CourseRecord | null;
    isAddArchiveModalOpen: boolean;
    prefillArchiveTag: string;
    onCloseAddArchiveModal: () => void;
    onAddArchiveSubmit: (archive: ArchiveItem) => void;
}

export default function StudyModalsContainer({
    terms,
    selectedSemester,
    isAddSemesterModalOpen,
    onCloseAddSemesterModal,
    onAddSemesterSubmit,
    isAddCourseModalOpen,
    onCloseAddCourseModal,
    onAddCourseSubmit,
    isEditCourseModalOpen,
    editingCourse,
    onCloseEditCourseModal,
    onEditCourseSubmit,
    activeCourseReactive,
    isAddArchiveModalOpen,
    prefillArchiveTag,
    onCloseAddArchiveModal,
    onAddArchiveSubmit
}: StudyModalsContainerProps) {
    return (
        <>
            <SemesterModal
                isOpen={isAddSemesterModalOpen}
                onClose={onCloseAddSemesterModal}
                onSubmit={onAddSemesterSubmit}
            />

            <CourseModal
                isOpen={isAddCourseModalOpen}
                isEdit={false}
                terms={terms}
                selectedSemester={selectedSemester}
                onClose={onCloseAddCourseModal}
                onSubmit={onAddCourseSubmit}
            />

            <CourseModal
                isOpen={isEditCourseModalOpen}
                isEdit={true}
                course={editingCourse}
                terms={terms}
                selectedSemester={selectedSemester}
                onClose={onCloseEditCourseModal}
                onSubmit={onEditCourseSubmit}
            />

            {activeCourseReactive && (
                <ArchiveModal
                    isOpen={isAddArchiveModalOpen}
                    prefillTag={prefillArchiveTag}
                    course={activeCourseReactive}
                    terms={terms}
                    onClose={onCloseAddArchiveModal}
                    onAddArchive={onAddArchiveSubmit}
                />
            )}
        </>
    );
}
