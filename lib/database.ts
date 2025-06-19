import * as Lucide from 'lucide-react'; // Import necessário para os ícones

import type { MockDatabase, UserProgress } from './types';

export const mockDatabase: MockDatabase = {
    users: {
        'test-user-uid': { uid: 'test-user-uid', username: 'aprendiz', xp: 0, badges: [], currentLearningPathId: 'digital-security' },
        'test-user-2-uid': { uid: 'test-user-2-uid', username: 'novato', xp: 50, badges: ['digital-security-silver'] },
        'admin-test-uid': { uid: 'admin-test-uid', username: 'admin_test', xp: 0, badges: [] }
    },
    learningPaths: {
        'digital-security': {
            pathId: 'digital-security',
            title: 'Trilha: Segurança Digital Essencial',
            description: 'Aprenda os fundamentos para se proteger online, de phishing a senhas fortes.',
            icon: 'ShieldCheck',
            max_xp: 110,
            modules: ['ds-tutorial', 'ds-presentation', 'ds-quiz', 'ds-minigame', 'ds-feedback'],
            badges: [
                { id: 'digital-security-bronze', xp_required: 55 },
                { id: 'digital-security-silver', xp_required: 88 },
                { id: 'digital-security-gold', xp_required: 110 }
            ]
        },
        'operating-systems': {
            pathId: 'operating-systems',
            title: 'Trilha: Sistemas Operacionais',
            description: 'Em breve: Mergulhe no coração do seu computador. Aprenda sobre Windows, macOS e Linux, e como tudo funciona.',
            icon: 'HardDrive',
            max_xp: 250,
            status: 'coming_soon',
            modules: [],
            badges: [
                { id: 'os-bronze', xp_required: 125 },
                { id: 'os-silver', xp_required: 200 },
                { id: 'os-gold', xp_required: 250 }
            ]
        }
    },
    modules: {
        'ds-tutorial': { type: 'tutorial', title: 'Como Interagir' },
        'ds-presentation': { type: 'presentation', title: 'Conceitos Chave' },
        'ds-quiz': { type: 'quiz', title: 'Teste seu Conhecimento' },
        'ds-minigame': { type: 'game', title: 'Simulação Prática' },
        'ds-feedback': { type: 'feedback', title: 'Sua Opinião' },
    },
    quizzes: {
        'digital-security-q1': {
            quizId: 'digital-security-q1',
            passThreshold: 80,
            questions: [
                { id: 'q1', text: 'O que é "Phishing"?', options: [{ id: 'A', text: 'Um tipo de pescaria' }, { id: 'B', text: 'Uma tentativa de enganá-lo para obter informações sensíveis' }, { id: 'C', text: 'Um software de proteção' }, { id: 'D', text: 'Uma rede social segura' }], correctOptionId: 'B', hints: ['Pense em "pescar" informações.'], xpValue: 10 },
                { id: 'q2', text: 'Qual é a característica de uma senha forte?', options: [{ id: 'A', text: 'Curta e fácil de lembrar, como "123456"' }, { id: 'B', text: 'O nome do seu animal de estimação' }, { id: 'C', text: 'Longa, com letras, números e símbolos' }, { id: 'D', text: 'Uma única palavra do dicionário' }], correctOptionId: 'C', hints: ['Variedade e comprimento são chave.'], xpValue: 10 },
                { id: 'q3', text: 'O que o "https" no início de uma URL indica?', options: [{ id: 'A', text: 'Que o site é super rápido' }, { id: 'B', text: 'Que o site tem muitas fotos' }, { id: 'C', text: 'Que a conexão com o site é segura e criptografada' }, { id: 'D', text: 'Que o site é apenas para uso interno' }], correctOptionId: 'C', hints: ['O "s" significa "seguro".'], xpValue: 10 },
                { id: 'q4', text: 'Autenticação de Dois Fatores (2FA) serve para:', options: [{ id: 'A', text: 'Deixar o login mais rápido' }, { id: 'B', text: 'Adicionar uma camada extra de segurança à sua conta' }, { id: 'C', 'text': 'Compartilhar sua senha com um amigo' }, { id: 'D', 'text': 'Mudar sua senha automaticamente' }], correctOptionId: 'B', hints: ['Pense em duas "chaves" para entrar.'], xpValue: 10 },
                { id: 'q5', text: 'Um e-mail pedindo uma ação urgente é provavelmente:', options: [{ id: 'A', text: 'Uma oferta imperdível' }, { id: 'B', text: 'Uma tentativa de phishing' }, { id: 'C', text: 'Uma notificação do sistema' }, { id: 'D', text: 'Um e-mail de um colega' }], correctOptionId: 'B', hints: ['Urgência é uma tática comum em golpes.'], xpValue: 10 },
                { id: 'q6', text: "Você vê um smartphone de última geração por apenas R$169,90, com um cronômetro. Qual a atitude mais segura?", options: [{ id: 'A', text: 'Comprar imediatamente.' }, { id: 'B', text: 'Clicar no anúncio para garantir o desconto.' }, { id: 'C', text: 'Ignorar e pesquisar o preço em lojas conhecidas.' }, { id: 'D', text: 'Ligar para a loja oficial.' }], correctOptionId: 'C', hints: ['Preços muito baixos e urgência são sinais clássicos de golpe.'], xpValue: 10 },
            ],
        }
    },
    badges: {
        'digital-security-gold': { name: 'Mestre da Segurança (Ouro)', icon: 'Trophy', color: 'text-yellow-400 border-yellow-400' },
        'digital-security-silver': { name: 'Especialista em Segurança (Prata)', icon: 'Award', color: 'text-gray-400 border-gray-400' },
        'digital-security-bronze': { name: 'Iniciado em Segurança (Bronze)', icon: 'ShieldCheck', color: 'text-yellow-600 border-yellow-600' },
        'os-gold': { name: 'Guru dos Sistemas (Ouro)', icon: 'Trophy', color: 'text-yellow-400 border-yellow-400' },
        'os-silver': { name: 'Admin de Sistemas (Prata)', icon: 'Award', color: 'text-gray-400 border-gray-400' },
        'os-bronze': { name: 'Explorador de SO (Bronze)', icon: 'HardDrive', color: 'text-yellow-600 border-yellow-600' }
    },
    userProgress: {
        'test-user-uid_digital-security': {
            userId: 'test-user-uid', pathId: 'digital-security', completedModules: [], pathProgress: 0, xpEarnedInPath: 0, awardedBadge: null,
            quizScores: {}, gameScores: {}, gameAttempts: {}, lastAccessedModuleId: null, pathCompleted: false,
        },
        'test-user-2-uid_digital-security': {
            userId: 'test-user-2-uid', pathId: 'digital-security', completedModules: ['ds-tutorial', 'ds-presentation', 'ds-quiz', 'ds-minigame', 'ds-feedback'], pathProgress: 100, xpEarnedInPath: 110, awardedBadge: 'digital-security-gold',
            quizScores: { 'ds-quiz': { score: 60, results: [{ qId: 'q1', correct: true, attempts: 1 }, { qId: 'q2', correct: true, attempts: 1 }, { qId: 'q3', correct: true, attempts: 1 }, { qId: 'q4', correct: true, attempts: 1 }, { qId: 'q5', correct: true, attempts: 1 }, { qId: 'q6', correct: true, attempts: 1 }] } },
            gameScores: { 'ds-minigame': { score: 50 } },
            gameAttempts: { phishingEmail: 1, phishingSms: 1, fakeAd: 1, fakeWebsite: 1, passwordMeter: 1 },
            lastAccessedModuleId: 'ds-feedback', pathCompleted: true,
        },
        'admin-test-uid_digital-security': {
            userId: 'admin-test-uid', pathId: 'digital-security', completedModules: [], pathProgress: 0, xpEarnedInPath: 0, awardedBadge: null,
            quizScores: {}, gameScores: {}, gameAttempts: {}, lastAccessedModuleId: null, pathCompleted: false,
        }
    },
    adminFeedback: [
        { userId: 'test-user-2-uid', pathId: 'digital-security', rating: 5, comments: 'Muito bom!', learnedSomething: 'sim', durationFeedback: 'adequado', difficultyFeedback: 'adequado', submittedAt: new Date().toISOString() }
    ],
    articles: {
        'guia-ativacao-2fa': {
            id: 'guia-ativacao-2fa', title: 'Guia Completo de Ativação do 2FA', description: 'Aprenda o passo a passo para ativar a Autenticação de Dois Fatores nas suas principais contas online e proteja sua vida digital.', icon: 'Smartphone',
            content: `<h2>Por que Ativar o 2FA é Tão Importante?</h2><p>A Autenticação de Dois Fatores (2FA) é uma das barreiras de segurança mais fortes que você pode colocar entre suas informações e os criminosos. Mesmo que alguém descubra sua senha, o 2FA impede o acesso por exigir um segundo código que só você possui, geralmente no seu celular. Ativar essa função é um passo simples que aumenta drasticamente a segurança de suas contas.</p><h3>Passo 1: Escolha um Aplicativo Autenticador</h3><p>Embora receber códigos por SMS seja bom, usar um aplicativo dedicado é ainda mais seguro. Eles geram códigos que mudam a cada 30 segundos e não dependem da sua operadora de celular. As opções mais populares são:</p><ul><li><strong>Google Authenticator</strong></li><li><strong>Microsoft Authenticator</strong></li><li><strong>Authy</strong> (permite backup na nuvem)</li></ul><p>Baixe um desses aplicativos na loja de apps do seu smartphone (iOS ou Android).</p><h3>Passo 2: Ativando o 2FA nas Suas Contas</h3><p>O processo é parecido na maioria dos serviços. Você precisará encontrar as configurações de <strong>"Segurança"</strong> ou <strong>"Login e Segurança"</strong> da sua conta.</p><div><h4>Ativando no Google / Gmail:</h4><ol><li>Acesse sua Conta Google e vá para a aba <strong>"Segurança"</strong>.</li><li>Na seção "Como fazer login no Google", clique em <strong>"Verificação em duas etapas"</strong> e siga as instruções.</li><li>Quando solicitado, escolha a opção "App autenticador". O site exibirá um QR Code.</li><li>Abra o app autenticador no seu celular, toque em "+" e escaneie o QR Code.</li><li>Digite o código de 6 dígitos que aparece no app para finalizar a configuração.</li></ol></div><div><h4>Ativando no Instagram / Facebook:</h4><ol><li>No Instagram, vá em seu perfil > Menu (três linhas) > Configurações e privacidade > Central de Contas.</li><li>Clique em <strong>"Senha e segurança"</strong> e depois em <strong>"Autenticação de dois fatores"</strong>.</li><li>Selecione sua conta e escolha o método <strong>"Aplicativo de autenticação"</strong>.</li><li>Siga as instruções para escanear o QR Code com seu app autenticador.</li></ol></div><div><h4>Ativando no WhatsApp:</h4><ol><li>No WhatsApp, vá para Configurações > Conta > <strong>Confirmação em duas etapas</strong>.</li><li>Toque em "Ativar" e crie um PIN de 6 dígitos. <strong>Memorize bem este PIN!</strong></li><li>Adicione um e-mail de recuperação. Isso é muito importante caso você esqueça seu PIN.</li></ol></div><h3>Dica de Ouro: Salve os Códigos de Recuperação!</h3><p>Ao ativar o 2FA, a maioria dos serviços oferece um conjunto de <strong>códigos de recuperação (backup codes)</strong>. Salve-os em um lugar seguro (fora do seu celular!). Eles serão sua única forma de acesso caso você perca seu smartphone.</p>`,
        }
    }
};

export const initialProgressState: Omit<UserProgress, 'userId' | 'pathId'> = {
    completedModules: [], pathProgress: 0, xpEarnedInPath: 0, awardedBadge: null,
    quizScores: {}, gameScores: {}, gameAttempts: {}, lastAccessedModuleId: null, pathCompleted: false,
};