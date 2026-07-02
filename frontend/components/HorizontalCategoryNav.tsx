'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import {
  Package, Scissors, Sparkles, Tag, ChevronDown, Search, Gem
} from 'lucide-react';

export default function HorizontalCategoryNav() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [menuCategoriasAberto, setMenuCategoriasAberto] = useState(false);
  const [menuSegmentosAberto, setMenuSegmentosAberto] = useState(false);
  const [maiorDesconto, setMaiorDesconto] = useState(0);
  const [qtdPromocoes, setQtdPromocoes] = useState(0);
  const [qtdNovidades, setQtdNovidades] = useState(0);
  const [contagemPorCategoria, setContagemPorCategoria] = useState<Record<string, number>>({});

  const [catBtnRect, setCatBtnRect] = useState<DOMRect | null>(null);
  const [segBtnRect, setSegBtnRect] = useState<DOMRect | null>(null);
  const [catBtnEl, setCatBtnEl] = useState<HTMLElement | null>(null);
  const [segBtnEl, setSegBtnEl] = useState<HTMLElement | null>(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const apiUrl = getApiUrl();
    axios.get(`${apiUrl}/api/categorias`)
      .then(res => setCategorias(res.data))
      .catch(console.error);

    axios.get(`${apiUrl}/api/produtos/vitrine`)
      .then(res => {
        const produtos = res.data;
        const promos = produtos.filter((p: any) => p.preco_original && p.preco_original > p.preco);
        setQtdPromocoes(promos.length);
        if (promos.length > 0) {
          setMaiorDesconto(Math.max(...promos.map((p: any) =>
            Math.round((1 - p.preco / p.preco_original) * 100)
          )));
        }

        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
        const novidades = produtos.filter((p: any) => new Date(p.createdAt) >= seteDiasAtras);
        setQtdNovidades(novidades.length);

        const contagem: Record<string, number> = {};
        produtos.forEach((p: any) => {
          const catId = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
          if (catId) contagem[catId] = (contagem[catId] || 0) + 1;
        });
        setContagemPorCategoria(contagem);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const atualizar = () => {
      if (catBtnEl && menuCategoriasAberto) setCatBtnRect(catBtnEl.getBoundingClientRect());
      if (segBtnEl && menuSegmentosAberto) setSegBtnRect(segBtnEl.getBoundingClientRect());
    };
    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    return () => {
      window.removeEventListener('scroll', atualizar);
      window.removeEventListener('resize', atualizar);
    };
  }, [catBtnEl, segBtnEl, menuCategoriasAberto, menuSegmentosAberto]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-trigger') && !target.closest('.portal-dropdown')) {
        setMenuCategoriasAberto(false);
        setMenuSegmentosAberto(false);
        setFiltro('');
      }
    };
    const handleScroll = () => {
      setMenuCategoriasAberto(false);
      setMenuSegmentosAberto(false);
      setFiltro('');
    };
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleCat = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    setCatBtnEl(btn); setCatBtnRect(btn.getBoundingClientRect());
    setMenuCategoriasAberto(!menuCategoriasAberto);
    setMenuSegmentosAberto(false); setFiltro('');
  };

  const toggleSeg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    setSegBtnEl(btn); setSegBtnRect(btn.getBoundingClientRect());
    setMenuSegmentosAberto(!menuSegmentosAberto);
    setMenuCategoriasAberto(false); setFiltro('');
  };

  const catsFiltradas = filtro.trim()
    ? categorias.filter(c => c.nome.toLowerCase().includes(filtro.toLowerCase()))
    : categorias;

  const colunas = 3;
  const itensPorCol = Math.ceil(catsFiltradas.length / colunas);
  const colsArray = Array.from({ length: colunas }, (_, i) =>
    catsFiltradas.slice(i * itensPorCol, (i + 1) * itensPorCol)
  );

  const metade = Math.ceil(categorias.length / 2);
  const linhaProf = categorias.slice(0, metade);
  const linhaDeco = categorias.slice(metade);

  const CategoriasPanel = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[640px] max-w-[90vw] animate-fadeIn">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text" placeholder="Filtrar categorias..." value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        {colsArray.map((col, i) => (
          <div key={i} className="space-y-1">
            {col.map(cat => (
              <Link key={cat._id} href={`/categoria/${cat.slug}`}
                onClick={() => { setMenuCategoriasAberto(false); setFiltro(''); }}
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
              >
                <span className="flex items-center gap-2"><span className="text-base">📌</span>{cat.nome}</span>
                {contagemPorCategoria[cat._id] !== undefined && (
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{contagemPorCategoria[cat._id]}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
        {catsFiltradas.length === 0 && (
          <p className="col-span-3 text-center text-gray-400 text-sm py-4">Nenhuma categoria encontrada.</p>
        )}
      </div>
    </div>
  );

  const SegmentosPanel = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-[640px] max-w-[90vw] animate-fadeIn">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-blue-600" /> Linha Profissional
          </h3>
          <ul className="space-y-1">
            {linhaProf.length > 0 ? linhaProf.map(cat => (
              <li key={cat._id}>
                <Link href={`/categoria/${cat.slug}`} onClick={() => setMenuSegmentosAberto(false)}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2"><span className="text-base">📌</span>{cat.nome}</span>
                  {contagemPorCategoria[cat._id] !== undefined && (
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{contagemPorCategoria[cat._id]}</span>
                  )}
                </Link>
              </li>
            )) : <p className="text-gray-400 text-sm">Nenhuma categoria</p>}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Gem className="w-4 h-4 text-blue-600" /> Linha Decorativa
          </h3>
          <ul className="space-y-1">
            {linhaDeco.length > 0 ? linhaDeco.map(cat => (
              <li key={cat._id}>
                <Link href={`/categoria/${cat.slug}`} onClick={() => setMenuSegmentosAberto(false)}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2"><span className="text-base">📌</span>{cat.nome}</span>
                  {contagemPorCategoria[cat._id] !== undefined && (
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{contagemPorCategoria[cat._id]}</span>
                  )}
                </Link>
              </li>
            )) : <p className="text-gray-400 text-sm">Nenhuma categoria</p>}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-[#0a1628] to-[#111f33] shadow-lg border-b border-blue-900/30 sticky top-20 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 md:gap-10 py-3 overflow-x-auto scrollbar-hide">
        {/* Categorias */}
        <div className="relative flex-shrink-0 dropdown-trigger">
          <button onClick={toggleCat}
            className="flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors whitespace-nowrap group"
          >
            <Package className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" strokeWidth={1.5} />
            <span>Categorias</span>
            {categorias.length > 0 && (
              <span className="text-xs text-white/50 font-medium bg-white/10 px-2 py-0.5 rounded-full">{categorias.length}</span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform text-white/50 ${menuCategoriasAberto ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <span className="w-px h-5 bg-white/10 hidden md:block" />

        {/* Segmentos */}
        <div className="relative flex-shrink-0 dropdown-trigger">
          <button onClick={toggleSeg}
            className="flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors whitespace-nowrap group"
          >
            <Scissors className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" strokeWidth={1.5} />
            <span>Segmentos</span>
            <ChevronDown className={`w-4 h-4 transition-transform text-white/50 ${menuSegmentosAberto ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <span className="w-px h-5 bg-white/10 hidden md:block" />

        {/* Novidades */}
        <Link href="/novidades"
          className="flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors whitespace-nowrap flex-shrink-0 group"
        >
          <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" strokeWidth={1.5} />
          <span>Novidades</span>
          {qtdNovidades > 0 && (
            <span className="bg-blue-600 text-white text-[11px] font-bold rounded-full px-2.5 py-0.5 leading-none shadow-sm shadow-blue-600/30">
              +{qtdNovidades}
            </span>
          )}
        </Link>

        <span className="w-px h-5 bg-white/10 hidden md:block" />

        {/* Promoções */}
        <Link href="/promocoes"
          className="flex items-center gap-2 py-2 text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors whitespace-nowrap flex-shrink-0 group"
        >
          <Tag className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-colors" strokeWidth={1.5} />
          <span>Promoções</span>
          {qtdPromocoes > 0 && <span className="text-xs text-white/60 font-medium">({qtdPromocoes})</span>}
          {maiorDesconto > 0 && (
            <span className="ml-1 bg-rose-600 text-white text-[11px] font-bold rounded-full px-2.5 py-0.5 leading-none shadow-sm shadow-rose-600/30 animate-pulse">
              Até {maiorDesconto}% OFF
            </span>
          )}
        </Link>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <>
          {menuCategoriasAberto && catBtnRect && (
            <div className="portal-dropdown fixed z-[99999] transition-opacity duration-200"
              style={{ top: catBtnRect.bottom + 8, left: catBtnRect.left }}
            ><CategoriasPanel /></div>
          )}
          {menuSegmentosAberto && segBtnRect && (
            <div className="portal-dropdown fixed z-[99999] transition-opacity duration-200"
              style={{ top: segBtnRect.bottom + 8, left: segBtnRect.left, maxWidth: '90vw' }}
            ><SegmentosPanel /></div>
          )}
        </>,
        document.body
      )}
    </nav>
  );
}