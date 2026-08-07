function LojaContent() {
  const searchParams = useSearchParams();
  const buscaInicial = searchParams.get('busca') || '';

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);
  const [precoMaxGlobal, setPrecoMaxGlobal] = useState(1000);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState('');
  const [busca, setBusca] = useState(buscaInicial);
  const [pagina, setPagina] = useState(1);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const ITENS_POR_PAGINA = 16;

  useEffect(() => {
    const apiUrl = getApiUrl();
    Promise.all([
      axios.get(`${apiUrl}/api/produtos/vitrine`),
      axios.get(`${apiUrl}/api/categorias`),
    ])
      .then(([resProdutos, resCategorias]) => {
        const prods = extractDataArray<Produto>(resProdutos.data);
        const cats = Array.isArray(resCategorias.data) ? resCategorias.data : [];
        setProdutos(prods);
        setCategorias(cats);
        const maxPreco = prods.length > 0 ? Math.max(...prods.map((p: Produto) => p.preco), 100) : 1000;
        setPrecoMaxGlobal(maxPreco);
        setPrecoMax(maxPreco);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const produtosFiltrados = produtos
    .filter(p => {
      if (busca.trim() && !p.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      if (p.preco < precoMin || p.preco > precoMax) return false;
      if (categoriasSelecionadas.length) {
        const idCat = typeof p.categoria === 'object' ? p.categoria?._id : p.categoria;
        if (!idCat || !categoriasSelecionadas.includes(String(idCat))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === 'menor-preco') return a.preco - b.preco;
      if (ordenacao === 'maior-preco') return b.preco - a.preco;
      if (ordenacao === 'nome') return a.nome.localeCompare(b.nome);
      return 0;
    });

  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);
  const paginaAtual = produtosFiltrados.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA);

  const limparFiltros = () => {
    setBusca('');
    setPrecoMin(0);
    setPrecoMax(precoMaxGlobal);
    setCategoriasSelecionadas([]);
    setOrdenacao('');
    setPagina(1);
  };

  const handlePrecoChange = (min: number, max: number) => { setPrecoMin(min); setPrecoMax(max); setPagina(1); };
  const handleCategoriaChange = (catId: string) => {
    setCategoriasSelecionadas(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
    setPagina(1);
  };

  const activeFilters = categoriasSelecionadas.length + (precoMin > 0 || precoMax < precoMaxGlobal ? 1 : 0);

  // Categorias populares (exemplo – as 5 primeiras)
  const categoriasPopulares = categorias.slice(0, 5);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* HERO DA LOJA */}
      <div className="bg-light border-b border-gray-mid py-16 md:py-20">
        <div className="main-container text-center">
          <h1 className="font-serif font-semibold text-4xl md:text-5xl text-metallic-navy tracking-wide mb-3">
            Nossa Coleção
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-lg mx-auto">
            Explore nossos tecidos selecionados com a elegância que você merece.
          </p>
        </div>
      </div>

      <div className="main-container py-16 md:py-20">
        <div className="flex gap-8 lg:gap-12">
          {/* SIDEBAR – CORRIGIDO (REMOVIDO bg-white, border E shadow) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <FiltersSidebar
                precoMin={precoMin}
                precoMax={precoMax}
                precoMaxGlobal={precoMaxGlobal}
                categorias={categorias}
                categoriasSelecionadas={categoriasSelecionadas}
                onPrecoChange={handlePrecoChange}
                onCategoriaChange={handleCategoriaChange}
                limparFiltros={limparFiltros}
              />

              {/* ✅ CONTEÚDO ABAIXO DO FILTRO – preenche o espaço vazio */}
              <div className="mt-8 pt-6 border-t border-gray-mid/30 space-y-6">
                
                {/* Categorias Populares */}
                {categoriasPopulares.length > 0 && (
                  <div>
                    <h4 className="text-xs font-primary font-medium uppercase tracking-wider text-text-light mb-3 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" strokeWidth={2} />
                      Categorias em Destaque
                    </h4>
                    <ul className="space-y-1.5">
                      {categoriasPopulares.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            href={`/categoria/${cat._id}`}
                            className="text-sm text-text-secondary hover:text-gold transition-colors font-light"
                          >
                            {cat.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Produtos em Alta (mini versão) */}
                <div>
                  <h4 className="text-xs font-primary font-medium uppercase tracking-wider text-text-light mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                    Mais Vendidos
                  </h4>
                  <div className="space-y-2">
                    {produtos.slice(0, 3).map((prod) => (
                      <Link
                        key={prod._id}
                        href={`/produto/${prod._id}`}
                        className="flex items-center gap-3 p-2 rounded-button hover:bg-light transition-colors group"
                      >
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-mid flex-shrink-0">
                          {prod.fotos?.[0] && (
                            <img
                              src={prod.fotos[0].replace('http://localhost:5000', 'https://partenontecidos.onrender.com')}
                              alt={prod.nome}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-dark-light truncate group-hover:text-gold transition-colors">
                            {prod.nome}
                          </p>
                          <p className="text-xs text-text-light">R$ {prod.preco.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/loja?ordenacao=mais-vendidos"
                    className="text-xs text-gold hover:underline font-medium mt-2 inline-block"
                  >
                    Ver todos →
                  </Link>
                </div>

                {/* Selo de qualidade */}
                <div className="bg-gold/5 border border-gold/20 rounded-card p-4 text-center">
                  <Star className="w-5 h-5 text-gold mx-auto mb-1" strokeWidth={2} />
                  <p className="text-xs font-medium text-dark-light">Qualidade Premium</p>
                  <p className="text-[10px] text-text-light">Tecidos selecionados</p>
                </div>
              </div>
            </div>
          </aside>

          /* ... (restante do código da página da loja permanece igual) ... */</div>