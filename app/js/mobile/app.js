/**
 * Retequeños OS - Núcleo de la Aplicación Móvil
 * Orquestador principal que conecta los módulos con el runtime reactivo DCLogic.
 */
(function() {
  'use strict';

  window.createMobileLogic = function(DCLogic) {
    const P = window.P || window.MOBILE_DATA?.P || {};
    const STORE = window.STORE || window.MOBILE_DATA?.STORE || {};
    const IMG_DEFAULT = window.IMG_DEFAULT || window.MOBILE_DATA?.IMG_DEFAULT;
    const IMG = window.IMG || window.MOBILE_DATA?.IMG || {};
    const num = window.num || (v => parseFloat(String(v).replace(/[^\d.]/g, '')) || 0);
    const money = window.money || (n => 'S/ ' + Number(n).toFixed(2));
    const ORDER_LINES = window.ORDER_LINES || window.MOBILE_DATA?.ORDER_LINES || {};
    const RAIL = window.RAIL || window.MOBILE_DATA?.RAIL || [];
    const TITLES = window.TITLES || window.MOBILE_DATA?.TITLES || {};
    const HINTS = window.HINTS || window.MOBILE_DATA?.HINTS || {};
    const CATALOG = window.MOBILE_CATALOG || window.CATALOG || window.MOBILE_DATA?.CATALOG || [];

    return class Component extends DCLogic {
      state = Object.assign({}, window.INITIAL_MOBILE_STATE);

      componentDidMount() {
        this._t = setTimeout(() => {
          if (this.state.screen === '01') this.setState({ screen: '02' });
        }, 2100);

        let rAF = null;
        this._fit = () => {
          if (rAF) cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => {
            const z = Math.round(Math.min(1, Math.max(0.42, (window.innerHeight - 150) / 862)) * 100) / 100;
            if (Math.abs(z - this.state.zoom) >= 0.01) this.setState({ zoom: z });
          });
        };
        this._fit();
        window.addEventListener('resize', this._fit, { passive: true });
      }

      componentWillUnmount() {
        clearTimeout(this._t);
        clearTimeout(this._tt);
        window.removeEventListener('resize', this._fit);
      }

      go = (s) => () => {
        this.setState({ screen: s, terms: false });
        const sc = document.querySelector('.sc');
        if (sc) sc.scrollTop = 0;
      };

      flash = (msg, toCart) => {
        clearTimeout(this._tt);
        this.setState({ toast: msg, toastGo: !!toCart });
        this._tt = setTimeout(() => this.setState({ toast: '', toastGo: false }), 2400);
      };

      add = (id) => () => {
        const p = CATALOG.filter(x => x.id === id)[0];
        if (!p) return;
        this.setState(s => {
          const idx = s.lines.findIndex(l => l.pid === p.id && !l.opts);
          if (idx > -1) {
            return {
              lines: s.lines.map((l, j) => j === idx ? Object.assign({}, l, { n: Math.min(20, l.n + 1) }) : l)
            };
          }
          return {
            lines: s.lines.concat([{
              id: 'l-' + Date.now(),
              pid: p.id,
              name: p.name,
              opts: '',
              unit: num(p.price),
              n: 1,
              img: IMG[p.id] || IMG_DEFAULT
            }])
          };
        });
        this.flash('Agregado al carrito · ' + p.name, true);
      };

      reorder = (oid) => () => {
        const lo = this.state.lastOrder;
        const src = ORDER_LINES[oid] || (lo && lo.id === oid ? lo.lines : []);
        if (!src.length) {
          this.flash('No encontramos ese pedido');
          return;
        }
        const t = Date.now();
        this.setState(s => ({
          lines: s.lines.concat(src.map((l, i) => Object.assign({}, l, { id: 'r' + t + i, img: IMG[l.pid] || IMG_DEFAULT }))),
          screen: '13'
        }));
        this.flash('Pedido ' + oid + ' agregado al carrito', true);
      };

      toggleExtraCheese = () => this.setState(s => ({ extraCheese: !s.extraCheese }));
      toggleExtraSauce = () => this.setState(s => ({ extraSauce: !s.extraSauce }));

      addDetail = () => window.MobileCartModule.addDetail(this);
      addCombo = () => window.MobileCartModule.addCombo(this);

      toggleFav = (id) => () => this.setState(s => ({
        favs: s.favs.indexOf(id) > -1 ? s.favs.filter(x => x !== id) : s.favs.concat([id])
      }));

      chip = (label, active, onPick) => ({
        label,
        pick: onPick,
        bg: active ? P.coral : '#fff',
        fg: active ? '#fff' : P.char,
        bd: active ? P.coral : '#DCD2C1'
      });

      prod = (p) => window.MobileCatalogModule.buildProduct(p, this);

      pickSauce = (label) => () => this.setState(s => {
        const has = s.sauces.indexOf(label) > -1;
        if (has) return { sauces: s.sauces.filter(x => x !== label) };
        if (s.sauces.length >= 2) {
          this.flash('Solo 2 salsas');
          return {};
        }
        return { sauces: s.sauces.concat([label]) };
      });

      renderVals() {
        const st = this.state;
        const ios = st.plat === 'ios';
        const scr = st.screen;

        // Detalle de producto seleccionado
        const dp = CATALOG.filter(x => x.id === st.sel)[0] || CATALOG[0];
        const dm = /20 unid\. S\/ ([\d.]+)/.exec(dp.desc || '');
        const dPrice20 = dm ? parseFloat(dm[1]) : null;
        const dHasSauce = ['Clásicos', 'Especiales', 'Pastelitos'].indexOf(dp.cat) > -1;
        const dBase = st.pres === 20 && dPrice20 ? dPrice20 : num(dp.price);
        const basePrice = dBase + (st.extraCheese ? 3.00 : 0) + (st.extraSauce ? 2.00 : 0);
        const price = basePrice * st.qty;

        // Búsqueda y filtrado de catálogo
        const q = (st.query || '').toLowerCase();
        const results = window.MobileCatalogModule.filterCatalog(CATALOG, q, null, st.sortTop);
        const menu = CATALOG.filter(p => st.cat === 'Todos' || p.cat === st.cat);
        const favs = CATALOG.filter(p => st.favs.indexOf(p.id) > -1);

        const t = TITLES[scr] || ['', ''];

        // Totales de carrito
        const totals = window.MobileCartModule.computeTotals(st.lines, st.applied);
        const sub = totals.subtotal;
        const fee = totals.fee;
        const disc = totals.discount;
        const total = totals.total;
        const cartCount = totals.count;

        // Datos del último pedido
        const lo = st.lastOrder || {
          id: 'RTQ-2048',
          lines: ORDER_LINES['RTQ-2048'] || [],
          sub: 52.90,
          fee: 0,
          disc: 0,
          total: 52.90,
          mode: 'pickup',
          pay: 'Pago contraentrega (Efectivo)',
          eta: '7:47 p. m.'
        };
        const isPickup = (scr === '20' || scr === '19') ? (lo.mode === 'pickup') : (st.mode === 'pickup');
        const pickupStepIndex = st.trackStepIndex !== undefined ? st.trackStepIndex : 1;
        const loSummary = (lo.lines || []).map(l => l.n + ' ' + l.name).join(' + ');

        // Estado del módulo de tracking
        const tracking = window.MobileTrackingModule.getTrackingState(isPickup, pickupStepIndex);

        return {
          zoom: st.zoom,
          isAnd: !ios,
          isIos: ios,
          ff: ios ? '-apple-system,"Helvetica Neue",sans-serif' : "'Roboto',sans-serif",
          devW: '390px',
          devH: '844px',
          devR: ios ? '54px' : '38px',
          devPad: ios ? '11px' : '9px',
          scrR: ios ? '44px' : '30px',
          pageBg: scr === '01' ? P.coral : P.cream,
          sbFg: scr === '01' ? '#FFF8EE' : P.char,
          btnR: ios ? '999px' : '14px',
          fieldR: ios ? '12px' : '10px',
          pill: '999px',
          iconR: ios ? '999px' : '12px',
          checkR: ios ? '999px' : '4px',
          navBg: '#FFFFFF',
          navPad: ios ? '8px 4px 2px' : '10px 4px',
          h1Size: ios ? '30px' : '22px',

          setAnd: () => this.setState({ plat: 'android' }),
          setIos: () => this.setState({ plat: 'ios' }),
          bgAnd: !ios ? P.coral : '#333',
          fgAnd: !ios ? '#fff' : '#A8A29B',
          bgIos: ios ? P.coral : '#333',
          fgIos: ios ? '#fff' : '#A8A29B',

          rail: RAIL.map(r => ({
            id: r[0],
            label: r[1],
            go: this.go(r[0]),
            bg: scr === r[0] ? P.coral : 'transparent',
            fg: scr === r[0] ? '#fff' : '#E6E1DA',
            num: scr === r[0] ? '#FFD9B0' : '#7D766E'
          })),

          title: t[0],
          subtitle: t[1],
          hint: HINTS[scr] || '',

          s01: scr === '01', s02: scr === '02', s03: scr === '03', s04: scr === '04', s05: scr === '05',
          s06: scr === '06', s07: scr === '07', s08: scr === '08', s09: scr === '09', s10: scr === '10',
          s11: scr === '11', s12: scr === '12',
          s13: scr === '13', s16: scr === '16', s17: scr === '17',
          s18: scr === '18', s19: scr === '19', s20: scr === '20', s21: scr === '21', s22: scr === '22',
          s23: scr === '23', s24: scr === '24', s25: scr === '25', s26: scr === '26',

          showNav: ['06','07','08','11','12','13','20','21','23','24'].indexOf(scr) > -1,
          cHome: scr === '06' ? P.coral : '#B5ADA3',
          cMenu: (scr === '08' || scr === '07') ? P.coral : '#B5ADA3',
          cOrders: ['20','21','22'].indexOf(scr) > -1 ? P.coral : '#B5ADA3',
          cProfile: ['24','25'].indexOf(scr) > -1 ? P.coral : '#B5ADA3',

          isPickup: isPickup,
          isPickupMode: st.mode === 'pickup',
          isDeliveryMode: st.mode === 'delivery',
          goHome: this.go('06'),
          go03: this.go('03'),
          go04: this.go('04'),
          go05: this.go('05'),
          go07: this.go('07'),
          go08: this.go('08'),
          go10: this.go('10'),
          go12: this.go('12'),
          go21: this.go('21'),
          go23: this.go('23'),

          openLastOrderWA: () => window.MobileOrderService.buildOrderWhatsApp(lo, 'Hola 👋, quisiera confirmar el estado de mi solicitud.'),
          pickupSteps: tracking.pickupSteps,
          trackModeBadge: tracking.badge,
          trackStepIcon: tracking.stepIcon,
          trackStepTitle: tracking.stepTitle,
          trackStepDesc: tracking.stepDesc,
          advanceTrackStep: () => window.MobileTrackingModule.advanceTrackStep(this, isPickup),

          cart: cartCount,
          cartCount: cartCount,
          toast: st.toast,
          toastTap: () => {
            if (st.toastGo) this.setState({ screen: '13', toast: '', toastGo: false });
          },
          toastCta: st.toastGo ? 'Ver carrito ›' : '',
          showCartBar: st.lines.length > 0 && ['06','07','08','11','12'].indexOf(scr) > -1,
          cartBarTotal: money(total),
          cartEmpty: st.lines.length === 0,
          cartHas: st.lines.length > 0,
          continueCart: () => this.setState({ screen: st.lines.length ? '16' : '08' }),
          feeName: isPickup ? 'Recojo en tienda' : 'Delivery',
          feeLabel: money(fee),
          openStatus: STORE.hours,
          storeAddr: STORE.addr,
          repeatLast: this.reorder('RTQ-1987'),
          menuSub: (st.cat === 'Todos' ? 'Toda la carta' : st.cat) + ' · ' + menu.length + (menu.length === 1 ? ' producto' : ' productos'),

          searchChips: [
            this.chip('Más pedidos', st.sortTop, () => this.setState(s => ({ sortTop: !s.sortTop }))),
            this.chip('Tequeños', q === 'tequeños', () => this.setState({ query: 'tequeños' })),
            this.chip('Promos', q === 'promo', () => this.setState({ query: 'promo' })),
            this.chip('Pizzas', q === 'pizza', () => this.setState({ query: 'pizza' })),
            this.chip('Bebidas', q === 'bebidas', () => this.setState({ query: 'bebidas' }))
          ],

          dImg: IMG[dp.id] || IMG_DEFAULT,
          dName: dp.name,
          dRating: dp.rating,
          dTag: dp.qty,
          dSub: dp.qty + ' · ' + dp.desc,
          dHasSauce: dHasSauce,
          dHasPres: !!dPrice20,
          dPres: [{ label: '10 unid.', price: num(dp.price), v: 10 }, { label: '20 unid.', price: dPrice20 || 0, v: 20 }].map(x => ({
            label: x.label,
            price: money(x.price),
            pick: () => this.setState({ pres: x.v }),
            bd: st.pres === x.v ? P.coral : '#EFE6D6',
            bg: st.pres === x.v ? '#FFF8F6' : '#fff',
            fg: st.pres === x.v ? P.dark : '#242424'
          })),

          confirmMode: () => this.setState({ screen: '17' }),
          entregaLine: isPickup ? 'Recojo en ' + STORE.addr : 'Delivery por WhatsApp',
          entregaSub: isPickup ? 'Listo en 20–25 min · pagas al retirar o por Yape' : 'Dirección, costo de envío y pago se coordinan al enviar tu pedido',
          driverNotes: st.driverNotes,
          onDriverNotes: (e) => this.setState({ driverNotes: e.target.value }),
          comboNotes: st.comboNotes,
          onComboNotes: (e) => this.setState({ comboNotes: e.target.value }),
          payBtn: isPickup ? 'CONFIRMAR PEDIDO · ' + money(total) : 'HACER PEDIDO POR WHATSAPP',
          showYape: /Yape|Plin|Transferencia/.test(st.pay),
          yapeNumber: STORE.yape,

          confirmTitle: lo.mode === 'pickup' ? '¡Gracias, Milton! 🥟' : 'Solicitud enviada 🥟',
          confirmSub: lo.mode === 'pickup' ? 'Empezamos a preparar tu pedido en cocina' : 'La coordinación continúa por WhatsApp',
          eta: lo.mode === 'pickup' ? lo.eta : 'WhatsApp',
          etaTitle: lo.mode === 'pickup' ? 'LISTO PARA RECOGER' : 'PRÓXIMO PASO',
          etaSub: lo.mode === 'pickup' ? 'En aprox. 20–25 minutos' : 'Confirma dirección, costo y pago en la conversación',
          notifyLine: lo.mode === 'pickup' ? 'Te avisamos por WhatsApp cuando tu pedido esté listo para recoger' : 'Revisa WhatsApp para coordinar dirección, costo de envío y forma de pago',
          orderId: lo.id,
          orderSummary: loSummary,
          orderSubtotal: money(lo.sub),
          orderTotal: money(lo.total),
          orderPayShort: lo.mode !== 'pickup' ? 'Por WhatsApp' : (/Yape|Plin/.test(lo.pay) ? 'Yape ✓' : (/Transfer/.test(lo.pay) ? 'Transferencia' : 'Pago en tienda')),
          trackBtnLabel: lo.mode === 'pickup' ? 'VER ESTADO DEL PEDIDO' : 'ABRIR WHATSAPP',
          trackBtnAction: lo.mode === 'pickup' ? this.go('20') : () => window.MobileOrderService.buildOrderWhatsApp(lo, 'Hola 👋, quisiera confirmar el estado de mi solicitud.'),

          loginTitle: ios ? '¡Qué gusto verte!' : '¡Hola de nuevo!',
          loginSub: ios ? 'Ingresa para pedir tus Retequeños favoritos' : 'Ingresa y disfruta tus favoritos',
          loginSignup: ios ? '¿No tienes una cuenta? Regístrate' : '¿Aún no tienes cuenta? Regístrate',
          sendLink: () => this.flash('Te enviamos un enlace a tu correo'),

          chips: ['Clásicos','Combos','Pizzas','Pastelitos','Bebidas','Salsas'].map(c =>
            this.chip(c, st.homeChip === c, () => this.setState({ homeChip: c, cat: c, screen: '08' }))),
          cats: ['Todos','Clásicos','Especiales','Combos','Pizzas','Pastelitos','Bebidas','Salsas'].map(c =>
            this.chip(c, st.cat === c, () => this.setState({ cat: c }))),

          topProducts: CATALOG.slice(0, 4).map(this.prod),
          menuProducts: menu.map(this.prod),
          favProducts: favs.map(this.prod),
          results: results.map(this.prod),
          resultCount: results.length + (results.length === 1 ? ' resultado' : ' resultados'),
          noResults: results.length === 0,
          query: st.query,
          onQuery: (e) => this.setState({ query: e.target.value }),
          clearQuery: () => this.setState({ query: '' }),

          saucePicks: [
            { label: 'Mayonesa de ajo', isTartara: true, iconBg: '#FFFDE7' },
            { label: 'Salsa tocino', isAceituna: true, iconBg: '#EDE7F6' },
            { label: 'Ají especial', isPicante: true, iconBg: '#FBE9E7' },
            { label: 'Mayopalta', isGuacamole: true, iconBg: '#F1F8E9' }
          ].map(x => {
            const on = st.sauce === x.label;
            return Object.assign({}, x, {
              pick: () => this.setState({ sauce: x.label }),
              bd: on ? P.coral : '#EFE6D6',
              bg: on ? '#FFF8F6' : '#fff',
              fg: on ? P.dark : '#242424',
              shadow: on ? '0 3px 8px rgba(255,48,56,.14)' : 'none',
              dotBg: on ? P.coral : '#EFE6D6',
              dotText: on ? '✓' : ''
            });
          }),

          extraCheeseBd: st.extraCheese ? P.coral : '#EFE6D6',
          extraCheeseBg: st.extraCheese ? '#FFF5F5' : '#fff',
          extraCheeseDotBg: st.extraCheese ? P.coral : '#DCD2C1',
          extraCheeseCheck: st.extraCheese ? '✓' : '+',
          toggleExtraCheese: this.toggleExtraCheese,

          extraSauceBd: st.extraSauce ? P.coral : '#EFE6D6',
          extraSauceBg: st.extraSauce ? '#FFF5F5' : '#fff',
          extraSauceDotBg: st.extraSauce ? P.coral : '#DCD2C1',
          extraSauceCheck: st.extraSauce ? '✓' : '+',
          toggleExtraSauce: this.toggleExtraSauce,

          qty: st.qty,
          inc: () => this.setState(s => ({ qty: Math.min(20, s.qty + 1) })),
          dec: () => this.setState(s => ({ qty: Math.max(1, s.qty - 1) })),
          detailTotal: 'S/ ' + price.toFixed(2),
          addDetail: this.addDetail,
          favDetail: this.toggleFav('clasicos'),
          dHeartFill: st.favs.indexOf('clasicos') > -1 ? P.coral : 'none',
          dHeartStroke: st.favs.indexOf('clasicos') > -1 ? P.coral : '#242424',

          fillings: [
            { label: 'Queso', isCheese: true, iconBg: '#FFFDE7' },
            { label: 'Jamón y queso', isHamCheese: true, iconBg: '#FCE4EC' },
            { label: 'Ají de gallina', isLomo: true, iconBg: '#EFEBE9' },
            { label: 'Chocolate', isChocolate: true, iconBg: '#EDE7F6' }
          ].map(f => {
            const on = st.relleno === f.label || (st.relleno.indexOf('Queso') > -1 && f.isCheese);
            return Object.assign({}, f, {
              pick: () => this.setState({ relleno: f.label }),
              ring: on ? P.coral : '#CFC5B4',
              dot: on ? P.coral : 'transparent',
              cardBg: on ? '#FFF8F6' : '#fff'
            });
          }),

          sauceRows: [
            { label: 'Mayonesa de ajo', isTartara: true, iconBg: '#FFFDE7' },
            { label: 'Salsa tocino', isAceituna: true, iconBg: '#EDE7F6' },
            { label: 'Ají especial', isPicante: true, iconBg: '#FBE9E7' },
            { label: 'Mayopalta', isGuacamole: true, iconBg: '#F1F8E9' }
          ].map(x => {
            const on = st.sauces.indexOf(x.label) > -1;
            return Object.assign({}, x, {
              pick: this.pickSauce(x.label),
              ring: on ? P.coral : '#CFC5B4',
              boxBg: on ? P.coral : '#fff',
              tick: on ? '#fff' : 'transparent',
              cardBg: on ? '#FFF8F6' : '#fff'
            });
          }),

          sauceCount: st.sauces.length + ' / 2',
          sauceCountColor: st.sauces.length === 2 ? '#1F9D62' : P.gray,
          previewRellenoIcon: st.relleno.indexOf('Jamón') > -1 ? '🥓🧀' : (st.relleno.indexOf('Ají') > -1 ? '🍗' : (st.relleno.indexOf('Chocolate') > -1 ? '🍫' : '🧀')),
          previewRellenoText: st.relleno,
          previewSauces: st.sauces.map(s => ({
            name: s,
            icon: s === 'Mayonesa de ajo' ? '🧄' : (s === 'Salsa tocino' ? '🥓' : (s === 'Ají especial' ? '🌶️' : '🥑'))
          })),
          comboStatusColor: st.sauces.length === 2 ? '#1F9D62' : '#D91F2A',
          comboStatusText: st.sauces.length === 2 ? '✓ 2 salsas listas' : (st.sauces.length === 1 ? 'Falta 1 salsa' : 'Elige 2 salsas'),
          addCombo: this.addCombo,

          copyCoupon: () => { this.setState({ copied: true }); this.flash('Cupón RETE10 copiado'); },
          copyLabel: st.copied ? 'Copiado' : 'Copiar',
          copyBg: st.copied ? P.coral : '#fff',
          copyFg: st.copied ? '#fff' : P.dark,
          terms: st.terms,
          showTerms: () => this.setState(s => ({ terms: !s.terms })),

          go13: this.go('13'), go16: this.go('16'),
          go17: this.go('17'), go18: this.go('18'), go20: this.go('20'), go21: this.go('21'),
          go22: this.go('22'), go24: this.go('24'), go25: this.go('25'),

          cartItems: window.MobileCartModule.buildCartItems(st.lines, this),
          subtotalLabel: 'S/ ' + sub.toFixed(2),
          discount: st.applied ? '− S/ 2.00' : 'S/ 0.00',
          cartTotal: 'S/ ' + total.toFixed(2),
          continueLabel: 'CONTINUAR • S/ ' + total.toFixed(2),
          applyCoupon: () => {
            const on = !st.applied;
            this.setState({ applied: on });
            this.flash(on ? 'Cupón RETE10 aplicado' : 'Cupón quitado');
          },
          applyLabel: st.applied ? 'Quitar' : 'Aplicar',
          applyBg: st.applied ? '#1F9D62' : P.char,
          applyFg: '#fff',

          pickDelivery: () => this.setState({ mode: 'delivery' }),
          pickPickup: () => this.setState({ mode: 'pickup' }),
          delBd: st.mode === 'delivery' ? P.coral : '#EFE6D6',
          delBg: st.mode === 'delivery' ? '#FFF1F1' : '#fff',
          delRing: st.mode === 'delivery' ? P.coral : '#CFC5B4',
          delDot: st.mode === 'delivery' ? P.coral : 'transparent',
          pickBd: st.mode === 'pickup' ? P.coral : '#EFE6D6',
          pickBg: st.mode === 'pickup' ? '#FFF1F1' : '#fff',
          pickRing: st.mode === 'pickup' ? P.coral : '#CFC5B4',
          pickDot: st.mode === 'pickup' ? P.coral : 'transparent',

          timings: window.MobileCheckoutModule.getTimings(st.timing, this),
          schedOpacity: st.timing === 'Programar pedido' ? '1' : '.42',
          schedDate: st.timing === 'Programar pedido' ? 'Hoy · 28 ago.' : 'Fecha',
          schedTime: st.timing === 'Programar pedido' ? '7:00 – 7:30 p. m.' : 'Franja horaria',

          payLabel: st.pay,
          payBadge: lo.mode !== 'pickup' ? 'COORDINAR POR WHATSAPP' : (/Yape|Plin|Transferencia/.test(lo.pay) ? 'PAGO POR VERIFICAR' : 'EFECTIVO · CONTRAENTREGA'),
          payBadgeBg: lo.mode !== 'pickup' ? '#E6F4FB' : (/Yape|Plin|Transferencia/.test(lo.pay) ? '#FFF3DF' : '#E7F6EE'),
          payBadgeFg: lo.mode !== 'pickup' ? '#0369A1' : (/Yape|Plin|Transferencia/.test(lo.pay) ? '#B7791F' : '#1F9D62'),
          payNote: lo.mode !== 'pickup'
            ? 'La forma de pago (Yape, Plin, efectivo) y el costo de envío se coordinan en la conversación de WhatsApp.'
            : (/Yape|Plin|Transferencia/.test(lo.pay)
              ? '📲 Envía la captura de tu pago por WhatsApp (' + STORE.yape + '). Confirmamos en minutos y empezamos a preparar.'
              : '🏪 Pagas al retirar en ' + STORE.addr + '.'),

          payMethods: window.MobileCheckoutModule.getPaymentMethods(st.pay, this),
          pay: () => window.MobileCheckoutModule.processPayment(this),

          trackSteps: tracking.generalTrackSteps,

          histTabs: ['En curso', 'Anteriores'].map(t =>
            this.chip(t, st.hist === t, () => this.setState({ hist: t }))),

          orders: (st.hist === 'En curso'
            ? [['RTQ-2048','En camino', money(52.90),'Hace 14 min','3 ítems · Delivery']]
            : [['RTQ-1987','Entregado', money(45.90),'12 ago.','2× Queso + Limonada'],
               ['RTQ-1912','Entregado', money(35.90),'3 ago.','Promo Duo'],
               ['RTQ-1840','Entregado', money(16.00),'21 jul.','Tequeños de queso']]
          ).map(o => ({
            id: o[0], status: o[1], total: o[2], date: o[3], summary: o[4],
            stBg: o[1] === 'En camino' ? '#FFF3DF' : '#E4F4EC',
            stFg: o[1] === 'En camino' ? '#D9891A' : '#1F9D62',
            repeat: this.reorder(o[0]),
            detail: () => this.setState({ screen: o[1] === 'En camino' ? '20' : '22' })
          })),

          stars: [1, 2, 3, 4, 5].map(n => ({
            pick: () => {
              this.setState({ rating: n });
              this.flash(n >= 4 ? '¡Gracias! Te invitamos a dejar tu reseña en Google' : 'Gracias por calificar');
            },
            fill: n <= st.rating ? P.gold : 'none',
            stroke: n <= st.rating ? P.gold : '#CFC5B4'
          })),

          improveChips: ['Cremas','Atención','Tiempo de entrega','Temperatura','Empaque'].map(c =>
            this.chip(c, st.improve.indexOf(c) > -1, () => this.setState(s => ({
              improve: s.improve.indexOf(c) > -1 ? s.improve.filter(x => x !== c) : s.improve.concat([c])
            })))),

          sourceChips: ['TikTok','Facebook / Instagram','Recomendación','Pasé por el local','Google'].map(c =>
            this.chip(c, st.source === c, () => this.setState({ source: c }))),

          showGoogle: true,
          goGoogle: () => this.flash('Abriendo Google Reviews de Retequeños…'),
          sendSurvey: () => {
            if (!st.rating) { this.flash('Primero elige tu calificación'); return; }
            if (st.surveySent) { this.flash('Ya recibimos tu encuesta · cupón ENCUESTA3 activo'); return; }
            this.setState({ surveySent: true });
            this.flash('¡Gracias! Cupón ENCUESTA3 (S/ 3.00) agregado a tu cuenta');
          },
          surveyLabel: st.surveySent ? '✓ ENCUESTA ENVIADA · CUPÓN ENCUESTA3' : 'ENVIAR Y GANAR S/ 3.00',
          surveyBg: st.surveySent ? '#1F9D62' : P.coral,
          orderAgain: this.reorder('RTQ-1987'),

          notifs: window.MobileProfileModule.getNotifications(st.unread, this),
          readAll: () => { this.setState({ unread: false }); this.flash('Notificaciones marcadas como leídas'); },

          profileRows: window.MobileProfileModule.getProfileRows(this),
          logout: () => { this.flash('Sesión cerrada'); this.setState({ screen: '03' }); },

          switches: window.MobileProfileModule.getSettingsSwitches(st, this),
          deleteAcct: () => this.flash('Esta acción pedirá confirmación'),

          retry: () => { this.flash('Reintentando conexión…'); this.setState({ screen: '06' }); },
          clearAndSearch: () => this.setState({ query: '', screen: '07' })
        };
      }
    };
  };
})();
