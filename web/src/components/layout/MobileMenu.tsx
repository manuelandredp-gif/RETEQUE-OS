import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { X, MessageCircle, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { siteConfig } from '../../config/site';
import { NAV_LINKS } from '../../config/navigation';
import { openWhatsApp } from '../../lib/whatsapp';

export const MobileMenu: React.FC = () => {
  const isOpen = useUiStore((s) => s.isMobileMenuOpen);
  const setOpen = useUiStore((s) => s.setMobileMenuOpen);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path) || (path === '/tequenos' && pathname.startsWith('/producto'));

  return createPortal(
    <div className="fixed inset-0 z-[9995] md:hidden" role="dialog" aria-modal="true" aria-label="Menú principal">
      <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in" />

      <div className="absolute inset-y-0 left-0 w-80 max-w-[86vw] bg-white shadow-2xl flex flex-col drawer-in-left">
        <div className="p-4 bg-[#C5161D] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/assets/brand/logo-retequenos.png" alt="" className="h-9 w-auto rounded-md" />
            <div>
              <div className="font-black text-sm leading-tight">{siteConfig.name}</div>
              <div className="font-script text-base leading-tight opacity-95">{siteConfig.slogan}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/15 rounded-lg"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Categorías">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`block px-3 py-3 rounded-xl text-sm font-bold ${
                    isActive(link.path)
                      ? 'bg-[#FFF0F1] text-[#C5161D]'
                      : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3 text-sm text-neutral-700">
            <button
              type="button"
              onClick={() => openWhatsApp('¡Hola Retequeños! Me gustaría hacer un pedido.')}
              className="w-full h-11 bg-[#16B959] hover:bg-[#13A24D] text-white font-black rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" aria-hidden="true" />
              Pedir por WhatsApp
            </button>

            <a href={`tel:+${siteConfig.whatsappInternational}`} className="flex items-center gap-3 px-1 py-1">
              <Phone className="w-4 h-4 text-[#C5161D] shrink-0" aria-hidden="true" />
              <span>
                <span className="font-bold">{siteConfig.whatsappDisplay}</span>
                <span className="block text-xs text-neutral-500">Pedidos y consultas</span>
              </span>
            </a>

            {siteConfig.address && (
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-1 py-1"
              >
                <MapPin className="w-4 h-4 text-[#C5161D] shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-bold">{siteConfig.address}</span>
                  <span className="block text-xs text-neutral-500">Recojo en tienda</span>
                </span>
              </a>
            )}

            {siteConfig.hours && (
              <div className="flex items-center gap-3 px-1 py-1">
                <Clock className="w-4 h-4 text-[#C5161D] shrink-0" aria-hidden="true" />
                <span>{siteConfig.hours}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-neutral-200 text-xs font-bold"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" /> Instagram
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-neutral-200 text-xs font-bold"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" /> Facebook
              </a>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-100 font-script text-[#C5161D] text-lg text-center">
          {siteConfig.tagline}
        </div>
      </div>
    </div>,
    document.body
  );
};
