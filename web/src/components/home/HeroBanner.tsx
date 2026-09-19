import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Bike, Wallet, Clock } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { openWhatsApp } from '../../lib/whatsapp';

export const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl sm:rounded-3xl shadow-md mb-6 overflow-hidden bg-white" aria-label="Bienvenida">
      <div className="relative min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-[#931119] flex items-center overflow-hidden">
        <img
          src="/assets/hero-banner.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          decoding="async"
          {...{ fetchpriority: 'high' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#931119]/95 via-[#931119]/70 to-[#931119]/25 pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-2xl text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.05] drop-shadow-md">
            TEQUEÑOS <br />
            <span className="text-[#FFEB3B]">QUE ALEGRAN EL DÍA</span>
          </h1>

          <p className="font-script text-lg sm:text-xl lg:text-2xl text-white/95 mt-2 drop-shadow">
            {siteConfig.heroSubtitle}
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/promociones')}
              className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#E5981B] text-neutral-900 text-xs sm:text-sm font-black px-5 sm:px-6 py-3 rounded-full shadow-lg active:scale-95 transition-all"
            >
              <span>Ver promociones</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp('¡Hola Retequeños! Quiero hacer un pedido.')}
              className="inline-flex items-center gap-2 bg-[#16B959] hover:bg-[#13A24D] text-white text-xs sm:text-sm font-black px-5 sm:px-6 py-3 rounded-full shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" aria-hidden="true" />
              <span>Pedir por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Datos rápidos */}
      <div className="px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-neutral-700 border-t border-[#F5E4CE] bg-[#FFF8ED]">
        <span className="inline-flex items-center gap-1.5">
          <Bike className="w-4 h-4 text-brand-red" aria-hidden="true" />
          Delivery en Tacna
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-brand-red" aria-hidden="true" />
          {siteConfig.paymentNote}
        </span>
        {siteConfig.hours && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-red" aria-hidden="true" />
            {siteConfig.hours}
          </span>
        )}
      </div>
    </section>
  );
};
