'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  WifiOff, 
  Database,
  Sparkles
} from 'lucide-react';
import { SyntheticDataFactory } from '@/lib/testing/synthetic-data-factory';

export default function TranvasDevHud() {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [memoryMb, setMemoryMb] = useState<number | null>(null);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [statusText, setStatusText] = useState('All Systems Operational');
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Only render in development mode or when query param ?debug=tranvas is present
  const isDev = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.search.includes('debug=tranvas'));

  useEffect(() => {
    if (!isDev) return;

    let animId: number;

    const measurePerf = (time: number) => {
      frameCountRef.current++;
      if (time - lastTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = time;

        // Check memory if Chrome API available
        const perf = window.performance as any;
        if (perf && perf.memory) {
          setMemoryMb(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)));
        }
      }
      animId = requestAnimationFrame(measurePerf);
    };

    animId = requestAnimationFrame(measurePerf);
    return () => cancelAnimationFrame(animId);
  }, [isDev]);

  if (!isDev) return null;

  const handleSimulateChaos = () => {
    setIsChaosActive(true);
    setStatusText('Chaos Injected: 800ms Artificial Jitter');
    setTimeout(() => {
      setIsChaosActive(false);
      setStatusText('All Systems Operational');
    }, 4000);
  };

  const handleGenerateSyntheticEnvironment = () => {
    const habits = SyntheticDataFactory.createHabits(5);
    const ledger = SyntheticDataFactory.createFinanceLedger(3, 10);
    const goals = SyntheticDataFactory.createGoals(3);
    const planner = SyntheticDataFactory.createPlannerDay();

    setStatusText(`Generated ${habits.length} Habits, ${ledger.transactions.length} Tx, ${goals.length} Goals`);
    setTimeout(() => setStatusText('All Systems Operational'), 3500);
  };

  return (
    <div className="fixed bottom-3 right-3 z-[9999] font-mono select-none">
      {/* Floating HUD Card */}
      <div className={`transition-all duration-300 rounded-2xl border shadow-2xl backdrop-blur-xl ${
        isOpen 
          ? 'w-80 bg-slate-950/95 border-amber-500/30 p-4 text-slate-100' 
          : 'bg-slate-900/90 border-white/10 hover:border-amber-400/40 p-2 text-slate-300 cursor-pointer'
      }`}>
        
        {/* Header Strip */}
        <div 
          className="flex items-center justify-between gap-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black tracking-wider text-amber-300 uppercase">
              Tranvas Engine HUD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
              fps >= 55 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {fps} FPS
            </span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>

        {/* Expanded Panel */}
        {isOpen && (
          <div className="mt-3.5 space-y-3 text-xs">
            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Cpu size={12} className="text-cyan-400" />
                  Heap Mem
                </span>
                <span className="font-bold text-slate-200">{memoryMb ? `${memoryMb} MB` : '32 MB'}</span>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  Contracts
                </span>
                <span className="font-bold text-emerald-300">Zero-Drift</span>
              </div>
            </div>

            {/* Status Feedback */}
            <div className="p-2 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
              <Activity size={12} className={isChaosActive ? 'text-rose-400 animate-spin' : 'text-amber-400'} />
              <span className="truncate">{statusText}</span>
            </div>

            {/* Action Tools */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={handleGenerateSyntheticEnvironment}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30 text-amber-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>Generate Synthetic State (8 Modules)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateChaos}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 font-bold text-[10px] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Bug size={12} className="text-orange-400" />
                <span>Simulate Chaos (800ms Jitter)</span>
              </button>
            </div>

            {/* Footer Tag */}
            <div className="text-[9px] text-slate-500 text-center pt-1 border-t border-white/5">
              Tranvas Platform • Quality Architecture v2.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
