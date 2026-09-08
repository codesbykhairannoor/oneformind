'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import NeuralOsHeroPreview from '@/components/features/neural-os/NeuralOsHeroPreview';
import NeuralOsAuditSynergy from '@/components/features/neural-os/NeuralOsAuditSynergy';
import NeuralOsSciencePrivacy from '@/components/features/neural-os/NeuralOsSciencePrivacy';
import NeuralOsFaqCta from '@/components/features/neural-os/NeuralOsFaqCta';

export default function FeatureNeuralOsPage() {
    const t = useTranslations();

    return (
        <GuestLayout>
            <main id="feature-neural-os" className="overflow-x-hidden">
                <NeuralOsHeroPreview t={t} />
                <NeuralOsAuditSynergy t={t} />
                <NeuralOsSciencePrivacy t={t} />
                <NeuralOsFaqCta t={t} />
            </main>
        </GuestLayout>
    );
}
