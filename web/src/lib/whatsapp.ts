import { CartItem } from '../store/cartStore';
import { CheckoutStore } from '../store/checkoutStore';
import { siteConfig } from '../config/site';
import { formatMoney } from './money';

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
  subtotal: number
): string {
  const lines: string[] = [
    '🧀 *¡HOLA RETEQUEÑOS!* 👋',
    '',
    'Quiero realizar el siguiente pedido:',
    '',
  ];

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

  lines.push('');
  lines.push(`💰 *SUBTOTAL:* ${formatMoney(subtotal)}`);
  lines.push(
    customer.deliveryType === 'delivery'
      ? '🛵 *TIPO DE ENTREGA:* Delivery (costo por confirmar)'
      : `🏪 *TIPO DE ENTREGA:* Recojo en tienda (${siteConfig.address})`
  );
  lines.push('');
  lines.push('👤 *DATOS DEL CLIENTE:*');
  lines.push(`• Nombre: ${customer.fullName || 'No especificado'}`);
  lines.push(`• Celular: ${customer.phone || 'No especificado'}`);

  if (customer.deliveryType === 'delivery') {
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
  subtotal: number
): void {
  openWhatsApp(generateWhatsAppMessage(items, customer, subtotal));
}

export function openWhatsAppDirect(customText?: string): void {
  openWhatsApp(customText || '¡Hola Retequeños! Me gustaría hacer una consulta sobre su carta.');
}
