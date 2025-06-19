// components/layout/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Navbar = () => {
    const { user, logout, isAdminTestUser } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsMenuOpen(false); // Fecha o menu após a navegação
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
        setIsMenuOpen(false); // Fecha o menu
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-40 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/trilhas')}>
                        <motion.div whileHover={{ rotate: [0, 10, -10, 0] }}>
                            <BrainCircuit size={32} className="text-indigo-600" />
                        </motion.div>
                        <span className="font-bold text-2xl ml-2">AppLic</span>
                    </div>

                    {/* Links do Menu para Desktop */}
                    <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
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

                    {/* Botão do Menu Hambúrguer para Mobile */}
                    <div className="sm:hidden flex items-center">
                        <ThemeToggle />
                        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="secondary" className="p-2 ml-2">
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Painel do Menu Mobile */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sm:hidden px-2 pt-2 pb-3 space-y-1"
                >
                    <Button onClick={() => handleNavigation('/trilhas')} variant="secondary" className="w-full justify-start">Trilhas</Button>
                    <Button onClick={() => handleNavigation('/articles')} variant="secondary" className="w-full justify-start">Artigos</Button>
                    <Button onClick={() => handleNavigation('/profile')} variant="secondary" className="w-full justify-start">Perfil</Button>
                    {isAdminTestUser && <Button onClick={() => handleNavigation('/dashboard')} variant="secondary" className="w-full justify-start">Dashboard</Button>}
                    {user && (
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                            <div className="flex items-center mb-2 px-2">
                                <span className="font-semibold">{user.username}</span>
                            </div>
                            <Button onClick={handleLogout} variant="danger" className="w-full justify-start">Sair</Button>
                        </div>
                    )}
                </motion.div>
            )}
        </nav>
    );
};