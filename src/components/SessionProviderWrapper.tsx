'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SWRConfig 
                value={{
                    revalidateOnFocus: false, // Prevents burning Vercel limits when switching tabs
                    revalidateOnReconnect: false,
                    dedupingInterval: 10000 // dedupe requests with the same key in this time span (10s)
                }}
            >
                {children}
            </SWRConfig>
        </SessionProvider>
    );
}
