import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Plus, Minus, MessageCircle, Bike, Store, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useUiStore } from '../../store/uiStore';
import { formatMoney } from '../../lib/money';
import { openWhatsAppCheckout } from '../../lib/whatsapp';
import { isValidName, isValidPeruMobile } from '../../lib/validation';
import { siteConfig } from '../../config/site';
import { ImageWithFallback } from '../ui/ImageWithFallback';

const inputClass = (hasError: boolean) =>
  `w-full h-11 px-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
    hasError ? 'border-[#C5161D] focus:ring-[#C5161D]/25' : 'border-neutral-200 focus:border-[#C5161D] focus:ring-[#C5161D]/15'
  }`;

export const CartDrawer: React.FC = () => {
  const isOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const showToast = useUiStore((s) => s.showToast);
  const { fullName, phone, deliveryType, address, reference, generalNotes, setField } = useCheckoutStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  // Bloquea el scroll del fondo y cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (items.length === 0) setSent(false);
  }, [items.length]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isValidName(fullName)) errs.fullName = 'Escribe tu nombre (mínimo 3 letras)';
    if (!isValidPeruMobile(phone)) errs.phone = 'Ingresa un celular válido de 9 dígitos (empieza en 9)';
    if (deliveryType === 'delivery' && address.trim().length < 5) errs.address = 'Ingresa tu dirección en Tacna';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    openWhatsAppCheckout(items, { fullName, phone, deliveryType, address, reference, generalNotes }, subtotal);
    setSent(true);
  };

  const handleClear = () => {
    clearCart();
    setSent(false);
    closeCart();
    showToast({ message: 'Pedido vaciado. ¡Gracias por tu compra!' });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true" aria-label="Tu pedido">
      <div onClick={closeCart} className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in" />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 drawer-in">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-[#C5161D] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            <h2 className="font-black text-base sm:text-lg">
              Tu pedido {totalCount > 0 && <span className="font-bold text-white/80">({totalCount})</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 hover:bg-white/15 rounded-lg transition-colors"
            aria-label="Cerrar pedido"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" aria-hidden="true" />
              <p className="font-bold text-neutral-800 text-sm">Tu pedido está vacío</p>
              <p className="text-xs text-neutral-500">Elige tus tequeños, pizzas o promociones favoritas de la carta.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 inline-flex items-center justify-center h-10 px-5 rounded-xl bg-brand-red text-white text-sm font-bold"
              >
                Ver la carta
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-3" aria-label="Productos del pedido">
                {items.map((item) => (
                  <li key={item.lineId} className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ImageWithFallback
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover border border-neutral-200 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <h3 className="font-black text-sm text-neutral-900 leading-snug line-clamp-2">{item.name}</h3>
                          {item.selectedPresentation && (
                            <p className="text-[11px] text-neutral-600 line-clamp-1">{item.selectedPresentation}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        className="text-neutral-400 hover:text-[#C5161D] p-2 -m-1 rounded-lg"
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <ul className="text-[11px] text-[#C5161D] font-medium pl-1 space-y-0.5">
                        {item.selectedOptions.map((opt, idx) => (
                          <li key={idx}>• {opt}</li>
                        ))}
                      </ul>
                    )}
                    {item.notes && <p className="text-[11px] text-neutral-600 pl-1">📝 {item.notes}</p>}

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                      <div className="inline-flex items-center bg-white border border-neutral-200 rounded-lg p-0.5" role="group" aria-label="Cantidad">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-100"
                          aria-label="Quitar uno"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-black text-neutral-900 text-sm" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#C5161D] text-white hover:bg-[#A3001E]"
                          aria-label="Agregar uno"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-neutral-900">
                        {formatMoney(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-neutral-500 hover:text-[#C5161D] underline underline-offset-2"
              >
                Vaciar pedido
              </button>

              {/* Datos de entrega */}
              <div className="pt-3 border-t border-neutral-200 space-y-3 text-sm">
                <div className="font-black text-neutral-900">Datos para la entrega</div>

                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de entrega">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={deliveryType === 'delivery'}
                    onClick={() => setField('deliveryType', 'delivery')}
                    className={`h-11 rounded-xl border-2 flex items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-[#C5161D] bg-[#FFF0F1] text-[#C5161D]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Bike className="w-4 h-4" aria-hidden="true" />
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={deliveryType === 'recojo'}
                    onClick={() => setField('deliveryType', 'recojo')}
                    className={`h-11 rounded-xl border-2 flex items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                      deliveryType === 'recojo'
                        ? 'border-[#C5161D] bg-[#FFF0F1] text-[#C5161D]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Store className="w-4 h-4" aria-hidden="true" />
                    <span>Recojo en tienda</span>
                  </button>
                </div>

                {deliveryType === 'recojo' && siteConfig.address && (
                  <div className="flex items-start gap-2 bg-[#FFF8ED] border border-[#F5E4CE] rounded-xl p-3 text-xs text-neutral-700">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Recoges en <strong>{siteConfig.address}</strong>. Te confirmamos por WhatsApp cuando esté listo.
                    </span>
                  </div>
                )}

                <div>
                  <label htmlFor="cart-nombre" className="block text-xs font-bold text-neutral-700 mb-1">
                    Nombre completo <span className="text-[#C5161D]">*</span>
                  </label>
                  <input
                    id="cart-nombre"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    placeholder="Ej. María Quispe"
                    className={inputClass(Boolean(errors.fullName))}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && <p className="text-[11px] text-[#C5161D] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="cart-celular" className="block text-xs font-bold text-neutral-700 mb-1">
                    Celular / WhatsApp <span className="text-[#C5161D]">*</span>
                  </label>
                  <input
                    id="cart-celular"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="Ej. 912 266 950"
                    className={inputClass(Boolean(errors.phone))}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="text-[11px] text-[#C5161D] mt-1">{errors.phone}</p>}
                </div>

                {deliveryType === 'delivery' && (
                  <>
                    <div>
                      <label htmlFor="cart-direccion" className="block text-xs font-bold text-neutral-700 mb-1">
                        Dirección en Tacna <span className="text-[#C5161D]">*</span>
                      </label>
                      <input
                        id="cart-direccion"
                        type="text"
                        autoComplete="street-address"
                        value={address}
                        onChange={(e) => setField('address', e.target.value)}
                        placeholder="Ej. Av. Bolognesi 450, Cercado"
                        className={inputClass(Boolean(errors.address))}
                        aria-invalid={Boolean(errors.address)}
                      />
                      {errors.address && <p className="text-[11px] text-[#C5161D] mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label htmlFor="cart-referencia" className="block text-xs font-bold text-neutral-700 mb-1">
                        Referencia <span className="text-neutral-400 font-medium">(opcional)</span>
                      </label>
                      <input
                        id="cart-referencia"
                        type="text"
                        value={reference}
                        onChange={(e) => setField('reference', e.target.value)}
                        placeholder="Ej. Frente al parque, puerta verde"
                        className={inputClass(false)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="cart-notas" className="block text-xs font-bold text-neutral-700 mb-1">
                    Indicaciones <span className="text-neutral-400 font-medium">(opcional)</span>
                  </label>
                  <textarea
                    id="cart-notas"
                    value={generalNotes}
                    onChange={(e) => setField('generalNotes', e.target.value.slice(0, 200))}
                    placeholder="Ej. Cremas aparte, sin servilletas"
                    rows={2}
                    className="w-full p-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:border-[#C5161D] focus:ring-2 focus:ring-[#C5161D]/15 resize-none"
                  />
                </div>

                <p className="text-[11px] text-neutral-500">{siteConfig.deliveryNote}.</p>
              </div>
            </>
          )}
        </div>

        {/* Acciones */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-white space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 font-bold">Subtotal</span>
              <span className="text-lg font-black text-neutral-900">{formatMoney(subtotal)}</span>
            </div>

            {sent ? (
              <div className="rounded-xl border border-[#16B959]/40 bg-[#E8F8EE] p-3 space-y-2">
                <div className="flex items-start gap-2 text-sm text-neutral-800">
                  <CheckCircle2 className="w-5 h-5 text-[#16B959] shrink-0" aria-hidden="true" />
                  <span>
                    Abrimos WhatsApp con tu pedido. Si ya lo enviaste, puedes vaciar el carrito. Si no se abrió,
                    vuelve a intentarlo.
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="h-10 rounded-xl bg-[#16B959] hover:bg-[#13A24D] text-white text-xs font-black"
                  >
                    Ya lo envié, vaciar
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="h-10 rounded-xl border border-neutral-300 text-neutral-800 text-xs font-bold hover:bg-neutral-50"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                className="w-full h-12 bg-[#16B959] hover:bg-[#13A24D] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-white" aria-hidden="true" />
                <span>Enviar pedido por WhatsApp</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
