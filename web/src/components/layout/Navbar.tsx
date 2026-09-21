import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X, MessageCircle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { siteConfig } from '../../config/site';
import { formatMoney } from '../../lib/money';
import { openWhatsApp } from '../../lib/whatsapp';
import { SearchBox } from './SearchBox';

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const subtotal = useCartStore((s) => s.getSubtotal());
  const openCart = useCartStore((s) => s.openCart);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const isSearchOpen = useUiStore((s) => s.isSearchOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const [bump, setBump] = useState(false);

  // Pequeño "salto" del contador cuando cambia la cantidad del pedido.
  useEffect(() => {
    if (totalCount === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [totalCount]);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname, setSearchOpen]);

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Barra superior roja */}
      <div className="bg-[#C5161D] text-white">
        <div className="max-w-[1640px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-1 hover:bg-white/15 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group" aria-label="Retequeños, ir al inicio">
              <img
                src="/assets/brand/logo-retequenos.png"
                alt=""
                className="h-10 sm:h-11 w-auto object-contain rounded-md drop-shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="hidden xl:inline-block font-script text-white text-2xl pt-1 opacity-95">
                {siteConfig.slogan}
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBox />
          </div>

          <div className="flex items-center gap-0.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openWhatsApp('¡Hola Retequeños! Me gustaría hacer un pedido.')}
              className="hidden lg:flex items-center gap-1.5 bg-[#16B959] hover:bg-[#13A24D] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
              <span>WhatsApp {siteConfig.whatsappDisplay}</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-white/15 rounded-lg transition-colors"
              aria-label={isSearchOpen ? 'Cerrar búsqueda' : 'Buscar en la carta'}
              aria-expanded={isSearchOpen}
            >
              {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6 stroke-[2.3]" />}
            </button>

            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-white/15 transition-colors"
              aria-label={`Abrir pedido, ${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}`}
            >
              <span className="relative">
                <ShoppingCart className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
                <span
                  className={`absolute -top-1.5 -right-2 bg-[#FFEB3B] text-neutral-900 font-black text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 ${
                    bump ? 'scale-125' : ''
                  }`}
                >
                  {totalCount}
                </span>
              </span>
              <span className="hidden sm:inline font-black text-xs sm:text-sm">{formatMoney(subtotal)}</span>
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden px-3 pb-3">
            <SearchBox autoFocus />
          </div>
        )}
      </div>
    </header>
  );
};
