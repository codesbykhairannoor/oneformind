'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TrackerInner() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams) return;
        
        // Support standard SaaS affiliate query params (?ref=, ?via=, ?fpr=, ?aff=)
        const refParam = searchParams.get('ref') || 
                         searchParams.get('via') || 
                         searchParams.get('fpr') || 
                         searchParams.get('aff');

        if (refParam && refParam.trim().length > 0) {
            const cleanCode = refParam.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
            
            if (cleanCode.length > 0) {
                // 1. Set 90-Day 1st-Party Cookie
                const expires = new Date();
                expires.setDate(expires.getDate() + 90);
                document.cookie = `tranvas_ref_code=${encodeURIComponent(cleanCode)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

                // 2. Set LocalStorage & SessionStorage backup (Anti-ITP)
                try {
                    localStorage.setItem('tranvas_ref_code', cleanCode);
                    sessionStorage.setItem('tranvas_ref_code', cleanCode);
                } catch (e) {
                    // Ignore storage access errors in private browsing
                }

                // 3. Dispatch custom event for real-time frontend listener
                window.dispatchEvent(new CustomEvent('tranvas_ref_captured', { detail: { refCode: cleanCode } }));

                // 4. Record click to backend counter (once per session key)
                const sessionClickKey = `tranvas_click_recorded_${cleanCode}`;
                try {
                    if (!sessionStorage.getItem(sessionClickKey)) {
                        sessionStorage.setItem(sessionClickKey, '1');
                        fetch('/api/affiliates/click', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ref_code: cleanCode }),
                        }).catch(() => {});
                    }
                } catch (e) {}
            }
        }
    }, [searchParams]);

    return null;
}

export default function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerInner />
        </Suspense>
    );
}
