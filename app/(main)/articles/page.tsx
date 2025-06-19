// app/(main)/articles/page.tsx
'use client';

import React, { useState } from 'react';
import { mockDatabase } from '@/lib/database';
import type { Article } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArticleCard } from '@/components/features/articles/ArticleCard';
import { ArrowLeft } from 'lucide-react';

export default function ArticlesPage() {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const articles = Object.values(mockDatabase.articles);

    if (selectedArticle) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                 <Button onClick={() => setSelectedArticle(null)} variant="secondary" className="mb-8 inline-flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para Artigos
                </Button>
                <Card>
                    {/* Adicionamos a classe 'prose' do Tailwind para uma estilização automática do HTML */}
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Artigos e Dicas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map(article => (
                     <ArticleCard key={article.id} article={article} onRead={() => setSelectedArticle(article)} />
                ))}
            </div>
        </div>
    );
};