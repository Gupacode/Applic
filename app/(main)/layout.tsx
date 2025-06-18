// app/(main)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Loader } from 'lucide-react'; // Usaremos um ícone de Loader para o feedback visual

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Este efeito só entra em ação DEPOIS que o AuthContext terminar de carregar.
    // Se não houver usuário, ele dispara o redirecionamento.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]); // As dependências garantem que ele rode no momento certo.

  // 1. PRIMEIRO PORTÃO (GATEKEEPER): Durante o carregamento inicial do AuthContext,
  // exibimos uma tela de loading em tela cheia.
  // Isso impede que qualquer conteúdo de 'children' seja renderizado prematuramente.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
        <Loader className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  // 2. SEGUNDO PORTÃO: Após o carregamento, se for confirmado que NÃO há usuário,
  // este componente renderiza 'null' (ou seja, uma tela em branco).
  // Isso acontece enquanto o useEffect acima está redirecionando o usuário para /login.
  // Este passo é crucial para evitar o "flash" do conteúdo antigo.
  if (!user) {
    return null;
  }

  // 3. ACESSO PERMITIDO: Se o código chegou até aqui, significa que 'loading' é false
  // e 'user' existe. Agora sim, podemos renderizar com segurança a Navbar e o
  // conteúdo protegido da página solicitada (children).
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}