import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function fazerLogout() {
    'use server';
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect('/login');
  }

  return (
    <header className="flex flex-wrap justify-between items-center bg-white p-4 shadow-sm border-b border-gray-200 w-full px-4 sm:px-8 gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">NutriStock</h1>
        <p className="text-sm text-gray-600 hidden sm:block">Gestão do Banco de Alimentos</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-3 border-r border-gray-200 pr-6">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Logado como:</span>
            <span className="text-sm font-bold text-gray-800 max-w-[160px] truncate">{user?.email}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/novo" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm">
            + Novo
          </Link>

          <form action={fazerLogout}>
            <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors cursor-pointer border border-red-200 text-sm">
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
