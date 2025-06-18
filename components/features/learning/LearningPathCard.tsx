// components/features/learning/LearningPathCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import type { LearningPath, UserProgress } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LearningPathCardProps {
  path: LearningPath;
  userProgress?: UserProgress;
  onStart: (pathId: string) => void;
  onReset: (pathId: string) => void;
}

export const LearningPathCard = ({ path, userProgress, onStart, onReset }: LearningPathCardProps) => {
    // Usamos 'any' aqui para permitir ícones dinâmicos do Lucide
    const IconComponent = (Lucide as any)[path.icon] || Lucide.BookOpen;
    const progress = userProgress?.pathProgress || 0;
    const max_xp = path.max_xp || 0;
    const earnedXp = userProgress?.xpEarnedInPath || 0;
    const isComingSoon = path.status === 'coming_soon';

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            className="w-full"
        >
            <Card className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                    <IconComponent size={40} className="text-indigo-500 mr-4" />
                    <div>
                        <h3 className="text-xl font-bold">{path.title}</h3>
                        <p className="text-sm text-yellow-500">{userProgress?.pathCompleted ? `${earnedXp} / ${max_xp} XP` : `${max_xp} XP`}</p>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{path.description}</p>
                <div className="mt-auto">
                    {progress > 0 && <ProgressBar value={progress} className="mb-4" />}
                    
                    {isComingSoon ? (
                        <Button className="w-full" variant="secondary" disabled={true}>Em Breve</Button>
                    ) : userProgress?.pathCompleted ? (
                         <Button onClick={() => onReset(path.pathId)} className="w-full" variant="secondary">Refazer Trilha</Button>
                    ) : (
                        <Button onClick={() => onStart(path.pathId)} className="w-full">
                           {progress > 0 ? 'Continuar' : 'Começar'}
                        </Button>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default LearningPathCard;