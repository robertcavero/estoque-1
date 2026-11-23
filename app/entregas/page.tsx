import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import Header from '../components/layout/Header';

export const revalidate = 0;

export default async function Entregas() {
  const supabase = await createClient();
  const { data: entregas, error } = await supabase
    .from('entregas')
    .select(`
      id, quantidade_entregue, data_entrega, status,
      beneficiarios (nome_responsavel),
      alimentos (nome)
    `)
    .order('data_entrega', { ascending: false });

  async function atualizarStatus(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const statusAtual = formData.get('status');
    const novoStatus = statusAtual === 'pendente' ? 'entregue' : 'pendente';
    const supabase = await createClient();
    await supabase.from('entregas').update({ status: novoStatus }).eq('id', id);
    revalidatePath('/entregas');
  }

  if (error) return <main className="p-10 text-red-600"><pre>{error.message}</pre></main>;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto mb-8">
        <Header pathname="/entregas" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Histórico de Entregas</h2>

        {entregas?.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border border-gray-100">Nenhuma entrega registrada.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entregas?.map((entrega) => (
              <div key={entrega.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-bold text-gray-800">{(entrega.alimentos as any)?.nome}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      entrega.status === 'entregue'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entrega.status === 'entregue' ? 'Entregue' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Beneficiário: {(entrega.beneficiarios as any)?.nome_responsavel}</p>
                  <p className="text-sm text-gray-600">Quantidade: {entrega.quantidade_entregue} kg</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(entrega.data_entrega).toLocaleDateString('pt-BR')}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <form action={atualizarStatus}>
                    <input type="hidden" name="id" value={entrega.id} />
                    <input type="hidden" name="status" value={entrega.status} />
                    <button type="submit" className={`w-full text-sm font-medium py-1.5 px-3 rounded transition-colors cursor-pointer ${
                      entrega.status === 'entregue'
                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                      {entrega.status === 'entregue' ? 'Marcar como Pendente' : 'Marcar como Entregue'}
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
