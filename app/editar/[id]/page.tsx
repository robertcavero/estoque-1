import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function EditarAlimento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: alimento } = await supabase.from('alimentos').select('*').eq('id', id).single();
  const { data: categorias } = await supabase.from('categorias').select('*');
  const { data: doadores } = await supabase.from('doadores').select('*');

  if (!alimento) return <div className="p-10 text-center">Alimento não encontrado.</div>;

  async function atualizarAlimento(formData: FormData) {
    'use server'; 
    const { error } = await supabase.from('alimentos').update({
      nome: formData.get('nome'),
      quantidade_kg: parseFloat(formData.get('quantidade_kg') as string),
      data_validade: formData.get('data_validade'),
      categoria_id: parseInt(formData.get('categoria_id') as string),
      doador_id: parseInt(formData.get('doador_id') as string),
    }).eq('id', id);

    if (!error) {
      revalidatePath('/');
      redirect('/');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Alimento</h1>
        
        <form action={atualizarAlimento} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Alimento</label>
            <input name="nome" type="text" defaultValue={alimento.nome} required className="w-full p-2 border border-gray-300 rounded-md text-black" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (kg)</label>
              <input name="quantidade_kg" type="number" step="0.1" defaultValue={alimento.quantidade_kg} required className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
              <input name="data_validade" type="date" defaultValue={alimento.data_validade} required className="w-full p-2 border border-gray-300 rounded-md text-black" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select name="categoria_id" defaultValue={alimento.categoria_id} required className="w-full p-2 border border-gray-300 rounded-md text-black">
              {categorias?.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doador Parceiro</label>
            <select name="doador_id" defaultValue={alimento.doador_id} required className="w-full p-2 border border-gray-300 rounded-md text-black">
              {doadores?.map(doador => <option key={doador.id} value={doador.id}>{doador.nome}</option>)}
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Atualizar Estoque
            </button>
            <Link href="/" className="text-gray-600 font-medium py-2 px-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}