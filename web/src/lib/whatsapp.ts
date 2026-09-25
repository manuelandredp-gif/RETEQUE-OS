import { CartItem } from '../store/cartStore';
import { CheckoutStore } from '../store/checkoutStore';
import { siteConfig } from '../config/site';
import { formatMoney, roundMoney } from './money';
import { syncOrderToKDS } from './orderSync';

export type CustomerData = Omit<CheckoutStore, 'setField' | 'reset'>;

/** Enlace universal de WhatsApp (funciona en celular y en escritorio). */
export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${siteConfig.whatsappInternational}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(text: string): void {
  window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
}

export function generateWhatsAppMessage(
  items: CartItem[],
  customer: CustomerData,
  subtotal: number,
  deliveryFee: number = 0,
  zoneName?: string,
  orderId?: string,
  discount: number = 0,
  couponCode?: string
): string {
  const lines: string[] = [
    '🧀 *¡HOLA RETEQUEÑOS!* 👋',
  ];

  if (orderId) {
    lines.push(`🔖 *PEDIDO / COMANDA: ${orderId}*`);
  }

  lines.push('', 'Quiero realizar el siguiente pedido:', '');

  items.forEach((item) => {
    const presentation = item.selectedPresentation ? ` (${item.selectedPresentation})` : '';
    const lineTotal = formatMoney(item.unitPrice * item.quantity);
    lines.push(`📦 *${item.quantity} x ${item.name}*${presentation} — ${lineTotal}`);
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      lines.push(`   [${item.selectedOptions.join(', ')}]`);
    }
    if (item.notes) {
      lines.push(`   📝 Nota: ${item.notes}`);
    }
  });

  const totalProducts = roundMoney(Math.max(0, subtotal - discount));
  const grandTotal = roundMoney(Math.max(0, totalProducts + (customer.deliveryType === 'delivery' ? deliveryFee : 0)));

  lines.push('');
  lines.push(`💵 *SUBTOTAL:* ${formatMoney(subtotal)}`);

  if (couponCode && discount > 0) {
    lines.push(`🎟 *CUPÓN APLICADO (${couponCode}):* -${formatMoney(discount)}`);
  }

  if (customer.deliveryType === 'delivery') {
    lines.push(`🛵 *DELIVERY (${zoneName || 'Tacna'}):* A coordinar con el repartidor`);
    lines.push(`💰 *TOTAL PRODUCTOS:* ${formatMoney(totalProducts)} *(+ costo de envío según repartidor)*`);
  } else {
    lines.push(`🏪 *TIPO DE ENTREGA:* Recojo en tienda (${siteConfig.address}) — S/ 0.00`);
    lines.push(`💰 *TOTAL A PAGAR:* ${formatMoney(grandTotal)}`);
  }

  lines.push('');
  lines.push('👤 *DATOS DEL CLIENTE:*');
  lines.push(`• Nombre: ${customer.fullName || 'No especificado'}`);
  lines.push(`• Celular: ${customer.phone || 'No especificado'}`);

  if (customer.deliveryType === 'delivery') {
    lines.push(`• Distrito / Zona: ${zoneName || 'Cercado'}`);
    lines.push(`• Dirección: ${customer.address || 'No especificada'}`);
    if (customer.reference) {
      lines.push(`• Referencia: ${customer.reference}`);
    }
  }

  if (customer.generalNotes) {
    lines.push('');
    lines.push(`📝 *Indicaciones:* ${customer.generalNotes}`);
  }

  lines.push('');
  lines.push('Deseo confirmar disponibilidad, delivery y realizar el pago por Yape/Plin/Transferencia. ¡Gracias!');

  return lines.join('\n');
}

export function openWhatsAppCheckout(
  items: CartItem[],
  customer: CustomerData,
  subtotal: number,
  deliveryFee: number = 0,
  zoneName?: string,
  discount: number = 0,
  couponCode?: string
): void {
  const ordId = 'RTQ-' + (2100 + Math.floor(Math.random() * 899));
  const total = roundMoney(Math.max(0, subtotal - discount + (customer.deliveryType === 'delivery' ? deliveryFee : 0)));

  // 1. Sincronización en segundo plano con el KDS de cocina
  syncOrderToKDS({
    id: ordId,
    customer: customer.fullName || 'Cliente Web',
    phone: customer.phone || '',
    channel: 'web',
    mode: customer.deliveryType,
    address: customer.address,
    reference: customer.reference,
    zone: zoneName,
    items: items.map((it) => ({
      name: it.name + (it.selectedPresentation ? ` (${it.selectedPresentation})` : ''),
      qty: it.quantity,
      price: it.unitPrice,
      sauces: it.selectedOptions?.join(', '),
    })),
    subtotal,
    deliveryFee: customer.deliveryType === 'delivery' ? deliveryFee : 0,
    total,
    payMethod: 'Yape / Por verificar',
    notes: (couponCode ? `Cupón: ${couponCode} (-S/ ${discount.toFixed(2)}) · ` : '') + (customer.generalNotes || ''),
  });

  // 2. Abrir WhatsApp de Retequeños con la comanda y número de pedido
  openWhatsApp(generateWhatsAppMessage(items, customer, subtotal, deliveryFee, zoneName, ordId, discount, couponCode));
}

export function openWhatsAppDirect(customText?: string): void {
  openWhatsApp(customText || '¡Hola Retequeños! Me gustaría hacer una consulta sobre su carta.');
}
