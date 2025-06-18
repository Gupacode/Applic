// components/features/gamification/BadgeIcon.tsx
'use client';

import React from 'react';
import * as Lucide from 'lucide-react';
import { mockDatabase } from '@/lib/database';
import type { MockBadges } from '@/lib/types';

interface BadgeIconProps {
  badgeId: string;
  xpText?: string;
  isLocked?: boolean;
}

export const BadgeIcon = ({ badgeId, xpText, isLocked }: BadgeIconProps) => {
    const badge = (mockDatabase.badges as MockBadges)[badgeId];
    if (!badge) return null;

    const IconComponent = (Lucide as any)[badge.icon] || Lucide.Badge;
    const containerClass = `flex flex-col items-center text-center group transition-all duration-300 ${isLocked ? 'opacity-40 grayscale' : ''}`;
    
    return (
        <div className={containerClass}>
            <div className={`p-4 bg-yellow-400/20 rounded-full mb-2 border-2 ${badge.color || 'border-yellow-500'}`}>
                <IconComponent className={`${badge.color || 'text-yellow-500'}`} size={48} />
            </div>
            <p className="font-bold">{badge.name}</p>
            {xpText && <p className="text-sm text-yellow-500 font-semibold">{xpText}</p>}
        </div>
    );
};

export default BadgeIcon;