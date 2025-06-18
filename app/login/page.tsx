// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const { login, register, user, loading } = useAuth(); // Adicionado user e loading
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Efeito para redirecionar usuários já logados
    useEffect(() => {
        // Se o contexto não estiver carregando e o usuário já existir, redirecione
        if (!loading && user) {
            router.push('/trilhas');
        }
    }, [user, loading, router]);


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (login(username, password)) {
                router.push('/trilhas');
            } else {
                setError('Nome de usuário ou senha inválidos.');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (username.length < 4) {
            setError("Nome de usuário deve ter pelo menos 4 caracteres.");
            return;
        }
        if (password.length < 6) {
            setError("Senha deve ter pelo menos 6 caracteres.");
            return;
        }
        try {
            if (register(username, password)) {
                router.push('/trilhas');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    // Se estiver carregando ou se o usuário já estiver logado, não renderize o formulário
    if (loading || user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Pode-se adicionar um spinner de carregamento aqui */}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <BrainCircuit size={48} className="mx-auto text-indigo-600" />
                    <h1 className="text-3xl font-bold mt-2">Bem-vindo ao AppLic</h1>
                    <p className="text-gray-500 dark:text-gray-400">Aprender é uma aventura.</p>
                </div>
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-center">{error}</p>}
                
                <AnimatePresence mode="wait">
                    {isRegistering ? (
                        <motion.div key="register" initial={{opacity:0, x: -50}} animate={{opacity:1, x:0}} exit={{opacity:0, x: 50}}>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <Input placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} aria-label="Nome de usuário para registro" />
                                <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Senha para registro" />
                                <Button type="submit" className="w-full">Registrar</Button>
                            </form>
                            <p className="text-center text-sm mt-4">
                                Já tem uma conta?{' '}
                                <button onClick={() => setIsRegistering(false)} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Entrar
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div key="login" initial={{opacity:0, x: 50}} animate={{opacity:1, x:0}} exit={{opacity:0, x: -50}}>
                             <form onSubmit={handleLogin} className="space-y-4">
                                <Input placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} aria-label="Nome de usuário para login" />
                                <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Senha para login" />
                                <Button type="submit" className="w-full">Entrar</Button>
                            </form>
                             <p className="text-center text-sm mt-4">
                                Não tem uma conta?{' '}
                                <button onClick={() => setIsRegistering(true)} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Registre-se
                                </button>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
}