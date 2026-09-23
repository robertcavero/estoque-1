import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Header() {
  // Inicializa o cliente do Supabase no componente
  const supabase = await createClient();
  
  // Busca o usuário logado para renderizar o ícone e e-mail
  const { data: { user } } = await supabase.auth.getUser();

  // A Server Action de Logout fica encapsulada apenas onde é necessária
  async function fazerLogout() {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut(); 
    redirect('/login'); 
  }

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-sm border-b border-gray-200 w-full px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">NutriStock</h1>
        <p className="text-gray-600">Gestão do Banco de Alimentos</p>
      </div>
      
      <div className="flex items-center gap-6">
        {/* IDENTIFICAÇÃO DO USUÁRIO */}
        <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Logado como:</span>
            <span className="text-sm font-bold text-gray-800">{user?.email}</span>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex gap-3">
          <Link href="/novo" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            + Novo Alimento
          </Link>
          
          <form action={fazerLogout}>
            <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer border border-red-200">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}