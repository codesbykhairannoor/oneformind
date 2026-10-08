'use client';

import React from 'react';
import { SWRConfig } from 'swr';

export default function SwrProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig 
            value={{ 
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                shouldRetryOnError: false,
                dedupingInterval: 300000, // 5 min deduplication prevents refetch storms on tab switch
                keepPreviousData: true,   // Keep cached tab data rendered instantly (0ms)
            }}
        >
            {children}
        </SWRConfig>
    );
}
