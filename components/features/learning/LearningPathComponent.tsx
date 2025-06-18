// components/features/learning/LearningPathComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockDatabase, initialProgressState } from '@/lib/database';
import type { LearningPath, MockLearningPaths, MockModules, MockUserProgress, UserProgress } from '@/lib/types';
import * as Lucide from 'lucide-react';

// Importando todos os componentes necessários
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BadgeIcon } from '@/components/features/gamification/BadgeIcon';
import { PresentationModule } from './PresentationModule';
import { QuizComponent } from './QuizComponent';
import { FeedbackModule } from './FeedbackModule';
import PhaserGame from '@/game/PhaserGame';

interface LearningPathComponentProps {
    pathId: string;
}

const LearningPathComponent = ({ pathId }: LearningPathComponentProps) => {
    const { user, addXp, addBadge } = useAuth();
    const router = useRouter();
    const path = (mockDatabase.learningPaths as MockLearningPaths)[pathId];

    if (!path) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Erro: Trilha não encontrada</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">A trilha de aprendizagem que você está tentando acessar não existe.</p>
                <Button onClick={() => router.push('/trilhas')} className="mt-6">
                    Voltar para as Trilhas
                </Button>
            </div>
        );
    }

    const getInitialProgress = (): UserProgress => {
        if (!user) {
            // Retorna um estado padrão se não houver usuário logado
            return { ...initialProgressState, userId: '', pathId, awardedBadge: null };
        }
        const progressKey = `${user.uid}_${pathId}`;
        if (!(mockDatabase.userProgress as MockUserProgress)[progressKey]) {
            (mockDatabase.userProgress as MockUserProgress)[progressKey] = { ...initialProgressState, userId: user.uid, pathId, awardedBadge: null };
        }
        return (mockDatabase.userProgress as MockUserProgress)[progressKey];
    };

    const [userProgress, setUserProgress] = useState<UserProgress>(getInitialProgress);
    const [awardedBadge, setAwardedBadge] = useState<string | null>(null);

    const [currentModuleIndex, setCurrentModuleIndex] = useState(() => {
        const progress = getInitialProgress();
        const lastModuleId = progress.lastAccessedModuleId;
        if (!lastModuleId) return 0;
        const index = path.modules.indexOf(lastModuleId);
        return index > -1 ? index : 0;
    });

    const [showCompleteModal, setShowCompleteModal] = useState(false);

    // Lógica original copiada para cá
    const calculateBadgesToAward = (earnedXp: number, path: LearningPath): string[] => {
        const badgesToAward: string[] = [];
        const pathBadges = path.badges || [];
        const bronze = pathBadges.find(b => b.id.includes('bronze'));
        const silver = pathBadges.find(b => b.id.includes('silver'));
        const gold = pathBadges.find(b => b.id.includes('gold'));
        
        if (bronze && earnedXp >= bronze.xp_required) {
            badgesToAward.push(bronze.id);
        }
        if (silver && earnedXp >= silver.xp_required) {
            badgesToAward.push(silver.id);
        }
        if (gold && earnedXp >= gold.xp_required) {
            badgesToAward.push(gold.id);
        }
        return badgesToAward;
    };

    // Lógica original copiada para cá
    const updateProgress = (moduleId: string, data: any = {}) => {
        if (!user) return; 

        setUserProgress(currentProgress => {
            const newProgress = { ...currentProgress };

            if (!newProgress.completedModules.includes(moduleId)) {
                 newProgress.completedModules = [...newProgress.completedModules, moduleId];
            }
            
            if (data.quizScore) newProgress.quizScores['ds-quiz'] = data.quizScore;
            if (data.gameScore !== undefined) newProgress.gameScores['ds-minigame'] = { score: data.gameScore };
            if (data.gameAttempts) newProgress.gameAttempts = { ...newProgress.gameAttempts, ...data.gameAttempts };
            
            newProgress.pathProgress = Math.round((newProgress.completedModules.length / path.modules.length) * 100);
            
            const nextIndex = path.modules.indexOf(moduleId) + 1;
            if (nextIndex < path.modules.length) {
                newProgress.lastAccessedModuleId = path.modules[nextIndex];
                setCurrentModuleIndex(nextIndex);
            } else {
                 newProgress.pathCompleted = true;
                 newProgress.lastAccessedModuleId = null;
            }
            
            (mockDatabase.userProgress as MockUserProgress)[`${user.uid}_${pathId}`] = newProgress;
            return newProgress;
        });
    };
    
    // Lógica original copiada para cá
    useEffect(() => {
        if (userProgress.pathCompleted && !showCompleteModal) {
            
            const finalProgress = { ...userProgress };

            const quizXp = finalProgress.quizScores['ds-quiz']?.score || 0;
            const gameXp = finalProgress.gameScores['ds-minigame']?.score || 0;
            const newXpEarned = quizXp + gameXp;
            
            const progressKey = `${user?.uid}_${pathId}`;
            const previousBestXp = (mockDatabase.userProgress as MockUserProgress)[progressKey].xpEarnedInPath || 0;
            
            if (newXpEarned > previousBestXp) {
                const xpDifference = newXpEarned - previousBestXp;
                addXp(xpDifference);
                finalProgress.xpEarnedInPath = newXpEarned;
            } else {
                finalProgress.xpEarnedInPath = previousBestXp;
            }
            
            const badgesToAward = calculateBadgesToAward(finalProgress.xpEarnedInPath, path);
            if (badgesToAward.length > 0) {
                addBadge(badgesToAward);
                finalProgress.awardedBadge = badgesToAward[badgesToAward.length - 1]; 
            } else {
                finalProgress.awardedBadge = userProgress.awardedBadge;
            }

            setUserProgress(finalProgress);
            (mockDatabase.userProgress as MockUserProgress)[progressKey] = finalProgress;
            
            setAwardedBadge(finalProgress.awardedBadge);
            setShowCompleteModal(true);
        }
    }, [userProgress, path, user?.uid, addXp, addBadge, showCompleteModal, pathId]);

    const handleModalClose = () => {
        setShowCompleteModal(false);
        router.push('/trilhas');
    };
    
    const handleNavigate = (page: string) => {
        router.push(page);
        setShowCompleteModal(false);
    };

    const renderModule = () => {
        const moduleId = path.modules[currentModuleIndex];
        const module = (mockDatabase.modules as MockModules)[moduleId];

        switch (module.type) {
            case 'tutorial':
                return <Card className="text-center"><h2 className="text-2xl font-bold mb-4">Tutorial Interativo</h2><Lucide.MousePointerClick size={48} className="mx-auto my-4" /><p className="mb-6">Siga as instruções na tela. É simples!</p><Button onClick={() => updateProgress(moduleId)}>Entendi!</Button></Card>;
            case 'presentation':
                return <PresentationModule onComplete={() => updateProgress(moduleId)} />;
            case 'quiz':
                // Corrigido para passar a prop 'title'
                return <QuizComponent quizId="digital-security-q1" title={module.title} onQuizComplete={(quizData) => updateProgress(moduleId, { quizScore: quizData })} />;
            case 'game':
                return <PhaserGame onGameEnd={(gameData) => updateProgress(moduleId, { gameScore: gameData.score, gameAttempts: gameData.attempts })} />;
            case 'feedback':
                return <FeedbackModule onComplete={() => updateProgress(moduleId)} />;
            default:
                return <Card>Módulo em construção.</Card>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{path.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Módulo {currentModuleIndex + 1}/{path.modules.length}: {(mockDatabase.modules as MockModules)[path.modules[currentModuleIndex]].title}</p>
            <ProgressBar value={userProgress.pathProgress} className="mb-8" />
            
            {renderModule()}

            <Modal isOpen={showCompleteModal} onClose={handleModalClose} title="Trilha Concluída!">
                <div className="text-center">
                    {awardedBadge ? (
                        <>
                           <p className="text-lg mb-4">Parabéns! Você conquistou a badge:</p>
                           <div className="flex justify-center mb-4">
                               <BadgeIcon badgeId={awardedBadge} xpText={`${userProgress.xpEarnedInPath} / ${path.max_xp} XP`} />
                           </div>
                        </>
                    ) : (
                        <p className="text-lg mb-4">Parabéns por concluir a trilha!</p>
                    )}
                    <div className="flex justify-center space-x-4 mt-6">
                        <Button onClick={() => handleNavigate('/articles')} variant="secondary">Ir para Artigos</Button>
                        <Button onClick={() => handleNavigate('/profile')} variant="secondary">Ver Perfil</Button>
                        <Button onClick={handleModalClose} variant="primary">Voltar para Trilhas</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LearningPathComponent;