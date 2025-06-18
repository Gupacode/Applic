// components/layout/Navbar.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Navbar = () => {
    const { user, logout, isAdminTestUser } = useAuth();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleLogout = () => { 
        logout(); 
        router.push('/login'); 
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-40 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/trilhas')}>
                        <motion.div whileHover={{ rotate: [0, 10, -10, 0] }}>
                            <BrainCircuit size={32} className="text-indigo-600" />
                        </motion.div>
                        <span className="font-bold text-2xl ml-2">AppLic</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Button onClick={() => handleNavigation('/trilhas')} variant="secondary">Trilhas</Button>
                        <Button onClick={() => handleNavigation('/articles')} variant="secondary">Artigos</Button>
                        <Button onClick={() => handleNavigation('/profile')} variant="secondary">Perfil</Button>
                        {isAdminTestUser && <Button onClick={() => handleNavigation('/dashboard')} variant="secondary">Dashboard</Button>}
                        <ThemeToggle />
                        {user && (
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold hidden sm:block">{user.username}</span>
                                <Button onClick={handleLogout} variant="danger">Sair</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};