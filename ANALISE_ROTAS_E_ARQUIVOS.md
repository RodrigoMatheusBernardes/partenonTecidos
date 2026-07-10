# 📋 ANÁLISE COMPLETA DE ROTAS E ARQUIVOS

**Data de análise:** 2026-07-10  
**Status:** ✅ Completo

---

## 📍 ROTAS DA API REGISTRADAS E ATIVAS

Todas as 9 rotas abaixo estão **registradas em `backend/src/server.js`** (linhas 42-50):

### 1. **🔐 `/api/auth`** – Autenticação
**Arquivo:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|---|---|
| POST | `/registrar` | ❌ Pública | Cadastrar novo usuário |
| POST | `/login` | ❌ Pública | Fazer login |
| POST | `/refresh-token` | ✅ JWT | Renovar token |
| POST | `/solicitar-reset-senha` | ❌ Pública | Solicitar reset de senha |
| POST | `/redefinir-senha` | ❌ Pública | Redefinir senha com token |

---

### 2. **🛍️ `/api/produtos`** – Produtos e Avaliações
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js)

| Método | Endpoint | Autenticação | Descrição | Status |
|--------|----------|---|---|---|
| GET | `/` | ❌ | Listar produtos com **paginação** ✅ | ✅ OTIMIZADO |
| GET | `/vitrine` | ❌ | Lista paginada (home) ✅ | ✅ OTIMIZADO |
| GET | `/destaques` | ❌ | Produtos destacados com limite ✅ | ✅ OTIMIZADO |
| GET | `/busca` | ❌ | Busca por nome (⚠️ Sem escaping regex) | ⚠️ VULNERÁVEL |
| GET | `/:id` | ❌ | Detalhes do produto | ✅ |
| GET | `/categoria/:slug` | ❌ | Produtos de categoria | ✅ |
| POST | `/` | ✅ Admin | Criar novo produto | ✅ |
| PUT | `/:id` | ✅ Admin | Atualizar produto | ✅ |
| DELETE | `/:id` | ✅ Admin | Deletar produto | ✅ |
| POST | `/upload-image` | ✅ Admin | Upload de imagem | ✅ |
| POST | `/:id/favoritar` | ✅ User | Adicionar a favoritos | ⚠️ Sem auth check |
| GET | `/favoritos/:clienteId` | ❌ | Listar favoritos (⚠️ Público!) | ⚠️ VULNERÁVEL |
| DELETE | `/:id/remover-favorito` | ✅ User | Remover favorito | ✅ |
| POST | `/:id/avaliar` | ✅ User | Criar avaliação | ✅ |
| GET | `/:id/avaliacoes` | ❌ | Listar avaliações | ✅ |
| PUT | `/:avaliacaoId` | ✅ User | Editar avaliação | ✅ |
| DELETE | `/:avaliacaoId` | ✅ User | Deletar avaliação | ✅ |

---

### 3. **🛒 `/api/pedidos`** – Pedidos
**Arquivo:** [backend/src/routes/pedidoRoutes.js](backend/src/routes/pedidoRoutes.js)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|---|---|
| GET | `/` | ✅ Admin | Listar todos os pedidos |
| GET | `/meus-pedidos` | ✅ User | Pedidos do usuário logado |
| GET | `/:id` | ✅ User | Detalhes de um pedido |
| POST | `/` | ✅ User | Criar novo pedido |
| PUT | `/:id` | ✅ Admin | Atualizar status do pedido |
| DELETE | `/:id` | ✅ Admin | Cancelar pedido |

---

### 4. **🏷️ `/api/cupons`** – Cupons de Desconto
**Arquivo:** [backend/src/routes/cupomRoutes.js](backend/src/routes/cupomRoutes.js)

| Método | Endpoint | Autenticação | Descrição | Status |
|--------|----------|---|---|---|
| GET | `/` | ❌ | Listar cupons ativos | ✅ |
| GET | `/admin` | ✅ Admin | Listar todos com **paginação** ✅ | ✅ OTIMIZADO |
| POST | `/admin` | ✅ Admin | Criar cupom | ✅ AUTORIZADO |
| PUT | `/admin/:id` | ✅ Admin | Atualizar cupom | ✅ |
| DELETE | `/admin/:id` | ✅ Admin | Deletar cupom | ✅ AUTORIZADO |
| GET | `/validar/:codigo` | ❌ | Validar cupom | ✅ |

---

### 5. **📦 `/api/frete`** – Cálculo de Frete
**Arquivo:** [backend/src/routes/freteRoutes.js](backend/src/routes/freteRoutes.js)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|---|---|
| POST | `/calcular` | ❌ | Calcular frete (CEP) |
| GET | `/tabela` | ❌ | Tabela de fretes |

---

### 6. **📂 `/api/categorias`** – Categorias
**Arquivo:** [backend/src/routes/categoriaRoutes.js](backend/src/routes/categoriaRoutes.js)

| Método | Endpoint | Autenticação | Descrição | Status |
|--------|----------|---|---|---|
| GET | `/` | ❌ | Listar categorias ativas | ✅ |
| GET | `/:slug` | ❌ | Detalhes categoria | ✅ |
| GET | `/admin` | ✅ Admin | Listar todas com **paginação** ✅ | ✅ OTIMIZADO |
| POST | `/admin` | ✅ Admin | Criar categoria | ✅ AUTORIZADO |
| PUT | `/admin/:id` | ✅ Admin | Atualizar categoria | ✅ AUTORIZADO |
| DELETE | `/admin/:id` | ✅ Admin | Deletar categoria | ✅ AUTORIZADO |

---

### 7. **🏪 `/api/vendedores`** – Gerenciamento de Vendedores
**Arquivo:** [backend/src/routes/vendedorRoutes.js](backend/src/routes/vendedorRoutes.js)

| Método | Endpoint | Autenticação | Descrição | Status |
|--------|----------|---|---|---|
| GET | `/` | ❌ | Listar vendedores ativos | ✅ |
| GET | `/admin` | ✅ Admin | Listar todos com **paginação** ✅ | ✅ OTIMIZADO |
| POST | `/admin` | ✅ Admin | Criar vendedor | ✅ AUTORIZADO |
| PUT | `/admin/:id` | ✅ Admin | Atualizar vendedor | ✅ AUTORIZADO |
| DELETE | `/admin/:id` | ✅ Admin | Deletar vendedor | ✅ AUTORIZADO |

---

### 8. **🏷️ `/api/concorrentes`** – Análise de Concorrentes
**Arquivo:** [backend/src/routes/concorrenteRoutes.js](backend/src/routes/concorrenteRoutes.js)

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|---|---|
| GET | `/` | ✅ Admin | Listar concorrentes |
| POST | `/` | ✅ Admin | Criar concorrente |
| PUT | `/:id` | ✅ Admin | Atualizar concorrente |
| DELETE | `/:id` | ✅ Admin | Deletar concorrente |

---

### 9. **📊 `/api/admin`** – Dashboard e Relatórios
**Arquivo:** [backend/src/routes/adminRoutes.js](backend/src/routes/adminRoutes.js)

| Método | Endpoint | Autenticação | Descrição | Status |
|--------|----------|---|---|---|
| GET | `/dashboard` | ✅ Admin | Dashboard principal | ✅ OTIMIZADO |
| GET | `/stats` | ✅ Admin | Estatísticas gerais | ✅ OTIMIZADO |
| GET | `/faturamento` | ✅ Admin | Faturamento detalhado | ✅ |
| GET | `/insights` | ✅ Admin | IA insights e sugestões | ⚠️ N+1 queries |
| GET | `/relatorios/vendedores` | ✅ Admin | Relatório de vendedores | ✅ |
| GET | `/relatorios/estoque` | ✅ Admin | Relatório de estoque | ✅ |
| GET | `/relatorios/avaliacao` | ✅ Admin | Relatório de avaliações | ✅ |
| GET | `/health` | ❌ | Health check | ✅ |

---

## ⚠️ PROBLEMAS IDENTIFICADOS NAS ROTAS

### 🔴 **CRÍTICOS (3)**

| Rota | Problema | Impacto | Solução |
|------|----------|--------|---------|
| `GET /produtos/busca` | **NoSQL Injection** - Regex sem escaping | Dados expostos | Usar `escapeRegex()` |
| `GET /produtos/favoritos/:id` | **Sem autenticação** - Qualquer um vê favoritos | Privacidade exposta | Adicionar `authMiddleware` |
| `POST /produtos/:id/favoritar` | **Sem verificação de auth** | Qualquer um favorita | Validar token |

### 🟡 **ALTOS (2)**

| Rota | Problema | Impacto | Solução |
|------|----------|--------|---------|
| `GET /admin/insights` | **N+1 queries** - Loop Promise.all por produto | DB lento 8s+ | Usar aggregation pipeline |
| `POST /auth/registrar` | **Sem validação de entrada** | Dados inválidos saltos | Usar express-validator |

---

## 📁 ARQUIVOS NÃO UTILIZADOS

### 🚫 **Pastas Vazias (1)**

| Caminho | Status | Ação Recomendada |
|---------|--------|---|
| `backend/src/controllers/` | 📭 Vazia | **Deletar ou usar para refatorar rotas** |

**Nota:** A pasta existe mas está vazia. Tradicionalmente usada para Controllers no padrão MVC, mas o projeto usa inline handlers nas rotas. Pode ser deletada ou preenchida se houver refatoração futura.

---

### ⚫ **Componentes Frontend NÃO UTILIZADOS (3)**

| Arquivo | Localização | Status | Razão |
|---------|---|---|---|
| `HorizontalCategoryNav.tsx` | `frontend/components/` | ❌ Órfão | Removido em [layout.tsx L27](frontend/app/layout.tsx#L27) (comentário: "removida") |
| `MaisVendidos.tsx` | `frontend/components/` | ❌ Órfão | Nenhuma página importa este componente |
| `LookbookCarousel.tsx` | `frontend/components/` | ❌ Órfão | Nenhuma página importa este componente |

**Ação recomendada:** Deletar se não for usar ou mover para `frontend/components/unused/` para futuro.

---

### ⚪ **Arquivos Utilitários/Scripts (4)**

| Arquivo | Localização | Propósito | Status |
|---------|---|---|---|
| `migrar-imagens.js` | Raiz `/` | Script de migração de URLs de imagens | 🔵 Utilitário |
| `update-image-urls.js` | `backend/` | Script para atualizar URLs no MongoDB | 🔵 Utilitário |
| `lista_arquivos.txt` | Raiz `/` | Lista estática de arquivos | ⚪ Info |
| `AGENTS.md` | `frontend/` | Config de agentes (Copilot) | 🟢 Config |
| `CLAUDE.md` | `frontend/` | Config customizada (Copilot) | 🟢 Config |

---

## ✅ COMPONENTES FRONTEND UTILIZADOS

Todos os 16 componentes abaixo **estão em uso:**

### Layout Components ✅
- **Header.tsx** - Cabeçalho com navegação (usa CartDrawer)
- **Footer.tsx** - Rodapé
- **TopBar.tsx** - Barra superior

### Features Components ✅
- **ProductCard.tsx** - Card de produto (usado em 8+ páginas)
- **SearchBar.tsx** - Busca de produtos
- **FiltersSidebar.tsx** - Filtros laterais
- **HomeBanner.tsx** - Banner inicial
- **TrendingBar.tsx** - Produtos trending
- **CartDrawer.tsx** - Carrinho deslizável
- **ScrollToTopButton.tsx** - Botão voltar ao topo

### User/Review Components ✅
- **AvaliacaoForm.tsx** - Formulário de avaliação
- **AvaliacoesList.tsx** - Lista de avaliações
- **StarRating.tsx** - Componente de estrelas
- **FavoritoButton.tsx** - Botão favorito
- **AdminGuard.tsx** - Protetor de rotas admin

### Data/UI Components ✅
- **Skeleton.tsx** - Loading skeleton
- **ProdutosRelacionados.tsx** - Produtos relacionados

---

## 📊 RESUMO DE DADOS

```
Total de Rotas API:         9 rotas principais
Total de Endpoints:         ~60 endpoints
Endpoints com Paginação:    4 (✅ IMPLEMENTADO)
Endpoints com Autorização:  16 (✅ VERIFICADO)
Endpoints com Vulnerabilidade: 3 (⚠️ CRÍTICO)

Componentes Frontend:        16 componentes
Componentes em Uso:         13 (81%)
Componentes Órfãos:         3 (19%)
    - HorizontalCategoryNav
    - MaisVendidos
    - LookbookCarousel

Pastas Vazias:              1 (controllers/)
Scripts Utilitários:        2 (migrar-imagens.js, update-image-urls.js)
Arquivos de Config:         2 (AGENTS.md, CLAUDE.md)
```

---

## 🎯 AÇÕES RECOMENDADAS

### Curto Prazo (Esta Semana)
- [ ] **Deletar** componentes órfãos do frontend (3 arquivos)
- [ ] **Deletar** pasta `backend/src/controllers/` vazia
- [ ] **Revisar** scripts de migração (`migrar-imagens.js`, `update-image-urls.js`)

### Médio Prazo (Este Mês)
- [ ] **Corrigir** NoSQL injection em `/api/produtos/busca`
- [ ] **Adicionar** autenticação a `/api/produtos/favoritos/:id`
- [ ] **Corrigir** N+1 queries em `/api/admin/insights`
- [ ] **Adicionar** validação de entrada com express-validator

### Longo Prazo (Próximos Meses)
- [ ] Refatorar rotas para padrão Controller (opcional)
- [ ] Implementar testes automatizados para todas as rotas
- [ ] Adicionar documentação OpenAPI/Swagger

---

## 📝 Notas

- ✅ Todas as 9 rotas principais estão **registradas e ativas**
- ⚠️ 3 endpoints apresentam **vulnerabilidades críticas**
- ⚠️ 2 endpoints têm **problemas de performance** (N+1 queries)
- ✅ Paginação foi implementada em **4 endpoints principais**
- ✅ Autorização foi adicionada em **cupons, vendedores e categorias**
- 📭 **Pasta controllers/ está vazia** e pode ser deletada
- 🟪 **3 componentes órfãos** no frontend podem ser removidos

