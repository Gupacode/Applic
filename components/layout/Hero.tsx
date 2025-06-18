// components/layout/Hero.tsx
'use client';

import { motion } from 'framer-motion';

export const Hero = () => (
    <div className="text-center py-16 px-4">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
        >
            Desbloqueie seu Potencial Digital
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
            Aprenda habilidades de computação de forma divertida e interativa. Comece sua jornada hoje!
        </motion.p>
    </div>
);

export default Hero;