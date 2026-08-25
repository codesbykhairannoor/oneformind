'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Calendar, Clock, AlignLeft, Tag, Palette } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import GoalDatePicker from '../../goals/components/GoalDatePicker';
import { CalendarEvent } from './CalendarGrid';

interface CalendarEventModalProps {
    show: boolean;
    event?: CalendarEvent | null;
    initialDate?: string;
    onClose: () => void;
    onSubmit: (form: CalendarEvent) => void;
}

export default function CalendarEventModal({
    show, event, initialDate, onClose, onSubmit
}: CalendarEventModalProps) {
    const t = useTranslations();

    const [form, setForm] = useState<CalendarEvent>({
        id: '',
        title: '',
        start_date: initialDate || new Date().toISOString().split('T')[0],
        end_date: '',
        start_time: '09:00',
        end_time: '10:00',
        is_all_day: false,
        color: '#4f46e5',
        description: ''
    });

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    useEffect(() => {
        if (event) {
            setForm({
                id: event.id || '',
                title: event.title || '',
                start_date: event.start_date || initialDate || new Date().toISOString().split('T')[0],
                end_date: event.end_date || '',
                start_time: event.start_time || '09:00',
                end_time: event.end_time || '10:00',
                is_all_day: !!event.is_all_day,
                color: event.color || '#4f46e5',
                description: event.description || ''
            });
        } else {
            setForm({
                id: '',
                title: '',
                start_date: initialDate || new Date().toISOString().split('T')[0],
                end_date: '',
                start_time: '09:00',
                end_time: '10:00',
                is_all_day: false,
                color: '#4f46e5',
                description: ''
            });
        }
    }, [event, initialDate, show]);

    if (!show) return null;

    const safeTrans = (key: string, fallback: string) => {
        try {
            return t(key) || fallback;
        } catch {
            return fallback;
        }
    };

    const dateDisplay = (dateString?: string, fallback = 'Select date') => {
        if (!dateString) return fallback;
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const colorOptions = [
        { value: '#4f46e5', label: 'Indigo' }, 
        { value: '#0ea5e9', label: 'Sky' },    
        { value: '#10b981', label: 'Emerald' }, 
        { value: '#f59e0b', label: 'Amber' },  
        { value: '#f43f5e', label: 'Rose' },   
        { value: '#8b5cf6', label: 'Purple' }, 
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            alert(t('warn_empty_title') || 'Judul event tidak boleh kosong!');
            return;
        }
        onSubmit(form);
    };

    return (
        // 1:1 from CalendarEventModal.vue line 35-146
        <ModalPortal><div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 transition-opacity" onClick={onClose}></div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/50 dark:ring-slate-800 transition-colors duration-500">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100/80 dark:border-slate-800 flex items-center justify-between transition-colors duration-500">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-4 transition-colors duration-500">
                        <span className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: form.color }}></span>
                        {form.id ? (t('calendar_edit_event') || 'Edit event') : (t('calendar_new_event') || 'Create new event')}
                    </h3>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-[1rem] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Inputs */}
                <div className="p-8 overflow-y-auto space-y-6 bg-slate-50/20 dark:bg-slate-950/20">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 transition-colors duration-500 ml-1 tracking-widest uppercase">
                            {t('label_title') || 'Event title'} <span className="text-rose-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={form.title}
                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-800 dark:text-white font-black text-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-colors duration-500 shadow-sm" 
                            placeholder={t('ph_event_title') || 'E.g. Strategy session'} 
                            required 
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="relative">
                            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 transition-colors duration-500 ml-1 tracking-widest uppercase">
                                {t('label_start_date') || 'Start date'}
                            </label>
                            <button 
                                type="button" 
                                onClick={() => { setShowStartDatePicker(!showStartDatePicker); setShowEndDatePicker(false); }} 
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-300 font-bold hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex items-center justify-between transition-colors duration-500 shadow-sm"
                            >
                                <span className="truncate">{dateDisplay(form.start_date, safeTrans('select_date', 'Select date'))}</span>
                                <span className="text-slate-400 dark:text-slate-600 opacity-50">📅</span>
                            </button>
                            
                            <GoalDatePicker 
                                show={showStartDatePicker}
                                teleport={false}
                                modelValue={form.start_date}
                                onUpdateModelValue={(val) => { setForm(prev => ({ ...prev, start_date: val })); setShowStartDatePicker(false); }}
                                onClose={() => setShowStartDatePicker(false)}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 transition-colors duration-500 ml-1 tracking-widest uppercase">
                                {safeTrans('label_end_date', 'End date')}
                            </label>
                            <button 
                                type="button" 
                                onClick={() => { setShowEndDatePicker(!showEndDatePicker); setShowStartDatePicker(false); }} 
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-300 font-bold hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex items-center justify-between transition-colors duration-500 shadow-sm"
                            >
                                <span className="truncate">{form.end_date ? dateDisplay(form.end_date) : safeTrans('optional', 'Optional')}</span>
                                {form.end_date ? (
                                    <span onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, end_date: '' })); }} className="text-rose-400 hover:text-rose-600 transition-colors z-10 p-1">✕</span>
                                ) : (
                                    <span className="text-slate-400 dark:text-slate-600 opacity-50">📅</span>
                                )}
                            </button>

                            <GoalDatePicker 
                                show={showEndDatePicker}
                                teleport={false}
                                modelValue={form.end_date}
                                onUpdateModelValue={(val) => { setForm(prev => ({ ...prev, end_date: val })); setShowEndDatePicker(false); }}
                                onClose={() => setShowEndDatePicker(false)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-3 transition-colors duration-500 ml-1 tracking-widest uppercase">
                            {t('label_color') || 'Pick a category color'}
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {colorOptions.map((c) => (
                                <button 
                                    key={c.value} 
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, color: c.value }))}
                                    className={`w-10 h-10 rounded-2xl transition-all border-4 flex items-center justify-center shadow-sm ${
                                        form.color === c.value ? 'scale-110' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'
                                    }`}
                                    style={{
                                        backgroundColor: c.value,
                                        borderColor: form.color === c.value ? `${c.value}30` : 'transparent'
                                    }}
                                    title={c.label}
                                >
                                    {form.color === c.value && (
                                        <Check className="w-4 h-4 text-white drop-shadow-md stroke-[4]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2 transition-colors duration-500 ml-1 tracking-widest uppercase">
                            {t('label_description') || 'Notes'}
                        </label>
                        <textarea 
                            value={form.description || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={4} 
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] px-5 py-4 text-slate-700 dark:text-slate-300 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none transition-colors duration-500 shadow-sm" 
                            placeholder={t('ph_event_desc') || 'Briefly describe this event...'}
                        ></textarea>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex gap-4 transition-colors duration-500">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="flex-1 py-4 rounded-2xl font-black text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                    >
                        {t('btn_cancel') || 'Cancel'}
                    </button>
                    
                    <button 
                        type="submit" 
                        className="flex-1 py-4 rounded-2xl font-black text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg" 
                        style={{ backgroundColor: form.color || '#4f46e5' }}
                    >
                        <span>{t('btn_save') || 'Save event'}</span>
                    </button>
                </div>
            </form>
        </div></ModalPortal>
    );
}
