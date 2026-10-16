import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function NovoAlimento() {
  const supabase = await createClient();
  const { data: categorias } = await supabase.from('categorias').select('*');
  const { data: doadores } = await supabase.from('doadores').select('*');

  async function cadastrarAlimento(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { error } = await supabase.from('alimentos').insert([{
      nome: formData.get('nome'),
      quantidade_kg: parseFloat(formData.get('quantidade_kg') as string),
      data_validade: formData.get('data_validade'),
      categoria_id: parseInt(formData.get('categoria_id') as string),
      doador_id: parseInt(formData.get('doador_id') as string),
    }]);

    if (error) return;
    revalidatePath('/');
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar Novo Alimento</h1>

        <form action={cadastrarAlimento} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Alimento</label>
            <input name="nome" type="text" required placeholder="Ex: Arroz Tipo 1" className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade (kg)</label>
              <input name="quantidade_kg" type="number" step="0.1" required placeholder="0.0" className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
              <input name="data_validade" type="date" required className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select name="categoria_id" required className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base">
              <option value="">Selecione...</option>
              {categorias?.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doador Parceiro</label>
            <select name="doador_id" required className="w-full p-2.5 border border-gray-300 rounded-md text-black text-base">
              <option value="">Selecione...</option>
              {doadores?.map(doador => <option key={doador.id} value={doador.id}>{doador.nome}</option>)}
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Salvar Estoque
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
