'use client';

import { useState } from 'react';
import ModalPortal from './ModalPortal';

interface GoogleAccount {
    name: string;
    email: string;
    avatar?: string;
}

interface GoogleAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAccount: (account: GoogleAccount) => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount }: GoogleAuthModalProps) {
    const [customEmail, setCustomEmail] = useState('');
    const [customName, setCustomName] = useState('');
    const [isAddingAccount, setIsAddingAccount] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    if (!isOpen) return null;

    const defaultAccounts: GoogleAccount[] = [
        {
            name: 'Khairan Noor',
            email: 'khairannoor@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        },
        {
            name: 'Google User',
            email: 'user.google@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        }
    ];

    const handlePickAccount = (acc: GoogleAccount) => {
        setIsLoggingIn(true);
        setTimeout(() => {
            onSelectAccount(acc);
        }, 400);
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customEmail.trim() || !customEmail.includes('@')) return;
        const nameFromEmail = customName.trim() || customEmail.split('@')[0].replace('.', ' ');
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        
        setIsLoggingIn(true);
        setTimeout(() => {
            onSelectAccount({
                name: formattedName,
                email: customEmail.trim(),
                avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            });
        }, 400);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden transition-all">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            <span className="font-bold text-sm text-slate-800 dark:text-white">Login dengan Google</span>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Pilih Akun Google</h2>
                        <p className="text-xs text-slate-500">untuk melanjutkan ke <strong className="text-indigo-600 dark:text-indigo-400">OneForMind Productivity OS</strong></p>
                    </div>

                    {isLoggingIn ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Menghubungkan ke Akun Google...</p>
                        </div>
                    ) : !isAddingAccount ? (
                        <div className="space-y-3">
                            {defaultAccounts.map((acc) => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => handlePickAccount(acc)}
                                    className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                                        {acc.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {acc.name}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setIsAddingAccount(true)}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                                    +
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Gunakan akun Google lain</p>
                                    <p className="text-xs text-slate-400">Masuk dengan alamat gmail baru</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCustomSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Google (@gmail.com)</label>
                                <input
                                    type="email"
                                    required
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    placeholder="nama@gmail.com"
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Tampilan Google (Opsional)</label>
                                <input
                                    type="text"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    placeholder="Nama Lengkap"
                                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAccount(false)}
                                    className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                                >
                                    Lanjutkan Login Google
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center leading-relaxed">
                        OneForMind akan menerima nama, alamat email, dan foto profil Anda sesuai Kebijakan Privasi Google.
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
