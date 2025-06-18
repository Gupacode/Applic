// gupacode/applic/Applic-mod/components/features/learning/FeedbackModule.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDatabase } from '@/lib/database';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FeedbackModuleProps {
    onComplete: () => void;
}

export const FeedbackModule = ({ onComplete }: FeedbackModuleProps) => {
    const [learnedSomething, setLearnedSomething] = useState<string | null>(null);
    const [durationFeedback, setDurationFeedback] = useState<string | null>(null);
    const [difficultyFeedback, setDifficultyFeedback] = useState<string | null>(null);
    const [comments, setComments] = useState('');
    const { user } = useAuth();

    const handleSubmit = () => {
        if (!user) return;
        const feedbackData = {
            userId: user.uid,
            pathId: 'digital-security', // Idealmente, isso seria dinâmico
            learnedSomething,
            durationFeedback,
            difficultyFeedback,
            comments,
            submittedAt: new Date().toISOString()
        };
        mockDatabase.adminFeedback.push(feedbackData as any);
        onComplete();
    };

    const FeedbackButton = ({ label, groupState, setGroupState, value }: any) => {
        const isSelected = groupState === value;
        return <Button onClick={() => setGroupState(value)} variant={isSelected ? 'primary' : 'secondary'} className="flex-1">{label}</Button>;
    };

    return (
        <Card className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sua Opinião é Importante!</h2>
            
            <div>
                <p className="font-semibold mb-2">Você aprendeu algo novo com esta trilha?</p>
                <div className="flex space-x-2">
                    <FeedbackButton label="Sim" groupState={learnedSomething} setGroupState={setLearnedSomething} value="sim" />
                    <FeedbackButton label="Não" groupState={learnedSomething} setGroupState={setLearnedSomething} value="nao" />
                </div>
            </div>
            
            <div>
                <p className="font-semibold mb-2">O que achou da duração do material?</p>
                <div className="flex space-x-2">
                    <FeedbackButton label="Muito Curto" groupState={durationFeedback} setGroupState={setDurationFeedback} value="muito_curto" />
                    <FeedbackButton label="Adequada" groupState={durationFeedback} setGroupState={setDurationFeedback} value="adequado" />
                    <FeedbackButton label="Muito Longo" groupState={durationFeedback} setGroupState={setDurationFeedback} value="muito_longo" />
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Qual o grau de dificuldade do material para você?</p>
                <div className="flex space-x-2">
                     <FeedbackButton label="Muito Fácil" groupState={difficultyFeedback} setGroupState={setDifficultyFeedback} value="muito_facil" />
                    <FeedbackButton label="Adequado" groupState={difficultyFeedback} setGroupState={setDifficultyFeedback} value="adequado" />
                    <FeedbackButton label="Muito Difícil" groupState={difficultyFeedback} setGroupState={setDifficultyFeedback} value="muito_dificil" />
                </div>
            </div>

            <div>
                 <p className="font-semibold mb-2">Comentários ou sugestões (opcional):</p>
                 <textarea value={comments} onChange={e => setComments(e.target.value)}
                    className="w-full h-24 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="O que você achou?"
                 />
            </div>
            
            <Button onClick={handleSubmit} className="w-full">Enviar Feedback e Concluir</Button>
        </Card>
    );
};

export default FeedbackModule;