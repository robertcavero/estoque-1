'use client';

import { useState } from 'react';
import Link from 'next/link';

type Alimento = {
  id: number;
  nome: string;
  quantidade_kg: number;
  data_validade: string;
  categoria_id: number;
  categorias: { nome: string } | null;
  doadores: { nome: string } | null;
};

type Categoria = { id: number; nome: string };

export default function EstoqueClient({
  alimentos,
  categorias,
  deletarAlimento,
}: {
  alimentos: Alimento[];
  categorias: Categoria[];
  deletarAlimento: (formData: FormData) => Promise<void>;
}) {
  const [filtro, setFiltro] = useState<number | null>(null);

  const lista = filtro ? alimentos.filter((a) => a.categoria_id === filtro) : alimentos;

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFiltro(null)}
          className={`text-sm px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
            filtro === null ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFiltro(cat.id)}
            className={`text-sm px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              filtro === cat.id ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border border-gray-100">Nenhum item encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((item) => (
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
    </>
  );
}
