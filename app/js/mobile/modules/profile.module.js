/**
 * Retequeños OS - Módulo de Perfil, Reseñas y Notificaciones
 */
(function() {
  'use strict';

  window.MobileProfileModule = {
    // Genera las filas de navegación del perfil
    getProfileRows(ctx) {
      return [
        ['Mis pedidos', '▤', ctx.go('21')],
        ['Métodos de pago', '▤', ctx.go('18')],
        ['Favoritos', '♡', ctx.go('11')],
        ['Promociones', '%', ctx.go('12')],
        ['Notificaciones', '!', ctx.go('23')],
        ['Ayuda', '?', () => ctx.flash('Centro de ayuda')],
        ['Configuración', '⚙', ctx.go('25')]
      ].map(r => ({ label: r[0], mark: r[1], go: r[2] }));
    },

    // Genera la lista de notificaciones de la app
    getNotifications(unread, ctx) {
      const P = window.P || window.MOBILE_DATA?.P || {};
      return [
        { isHeader: true, isItem: false, label: 'Hoy' },
        {
          isHeader: false, isItem: true, title: 'Tu pedido está en camino', time: 'Hace 2 min',
          bg: unread ? '#FFF3DF' : '#fff', iconBg: '#FFE9E9', iconFg: P.coral,
          dot: unread ? P.coral : 'transparent', open: ctx.go('20')
        },
        {
          isHeader: false, isItem: true, title: 'Promo del día: Promo Duo a S/ 35.90 🥟🥤 Toca y agrégala', time: 'Hace 40 min',
          bg: unread ? '#FFF3DF' : '#fff', iconBg: '#FFE9E9', iconFg: P.coral,
          dot: unread ? P.coral : 'transparent', open: ctx.go('10')
        },
        {
          isHeader: false, isItem: true, title: '¡Martes de Retequeños!', time: 'Hace 3 h',
          bg: unread ? '#FFF3DF' : '#fff', iconBg: '#FFF3DF', iconFg: '#D9891A',
          dot: unread ? P.gold : 'transparent', open: ctx.go('12')
        },
        { isHeader: true, isItem: false, label: 'Ayer' },
        {
          isHeader: false, isItem: true, title: 'Pedido entregado', time: 'Ayer · 8:04 p. m.',
          bg: '#fff', iconBg: '#E4F4EC', iconFg: '#1F9D62', dot: 'transparent', open: ctx.go('22')
        }
      ];
    },

    // Genera los switches de configuración
    getSettingsSwitches(st, ctx) {
      const P = window.P || window.MOBILE_DATA?.P || {};
      return [
        ['Notificaciones de pedidos', 'swOrders'],
        ['Promociones y novedades', 'swPromos'],
        ['Usar ubicación', 'swLoc']
      ].map(w => ({
        label: w[0],
        toggle: () => ctx.setState(s => { const o = {}; o[w[1]] = !s[w[1]]; return o; }),
        track: st[w[1]] ? P.coral : '#DCD2C1',
        justify: st[w[1]] ? 'flex-end' : 'flex-start'
      }));
    }
  };
})();
