'use client';

import React from 'react';
import { SWRConfig } from 'swr';

export default function SwrProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig 
            value={{ 
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                shouldRetryOnError: false
            }}
        >
            {children}
        </SWRConfig>
    );
}
