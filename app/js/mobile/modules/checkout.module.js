/**
 * Retequeños OS - Módulo de Checkout y Procesamiento de Pago
 */
(function() {
  'use strict';

  window.MobileCheckoutModule = {
    // Genera la lista de métodos de pago configurados
    getPaymentMethods(currentPay, ctx) {
      const P = window.P || window.MOBILE_DATA?.P || {};
      const methods = [
        ['Efectivo al recoger', 'Pagas en tienda al retirar tu pedido', 'EFEC'],
        ['Yape / Plin (captura por WhatsApp)', 'Yapeas ahora y nos envías la captura; verificamos y preparamos', 'YAPE'],
        ['Transferencia BCP / Banco de la Nación', 'Transfieres y envías el comprobante por WhatsApp', 'TRANSF']
      ];

      return methods.map(m => ({
        label: m[0],
        note: m[1],
        tag: m[2],
        pick: () => ctx.setState({ pay: m[0] }),
        ring: currentPay === m[0] ? P.coral : '#CFC5B4',
        dot: currentPay === m[0] ? P.coral : 'transparent'
      }));
    },

    // Genera las opciones de horario de entrega
    getTimings(currentTiming, ctx) {
      const P = window.P || window.MOBILE_DATA?.P || {};
      return ['Lo antes posible', 'Programar pedido'].map(t => ({
        label: t,
        pick: () => ctx.setState({ timing: t }),
        ring: currentTiming === t ? P.coral : '#CFC5B4',
        dot: currentTiming === t ? P.coral : 'transparent'
      }));
    },

    // Procesa y confirma el pedido (WhatsApp + Sincronización en vivo con Cocina KDS)
    processPayment(ctx) {
      const st = ctx.state;
      const STORE = window.STORE || window.MOBILE_DATA?.STORE || {};
      const isPickup = st.mode === 'pickup';
      const ordId = window.MobileOrderService.generateOrderId();

      const totals = window.MobileCartModule.computeTotals(st.lines, st.applied);
      const sub = totals.subtotal;
      const disc = totals.discount;
      const total = totals.total;

      if (!isPickup) {
        // Pedido Delivery: Se envía a WhatsApp y se sincroniza en vivo con la cocina KDS
        const order = {
          id: ordId,
          lines: st.lines.slice(),
          sub: sub,
          fee: 0,
          disc: disc,
          total: total,
          mode: 'delivery',
          pay: 'Por coordinar en WhatsApp',
          coupon: st.applied ? 'RETE10' : null,
          notes: st.driverNotes
        };

        window.MobileOrderService.buildOrderWhatsApp(order, 'Hola 👋, quisiera realizar este pedido delivery.');
        ctx.flash('¡Pedido Delivery enviado! Coordinando con cocina y repartidor');
        ctx.setState({
          screen: '19',
          lastOrder: order,
          lines: [],
          applied: false,
          driverNotes: '',
          hist: 'En curso',
          trackStepIndex: 0
        });

        // Sincronización automática con la pantalla de cocina KDS
        window.MobileOrderService.syncOrderToKDS({
          id: ordId,
          customer: 'Milton Flores (App Móvil)',
          phone: '952741852',
          address: (st.addr === 'Casa' ? 'Av. Bolognesi 845, Tacna' : 'Calle Zela 320, Tacna') + ' · Costo de envío a coordinar con repartidor',
          items: st.lines.map(l => ({
            name: l.name + (l.opts ? ' (' + l.opts + ')' : ''),
            qty: l.n,
            price: l.unit,
            sauces: l.opts
          })),
          subtotal: sub,
          deliveryFee: 0,
          discount: disc,
          total: total,
          payMethod: 'Por coordinar en WhatsApp / Yape',
          notes: (st.driverNotes ? st.driverNotes + ' · ' : '') + 'Pedido delivery desde App Móvil. Costo de envío por coordinar con repartidor.'
        });
        return;
      }

      // Pedido Recojo en tienda
      const etaDate = new Date(Date.now() + 22 * 60000);
      const etaStr = window.MobileOrderService.formatTime(etaDate);
      const order = {
        id: ordId,
        lines: st.lines.slice(),
        sub: sub,
        fee: 0,
        disc: disc,
        total: total,
        mode: 'pickup',
        pay: st.pay,
        eta: etaStr,
        notes: st.driverNotes
      };

      ctx.flash(
        /Yape|Plin|Transferencia/.test(st.pay)
          ? '¡Pedido enviado! Envíanos la captura del pago'
          : '¡Pedido confirmado! Te avisamos cuando esté listo'
      );

      ctx.setState({
        screen: '19',
        lastOrder: order,
        lines: [],
        applied: false,
        driverNotes: '',
        hist: 'En curso',
        trackStepIndex: 0
      });

      // Sincronización automática con la pantalla de cocina KDS
      window.MobileOrderService.syncOrderToKDS({
        id: ordId,
        customer: 'Milton Flores (App Móvil)',
        phone: '952741852',
        address: 'Recojo en tienda · ' + (STORE.addr || 'Calle Alto Lima 1488, Tacna'),
        items: st.lines.map(l => ({
          name: l.name + (l.opts ? ' (' + l.opts + ')' : ''),
          qty: l.n,
          price: l.unit,
          sauces: l.opts
        })),
        subtotal: sub,
        deliveryFee: 0,
        discount: disc,
        total: total,
        payMethod: st.pay || 'Pago contraentrega (Efectivo)',
        notes: (st.driverNotes ? st.driverNotes + ' · ' : '') + 'Pedido enviado desde la app. Recojo en tienda.'
      });
    }
  };
})();
