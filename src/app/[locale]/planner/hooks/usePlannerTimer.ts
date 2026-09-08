'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function usePlannerTimer() {
    const t = useTranslations();
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const toggleTimer = () => {
        if (isTimerRunning) {
            if (timerInterval) clearInterval(timerInterval);
            setIsTimerRunning(false);
        } else {
            const interval = setInterval(() => {
                setPomodoroTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsTimerRunning(false);
                        alert(t('sidebar_pomodoro_alert') || 'Waktu fokus selesai!');
                        return 25 * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
            setIsTimerRunning(true);
        }
    };

    const resetTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
        setIsTimerRunning(false);
        setPomodoroTime(25 * 60);
    };

    const formatTimer = () => {
        const mins = Math.floor(pomodoroTime / 60);
        const secs = pomodoroTime % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return {
        pomodoroTime,
        isTimerRunning,
        toggleTimer,
        resetTimer,
        formatTimer
    };
}
