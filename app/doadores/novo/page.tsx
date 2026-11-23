import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function NovoDoador() {
  async function cadastrarDoador(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { error } = await supabase.from('doadores').insert([{
      nome: formData.get('nome'),
      telefone: formData.get('telefone'),
      tipo_doador: formData.get('tipo_doador'),
    }]);

    if (error) return;
    revalidatePath('/doadores');
    redirect('/doadores?sucesso=true');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar Novo Doador</h1>

        <form action={cadastrarDoador} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input name="nome" type="text" required placeholder="Ex: Mercado Central" className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input name="telefone" type="tel" placeholder="11999999999" className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Doador</label>
              <select name="tipo_doador" className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base">
                <option value="">Selecione...</option>
                <option value="Pessoa Física">Pessoa Física</option>
                <option value="Supermercado">Supermercado</option>
                <option value="Comércio Local">Comércio Local</option>
                <option value="Empresa">Empresa</option>
                <option value="Instituição">Instituição</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Salvar Doador
            </button>
            <Link href="/doadores" className="text-gray-600 font-medium py-2 px-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
