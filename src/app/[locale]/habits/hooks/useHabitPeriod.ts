'use client';

import { useState, useEffect } from 'react';
import { isSoundEnabled, setSoundEnabled } from '@/lib/habitAudio';

export function useHabitPeriod() {
    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = String(todayObj.getMonth() + 1).padStart(2, '0');
    const todayDay = String(todayObj.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
    const initialMonthKey = `${todayYear}-${todayMonth}`;

    const [currentMonthKey, setCurrentMonthKey] = useState(initialMonthKey);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(todayYear);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(todayObj.getMonth());
    const [showHint, setShowHint] = useState(true);
    const [soundActive, setSoundActive] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'quit'>('all');
    const [selectedMobileDate, setSelectedMobileDate] = useState(todayStr);

    useEffect(() => {
        setSoundActive(isSoundEnabled());
    }, []);

    const toggleSound = () => {
        const next = !soundActive;
        setSoundActive(next);
        setSoundEnabled(next);
    };

    useEffect(() => {
        const newKey = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
        setCurrentMonthKey(newKey);
    }, [selectedYear, selectedMonthIndex]);

    useEffect(() => {
        if (currentMonthKey !== initialMonthKey) {
            setSelectedMobileDate(`${currentMonthKey}-01`);
        } else {
            setSelectedMobileDate(todayStr);
        }
    }, [currentMonthKey, initialMonthKey, todayStr]);

    return {
        todayObj,
        todayYear,
        todayMonth,
        todayDay,
        todayStr,
        initialMonthKey,
        currentMonthKey,
        setCurrentMonthKey,
        isPeriodDropdownOpen,
        setIsPeriodDropdownOpen,
        selectedYear,
        setSelectedYear,
        selectedMonthIndex,
        setSelectedMonthIndex,
        showHint,
        setShowHint,
        soundActive,
        toggleSound,
        activeFilter,
        setActiveFilter,
        selectedMobileDate,
        setSelectedMobileDate
    };
}
