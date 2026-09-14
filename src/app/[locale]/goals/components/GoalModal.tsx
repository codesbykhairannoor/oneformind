'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { 
    Target, Calendar, Award, Zap, CheckCircle2, Star, 
    Hash, DollarSign, ListTodo, CheckSquare, Compass, 
    ShieldAlert, Sparkles, Flag, Link2
} from 'lucide-react';
import GoalDatePicker from './GoalDatePicker';
import { GoalItem } from './GoalCard';
import ModalPortal from '@/components/ModalPortal';
import GoalModalHeader from './GoalModalHeader';
import GoalArchetypesGrid, { archetypes } from './GoalArchetypesGrid';
import GoalMilestonesSection from './GoalMilestonesSection';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface GoalModalProps {
    show: boolean;
    goal?: GoalItem | null;
    onClose: () => void;
    onSave: (form: GoalItem) => void;
    onUploadImage?: (file: File) => void;
    processing?: boolean;
    errors?: Record<string, string>;
}

export default function GoalModal({
    show,
    goal,
    onClose,
    onSave,
    onUploadImage,
    processing,
    errors = {}
}: GoalModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentMonthKey = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }, []);

    const { data: fetchedSavings } = useSWR(show ? '/api/finance/savings' : null, fetcher);
    const { data: fetchedHabitsRaw } = useSWR(show ? `/api/habits?period=${currentMonthKey}` : null, fetcher);

    const uniqueHabits = useMemo(() => {
        if (!fetchedHabitsRaw || !Array.isArray(fetchedHabitsRaw)) return [];
        const seen = new Set<string>();
        const list: any[] = [];
        fetchedHabitsRaw.forEach((h: any) => {
            if (h.isArchived || h.is_archived || h.archived) return;
            const norm = (h.name || '').trim().toLowerCase();
            if (!norm || seen.has(norm)) return;
            seen.add(norm);
            list.push(h);
        });
        return list;
    }, [fetchedHabitsRaw]);

    const [form, setForm] = useState<GoalItem>({
        id: '',
        title: '',
        color: '#6366f1',
        type: 'milestones',
        status: 'active',
        priority: 'important',
        category: 'other',
        time_horizon: 'yearly',
        is_north_star: false,
        start_value: 0,
        current_value: 0,
        target_value: 10,
        unit: isIndo ? 'buku' : 'books',
        currency: 'IDR',
        core_why: '',
        obstacle: '',
        obstacle_plan: '',
        reward: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        cover_image_url: '',
        milestones: [],
        linked_source: 'manual',
        linked_account_id: null,
        linked_account_title: null,
        linked_habit_ids: []
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState('other');

    useEffect(() => {
        if (goal) {
            const parsedGoal = JSON.parse(JSON.stringify(goal));
            if (goal.specific_days && typeof goal.specific_days === 'string') {
                try {
                    const meta = JSON.parse(goal.specific_days);
                    if (meta.linked_source && !parsedGoal.linked_source) parsedGoal.linked_source = meta.linked_source;
                    if (meta.linked_account_id && !parsedGoal.linked_account_id) parsedGoal.linked_account_id = meta.linked_account_id;
                    if (meta.linked_account_title && !parsedGoal.linked_account_title) parsedGoal.linked_account_title = meta.linked_account_title;
                    if (Array.isArray(meta.linked_habit_ids) && (!parsedGoal.linked_habit_ids || parsedGoal.linked_habit_ids.length === 0)) {
                        parsedGoal.linked_habit_ids = meta.linked_habit_ids;
                    }
                } catch {}
            }
            if (!parsedGoal.linked_habit_ids) parsedGoal.linked_habit_ids = [];
            setForm(parsedGoal);
            setImagePreview(goal.cover_image_url || null);
            setSelectedArchetype(goal.category || 'other');
        } else {
            setForm({
                id: '',
                title: '',
                color: '#6366f1',
                type: 'milestones',
                status: 'active',
                priority: 'important',
                category: 'other',
                time_horizon: 'yearly',
                is_north_star: false,
                start_value: 0,
                current_value: 0,
                target_value: 10,
                unit: isIndo ? 'buku' : 'books',
                currency: 'IDR',
                core_why: '',
                obstacle: '',
                obstacle_plan: '',
                reward: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: null,
                cover_image_url: '',
                milestones: [],
                linked_source: 'manual',
                linked_account_id: null,
                linked_account_title: null,
                linked_habit_ids: []
            });
            setImagePreview(null);
            setSelectedArchetype('other');
        }
    }, [goal, show, isIndo]);

    if (!show) return null;

    const selectArchetype = (arch: typeof archetypes[0]) => {
        setSelectedArchetype(arch.id);
        setForm(prev => ({ ...prev, color: arch.color, category: arch.id }));
    };

    const currentHeaderIcon = () => {
        const found = archetypes.find(a => a.id === form.category);
        return found ? found.icon : Target;
    };

    const HeaderIcon = currentHeaderIcon();

    const formatDateDisplay = (dateStr?: string | null) => {
        if (!dateStr) return isIndo ? 'Pilih Tanggal' : 'Select Date';
        try {
            return new Date(dateStr).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const handleSave = () => {
        if (!form.title?.trim()) {
            alert(isIndo ? 'Judul Target Wajib Diisi! Beri nama impian Anda.' : 'Goal Title is required! Name your dream.');
            return;
        }
        onSave(form);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const rawDataUrl = readerEvent.target?.result;
            if (typeof rawDataUrl !== 'string') {
                setIsUploading(false);
                return;
            }

            // Perform client-side compression via HTML canvas to keep payload small, sharp & snappy
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        setImagePreview(compressedDataUrl);
                        setForm(prev => ({ ...prev, cover_image_url: compressedDataUrl }));
                    } else {
                        setImagePreview(rawDataUrl);
                        setForm(prev => ({ ...prev, cover_image_url: rawDataUrl }));
                    }
                } catch {
                    setImagePreview(rawDataUrl);
                    setForm(prev => ({ ...prev, cover_image_url: rawDataUrl }));
                } finally {
                    setIsUploading(false);
                }
            };
            img.onerror = () => {
                setImagePreview(rawDataUrl);
                setForm(prev => ({ ...prev, cover_image_url: rawDataUrl }));
                setIsUploading(false);
            };
            img.src = rawDataUrl;
        };
        reader.onerror = () => {
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCover = () => {
        setImagePreview(null);
        setForm(prev => ({ ...prev, cover_image_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const colorOptions = [
        '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', 
        '#0ea5e9', '#0f172a', '#ef4444', '#84cc16', '#14b8a6', 
        '#ec4899', '#6b7280', '#eab308', '#d946ef'
    ];

    const targetTypes = [
        { id: 'milestones', label: isIndo ? 'Langkah / OKR' : 'Milestones / OKR', icon: ListTodo, desc: isIndo ? 'Checklist langkah terstruktur' : 'Structured checklist steps' },
        { id: 'numeric', label: isIndo ? 'Angka / Metrik' : 'Numeric Counter', icon: Hash, desc: isIndo ? 'Target buku, km, sesi, halaman' : 'Count books, km, pages, sessions' },
        { id: 'currency', label: isIndo ? 'Finansial (Rp/$)' : 'Currency Goal', icon: DollarSign, desc: isIndo ? 'Tabungan, investasi, aset uang' : 'Savings, emergency funds, revenue' },
        { id: 'boolean', label: isIndo ? 'Sederhana' : 'Simple Done', icon: CheckSquare, desc: isIndo ? 'Target 1 kali selesai' : 'Single milestone accomplishment' },
    ];

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-4xl lg:max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[92vh] transition-colors border border-slate-200/80 dark:border-slate-800">
                    
                    <GoalModalHeader
                        goal={goal}
                        form={form}
                        imagePreview={imagePreview}
                        isUploading={isUploading}
                        HeaderIcon={HeaderIcon}
                        t={() => ''}
                        onClose={onClose}
                        onUploadClick={() => fileInputRef.current?.click()}
                        onRemoveCover={handleRemoveCover}
                        fileInputRef={fileInputRef}
                        onFileChange={onFileChange}
                    />

                    {/* Modal Form Scrollable Area */}
                    <div className="p-5 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 pb-28">
                        
                        {/* 2-Column Responsive Layout for Tablet & Desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            {/* LEFT COLUMN: Vision, Type, Metrics & Habit Engine (lg:col-span-7) */}
                            <div className="lg:col-span-7 space-y-5">
                                
                                {/* 1. Goal Title & North Star Pinning */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Judul Target / Visi Impian' : 'Goal Title / Vision'} *
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, is_north_star: !prev.is_north_star }))}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                                                form.is_north_star
                                                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400 shadow-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                                            }`}
                                        >
                                            <Star size={13} className={form.is_north_star ? 'fill-amber-400 text-amber-500' : ''} />
                                            <span>{isIndo ? 'Bintang Utama (North Star)' : 'North Star Goal'}</span>
                                        </button>
                                    </div>

                                    <input 
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition text-base shadow-sm"
                                        placeholder={isIndo ? 'Contoh: Baca 24 Buku Tahun Ini / Kumpul Dana Darurat 50jt...' : 'E.g. Read 24 Books This Year / Save $10k Emergency Fund...'} 
                                    />
                                </div>

                                {/* 2. Target Type Selector */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                        {isIndo ? 'Tipe Target' : 'Goal Type'}
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {targetTypes.map((tt) => {
                                            const TTIcon = tt.icon;
                                            const isSelected = form.type === tt.id;
                                            return (
                                                <button
                                                    key={tt.id}
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, type: tt.id }))}
                                                    className={`p-3 rounded-2xl border-2 flex flex-col items-start gap-1.5 text-left transition ${
                                                        isSelected
                                                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                                            : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <TTIcon size={17} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                                                    <div>
                                                        <div className="text-xs font-black">{tt.label}</div>
                                                        <div className="text-[10px] text-slate-400 leading-tight line-clamp-1">{tt.desc}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 3. Numeric / Metric Dynamic Inputs */}
                                {form.type === 'numeric' && (
                                    <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                                        <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                            <Hash size={14} />
                                            {isIndo ? 'Parameter Target Angka' : 'Numeric Target Parameters'}
                                        </span>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Nilai Awal' : 'Start Value'}
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={form.start_value || 0}
                                                    onChange={(e) => setForm(prev => ({ ...prev, start_value: Number(e.target.value) }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Saat Ini' : 'Current Value'}
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={form.current_value || 0}
                                                    onChange={(e) => setForm(prev => ({ ...prev, current_value: Number(e.target.value) }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Nilai Target' : 'Target Value'} *
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={form.target_value || 10}
                                                    onChange={(e) => setForm(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Satuan Unit' : 'Unit Label'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={form.unit || ''}
                                                    onChange={(e) => setForm(prev => ({ ...prev, unit: e.target.value }))}
                                                    placeholder={isIndo ? 'buku / km / kg' : 'books / km / kg'}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 4. Currency Dynamic Inputs */}
                                {form.type === 'currency' && (
                                    <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-3">
                                        <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                            <DollarSign size={14} />
                                            {isIndo ? 'Parameter Target Finansial' : 'Currency Target Parameters'}
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-[10px] font-bold text-slate-400 block">
                                                        {isIndo ? 'Nominal Saat Ini' : 'Current Amount'}
                                                    </label>
                                                    {form.linked_source === 'finance_savings' && (
                                                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                                                            {isIndo ? '🟢 Auto-Sync' : '🟢 Live Synced'}
                                                        </span>
                                                    )}
                                                </div>
                                                <input 
                                                    type="number"
                                                    disabled={form.linked_source === 'finance_savings'}
                                                    value={form.current_value || 0}
                                                    onChange={(e) => setForm(prev => ({ ...prev, current_value: Number(e.target.value) }))}
                                                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold font-mono transition ${
                                                        form.linked_source === 'finance_savings'
                                                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-850 text-emerald-700 dark:text-emerald-300 cursor-not-allowed opacity-90'
                                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400'
                                                    }`}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Nominal Target' : 'Target Amount'} *
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={form.target_value || 50000000}
                                                    onChange={(e) => setForm(prev => ({ ...prev, target_value: Number(e.target.value) }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
                                                    placeholder="50000000"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                    {isIndo ? 'Mata Uang' : 'Currency'}
                                                </label>
                                                <select
                                                    value={form.currency || 'IDR'}
                                                    onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                                >
                                                    <option value="IDR">IDR (Rp - Rupiah)</option>
                                                    <option value="USD">USD ($ - Dollar)</option>
                                                </select>
                                            </div>

                                            {/* Link to Finance Savings Account */}
                                            <div className="sm:col-span-3 pt-2.5 border-t border-emerald-200/50 dark:border-emerald-800/50 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                                        <Link2 size={13} />
                                                        {isIndo ? 'Sinkronisasi Tabungan Finansial (Auto-Sync)' : 'Link to Finance Savings (Auto-Sync)'}
                                                    </label>
                                                    {form.linked_source === 'finance_savings' && (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                                                            {isIndo ? '🟢 Terhubung Langsung' : '🟢 Live Linked'}
                                                        </span>
                                                    )}
                                                </div>

                                                <select
                                                    value={form.linked_account_id ? String(form.linked_account_id) : 'manual'}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'manual') {
                                                            setForm(prev => ({
                                                                ...prev,
                                                                linked_source: 'manual',
                                                                linked_account_id: null,
                                                                linked_account_title: null
                                                            }));
                                                        } else {
                                                            const savingsList: any[] = Array.isArray(fetchedSavings) ? fetchedSavings : [];
                                                            const matched = savingsList.find((s: any) => String(s.id) === val);
                                                            if (matched) {
                                                                setForm(prev => ({
                                                                    ...prev,
                                                                    linked_source: 'finance_savings',
                                                                    linked_account_id: matched.id,
                                                                    linked_account_title: matched.title,
                                                                    current_value: matched.currentAmount ?? prev.current_value,
                                                                    target_value: (prev.target_value === 50000000 && matched.targetAmount) ? matched.targetAmount : prev.target_value
                                                                }));
                                                            }
                                                        }
                                                    }}
                                                    className="w-full bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white shadow-sm"
                                                >
                                                    <option value="manual">
                                                        {isIndo ? '✏️ Input Manual (Tidak terhubung ke tabungan)' : '✏️ Manual Input (Not linked)'}
                                                    </option>
                                                    {(Array.isArray(fetchedSavings) ? fetchedSavings : []).map((sav: any) => (
                                                        <option key={sav.id} value={sav.id}>
                                                            {sav.icon || '💰'} {sav.title} — {new Intl.NumberFormat(isIndo ? 'id-ID' : 'en-US', { style: 'currency', currency: form.currency || 'IDR', maximumFractionDigits: 0 }).format(sav.currentAmount || 0)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {form.linked_source === 'finance_savings' && (
                                                    <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 leading-tight">
                                                        {isIndo 
                                                            ? 'Saldo target ini akan selalu disinkronkan otomatis dari saldo tabungan Anda di modul Finansial.' 
                                                            : 'This goal will automatically sync its progress with your savings account in Finance.'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 5. Habit Engine (Leading Measures) Selector */}
                                <div className="p-4 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                            <Sparkles size={14} />
                                            {isIndo ? '🌱 Mesin Kebiasaan Pendorong (Leading Measures)' : '🌱 Supporting Habit Engine'}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono">
                                            {form.linked_habit_ids?.length || 0} {isIndo ? 'terpilih' : 'linked'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isIndo 
                                            ? 'Hubungkan kebiasaan harian aktif di bulan ini yang menjadi penggerak utama target ini.' 
                                            : 'Link active daily habits for this month that act as the leading measures directly powering this goal.'}
                                    </p>

                                    {uniqueHabits.length === 0 ? (
                                        <div className="text-xs text-slate-400 italic py-1.5">
                                            {isIndo ? 'Belum ada kebiasaan aktif di bulan ini.' : 'No active habits found for this month.'}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                            {uniqueHabits.map((h: any) => {
                                                const isSelected = form.linked_habit_ids?.some(id => String(id) === String(h.id));
                                                return (
                                                    <button
                                                        key={h.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setForm(prev => {
                                                                const currentIds = prev.linked_habit_ids || [];
                                                                const exists = currentIds.some(id => String(id) === String(h.id));
                                                                const nextIds = exists 
                                                                    ? currentIds.filter(id => String(id) !== String(h.id))
                                                                    : [...currentIds, h.id];
                                                                return { ...prev, linked_habit_ids: nextIds };
                                                            });
                                                        }}
                                                        className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1.5 text-left active:scale-95 border ${
                                                            isSelected
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-400/40'
                                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 hover:bg-indigo-50/30'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <span className="shrink-0 text-sm">{h.icon || '🌱'}</span>
                                                            <span className="truncate text-[11px] font-bold">{h.name}</span>
                                                        </div>
                                                        {isSelected && <CheckCircle2 size={13} className="shrink-0 text-white" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* 6. Color Theme Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                        {isIndo ? 'Warna Tema Target' : 'Goal Color Theme'}
                                    </label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                                        {colorOptions.map((c) => (
                                            <button 
                                                key={c}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                                className={`w-7 h-7 rounded-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                                                    form.color === c ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-indigo-500/30 shadow-md' : 'opacity-70 hover:opacity-100'
                                                }`}
                                                style={{ backgroundColor: c }}
                                            >
                                                {form.color === c && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* RIGHT COLUMN: Category, Timeline & Psychology (lg:col-span-5) */}
                            <div className="lg:col-span-5 space-y-5">
                                
                                {/* 7. Archetype Template Selection */}
                                <GoalArchetypesGrid
                                    selectedArchetype={selectedArchetype}
                                    onSelectArchetype={selectArchetype}
                                    t={() => ''}
                                />

                                {/* 8. Priority & Time Horizon */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Tingkat Prioritas' : 'Priority Level'}
                                        </label>
                                        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                            {['vital', 'important', 'optional'].map((p) => (
                                                <button 
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                                                    className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition capitalize ${
                                                        form.priority === p 
                                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                                                            : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                                >
                                                    {p === 'vital' ? 'Vital 🔥' : p === 'important' ? (isIndo ? 'Penting' : 'Important') : 'Opsional'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Horison Waktu' : 'Time Horizon'}
                                        </label>
                                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                            {[
                                                { id: 'sprint', label: 'Sprint' },
                                                { id: 'quarterly', label: isIndo ? 'Kuartal' : 'Quarter' },
                                                { id: 'yearly', label: isIndo ? 'Tahunan' : 'Yearly' },
                                                { id: 'lifetime', label: 'Vision' },
                                            ].map((th) => (
                                                <button 
                                                    key={th.id}
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, time_horizon: th.id }))}
                                                    className={`flex-1 py-2 rounded-xl text-[9.5px] font-black tracking-wider transition ${
                                                        form.time_horizon === th.id 
                                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                                                            : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                                >
                                                    {th.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 9. Start Date & Target Deadline */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-50">
                                    <div className="space-y-1.5 relative">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Tanggal Mulai' : 'Start Date'}
                                        </label>
                                        <div className="relative">
                                            <button 
                                                type="button" 
                                                onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-3 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm"
                                            >
                                                <span>{formatDateDisplay(form.start_date)}</span>
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                            </button>
                                            
                                            <GoalDatePicker 
                                                show={showStartPicker}
                                                teleport={true}
                                                modelValue={form.start_date}
                                                onUpdateModelValue={(val) => { setForm(prev => ({ ...prev, start_date: val })); setShowStartPicker(false); }}
                                                onClose={() => setShowStartPicker(false)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 relative">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Tenggat Waktu Akhir' : 'Target Deadline'}
                                        </label>
                                        <div className="relative">
                                            <button 
                                                type="button" 
                                                onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-3 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm"
                                            >
                                                <span className={!form.end_date ? 'text-slate-400' : ''}>
                                                    {formatDateDisplay(form.end_date)}
                                                </span>
                                                <Zap className={`w-4 h-4 ${form.end_date ? 'text-rose-500' : 'text-slate-400'}`} />
                                            </button>
                                            
                                            <GoalDatePicker 
                                                show={showEndPicker}
                                                teleport={true}
                                                modelValue={form.end_date}
                                                onUpdateModelValue={(val) => { setForm(prev => ({ ...prev, end_date: val })); setShowEndPicker(false); }}
                                                onClose={() => setShowEndPicker(false)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 10. Psychological & WOOP Fields */}
                                <div className="p-4 sm:p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                        <Compass size={15} />
                                        {isIndo ? 'Psikologi Pencapaian & Motivasi (WOOP)' : 'Goal Psychology & WOOP Pre-Mortem'}
                                    </span>

                                    {/* Core Motivation */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                            {isIndo ? 'Alasan Utama ("The Why")' : 'The Core Motivation ("The Why")'}
                                        </label>
                                        <textarea
                                            value={form.core_why || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, core_why: e.target.value }))}
                                            rows={2}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                            placeholder={isIndo ? 'Mengapa target ini sangat berarti dan tidak boleh gagal?' : 'Why is this goal non-negotiable for your life?'}
                                        />
                                    </div>

                                    {/* Obstacle & Plan */}
                                    <div className="space-y-2.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                <ShieldAlert size={12} />
                                                {isIndo ? 'Potensi Rintangan Terbesar' : 'Biggest Obstacle'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={form.obstacle || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, obstacle: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                                                placeholder={isIndo ? 'Contoh: Godaan belanja impulsif / Malas malam hari' : 'E.g. Impulsive spending / evening fatigue'}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                {isIndo ? 'Rencana Antisipasi (If-Then)' : 'Anticipation Plan (If-Then)'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={form.obstacle_plan || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, obstacle_plan: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                                                placeholder={isIndo ? 'Jika terjadi, saya akan...' : 'If it happens, I will...'}
                                            />
                                        </div>
                                    </div>

                                    {/* Self-Reward */}
                                    <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                                        <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                            <Award size={13} />
                                            {isIndo ? 'Hadiah Kemenangan (Victory Self-Reward)' : 'Victory Self-Reward'}
                                        </label>
                                        <input 
                                            type="text"
                                            value={form.reward || ''}
                                            onChange={(e) => setForm(prev => ({ ...prev, reward: e.target.value }))}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                                            placeholder={isIndo ? 'Rayakan saat 100% tercapai (contoh: Liburan 3 hari / Dinner mewah)' : 'Reward yourself when done (e.g. Weekend getaway / Special dinner)'}
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* 11. Milestones Section (Full width if type is milestones) */}
                        {form.type === 'milestones' && (
                            <div className="pt-3 border-t border-slate-150 dark:border-slate-800">
                                <GoalMilestonesSection
                                    form={form}
                                    setForm={setForm}
                                    t={() => ''}
                                />
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 shrink-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 relative z-50">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="text-xs font-black text-slate-400 hover:text-rose-500 transition px-4 py-2"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleSave}
                            disabled={processing}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-2xl font-black text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {goal?.id 
                                ? (isIndo ? 'Perbarui Target' : 'Update Goal') 
                                : (isIndo ? 'Wujudkan Target Baru' : 'Manifest Goal')}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
