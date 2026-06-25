'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

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
      <main className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      </main>
    );
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow placeholder:text-gray-400";

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>
      {erro && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{erro}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold">Dados de contato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required disabled={isAuthenticated} className={inputClass} />
          <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required disabled={isAuthenticated} className={inputClass} />
          <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className={inputClass} />
        </div>

        <h2 className="text-xl font-semibold">Endereço de entrega</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              name="cep"
              placeholder="CEP (automático)"
              value={form.cep}
              onChange={(e) => {
                handleChange(e);
                buscarEndereco(e.target.value);
              }}
              required
              className={inputClass}
            />
            {calculandoFrete && <p className="text-xs text-gray-500 mt-1">Calculando...</p>}
            {!calculandoFrete && frete.valor > 0 && (
              <p className="text-xs text-green-700 mt-1">
                Frete: R$ {frete.valor.toFixed(2)} – até {frete.prazo_dias} dias úteis
                {frete.transportadora && ` (${frete.transportadora})`}
              </p>
            )}
            {!calculandoFrete && frete.mensagem && (
              <p className="text-xs text-red-600 mt-1">{frete.mensagem}</p>
            )}
          </div>
          <input name="logradouro" placeholder="Logradouro" value={form.logradouro} onChange={handleChange} required className={inputClass} />
          <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required className={inputClass} />
          <input name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} className={inputClass} />
          <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required className={inputClass} />
          <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required className={inputClass} />
          <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} required className={inputClass} />
        </div>

        {/* Código do vendedor */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Código do vendedor (opcional)</h2>
          <input
            type="text"
            placeholder="Código do vendedor"
            value={codigoVendedor}
            onChange={(e) => setCodigoVendedor(e.target.value.toUpperCase())}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Cupom de desconto */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Cupom de desconto</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código do cupom"
              value={cupomInput}
              onChange={(e) => setCupomInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={aplicarCupom}
              disabled={validandoCupom}
              className="bg-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {validandoCupom ? '...' : 'Aplicar'}
            </button>
          </div>
          {cupomAplicado && (
            <p className="mt-2 text-sm text-green-700">
              Cupom {cupomAplicado.codigo}: -R$ {(cupomAplicado.desconto ?? 0).toFixed(2)}
            </p>
          )}
        </div>

        {/* Resumo */}
        <div className="border-t pt-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.nome} x {item.quantidade}</span>
                <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm mt-2">
            <span>Subtotal</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
          {cupomAplicado && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto ({cupomAplicado.codigo})</span>
              <span>-R$ {(cupomAplicado.desconto ?? 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-1">
            <span>Frete</span>
            <span>
              {frete.valor > 0 ? `R$ ${frete.valor.toFixed(2)}` : frete.mensagem ? 'Indisponível' : 'A calcular'}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-2 mt-3">
            <span>Total</span>
            <span>R$ {totalFinal.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? 'Finalizando...' : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Finalizar compra
            </>
          )}
        </button>
      </form>
    </main>
  );
}