// app/page.tsx
import { redirect } from 'next/navigation';

/**
 * Esta é a página raiz da aplicação.
 * Seu único propósito é redirecionar o usuário para a página principal
 * da área logada ('/trilhas'). A lógica de autenticação no layout
 * cuidará de levar o usuário para a tela de login, se necessário.
 */
export default function HomePage() {
  // Executa um redirecionamento no lado do servidor da raiz para /trilhas
  redirect('/login');
}