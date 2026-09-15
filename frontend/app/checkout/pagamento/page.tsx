'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authGet, authPost } from '@/lib/auth';
import { Loader2, Copy, Check, Clock, AlertCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import CardPaymentBrick from '@/components/CardPaymentBrick';

interface PagamentoData {
  id: string;
  orderId: string;
  qrCode: string;
  qrCodeBase64: string;
  pixCode: string;
  status: string;
  expirationDate: string | null;
  amount: number;
  finalAmount: number;
  paymentMethod?: string;
}

type PaymentMethod = 'pix' | 'card';
type CardStatus = 'idle' | 'approved' | 'pending' | 'rejected' | 'error';

export default function PagamentoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pedidoTotal, setPedidoTotal] = useState<number | null>(null);
  const [pagamento, setPagamento] = useState<PagamentoData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const [cardStatus, setCardStatus] = useState<CardStatus>('idle');
  const [cardMessage, setCardMessage] = useState<string>('');
  const [cardAttemptKey, setCardAttemptKey] = useState(0);

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>('PENDING');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!orderId) {
      toast.error('ID do pedido não encontrado.');
      router.push('/carrinho');
      return;
    }

    const carregar = async () => {
      try {
        const pedidoRes = await authGet(`/api/pedidos/${orderId}`);
        setPedidoTotal(pedidoRes.data.total);

        try {
          const pagamentoRes = await authGet(`/api/pagamentos/pedido/${orderId}`);
          setPagamento(pagamentoRes.data);
          setStatus(pagamentoRes.data.status);
          if (pagamentoRes.data.paymentMethod === 'credit_card') {
            setPaymentMethod('card');
            if (pagamentoRes.data.status === 'PAID') setCardStatus('approved');
            else if (pagamentoRes.data.status === 'PENDING') setCardStatus('pending');
          }
          if (pagamentoRes.data.expirationDate) {
            const expDate = new Date(pagamentoRes.data.expirationDate);
            const diff = Math.max(0, Math.floor((expDate.getTime() - Date.now()) / 1000));
            setTimeLeft(diff);
          }
        } catch (err: any) {
          if (err?.response?.status !== 404) throw err;
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.error || 'Erro ao carregar o pedido.');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [orderId, isAuthenticated, router]);

  useEffect(() => {
    if (paymentMethod !== 'pix') return;
    if (!orderId) return;
    if (pagamento) return;
    if (loading || creating) return;

    const criar = async () => {
      setCreating(true);
      try {
        const res = await authPost('/api/pagamentos/pix', { orderId });
        const data = res.data.pagamento || res.data;
        setPagamento(data);
        setStatus(data.status);
        if (data.expirationDate) {
          const expDate = new Date(data.expirationDate);
          const diff = Math.max(0, Math.floor((expDate.getTime() - Date.now()) / 1000));
          setTimeLeft(diff);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.error || 'Erro ao criar PIX.');
      } finally {
        setCreating(false);
      }
    };

    criar();
  }, [paymentMethod, pagamento, orderId, loading, creating]);

  useEffect(() => {
    if (paymentMethod !== 'pix') return;
    if (timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, paymentMethod]);

  useEffect(() => {
    if (paymentMethod !== 'pix') return;
    if (!pagamento) return;
    if (status === 'PAID' || status === 'EXPIRED' || status === 'CANCELED') return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await authGet(`/api/pagamentos/${pagamento.id}`);
        const data = res.data;
        if (data.status !== status) {
          setStatus(data.status);
          if (data.status === 'PAID') {
            toast.success('Pagamento confirmado!');
            setTimeout(() => router.push(`/pedido/sucesso?id=${orderId}`), 2500);
          }
        }
      } catch {}
    }, 5000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [paymentMethod, pagamento, status, orderId, router]);

  const handleCardSuccess = (_paymentId: string, _detail: string) => {
    setCardStatus('approved');
    setCardMessage('Pagamento aprovado.');
    toast.success('Pagamento aprovado!');
    setTimeout(() => router.push(`/pedido/sucesso?id=${orderId}`), 2500);
  };

  const handleCardPending = (_paymentId: string, detail: string) => {
    setCardStatus('pending');
    setCardMessage(detail || 'Seu pagamento está em análise.');
    toast.success('Pagamento em análise.');
  };

  const handleCardError = (message: string) => {
    setCardStatus('rejected');
    setCardMessage(message || 'Não foi possível aprovar o pagamento.');
  };

  const handleCardRetry = () => {
    setCardStatus('idle');
    setCardMessage('');
    setCardAttemptKey((k) => k + 1);
  };

  const handleCopy = () => {
    if (!pagamento?.pixCode) return;
    navigator.clipboard.writeText(pagamento.pixCode);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gold" />
        <p className="mt-4 text-text-secondary font-light">Carregando...</p>
      </div>
    );
  }

  if (!orderId || pedidoTotal === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-error" />
        <p className="mt-4 text-text-secondary text-lg">Pedido não encontrado.</p>
        <Link href="/carrinho" className="mt-4 text-gold hover:underline">
          Voltar ao carrinho
        </Link>
      </div>
    );
  }

  if (paymentMethod === 'pix' && status === 'PAID') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-success" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">Pagamento confirmado!</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          Seu pagamento foi aprovado. O pedido será processado em breve.
        </p>
        <div className="flex gap-4">
          <Link href={`/pedido/sucesso?id=${orderId}`}>
            <Button variant="primary" size="lg">Ver pedido</Button>
          </Link>
          <Link href="/loja">
            <Button variant="secondary" size="lg">Continuar comprando</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'pix' && (status === 'EXPIRED' || status === 'CANCELED')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-error" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">Pagamento expirado</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          O prazo para pagamento expirou. Você pode gerar um novo pagamento clicando abaixo.
        </p>
        <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
          Gerar novo PIX
        </Button>
      </div>
    );
  }

  if (paymentMethod === 'card' && cardStatus === 'approved') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-success" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">Pagamento aprovado!</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          Você será redirecionado em instantes.
        </p>
        <Link href={`/pedido/sucesso?id=${orderId}`}>
          <Button variant="primary" size="lg">Ver pedido</Button>
        </Link>
      </div>
    );
  }

  if (paymentMethod === 'card' && cardStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-yellow-600" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">Pagamento em análise</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">{cardMessage}</p>
        <Link href={`/pedido/sucesso?id=${orderId}`}>
          <Button variant="primary" size="lg">Ver pedido</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light/30 py-12 md:py-20">
      <div className="main-container max-w-2xl">
        <div className="bg-white rounded-card shadow-lg-luxury border border-gray-mid p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-dark-light">Pagamento</h1>
            <p className="text-text-secondary text-sm mt-2">
              Pedido #{orderId.slice(-6).toUpperCase()}
            </p>
          </div>

          <div className="bg-light rounded-card p-4 text-center mb-8">
            <p className="text-text-secondary text-xs uppercase tracking-widest font-medium">
              Valor a pagar
            </p>
            <p className="font-serif text-4xl font-bold text-dark-light">
              R$ {pedidoTotal.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setPaymentMethod('pix')}
              className={`px-6 py-3 rounded-button text-sm font-medium transition-colors ${
                paymentMethod === 'pix'
                  ? 'bg-dark-light text-white'
                  : 'bg-white text-text-secondary border border-gray-mid hover:bg-light'
              }`}
            >
              PIX
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`px-6 py-3 rounded-button text-sm font-medium transition-colors flex items-center gap-2 ${
                paymentMethod === 'card'
                  ? 'bg-dark-light text-white'
                  : 'bg-white text-text-secondary border border-gray-mid hover:bg-light'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Cartão de Crédito
            </button>
          </div>

          {paymentMethod === 'pix' && (
            <>
              {creating || !pagamento ? (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto" />
                  <p className="mt-4 text-text-secondary font-light">Gerando PIX...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8">
                    {pagamento.qrCodeBase64 ? (
                      <img
                        src={`data:image/png;base64,${pagamento.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-48 h-48 md:w-56 md:h-56"
                      />
                    ) : pagamento.qrCode ? (
                      <img src={pagamento.qrCode} alt="QR Code PIX" className="w-48 h-48 md:w-56 md:h-56" />
                    ) : (
                      <div className="w-48 h-48 md:w-56 md:h-56 bg-light rounded-card flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gold" />
                      </div>
                    )}
                  </div>

                  <div className="bg-light rounded-card p-4 mb-6">
                    <p className="text-text-secondary text-xs uppercase tracking-widest font-medium mb-2">
                      Código PIX Copia e Cola
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={pagamento.pixCode || ''}
                        readOnly
                        className="flex-1 bg-white border border-gray-mid rounded-button px-4 py-2.5 text-sm font-mono text-dark-light focus:outline-none"
                      />
                      <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-shrink-0">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-8 p-4 bg-light/50 rounded-card border border-gray-mid">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-sm font-medium text-dark-light">Aguardando pagamento...</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="text-center text-sm text-text-secondary mb-8">
                    <p>Abra seu aplicativo bancário, leia o QR Code ou copie o código PIX.</p>
                    <p>O pagamento será confirmado automaticamente.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" size="lg" className="flex-1" onClick={() => router.push('/loja')}>
                      Voltar à loja
                    </Button>
                    <Button variant="primary" size="lg" className="flex-1" onClick={() => window.location.reload()}>
                      Verificar pagamento
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {paymentMethod === 'card' && (
            <>
              {(cardStatus === 'rejected' || cardStatus === 'error') && (
                <div className="mb-6 p-4 bg-red-50 border border-error rounded-card text-error text-sm">
                  <p className="font-medium mb-1">
                    {cardStatus === 'rejected'
                      ? 'Não foi possível aprovar o pagamento.'
                      : 'Erro ao processar o pagamento.'}
                  </p>
                  <p className="font-light">{cardMessage}</p>
                </div>
              )}

              {cardStatus !== 'rejected' && cardStatus !== 'error' && (
                <CardPaymentBrick
                  key={cardAttemptKey}
                  orderId={orderId}
                  amount={pedidoTotal}
                  onSuccess={handleCardSuccess}
                  onPending={handleCardPending}
                  onError={handleCardError}
                />
              )}

              {(cardStatus === 'rejected' || cardStatus === 'error') && (
                <div className="mt-6 text-center">
                  <Button variant="primary" size="lg" onClick={handleCardRetry}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              <p className="text-xs text-text-light text-center mt-6">
                Seus dados de cartão são processados com segurança pelo Mercado Pago.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}