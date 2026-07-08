import { getApiUrl } from '@/config';
import ProductCard from '@/components/ui/ProductCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

// Esta função pode ser mantida para SSG (estático) ou pode ser dinâmica se preferir.
async function getProdutos() {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/api/produtos/vitrine`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Falha ao carregar produtos');
  return res.json();
}

export default async function LojaPage() {
  const produtos = await getProdutos();
  // Nota: As categorias também devem ser buscadas no build, ou via client-side.
  // Vou assumir que você tem uma função para pegar categorias. Aqui, vou colocar um array mock para o filtro funcionar visualmente.
  // Substitua "categoriasMock" pelo seu fetch real de categorias.
  const categoriasMock = [
    { _id: '1', nome: 'Algodão' },
    { _id: '2', nome: 'Seda' },
    { _id: '3', nome: 'Linho' },
    { _id: '4', nome: 'Cetim' },
    { _id: '5', nome: 'Veludo' },
  ];

  // Estado para filtros (precisa ser client-side para interação, mas como a página é async, 
  // podemos criar um componente cliente separado para os filtros, ou usar um provider.
  // Para simplificar este exemplo, vou usar um componente cliente que envolve a lógica de filtros e renderiza os produtos.
  // Na prática, você vai querer mover essa lógica para um componente client-side.

  return (
    <main className="min-h-screen bg-white pb-24">
      
      {/* Título e Subtítulo Centralizados */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider text-[#1a1a1a] mb-2">
          Nossa Coleção
        </h1>
        <p className="text-sm font-light text-[#8a7a6a] tracking-wide">
          Explore nossos tecidos selecionados com a elegância que você merece.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex gap-12">
        {/* Lado Esquerdo: Filtro (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FiltersSidebar
            precoMin={0}
            precoMax={1000}
            precoMaxGlobal={1000}
            categorias={categoriasMock}
            categoriasSelecionadas={[]}
            onPrecoChange={() => {}}
            onCategoriaChange={() => {}}
            limparFiltros={() => {}}
          />
        </div>

        {/* Lado Direito: Produtos */}
        <div className="flex-1">
          {/* Barra de informações (Contagem e Ordenação) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-sm font-light text-[#8a7a6a]">
              {produtos.length} produtos
            </p>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Botão Filtro Mobile */}
              <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-light text-[#1a1a1a] hover:bg-gray-50 transition">
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                Filtros
              </button>

              <select className="w-full sm:w-auto border border-gray-200 rounded-full px-4 py-2 text-sm font-light text-[#1a1a1a] focus:outline-none bg-transparent">
                <option value="">Mais relevantes</option>
                <option value="menor-preco">Menor Preço</option>
                <option value="maior-preco">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {produtos.map((produto: any) => (
              <ProductCard key={produto._id} produto={produto} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Drawer de Filtro (Ficará oculto até ser aberto) */}
      {/* Você precisará de um estado para controlar a abertura do drawer */}
    </main>
  );
}