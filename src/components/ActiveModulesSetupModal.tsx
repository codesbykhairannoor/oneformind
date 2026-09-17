'use client';
import React, { useState, useEffect } from 'react';
import FullPageOnboarding from './onboarding/FullPageOnboarding';

export default function ActiveModulesSetupModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-onboarding-modal', handleOpen);
        return () => window.removeEventListener('open-onboarding-modal', handleOpen);
    }, []);

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
