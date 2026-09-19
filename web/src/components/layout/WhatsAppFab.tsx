import React from 'react';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../../lib/whatsapp';
import { useCartStore } from '../../store/cartStore';

/** Botón flotante de WhatsApp, visible en toda la web. */
export const WhatsAppFab: React.FC = () => {
  const totalCount = useCartStore((s) => s.getTotalCount());
  const isCartOpen = useCartStore((s) => s.isCartOpen);

  if (isCartOpen) return null;

  return (
    <button
      type="button"
      onClick={() => openWhatsApp('¡Hola Retequeños! Me gustaría hacer un pedido.')}
      className={`fixed right-4 z-[9970] h-13 px-4 py-3 rounded-full bg-[#16B959] hover:bg-[#13A24D] text-white font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 ${
        totalCount > 0 ? 'bottom-24 md:bottom-6' : 'bottom-5 md:bottom-6'
      }`}
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </button>
  );
};
