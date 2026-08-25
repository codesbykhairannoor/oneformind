'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';

interface SemesterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (semesterNum: number) => void;
}

export default function SemesterModal({
    isOpen,
    onClose,
    onSubmit
}: SemesterModalProps) {
    const t = useTranslations();
    const [semesterVal, setSemesterVal] = useState<number | string>('');

    useEffect(() => {
        if (isOpen) {
            setSemesterVal('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = Number(semesterVal);
        if (parsed > 0) {
            onSubmit(parsed);
        }
    };

    return (
        // 1:1 from SemesterModal.vue line 30-52
        <ModalPortal><div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">
                        {t('study_add_new_semester_title') || 'Tambah Semester Baru'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {t('study_add_new_semester_text') || 'Masukkan nomor semester yang ingin Anda tambahkan (contoh: 7)'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-black tracking-wide text-slate-500 mb-1.5">
                            {t('study_semester_label') || 'Semester'} *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={semesterVal}
                            onChange={(e) => setSemesterVal(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg transition-all mt-2"
                    >
                        {t('study_continue') || 'Lanjutkan'}
                    </button>
                </form>
            </div>
        </div></ModalPortal>
    );
}
