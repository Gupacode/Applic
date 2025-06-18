// app/(main)/learning-path/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import LearningPathComponent from '@/components/features/learning/LearningPathComponent';

// O wrapper Suspense é uma boa prática ao usar useSearchParams
function LearningPathPageContent() {
    const searchParams = useSearchParams();
    const pathId = searchParams.get('pathId');

    if (!pathId) {
        return <div className="p-8 text-center">Trilha não encontrada. Por favor, volte e selecione uma trilha.</div>;
    }

    return <LearningPathComponent pathId={pathId} />;
}

export default function LearningPathPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Carregando trilha...</div>}>
            <LearningPathPageContent />
        </Suspense>
    );
}