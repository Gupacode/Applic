'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Definir a interface para o valor do contexto
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// 2. Passar a interface (e a possibilidade de ser nulo) para o createContext
const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Lançamos um erro se o contexto for usado fora do provider
        throw new Error("useTheme deve ser utilizado dentro de um ThemeProvider");
    }
    return context;
};

// 3. Tipar o 'children' do componente ThemeProvider
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    // O valor passado para o Provider agora corresponde à interface ThemeContextType
    const value: ThemeContextType = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};