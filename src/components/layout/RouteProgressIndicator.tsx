'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';

interface OptimisticNavContextType {
    pendingPath: string | null;
    isNavigating: boolean;
    startNav: (href: string) => void;
    prefetchRoute: (href: string) => void;
}

const OptimisticNavContext = createContext<OptimisticNavContextType>({
    pendingPath: null,
    isNavigating: false,
    startNav: () => {},
    prefetchRoute: () => {},
});

export const useOptimisticNav = () => useContext(OptimisticNavContext);

export function OptimisticNavProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [pendingPath, setPendingPath] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    const prefetchedRoutes = useRef<Set<string>>(new Set());
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Stop and complete progress when pathname updates
    useEffect(() => {
        if (pendingPath !== null) {
            // Pathname caught up with navigation!
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }
            
            setProgress(100);
            
            resetTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
                setPendingPath(null);
            }, 250);
        }

        return () => {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, [pathname]);

    // Safety timeout: reset after 4s if navigation was aborted or errored
    useEffect(() => {
        if (!pendingPath) return;

        const timer = setTimeout(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setIsVisible(false);
            setProgress(0);
            setPendingPath(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [pendingPath]);

    const startNav = useCallback((href: string) => {
        // Strip trailing slash
        const cleanHref = href.endsWith('/') && href.length > 1 ? href.slice(0, -1) : href;
        const currentClean = pathname?.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

        if (cleanHref === currentClean) {
            return; // Already on this page, no-op
        }

        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

        setPendingPath(cleanHref);
        setIsVisible(true);
        setProgress(28);

        // Simulated progress creeping towards 85%
        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 85) {
                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                    return 85;
                }
                const step = (85 - prev) * 0.15;
                return Math.min(85, prev + Math.max(step, 1.5));
            });
        }, 120);
    }, [pathname]);

    const prefetchRoute = useCallback((href: string) => {
        if (!href || prefetchedRoutes.current.has(href)) return;
        prefetchedRoutes.current.add(href);
        try {
            router.prefetch(href);
        } catch (_) {}
    }, [router]);

    return (
        <OptimisticNavContext.Provider
            value={{
                pendingPath,
                isNavigating: isVisible,
                startNav,
                prefetchRoute,
            }}
        >
            {/* Top Nano Progress Indicator (Linear / GitHub style) */}
            {isVisible && (
                <div 
                    className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2.5px] bg-transparent overflow-hidden"
                    aria-hidden="true"
                >
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all ease-out"
                        style={{
                            width: `${progress}%`,
                            transitionDuration: progress === 100 ? '180ms' : '220ms',
                        }}
                    />
                </div>
            )}
            {children}
        </OptimisticNavContext.Provider>
    );
}
