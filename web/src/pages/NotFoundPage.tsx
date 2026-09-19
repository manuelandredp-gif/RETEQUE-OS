import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { openWhatsAppDirect } from '../lib/whatsapp';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 text-center max-w-lg mx-auto space-y-5">
      <div className="text-6xl" aria-hidden="true">🧀</div>
      <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
        Esta página no existe
      </h1>
      <p className="text-neutral-600">
        El enlace puede estar mal escrito o el producto ya no está en la carta. Lo bueno es que los
        tequeños siguen aquí.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm transition-colors"
        >
          Volver a la carta
        </Link>
        <button
          type="button"
          onClick={() => openWhatsAppDirect()}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-sm transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white" aria-hidden="true" />
          Escribir por WhatsApp
        </button>
      </div>
    </div>
  );
};
