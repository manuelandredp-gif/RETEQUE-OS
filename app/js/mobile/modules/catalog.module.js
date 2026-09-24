/**
 * Retequeños OS - Módulo de Catálogo y Detalle de Producto
 */
(function() {
  'use strict';

  window.MobileCatalogModule = {
    // Genera el objeto de vista para una tarjeta de producto
    buildProduct(p, ctx) {
      const P = window.P || window.MOBILE_DATA?.P || {};
      const IMG = window.IMG || window.MOBILE_DATA?.IMG || {};
      const IMG_DEFAULT = window.IMG_DEFAULT || window.MOBILE_DATA?.IMG_DEFAULT;

      let bText = '🧀 Queso fundido';
      let bBg = '#FFF8E7';
      let bFg = '#B7791F';

      if (p.id === 'combo') { bText = '🧀 2 sabores + 🥣 2 cremas'; bBg = '#FFF0F0'; bFg = '#D91F2A'; }
      else if (p.id === 'jamon' || p.id === 'jamoncheddar') { bText = '🥓 Jamón + 🧀 Queso'; bBg = '#FFF5F5'; bFg = '#C53030'; }
      else if (p.id === 'dulces') { bText = '🍫 Chocolate'; bBg = '#FAF5FF'; bFg = '#6B46C1'; }
      else if (p.id === 'tartara') { bText = '🥣 Crema casera'; bBg = '#F0FFF4'; bFg = '#276749'; }
      else if (p.id === 'limonada' || p.id === 'chicha') { bText = '🍋 Natural'; bBg = '#FFFFF0'; bFg = '#744210'; }
      else if (p.cat === 'Combos') { bText = '🏷️ Promo'; bBg = '#FFF0F0'; bFg = '#D91F2A'; }
      else if (p.cat === 'Pizzas') { bText = '🍕 Familiar 35 cm'; bBg = '#FFF5F5'; bFg = '#C53030'; }
      else if (p.cat === 'Pastelitos') { bText = '🥧 1 unidad'; bBg = '#FFF8E7'; bFg = '#B7791F'; }
      else if (p.cat === 'Bebidas') { bText = '🥤 Bebida'; bBg = '#FFFFF0'; bFg = '#744210'; }

      const isFav = (ctx.state.favs || []).indexOf(p.id) > -1;

      return {
        name: p.name,
        qty: p.qty,
        price: p.price,
        desc: p.desc,
        rating: p.rating,
        badgeText: bText,
        badgeBg: bBg,
        badgeFg: bFg,
        img: IMG[p.id] || IMG_DEFAULT,
        add: ctx.add(p.id),
        open: () => ctx.setState({
          screen: p.id === 'combo' ? '10' : '09',
          sel: p.id,
          pres: 10,
          qty: 1,
          extraCheese: false,
          extraSauce: false
        }),
        fav: ctx.toggleFav(p.id),
        heartFill: isFav ? P.coral : 'none',
        heartStroke: isFav ? P.coral : '#7A736B'
      };
    },

    // Filtra el catálogo por búsqueda y categoría
    filterCatalog(catalog, query, cat, sortTop) {
      const q = (query || '').toLowerCase().trim();
      let res = catalog.filter(p => !q || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().indexOf(q) > -1);
      if (cat && cat !== 'Todos') {
        res = res.filter(p => p.cat === cat);
      }
      if (sortTop) {
        res = res.slice().sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
      }
      return res;
    }
  };
})();
