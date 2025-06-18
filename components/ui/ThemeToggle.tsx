// components/ui/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            variant="secondary"
            className="p-2"
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
    );
};

export default ThemeToggle;