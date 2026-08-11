// ========== INSIGHTS ==========
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito.' });

    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje);
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    // 1. Produtos com baixo estoque
    let produtosBaixoEstoque = [];
    try {
      produtosBaixoEstoque = await Produto.find({
        ativo: true,
        $expr: { $lte: ['$estoque', '$alerta_minimo'] }
      }).select('nome estoque alerta_minimo').lean();
    } catch (err) {
      console.error('Erro em produtosBaixoEstoque:', err);
      produtosBaixoEstoque = [];
    }

    // 2. Vendas por produto (últimos 30 dias)
    let vendasPorProduto = [];
    try {
      vendasPorProduto = await Pedido.aggregate([
        { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
        { $unwind: '$itens' },
        { $group: {
            _id: '$itens.produtoId',
            total_vendido: { $sum: '$itens.quantidade' },
            receita: { $sum: { $multiply: ['$itens.quantidade', '$itens.preco'] } }
          }
        },
        { $sort: { total_vendido: -1 } },
        { $limit: 10 }
      ]);
    } catch (err) {
      console.error('Erro em vendasPorProduto:', err);
      vendasPorProduto = [];
    }

    // 3. Produtos com baixa performance (não venderam nos últimos 30 dias)
    let produtosBaixaPerformance = [];
    try {
      const todosProdutosAtivos = await Produto.find({ ativo: true }, '_id nome').lean();
      const idsComVendas = vendasPorProduto.filter(v => v._id).map(v => v._id.toString());
      produtosBaixaPerformance = todosProdutosAtivos
        .filter(p => p._id && !idsComVendas.includes(p._id.toString()))
        .slice(0, 5);
    } catch (err) {
      console.error('Erro em produtosBaixaPerformance:', err);
      produtosBaixaPerformance = [];
    }

    // 4. Sugestões de reposição (otimizado com uma única agregação)
    let sugestoesReposicao = [];
    try {
      if (produtosBaixoEstoque.length > 0) {
        const idsBaixoEstoque = produtosBaixoEstoque.map(p => p._id);
        const vendasPeriodo = await Pedido.aggregate([
          { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
          { $unwind: '$itens' },
          { $match: { 'itens.produtoId': { $in: idsBaixoEstoque } } },
          { $group: { _id: '$itens.produtoId', total: { $sum: '$itens.quantidade' } } }
        ]);

        const vendasMap = new Map(vendasPeriodo.map(v => [v._id.toString(), v.total]));
        sugestoesReposicao = produtosBaixoEstoque.map(prod => {
          const totalVendido = vendasMap.get(prod._id.toString()) || 0;
          const mediaDiaria = totalVendido / 30;
          const recomendado = Math.ceil(mediaDiaria * 7);
          return {
            _id: prod._id,
            nome: prod.nome,
            estoque_atual: prod.estoque,
            alerta_minimo: prod.alerta_minimo,
            media_diaria: mediaDiaria.toFixed(2),
            recomendado_comprar: recomendado > 0 ? recomendado : prod.alerta_minimo * 2
          };
        });
      }
    } catch (err) {
      console.error('Erro em sugestoesReposicao:', err);
      sugestoesReposicao = [];
    }

    // 5. Categoria top (últimos 30 dias)
    let categoriaTop = [];
    let fraseDestaque = '📊 Nenhuma venda registrada nos últimos 30 dias.';
    try {
      categoriaTop = await Pedido.aggregate([
        { $match: { status: { $ne: 'cancelado' }, createdAt: { $gte: trintaDiasAtras } } },
        { $unwind: '$itens' },
        { $lookup: {
            from: 'produtos',
            localField: 'itens.produtoId',
            foreignField: '_id',
            as: 'produto'
          }
        },
        { $unwind: { path: '$produto', preserveNullAndEmptyArrays: true } },
        // Converte o campo categoria (string) para ObjectId antes do lookup
        { $addFields: {
            categoriaObjectId: { $toObjectId: '$produto.categoria' }
          }
        },
        { $lookup: {
            from: 'categorias',
            localField: 'categoriaObjectId',
            foreignField: '_id',
            as: 'categoria'
          }
        },
        { $unwind: { path: '$categoria', preserveNullAndEmptyArrays: true } },
        { $group: {
            _id: { $ifNull: ['$categoria.nome', 'Sem categoria'] },
            total: { $sum: '$itens.quantidade' }
          }
        },
        { $sort: { total: -1 } },
        { $limit: 1 }
      ]);

      if (categoriaTop.length > 0) {
        fraseDestaque = `🔥 A categoria "${categoriaTop[0]._id}" foi a mais vendida nos últimos 30 dias, com ${categoriaTop[0].total} metros comercializados.`;
      }
    } catch (err) {
      console.error('Erro em categoriaTop:', err);
      categoriaTop = [];
    }

    // 6. Ranking de vendas (top 5)
    let rankingVendas = [];
    try {
      rankingVendas = await Promise.all(vendasPorProduto.slice(0, 5).map(async (v) => {
        const produto = await Produto.findById(v._id, 'nome').lean();
        return { nome: produto?.nome || 'Produto removido', total_vendido: v.total_vendido, receita: v.receita };
      }));
    } catch (err) {
      console.error('Erro em rankingVendas:', err);
      rankingVendas = [];
    }

    res.json({
      sugestoesReposicao,
      produtosBaixaPerformance,
      rankingVendas,
      fraseDestaque
    });
  } catch (err) {
    console.error('Erro geral em insights:', err);
    res.status(500).json({ error: err.message });
  }
});