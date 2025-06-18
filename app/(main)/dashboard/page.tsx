// app/(main)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { mockDatabase } from '@/lib/database';
import type { MockUserProgress } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Definimos uma interface para os dados de analytics para maior clareza
interface AnalyticsData {
    quizAnalytics: { [key: string]: { first: number; second: number; wrong: number; total: number } };
    minigameAttempts: { [key: string]: { total: number; count: number } };
    feedbackRatings: { [key: string]: { [key: string]: number } };
    comments: { comment: string; pathId: string }[];
}

export default function DashboardPage() {
    const { isAdminTestUser, loading } = useAuth();
    const router = useRouter();

    // Estado para armazenar os dados calculados e a visão atual (global ou por trilha)
    const [analytics, setAnalytics] = useState<{[key: string]: AnalyticsData} | null>(null);
    const [view, setView] = useState('global');

    // Efeito para proteger a rota: se o usuário não for admin, redireciona
    useEffect(() => {
        if (!loading && !isAdminTestUser) {
            router.push('/trilhas');
        }
    }, [isAdminTestUser, loading, router]);
    
    // Efeito para calcular os dados do dashboard quando o componente for montado
    useEffect(() => {
        const calculateAnalytics = () => {
            const progressData = Object.values(mockDatabase.userProgress);
            const feedbackData = mockDatabase.adminFeedback;
            
            const results: {[key: string]: AnalyticsData} = {
                global: { quizAnalytics: {}, minigameAttempts: {}, feedbackRatings: {}, comments: [] }
            };
            
            Object.values(mockDatabase.learningPaths).forEach(path => {
                if(path.status !== 'coming_soon') {
                    results[path.pathId] = { quizAnalytics: {}, minigameAttempts: {}, feedbackRatings: {}, comments: [] };
                }
            });

            // Processa os dados de progresso (quizzes e minigames)
            progressData.forEach(progress => {
                const pathId = progress.pathId;
                if (!results[pathId]) return;

                if (progress.quizScores) {
                    for (const [quizId, quizData] of Object.entries(progress.quizScores)) {
                        if (!quizData.results) continue;
                        
                        if (!results.global.quizAnalytics[quizId]) results.global.quizAnalytics[quizId] = { first: 0, second: 0, wrong: 0, total: 0 };
                        if (!results[pathId].quizAnalytics[quizId]) results[pathId].quizAnalytics[quizId] = { first: 0, second: 0, wrong: 0, total: 0 };
                        
                        quizData.results.forEach((res: any) => {
                            results.global.quizAnalytics[quizId].total++;
                            results[pathId].quizAnalytics[quizId].total++;
                            if (res.correct) {
                                if (res.attempts === 1) {
                                    results.global.quizAnalytics[quizId].first++;
                                    results[pathId].quizAnalytics[quizId].first++;
                                } else {
                                    results.global.quizAnalytics[quizId].second++;
                                    results[pathId].quizAnalytics[quizId].second++;
                                }
                            } else {
                                results.global.quizAnalytics[quizId].wrong++;
                                results[pathId].quizAnalytics[quizId].wrong++;
                            }
                        });
                    }
                }

                if (progress.gameAttempts) {
                    for (const [game, attempts] of Object.entries(progress.gameAttempts)) {
                        if (!results.global.minigameAttempts[game]) results.global.minigameAttempts[game] = { total: 0, count: 0 };
                        results.global.minigameAttempts[game].total += attempts;
                        results.global.minigameAttempts[game].count++;
                        
                        if(results[pathId]) {
                             if (!results[pathId].minigameAttempts[game]) results[pathId].minigameAttempts[game] = { total: 0, count: 0 };
                             results[pathId].minigameAttempts[game].total += attempts;
                             results[pathId].minigameAttempts[game].count++;
                        }
                    }
                }
            });

            // Processa os dados de feedback (avaliações e comentários)
            feedbackData.forEach(fb => {
                 const allFeedbackData = {
                    'Aprendizado': fb.learnedSomething,
                    'Duração': fb.durationFeedback,
                    'Dificuldade': fb.difficultyFeedback
                };

                for(const [category, value] of Object.entries(allFeedbackData)) {
                    if(!value) continue;
                    
                    if(!results.global.feedbackRatings[category]) results.global.feedbackRatings[category] = {};
                    results.global.feedbackRatings[category][value] = (results.global.feedbackRatings[category][value] || 0) + 1;
                    
                    if(results[fb.pathId] && !results[fb.pathId].feedbackRatings[category]) results[fb.pathId].feedbackRatings[category] = {};
                    if(results[fb.pathId]) {
                        results[fb.pathId].feedbackRatings[category][value] = (results[fb.pathId].feedbackRatings[category][value] || 0) + 1;
                    }
                }
                
                if(fb.comments) {
                    results.global.comments.push({comment: fb.comments, pathId: fb.pathId});
                     if(results[fb.pathId]) {
                         results[fb.pathId].comments.push({comment: fb.comments, pathId: fb.pathId});
                     }
                }
            });

            setAnalytics(results);
        };
        calculateAnalytics();
    }, []);

    const dataToDisplay = analytics ? analytics[view] : null;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    // Mostra um estado de carregamento enquanto verifica a autorização
    if (loading || !isAdminTestUser) {
        return <div className="p-8 text-center">Carregando ou acesso não autorizado...</div>;
    }

    // JSX completo da página do dashboard
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">Dashboard do Administrador</h1>

            <div className="mb-6">
                <label htmlFor="path-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Trilha</label>
                <select id="path-filter" value={view} onChange={(e) => setView(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="global">Visão Geral (Todas as Trilhas)</option>
                    {Object.values(mockDatabase.learningPaths).map(path => (
                        path.status !== 'coming_soon' && <option key={path.pathId} value={path.pathId}>{path.title}</option>
                    ))}
                </select>
            </div>
            
            {dataToDisplay ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card>
                        <h2 className="text-xl font-bold mb-4">Análise de Desempenho dos Quizzes</h2>
                        <div className="space-y-4">
                            {Object.keys(dataToDisplay.quizAnalytics).length > 0 ? Object.entries(dataToDisplay.quizAnalytics).map(([quizId, data]) => {
                                const total = data.total;
                                const firstTryPercent = total > 0 ? (data.first / total) * 100 : 0;
                                const secondTryPercent = total > 0 ? (data.second / total) * 100 : 0;
                                const wrongPercent = total > 0 ? (data.wrong / total) * 100 : 0;
                                
                                return (
                                    <div key={quizId} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <h3 className="font-bold">{mockDatabase.modules[quizId.replace('-q1','')]?.title || quizId}</h3>
                                        <ul className="text-sm mt-2">
                                            <li className="flex justify-between"><span>Acertos (1ª Tentativa):</span> <span className="font-semibold text-green-500">{firstTryPercent.toFixed(2)}%</span></li>
                                            <li className="flex justify-between"><span>Acertos (2ª Tentativa):</span> <span className="font-semibold text-yellow-500">{secondTryPercent.toFixed(2)}%</span></li>
                                            <li className="flex justify-between"><span>Erros:</span> <span className="font-semibold text-red-500">{wrongPercent.toFixed(2)}%</span></li>
                                        </ul>
                                    </div>
                                );
                            }) : <p className="text-gray-500">Nenhum dado de quiz disponível para esta seleção.</p>}
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Média de Tentativas nos Minigames</h2>
                         {Object.keys(dataToDisplay.minigameAttempts).length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="py-2">Cenário</th>
                                        <th className="py-2 text-right">Média de Tentativas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(dataToDisplay.minigameAttempts).map(([game, stats]) => (
                                        <tr key={game} className="border-b dark:border-gray-700">
                                            <td className="py-2">{game}</td>
                                            <td className="py-2 text-right font-semibold">{(stats.total / stats.count).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         ) : <p className="text-gray-500">Nenhum dado de minigame disponível para esta seleção.</p>}
                    </Card>
                    
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-4">Feedback Quantitativo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.keys(dataToDisplay.feedbackRatings).length > 0 ? Object.entries(dataToDisplay.feedbackRatings).map(([key, value]) => {
                                const chartData = Object.entries(value).map(([name, count]) => ({name, value: count}));
                                return (
                                <div key={key}>
                                    <h3 className="font-semibold text-center mb-2">{key}</h3>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                )
                            }) : <p className="text-gray-500 col-span-3">Nenhum dado de feedback disponível para esta seleção.</p>}
                        </div>
                    </Card>
                    
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-4">Comentários dos Usuários</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                            {dataToDisplay.comments.length > 0 ? dataToDisplay.comments.map((comment, index) => (
                                <div key={index} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="italic">"{comment.comment}"</p>
                                </div>
                            )) : <p className="text-gray-500">Nenhum comentário para esta seleção.</p>}
                        </div>
                    </Card>
                </div>
            ) : <p>Carregando dados do dashboard...</p>}
        </div>
    );
}