'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export function usePlannerTimer() {
    const t = useTranslations();
    const [durationMinutes, setDurationMinutes] = useState(25);
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [focusedTaskTitle, setFocusedTaskTitle] = useState<string | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const setPreset = useCallback((mins: number) => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setIsTimerRunning(false);
        setDurationMinutes(mins);
        setPomodoroTime(mins * 60);
    }, []);

    const toggleTimer = useCallback(() => {
        if (isTimerRunning) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
        } else {
            setIsTimerRunning(true);
            timerIntervalRef.current = setInterval(() => {
                setPomodoroTime(prev => {
                    if (prev <= 1) {
                        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                        setIsTimerRunning(false);
                        // Gentle sound or notification
                        try {
                            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
                            gain.gain.setValueAtTime(0.15, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.start();
                            osc.stop(ctx.currentTime + 1.2);
                        } catch (e) {}
                        return durationMinutes * 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [isTimerRunning, durationMinutes]);

    const resetTimer = useCallback(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setIsTimerRunning(false);
        setPomodoroTime(durationMinutes * 60);
    }, [durationMinutes]);

    const formatTimer = useCallback(() => {
        const mins = Math.floor(pomodoroTime / 60);
        const secs = pomodoroTime % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, [pomodoroTime]);

    const focusOnTask = useCallback((taskTitle: string) => {
        setFocusedTaskTitle(taskTitle);
        // Start 25m focus
        setPreset(25);
        if (!isTimerRunning) {
            // will start
            setTimeout(() => {
                toggleTimer();
            }, 50);
        }
    }, [setPreset, isTimerRunning, toggleTimer]);

    const clearFocusedTask = useCallback(() => {
        setFocusedTaskTitle(null);
    }, []);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    return {
        durationMinutes,
        pomodoroTime,
        isTimerRunning,
        focusedTaskTitle,
        setPreset,
        toggleTimer,
        resetTimer,
        formatTimer,
        focusOnTask,
        clearFocusedTask
    };
}
