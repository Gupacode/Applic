// app/(main)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar'; // Criaremos este a seguir
import * as Lucide from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdminTestUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><Lucide.Loader className="animate-spin mr-2" /> Carregando...</div>
  }
  
  if (!user) {
    return null; // ou uma tela de carregamento
  }

  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  );
}