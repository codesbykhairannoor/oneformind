'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X, Upload, Link2 } from 'lucide-react';
import { CourseRecord } from './CourseCard';
import { ArchiveItem } from './ClassroomView';
import ModalPortal from '@/components/ModalPortal';

interface ArchiveModalProps {
    isOpen: boolean;
    prefillTag?: string;
    course: CourseRecord;
    terms: Record<string, string>;
    onClose: () => void;
    onAddArchive: (archive: ArchiveItem) => void;
}

export default function ArchiveModal({
    isOpen,
    prefillTag = '',
    course,
    terms,
    onClose,
    onAddArchive
}: ArchiveModalProps) {
    const t = useTranslations();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [meetingTag, setMeetingTag] = useState(prefillTag || '');
    const [type, setType] = useState('Modul');
    const [linkUrl, setLinkUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            setMeetingTag(prefillTag || '');
            setType('Modul');
            setLinkUrl('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen, prefillTag]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!meetingTag.trim()) {
            alert(t('study_meeting_tag_empty_alert') || 'Nama/Tag Pertemuan tidak boleh kosong.');
            return;
        }

        if (!selectedFile && !linkUrl.trim()) {
            alert(t('study_archive_file_or_link_alert') || 'Pilih berkas PDF atau masukkan Link URL.');
            return;
        }

        const newArchive: ArchiveItem = {
            id: 'temp_arc_' + Date.now(),
            academic_record_id: course.id,
            file_name: selectedFile ? selectedFile.name : undefined,
            file_path: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
            link_url: linkUrl.trim() || undefined,
            meeting_tag: meetingTag.trim(),
            type: type
        };

        onAddArchive(newArchive);
        onClose();
    };

    return (
        // 1:1 from ArchiveModal.vue line 81-137
        <ModalPortal><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                
                <div className="mb-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                        <Upload className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">
                            {t('study_input_material') || 'Input Berkas & Materi'}
                        </h3>
                        <p className="text-xs text-slate-500 capitalize">{course.course_name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[11px] font-black capitalize tracking-wide text-slate-500 mb-1.5">
                            {t('study_meeting_tag_label') || `Tag / Judul ${terms.meeting || 'Pertemuan'}`}
                        </label>
                        <input
                            type="text"
                            value={meetingTag}
                            onChange={(e) => setMeetingTag(e.target.value)}
                            placeholder={`Contoh: Pertemuan 01 - Pengenalan ${course.course_name}`}
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-black capitalize tracking-wide text-slate-500 mb-1.5">
                                {t('study_content_type') || 'Tipe Berkas'}
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                            >
                                <option value="Modul">{t('study_type_modul') || 'Modul'}</option>
                                <option value="Soal">{t('study_type_soal') || 'Soal'}</option>
                                <option value="Jawaban">{t('study_type_jawaban') || 'Jawaban'}</option>
                                <option value="Referensi">{t('study_type_referensi') || 'Referensi'}</option>
                                <option value="Catatan">{t('study_type_catatan') || 'Catatan'}</option>
                            </select>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[11px] font-black capitalize tracking-wide text-slate-500 mb-1.5">
                                {t('study_upload_pdf') || 'Upload PDF'}
                            </label>
                            <input
                                ref={fileInputRef}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                type="file"
                                accept=".pdf"
                                className="w-full text-xs file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-indigo-100 file:text-indigo-700 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-1.5 px-2 cursor-pointer text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black capitalize tracking-wide text-slate-500 mb-1.5">
                            {t('study_or_link') || 'Atau Sisipkan Link URL'}
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://drive.google.com/..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg transition-all mt-4"
                    >
                        {t('study_upload_save') || 'Unggah & Simpan'}
                    </button>
                </form>
            </div>
        </div></ModalPortal>
    );
}
