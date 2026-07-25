'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  maxEstoque: number;
  foto?: string;
}

interface Cupom {
  codigo: string;
  desconto: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantidade'> & { quantidade?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  aplicarCupom: (codigo: string) => Promise<void>;
  removerCupom: () => void;
  cupom: Cupom | null;
  descontoCupom: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper para carregar do localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao carregar carrinho do localStorage:', e);
  }
  return [];
};

// Helper para salvar no localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch (e) {
    console.error('Erro ao salvar carrinho no localStorage:', e);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [processing, setProcessing] = useState(false);
  const [cupom, setCupom] = useState<Cupom | null>(null);
  const [descontoCupom, setDescontoCupom] = useState(0);

  // Salvar no localStorage sempre que items mudar
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const reservarNoBackend = async (produtoId: string, quantidade: number, acao: 'reservar' | 'cancelar-reserva') => {
    try {
      const apiUrl = getApiUrl();
      await axios.post(`${apiUrl}/api/produtos/${produtoId}/${acao}`, { quantidade });
    } catch (err: any) {
      console.error(`Erro ao ${acao}`, err);
      throw new Error(err.response?.data?.error || 'Erro no servidor');
    }
  };

  const addItem = useCallback(async (newItem: Omit<CartItem, 'quantidade'> & { quantidade?: number }) => {
    if (processing) return;
    setProcessing(true);
    try {
      const quantidade = newItem.quantidade || 1;
      await reservarNoBackend(newItem.id, quantidade, 'reservar');

      setItems(prev => {
        const existing = prev.find(item => item.id === newItem.id);
        if (existing) {
          return prev.map(item =>
            item.id === newItem.id
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item
          );
        }
        return [...prev, { ...newItem, quantidade, maxEstoque: newItem.maxEstoque }];
      });
      toast.success(`${newItem.nome} adicionado ao carrinho!`);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar ao carrinho');
    } finally {
      setProcessing(false);
    }
  }, [processing]);

  const removeItem = useCallback(async (id: string) => {
    const itemToRemove = items.find(i => i.id === id);
    if (!itemToRemove) return;
    setProcessing(true);
    try {
      await reservarNoBackend(id, itemToRemove.quantidade, 'cancelar-reserva');
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item removido');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao remover');
    } finally {
      setProcessing(false);
    }
  }, [items, processing]);

  const updateQuantity = useCallback(async (id: string, newQty: number) => {
    const current = items.find(i => i.id === id);
    if (!current || newQty < 1 || newQty > current.maxEstoque || processing) return;
    setProcessing(true);
    const diff = newQty - current.quantidade;
    try {
      if (diff > 0) {
        await reservarNoBackend(id, diff, 'reservar');
      } else if (diff < 0) {
        await reservarNoBackend(id, -diff, 'cancelar-reserva');
      }
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantidade: newQty } : i));
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar quantidade');
    } finally {
      setProcessing(false);
    }
  }, [items, processing]);

  const clearCart = useCallback(() => {
    items.forEach(async (item) => {
      try {
        await reservarNoBackend(item.id, item.quantidade, 'cancelar-reserva');
      } catch (e) { /* ignora */ }
    });
    setItems([]);
    // O localStorage é atualizado automaticamente pelo useEffect
  }, [items]);

  const aplicarCupom = useCallback(async (codigo: string) => {
    toast.error('Sistema de cupons em manutenção');
    throw new Error('Não implementado');
  }, []);

  const removerCupom = useCallback(() => {
    setCupom(null);
    setDescontoCupom(0);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      aplicarCupom,
      removerCupom,
      cupom,
      descontoCupom
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
};