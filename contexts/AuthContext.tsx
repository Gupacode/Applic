// contexts/AuthContext.tsx
'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { mockDatabase, initialProgressState } from '@/lib/database';
import type { User, UserProgress, MockUsers, MockUserProgress } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    isAdminTestUser: boolean;
    login: (username: string, password: string) => boolean;
    register: (username: string, password: string) => boolean;
    logout: () => void;
    addXp: (amount: number) => void;
    addBadge: (badgesToAdd: string[]) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdminTestUser, setIsAdminTestUser] = useState(false);

    const login = (username: string, password: string): boolean => {
        const foundUser = Object.values(mockDatabase.users).find(u => u.username === username);
        if (foundUser) {
            setUser(foundUser);
            setIsAdminTestUser(foundUser.username === 'admin_test');
            return true;
        }
        return false;
    };

    const register = (username: string, password: string): boolean => {
        const userExists = Object.values(mockDatabase.users).some(u => u.username === username);
        if (userExists) {
            throw new Error('Este nome de usuário já está em uso.');
        }

        const uid = crypto.randomUUID();
        const newUser: User = { uid, username, xp: 0, badges: [] };
        
        // Usamos o type casting para informar ao TS que nosso objeto permite chaves de string
        (mockDatabase.users as MockUsers)[uid] = newUser;
        
        Object.keys(mockDatabase.learningPaths).forEach(pathId => {
            const progressKey = `${uid}_${pathId}`;
            const newProgress: UserProgress = {
                ...initialProgressState,
                userId: uid,
                pathId: pathId,
            };
            (mockDatabase.userProgress as MockUserProgress)[progressKey] = newProgress;
        });
        
        setUser(newUser);
        setIsAdminTestUser(false);
        return true;
    };
    
    const logout = () => {
        if(isAdminTestUser && user) {
           const progressKey = `${user.uid}_digital-security`;
           (mockDatabase.userProgress as MockUserProgress)[progressKey] = {
               ...initialProgressState, 
               userId: user.uid, 
               pathId: 'digital-security'
            };
           (mockDatabase.users as MockUsers)[user.uid].badges = [];
           (mockDatabase.users as MockUsers)[user.uid].xp = 0;
        }
        setUser(null);
        setIsAdminTestUser(false);
    };

    const addXp = (amount: number) => {
        if (!user) return;
        setUser(prev => {
            if (!prev) return null;
            const newXp = (prev.xp || 0) + amount;
            if ((mockDatabase.users as MockUsers)[prev.uid]) {
                (mockDatabase.users as MockUsers)[prev.uid].xp = newXp;
            }
            return { ...prev, xp: newXp };
        });
    };
    
    const addBadge = (badgesToAdd: string[]) => {
        if (!user || !badgesToAdd || badgesToAdd.length === 0) return;
        setUser(prev => {
            if (!prev) return null;
            const currentBadges = new Set(prev.badges);
            badgesToAdd.forEach(id => currentBadges.add(id));
            const finalBadges = Array.from(currentBadges);

            if (finalBadges.length === prev.badges.length) return prev;
            
            (mockDatabase.users as MockUsers)[user.uid].badges = finalBadges;
            return { ...prev, badges: finalBadges };
        });
    };

    useEffect(() => { setLoading(false); }, []);

    const value = { user, isAdminTestUser, login, register, logout, addXp, addBadge, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};