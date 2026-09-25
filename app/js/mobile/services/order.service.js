/**
 * Retequeños OS - Servicio de Pedidos y Sincronización
 */
(function() {
  'use strict';

  window.MobileOrderService = {
    // Genera un ID aleatorio único para el pedido
    generateOrderId() {
      return 'RTQ-' + (2050 + Math.floor(Math.random() * 200));
    },

    // Formatea la hora en formato 12 horas (p. m. / a. m.)
    formatTime(d) {
      if (!d) d = new Date();
      let h = d.getHours();
      const m = d.getMinutes();
      const ap = h >= 12 ? 'p. m.' : 'a. m.';
      h = h % 12 || 12;
      return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap;
    },

    // Construye el mensaje estructurado de WhatsApp y abre la conversación
    buildOrderWhatsApp(order, note, store) {
      const waStore = store || window.STORE || window.MOBILE_DATA?.STORE || {};
      const wa = [
        '🥟 PEDIDO RETEQUEÑOS',
        '────────────────────',
        '',
        '🔖 Solicitud: ' + order.id,
        '👤 Milton',
        '',
        '🛒 PEDIDO',
        ''
      ];

      (order.lines || []).forEach(l => {
        wa.push(l.n + ' × ' + l.name);
        (l.opts || '').split(' · ').filter(Boolean).forEach(o => wa.push('• ' + o));
      });

      wa.push('');
      if (order.coupon) wa.push('🎟 Cupón: ' + order.coupon);
      wa.push('💰 Total productos: S/ ' + Number(order.total || 0).toFixed(2));
      wa.push('');
      wa.push('🛵 Modalidad: ' + (order.mode === 'pickup' ? 'Recojo en tienda' : 'Delivery'));
      if (order.notes) wa.push('📝 ' + order.notes);
      wa.push('');
      wa.push(note || 'Hola 👋, quisiera realizar este pedido.');

      const phone = waStore.whatsapp || '51912266950';
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(wa.join('\n')), '_blank');
    },

    // Sincroniza el pedido en segundo plano con la API de cocina KDS (/api/pedidos)
    syncOrderToKDS(orderPayload) {
      try {
        fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }).catch(function() {});
      } catch (e) {
        // En modo estático sin backend se ignora silenciosamente
      }
    }
  };
})();
