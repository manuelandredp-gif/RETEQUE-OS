import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Facebook, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { NAV_LINKS } from '../../config/navigation';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#8B1017] text-white pt-8 border-t-2 border-[#A9131C] pb-safe">
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/brand/logo-retequenos.png"
                alt=""
                className="h-10 w-auto object-contain rounded-md"
              />
              <div>
                <div className="font-black text-base leading-tight">{siteConfig.name}</div>
                <div className="font-script text-xl leading-tight opacity-95">{siteConfig.slogan}</div>
              </div>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              Tequeños, pizzas familiares, pastelitos y promociones para compartir. Pides por
              WhatsApp y coordinamos tu delivery en Tacna.
            </p>
            <div className="font-script text-xl">{siteConfig.tagline}</div>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/70">Pedidos y contacto</h3>
            <a
              href={buildWhatsAppUrl('¡Hola Retequeños! Me gustaría hacer un pedido.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-sm leading-none">{siteConfig.whatsappDisplay}</span>
                <span className="block text-white/70 text-xs mt-1">WhatsApp · pedidos y consultas</span>
              </span>
            </a>

            {siteConfig.address && (
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-bold text-sm leading-none">{siteConfig.address}</span>
                  <span className="block text-white/70 text-xs mt-1">Recojo en tienda · ver en el mapa</span>
                </span>
              </a>
            )}

            {siteConfig.hours && (
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-sm">{siteConfig.hours}</span>
              </div>
            )}
          </div>

          {/* Carta y redes */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/70">Nuestra carta</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {NAV_LINKS.filter((l) => l.id !== 'todo').map((link) => (
                <li key={link.id}>
                  <Link to={link.path} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" /> {siteConfig.instagram}
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" /> Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {siteConfig.name} · {siteConfig.city}. Todos los derechos reservados.</span>
          <span>{siteConfig.deliveryNote}</span>
        </div>
      </div>
    </footer>
  );
};
