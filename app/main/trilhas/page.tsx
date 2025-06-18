// app/(main)/trilhas/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockDatabase, initialProgressState } from '@/lib/database';
import { Hero } from '@/components/layout/Hero';
import { LearningPathCard } from '@/components/features/learning/LearningPathCard';
import type { MockUserProgress } from '@/lib/types';

export default function HubPage() {
    const { user } = useAuth();
    const router = useRouter();
    const paths = Object.values(mockDatabase.learningPaths);

    const handleStartPath = (pathId: string) => {
        router.push(`/learning-path?pathId=${pathId}`);
    };
    
    const handleResetPath = (pathId: string) => {
        if (!user) return;
        const progressKey = `${user.uid}_${pathId}`;
        const currentProgress = (mockDatabase.userProgress as MockUserProgress)[progressKey];
        
        (mockDatabase.userProgress as MockUserProgress)[progressKey] = {
            ...initialProgressState,
            userId: user.uid,
            pathId: pathId,
            xpEarnedInPath: currentProgress?.xpEarnedInPath || 0,
            awardedBadge: currentProgress?.awardedBadge || null,
        };
        handleStartPath(pathId);
    }
    
    return (
        <div>
            <Hero />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Trilhas de Aprendizado</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paths.map(path => (
                        <LearningPathCard 
                            key={path.pathId} 
                            path={path} 
                            userProgress={user ? (mockDatabase.userProgress as MockUserProgress)[`${user.uid}_${path.pathId}`] : undefined} 
                            onStart={handleStartPath}
                            onReset={handleResetPath}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}