'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    X, Calendar, Clock, AlignLeft, Tag, 
    Palette, Check, Video, MapPin, Repeat, 
    Sparkles, ExternalLink 
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import GoalDatePicker from '../../goals/components/GoalDatePicker';
import { UnifiedCalendarEvent, detectMeetingPlatform } from '../lib/calendarAnalytics';

interface CalendarEventModalProps {
    show: boolean;
    event?: Partial<UnifiedCalendarEvent> | null;
    initialDate?: string;
    initialStartTime?: string;
    onClose: () => void;
    onSubmit: (form: UnifiedCalendarEvent) => void;
}

export default function CalendarEventModal({
    show,
    event,
    initialDate,
    initialStartTime,
    onClose,
    onSubmit
}: CalendarEventModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const defaultDate = initialDate || new Date().toISOString().split('T')[0];
    const defaultStart = initialStartTime || '09:00';

    const [form, setForm] = useState<UnifiedCalendarEvent>({
        id: '',
        title: '',
        start_date: defaultDate,
        end_date: defaultDate,
        start_time: defaultStart,
        end_time: '10:00',
        is_all_day: false,
        color: '#4f46e5',
        category: 'personal',
        meeting_url: '',
        location: '',
        recurrence: 'none',
        description: ''
    });

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    useEffect(() => {
        if (event) {
            setForm({
                id: event.id || '',
                title: event.title || '',
                start_date: event.start_date || defaultDate,
                end_date: event.end_date || event.start_date || defaultDate,
                start_time: event.start_time || defaultStart,
                end_time: event.end_time || '10:00',
                is_all_day: !!event.is_all_day,
                color: event.color || '#4f46e5',
                category: event.category || 'personal',
                meeting_url: event.meeting_url || '',
                location: event.location || '',
                recurrence: event.recurrence || 'none',
                description: event.description || ''
            });
        } else {
            setForm({
                id: '',
                title: '',
                start_date: defaultDate,
                end_date: defaultDate,
                start_time: defaultStart,
                end_time: '10:00',
                is_all_day: false,
                color: '#4f46e5',
                category: 'personal',
                meeting_url: '',
                location: '',
                recurrence: 'none',
                description: ''
            });
        }
    }, [event, defaultDate, defaultStart, show]);

    if (!show) return null;

    const colorOptions = [
        { value: '#4f46e5', label: 'Indigo / Personal' }, 
        { value: '#8b5cf6', label: 'Purple / Meeting' }, 
        { value: '#0ea5e9', label: 'Sky / Focus' },    
        { value: '#10b981', label: 'Emerald / Health' }, 
        { value: '#f59e0b', label: 'Amber / Work' },  
        { value: '#f43f5e', label: 'Rose / Finance' },   
    ];

    const categoryOptions = [
        { value: 'personal', label: isIndo ? 'Pribadi' : 'Personal', color: '#4f46e5' },
        { value: 'meeting', label: isIndo ? 'Rapat / Video Call' : 'Meeting / Call', color: '#8b5cf6' },
        { value: 'deepwork', label: isIndo ? 'Fokus & Deep Work' : 'Focus & Deep Work', color: '#0ea5e9' },
        { value: 'work', label: isIndo ? 'Pekerjaan' : 'Work / Project', color: '#f59e0b' },
        { value: 'health', label: isIndo ? 'Kesehatan & Olahraga' : 'Health & Fitness', color: '#10b981' },
        { value: 'finance', label: isIndo ? 'Keuangan & Tagihan' : 'Finance & Bills', color: '#f43f5e' },
    ];

    const recurrenceOptions = [
        { value: 'none', label: isIndo ? 'Tidak Berulang (Sekali)' : 'Does not repeat (One-off)' },
        { value: 'daily', label: isIndo ? 'Setiap Hari' : 'Daily' },
        { value: 'weekdays', label: isIndo ? 'Hari Kerja (Senin - Jumat)' : 'Every Weekday (Mon - Fri)' },
        { value: 'weekly', label: isIndo ? 'Setiap Minggu' : 'Weekly' },
        { value: 'biweekly', label: isIndo ? 'Setiap 2 Minggu' : 'Bi-weekly (Every 2 weeks)' },
        { value: 'monthly', label: isIndo ? 'Setiap Bulan' : 'Monthly' },
        { value: 'yearly', label: isIndo ? 'Setiap Tahun' : 'Yearly' },
    ];

    const detectedMeeting = detectMeetingPlatform(form.meeting_url);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            alert(isIndo ? 'Judul agenda tidak boleh kosong!' : 'Event title cannot be empty!');
            return;
        }
        onSubmit(form);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

                <form 
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] z-10 transition-colors"
                >
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: form.color }} />
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">
                                {form.id 
                                    ? (isIndo ? 'Edit Agenda Kalender' : 'Edit Calendar Event')
                                    : (isIndo ? 'Buat Agenda Baru' : 'Create New Event')}
                            </h3>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Form Fields Body */}
                    <div className="p-8 overflow-y-auto space-y-5 bg-white dark:bg-slate-900">
                        
                        {/* Title Input */}
                        <div>
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                                {isIndo ? 'Judul Agenda' : 'Event Title'} <span className="text-rose-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-slate-800 dark:text-white font-black text-base focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                                placeholder={isIndo ? 'Misal: Sprint Planning & Demo Produk' : 'E.g. Strategy Sync with Team'} 
                                required 
                                autoFocus
                            />
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                                {isIndo ? 'Kategori & Warna' : 'Category & Color'}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {categoryOptions.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setForm(prev => ({ 
                                            ...prev, 
                                            category: cat.value as any,
                                            color: cat.color 
                                        }))}
                                        className={`p-2.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all ${
                                            form.category === cat.value
                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                    >
                                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                        <span className="truncate">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Pickers (Start & End) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                                    {isIndo ? 'Tanggal Mulai' : 'Start Date'}
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => { setShowStartDatePicker(!showStartDatePicker); setShowEndDatePicker(false); }} 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                                >
                                    <span>{form.start_date}</span>
                                    <Calendar size={14} className="text-slate-400" />
                                </button>
                                <GoalDatePicker 
                                    show={showStartDatePicker}
                                    teleport={false}
                                    modelValue={form.start_date}
                                    onUpdateModelValue={(val) => { 
                                        setForm(prev => ({ ...prev, start_date: val, end_date: val })); 
                                        setShowStartDatePicker(false); 
                                    }}
                                    onClose={() => setShowStartDatePicker(false)}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                                    {isIndo ? 'Tanggal Selesai' : 'End Date'}
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => { setShowEndDatePicker(!showEndDatePicker); setShowStartDatePicker(false); }} 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
                                >
                                    <span>{form.end_date || form.start_date}</span>
                                    <Calendar size={14} className="text-slate-400" />
                                </button>
                                <GoalDatePicker 
                                    show={showEndDatePicker}
                                    teleport={false}
                                    modelValue={form.end_date || form.start_date}
                                    onUpdateModelValue={(val) => { 
                                        setForm(prev => ({ ...prev, end_date: val })); 
                                        setShowEndDatePicker(false); 
                                    }}
                                    onClose={() => setShowEndDatePicker(false)}
                                />
                            </div>
                        </div>

                        {/* Time Selectors & All Day Toggle */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                    {isIndo ? 'Waktu & Durasi' : 'Time & Duration'}
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={form.is_all_day}
                                        onChange={(e) => setForm(prev => ({ ...prev, is_all_day: e.target.checked }))}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{isIndo ? 'Sepanjang Hari' : 'All Day'}</span>
                                </label>
                            </div>

                            {!form.is_all_day && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="time"
                                            value={form.start_time || '09:00'}
                                            onChange={(e) => setForm(prev => ({ ...prev, start_time: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="time"
                                            value={form.end_time || '10:00'}
                                            onChange={(e) => setForm(prev => ({ ...prev, end_time: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Call URL */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                    <Video size={13} className="text-purple-600" />
                                    <span>{isIndo ? 'Tautan Video Meeting' : 'Video Meeting Link'}</span>
                                </label>
                                {detectedMeeting.platform && (
                                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                                        {detectedMeeting.name}
                                    </span>
                                )}
                            </div>
                            <input 
                                type="url" 
                                value={form.meeting_url || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, meeting_url: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                                placeholder={isIndo ? 'https://meet.google.com/xxx atau https://zoom.us/j/xxx' : 'https://meet.google.com/xxx or Zoom URL'} 
                            />
                        </div>

                        {/* Location / Physical Address */}
                        <div>
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                                <MapPin size={13} className="text-slate-400" />
                                <span>{isIndo ? 'Lokasi Fisik / Alamat (Opsional)' : 'Location / Address (Optional)'}</span>
                            </label>
                            <input 
                                type="text" 
                                value={form.location || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" 
                                placeholder={isIndo ? 'Misal: Ruang Rapat Lt. 3 atau Cafe Senayan' : 'E.g. Room 302 or Starbucks HQ'} 
                            />
                        </div>

                        {/* Recurrence Selector */}
                        <div>
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                                <Repeat size={13} className="text-slate-400" />
                                <span>{isIndo ? 'Pengulangan Event (Recurrence)' : 'Repeat Rule (Recurrence)'}</span>
                            </label>
                            <select
                                value={form.recurrence || 'none'}
                                onChange={(e) => setForm(prev => ({ ...prev, recurrence: e.target.value as any }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                {recurrenceOptions.map(rec => (
                                    <option key={rec.value} value={rec.value}>
                                        {rec.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Notes / Agenda Description */}
                        <div>
                            <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                                {isIndo ? 'Catatan & Agenda Tambahan' : 'Notes & Agenda Notes'}
                            </label>
                            <textarea 
                                value={form.description || ''}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={3} 
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-slate-400" 
                                placeholder={isIndo ? 'Tulis poin pembahasan agenda di sini...' : 'Write key talking points or notes here...'}
                            />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3.5 rounded-2xl font-black text-xs text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition active:scale-95"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        
                        <button 
                            type="submit" 
                            className="flex-1 py-3.5 rounded-2xl font-black text-xs text-white transition active:scale-95 shadow-lg shadow-indigo-500/20" 
                            style={{ backgroundColor: form.color || '#4f46e5' }}
                        >
                            {form.id 
                                ? (isIndo ? 'Simpan Perubahan' : 'Save Changes')
                                : (isIndo ? 'Simpan Agenda' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </ModalPortal>
    );
}
