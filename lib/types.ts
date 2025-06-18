// lib/types.ts
// Este arquivo centraliza todas as definições de interface TypeScript para o projeto,
// garantindo consistência e segurança de tipos em toda a aplicação.

/**
 * Representa um único usuário no sistema.
 */
export interface User {
  uid: string;
  username: string;
  xp: number;
  badges: string[];
  currentLearningPathId?: string;
}

/**
 * Representa um item de opção dentro de uma questão de quiz.
 */
export interface QuizOption {
  id: string;
  text: string;
}

/**
 * Representa uma única questão em um quiz.
 */
export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
  hints: string[];
  xpValue: number;
}

/**
 * Representa a estrutura completa de um quiz.
 */
export interface Quiz {
  quizId: string;
  passThreshold: number;
  questions: QuizQuestion[];
}

/**

 * Representa a definição de uma badge que pode ser ganha em uma trilha.
 */
export interface PathBadge {
  id: string;
  xp_required: number;
}

/**
 * Representa uma trilha de aprendizado completa.
 */
export interface LearningPath {
  pathId: string;
  title: string;
  description: string;
  icon: string;
  max_xp: number;
  modules: string[];
  badges: PathBadge[];
  status?: 'coming_soon';
}

/**

 * Representa um módulo individual dentro de uma trilha.
 */
export interface Module {
  type: 'tutorial' | 'presentation' | 'quiz' | 'game' | 'feedback';
  title: string;
}

/**
 * Representa a definição de uma badge (conquista).
 */
export interface Badge {
  name: string;
  icon: string;
  color: string;
}

/**
 * Representa o progresso de um usuário em uma trilha específica.
 */
export interface UserProgress {
  userId: string;
  pathId: string;
  completedModules: string[];
  pathProgress: number;
  xpEarnedInPath: number;
  awardedBadge: string | null;
  quizScores: { [key: string]: any };
  gameScores: { [key: string]: any };
  gameAttempts: { [key: string]: any };
  lastAccessedModuleId: string | null;
  pathCompleted: boolean;
}

/**
 * Representa o feedback enviado por um usuário.
 */
export interface AdminFeedback {
  userId: string;
  pathId: string;
  rating?: number;
  comments: string;
  learnedSomething: 'sim' | 'nao' | null;
  durationFeedback: 'muito_curto' | 'adequado' | 'muito_longo' | null;
  difficultyFeedback: 'muito_facil' | 'adequado' | 'muito_dificil' | null;
  submittedAt: string;
}

/**
 * Representa um artigo ou guia.
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
}


// --- Tipos para o Mock Database ---
// A sintaxe [key: string] é a "assinatura de índice" (index signature).
// Ela informa ao TypeScript que o objeto pode ser indexado por qualquer string,
// resolvendo os erros de "no index signature".

export type MockUsers = { [key: string]: User };
export type MockLearningPaths = { [key: string]: LearningPath };
export type MockModules = { [key: string]: Module };
export type MockQuizzes = { [key: string]: Quiz };
export type MockBadges = { [key: string]: Badge };
export type MockUserProgress = { [key: string]: UserProgress };
export type MockArticles = { [key: string]: Article };

/**
 * Representa a estrutura completa do nosso banco de dados mock.
 */
export interface MockDatabase {
    users: MockUsers;
    learningPaths: MockLearningPaths;
    modules: MockModules;
    quizzes: MockQuizzes;
    badges: MockBadges;
    userProgress: MockUserProgress;
    adminFeedback: AdminFeedback[];
    articles: MockArticles;
}