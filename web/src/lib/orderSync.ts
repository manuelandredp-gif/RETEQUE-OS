// ===================================================
// RETEQUEÑOS - SINCRONIZACION DE PEDIDOS WEB -> KDS COCINA
// ===================================================

export interface SyncOrderPayload {
  id: string;
  customer: string;
  phone: string;
  channel: 'web' | 'app' | 'whatsapp';
  mode: 'delivery' | 'pickup';
  address?: string;
  reference?: string;
  zone?: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    sauces?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  payMethod: string;
  notes?: string;
}

/**
 * Envía la comanda al KDS de cocina en segundo plano.
 * No bloquea la apertura de WhatsApp si el servidor local está apagado.
 */
export async function syncOrderToKDS(order: SyncOrderPayload): Promise<boolean> {
  const endpoints = ['/api/pedidos', 'http://localhost:3000/api/pedidos'];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order,
          status: 'new',
          priority: false,
          elapsedMinutes: 0,
          time: 'Recién recibido',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[KDS Sync] Pedido ${order.id} sincronizado exitosamente con ${endpoint}`);
        return true;
      }
    } catch (err) {
      // Ignorar de forma segura si la API local no está disponible
    }
  }

  return false;
}
