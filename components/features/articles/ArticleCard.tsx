// components/features/articles/ArticleCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  onRead: () => void;
}

export const ArticleCard = ({ article, onRead }: ArticleCardProps) => {
    const IconComponent = (Lucide as any)[article.icon] || Lucide.FileText;
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            className="w-full cursor-pointer"
            onClick={onRead}
        >
            <Card className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                    <IconComponent size={40} className="text-indigo-500 mr-4" />
                    <h3 className="text-xl font-bold">{article.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{article.description}</p>
                <div className="mt-auto text-indigo-500 font-semibold inline-flex items-center">
                    Ler artigo
                    <Lucide.ArrowRight size={16} className="ml-1" />
                </div>
            </Card>
        </motion.div>
    );
};

export default ArticleCard;