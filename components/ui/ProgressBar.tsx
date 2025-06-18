// components/ui/ProgressBar.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // um número de 0 a 100
  className?: string;
}

export const ProgressBar = ({ value, className = '' }: ProgressBarProps) => {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 ${className}`}>
      <motion.div
        className="bg-indigo-600 h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ProgressBar;