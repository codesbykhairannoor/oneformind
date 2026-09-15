'use client';
import React, { useState, useEffect } from 'react';
import { useActiveModules } from '@/hooks/useActiveModules';
import FullPageOnboarding from './onboarding/FullPageOnboarding';

export default function ActiveModulesSetupModal() {
    const { isUnlimited } = useActiveModules();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        try {
            const hasSeenLocal = localStorage.getItem('tranvas_tab_setup_completed');
            const hasUserSettingsLocal = localStorage.getItem('tranvas_user_settings');
            
            // If already marked completed or local user settings exist, DO NOT show onboarding!
            if (hasSeenLocal === 'true' || hasUserSettingsLocal) {
                setIsOpen(false);
                return;
            }

            // Check server data to identify existing/old users
            const checkServerExistingUser = async () => {
                try {
                    const res = await fetch('/api/user');
                    if (res.ok) {
                        const data = await res.json();
                        // 1. If user already has custom settings in database -> Existing User!
                        if (data?.settings?.modules || data?.settings?.tabs_activated_at) {
                            localStorage.setItem('tranvas_tab_setup_completed', 'true');
                            setIsOpen(false);
                            return;
                        }
                        // 2. If user account is older than 24 hours -> Existing User!
                        if (data?.createdAt) {
                            const createdDate = new Date(data.createdAt).getTime();
                            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
                            if (createdDate < oneDayAgo) {
                                localStorage.setItem('tranvas_tab_setup_completed', 'true');
                                setIsOpen(false);
                                return;
                            }
                        }
                    }
                    if (!isUnlimited) {
                        setIsOpen(true);
                    }
                } catch (e) {
                    console.error("Error checking user for onboarding:", e);
                }
            };

            checkServerExistingUser();
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
