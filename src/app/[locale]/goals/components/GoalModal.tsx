'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { 
    X, Upload, Target, Calendar, Award, Zap, CheckCircle2, 
    Heart, DollarSign, Briefcase, GraduationCap, Sparkles, 
    Users, Plane, Palette, Dumbbell, Music, Code, Camera, 
    BookOpen, Gamepad2, Plus 
} from 'lucide-react';
import GoalDatePicker from './GoalDatePicker';
import MilestoneItem, { Milestone } from './MilestoneItem';
import { GoalItem } from './GoalCard';

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
    show, goal, onClose, onSave, onUploadImage, processing, errors = {}
}: GoalModalProps) {
    const t = useTranslations();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<GoalItem>({
        id: '',
        title: '',
        color: '#6366f1',
        type: 'daily',
        status: 'active',
        priority: 'important',
        reward: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        cover_image_url: '',
        category: 'other',
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
                type: 'daily',
                status: 'active',
                priority: 'important',
                reward: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: null,
                cover_image_url: '',
                category: 'other',
                milestones: []
            });
            setImagePreview(null);
            setSelectedArchetype('other');
        }
    }, [goal, show]);

    if (!show) return null;

    const archetypes = [
        { id: 'fitness', icon: Dumbbell, color: '#f43f5e', label: 'Fitness' },
        { id: 'wealth', icon: DollarSign, color: '#10b981', label: 'Wealth' },
        { id: 'career', icon: Briefcase, color: '#6366f1', label: 'Career' },
        { id: 'learning', icon: GraduationCap, color: '#8b5cf6', label: 'Learning' },
        { id: 'spiritual', icon: Sparkles, color: '#f59e0b', label: 'Spiritual' },
        { id: 'social', icon: Users, color: '#0ea5e9', label: 'Social' },
        { id: 'travel', icon: Plane, color: '#ec4899', label: 'Travel' },
        { id: 'creative', icon: Palette, color: '#f97316', label: 'Creative' },
        { id: 'health', icon: Heart, color: '#ef4444', label: 'Health' },
        { id: 'coding', icon: Code, color: '#14b8a6', label: 'Coding' },
        { id: 'music', icon: Music, color: '#d946ef', label: 'Music' },
        { id: 'reading', icon: BookOpen, color: '#84cc16', label: 'Reading' },
        { id: 'photography', icon: Camera, color: '#6b7280', label: 'Photography' },
        { id: 'gaming', icon: Gamepad2, color: '#eab308', label: 'Gaming' },
        { id: 'other', icon: Target, color: '#0f172a', label: 'Other' },
    ];

    const selectArchetype = (arch: typeof archetypes[0]) => {
        setSelectedArchetype(arch.id);
        setForm(prev => ({ ...prev, color: arch.color, category: arch.id }));
    };

    const currentHeaderIcon = () => {
        const found = archetypes.find(a => a.id === form.category);
        return found ? found.icon : Target;
    };

    const HeaderIcon = currentHeaderIcon();

    const safeTrans = (key: string, fallback: string) => {
        try {
            return t(key) || fallback;
        } catch {
            return fallback;
        }
    };

    const formatDateDisplay = (dateStr?: string | null) => {
        if (!dateStr) return safeTrans('goal_ph_date', 'Pilih Tanggal');
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const handleSave = () => {
        if (!form.title?.trim()) {
            alert(t('warn_empty_title') || 'Judul Wajib Diisi! Masa impian nggak ada namanya? Kasih judul dong!');
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

    return (
        // 1:1 from GoalModal.vue line 153-375
        <ModalPortal><div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] transition-colors duration-500">
                
                {/* Modal Header Cover */}
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950 shrink-0 group rounded-t-[2.5rem] overflow-hidden">
                    {imagePreview ? (
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                            <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white/10" style={{ backgroundImage: `linear-gradient(to bottom right, ${form.color || '#6366f1'}, #4f46e5)` }}>
                            <HeaderIcon className="w-24 h-24 stroke-[1] animate-pulse" />
                        </div>
                    )}

                    <div className="absolute inset-x-6 bottom-5 flex justify-between items-end">
                        <div className="flex-grow min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-black tracking-tight mb-1.5">
                                {goal?.id ? (t('goal_edit') || 'Update vision') : (t('goal_new') || 'Create new vision')}
                            </span>
                            <h2 className="text-2xl font-black text-white drop-shadow-md truncate pr-4">
                                {form.title || (t('goal_placeholder_title') || 'What is your dream?')}
                            </h2>
                        </div>
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 w-11 h-11 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110 active:scale-95 shadow-xl"
                            title="Unggah Gambar Cover"
                        >
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Upload className="w-4.5 h-4.5" />
                            )}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
                    </div>

                    <button type="button" onClick={onClose} className="absolute top-5 right-5 w-9 h-9 bg-black/20 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
                        <X className="w-4.5 h-4.5" />
                    </button>
                </div>

                {/* Modal Form Scrollable Area — 1:1 from GoalModal.vue line 191 */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 pb-40">
                    
                    {/* Goal Title Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                            {t('goal_label_title') || 'Goal title'}
                        </label>
                        <div className="relative group">
                            <input 
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl px-5 py-5 text-slate-700 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all text-lg shadow-sm ${
                                    errors.title ? '!border-rose-300 !bg-rose-50 !text-rose-600 dark:!bg-rose-500/10 dark:!text-rose-400' : ''
                                }`}
                                placeholder={t('goal_placeholder_title') || 'Tuliskan impianmu disini...'} 
                            />
                            <Target className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                        </div>
                    </div>

                    {/* Archetype Template Selection */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                            {t('goal_archetypes') || 'Choose template'}
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {archetypes.map((arch) => {
                                const ArchIcon = arch.icon;
                                const isSelected = selectedArchetype === arch.id;
                                return (
                                    <button 
                                        key={arch.id}
                                        type="button"
                                        onClick={() => selectArchetype(arch)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 group ${
                                            isSelected 
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                                                : 'border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                    >
                                        <ArchIcon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                                        <span className={`text-[8px] font-black text-center mt-2 leading-tight transition-colors ${
                                            isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
                                        }`}>
                                            {arch.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Priority & Reward */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                                {t('goal_label_priority') || 'Priority'}
                            </label>
                            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                                {['vital', 'important', 'optional'].map((p) => (
                                    <button 
                                        key={p}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-tight transition-all capitalize ${
                                            form.priority === p 
                                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                                {t('goal_label_reward') || 'Self reward'}
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text"
                                    value={form.reward || ''}
                                    onChange={(e) => setForm(prev => ({ ...prev, reward: e.target.value }))}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent rounded-2xl px-5 py-4 text-slate-700 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                    placeholder={t('goal_placeholder_reward') || 'Rayakan saat tercapai!'} 
                                />
                                <Award className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Color Theme Selector */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                            {t('goal_label_color') || 'Goal color theme'}
                        </label>
                        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100/50 dark:border-slate-800 shadow-inner transition-colors duration-500">
                            {colorOptions.map((c) => (
                                <button 
                                    key={c}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, color: c }))}
                                    className={`w-10 h-10 rounded-2xl transition-all group relative flex items-center justify-center overflow-hidden hover:scale-110 active:scale-90 ${
                                        form.color === c ? 'ring-4 ring-offset-4 dark:ring-offset-slate-800 ring-indigo-500/20 shadow-xl' : 'opacity-60 hover:opacity-100 dark:ring-offset-slate-900'
                                    }`}
                                    style={{ backgroundColor: c }}
                                >
                                    {form.color === c && (
                                        <CheckCircle2 className="w-5 h-5 text-white dark:text-slate-100 drop-shadow-md" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Date & Target Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-50">
                        <div className="space-y-2 relative">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                                {t('goal_label_start') || 'Start date'}
                            </label>
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowStartPicker(!showStartPicker); setShowEndPicker(false); }}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold text-left transition-all flex justify-between items-center group shadow-sm"
                                >
                                    <span>{formatDateDisplay(form.start_date)}</span>
                                    <Calendar className="w-4.5 h-4.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500" />
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

                        <div className="space-y-2 relative">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight ml-1">
                                {t('goal_label_end') || 'Target deadline'}
                            </label>
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowEndPicker(!showEndPicker); setShowStartPicker(false); }}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold text-left transition-all flex justify-between items-center group shadow-sm"
                                >
                                    <span className={!form.end_date ? 'text-slate-300 dark:text-slate-600' : ''}>
                                        {formatDateDisplay(form.end_date)}
                                    </span>
                                    <Zap className={`w-4.5 h-4.5 ${form.end_date ? 'text-rose-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-rose-400'}`} />
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

                    {/* Milestones Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight">
                                {t('goal_milestones_title') || 'Mastery steps'}
                            </label>
                            <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                                {form.milestones?.length || 0} Steps
                            </span>
                        </div>

                        <div className="space-y-3">
                            {form.milestones?.map((m, idx) => (
                                <MilestoneItem 
                                    key={m.id || idx} 
                                    milestone={m}
                                    onSave={(data) => {
                                        setForm(prev => {
                                            const updated = [...(prev.milestones || [])];
                                            updated[idx] = { ...updated[idx], ...data };
                                            return { ...prev, milestones: updated };
                                        });
                                    }}
                                    onUpdateTitle={(newTitle) => {
                                        setForm(prev => {
                                            const updated = [...(prev.milestones || [])];
                                            updated[idx] = { ...updated[idx], title: newTitle };
                                            return { ...prev, milestones: updated };
                                        });
                                    }}
                                    onToggle={() => {
                                        setForm(prev => {
                                            const updated = [...(prev.milestones || [])];
                                            const nextVal = !updated[idx].is_completed;
                                            updated[idx] = { ...updated[idx], is_completed: nextVal, completed: nextVal };
                                            return { ...prev, milestones: updated };
                                        });
                                    }}
                                    onDelete={() => {
                                        setForm(prev => ({
                                            ...prev,
                                            milestones: (prev.milestones || []).filter((_, i) => i !== idx)
                                        }));
                                    }}
                                />
                            ))}
                            
                            <button 
                                type="button" 
                                onClick={() => {
                                    setForm(prev => ({
                                        ...prev,
                                        milestones: [
                                            ...(prev.milestones || []),
                                            {
                                                id: null,
                                                title: t('goal_untitled_step') || 'Untitled Step',
                                                is_completed: false,
                                                completed: false,
                                                target_date: null
                                            }
                                        ]
                                    }));
                                }} 
                                className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 group/add shadow-sm"
                            >
                                <Plus className="w-4 h-4 group-hover/add:rotate-90 transition-transform" />
                                <span className="text-[11px] font-black tracking-tight">{t('goal_btn_add_milestone') || 'Add Step'}</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/80 dark:bg-slate-900/90 shrink-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 relative z-50 transition-colors duration-500">
                    <button type="button" onClick={onClose} className="text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-tight hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-4 py-2">
                        {t('btn_cancel') || 'Cancel'}
                    </button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        disabled={processing}
                        className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black tracking-tight text-[11px] shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/40 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {goal?.id ? (t('goal_btn_save') || 'Update vision') : (t('goal_btn_create') || 'Manifest goal')}
                    </button>
                </div>

            </div>
        </div></ModalPortal>
    );
}
