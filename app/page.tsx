import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Header from './components/layout/Header';

export const revalidate = 0; 

export default async function Home() {
  // NOVA FORMA DE CHAMAR O SUPABASE
  const supabase = await createClient();

  const { data: alimentos, error } = await supabase
    .from('alimentos')
    .select('*, categorias(nome), doadores(nome)')
    .order('data_validade', { ascending: true });

  async function deletarAlimento(formData: FormData) {
    'use server';
    const id = formData.get('id');
    // Usa o cliente de servidor dentro da action também
    const supabaseServer = await createClient();
    const { error } = await supabaseServer.from('alimentos').delete().eq('id', id);
    if (!error) revalidatePath('/'); 
  }

  if (error) return <main className="p-10 text-red-600"><pre>{error.message}</pre></main>;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto mb-8">
        <Header />
      </div>
      <div className="max-w-5xl mx-auto">
        {alimentos?.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border border-gray-100">O estoque está vazio no momento.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alimentos?.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{item.nome}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {item.categorias?.nome}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex justify-between">
                      <span>Quantidade:</span>
                      <span className="font-semibold text-gray-900">{item.quantidade_kg} kg</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Validade:</span>
                      <span className="font-semibold text-gray-900">{item.data_validade}</span>
                    </p>
                    <div className="pt-2 mt-2">
                      <p className="text-xs text-gray-500">Doador: {item.doadores?.nome}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-2">
                  <Link href={`/editar/${item.id}`} className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-1.5 px-3 rounded transition-colors">
                    Editar
                  </Link>
                  <form action={deletarAlimento}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="text-sm bg-red-50 text-red-600 hover:bg-red-100 font-medium py-1.5 px-3 rounded transition-colors cursor-pointer">
                      Apagar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}