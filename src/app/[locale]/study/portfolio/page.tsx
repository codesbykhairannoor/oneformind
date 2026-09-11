'use client';

import React from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import StudyPortfolioView from '../components/StudyPortfolioView';

export default function StudyPortfolioPage() {
    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32 px-4 sm:px-6 lg:px-8 py-8 transition-colors font-sans overflow-x-hidden">
                <div className="max-w-[1400px] mx-auto">
                    <StudyPortfolioView showBackButton={true} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
