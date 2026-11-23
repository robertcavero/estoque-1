import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function EditarDoador({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: doador } = await supabase.from('doadores').select('*').eq('id', id).single();

  if (!doador) return <div className="p-10 text-center">Doador não encontrado.</div>;

  async function atualizarDoador(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { error } = await supabase.from('doadores').update({
      nome: formData.get('nome'),
      telefone: formData.get('telefone'),
      tipo_doador: formData.get('tipo_doador'),
    }).eq('id', id);

    if (!error) {
      revalidatePath('/doadores');
      redirect('/doadores');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Doador</h1>

        <form action={atualizarDoador} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input name="nome" type="text" defaultValue={doador.nome} required className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input name="telefone" type="tel" defaultValue={doador.telefone} className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Doador</label>
              <select name="tipo_doador" defaultValue={doador.tipo_doador} className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base">
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
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Atualizar Doador
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
