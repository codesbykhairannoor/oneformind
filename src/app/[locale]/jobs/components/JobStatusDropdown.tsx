'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface JobStatusDropdownProps {
    value: string;
    onChange: (newVal: string) => void;
    onSave?: () => void;
}

export default function JobStatusDropdown({ value, onChange, onSave }: JobStatusDropdownProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
        { value: 'wishlist', labelKey: 'job_status_wishlist', colorClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', hex: '#60a5fa' },
        { value: 'applied', labelKey: 'job_status_applied', colorClass: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20', hex: '#facc15' },
        { value: 'interview', labelKey: 'job_status_interview', colorClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20', hex: '#c084fc' },
        { value: 'offer', labelKey: 'job_status_offer', colorClass: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20', hex: '#4ade80' },
        { value: 'rejected', labelKey: 'job_status_rejected', colorClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', hex: '#fb7185' },
        { value: 'accepted', labelKey: 'job_status_accepted', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', hex: '#34d399' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusOption = (val: string) => statusOptions.find(s => s.value === val) || statusOptions[0];

    const selectStatus = (val: string) => {
        if (value === val) {
            setIsOpen(false);
            return;
        }
        onChange(val);
        if (onSave) onSave();
        setIsOpen(false);
    };

    const currentOpt = getStatusOption(value);

    return (
        // 1:1 from JobStatusDropdown.vue line 35-53
        <div 
            className="relative w-full h-full flex items-center px-3 cursor-pointer group select-none" 
            ref={containerRef} 
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border group-hover:shadow-sm ${currentOpt.colorClass}`}>
                {t(currentOpt.labelKey) || value}
            </span>

            {isOpen && (
                <div 
                    className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-3 -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 mt-0 sm:mt-2 w-64 sm:w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-2 z-[100] animate-in fade-in zoom-in-95 duration-150"
                >
                    <div className="sm:hidden fixed inset-0 bg-slate-900/40 -z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
                    {statusOptions.map((opt) => (
                        <div 
                            key={opt.value} 
                            onClick={(e) => { e.stopPropagation(); selectStatus(opt.value); }}
                            className={`px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3 ${value === opt.value ? 'bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opt.hex }}></span>
                            <span className="truncate">{t(opt.labelKey) || opt.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
