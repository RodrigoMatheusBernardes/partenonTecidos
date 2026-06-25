'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantidade'> & { quantidade?: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false); // evita reservas simultâneas

  // Chamada de API genérica para reserva/cancelamento
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
      // Reserva no servidor
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
    // Ao limpar, cancela todas as reservas
    items.forEach(async (item) => {
      try {
        await reservarNoBackend(item.id, item.quantidade, 'cancelar-reserva');
      } catch (e) { /* ignora */ }
    });
    setItems([]);
  }, [items]);

  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
};