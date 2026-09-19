// Ajustes finales: etiqueta por producto en el carrito y textos de pago coherentes con recojo en tienda.
// Uso: tools\node.cmd tools\patch-app-3.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'index.html');
let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const log = [];
let failed = false;

function rep(find, replace, expect) {
  const parts = s.split(find);
  const n = parts.length - 1;
  if (n === 0 || (expect !== null && n !== expect)) {
    log.push('FAIL (' + n + (expect === null ? '' : ' != ' + expect) + '): ' + find.slice(0, 90).replace(/\n/g, '\\n'));
    failed = true;
    return;
  }
  s = parts.join(replace);
  log.push('ok x' + n + ': ' + find.slice(0, 70).replace(/\n/g, '\\n'));
}

// Carrito: una etiqueta por producto (queso, jamón, chocolate, promo, pizza…) en vez de dos fijas
rep(`<span style="font:500 9.5px 'Roboto',sans-serif;background:#FFF8E7;color:#B7791F;padding:1px 6px;border-radius:4px">🧀 Queso fundido</span>
<span style="font:500 9.5px 'Roboto',sans-serif;background:#FFF0F0;color:#D91F2A;padding:1px 6px;border-radius:4px">🥣 Cremas caseras</span>`,
`<span style="font:500 9.5px 'Roboto',sans-serif;background:{{ it.badgeBg }};color:{{ it.badgeFg }};padding:1px 6px;border-radius:4px">{{ it.badgeText }}</span>`, 1);

rep(`      cartItems: st.lines.map((l, i) => ({
        name: l.name, opts: l.opts, n: l.n, img: l.img || IMG_DEFAULT, total: 'S/ ' + (l.unit * l.n).toFixed(2),`,
`      cartItems: st.lines.map((l, i) => { const cp = CATALOG.filter(x => x.id === l.pid)[0]; const bp = cp ? this.prod(cp) : {badgeText: '🥟 Artesanal', badgeBg: '#FFF8E7', badgeFg: '#B7791F'}; return {
        name: l.name, opts: l.opts, n: l.n, img: l.img || IMG_DEFAULT, badgeText: bp.badgeText, badgeBg: bp.badgeBg, badgeFg: bp.badgeFg, total: 'S/ ' + (l.unit * l.n).toFixed(2),`, 1);
rep(`        edit: () => this.setState({screen: l.pid === 'combo' ? '10' : '09', sel: l.pid || 'clasicos'})
      })),`,
`        edit: () => this.setState({screen: l.pid === 'combo' ? '10' : '09', sel: l.pid || 'clasicos'})
      }; }),`, 1);

// Confirmación: si el pedido es para recoger, el badge y la nota de pago lo reflejan
rep(`      payBadge: /Yape|Plin|Transferencia/.test(st.pay) ? 'PAGO POR VERIFICAR' : (st.pay.indexOf('Recojo') > -1 ? 'PAGAS EN TIENDA' : 'EFECTIVO · CONTRAENTREGA'),`,
    `      payBadge: /Yape|Plin|Transferencia/.test(lo.pay) ? 'PAGO POR VERIFICAR' : ((lo.pay.indexOf('Recojo') > -1 || lo.mode === 'pickup') ? 'PAGAS EN TIENDA' : 'EFECTIVO · CONTRAENTREGA'),`, 1);
rep(`      payBadgeBg: /Yape|Plin|Transferencia/.test(st.pay) ? '#FFF3DF' : '#E7F6EE',
      payBadgeFg: /Yape|Plin|Transferencia/.test(st.pay) ? '#B7791F' : '#1F9D62',
      payNote: /Yape|Plin|Transferencia/.test(st.pay)
        ? '📲 Envía la captura de tu pago por WhatsApp (912 266 950). Confirmamos en minutos y empezamos a preparar.'
        : (st.pay.indexOf('Recojo') > -1 ? '🏪 Pagas al retirar en Calle Alto Lima 1488.' : '💵 Ten listo el efectivo: el motorizado lleva sencillo.'),`,
`      payBadgeBg: /Yape|Plin|Transferencia/.test(lo.pay) ? '#FFF3DF' : '#E7F6EE',
      payBadgeFg: /Yape|Plin|Transferencia/.test(lo.pay) ? '#B7791F' : '#1F9D62',
      payNote: /Yape|Plin|Transferencia/.test(lo.pay)
        ? '📲 Envía la captura de tu pago por WhatsApp (' + STORE.yape + '). Confirmamos en minutos y empezamos a preparar.'
        : ((lo.pay.indexOf('Recojo') > -1 || lo.mode === 'pickup') ? '🏪 Pagas al retirar en ' + STORE.addr + '.' : '💵 Ten listo el efectivo: el motorizado lleva sencillo.'),`, 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK app-3');
