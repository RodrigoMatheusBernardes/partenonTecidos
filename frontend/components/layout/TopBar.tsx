'use client';

import Link from 'next/link';
import { MapPin, User, Package } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-[#0a1628] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between text-xs py-2 tracking-[0.1em] uppercase font-light">
          {/* Esquerda – Endereço */}
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-white/70" strokeWidth={1} />
              <span className="hidden sm:inline">Av. Martins Bastos, 1234 – Sarandi, Porto Alegre · RS</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-white/70">Entrega para todo o Brasil</span>
          </div>

          {/* Direita – Links */}
          <div className="flex items-center gap-4 text-white/80">
            <Link
              href="/meus-pedidos"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Package className="w-3 h-3 text-white/70" strokeWidth={1} />
              <span className="hidden sm:inline">Meus Pedidos</span>
            </Link>
            <span className="hidden sm:inline text-white/20">|</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <User className="w-3 h-3 text-white/70" strokeWidth={1} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}