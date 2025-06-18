// game/PhaserGame.tsx
'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as Phaser from 'phaser';
import { Card } from '@/components/ui/Card';
import { DigitalSecurityGameScene } from './DigitalSecurityGameScene';
import { GameEventBus } from './EventBus';

interface PhaserGameProps {
    onGameEnd: (data: { score: number; time: number; attempts: any }) => void;
}

const PhaserGame = ({ onGameEnd }: PhaserGameProps) => {
    const phaserRef = useRef<Phaser.Game | null>(null);
    const [gameScore, setGameScore] = useState(0);

    const handleGameEnd = useCallback((gameData: any) => {
        onGameEnd(gameData);
    }, [onGameEnd]);

    const handleScoreUpdate = useCallback(({ score }: { score: number }) => {
        setGameScore(score);
    }, []);

    useEffect(() => {
        if (!phaserRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: 800,
                height: 750,
                parent: 'phaser-container',
                dom: { createContainer: true },
                scene: [DigitalSecurityGameScene],
                backgroundColor: '#111827'
            };
            phaserRef.current = new Phaser.Game(config);

            GameEventBus.on('gameFinished', handleGameEnd);
            GameEventBus.on('scoreUpdate', handleScoreUpdate);
        }

        return () => {
            GameEventBus.off('gameFinished', handleGameEnd);
            GameEventBus.off('scoreUpdate', handleScoreUpdate);
            if (phaserRef.current) {
                phaserRef.current.destroy(true);
                phaserRef.current = null;
            }
        };
    }, [handleGameEnd, handleScoreUpdate]);

    return (
        <Card className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Mini-Game: Cenários de Segurança</h2>
            <p className="mb-4">Pontuação: {gameScore}</p>
            <div id="phaser-container" className="w-full max-w-[800px] aspect-[8/7.5] rounded-lg overflow-hidden shadow-2xl" />
        </Card>
    );
};

export default PhaserGame;