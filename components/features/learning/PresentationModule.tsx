// components/features/learning/PresentationModule.tsx
'use client';

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PresentationModuleProps {
    onComplete: () => void;
}

export const PresentationModule = ({ onComplete }: PresentationModuleProps) => {
    const [page, setPage] = useState(0);
    const pages = [
        {
            title: "O Golpe do Anúncio Falso",
            content: (
                <div className="text-left space-y-4">
                    <p>Fique atento a ofertas que parecem boas demais para ser verdade. Golpistas criam anúncios falsos com preços muito baixos e senso de urgência (ex: 'oferta por tempo limitado!') para fazer você agir por impulso.</p>
                    <p>Eles roubam seu dinheiro em uma página de compra falsa e o produto nunca é entregue. A regra principal é: <strong>sempre desconfie e pesquise em outros lugares antes de comprar</strong>.</p>
                </div>
            ),
            icon: Lucide.ShoppingCart,
        },
        {
            title: "O Que é Phishing?",
            content: (
                <div className="text-left space-y-4">
                    <p><strong>Definição:</strong> Phishing é um tipo de crime virtual onde golpistas tentam "pescar" suas informações sensíveis (como nomes de usuário, senhas e detalhes do cartão de crédito). Eles se passam por uma instituição confiável, como um banco ou uma rede social.</p>
                    <p><strong>Como Acontece:</strong> Geralmente, você recebe um e-mail ou uma mensagem de texto (SMS) que parece legítima, pedindo que você clique em um link e insira seus dados. A mensagem pode ter um tom de urgência, como "Sua conta será bloqueada!".</p>
                    <p><strong>Como se Proteger:</strong> Desconfie de e-mails com saudações genéricas ("Prezado cliente"), erros de português e, principalmente, de links suspeitos. Nunca clique em links diretamente. Em vez disso, acesse o site oficial da empresa digitando o endereço no seu navegador.</p>
                </div>
            ),
            icon: Lucide.Fish,
        },
        {
            title: "Como Identificar Sites Falsos",
            content: (
                <div className="text-left space-y-4">
                    <p><strong>Definição:</strong> Sites falsos são páginas da web criadas para se parecerem exatamente com sites legítimos (de bancos, lojas, redes sociais) com o único objetivo de roubar as informações que você digita, como seu login e senha.</p>
                    <p><strong>O Sinal do Cadeado (HTTPS):</strong> Sempre olhe a barra de endereços do seu navegador. Um site seguro começa com <strong>"https://"</strong> e exibe um <strong>ícone de cadeado</strong>. O "S" significa "Seguro" e indica que a comunicação entre você e o site é criptografada. Isso protege seus dados de serem interceptados. Se não houver o cadeado ou se o navegador mostrar um aviso, não insira nenhuma informação pessoal!</p>
                    <p><strong>Outras Dicas:</strong> Verifique se o endereço do site está escrito corretamente (ex: "bancoobrasil" em vez de "bancobrasil"). Fique atento a erros de design, imagens de baixa qualidade e erros de português no site.</p>
                </div>
            ),
            icon: Lucide.ShieldOff,
        },
        {
            title: "A Importância de Senhas Fortes",
            content: (
                <div className="text-left space-y-4">
                    <p><strong>Por que são importantes?</strong> Senhas são a primeira linha de defesa de suas contas. Criminosos usam programas que tentam adivinhar sua senha milhões de vezes por segundo (ataque de "força bruta"). Senhas fracas, como "123456" ou "senha", podem ser quebradas em instantes.</p>
                    <p><strong>Como Criar uma Senha Forte:</strong></p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Comprimento:</strong> Use no mínimo 12 caracteres. Quanto mais longa, melhor.</li>
                        <li><strong>Mistura:</strong> Combine letras maiúsculas (A-Z), minúsculas (a-z), números (0-9) e símbolos (!@#$%).</li>
                        <li><strong>Sem informações pessoais:</strong> Evite usar datas de aniversário, nomes de familiares ou do animal de estimação.</li>
                    </ul>
                    <p><strong>A Regra de Ouro:</strong> Nunca, jamais, reutilize a mesma senha em sites diferentes. Se um site sofrer um vazamento de dados, todas as suas outras contas que usam a mesma senha estarão em risco.</p>
                </div>
            ),
            icon: Lucide.KeyRound,
        },
        {
            title: "2FA: Sua Super Proteção Online",
            content: (
                <div className="text-left space-y-4">
                    <p><strong>Definição Aprofundada:</strong> A Autenticação de Dois Fatores (2FA) é um método de segurança que exige duas formas de verificação para comprovar sua identidade. Pense nela como uma porta com duas fechaduras diferentes: mesmo que um invasor consiga a primeira chave (sua senha), ele ainda precisará da segunda para entrar.</p>
                    <p><strong>Como Funciona na Prática:</strong></p>
                     <ul className="list-disc list-inside space-y-2">
                        <li><strong>1º Fator (O que você sabe):</strong> Você digita sua senha normalmente.</li>
                        <li><strong>2º Fator (O que você tem):</strong> O sistema pede um código temporário. Esse código pode ser gerado por um aplicativo autenticador no seu smartphone.</li>
                    </ul>
                    <p><strong>Por que é essencial?</strong> Se sua senha for roubada, o 2FA é a barreira que impede o acesso à sua conta. É uma das medidas mais eficazes que você pode tomar para se proteger. Vamos abordar como ativá-la em um guia detalhado na nossa seção de artigos.</p>
                </div>
            ),
            icon: Lucide.Smartphone,
        },
    ];

    const currentPage = pages[page];
    const Icon = currentPage.icon;

    return (
        <Card>
            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
                    <Icon size={40} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold">{currentPage.title}</h2>
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 min-h-[300px] sm:min-h-[250px] leading-relaxed">
                {currentPage.content}
            </div>

            {/*
              * CORREÇÃO APLICADA AQUI:
              * - O layout agora é `flex-col` (vertical) por padrão e muda para `flex-row` (horizontal) em telas 'sm' e maiores.
              * - O espaçamento muda de vertical (`space-y-4`) para horizontal (`sm:space-x-4`).
              * - Os botões ocupam a largura total (`w-full`) em mobile e largura automática (`sm:w-auto`) em telas maiores.
              * - O contêiner de botões agora usa `flex-row-reverse sm:flex-row` para uma ordem mais lógica em mobile (Próximo/Finalizar em cima).
            */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center space-y-4 space-y-reverse sm:space-y-0">
                {page < pages.length - 1 ? (
                    <Button onClick={() => setPage(p => p + 1)} className="w-full sm:w-auto">Próximo</Button>
                ) : (
                    <Button onClick={onComplete} className="w-full sm:w-auto">Finalizar Apresentação</Button>
                )}

                <span className="text-center w-full sm:w-auto">{page + 1} / {pages.length}</span>

                <Button onClick={() => setPage(p => p - 1)} disabled={page === 0} variant="secondary" className="w-full sm:w-auto">Anterior</Button>
            </div>
        </Card>
    );
};

export default PresentationModule;