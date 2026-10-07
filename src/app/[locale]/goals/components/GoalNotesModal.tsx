'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { 
    X, BookOpen, Compass, Award, ShieldAlert, 
    Save, Sparkles, Check, AlertCircle, Loader2,
    Calendar, ArrowRight, PlusCircle, CheckCircle2
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { GoalItem, calculateGoalProgress } from '../lib/goalPaceCalculator';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface GoalNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: GoalItem | null;
    onSaveNotes: (
        goal: GoalItem, 
        updatedNotes: string, 
        updatedWoop?: { core_why?: string; obstacle?: string; obstacle_plan?: string; reward?: string }
    ) => Promise<void>;
}

export default function GoalNotesModal({
    isOpen,
    onClose,
    goal,
    onSaveNotes
}: GoalNotesModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [activeTab, setActiveTab] = useState<'notes' | 'woop'>('notes');
    
    // Notes state
    const [notes, setNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [notesSaveSuccess, setNotesSaveSuccess] = useState(false);

    // WOOP state
    const [coreWhy, setCoreWhy] = useState('');
    const [obstacle, setObstacle] = useState('');
    const [obstaclePlan, setObstaclePlan] = useState('');
    const [reward, setReward] = useState('');
    const [isSavingWoop, setIsSavingWoop] = useState(false);
    const [woopSaveSuccess, setWoopSaveSuccess] = useState(false);

    // Sync to Journal state
    const [isJournalSyncOpen, setIsJournalSyncOpen] = useState(false);
    const [journalMode, setJournalMode] = useState<'new' | 'existing'>('new');
    const [newJournalTitle, setNewJournalTitle] = useState('');
    const [newJournalMood, setNewJournalMood] = useState('awesome');
    const [selectedExistingJournalId, setSelectedExistingJournalId] = useState<string | number>('');
    const [isSyncingJournal, setIsSyncingJournal] = useState(false);
    const [journalSyncMessage, setJournalSyncMessage] = useState<string | null>(null);

    // Fetch existing journals for Option B
    const { data: rawJournals, mutate: mutateJournals } = useSWR(
        isJournalSyncOpen ? '/api/journals' : null, 
        fetcher
    );

    const existingJournals = useMemo(() => {
        if (!rawJournals || !Array.isArray(rawJournals)) return [];
        return rawJournals.map((j: any) => ({
            id: j.id,
            title: j.title || (isIndo ? 'Jurnal Tanpa Judul' : 'Untitled Journal'),
            content: j.content || '',
            date: j.date || j.created_at || '',
            mood: j.mood || 'awesome'
        }));
    }, [rawJournals, isIndo]);

    // Initialize inputs when goal changes
    useEffect(() => {
        if (goal) {
            setNotes(goal.notes || '');
            setCoreWhy(goal.core_why || '');
            setObstacle(goal.obstacle || '');
            setObstaclePlan(goal.obstacle_plan || '');
            setReward(goal.reward || '');
            setNewJournalTitle(isIndo ? `Refleksi Target: ${goal.title}` : `Goal Reflection: ${goal.title}`);
        }
    }, [goal, isIndo]);

    if (!isOpen || !goal) return null;

    const progress = calculateGoalProgress(goal);

    // Save Notes handler
    const handleSaveNotes = async () => {
        setIsSavingNotes(true);
        setNotesSaveSuccess(false);
        try {
            await onSaveNotes(goal, notes);
            setNotesSaveSuccess(true);
            setTimeout(() => setNotesSaveSuccess(false), 2500);
        } catch (err) {
            console.error('Failed to save notes:', err);
        } finally {
            setIsSavingNotes(false);
        }
    };

    // Save WOOP handler
    const handleSaveWoop = async () => {
        setIsSavingWoop(true);
        setWoopSaveSuccess(false);
        try {
            await onSaveNotes(goal, notes, {
                core_why: coreWhy,
                obstacle: obstacle,
                obstacle_plan: obstaclePlan,
                reward: reward
            });
            setWoopSaveSuccess(true);
            setTimeout(() => setWoopSaveSuccess(false), 2500);
        } catch (err) {
            console.error('Failed to save WOOP:', err);
        } finally {
            setIsSavingWoop(false);
        }
    };

    // Sync to Journal handler (album logic: new vs existing)
    const handleExecuteJournalSync = async () => {
        if (!notes.trim()) {
            alert(isIndo ? 'Tulis catatan terlebih dahulu sebelum dikirim ke jurnal!' : 'Write some notes before syncing to journal!');
            return;
        }

        setIsSyncingJournal(true);
        setJournalSyncMessage(null);

        try {
            const dateStr = new Date().toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const formattedGoalSnippet = `\n\n---\n🎯 **${isIndo ? 'Catatan Refleksi Target' : 'Goal Reflection Note'}: ${goal.title}**\n📊 **${isIndo ? 'Progres' : 'Progress'}**: ${progress}%\n📅 **${isIndo ? 'Tanggal' : 'Date'}**: ${dateStr}\n\n${notes.trim()}\n---`;

            if (journalMode === 'new') {
                // Option A: Create New Journal
                const finalTitle = newJournalTitle.trim() || (isIndo ? `Refleksi Target: ${goal.title}` : `Goal Reflection: ${goal.title}`);
                const fullContent = `${isIndo ? 'Merekam perkembangan dan refleksi untuk pencapaian target:' : 'Recording progress and reflection for goal achievement:'} **${goal.title}**.\n${formattedGoalSnippet}`;

                const res = await fetch('/api/journals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: finalTitle,
                        content: fullContent,
                        date: new Date().toISOString(),
                        mood: newJournalMood,
                        imagePath: '',
                        image_url: '',
                        aiSentiment: ''
                    })
                });

                if (res.ok) {
                    setJournalSyncMessage(isIndo ? '✅ Berhasil membuat entri jurnal baru!' : '✅ Successfully created new journal entry!');
                    mutateJournals();
                    setTimeout(() => {
                        setIsJournalSyncOpen(false);
                        setJournalSyncMessage(null);
                    }, 1800);
                } else {
                    throw new Error('Failed to create journal');
                }
            } else {
                // Option B: Append to Existing Journal
                if (!selectedExistingJournalId) {
                    alert(isIndo ? 'Silakan pilih entri jurnal yang ingin ditambahkan!' : 'Please select an existing journal entry!');
                    setIsSyncingJournal(false);
                    return;
                }

                const targetJournal = existingJournals.find(j => String(j.id) === String(selectedExistingJournalId));
                if (!targetJournal) {
                    throw new Error('Journal not found');
                }

                const updatedContent = `${targetJournal.content}${formattedGoalSnippet}`;

                const res = await fetch(`/api/journals/${selectedExistingJournalId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: targetJournal.title,
                        content: updatedContent,
                        mood: targetJournal.mood || 'awesome',
                        imagePath: '',
                        image_url: '',
                        aiSentiment: ''
                    })
                });

                if (res.ok) {
                    setJournalSyncMessage(isIndo ? '✅ Berhasil menambahkan catatan ke jurnal yang dipilih!' : '✅ Successfully appended notes to chosen journal!');
                    mutateJournals();
                    setTimeout(() => {
                        setIsJournalSyncOpen(false);
                        setJournalSyncMessage(null);
                    }, 1800);
                } else {
                    throw new Error('Failed to update journal');
                }
            }
        } catch (err) {
            console.error('Failed to sync to journal:', err);
            alert(isIndo ? 'Gagal menyinkronkan ke jurnal. Coba lagi.' : 'Failed to sync to journal. Please try again.');
        } finally {
            setIsSyncingJournal(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
                <div 
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Header */}
                    <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-800/40 flex items-center justify-center shrink-0 shadow-xs">
                                <span className="text-xl select-none">{goal.icon || '🎯'}</span>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-black text-slate-800 dark:text-white truncate">
                                        {goal.title}
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-800/40 shrink-0">
                                        {progress}%
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                                    {isIndo ? 'Catatan Progres, Refleksi & Kompas Motivasi' : 'Progress Notes, Reflection & Motivation Compass'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 pb-1 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <button
                            type="button"
                            onClick={() => setActiveTab('notes')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                                activeTab === 'notes'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <BookOpen size={14} />
                            <span>{isIndo ? 'Catatan & Log Refleksi' : 'Notes & Reflection Log'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('woop')}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                                activeTab === 'woop'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Compass size={14} />
                            <span>{isIndo ? 'Kompas Motivasi (WOOP)' : 'Motivation Compass (WOOP)'}</span>
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        
                        {/* TAB 1: NOTES & JOURNAL SYNC */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                            <BookOpen size={14} className="text-indigo-500" />
                                            <span>{isIndo ? 'Catatan Berkala & Update Perjalanan' : 'Progress Log & Journey Notes'}</span>
                                        </label>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {notes.length} {isIndo ? 'karakter' : 'characters'}
                                        </span>
                                    </div>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={6}
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none transition leading-relaxed"
                                        placeholder={isIndo 
                                            ? 'Tuliskan catatan progres, kendala mingguan, ide baru, atau refleksi pribadi untuk target ini...' 
                                            : 'Write your progress updates, obstacles faced, breakthroughs, or personal reflections for this goal...'
                                        }
                                    />
                                </div>

                                {/* Action Buttons: Save Notes & Sync to Journal */}
                                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveNotes}
                                            disabled={isSavingNotes}
                                            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
                                        >
                                            {isSavingNotes ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            <span>{notesSaveSuccess ? (isIndo ? 'Tersimpan! ✓' : 'Saved! ✓') : (isIndo ? 'Simpan Catatan' : 'Save Notes')}</span>
                                        </button>

                                        {notesSaveSuccess && (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                <CheckCircle2 size={14} />
                                                <span>{isIndo ? 'Catatan tersimpan' : 'Notes saved'}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Sync to Journal Action Trigger */}
                                    <button
                                        type="button"
                                        onClick={() => setIsJournalSyncOpen(!isJournalSyncOpen)}
                                        className="h-10 px-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center gap-2 active:scale-95 transition shadow-xs"
                                    >
                                        <Sparkles size={14} className="text-indigo-500" />
                                        <span>{isIndo ? '📖 Kirim ke Jurnal' : '📖 Sync to Journal'}</span>
                                    </button>
                                </div>

                                {/* SUB-MODAL / PANEL: SYNC TO JOURNAL (ALBUM LOGIC) */}
                                {isJournalSyncOpen && (
                                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/70 border border-indigo-100 dark:border-indigo-800/60 space-y-3.5 animate-in fade-in duration-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">📖</span>
                                                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                                    {isIndo ? 'Pilih Metode Masuk ke Jurnal' : 'Choose Journal Destination'}
                                                </h4>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsJournalSyncOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {isIndo 
                                                ? 'Sama seperti menyalin foto ke album galeri, tentukan apakah catatan ini ingin dibuat sebagai jurnal baru atau dimasukkan ke jurnal yang sudah ada.'
                                                : 'Just like adding a photo to an album, choose whether to create a brand new journal entry or append into an existing one.'
                                            }
                                        </p>

                                        {/* Option Selection (Radio Cards) */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {/* Option 1: Jurnal Baru */}
                                            <label 
                                                className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                                                    journalMode === 'new'
                                                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm'
                                                        : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="journalMode"
                                                    value="new"
                                                    checked={journalMode === 'new'}
                                                    onChange={() => setJournalMode('new')}
                                                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <div>
                                                    <span className="text-xs font-black text-slate-800 dark:text-white block">
                                                        {isIndo ? '🆕 Buat Jurnal Baru' : '🆕 Create New Entry'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                                        {isIndo ? 'Membuat dokumen jurnal anyar hari ini' : 'Generates a brand new journal entry'}
                                                    </span>
                                                </div>
                                            </label>

                                            {/* Option 2: Jurnal yang Sudah Ada */}
                                            <label 
                                                className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                                                    journalMode === 'existing'
                                                        ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm'
                                                        : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="journalMode"
                                                    value="existing"
                                                    checked={journalMode === 'existing'}
                                                    onChange={() => setJournalMode('existing')}
                                                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <div>
                                                    <span className="text-xs font-black text-slate-800 dark:text-white block">
                                                        {isIndo ? '📚 Jurnal yang Sudah Ada' : '📚 Existing Entry'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                                        {isIndo ? 'Menempelkan catatan ke jurnal pilihan' : 'Appends note to a selected journal'}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Configuration based on mode */}
                                        {journalMode === 'new' ? (
                                            <div className="space-y-2 pt-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400">
                                                    {isIndo ? 'Judul Jurnal Baru' : 'New Journal Title'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newJournalTitle}
                                                    onChange={(e) => setNewJournalTitle(e.target.value)}
                                                    className="w-full h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                                                    placeholder={isIndo ? 'Judul entri jurnal...' : 'Journal entry title...'}
                                                />
                                                <div className="flex items-center gap-2 pt-1">
                                                    <span className="text-[10px] font-bold text-slate-400">Mood:</span>
                                                    {(['awesome', 'good', 'neutral', 'bad'] as const).map(m => (
                                                        <button
                                                            key={m}
                                                            type="button"
                                                            onClick={() => setNewJournalMood(m)}
                                                            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition ${
                                                                newJournalMood === m 
                                                                    ? 'bg-indigo-600 text-white' 
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                            }`}
                                                        >
                                                            {m === 'awesome' ? '🔥 Hebat' : m === 'good' ? '😊 Baik' : m === 'neutral' ? '😐 Biasa' : '🌧️ Lesu'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 pt-1">
                                                <label className="text-[10px] font-black uppercase text-slate-400">
                                                    {isIndo ? 'Pilih Jurnal Tujuan (Album)' : 'Select Target Journal'}
                                                </label>
                                                {existingJournals.length > 0 ? (
                                                    <select
                                                        value={selectedExistingJournalId}
                                                        onChange={(e) => setSelectedExistingJournalId(e.target.value)}
                                                        className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
                                                    >
                                                        <option value="">{isIndo ? '-- Pilih Entri Jurnal --' : '-- Select Journal Entry --'}</option>
                                                        {existingJournals.map(j => (
                                                            <option key={j.id} value={j.id}>
                                                                {j.date ? `${new Date(j.date).toLocaleDateString()} - ` : ''}{j.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                                                        {isIndo ? 'Belum ada entri jurnal ditemukan. Gunakan opsi "Buat Jurnal Baru".' : 'No existing journals found. Please choose "Create New Entry".'}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Submit Sync Button */}
                                        <div className="pt-2 flex items-center justify-between">
                                            {journalSyncMessage ? (
                                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                                    {journalSyncMessage}
                                                </span>
                                            ) : <div />}

                                            <button
                                                type="button"
                                                onClick={handleExecuteJournalSync}
                                                disabled={isSyncingJournal}
                                                className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
                                            >
                                                {isSyncingJournal ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                                                <span>{isIndo ? 'Konfirmasi & Kirim ke Jurnal' : 'Confirm & Sync to Journal'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: WOOP MOTIVATION COMPASS */}
                        {activeTab === 'woop' && (
                            <div className="space-y-4">
                                {/* Core Why */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                        <Compass size={14} className="text-indigo-500" />
                                        <span>{isIndo ? 'Alasan Utama ("The Why")' : 'The Core Motivation ("The Why")'}</span>
                                    </label>
                                    <textarea
                                        value={coreWhy}
                                        onChange={(e) => setCoreWhy(e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                        placeholder={isIndo ? 'Mengapa target ini sangat berarti dan pantas diperjuangkan?' : 'Why is this goal deeply meaningful to you?'}
                                    />
                                </div>

                                {/* Obstacle & Plan */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                            <ShieldAlert size={13} />
                                            <span>{isIndo ? 'Potensi Rintangan Terbesar' : 'Biggest Obstacle'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={obstacle}
                                            onChange={(e) => setObstacle(e.target.value)}
                                            className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/20"
                                            placeholder={isIndo ? 'Contoh: Godaan belanja / Malas malam hari' : 'E.g. Impulsive spending / evening fatigue'}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                            <Compass size={13} />
                                            <span>{isIndo ? 'Rencana Antisipasi (If-Then)' : 'Anticipation Plan (If-Then)'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={obstaclePlan}
                                            onChange={(e) => setObstaclePlan(e.target.value)}
                                            className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            placeholder={isIndo ? 'Jika terjadi, saya akan...' : 'If obstacle occurs, I will...'}
                                        />
                                    </div>
                                </div>

                                {/* Reward */}
                                <div className="space-y-1.5 pt-1">
                                    <label className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                        <Award size={14} />
                                        <span>{isIndo ? 'Hadiah Kemenangan (Victory Self-Reward)' : 'Victory Self-Reward'}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={reward}
                                        onChange={(e) => setReward(e.target.value)}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/20"
                                        placeholder={isIndo ? 'Rayakan saat 100% tercapai (contoh: Staycation / Dinner spesial)' : 'Reward upon 100% completion (e.g. Special vacation)'}
                                    />
                                </div>

                                {/* Save WOOP Button */}
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSaveWoop}
                                        disabled={isSavingWoop}
                                        className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
                                    >
                                        {isSavingWoop ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        <span>{woopSaveSuccess ? (isIndo ? 'Tersimpan! ✓' : 'Saved! ✓') : (isIndo ? 'Simpan Kompas Motivasi' : 'Save Motivation Compass')}</span>
                                    </button>

                                    {woopSaveSuccess && (
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <CheckCircle2 size={14} />
                                            <span>{isIndo ? 'Panduan WOOP diperbarui' : 'WOOP compass updated'}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="px-5 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                        >
                            {isIndo ? 'Tutup' : 'Close'}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
