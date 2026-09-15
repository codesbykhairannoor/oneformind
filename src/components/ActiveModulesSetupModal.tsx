'use client';
import React, { useState, useEffect } from 'react';
import { useActiveModules } from '@/hooks/useActiveModules';
import FullPageOnboarding from './onboarding/FullPageOnboarding';

export default function ActiveModulesSetupModal() {
    const { isUnlimited } = useActiveModules();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            const hasSeen = localStorage.getItem('tranvas_tab_setup_completed');
            if (!hasSeen && !isUnlimited) {
                // Auto show onboarding on first visit if not completed
                setIsOpen(true);
            }
        } catch (e) {
            console.error(e);
        }
    }, [isUnlimited]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950">
            <FullPageOnboarding 
                isStandalonePage={false} 
                onClose={() => setIsOpen(false)} 
            />
        </div>
    );
}
