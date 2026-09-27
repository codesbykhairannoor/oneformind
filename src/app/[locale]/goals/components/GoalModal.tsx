'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocale } from 'next-intl';
import useSWR from 'swr';
import { 
    Target, Calendar, Award, Zap, CheckCircle2, Star, 
    Hash, DollarSign, ListTodo, CheckSquare, Compass, 
    ShieldAlert, Sparkles, Link2, SlidersHorizontal,
    ChevronDown, ChevronUp, Palette, PaletteIcon, Trash2
} from 'lucide-react';
import GoalDatePicker from './GoalDatePicker';
import { GoalItem } from './GoalCard';
import ModalPortal from '@/components/ModalPortal';
import GoalModalHeader from './GoalModalHeader';
import GoalMilestonesSection from './GoalMilestonesSection';
import { useActiveModules } from '@/hooks/useActiveModules';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface GoalModalProps {
    show: boolean;
    goal?: GoalItem | null;
    allGoals?: GoalItem[];
    defaultTimeHorizon?: string;
    onClose: () => void;
    onSave: (form: GoalItem) => void;
    onUploadImage?: (file: File) => void;
    onDeleteCategory?: (category: string) => void;
    processing?: boolean;
    errors?: Record<string, string>;
}

export default function GoalModal({
    show,
    goal,
    allGoals = [],
    defaultTimeHorizon = 'weekly',
    onClose,
    onSave,
    onUploadImage,
    onDeleteCategory,
    processing = false,
    errors = {}
}: GoalModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { isTabActive } = useActiveModules();
    const isHabitActive = isTabActive('habit');
    const isFinanceActive = isTabActive('finance');

    const currentMonthKey = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }, []);

    const { data: fetchedSavings } = useSWR(show && isFinanceActive ? '/api/finance/savings' : null, fetcher);
    const { data: fetchedHabitsRaw } = useSWR(show && isHabitActive ? '/api/habits?period=all' : null, fetcher);

    const uniqueHabits = useMemo(() => {
        if (!isHabitActive || !fetchedHabitsRaw || !Array.isArray(fetchedHabitsRaw)) return [];
        const map = new Map<string, any>();
        fetchedHabitsRaw.forEach((h: any) => {
            if (h.isArchived || h.is_archived || h.archived) return;
            const norm = (h.name || '').trim().toLowerCase();
            if (!norm) return;
            if (!map.has(norm)) {
                map.set(norm, {
                    ...h,
                    allIds: [h.id]
                });
            } else {
                const existing = map.get(norm);
                existing.allIds.push(h.id);
                if (h.period === currentMonthKey) {
                    map.set(norm, {
                        ...h,
                        allIds: existing.allIds
                    });
                }
            }
        });
        return Array.from(map.values());
    }, [fetchedHabitsRaw, isHabitActive, currentMonthKey]);

    const activeHorizon = defaultTimeHorizon && defaultTimeHorizon !== 'all' ? defaultTimeHorizon : 'weekly';

    const [showIconPicker, setShowIconPicker] = useState(false);

    const [form, setForm] = useState<GoalItem>({
        id: '',
        title: '',
        icon: '🎯',
        color: '#6366f1',
        type: 'milestones',
        status: 'active',
        priority: 'important',
        category: 'other',
        time_horizon: activeHorizon,
        is_north_star: false,
        parent_goal_id: null,
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

    const potentialParentGoals = useMemo(() => {
        if (!allGoals || !Array.isArray(allGoals)) return [];
        const curHorizon = form.time_horizon || 'weekly';
        return allGoals.filter(g => {
            if (form.id && String(g.id) === String(form.id)) return false;
            if (goal?.id && String(g.id) === String(goal.id)) return false;
            const gHorizon = g.time_horizon || 'yearly';

            if (curHorizon === 'weekly') {
                return gHorizon === 'monthly' || gHorizon === 'sprint';
            } else if (curHorizon === 'monthly') {
                return gHorizon === 'quarterly' || gHorizon === 'yearly';
            } else if (curHorizon === 'quarterly') {
                return gHorizon === 'yearly';
            }
            return false;
        });
    }, [allGoals, form.id, goal?.id, form.time_horizon]);

    // Distinct custom categories from existing goals (excluding 'other')
    const existingCustomCategories = useMemo(() => {
        if (!allGoals || !Array.isArray(allGoals)) return [];
        const set = new Set<string>();
        allGoals.forEach(g => {
            const cat = (g.category || '').trim();
            if (cat && cat.toLowerCase() !== 'other') {
                set.add(cat);
            }
        });
        return Array.from(set);
    }, [allGoals]);

    const [categoryMode, setCategoryMode] = useState<'other' | 'existing' | 'new'>('other');
    const [customCatText, setCustomCatText] = useState('');

    useEffect(() => {
        if (form.parent_goal_id) {
            const isValidParent = potentialParentGoals.some(p => String(p.id) === String(form.parent_goal_id));
            if (!isValidParent) {
                setForm(prev => ({ ...prev, parent_goal_id: null }));
            }
        }
    }, [form.time_horizon, potentialParentGoals]);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (goal) {
            const parsedGoal = JSON.parse(JSON.stringify(goal));
            let meta: any = {};
            if (goal.specific_days && typeof goal.specific_days === 'string') {
                try {
                    meta = JSON.parse(goal.specific_days);
                    if (meta.linked_source && !parsedGoal.linked_source) parsedGoal.linked_source = meta.linked_source;
                    if (meta.linked_account_id && !parsedGoal.linked_account_id) parsedGoal.linked_account_id = meta.linked_account_id;
                    if (meta.linked_account_title && !parsedGoal.linked_account_title) parsedGoal.linked_account_title = meta.linked_account_title;
                    if (Array.isArray(meta.linked_habit_ids) && (!parsedGoal.linked_habit_ids || parsedGoal.linked_habit_ids.length === 0)) {
                        parsedGoal.linked_habit_ids = meta.linked_habit_ids;
                    }
                    if (meta.icon && !parsedGoal.icon) parsedGoal.icon = meta.icon;
                } catch {}
            }
            if (!parsedGoal.icon) parsedGoal.icon = '🎯';
            if (!parsedGoal.linked_habit_ids) parsedGoal.linked_habit_ids = [];
            parsedGoal.parent_goal_id = parsedGoal.parent_goal_id ?? parsedGoal.parentGoalId ?? null;
            setForm(parsedGoal);
            setImagePreview(goal.cover_image_url || null);
            setShowIconPicker(false);
            
            const cat = parsedGoal.category || 'other';
            if (cat === 'other') {
                setCategoryMode('other');
                setCustomCatText('');
            } else if (existingCustomCategories.includes(cat)) {
                setCategoryMode('existing');
                setCustomCatText(cat);
            } else {
                setCategoryMode('new');
                setCustomCatText(cat);
            }

            // Auto-expand advanced options if goal already has WOOP psychology
            const hasAdv = Boolean(
                parsedGoal.core_why ||
                parsedGoal.obstacle ||
                parsedGoal.obstacle_plan ||
                parsedGoal.reward
            );
            setShowAdvanced(hasAdv);
        } else {
            setForm({
                id: '',
                title: '',
                icon: '🎯',
                color: '#6366f1',
                type: 'milestones',
                status: 'active',
                priority: 'important',
                category: 'other',
                time_horizon: activeHorizon,
                is_north_star: false,
                parent_goal_id: null,
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
            setShowIconPicker(false);
            setCategoryMode('other');
            setCustomCatText('');
            setShowAdvanced(false);
        }
    }, [goal, show, isIndo, existingCustomCategories]);

    if (!show) return null;

    const HeaderIcon = Target;

    const formatDateDisplay = (dateStr?: string | null) => {
        if (!dateStr) return isIndo ? 'Pilih Tenggat Waktu' : 'Select Deadline';
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
        { id: 'milestones', label: isIndo ? 'Langkah / OKR' : 'Milestones', shortLabel: isIndo ? 'Langkah' : 'Steps', icon: ListTodo },
        { id: 'habit_frequency', label: isIndo ? 'Rutinitas Habit' : 'Habit Driven', shortLabel: isIndo ? 'Habit' : 'Habit', icon: Sparkles },
        { id: 'numeric', label: isIndo ? 'Hitung Angka' : 'Numeric', shortLabel: isIndo ? 'Angka' : 'Numeric', icon: Hash },
        { id: 'currency', label: isIndo ? 'Finansial (Rp/$)' : 'Financial', shortLabel: isIndo ? 'Finansial' : 'Finance', icon: DollarSign },
        { id: 'boolean', label: isIndo ? 'Sederhana' : 'Simple', shortLabel: isIndo ? 'Sederhana' : 'Simple', icon: CheckSquare },
    ];

    const goalIconPresets = [
        '🎯', '🚀', '⭐', '🏆', '🔥', '💡', '💰', '💼', 
        '📚', '🏋️', '🧘', '💻', '🎨', '✈️', '❤️', '🌱', 
        '🎓', '💎', '🔑', '📈', '⚡', '🎵', '🏠', '✨'
    ];

    const handleDeleteCategoryClick = (catName?: string | null) => {
        if (!catName || catName === 'other') return;
        const confirmMsg = isIndo 
            ? `Apakah Anda yakin ingin menghapus kategori "${catName}"? Semua target dengan kategori ini akan dipindahkan ke kategori "Lainnya / Umum".`
            : `Are you sure you want to delete category "${catName}"? All goals in this category will be moved to "Other / General".`;
        
        if (window.confirm(confirmMsg)) {
            if (form.category === catName) {
                setForm(prev => ({ ...prev, category: 'other' }));
                setCategoryMode('other');
                setCustomCatText('');
            }
            onDeleteCategory?.(catName);
        }
    };

    const hasAdvancedData = Boolean(
        form.core_why || 
        form.obstacle || 
        form.obstacle_plan || 
        form.reward
    );

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/75 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-3xl lg:max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[92vh] transition-colors border border-slate-200/80 dark:border-slate-800">
                    
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
                    <div className="p-5 sm:p-7 md:p-8 overflow-y-auto custom-scrollbar space-y-6 pb-28">
                        
                        {/* 1. Goal Title, Icon & North Star Pinning */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {isIndo ? 'Ikon & Judul Target' : 'Goal Icon & Title'} *
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, is_north_star: !prev.is_north_star }))}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                                        form.is_north_star
                                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400 shadow-sm'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                    }`}
                                >
                                    <Star size={13} className={form.is_north_star ? 'fill-amber-400 text-amber-500' : ''} />
                                    <span>{isIndo ? 'Bintang Utama (North Star)' : 'North Star Goal'}</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2.5 relative">
                                {/* Interactive Icon Picker Button */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowIconPicker(!showIconPicker)}
                                        title={isIndo ? "Klik untuk ganti ikon target" : "Click to change goal icon"}
                                        className="w-13 h-13 min-w-[3.25rem] min-h-[3.25rem] flex items-center justify-center text-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-2xl shadow-sm transition hover:scale-105 active:scale-95 group"
                                    >
                                        <span className="drop-shadow-xs group-hover:scale-110 transition-transform">{form.icon || '🎯'}</span>
                                    </button>

                                    {/* Icon Picker Popover */}
                                    {showIconPicker && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setShowIconPicker(false)} 
                                            />
                                            <div className="absolute left-0 top-full mt-2 z-50 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-64 sm:w-72 animate-in fade-in zoom-in-95 duration-150">
                                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                                        {isIndo ? 'Pilih Ikon Target' : 'Select Goal Icon'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowIconPicker(false)}
                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                {/* Presets Grid */}
                                                <div className="grid grid-cols-6 gap-1.5 mb-2.5">
                                                    {goalIconPresets.map((ico) => (
                                                        <button
                                                            key={ico}
                                                            type="button"
                                                            onClick={() => {
                                                                setForm(prev => ({ ...prev, icon: ico }));
                                                                setShowIconPicker(false);
                                                            }}
                                                            className={`w-9 h-9 flex items-center justify-center text-xl rounded-xl transition ${
                                                                (form.icon || '🎯') === ico
                                                                    ? 'bg-indigo-100 dark:bg-indigo-950 border border-indigo-400 scale-105 shadow-xs'
                                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                                            }`}
                                                        >
                                                            {ico}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Custom Emoji Input */}
                                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                                        {isIndo ? 'Atau ketik emoji sendiri:' : 'Or type custom emoji:'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        value={form.icon || ''}
                                                        onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value || '🎯' }))}
                                                        placeholder="🎯"
                                                        className="w-full text-center text-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1 font-bold outline-none focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Title Input */}
                                <input 
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-800 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition text-base shadow-sm"
                                    placeholder={isIndo ? 'Contoh: Baca 24 Buku Tahun Ini / Kumpul Dana Darurat 50jt...' : 'E.g. Read 24 Books This Year / Save $10k Emergency Fund...'} 
                                />
                            </div>
                        </div>

                        {/* 2. Target Type Selector (Compact 1-line segmented bar) */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {isIndo ? 'Model Pengukuran Progres' : 'Progress Measurement'}
                                </label>
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50">
                                    {form.type === 'milestones' ? (isIndo ? '📋 Checklist Langkah' : '📋 Steps Checklist') :
                                     form.type === 'habit_frequency' ? (isIndo ? '🌱 Otomatis dari Habit' : '🌱 Habit Auto-Sync') :
                                     form.type === 'numeric' ? (isIndo ? '🔢 Hitungan Angka' : '🔢 Numeric Counter') :
                                     form.type === 'currency' ? (isIndo ? '💰 Target Keuangan' : '💰 Financial Target') :
                                     (isIndo ? '✅ Sekali Selesai' : '✅ Single Milestone')}
                                </span>
                            </div>

                            <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl gap-1 border border-slate-200/80 dark:border-slate-800">
                                {targetTypes.map((tt) => {
                                    const TTIcon = tt.icon;
                                    const isSelected = form.type === tt.id;
                                    return (
                                        <button
                                            key={tt.id}
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, type: tt.id }))}
                                            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                isSelected
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <TTIcon size={14} className={isSelected ? 'text-white' : 'text-slate-400'} />
                                            <span className="text-[11px] font-black tracking-tight">{tt.shortLabel || tt.label}</span>
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono"
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
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
                                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white font-mono"
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
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                                        >
                                            <option value="IDR">IDR (Rp - Rupiah)</option>
                                            <option value="USD">USD ($ - Dollar)</option>
                                        </select>
                                    </div>

                                    {/* Link to Finance Savings Account */}
                                    {isFinanceActive && (
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
                                            className="w-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white shadow-sm"
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
                                    </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 5. Essential Parameters Grid (Horizon, Priority, Category, Deadline) */}
                        <div className="p-4 sm:p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
                            
                            {/* Row 1: Time Horizon & Priority */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Time Horizon */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                        {isIndo ? 'Horison Waktu' : 'Time Horizon'}
                                    </label>
                                    <div className="flex gap-1 p-1 bg-slate-150 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                        {[
                                            { id: 'weekly', label: isIndo ? 'Mingguan' : 'Weekly' },
                                            { id: 'monthly', label: isIndo ? 'Bulanan' : 'Monthly' },
                                            { id: 'quarterly', label: isIndo ? 'Kuartal' : 'Quarter' },
                                            { id: 'yearly', label: isIndo ? 'Tahunan' : 'Yearly' },
                                        ].map((th) => (
                                            <button 
                                                key={th.id}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, time_horizon: th.id }))}
                                                className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-black tracking-wider transition text-center shrink-0 ${
                                                    form.time_horizon === th.id 
                                                        ? 'bg-indigo-600 text-white shadow-md' 
                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/60'
                                                }`}
                                            >
                                                {th.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority Level */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                        {isIndo ? 'Tingkat Prioritas' : 'Priority Level'}
                                    </label>
                                    <div className="flex gap-1.5 p-1 bg-slate-150 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                        {[
                                            { id: 'vital', label: 'Vital 🔥' },
                                            { id: 'important', label: isIndo ? 'Penting' : 'Important' },
                                            { id: 'optional', label: isIndo ? 'Opsional' : 'Optional' }
                                        ].map((p) => (
                                            <button 
                                                key={p.id}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, priority: p.id }))}
                                                className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition capitalize ${
                                                    form.priority === p.id 
                                                        ? 'bg-indigo-600 text-white shadow-md' 
                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-800/60'
                                                }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Row 1b: Parent Goal (Target Induk) Hierarchy Selector */}
                            {form.time_horizon !== 'yearly' && (
                                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                                            <Link2 size={13} />
                                            {isIndo 
                                                ? (form.time_horizon === 'weekly' ? '🔗 Hubungkan ke Target Bulanan' : '🔗 Hubungkan ke Target Kuartal / Tahunan')
                                                : (form.time_horizon === 'weekly' ? '🔗 Link to Monthly Goal' : '🔗 Link to Quarterly / Yearly Goal')}
                                        </label>
                                        {form.parent_goal_id && (
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, parent_goal_id: null }))}
                                                className="text-[10px] font-bold text-rose-500 hover:underline"
                                            >
                                                {isIndo ? 'Jadikan Mandiri (Lepas Hubungan)' : 'Make Standalone (Unlink)'}
                                            </button>
                                        )}
                                    </div>

                                    {potentialParentGoals.length > 0 ? (
                                        <select
                                            value={form.parent_goal_id ? String(form.parent_goal_id) : ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setForm(prev => ({ ...prev, parent_goal_id: val ? Number(val) : null }));
                                            }}
                                            className="w-full bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm outline-none"
                                        >
                                            <option value="">
                                                {isIndo ? '🎯 Target Mandiri (Bukan sub-target / Standalone)' : '🎯 Standalone Goal (Not a sub-goal)'}
                                            </option>
                                            {potentialParentGoals.map(pg => {
                                                const horizonLabel = pg.time_horizon === 'yearly' ? (isIndo ? 'Tahunan' : 'Yearly') :
                                                    pg.time_horizon === 'quarterly' ? (isIndo ? 'Kuartal' : 'Quarterly') :
                                                    pg.time_horizon === 'monthly' ? (isIndo ? 'Bulanan' : 'Monthly') :
                                                    (isIndo ? 'Mingguan' : 'Weekly');
                                                return (
                                                    <option key={pg.id} value={pg.id}>
                                                        [{horizonLabel}] {pg.title}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    ) : (
                                        <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
                                            {form.time_horizon === 'weekly' 
                                                ? (isIndo ? '💡 Belum ada target Bulanan aktif. Buat target bulanan terlebih dahulu jika ingin menghubungkan target mingguan ini ke target bulanan.' : '💡 No active monthly goals to connect. Create a monthly goal first.')
                                                : (isIndo ? '💡 Belum ada target Kuartal atau Tahunan aktif. Buat target kuartal atau tahunan terlebih dahulu jika ingin menghubungkannya.' : '💡 No active quarterly or yearly goals to connect.')}
                                        </div>
                                    )}

                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                        {form.time_horizon === 'weekly'
                                            ? (isIndo ? 'Target mingguan dihubungkan ke target bulanan agar capaian mingguan otomatis mempercepat progres target bulanan.' : 'Link weekly target to a monthly goal so weekly progress drives monthly completion.')
                                            : (isIndo ? 'Target bulanan dihubungkan ke target kuartal/tahunan agar progres bulanan otomatis mempercepat capaian target induk.' : 'Link monthly target to quarterly or yearly goals.')}
                                    </p>
                                </div>
                            )}

                            {/* Row 2: Category & Color Theme */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category Custom Creator / Selector */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                            {isIndo ? 'Kategori Target' : 'Goal Category'}
                                        </label>
                                        {form.category !== 'other' && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCategoryMode('other');
                                                    setCustomCatText('');
                                                    setForm(prev => ({ ...prev, category: 'other' }));
                                                }}
                                                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                {isIndo ? 'Reset ke Lainnya (Other)' : 'Reset to Other'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <select
                                            value={categoryMode === 'new' ? '__new__' : (categoryMode === 'existing' ? form.category : 'other')}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'other') {
                                                    setCategoryMode('other');
                                                    setCustomCatText('');
                                                    setForm(prev => ({ ...prev, category: 'other' }));
                                                } else if (val === '__new__') {
                                                    setCategoryMode('new');
                                                    setCustomCatText('');
                                                    setForm(prev => ({ ...prev, category: '' }));
                                                } else {
                                                    setCategoryMode('existing');
                                                    setCustomCatText(val);
                                                    setForm(prev => ({ ...prev, category: val }));
                                                }
                                            }}
                                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm outline-none"
                                        >
                                            <option value="other">{isIndo ? '🎯 Lainnya / Umum (Other)' : '🎯 Other / General'}</option>
                                            {existingCustomCategories.map(cat => (
                                                <option key={cat} value={cat}>🏷️ {cat}</option>
                                            ))}
                                            <option value="__new__">{isIndo ? '➕ Buat Kategori Baru...' : '➕ Create New Category...'}</option>
                                        </select>

                                        {categoryMode === 'existing' && form.category && form.category !== 'other' && onDeleteCategory && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCategoryClick(form.category)}
                                                className="p-2.5 rounded-2xl text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 transition shadow-xs flex-shrink-0"
                                                title={isIndo ? `Hapus kategori "${form.category}"` : `Delete category "${form.category}"`}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>

                                    {categoryMode === 'new' && (
                                        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <input
                                                type="text"
                                                value={customCatText}
                                                onChange={(e) => {
                                                    const text = e.target.value;
                                                    setCustomCatText(text);
                                                    setForm(prev => ({ ...prev, category: text.trim() || 'other' }));
                                                }}
                                                placeholder={isIndo ? "Ketik nama kategori (contoh: Bisnis, Skripsi, YouTube)..." : "Type category name (e.g. Business, Thesis, YouTube)..."}
                                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-indigo-300 dark:border-indigo-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    {/* Saved Categories Chips with Delete Option */}
                                    {existingCustomCategories.length > 0 && (
                                        <div className="pt-2">
                                            <span className="text-[10px] font-bold text-slate-400 block mb-1.5">
                                                {isIndo ? 'Kategori Tersimpan:' : 'Saved Categories:'}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {existingCustomCategories.map(cat => (
                                                    <span 
                                                        key={cat} 
                                                        className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl text-xs font-bold border transition ${
                                                            form.category === cat
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                                                                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCategoryMode('existing');
                                                                setCustomCatText(cat);
                                                                setForm(prev => ({ ...prev, category: cat }));
                                                            }}
                                                            className="hover:underline"
                                                        >
                                                            🏷️ {cat}
                                                        </button>
                                                        {onDeleteCategory && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteCategoryClick(cat)}
                                                                className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition"
                                                                title={isIndo ? `Hapus kategori "${cat}"` : `Delete category "${cat}"`}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Color Theme Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <Palette size={13} />
                                        {isIndo ? 'Warna Tema Target' : 'Goal Color Theme'}
                                    </label>
                                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                                        {colorOptions.map((c) => (
                                            <button 
                                                key={c}
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                                className={`w-6 h-6 rounded-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                                                    form.color === c ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-indigo-500 shadow-sm scale-105' : 'opacity-70 hover:opacity-100'
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

                            {/* Row 3: Dates Side-by-Side (Tanggal Mulai & Tenggat Waktu Akhir) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                                {/* Start Date */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <Calendar size={13} className="text-indigo-500" />
                                        {isIndo ? 'Tanggal Mulai' : 'Start Date'}
                                    </label>
                                    <div className="relative">
                                        <button 
                                            type="button" 
                                            onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm hover:border-indigo-400"
                                        >
                                            <span>{formatDateDisplay(form.start_date)}</span>
                                            <Calendar className="w-4 h-4 text-indigo-500" />
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

                                {/* Target Deadline */}
                                <div className="space-y-1.5 relative">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                                            <Zap size={13} className="text-rose-500" />
                                            {isIndo ? 'Tenggat Waktu Akhir' : 'Target Deadline'}
                                        </label>
                                        {form.end_date && (
                                            <button 
                                                type="button" 
                                                onClick={() => setForm(prev => ({ ...prev, end_date: null }))}
                                                className="text-[10px] font-bold text-rose-500 hover:underline"
                                            >
                                                {isIndo ? 'Kosongkan' : 'Clear'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button 
                                            type="button" 
                                            onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm hover:border-indigo-400"
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

                        </div>

                        {/* 6. Eksekusi Target: Pilihan antara Checklist Langkah vs Hubungkan ke Habit */}
                        {(form.type === 'milestones' || form.type === 'habit_frequency') && (
                            <div className="pt-2 space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                        {isIndo ? 'Pilih Metode Eksekusi Target' : 'Select Target Execution Method'}
                                    </label>
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 font-mono">
                                        {form.type === 'milestones' 
                                            ? (isIndo ? `📋 ${form.milestones?.length || 0} Langkah` : `📋 ${form.milestones?.length || 0} Steps`)
                                            : (isIndo ? `🌱 ${form.linked_habit_ids?.length || 0} Habit Terpilih` : `🌱 ${form.linked_habit_ids?.length || 0} Habits Selected`)}
                                    </span>
                                </div>

                                {/* 2-Option Segmented Selector */}
                                <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl gap-1.5 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, type: 'milestones' }))}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            form.type === 'milestones'
                                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <ListTodo size={15} className={form.type === 'milestones' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                                        <span className="font-black tracking-tight">{isIndo ? '📋 Checklist Langkah' : '📋 Milestone Steps'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ 
                                            ...prev, 
                                            type: 'habit_frequency',
                                            target_value: prev.target_value && prev.target_value > 0 ? prev.target_value : 30,
                                            unit: isIndo ? 'centang' : 'checks'
                                        }))}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            form.type === 'habit_frequency'
                                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        <Sparkles size={15} className={form.type === 'habit_frequency' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                                        <span className="font-black tracking-tight">{isIndo ? '🌱 Hubungkan ke Habit' : '🌱 Connect to Habits'}</span>
                                    </button>
                                </div>

                                {/* Content A: Checklist Langkah */}
                                {form.type === 'milestones' && (
                                    <GoalMilestonesSection
                                        form={form}
                                        setForm={setForm}
                                        t={() => ''}
                                    />
                                )}

                                {/* Content B: Hubungkan ke Habit */}
                                {form.type === 'habit_frequency' && isHabitActive && (
                                    <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-800/60 space-y-4">
                                        
                                        {/* B.1. Pengaturan Target Jumlah Centang (Opsi Berapa Kali Centang) */}
                                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 shadow-xs space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <label className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                                                        <Target size={14} className="text-indigo-500" />
                                                        {isIndo ? 'Target Jumlah Centang Habit Dibutuhkan' : 'Habit Check-Ins Target Required'}
                                                    </label>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                                        {isIndo 
                                                            ? 'Berapa kali centang kebiasaan yang harus tercapai agar target ini 100% selesai?'
                                                            : 'How many total habit check-ins are required to achieve 100% completion?'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                                    <input 
                                                        type="number"
                                                        min="1"
                                                        value={form.target_value || 30}
                                                        onChange={(e) => setForm(prev => ({ 
                                                            ...prev, 
                                                            target_value: Math.max(1, Number(e.target.value)),
                                                            unit: isIndo ? 'centang' : 'checks'
                                                        }))}
                                                        className="w-20 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 rounded-xl px-2.5 py-1.5 text-sm font-black text-indigo-700 dark:text-indigo-300 font-mono text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        {isIndo ? 'kali centang' : 'checks'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pilihan Preset Cepat */}
                                            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                                <span className="text-[10px] font-bold text-slate-400 mr-1">
                                                    {isIndo ? 'Preset Cepat:' : 'Quick Presets:'}
                                                </span>
                                                {[
                                                    { count: 7, label: isIndo ? '7x (1 Mgg)' : '7x (1 Wk)' },
                                                    { count: 14, label: isIndo ? '14x (2 Mgg)' : '14x (2 Wks)' },
                                                    { count: 30, label: isIndo ? '30x (1 Bulan)' : '30x (1 Mo)' },
                                                    { count: 60, label: isIndo ? '60x (2 Bulan)' : '60x (2 Mos)' },
                                                    { count: 90, label: isIndo ? '90x (1 Kuartal)' : '90x (1 Qtr)' },
                                                    { count: 100, label: '100x' }
                                                ].map((preset) => (
                                                    <button
                                                        key={preset.count}
                                                        type="button"
                                                        onClick={() => setForm(prev => ({ 
                                                            ...prev, 
                                                            target_value: preset.count,
                                                            unit: isIndo ? 'centang' : 'checks'
                                                        }))}
                                                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                                                            Number(form.target_value) === preset.count
                                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                                        }`}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* B.2. Pilih Kebiasaan Penggerak Utama */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                                    <Sparkles size={14} />
                                                    {isIndo ? 'Pilih Kebiasaan Penggerak Utama' : 'Select Primary Supporting Habits'}
                                                </span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono">
                                                    {form.linked_habit_ids?.length || 0} {isIndo ? 'terpilih' : 'selected'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                                {isIndo 
                                                    ? '🎯 Centang harian pada kebiasaan yang dipilih otomatis diakumulasikan terhadap target centang di atas dalam rentang tanggal target.'
                                                    : '🎯 Daily check-ins on selected habits will accumulate toward the check-in target above within the goal date window.'}
                                            </p>
                                        </div>

                                        {uniqueHabits.length === 0 ? (
                                            <div className="text-xs text-slate-400 italic py-2">
                                                {isIndo ? 'Belum ada kebiasaan aktif. Buat kebiasaan terlebih dahulu di tab Habits.' : 'No active habits found. Create a habit first in the Habits tab.'}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                                {uniqueHabits.map((h: any) => {
                                                    const isSelected = form.linked_habit_ids?.some(id => 
                                                        String(id) === String(h.id) || (Array.isArray(h.allIds) && h.allIds.some((aid: any) => String(id) === String(aid)))
                                                    );
                                                    const freqBadge = (h.frequencyType === 'weekly_days' && Array.isArray(h.frequencyDays) && h.frequencyDays.length > 0)
                                                        ? `${h.frequencyDays.length}x/mgg`
                                                        : (h.frequencyCount && h.frequencyCount > 0 ? `${h.frequencyCount}x/mgg` : (isIndo ? 'Harian' : 'Daily'));
                                                    return (
                                                        <button
                                                            key={h.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setForm(prev => {
                                                                    const currentIds = prev.linked_habit_ids || [];
                                                                    const idsToRemove = new Set([String(h.id), ...(h.allIds || []).map((aid: any) => String(aid))]);
                                                                    const exists = currentIds.some(id => idsToRemove.has(String(id)));
                                                                    const nextIds = exists 
                                                                        ? currentIds.filter(id => !idsToRemove.has(String(id)))
                                                                        : [...currentIds, h.id];
                                                                    return { ...prev, linked_habit_ids: nextIds };
                                                                });
                                                            }}
                                                            className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2 text-left active:scale-95 border ${
                                                                isSelected
                                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400/40'
                                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/20'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                <span className="w-8 h-8 rounded-xl bg-white/20 dark:bg-slate-800/80 flex items-center justify-center text-sm shrink-0">
                                                                    {h.icon || '🌱'}
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <span className="truncate text-xs font-bold block">{h.name}</span>
                                                                    <span className={`text-[10px] font-black uppercase tracking-wider block ${
                                                                        isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                                                                    }`}>
                                                                        ⚡ {freqBadge}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {isSelected && <CheckCircle2 size={16} className="shrink-0 text-white" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 7. Collapsible Advanced Options Accordion */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full py-3.5 px-5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-between group shadow-sm"
                            >
                                <div className="flex items-center gap-2.5">
                                    <SlidersHorizontal size={15} className="text-indigo-500 group-hover:rotate-45 transition-transform" />
                                    <div className="text-left">
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 block">
                                            {isIndo ? '⚙️ Opsi Lanjutan & Psikologi (Opsional)' : '⚙️ Advanced Options & Psychology (Optional)'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 block font-normal">
                                            {isIndo ? 'Psikologi pencapaian & motivasi (WOOP)' : 'WOOP psychology & motivation'}
                                        </span>
                                    </div>
                                    {hasAdvancedData && !showAdvanced && (
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                            {isIndo ? 'Terisi' : 'Configured'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <span className="text-[11px] font-bold">{showAdvanced ? (isIndo ? 'Tutup' : 'Collapse') : (isIndo ? 'Buka' : 'Expand')}</span>
                                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/30 border border-slate-200/80 dark:border-slate-800 space-y-6 animate-in fade-in duration-200">
                                    
                                    {/* Advanced Item: Psychological & WOOP Fields */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                            <Compass size={15} />
                                            {isIndo ? 'Psikologi Pencapaian & Motivasi (WOOP)' : 'Goal Psychology & Motivation (WOOP)'}
                                        </span>

                                        {/* Core Motivation */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {isIndo ? 'Alasan Utama ("The Why")' : 'The Core Motivation ("The Why")'}
                                            </label>
                                            <textarea
                                                value={form.core_why || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, core_why: e.target.value }))}
                                                rows={2}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                placeholder={isIndo ? 'Mengapa target ini sangat berarti dan tidak boleh gagal?' : 'Why is this goal non-negotiable for your life?'}
                                            />
                                        </div>

                                        {/* Obstacle & Plan */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                    <ShieldAlert size={12} />
                                                    {isIndo ? 'Potensi Rintangan Terbesar' : 'Biggest Obstacle'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={form.obstacle || ''}
                                                    onChange={(e) => setForm(prev => ({ ...prev, obstacle: e.target.value }))}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                    placeholder={isIndo ? 'Jika terjadi, saya akan...' : 'If it happens, I will...'}
                                                />
                                            </div>
                                        </div>

                                        {/* Self-Reward */}
                                        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                                <Award size={13} />
                                                {isIndo ? 'Hadiah Kemenangan (Victory Self-Reward)' : 'Victory Self-Reward'}
                                            </label>
                                            <input 
                                                type="text"
                                                value={form.reward || ''}
                                                onChange={(e) => setForm(prev => ({ ...prev, reward: e.target.value }))}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                                placeholder={isIndo ? 'Rayakan saat 100% tercapai (contoh: Liburan 3 hari / Dinner mewah)' : 'Reward yourself when done (e.g. Weekend getaway / Special dinner)'}
                                            />
                                        </div>
                                    </div>



                                </div>
                            )}
                        </div>

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
