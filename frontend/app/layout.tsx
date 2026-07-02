'use client';

import { usePathname } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import HorizontalCategoryNav from '@/components/HorizontalCategoryNav';
import Footer from '@/components/layout/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-gray-50 text-gray-800 font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <TopBar />
            <Header />
            {!isAdmin && <HorizontalCategoryNav />}
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTopButton />
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