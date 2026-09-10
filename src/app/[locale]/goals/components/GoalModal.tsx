'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { 
    Target, Calendar, Award, Zap, CheckCircle2, Star, 
    Hash, DollarSign, ListTodo, CheckSquare, Compass, 
    ShieldAlert, Sparkles, Flag
} from 'lucide-react';
import GoalDatePicker from './GoalDatePicker';
import { GoalItem } from './GoalCard';
import ModalPortal from '@/components/ModalPortal';
import GoalModalHeader from './GoalModalHeader';
import GoalArchetypesGrid, { archetypes } from './GoalArchetypesGrid';
import GoalMilestonesSection from './GoalMilestonesSection';

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
        milestones: []
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedArchetype, setSelectedArchetype] = useState('other');

    useEffect(() => {
        if (goal) {
            setForm(JSON.parse(JSON.stringify(goal)));
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
                milestones: []
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
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        setForm(prev => ({ ...prev, cover_image_url: url }));
        onUploadImage?.(file);
        setIsUploading(false);
    };

    const colorOptions = [
        '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', 
        '#0ea5e9', '#0f172a', '#ef4444', '#84cc16', '#14b8a6', 
        '#ec4899', '#6b7280', '#eab308', '#d946ef'
    ];

    const targetTypes = [
        { id: 'milestones', label: isIndo ? 'Langkah / OKR' : 'Milestones / OKR', icon: ListTodo, desc: isIndo ? 'Daftar checklist langkah terstruktur' : 'Structured checklist steps' },
        { id: 'numeric', label: isIndo ? 'Angka / Metrik' : 'Numeric Counter', icon: Hash, desc: isIndo ? 'Target buku, km, sesi, halaman' : 'Count books, km, pages, sessions' },
        { id: 'currency', label: isIndo ? 'Finansial (Rp/$)' : 'Currency Goal', icon: DollarSign, desc: isIndo ? 'Tabungan, investasi, aset uang' : 'Savings, emergency funds, revenue' },
        { id: 'boolean', label: isIndo ? 'Sederhana' : 'Simple Done', icon: CheckSquare, desc: isIndo ? 'Target 1 kali selesai' : 'Single milestone accomplishment' },
    ];

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] transition-colors border border-slate-200/80 dark:border-slate-800">
                    
                    <GoalModalHeader
                        goal={goal}
                        form={form}
                        imagePreview={imagePreview}
                        isUploading={isUploading}
                        HeaderIcon={HeaderIcon}
                        t={() => ''}
                        onClose={onClose}
                        onUploadClick={() => fileInputRef.current?.click()}
                        fileInputRef={fileInputRef}
                        onFileChange={onFileChange}
                    />

                    {/* Modal Form Scrollable Area */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 pb-32">
                        
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
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-800 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition text-base sm:text-lg shadow-sm"
                                placeholder={isIndo ? 'Contoh: Baca 24 Buku Tahun Ini / Kumpul Dana Darurat 50jt...' : 'E.g. Read 24 Books This Year / Save $10k Emergency Fund...'} 
                            />
                        </div>

                        {/* 2. Target Type Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                {isIndo ? 'Tipe Target' : 'Goal Type'}
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                                            <TTIcon size={18} className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
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

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                            {isIndo ? 'Nominal Saat Ini' : 'Current Amount'}
                                        </label>
                                        <input 
                                            type="number"
                                            value={form.current_value || 0}
                                            onChange={(e) => setForm(prev => ({ ...prev, current_value: Number(e.target.value) }))}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono"
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
                                </div>
                            </div>
                        )}

                        {/* 5. Archetype Template Selection */}
                        <GoalArchetypesGrid
                            selectedArchetype={selectedArchetype}
                            onSelectArchetype={selectArchetype}
                            t={() => ''}
                        />

                        {/* 6. Priority & Time Horizon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {isIndo ? 'Tingkat Prioritas' : 'Priority Level'}
                                </label>
                                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                    {['vital', 'important', 'optional'].map((p) => (
                                        <button 
                                            key={p}
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition capitalize ${
                                                form.priority === p 
                                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                                                    : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                        >
                                            {p === 'vital' ? 'Vital 🔥' : p === 'important' ? (isIndo ? 'Penting' : 'Important') : 'Optional'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {isIndo ? 'Horison Waktu' : 'Time Horizon'}
                                </label>
                                <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                                    {[
                                        { id: 'sprint', label: isIndo ? 'Sprint' : 'Sprint' },
                                        { id: 'quarterly', label: isIndo ? 'Kuartal' : 'Quarter' },
                                        { id: 'yearly', label: isIndo ? 'Tahunan' : 'Yearly' },
                                        { id: 'lifetime', label: isIndo ? 'Vision' : 'Lifetime' },
                                    ].map((th) => (
                                        <button 
                                            key={th.id}
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, time_horizon: th.id }))}
                                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-wider transition ${
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

                        {/* 7. Start Date & Target Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-50">
                            <div className="space-y-1.5 relative">
                                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                    {isIndo ? 'Tanggal Mulai' : 'Start Date'}
                                </label>
                                <div className="relative">
                                    <button 
                                        type="button" 
                                        onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm"
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
                                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-slate-700 dark:text-slate-200 font-bold text-left transition flex justify-between items-center text-xs shadow-sm"
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

                        {/* 8. Psychological & WOOP Fields */}
                        <div className="p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                                <Compass size={16} />
                                {isIndo ? 'Psikologi Pencapaian & Motivasi (The Why & WOOP)' : 'Goal Psychology & WOOP Pre-Mortem'}
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
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 outline-none"
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
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
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
                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                                        placeholder={isIndo ? 'Jika terjadi, saya akan...' : 'If it happens, I will...'}
                                    />
                                </div>
                            </div>

                            {/* Self-Reward */}
                            <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                    <Award size={13} />
                                    {isIndo ? 'Hadiah Kemenangan (Victory Self-Reward)' : 'Victory Self-Reward'}
                                </label>
                                <input 
                                    type="text"
                                    value={form.reward || ''}
                                    onChange={(e) => setForm(prev => ({ ...prev, reward: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                                    placeholder={isIndo ? 'Rayakan saat 100% tercapai (contoh: Liburan 3 hari / Dinner mewah)' : 'Reward yourself when done (e.g. Weekend getaway / Special dinner)'}
                                />
                            </div>
                        </div>

                        {/* 9. Milestones Section (if type is milestones) */}
                        {form.type === 'milestones' && (
                            <GoalMilestonesSection
                                form={form}
                                setForm={setForm}
                                t={() => ''}
                            />
                        )}

                        {/* 10. Color Theme Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                {isIndo ? 'Warna Tema Target' : 'Goal Color Theme'}
                            </label>
                            <div className="flex flex-wrap gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                                {colorOptions.map((c) => (
                                    <button 
                                        key={c}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                        className={`w-8 h-8 rounded-xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                                            form.color === c ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-indigo-500/30 shadow-md' : 'opacity-70 hover:opacity-100'
                                        }`}
                                        style={{ backgroundColor: c }}
                                    >
                                        {form.color === c && (
                                            <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-900 shrink-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 relative z-50">
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
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-7 py-3 rounded-2xl font-black text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
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
