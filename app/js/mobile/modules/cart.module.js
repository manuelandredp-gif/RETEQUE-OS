/**
 * Retequeños OS - Módulo de Carrito y Totales
 */
(function() {
  'use strict';

  window.MobileCartModule = {
    // Calcula los totales del carrito
    computeTotals(lines, couponApplied) {
      const sub = (lines || []).reduce((acc, l) => acc + (l.unit * l.n), 0);
      const fee = 0; // Tarifa de delivery la coordina el repartidor
      const disc = (couponApplied && lines.length) ? 2.00 : 0.00;
      const total = Math.max(0, sub + fee - disc);
      const count = (lines || []).reduce((acc, l) => acc + l.n, 0);

      return {
        subtotal: sub,
        fee: fee,
        discount: disc,
        total: total,
        count: count
      };
    },

    // Agrega producto configurado desde la pantalla de detalle (09)
    addDetail(ctx) {
      const st = ctx.state;
      const CATALOG = window.CATALOG || window.MOBILE_DATA?.CATALOG || [];
      const IMG = window.IMG || window.MOBILE_DATA?.IMG || {};
      const IMG_DEFAULT = window.IMG_DEFAULT || window.MOBILE_DATA?.IMG_DEFAULT;
      const num = window.num || (v => parseFloat(String(v).replace(/[^\d.]/g, '')) || 0);

      const dp = CATALOG.filter(x => x.id === st.sel)[0] || CATALOG[0];
      const m = /20 unid\. S\/ ([\d.]+)/.exec(dp.desc || '');
      const p20 = m ? parseFloat(m[1]) : null;
      const hasSauce = ['Clásicos', 'Especiales', 'Pastelitos'].indexOf(dp.cat) > -1;
      const base = st.pres === 20 && p20 ? p20 : num(dp.price);

      const parts = [];
      if (hasSauce) parts.push(st.sauce || 'Mayonesa de ajo');
      if (st.pres === 20 && p20) parts.push('20 unid.');
      if (st.extraCheese) parts.push('Extra queso');
      if (st.extraSauce) parts.push('Crema extra');
      const opts = parts.join(' · ');

      const unit = base + (st.extraCheese ? 3.00 : 0) + (st.extraSauce ? 2.00 : 0);
      const qty = st.qty || 1;

      ctx.setState(s => ({
        lines: s.lines.concat([{
          id: 'd-' + Date.now(),
          pid: dp.id,
          name: dp.name,
          opts: opts,
          unit: unit,
          n: qty,
          img: IMG[dp.id] || IMG_DEFAULT
        }]),
        screen: '13',
        qty: 1
      }));
      ctx.flash('Agregado · ' + qty + '× ' + dp.name + (opts ? ' (' + opts + ')' : ''), true);
    },

    // Agrega combo / Promo Duo desde la pantalla 10
    addCombo(ctx) {
      const st = ctx.state;
      const IMG = window.IMG || window.MOBILE_DATA?.IMG || {};
      const sStr = st.sauces.length ? st.sauces.join(' y ') : 'Sin cremas';
      const opts = (st.relleno || 'Queso') + ' · ' + sStr + (st.comboNotes ? ' · Nota: ' + st.comboNotes : '');

      ctx.setState(s => ({
        lines: s.lines.concat([{
          id: 'c-' + Date.now(),
          pid: 'combo',
          name: 'Promo Duo',
          opts: opts,
          unit: 35.90,
          n: 1,
          img: IMG.combo
        }]),
        screen: '13'
      }));
      ctx.flash('Agregado · Promo Duo (' + opts + ')', true);
    },

    // Mapea las líneas a los elementos de render del carrito
    buildCartItems(lines, ctx) {
      const CATALOG = window.CATALOG || window.MOBILE_DATA?.CATALOG || [];
      const IMG_DEFAULT = window.IMG_DEFAULT || window.MOBILE_DATA?.IMG_DEFAULT;

      return (lines || []).map((l, i) => {
        const cp = CATALOG.filter(x => x.id === l.pid)[0];
        const bp = cp ? window.MobileCatalogModule.buildProduct(cp, ctx) : {
          badgeText: '🥟 Artesanal', badgeBg: '#FFF8E7', badgeFg: '#B7791F'
        };

        return {
          name: l.name,
          opts: l.opts,
          n: l.n,
          img: l.img || IMG_DEFAULT,
          badgeText: bp.badgeText,
          badgeBg: bp.badgeBg,
          badgeFg: bp.badgeFg,
          total: 'S/ ' + (l.unit * l.n).toFixed(2),
          inc: () => ctx.setState(s => ({
            lines: s.lines.map((x, j) => j === i ? Object.assign({}, x, { n: Math.min(20, x.n + 1) }) : x)
          })),
          dec: () => ctx.setState(s => ({
            lines: s.lines.map((x, j) => j === i ? Object.assign({}, x, { n: Math.max(1, x.n - 1) }) : x)
          })),
          remove: () => {
            ctx.setState(s => ({ lines: s.lines.filter((x, j) => j !== i) }));
            ctx.flash('Producto eliminado del carrito');
          },
          edit: () => ctx.setState({
            screen: l.pid === 'combo' ? '10' : '09',
            sel: l.pid || 'clasicos'
          })
        };
      });
    }
  };
})();
