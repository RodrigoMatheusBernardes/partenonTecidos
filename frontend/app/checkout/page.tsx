'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface CupomAplicado {
  codigo: string;
  desconto: number;
}

interface Frete {
  valor: number;
  prazo_dias: number;
  transportadora?: string;
  capital?: string;
  mensagem?: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [cupomInput, setCupomInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState<CupomAplicado | null>(null);
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [frete, setFrete] = useState<Frete>({ valor: 0, prazo_dias: 0 });
  const [calculandoFrete, setCalculandoFrete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  // ----- CÓDIGO DO VENDEDOR -----
  const [codigoVendedor, setCodigoVendedor] = useState('');

  // Lê o parâmetro ?vendedor= da URL ao carregar a página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vendedor = params.get('vendedor');
    if (vendedor) {
      setCodigoVendedor(vendedor.toUpperCase());
      localStorage.setItem('vendedor', vendedor.toUpperCase());
    } else {
      const saved = localStorage.getItem('vendedor');
      if (saved) setCodigoVendedor(saved);
    }
  }, []);
  // -----------------------------

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prev => ({
        ...prev,
        nome: user.nome || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isAuthenticated && (e.target.name === 'nome' || e.target.name === 'email')) return;
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buscarEndereco = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error('CEP não encontrado.');
        return;
      }
      setForm(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        cep: data.cep || cepLimpo,
      }));
      calcularFrete(cepLimpo);
    } catch (err) {
      toast.error('Erro ao buscar o CEP.');
    }
  };

  const calcularFrete = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    setCalculandoFrete(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/frete/calcular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cepLimpo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro no cálculo do frete');
      setFrete(data);
    } catch (err: any) {
      setFrete({ valor: 0, prazo_dias: 0, mensagem: err.message || 'Frete indisponível' });
    } finally {
      setCalculandoFrete(false);
    }
  };

  const aplicarCupom = async () => {
    const codigo = cupomInput.trim().toUpperCase();
    if (!codigo) return;
    setValidandoCupom(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/cupons/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, total: totalPrice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cupom inválido');
      if (typeof data.desconto !== 'number' || data.desconto < 0) {
        throw new Error('Resposta inesperada do servidor');
      }
      setCupomAplicado({ codigo, desconto: data.desconto });
      toast.success(`Cupom ${codigo} aplicado!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao aplicar cupom';
      toast.error(message);
      setCupomAplicado(null);
    } finally {
      setValidandoCupom(false);
    }
  };

  const totalComDesconto = cupomAplicado ? totalPrice - cupomAplicado.desconto : totalPrice;
  const totalFinal = totalComDesconto + (frete.valor || 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSaving(true);
    setErro('');
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
        },
        body: JSON.stringify({
          cliente: form,
          itens: items.map(item => ({
            produtoId: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
          })),
          cupom: cupomAplicado?.codigo || undefined,
          frete: frete.valor || 0,
          vendedor: codigoVendedor || undefined,   // <-- enviado para o backend
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      clearCart();
      router.push(
        `/pedido/sucesso?id=${data.pedido_id}&total=${data.total}&desconto=${data.desconto || 0}&cupom=${data.cupom || ''}&frete=${frete.valor || 0}`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao finalizar pedido';
      setErro(message);
    } finally {
      setSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary font-medium text-lg">Seu carrinho está vazio.</p>
        <Link href="/loja" className="text-sm font-semibold text-dark-light underline-offset-4 hover:text-gold hover:underline transition-colors">
          Ir para a loja
        </Link>
      </main>
    );
  }

  const inputCls = `
    w-full bg-light border border-gray-mid rounded-button px-4 py-3
    text-sm font-medium text-dark-light
    placeholder:text-text-light
    focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
    disabled:opacity-60 disabled:cursor-not-allowed
    transition-all duration-300
  `;

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="container-main py-8 md:py-14">

        {/* HEADER */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-serif font-semibold text-3xl md:text-4xl text-dark-light">
            Finalizar Pedido
          </h1>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 border border-error rounded-card text-error text-sm font-medium">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">

            {/* DADOS DE CONTATO */}
            <div className="bg-white rounded-card border border-gray-mid p-6 md:p-8 space-y-5">
              <h2 className="font-serif font-semibold text-xl text-dark-light">Dados de contato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Nome completo *</label>
                  <input name="nome" placeholder="Seu nome" value={form.nome} onChange={handleChange} required disabled={isAuthenticated} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">E-mail *</label>
                  <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required disabled={isAuthenticated} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Telefone</label>
                  <input name="telefone" placeholder="(11) 99999-9999" value={form.telefone} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* ENDEREÇO */}
            <div className="bg-white rounded-card border border-gray-mid p-6 md:p-8 space-y-5">
              <h2 className="font-serif font-semibold text-xl text-dark-light">Endereço de entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">CEP *</label>
                  <input
                    name="cep"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={e => { handleChange(e); buscarEndereco(e.target.value); }}
                    required
                    className={inputCls}
                  />
                  {calculandoFrete && <p className="text-xs text-text-light mt-1">Calculando frete...</p>}
                  {!calculandoFrete && frete.valor > 0 && (
                    <p className="text-xs text-success mt-1 font-medium">
                      Frete: R$ {frete.valor.toFixed(2)} – {frete.prazo_dias} dias úteis
                      {frete.transportadora && ` (${frete.transportadora})`}
                    </p>
                  )}
                  {!calculandoFrete && frete.mensagem && (
                    <p className="text-xs text-error mt-1">{frete.mensagem}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Logradouro *</label>
                  <input name="logradouro" placeholder="Rua, Av..." value={form.logradouro} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Número *</label>
                  <input name="numero" placeholder="123" value={form.numero} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Complemento</label>
                  <input name="complemento" placeholder="Apto, Bloco..." value={form.complemento} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Bairro *</label>
                  <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Cidade *</label>
                  <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-dark-light mb-2">Estado *</label>
                  <input name="estado" placeholder="SP" value={form.estado} onChange={handleChange} required maxLength={2} className={inputCls} />
                </div>
              </div>
            </div>

            {/* VENDEDOR & CUPOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-card border border-gray-mid p-6 space-y-3">
                <h3 className="font-semibold text-dark-light text-sm uppercase tracking-widest">Código do vendedor</h3>
                <input
                  type="text"
                  placeholder="Ex: VEND001"
                  value={codigoVendedor}
                  onChange={e => setCodigoVendedor(e.target.value.toUpperCase())}
                  className={inputCls}
                />
              </div>

              <div className="bg-white rounded-card border border-gray-mid p-6 space-y-3">
                <h3 className="font-semibold text-dark-light text-sm uppercase tracking-widest">Cupom de desconto</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código do cupom"
                    value={cupomInput}
                    onChange={e => setCupomInput(e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={aplicarCupom}
                    disabled={validandoCupom}
                    className="px-4 py-3 bg-dark-light text-white rounded-button text-sm font-semibold hover:bg-gold hover:text-dark-light disabled:opacity-50 transition-all"
                  >
                    {validandoCupom ? '...' : 'OK'}
                  </button>
                </div>
                {cupomAplicado && (
                  <p className="text-xs text-success font-medium">
                    {cupomAplicado.codigo}: −R$ {(cupomAplicado.desconto ?? 0).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* SUBMIT MOBILE */}
            <div className="lg:hidden">
              <Button type="submit" variant="primary" size="lg" isLoading={saving} className="w-full">
                Finalizar Compra
              </Button>
            </div>
          </form>

          {/* RESUMO */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-card border border-gray-mid p-6 space-y-5">
              <h2 className="font-serif font-semibold text-xl text-dark-light">Resumo do pedido</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-light line-clamp-1">{item.nome}</p>
                      <p className="text-text-light text-xs">× {item.quantidade}</p>
                    </div>
                    <span className="font-semibold text-dark-light whitespace-nowrap">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-mid pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium">R$ {totalPrice.toFixed(2)}</span>
                </div>
                {cupomAplicado && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto</span>
                    <span>−R$ {(cupomAplicado.desconto ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Frete</span>
                  <span className="font-medium">
                    {frete.valor > 0 ? `R$ ${frete.valor.toFixed(2)}` : 'A calcular'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-mid pt-4 flex justify-between items-baseline">
                <span className="text-dark-light font-semibold">Total</span>
                <span className="font-serif font-semibold text-2xl text-dark-light">
                  R$ {totalFinal.toFixed(2)}
                </span>
              </div>

              {/* SUBMIT DESKTOP */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  form="checkout-form"
                  variant="primary"
                  size="lg"
                  isLoading={saving}
                  className="w-full"
                  onClick={e => {
                    e.preventDefault();
                    const f = document.querySelector('form');
                    f?.requestSubmit();
                  }}
                >
                  Finalizar Compra
                </Button>
              </div>

              <p className="text-xs text-text-light text-center flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Compra 100% segura
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
