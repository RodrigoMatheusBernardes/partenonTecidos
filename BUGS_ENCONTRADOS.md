# 🐛 Relatório de Bugs - Projeto Parthenon

## ⚠️ BUGS CRÍTICOS DE SEGURANÇA

### 1. **CORS Completamente Aberto (CRÍTICO)**
**Arquivo:** [backend/src/server.js](backend/src/server.js#L13-L25)
```javascript
// INSEGURO - Permite requisições de qualquer origem
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));
```
**Impacto:** Requisições CSRF de qualquer site podem acessar sua API
**Solução:** Configurar lista branca de domínios permitidos
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://partenontecidos.com'],
  credentials: true
}));
```

---

### 2. **JWT Secret Hardcoded em Múltiplos Lugares (CRÍTICO)**
**Arquivos:** 
- [backend/src/middleware/auth.js](backend/src/middleware/auth.js#L9)
- [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L24)
- [backend/src/routes/pedidoRoutes.js](backend/src/routes/pedidoRoutes.js#L29)

```javascript
// INSEGURO - Secret exposto no código
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'parthenon_secret_key_2026');
```
**Impacto:** Se o repositório vazar, qualquer pessoa pode forjar tokens JWT
**Solução:** 
- Nunca usar fallback com secret
- Gerar secret seguro (64+ caracteres) aleatório
- Armazenar APENAS em variáveis de ambiente

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Se JWT_SECRET não existir, deve falhar na inicialização
```

---

### 3. **Token JWT Armazenado em localStorage (CRÍTICO)**
**Arquivo:** [frontend/context/AuthContext.tsx](frontend/context/AuthContext.tsx#L33-L38)
```typescript
// INSEGURO - localStorage é vulnerável a XSS
const savedToken = localStorage.getItem('token');
```
**Impacto:** Qualquer XSS pode roubar o token e acessar conta do usuário
**Solução:** Usar httpOnly cookies
```typescript
// Armazenar token em httpOnly cookie ao fazer login
// O servidor deve definir: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

---

### 4. **Acesso a Rotas Admin Não Protegido (CRÍTICO)**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L64-L73)
```javascript
// BUG: POST /api/produtos cria produto mas NÃO VERIFICA SE É ADMIN
router.post('/', authMiddleware, async (req, res) => {
  // authMiddleware só verifica se token é válido, não se é admin
  // Qualquer usuário logado pode criar produtos!
  const produtoData = { ...req.body };
  const produto = new Produto(produtoData);
  await produto.save();
  res.status(201).json(produto);
});
```
**Impacto:** Qualquer usuário logado pode criar produtos
**Solução:**
```javascript
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  // ... código
});

// Criar adminMiddleware que verifica role
module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
};
```

---

### 5. **NoSQL Injection em Busca de Produtos**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L130)
```javascript
// VULNERÁVEL - Regex criada diretamente do query string
const regex = new RegExp(q.trim(), 'i');
const produtos = await Produto.find({
  ativo: true,
  nome: { $regex: regex }
});
```
**Impacto:** Atacante pode usar regex patterns para injetar código
**Solução:**
```javascript
// Escapar caracteres especiais de regex
const q = String(req.query.q).trim();
const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const regex = new RegExp(escapedQ, 'i');
```

---

### 6. **Sem Rate Limiting (CRÍTICO)**
**Impacto:** Vulnerável a força bruta no login e criação de conta
**Solução:** Instalar e usar `express-rate-limit`
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 requisições
  message: 'Muitas tentativas, tente mais tarde'
});

router.post('/login', limiter, async (req, res) => { /* ... */ });
router.post('/registrar', limiter, async (req, res) => { /* ... */ });
```

---

### 7. **Sem Helmet - Headers de Segurança Faltam (IMPORTANTE)**
**Impacto:** Exposto a ataques como XSS, clickjacking, etc.
**Solução:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 🔑 BUGS DE AUTENTICAÇÃO

### 8. **Reset Password com Link em Localhost**
**Arquivo:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L117)
```javascript
// BUG: URL hardcoded com localhost
const resetLink = `http://localhost:3000/redefinir-senha?token=${token}`;
console.log(`\n📧 Link de redefinição de senha para ${email}:\n${resetLink}\n`);
```
**Impacto:** 
1. Servidor imprime link em console (exposição de token!)
2. Link não funciona em produção
3. Sem email real, apenas console

**Solução:**
```javascript
// Usar variável de ambiente
const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

// Enviar por email (usar nodemailer, SendGrid, etc.)
// Nunca imprimir no console com token sensível!

// Adicionar expiração de token mais agressiva
const expiresAt = new Date(Date.now() + 3600000); // 1 hora
```

---

### 9. **Senhas Muito Fracas (Mínimo 6 caracteres)**
**Arquivos:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L124)
```javascript
if (newPassword.length < 6) {
  return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
}
```
**Solução:** Aumentar para mínimo 12 caracteres e validar complexidade
```javascript
if (password.length < 12) {
  return res.status(400).json({ error: 'Mínimo 12 caracteres' });
}
if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
  return res.status(400).json({ 
    error: 'Deve conter maiúscula e número' 
  });
}
```

---

### 10. **Sem Validação de Email**
**Arquivo:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L15)
```javascript
// BUG: Não valida se email é formato válido
if (!nome || !email || !password) {
  return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
}
```
**Solução:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

---

## 💰 BUGS DE NEGÓCIO/ESTOQUE

### 11. **Estoque Pode Ficar Negativo**
**Arquivo:** [backend/src/routes/pedidoRoutes.js](backend/src/routes/pedidoRoutes.js#L79-L85)
```javascript
// BUG: Sem lock/transação - race condition
for (const item of itens) {
  await Produto.findByIdAndUpdate(item.produtoId, {
    $inc: {
      estoque: -(item.quantidade || 0),
      reservado: -(item.quantidade || 0)
    }
  });
}
// Se dois pedidos forem criados simultaneamente, estoque vai ficar negativo!
```
**Impacto:** Vender mais produtos do que tem em estoque
**Solução:** Usar transações MongoDB
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  for (const item of itens) {
    const produto = await Produto.findByIdAndUpdate(
      item.produtoId,
      { $inc: { estoque: -item.quantidade } },
      { new: true, session }
    );
    
    if (produto.estoque < 0) {
      throw new Error(`Estoque insuficiente para ${item.nome}`);
    }
  }
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
}
```

---

### 12. **Sem Proteção contra Duplicação de Pedidos**
**Impacto:** Cliente clica "Comprar" 2x e faz 2 pedidos
**Solução:** Adicionar idempotency key
```javascript
// Frontend envia UUID
const idempotencyKey = `${clienteId}_${Date.now()}_${Math.random()}`;

// Backend verifica se já processou
const pedidoExistente = await Pedido.findOne({ idempotencyKey });
if (pedidoExistente) {
  return res.json(pedidoExistente); // retorna o existente
}

const pedido = new Pedido({ ...dados, idempotencyKey });
```

---

### 13. **Sem Validação de Preço (Pode ser Negativo)**
**Arquivo:** [backend/src/models/Produto.js](backend/src/models/Produto.js)
```javascript
// BUG: Sem validação de preço
preco: { type: Number, required: true },
```
**Solução:**
```javascript
preco: { 
  type: Number, 
  required: true,
  min: [0, 'Preço não pode ser negativo'],
  validate: {
    validator: function(value) {
      return value > 0;
    },
    message: 'Preço deve ser maior que zero'
  }
},
```

---

## 🔍 BUGS DE DADOS/QUERIES

### 14. **Sem Paginação em GET /api/produtos**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L76-L80)
```javascript
// BUG: Retorna TODOS os produtos
router.get('/', noCache, async (req, res) => {
  const produtos = await Produto.find().sort({ createdAt: -1 }).lean();
  res.json(produtos);
});
```
**Impacto:** Com 100k produtos, request vai tomar 30+ segundos
**Solução:**
```javascript
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.min(100, parseInt(req.query.limit) || 20); // máximo 100
const skip = (page - 1) * limit;

const produtos = await Produto.find()
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();

const total = await Produto.countDocuments();
res.json({ 
  data: produtos,
  pagination: { page, limit, total, pages: Math.ceil(total / limit) }
});
```

---

### 15. **Virtual Field `.disponivel` Não Aparece em `.lean()`**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L88)
```javascript
// BUG: Virtual não funciona com .lean()
const produtos = await Produto.find({ ativo: true })
  .sort({ createdAt: -1 })
  .populate('categoria', 'nome slug')
  .lean(); // lean() desabilita virtuals!
```
**Impacto:** Campo `.disponivel` não vem na resposta
**Solução:**
```javascript
// Opção 1: Sem .lean() (mais lento mas com virtuals)
const produtos = await Produto.find({ ativo: true })
  .sort({ createdAt: -1 })
  .populate('categoria', 'nome slug');

// Opção 2: Com .lean() mas calcular manualmente
const produtos = await Produto.find({ ativo: true })
  .sort({ createdAt: -1 })
  .populate('categoria', 'nome slug')
  .lean();

const com_disponivel = produtos.map(p => ({
  ...p,
  disponivel: Math.max(0, (p.estoque || 0) - (p.reservado || 0))
}));
```

---

### 16. **Favoritos Acessível sem Autenticação**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L145-L150)
```javascript
// BUG: Qualquer pessoa pode acessar favoritos de outro usuário
router.get('/favoritos/:clienteId', async (req, res) => {
  const favoritos = await Favorito.find({ cliente_id: req.params.clienteId })
    .populate('produto_id');
  res.json(favoritos);
});
```
**Solução:**
```javascript
router.get('/favoritos', authMiddleware, async (req, res) => {
  // Usar ID do usuário logado, não do query string
  const favoritos = await Favorito.find({ cliente_id: req.user.id })
    .populate('produto_id');
  res.json(favoritos);
});
```

---

## 📝 BUGS DE VALIDAÇÃO/SANITIZAÇÃO

### 17. **Sem Validação de Tamanho de String (XSS)**
**Impacto:** Campo `comentario` em avaliação pode ter 10MB de dados
**Solução:**
```javascript
router.post('/:id/avaliar', async (req, res) => {
  const { cliente_nome, cliente_email, nota, comentario } = req.body;
  
  if (!cliente_nome || cliente_nome.length > 100) {
    return res.status(400).json({ error: 'Nome inválido' });
  }
  if (!comentario || comentario.length > 1000) {
    return res.status(400).json({ error: 'Comentário muito longo (máx 1000)' });
  }
  
  // ... continuar
});
```

---

### 18. **Sem Sanitização de Input (XSS/NoSQL Injection)**
**Impacto:** Scripts maliciosos podem ser salvos e executados
**Solução:**
```javascript
npm install xss express-validator

const { body, validationResult } = require('express-validator');
const xss = require('xss');

router.post('/:id/avaliar', [
  body('cliente_nome').trim().isLength({ max: 100 }).escape(),
  body('cliente_email').isEmail().normalizeEmail(),
  body('comentario').trim().isLength({ max: 1000 }).escape(),
  body('nota').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // ... continuar
});
```

---

### 19. **Sem Validação de Input em Pedidos**
**Arquivo:** [backend/src/routes/pedidoRoutes.js](backend/src/routes/pedidoRoutes.js#L10-L15)
```javascript
// BUG: Aceita qualquer coisa no body
const { cliente: clienteBody, itens, cupom, vendedor: codigoVendedor } = req.body;

if (!cliente?.nome || !cliente?.email || !itens?.length) {
  return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
}
// Mais validação deveria existir!
```
**Solução:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cepRegex = /^\d{5}-?\d{3}$/;

if (!emailRegex.test(cliente.email)) {
  return res.status(400).json({ error: 'Email inválido' });
}

if (cliente.cep && !cepRegex.test(cliente.cep)) {
  return res.status(400).json({ error: 'CEP inválido' });
}

// Validar que itens têm preço positivo
for (const item of itens) {
  if (!item.preco || item.preco <= 0 || item.quantidade <= 0) {
    return res.status(400).json({ error: 'Dados de item inválidos' });
  }
}
```

---

### 20. **Sem Validação de Cupom em Pedidos**
**Arquivo:** [backend/src/routes/pedidoRoutes.js](backend/src/routes/pedidoRoutes.js#L43-L47)
```javascript
// BUG: Cupom pode ser injetado com objetos maliciosos
if (cupom) {
  const cupomDoc = await Cupom.findOne({ codigo: cupom.toUpperCase(), ativo: true });
}
// Que acontece se cupom for um objeto com operadores MongoDB?
```
**Solução:**
```javascript
if (cupom) {
  if (typeof cupom !== 'string' || cupom.length > 50) {
    return res.status(400).json({ error: 'Cupom inválido' });
  }
  const cupomDoc = await Cupom.findOne({ 
    codigo: String(cupom).toUpperCase().trim(), 
    ativo: true 
  });
}
```

---

## ⏱️ BUGS DE SESSÃO/TOKEN

### 21. **Token JWT sem Refresh**
**Impacto:** Token válido por 7 dias - se roubado, atacante tem acesso por 7 dias
**Solução:** Implementar refresh tokens com vida curta
```javascript
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' } // Token curto
);

const refreshToken = jwt.sign(
  { id: user._id },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' } // Refresh token mais longo
);

res.json({ token, refreshToken, user });
```

---

## 📦 BUGS DE DEPENDÊNCIAS

### 22. **Sem Validação de Dependências**
**Arquivo:** [backend/package.json](backend/package.json)
**Problema:** Muitas dependências de segurança faltam
**Solução:** Adicionar:
```json
{
  "dependencies": {
    "helmet": "^7.0.0",          // Headers de segurança
    "express-rate-limit": "^7.0.0", // Rate limiting
    "xss": "^1.0.14",              // Sanitização XSS
    "express-validator": "^7.0.0", // Validação
    "express-mongo-sanitize": "^2.2.0", // Proteção NoSQL injection
    "cors": "^2.8.5"               // CORS
  }
}
```

---

## 🚀 RESUMO - PRIORIDADE DE CORREÇÃO

| Prioridade | Bug | Severidade |
|:---:|---|---|
| 🔴 P0 | CORS com origin '*' | Crítica |
| 🔴 P0 | JWT Secret hardcoded | Crítica |
| 🔴 P0 | Token em localStorage | Crítica |
| 🔴 P0 | POST produtos sem proteção de admin | Crítica |
| 🔴 P0 | NoSQL Injection em busca | Alta |
| 🟠 P1 | Sem rate limiting | Alta |
| 🟠 P1 | Sem Helmet | Alta |
| 🟠 P1 | Estoque pode ficar negativo | Alta |
| 🟠 P1 | Reset password com localhost | Alta |
| 🟡 P2 | Senhas fracas (6 caracteres) | Média |
| 🟡 P2 | Sem validação de email | Média |
| 🟡 P2 | Sem paginação | Média |
| 🟡 P2 | Favoritos sem autenticação | Média |
| ⚪ P3 | Virtual field não aparece em .lean() | Baixa |
| ⚪ P3 | Sem sanitização de strings | Baixa |

---

## ✅ CHECKLIST DE AÇÕES

- [ ] Configurar CORS com lista branca
- [ ] Mover JWT_SECRET para .env (sem fallback)
- [ ] Implementar refresh tokens com httpOnly cookies
- [ ] Criar middleware `adminMiddleware` e aplicar em rotas admin
- [ ] Instalar e configurar helmet
- [ ] Instalar express-rate-limit e aplicar em login/registrar
- [ ] Escapar inputs de regex (busca de produtos)
- [ ] Adicionar paginação em GET /produtos
- [ ] Implementar transações MongoDB para estoque
- [ ] Adicionar validação de email com regex
- [ ] Aumentar mínimo de senha para 12 caracteres
- [ ] Remover console.log com tokens
- [ ] Implementar idempotency keys para pedidos
- [ ] Adicionar validação de preço (min > 0)
- [ ] Proteger rotas de favoritos com autenticação
- [ ] Instalar e usar express-validator
- [ ] Implementar refresh tokens
