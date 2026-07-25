'use client';

import { usePathname } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'; // ✅ Substitui o antigo ScrollToTopButton
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-[--color-text-primary] font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            {/* 
              SE QUISER VOLTAR COM A TOPBAR E O MENU DE CATEGORIAS, 
              DESCOMENTE AS LINHAS ABAIXO E IMPORTE OS COMPONENTES.
            */}
            {/* <TopBar /> */}
            <Header />
            {/* <HorizontalCategoryNav /> */}
            
            <main className="flex-1 pb-16 md:pb-24">
              {children}
            </main>
            
            <Footer />
            
            {/* ✅ Agora usamos o botão do WhatsApp no lugar da seta */}
            <WhatsAppFloatingButton />
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                success: { className: 'toast-success' },
                error: { className: 'toast-error' },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}