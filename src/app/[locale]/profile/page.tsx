'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSession } from 'next-auth/react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ModalPortal from '@/components/ModalPortal';
import {
    User,
    Mail,
    Shield,
    Save,
    Crown,
    Key,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Camera,
    Sparkles,
    Check,
    X,
    Lock
} from 'lucide-react';

export default function ProfilePage() {
    const t = useTranslations();

    // 1. Profile Main State
    const [name, setName] = useState('Alexander Supriyadi');
    const [email, setEmail] = useState('alexander@tranvas.com');
    const [headline, setHeadline] = useState('Senior Software Architect & Neural OS Enthusiast');
    const [bio, setBio] = useState('Fokus pada pengembangan sistem terdistribusi, produktivitas berbasis habit, dan otomasi AI.');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Save alert state
    const [profileSaved, setProfileSaved] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Delete Account Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    // 2. Load NextAuth Session
    const { data: session, status } = useSession();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            if (session.user.name) setName(session.user.name);
            if (session.user.email) setEmail(session.user.email);
            if (session.user.image) setAvatarUrl(session.user.image);
        }
        
        // Still load mock data for fields not supported by default NextAuth (headline, bio)
        const saved = localStorage.getItem('tranvas_user_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.headline) setHeadline(parsed.headline);
                if (parsed.bio) setBio(parsed.bio);
                if (!session?.user?.image && parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
            } catch (e) {
                console.error(e);
            }
        }
        setIsLoaded(true);
    }, [session, status]);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tranvas_user_profile', JSON.stringify({
                headline, bio, avatarUrl
            }));
        }
    }, [headline, bio, avatarUrl, isLoaded]);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setPasswordAlert({ type: 'error', text: 'Password baru minimal 6 karakter.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordAlert({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
            return;
        }
        setPasswordAlert({ type: 'success', text: 'Password berhasil diperbarui!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordAlert(null), 3000);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setAvatarUrl(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-4 md:p-8 transition-colors duration-500">
                <div className="max-w-[1000px] mx-auto space-y-6">
                    
                    {/* PROFILE HEADER CARD */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            
                            {/* Avatar Picker */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-xl overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        name.charAt(0)
                                    )}
                                </div>
                                <label htmlFor="avatarInput" className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition">
                                    <Camera size={14} />
                                    <input type="file" id="avatarInput" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                                </label>
                            </div>

                            <div className="space-y-1 text-center sm:text-left flex-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h1>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200">
                                        <Crown size={12} className="text-amber-500" /> Architect Tier
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{headline}</p>
                                <p className="text-xs text-slate-400 font-medium max-w-md pt-1">{bio}</p>
                            </div>

                        </div>
                    </div>

                    {/* PREMIUM SUBSCRIPTION STATUS CARD */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                                <Sparkles size={12} /> Status Keanggotaan Active
                            </div>
                            <h3 className="text-xl font-black text-white">Pro Neural OS — Akses Penuh</h3>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1 font-medium">
                                <span className="flex items-center gap-1"><Check size={14} className="text-emerald-400" /> Modul Habits, Planner, & Finance</span>
                                <span className="flex items-center gap-1"><Check size={14} className="text-emerald-400" /> Neural AI Coach Uncapped Token</span>
                            </div>
                        </div>
                    </div>

                    {/* EDIT PROFILE FORM CARD */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <User size={18} className="text-indigo-600" />
                                Informasi Detail Profil
                            </h3>
                            {profileSaved && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg">
                                    ✓ Perubahan Profil Tersimpan!
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Alamat Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Headline Profesinya</label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Misal: Senior Software Architect..."
                                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-xs text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Bio Singkat</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-xs text-slate-800 dark:text-white focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg transition active:scale-95 flex items-center gap-2"
                            >
                                <Save size={16} />
                                <span>Simpan Perubahan Profil</span>
                            </button>
                        </form>
                    </div>

                    {/* UPDATE PASSWORD CARD */}
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Key size={18} className="text-indigo-600" />
                                Ubah Password
                            </h3>
                        </div>

                        {passwordAlert && (
                            <div className={`p-3 rounded-xl text-xs font-bold ${
                                passwordAlert.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {passwordAlert.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password Saat Ini</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm outline-none focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password Baru</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition"
                            >
                                Perbarui Password
                            </button>
                        </form>
                    </div>

                    {/* DANGER ZONE: DELETE ACCOUNT CARD */}
                    <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 md:p-8 rounded-[2.5rem] border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                            <AlertTriangle size={20} />
                            <h3 className="text-base font-black">Zona Bahaya (Danger Zone)</h3>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Setelah akun Anda dihapus, seluruh data habit, catatan planner, arus kas keuangan, dan jurnal akan dihapus secara permanen.
                        </p>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            <span>Hapus Akun Permanen</span>
                        </button>
                    </div>

                </div>

                {/* DELETE ACCOUNT CONFIRMATION MODAL */}
                {showDeleteModal && (
                    <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-950/50 " onClick={() => setShowDeleteModal(false)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 w-full max-w-md relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
                            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl">⚠️</div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Apakah Anda Yakin?</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ketik <span className="font-mono font-bold text-rose-600">HAPUS AKUN</span> di bawah untuk mengonfirmasi penghapusan permanen.
                            </p>

                            <input
                                type="text"
                                value={deleteConfirmationText}
                                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                placeholder="Tulis HAPUS AKUN..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-center outline-none"
                            />

                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition">Batal</button>
                                <button
                                    onClick={() => {
                                        if (deleteConfirmationText === 'HAPUS AKUN') {
                                            localStorage.clear();
                                            window.location.href = '/login';
                                        }
                                    }}
                                    disabled={deleteConfirmationText !== 'HAPUS AKUN'}
                                    className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-md transition disabled:opacity-40"
                                >
                                    Konfirmasi Hapus
                                </button>
                            </div>
                        </div>
                    </div></ModalPortal>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
