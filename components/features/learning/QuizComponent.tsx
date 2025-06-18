// components/features/learning/QuizComponent.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDatabase } from '@/lib/database';
import type { MockQuizzes } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// 1. Adicionamos a propriedade 'title' à nossa interface
interface QuizComponentProps {
  quizId: string;
  title: string; // <-- A correção está aqui
  onQuizComplete: (data: { score: number; results: any[] }) => void;
}

// 2. Recebemos 'title' como uma prop
export const QuizComponent = ({ quizId, title, onQuizComplete }: QuizComponentProps) => {
    const quiz = (mockDatabase.quizzes as MockQuizzes)[quizId];
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [quizResults, setQuizResults] = useState<any[]>([]);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswer = (optionId: string) => {
        if (isLocked) return;

        setSelectedOption(optionId);
        const correct = optionId === currentQuestion.correctOptionId;
        setIsCorrect(correct);
        const currentAttempts = attempts + 1;
        setAttempts(currentAttempts);

        if (correct) {
            setFeedback('Correto!');
            const xpGained = currentAttempts === 1 ? currentQuestion.xpValue : Math.round(currentQuestion.xpValue / 2);
            setScore(prev => prev + xpGained);
            setQuizResults(prev => [...prev, { qId: currentQuestion.id, correct: true, attempts: currentAttempts }]);
            setIsLocked(true);
        } else {
            if (currentAttempts < 2) {
                setFeedback('Tente novamente.');
                setShowHint(true);
            } else {
                setFeedback(`A resposta correta era: ${quiz.questions[currentQuestionIndex].options.find(o => o.id === currentQuestion.correctOptionId)!.text}`);
                setQuizResults(prev => [...prev, { qId: currentQuestion.id, correct: false, attempts: currentAttempts }]);
                setIsLocked(true);
            }
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setFeedback('');
        setAttempts(0);
        setShowHint(false);
        setIsLocked(false);

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    if (quizFinished) {
        return (
            <Card className="text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Concluído!</h2>
                <p className="text-lg mb-2">Você ganhou {score} XP nesta tentativa.</p>
                <div className="mt-6 flex justify-center">
                    <Button onClick={() => onQuizComplete({ score, results: quizResults })}>Continuar Trilha</Button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            {/* 3. Usamos a prop 'title' aqui em vez de 'quiz.title' */}
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Pergunta {currentQuestionIndex + 1} de {quiz.questions.length}</p>
            <p className="text-xl mb-6">{currentQuestion.text}</p>

            <div className="space-y-4">
                {currentQuestion.options.map(option => {
                    let buttonClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
                    if (selectedOption === option.id) {
                        buttonClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
                    } else if (isLocked && !isCorrect && option.id === currentQuestion.correctOptionId) {
                        buttonClass = 'bg-green-500 text-white';
                    }
                    return (
                        <button key={option.id} onClick={() => handleAnswer(option.id)}
                            disabled={isLocked}
                            className={`w-full text-left p-4 rounded-lg transition-colors disabled:opacity-80 disabled:cursor-default ${buttonClass}`}>
                            <span className="font-bold mr-2">{option.id}.</span> {option.text}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-lg text-white ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}
                    >
                        <p className="font-bold">{feedback}</p>
                        {showHint && !isCorrect && <p className="mt-2">Dica: {currentQuestion.hints[0]}</p>}
                    </motion.div>
                )}
            </AnimatePresence>

            {isLocked && (
                <div className="mt-6 flex justify-center">
                    <Button onClick={handleNext}>
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default QuizComponent;