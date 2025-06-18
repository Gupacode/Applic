// app/(main)/profile/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDatabase } from '@/lib/database';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BadgeIcon } from '@/components/features/gamification/BadgeIcon';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-8 text-center">Usuário não encontrado.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="mb-8">
                <div className="flex items-center">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mr-6">
                        <User size={48} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <p className="text-lg text-yellow-500 font-semibold">{user.xp ?? 0} XP</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Conquistas</h2>
                <div className="space-y-6">
                    {Object.values(mockDatabase.learningPaths).map(path => (
                        <div key={path.pathId}>
                            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{path.title}</h3>
                            {path.badges.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                                    {path.badges.map(badgeInfo => {
                                        const isLocked = !user.badges.includes(badgeInfo.id);
                                        return <BadgeIcon key={badgeInfo.id} badgeId={badgeInfo.id} isLocked={isLocked} xpText={`${badgeInfo.xp_required} XP`} />
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500">Nenhuma conquista disponível para esta trilha.</p>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};