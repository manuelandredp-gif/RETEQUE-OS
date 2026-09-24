/**
 * Retequeños OS - Estado Inicial de la App Móvil
 */
(function() {
  'use strict';

  const IMG = window.IMG || window.MOBILE_DATA?.IMG || {};

  window.INITIAL_MOBILE_STATE = {
    plat: 'android',
    screen: '01',
    cart: 0,
    favs: ['clasicos'],
    cat: 'Todos',
    homeChip: 'Clásicos',
    query: '',
    sortTop: false,
    qty: 1,
    sauce: 'Mayonesa de ajo',
    relleno: 'Queso',
    sauces: ['Mayonesa de ajo', 'Mayopalta'],
    extraCheese: false,
    extraSauce: false,
    sel: 'clasicos',
    pres: 10,
    toast: '',
    toastGo: false,
    copied: false,
    terms: false,
    lines: [
      { id: 'l1', pid: 'clasicos', name: 'Tequeños de queso', opts: 'Mayonesa de ajo · Queso', unit: 16.00, n: 1, img: IMG.clasicos },
      { id: 'l2', pid: 'combo', name: 'Promo Duo', opts: 'Queso · Mayonesa de ajo y Mayopalta', unit: 35.90, n: 1, img: IMG.combo }
    ],
    applied: true,
    addr: 'Casa',
    addrTag: 'Casa',
    mainAddr: true,
    mode: 'delivery',
    timing: 'Lo antes posible',
    pay: 'Pago contraentrega (Efectivo)',
    comboNotes: '',
    driverNotes: '',
    lastOrder: null,
    hist: 'En curso',
    rating: 0,
    unread: true,
    improve: [],
    source: '',
    surveySent: false,
    swOrders: true,
    swPromos: true,
    swLoc: false,
    zoom: 1,
    trackStepIndex: 1
  };
})();
