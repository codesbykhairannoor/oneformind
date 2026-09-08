'use client';

import React from 'react';
import ModalPortal from '@/components/ModalPortal';
import { LogOut } from 'lucide-react';

interface AuthLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function AuthLogoutModal({ isOpen, onClose, onLogout }: AuthLogoutModalProps) {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60" onClick={onClose} />
                <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <LogOut size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                            Keluar Akun?
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                            Sesi Anda akan diakhiri.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={onLogout}
                            className="w-full bg-rose-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 active:scale-[0.98] transition-all"
                        >
                            Ya, Keluar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
