'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/lib/api';
import { authGet, authPost } from '@/lib/auth';
import { Loader2, Copy, Check, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface PagamentoData {
  id: string;
  orderId: string;
  qrCode: string;
  qrCodeBase64: string;
  pixCode: string;
  status: string;
  expirationDate: string;
  amount: number;
  finalAmount: number;
}

export default function PagamentoPixPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pagamento, setPagamento] = useState<PagamentoData | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>('PENDING');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [pollingCount, setPollingCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const orderId = searchParams.get('orderId');
  const apiUrl = getApiUrl();

  // Buscar ou criar pagamento
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

    const buscarOuCriarPagamento = async () => {
      try {
        // Verificar se já existe pagamento para este pedido
        let pagamentoResponse;

        try {
          pagamentoResponse = await authGet(`/api/pagamentos/pedido/${orderId}`);
        } catch (error: any) {
          if (error?.response?.status !== 404) throw error;
        }

        if (!pagamentoResponse) {
          // Criar novo pagamento
          setCreating(true);
          pagamentoResponse = await authPost(`/api/pagamentos/pix`, { orderId });
        }

        const data = pagamentoResponse.data;
        const pagamentoData = data.pagamento || data;
        setPagamento(pagamentoData);
        setStatus(pagamentoData.status);

        // Calcular tempo restante
        const expDate = new Date(pagamentoData.expirationDate);
        const now = new Date();
        const diff = Math.max(0, Math.floor((expDate.getTime() - now.getTime()) / 1000));
        setTimeLeft(diff);

        setLoading(false);
        setCreating(false);
      } catch (err: any) {
        toast.error(err.message || 'Erro ao carregar pagamento');
        setLoading(false);
        setCreating(false);
      }
    };

    buscarOuCriarPagamento();
  }, [orderId, isAuthenticated, router, apiUrl]);

  // Atualizar tempo restante
  useEffect(() => {
    if (timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft]);

  // Polling para verificar status
  useEffect(() => {
    if (status === 'PAID' || status === 'EXPIRED' || status === 'CANCELED') {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await authGet(`/api/pagamentos/${pagamento?.id}`);
        const data = res.data;
        if (data.status !== status) {
          setStatus(data.status);
          if (data.status === 'PAID') {
            toast.success('✅ Pagamento confirmado!');
            setTimeout(() => {
              router.push(`/pedido/sucesso?id=${orderId}`);
            }, 3000);
          }
        }
      } catch (err) {
        // Silencioso
      }
    }, 5000); // a cada 5 segundos

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [status, pagamento, orderId, router, apiUrl]);

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

  if (loading || creating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gold" />
        <p className="mt-4 text-text-secondary font-light">
          {creating ? 'Gerando pagamento...' : 'Carregando...'}
        </p>
      </div>
    );
  }

  if (!pagamento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-error" />
        <p className="mt-4 text-text-secondary text-lg">Pagamento não encontrado.</p>
        <Link href="/carrinho" className="mt-4 text-gold hover:underline">
          Voltar ao carrinho
        </Link>
      </div>
    );
  }

  // Se já está pago
  if (status === 'PAID') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-success" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">
          Pagamento confirmado! 🎉
        </h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          Seu pagamento foi aprovado. O pedido será processado em breve.
        </p>
        <div className="flex gap-4">
          <Link href={`/pedido/sucesso?id=${orderId}`}>
            <Button variant="primary" size="lg">
              Ver pedido
            </Button>
          </Link>
          <Link href="/loja">
            <Button variant="secondary" size="lg">
              Continuar comprando
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Se expirou
  if (status === 'EXPIRED' || status === 'CANCELED') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-error" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-dark-light mb-2">
          Pagamento expirado
        </h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          O prazo para pagamento expirou. Você pode gerar um novo pagamento clicando abaixo.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Gerar novo PIX
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light/30 py-12 md:py-20">
      <div className="main-container max-w-2xl">
        <div className="bg-white rounded-card shadow-lg-luxury border border-gray-mid p-6 md:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-dark-light">
              Pagamento via PIX
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Pedido #{orderId?.slice(-6).toUpperCase()}
            </p>
          </div>

          {/* Valor */}
          <div className="bg-light rounded-card p-4 text-center mb-8">
            <p className="text-text-secondary text-xs uppercase tracking-widest font-medium">
              Valor a pagar
            </p>
            <p className="font-serif text-4xl font-bold text-dark-light">
              R$ {pagamento.finalAmount.toFixed(2)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-8">
            {pagamento.qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${pagamento.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-48 h-48 md:w-56 md:h-56"
              />
            ) : pagamento.qrCode ? (
              <img
                src={pagamento.qrCode}
                alt="QR Code PIX"
                className="w-48 h-48 md:w-56 md:h-56"
              />
            ) : (
              <div className="w-48 h-48 md:w-56 md:h-56 bg-light rounded-card flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            )}
          </div>

          {/* Código PIX */}
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
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
          </div>

          {/* Status e timer */}
          <div className="flex items-center justify-between mb-8 p-4 bg-light/50 rounded-card border border-gray-mid">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm font-medium text-dark-light">
                Aguardando pagamento...
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Mensagem de instrução */}
          <div className="text-center text-sm text-text-secondary mb-8">
            <p>Abra seu aplicativo bancário, leia o QR Code ou copie o código PIX.</p>
            <p>O pagamento será confirmado automaticamente.</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => router.push('/loja')}
            >
              Voltar à loja
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Verificar pagamento
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}