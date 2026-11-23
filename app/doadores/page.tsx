import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import Header from '../components/layout/Header';

export const revalidate = 0;

export default async function Doadores({ searchParams }: { searchParams: Promise<{ sucesso?: string }> }) {
  const { sucesso } = await searchParams;
  const supabase = await createClient();
  const { data: doadores, error } = await supabase
    .from('doadores')
    .select('*')
    .order('nome', { ascending: true });

  async function deletarDoador(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const supabase = await createClient();
    const { error } = await supabase.from('doadores').delete().eq('id', id);
    if (!error) revalidatePath('/doadores');
  }

  if (error) return <main className="p-10 text-red-600"><pre>{error.message}</pre></main>;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto mb-8">
        <Header pathname="/doadores" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Doadores Cadastrados</h2>
          <Link href="/doadores/novo" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
            + Novo Doador
          </Link>
        </div>

        {sucesso && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg">
            ✅ Doador cadastrado com sucesso!
          </div>
        )}

        {doadores?.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border border-gray-100">Nenhum doador cadastrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doadores?.map((doador) => (
              <div key={doador.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-bold text-gray-800">{doador.nome}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {doador.tipo_doador}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{doador.telefone}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end gap-2">
                  <Link href={`/doadores/editar/${doador.id}`} className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-1.5 px-3 rounded transition-colors">
                    Editar
                  </Link>
                  <form action={deletarDoador}>
                    <input type="hidden" name="id" value={doador.id} />
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
