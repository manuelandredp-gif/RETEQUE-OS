// Aplica el plan de reestructuración (PLAN_REESTRUCTURACION_APP_MOVIL_RETEQUE_OS_CLAUDE.md) al prototipo móvil.
// Fase 1: elimina Direcciones/Nueva dirección y sus accesos.
// Fase 2: delivery termina en WhatsApp sin dirección/costo fijo; recojo conserva horario+pago+confirmación;
//         seguimiento deja de simular GPS/motorizado y pasa a ser un estado de preparación para recojo.
// Fase 2.5: la reseña de Google deja de depender de una valoración positiva; Perfil pierde "Mis direcciones".
// Uso: tools\node.cmd tools\patch-app-plan1.js
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

function rex(re, replace, expect) {
  const m = s.match(re) || [];
  if (m.length === 0 || (expect !== null && m.length !== expect)) {
    log.push('FAIL regex (' + m.length + (expect === null ? '' : ' != ' + expect) + '): ' + String(re).slice(0, 100));
    failed = true;
    return;
  }
  s = s.replace(re, () => replace);
  log.push('ok regex x' + m.length + ': ' + String(re).slice(0, 80));
}

/* ============ FASE 1 · Eliminar Direcciones y Nueva dirección ============ */

rep("['13','Carrito'],['14','Direcciones'],['15','Nueva dirección'],['16','Modalidad y horario'],",
    "['13','Carrito'],['16','Modalidad'],", 1);
rep("  '14':['Lote 14 · Direcciones guardadas','Selección de entrega'],\n  '15':['Lote 15 · Agregar dirección','Mapa, pin y etiquetas'],\n",
    "", 1);
rep("  '14':'Solo aparece si elegiste delivery. Elige Casa o Trabajo, o agrega una nueva.',\n  '15':'Cambia la etiqueta y el switch de dirección principal.',\n",
    "", 1);

// Elimina por completo las pantallas 14 y 15 (direcciones, mapa, pin, etiquetas)
rex(/<sc-if value="\{\{ s14 \}\}" hint-placeholder-val="\{\{ false \}\}">[\s\S]*?(?=<sc-if value="\{\{ s16 \}\}")/,
    '', 1);

// El "Entregar en Tacna" del Inicio deja de abrir Direcciones: pasa a ser informativo
rep('<div onClick="{{ go14 }}" style="display:flex;align-items:center;gap:5px;margin-top:6px;cursor:pointer">',
    '<div style="display:flex;align-items:center;gap:5px;margin-top:6px">', 1);

/* ============ FASE 2 · Flujo de compra: delivery por WhatsApp, recojo con pago ============ */

// Modalidad: el texto de delivery ya no promete un tiempo fijo de llegada
rep('<span style="display:block;font:400 12.5px \'Roboto\',sans-serif;color:#6B6662;margin-top:4px">Llega en 35–45 min</span>',
    '<span style="display:block;font:400 12.5px \'Roboto\',sans-serif;color:#6B6662;margin-top:4px">Coordinamos dirección y costo por WhatsApp</span>', 1);

// El horario (Lo antes posible / Programar) solo aplica a Recojo; Delivery muestra un aviso en su lugar
rep(`<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;overflow:hidden;margin-top:6px">
<sc-for list="{{ timings }}" as="t" hint-placeholder-count="2">
<button type="button" onClick="{{ t.pick }}" style="width:100%;border:0;border-bottom:1px solid #F4EDE0;background:transparent;display:flex;align-items:center;gap:12px;padding:15px 14px;cursor:pointer;text-align:left">
<span style="width:19px;height:19px;border-radius:50%;border:2px solid {{ t.ring }};display:flex;align-items:center;justify-content:center;flex:none"><span style="width:9px;height:9px;border-radius:50%;background:{{ t.dot }}"></span></span>
<span style="font:400 13.5px 'Roboto',sans-serif">{{ t.label }}</span>
</button>
</sc-for>
<div style="display:flex;gap:10px;padding:14px;opacity:{{ schedOpacity }}">
<div style="flex:1;border:1px solid #E7DECD;border-radius:{{ fieldR }};padding:11px 13px;font:400 12.5px 'Roboto',sans-serif;color:#6B6662">{{ schedDate }}</div>
<div style="flex:1;border:1px solid #E7DECD;border-radius:{{ fieldR }};padding:11px 13px;font:400 12.5px 'Roboto',sans-serif;color:#6B6662">{{ schedTime }}</div>
</div>
</div>`,
`<sc-if value="{{ isPickupMode }}" hint-placeholder-val="{{ true }}">
<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;overflow:hidden;margin-top:6px">
<sc-for list="{{ timings }}" as="t" hint-placeholder-count="2">
<button type="button" onClick="{{ t.pick }}" style="width:100%;border:0;border-bottom:1px solid #F4EDE0;background:transparent;display:flex;align-items:center;gap:12px;padding:15px 14px;cursor:pointer;text-align:left">
<span style="width:19px;height:19px;border-radius:50%;border:2px solid {{ t.ring }};display:flex;align-items:center;justify-content:center;flex:none"><span style="width:9px;height:9px;border-radius:50%;background:{{ t.dot }}"></span></span>
<span style="font:400 13.5px 'Roboto',sans-serif">{{ t.label }}</span>
</button>
</sc-for>
<div style="display:flex;gap:10px;padding:14px;opacity:{{ schedOpacity }}">
<div style="flex:1;border:1px solid #E7DECD;border-radius:{{ fieldR }};padding:11px 13px;font:400 12.5px 'Roboto',sans-serif;color:#6B6662">{{ schedDate }}</div>
<div style="flex:1;border:1px solid #E7DECD;border-radius:{{ fieldR }};padding:11px 13px;font:400 12.5px 'Roboto',sans-serif;color:#6B6662">{{ schedTime }}</div>
</div>
</div>
</sc-if>
<sc-if value="{{ isDeliveryMode }}" hint-placeholder-val="{{ false }}">
<div style="background:#FFF3DF;border:1.5px dashed #F5A623;border-radius:13px;padding:13px 14px;font:400 12.5px/1.55 'Roboto',sans-serif;color:#6B6662;margin-top:6px">📲 Al pulsar continuar armamos tu pedido; la dirección, el costo de envío y la forma de pago se coordinan directamente en WhatsApp.</div>
</sc-if>`, 1);

// Recojo puede seguir mostrando un estimado de preparación (no es tracking GPS); se deja igual a propósito.

// El resumen de la compra ya no depende de la modalidad para decidir a qué pantalla ir: siempre pasa por Resumen
rep("confirmMode: () => this.setState({screen: isPickup ? '17' : '14'}),",
    "confirmMode: () => this.setState({screen: '17'}),", 1);

// Resumen: la tarjeta "Entrega" deja de mostrar una dirección o un costo/tiempo fijo de delivery
rep("entregaLine: isPickup ? 'Recojo en ' + STORE.addr : st.addr + ' · ' + addrLine,\n      entregaSub: isPickup ? 'Listo en 20–25 min · pagas al retirar o por Yape' : 'Delivery · 35–45 min · ' + money(STORE.fee),",
    "entregaLine: isPickup ? 'Recojo en ' + STORE.addr : 'Delivery por WhatsApp',\n      entregaSub: isPickup ? 'Listo en 20–25 min · pagas al retirar o por Yape' : 'Dirección, costo de envío y pago se coordinan al enviar tu pedido',", 1);

// Resumen: método de pago y comprobante solo tienen sentido para Recojo (en Delivery se coordina por WhatsApp)
rep(`<button type="button" onClick="{{ go18 }}" style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;text-align:left;width:100%">
<span><span style="display:block;font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">MÉTODO DE PAGO</span><span style="display:block;font:500 13.5px 'Roboto',sans-serif;margin-top:8px">{{ payLabel }}</span></span>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A736B" stroke-width="2"><path d="M9 5l7 7-7 7"></path></svg>
</button>
<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;display:flex;align-items:center;justify-content:space-between">
<span><span style="display:block;font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">COMPROBANTE</span><span style="display:block;font:500 13.5px 'Roboto',sans-serif;margin-top:8px">Boleta</span></span>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A736B" stroke-width="2"><path d="M9 5l7 7-7 7"></path></svg>
</div>`,
`<sc-if value="{{ isPickup }}" hint-placeholder-val="{{ true }}">
<button type="button" onClick="{{ go18 }}" style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;text-align:left;width:100%">
<span><span style="display:block;font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">MÉTODO DE PAGO</span><span style="display:block;font:500 13.5px 'Roboto',sans-serif;margin-top:8px">{{ payLabel }}</span></span>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A736B" stroke-width="2"><path d="M9 5l7 7-7 7"></path></svg>
</button>
<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;display:flex;align-items:center;justify-content:space-between">
<span><span style="display:block;font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">COMPROBANTE</span><span style="display:block;font:500 13.5px 'Roboto',sans-serif;margin-top:8px">Boleta</span></span>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A736B" stroke-width="2"><path d="M9 5l7 7-7 7"></path></svg>
</div>
</sc-if>`, 1);

// Notas: el texto sirve para ambas modalidades (ya no asume que siempre hay un repartidor)
rep('placeholder="Instrucciones para el repartidor (opcional)" aria-label="Instrucciones"',
    'placeholder="Observaciones para tu pedido (opcional)" aria-label="Observaciones"', 1);

// Se elimina la fila de costo de envío (aparecía en Carrito y en Resumen): el costo de delivery no lo fija la app
rep('<div style="display:flex;justify-content:space-between"><span>{{ feeName }}</span><span style="color:#242424">{{ feeLabel }}</span></div>\n',
    '', 2);

// Botón de Resumen: confirma en tienda o abre WhatsApp según la modalidad
rep("payBtn: 'CONFIRMAR PEDIDO · ' + money(total),",
    "payBtn: isPickup ? 'CONFIRMAR PEDIDO · ' + money(total) : 'HACER PEDIDO POR WHATSAPP',", 1);

// pay(): en Delivery arma el mensaje de WhatsApp (sin dirección ni costo de envío) y no fuerza método de pago
rex(/      pay: \(\) => \{\n        const ordId = 'RTQ-' \+ \(2050 \+ Math\.floor\(Math\.random\(\) \* 200\)\);\n        const etaDate = new Date\(Date\.now\(\) \+ \(isPickup \? 22 : 35\) \* 60000\);\n        const order = \{id: ordId, lines: st\.lines\.slice\(\), sub: sub, fee: fee, disc: disc, total: total, mode: st\.mode, addr: st\.addr, addrLine: addrLine, pay: st\.pay, eta: fmtTime\(etaDate\), notes: st\.driverNotes\};\n        this\.flash\(\/Yape\|Plin\|Transferencia\/\.test\(st\.pay\) \? '¡Pedido enviado! Envíanos la captura del pago' : \(isPickup \? '¡Pedido enviado! Te avisamos cuando esté listo' : '¡Pedido enviado! Pagarás al recibir'\)\);\n        this\.setState\(\{screen: '19', lastOrder: order, lines: \[\], applied: false, driverNotes: '', hist: 'En curso'\}\);\n        try \{\n          fetch\('\/api\/pedidos', \{\n            method: 'POST',\n            headers: \{'Content-Type': 'application\/json'\},\n            body: JSON\.stringify\(\{\n              id: ordId,\n              customer: 'Milton Flores \(App\)',\n              phone: '952741852',\n              address: isPickup \? 'Recojo en tienda · ' \+ STORE\.addr : addrLine,\n              items: st\.lines\.map\(l => \(\{name: l\.name \+ \(l\.opts \? ' \(' \+ l\.opts \+ '\)' : ''\), qty: l\.n, price: l\.unit, sauces: l\.opts\}\)\),\n              subtotal: sub, deliveryFee: fee, discount: disc, total: total,\n              payMethod: st\.pay \|\| 'Pago contraentrega \(Efectivo\)',\n              notes: \(st\.driverNotes \? st\.driverNotes \+ ' · ' : ''\) \+ 'Pedido enviado desde la app\.' \+ \(isPickup \? ' Recojo en tienda\.' : ''\)\n            \}\)\n          \}\)\.catch\(function\(\)\{\}\);\n        \} catch\(e\) \{\}\n      \},/,
`      pay: () => {
        const ordId = 'RTQ-' + (2050 + Math.floor(Math.random() * 200));
        if (!isPickup) {
          // Delivery: no se fija dirección, costo de envío ni método de pago en la app; todo se coordina en WhatsApp.
          const order = {id: ordId, lines: st.lines.slice(), sub: sub, fee: 0, disc: disc, total: total, mode: 'delivery', pay: 'Por coordinar en WhatsApp', coupon: st.applied ? 'RETE10' : null, notes: st.driverNotes};
          this.buildOrderWhatsApp(order);
          this.flash('Solicitud enviada a WhatsApp');
          this.setState({screen: '19', lastOrder: order, lines: [], applied: false, driverNotes: '', hist: 'En curso'});
          return;
        }
        const etaDate = new Date(Date.now() + 22 * 60000);
        const order = {id: ordId, lines: st.lines.slice(), sub: sub, fee: 0, disc: disc, total: total, mode: 'pickup', pay: st.pay, eta: fmtTime(etaDate), notes: st.driverNotes};
        this.flash(/Yape|Plin|Transferencia/.test(st.pay) ? '¡Pedido enviado! Envíanos la captura del pago' : '¡Pedido confirmado! Te avisamos cuando esté listo');
        this.setState({screen: '19', lastOrder: order, lines: [], applied: false, driverNotes: '', hist: 'En curso'});
        try {
          fetch('/api/pedidos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: ordId,
              customer: 'Milton Flores (App)',
              phone: '952741852',
              address: 'Recojo en tienda · ' + STORE.addr,
              items: st.lines.map(l => ({name: l.name + (l.opts ? ' (' + l.opts + ')' : ''), qty: l.n, price: l.unit, sauces: l.opts})),
              subtotal: sub, deliveryFee: 0, discount: disc, total: total,
              payMethod: st.pay || 'Pago contraentrega (Efectivo)',
              notes: (st.driverNotes ? st.driverNotes + ' · ' : '') + 'Pedido enviado desde la app. Recojo en tienda.'
            })
          }).catch(function(){});
        } catch(e) {}
      },`, 1);

/* ============ Confirmación (19): diferenciar Delivery/Recojo, sin ETA falsa ============ */

rep("    const lo = st.lastOrder || {id: 'RTQ-2048', lines: ORDER_LINES['RTQ-2048'], sub: 52.90, fee: 5.90, disc: 0, total: 58.80, mode: 'delivery', addr: 'Casa', addrLine: 'Av. Bolognesi 845, Tacna', pay: 'Yape / Plin (captura por WhatsApp)', eta: '7:47 p. m.'};",
    "    const lo = st.lastOrder || {id: 'RTQ-2048', lines: ORDER_LINES['RTQ-2048'], sub: 52.90, fee: 0, disc: 0, total: 52.90, mode: 'pickup', pay: 'Pago contraentrega (Efectivo)', eta: '7:47 p. m.'};", 1);

rep('¡Gracias, Milton! 🥟', '{{ confirmTitle }}', 1);
rep('Empezamos a preparar tu pedido en cocina', '{{ confirmSub }}', 1);

rep(`      eta: lo.eta, etaTitle: lo.mode === 'pickup' ? 'LISTO PARA RECOGER' : 'LLEGA A LAS',
      etaSub: lo.mode === 'pickup' ? 'En aprox. 20–25 minutos' : 'En aprox. 35 minutos',
      notifyLine: lo.mode === 'pickup' ? 'Te avisamos por WhatsApp cuando tu pedido esté listo para recoger' : 'Te avisamos por WhatsApp cuando el motorizado esté cerca',
      orderId: lo.id, orderSummary: loSummary, orderSubtotal: money(lo.sub), orderTotal: money(lo.total),
      orderFeeName: lo.mode === 'pickup' ? 'Recojo en ' + STORE.addr : 'Delivery a ' + lo.addrLine, orderFee: money(lo.fee),
      orderPayShort: /Yape|Plin/.test(lo.pay) ? 'Yape ✓' : (/Transfer/.test(lo.pay) ? 'Transferencia' : (lo.mode === 'pickup' ? 'Pago en tienda' : 'Efectivo')),`,
`      confirmTitle: lo.mode === 'pickup' ? '¡Gracias, Milton! 🥟' : 'Solicitud enviada 🥟',
      confirmSub: lo.mode === 'pickup' ? 'Empezamos a preparar tu pedido en cocina' : 'La coordinación continúa por WhatsApp',
      eta: lo.mode === 'pickup' ? lo.eta : 'WhatsApp',
      etaTitle: lo.mode === 'pickup' ? 'LISTO PARA RECOGER' : 'PRÓXIMO PASO',
      etaSub: lo.mode === 'pickup' ? 'En aprox. 20–25 minutos' : 'Confirma dirección, costo y pago en la conversación',
      notifyLine: lo.mode === 'pickup' ? 'Te avisamos por WhatsApp cuando tu pedido esté listo para recoger' : 'Revisa WhatsApp para coordinar dirección, costo de envío y forma de pago',
      orderId: lo.id, orderSummary: loSummary, orderSubtotal: money(lo.sub), orderTotal: money(lo.total),
      orderPayShort: lo.mode !== 'pickup' ? 'Por WhatsApp' : (/Yape|Plin/.test(lo.pay) ? 'Yape ✓' : (/Transfer/.test(lo.pay) ? 'Transferencia' : 'Pago en tienda')),
      trackBtnLabel: lo.mode === 'pickup' ? 'VER ESTADO DEL PEDIDO' : 'ABRIR WHATSAPP',
      trackBtnAction: lo.mode === 'pickup' ? this.go('20') : () => this.buildOrderWhatsApp(lo, 'Hola 👋, quisiera confirmar el estado de mi solicitud.'),`, 1);

rep(`      payBadge: /Yape|Plin|Transferencia/.test(lo.pay) ? 'PAGO POR VERIFICAR' : ((lo.pay.indexOf('Recojo') > -1 || lo.mode === 'pickup') ? 'PAGAS EN TIENDA' : 'EFECTIVO · CONTRAENTREGA'),
      payBadgeBg: /Yape|Plin|Transferencia/.test(lo.pay) ? '#FFF3DF' : '#E7F6EE',
      payBadgeFg: /Yape|Plin|Transferencia/.test(lo.pay) ? '#B7791F' : '#1F9D62',
      payNote: /Yape|Plin|Transferencia/.test(lo.pay)
        ? '📲 Envía la captura de tu pago por WhatsApp (' + STORE.yape + '). Confirmamos en minutos y empezamos a preparar.'
        : ((lo.pay.indexOf('Recojo') > -1 || lo.mode === 'pickup') ? '🏪 Pagas al retirar en ' + STORE.addr + '.' : '💵 Ten listo el efectivo: el motorizado lleva sencillo.'),`,
`      payBadge: lo.mode !== 'pickup' ? 'COORDINAR POR WHATSAPP' : (/Yape|Plin|Transferencia/.test(lo.pay) ? 'PAGO POR VERIFICAR' : 'EFECTIVO · CONTRAENTREGA'),
      payBadgeBg: lo.mode !== 'pickup' ? '#E6F4FB' : (/Yape|Plin|Transferencia/.test(lo.pay) ? '#FFF3DF' : '#E7F6EE'),
      payBadgeFg: lo.mode !== 'pickup' ? '#0369A1' : (/Yape|Plin|Transferencia/.test(lo.pay) ? '#B7791F' : '#1F9D62'),
      payNote: lo.mode !== 'pickup'
        ? 'La forma de pago (Yape, Plin, efectivo) y el costo de envío se coordinan en la conversación de WhatsApp.'
        : (/Yape|Plin|Transferencia/.test(lo.pay)
          ? '📲 Envía la captura de tu pago por WhatsApp (' + STORE.yape + '). Confirmamos en minutos y empezamos a preparar.'
          : '🏪 Pagas al retirar en ' + STORE.addr + '.'),`, 1);

// Se elimina la fila de costo de envío en la confirmación (ya no hay un monto de delivery que mostrar)
rep('<div style="display:flex;justify-content:space-between;gap:10px"><span>{{ orderFeeName }}</span><span style="color:#242424;font-weight:600;flex:none">{{ orderFee }}</span></div>\n',
    '', 1);

rep(`<button type="button" onClick="{{ go20 }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer;box-shadow:0 6px 18px rgba(255,48,56,.26);display:flex;align-items:center;justify-content:center;gap:8px" style-active="transform:scale(.98)">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"></path><circle cx="12" cy="10" r="2.4"></circle></svg>
SEGUIR MI PEDIDO EN VIVO
</button>`,
`<button type="button" onClick="{{ trackBtnAction }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer;box-shadow:0 6px 18px rgba(255,48,56,.26);display:flex;align-items:center;justify-content:center;gap:8px" style-active="transform:scale(.98)">
{{ trackBtnLabel }}
</button>`, 1);

/* ============ Seguimiento (20): transformado, sin mapa/moto/GPS ============ */

rex(/<sc-if value="\{\{ s20 \}\}" hint-placeholder-val="\{\{ false \}\}">[\s\S]*?(?=<sc-if value="\{\{ s21 \}\}")/,
`<sc-if value="{{ s20 }}" hint-placeholder-val="{{ false }}">
<div class="scr" style="min-height:100%;background:#FFF8EE;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;gap:12px;padding:14px 20px 4px">
<button type="button" onClick="{{ go21 }}" aria-label="Volver" style="border:0;background:transparent;cursor:pointer;padding:6px;margin:-6px;display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" stroke-width="2"><path d="M15 5l-7 7 7 7"></path></svg></button>
<span style="font:700 18px/1.25 'Roboto',sans-serif;letter-spacing:-.01em">Estado de tu pedido</span>
</div>
<div class="stagger" style="padding:16px 20px 20px;display:flex;flex-direction:column;gap:16px;flex:1">

<div style="background:#fff;border:1px solid #EFE6D6;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:14px">
<div style="display:flex;align-items:center;justify-content:space-between">
<span style="font:700 15px 'Roboto',sans-serif">{{ orderId }}</span>
<span style="background:#FFF3DF;color:#D9891A;padding:4px 10px;border-radius:20px;font:700 10px 'Roboto',sans-serif;letter-spacing:.05em">RECOJO EN TIENDA</span>
</div>
<sc-for list="{{ pickupSteps }}" as="st" hint-placeholder-count="4">
<div style="display:flex;align-items:center;gap:12px">
<span style="width:26px;height:26px;border-radius:50%;background:{{ st.bg }};border:2px solid {{ st.bd }};display:flex;align-items:center;justify-content:center;flex:none;color:#fff;font:700 12px 'Roboto',sans-serif">{{ st.mark }}</span>
<span style="font:{{ st.weight }} 13.5px 'Roboto',sans-serif;color:{{ st.fg }}">{{ st.label }}</span>
</div>
</sc-for>
</div>

<div style="background:#FFF3DF;border:1.5px dashed #F5A623;border-radius:13px;padding:13px 14px;display:flex;align-items:center;gap:10px">
<span style="font-size:20px;line-height:1">🏪</span>
<span style="flex:1;font:500 12.5px/1.4 'Roboto',sans-serif;color:#8C7A55">Te avisamos por WhatsApp en cuanto tu pedido esté listo para recoger en {{ storeAddr }}.</span>
</div>

<div style="background:#fff;border:1px solid #EFE6D6;border-radius:12px;padding:11px 14px;display:flex;align-items:center;gap:10px">
<span style="width:32px;height:32px;border-radius:8px;background:#FFF3DF;display:flex;align-items:center;justify-content:center;flex:none">🥟</span>
<div style="flex:1;min-width:0">
<div style="font:600 12.5px 'Roboto',sans-serif;color:#242424">{{ orderId }} · {{ orderTotal }}</div>
<div style="font:400 11px 'Roboto',sans-serif;color:#6B6662">{{ orderSummary }}</div>
</div>
<button type="button" onClick="{{ go22 }}" style="border:0;background:transparent;color:#D91F2A;font:600 12px 'Roboto',sans-serif;cursor:pointer;padding:6px 4px;flex:none">Detalle ›</button>
</div>

<button type="button" onClick="{{ openLastOrderWA }}" style="width:100%;border:1.5px solid #DCD2C1;background:transparent;color:#242424;font:700 13px 'Roboto',sans-serif;letter-spacing:.04em;padding:14px 0;border-radius:{{ btnR }};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F9D62" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
Escribir por WhatsApp
</button>

</div>
</div>
</sc-if>

`, 1);

/* ============ Perfil, Google Reviews y limpieza de funciones huérfanas ============ */

// La reseña de Google ya no depende de una valoración positiva (nunca se condiciona a "rating >= 4")
rep('showGoogle: st.rating >= 4,', 'showGoogle: true,', 1);

// Perfil pierde "Mis direcciones"; se reemplaza por un acceso directo a "Mis pedidos" (ya existe la pantalla 21)
rep("        ['Mis direcciones','◎', this.go('14')],",
    "        ['Mis pedidos','▤', this.go('21')],", 1);

// go14/go15 quedan huérfanos (ya no hay pantallas 14/15 que abrir)
rep("go13: this.go('13'), go14: this.go('14'), go15: this.go('15'), go16: this.go('16'),",
    "go13: this.go('13'), go16: this.go('16'),", 1);

// saveAddr / addresses / addrTags / toggle de dirección principal solo servían a las pantallas eliminadas
rep("      saveAddr: () => { this.flash('Dirección guardada'); this.setState({screen: '14'}); },\n\n", "", 1);
rex(/      addresses: \[\['Casa','Av\. Bolognesi 845, Tacna'\],\['Trabajo','Calle Zela 320, Tacna'\]\]\.map\(a => \(\{[\s\S]*?dot: st\.addr === a\[0\] \? P\.coral : 'transparent'\n      \}\)\),\n      addrTags: \['Casa','Trabajo','Otro'\]\.map\(t =>\n        this\.chip\(t, st\.addrTag === t, \(\) => this\.setState\(\{addrTag: t\}\)\)\),\n      toggleMain: \(\) => this\.setState\(s => \(\{mainAddr: !s\.mainAddr\}\)\),\n      mainTrack: st\.mainAddr \? P\.coral : '#DCD2C1',\n      mainJustify: st\.mainAddr \? 'flex-end' : 'flex-start',\n\n/,
    '', 1);

/* ============ Nuevos campos de estado derivado para las plantillas ============ */

rep('const isPickup = st.mode === \'pickup\';',
    "const isPickup = st.mode === 'pickup';\n    const pickupStepIndex = 1; // Demo: \"Preparando\". El estado real debe venir del panel administrador cuando exista backend.", 1);

rep('      goHome: this.go(\'06\'), go03: this.go(\'03\'), go04: this.go(\'04\'), go05: this.go(\'05\'),',
    "      isPickup: isPickup, isPickupMode: st.mode === 'pickup', isDeliveryMode: st.mode === 'delivery',\n      goHome: this.go('06'), go03: this.go('03'), go04: this.go('04'), go05: this.go('05'),", 1);

rep("      go07: this.go('07'), go08: this.go('08'), go10: this.go('10'), go12: this.go('12'), go23: this.go('23'),",
    "      go07: this.go('07'), go08: this.go('08'), go10: this.go('10'), go12: this.go('12'), go21: this.go('21'), go23: this.go('23'),\n      openLastOrderWA: () => this.buildOrderWhatsApp(lo, 'Hola 👋, quisiera confirmar el estado de mi solicitud.'),\n      pickupSteps: ['Pedido recibido', 'Preparando', 'Listo para recoger', 'Recogido'].map((label, i) => ({\n        label,\n        mark: i < pickupStepIndex ? '✓' : (i + 1).toString(),\n        weight: i === pickupStepIndex ? 700 : 400,\n        fg: i <= pickupStepIndex ? P.char : '#A69E93',\n        bg: i < pickupStepIndex ? '#1F9D62' : (i === pickupStepIndex ? P.coral : '#fff'),\n        bd: i <= pickupStepIndex ? (i < pickupStepIndex ? '#1F9D62' : P.coral) : '#DCD2C1'\n      })),", 1);

/* ============ Método reutilizable para armar y abrir el mensaje de WhatsApp del pedido ============ */

rep('  flash = (msg, toCart) => {',
`  // Arma el mensaje del pedido (sin dirección, costo de envío ni método de pago) y abre WhatsApp.
  buildOrderWhatsApp = (order, note) => {
    const wa = ['🥟 PEDIDO RETEQUEÑOS', '────────────────────', '', '🔖 Solicitud: ' + order.id, '👤 Milton', '', '🛒 PEDIDO', ''];
    order.lines.forEach((l) => {
      wa.push(l.n + ' × ' + l.name);
      (l.opts || '').split(' · ').filter(Boolean).forEach((o) => wa.push('• ' + o));
    });
    wa.push('');
    if (order.coupon) wa.push('🎟 Cupón: ' + order.coupon);
    wa.push('💰 Total productos: S/ ' + order.total.toFixed(2));
    wa.push('');
    wa.push('🛵 Modalidad: Delivery');
    if (order.notes) wa.push('📝 ' + order.notes);
    wa.push('');
    wa.push(note || 'Hola 👋, quisiera realizar este pedido.');
    window.open('https://wa.me/' + STORE.whatsapp + '?text=' + encodeURIComponent(wa.join('\\n')), '_blank');
  };

  flash = (msg, toCart) => {`, 1);

rep("const STORE = {name:'Retequeños', addr:'Calle Alto Lima 1488, Tacna', hours:'Abierto hoy · delivery hasta 11:00 p. m.', fee:5.90, yape:'912 266 950'};",
    "const STORE = {name:'Retequeños', addr:'Calle Alto Lima 1488, Tacna', hours:'Abierto hoy · delivery hasta 11:00 p. m.', fee:0, yape:'912 266 950', whatsapp:'51912266950'};", 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK plan1');
