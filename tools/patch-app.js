// Aplica las 30 mejoras MVP al prototipo móvil (app/index.html).
// Uso: tools\node.cmd tools\patch-app.js
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
    log.push('FAIL regex (' + m.length + (expect === null ? '' : ' != ' + expect) + '): ' + String(re).slice(0, 90));
    failed = true;
    return;
  }
  s = s.replace(re, () => replace);
  log.push('ok regex x' + m.length + ': ' + String(re).slice(0, 70));
}

/* ===================== 1. ESTILOS: vista móvil real, fotos, campos ===================== */
rep(`.tickBlink{animation:tickBlink 1.4s ease-in-out infinite}
</style>`,
`.tickBlink{animation:tickBlink 1.4s ease-in-out infinite}
img.rq-photo{width:100%;height:100%;object-fit:cover;display:block;background:#FFF3DF}
textarea.rq-notes{width:100%;border:1px solid #EFE6D6;background:#fff;border-radius:11px;padding:10px 12px;font:400 12.5px/1.45 'Roboto',sans-serif;color:#242424;min-height:56px;resize:none;outline:0;box-sizing:border-box}
textarea.rq-notes::placeholder{color:#7A736B}
textarea.rq-notes:focus{border-color:#FF3038}
/* Vista móvil real: en un celular se oculta el escritorio del prototipo y la app ocupa toda la pantalla */
@media (max-width:720px){
  [data-rail]{display:none!important}
  [data-stage]{padding:0!important;gap:0!important;height:100dvh!important;overflow:hidden!important}
  [data-stage-title],[data-stage-hint],[data-statusbar],[data-homebar]{display:none!important}
  [data-zoom]{transform:none!important;width:100%;height:100%}
  [data-device]{width:100%!important;height:100dvh!important;border-radius:0!important;padding:0!important;box-shadow:none!important;background:#FFF8EE!important}
  [data-screen]{border-radius:0!important}
}
</style>`, 1);

/* ===================== 2. MARCADORES para el modo móvil ===================== */
rep('<aside style="width:262px;', '<aside data-rail style="width:262px;', 1);
rep('<main style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:20px 20px 24px;gap:12px;height:100vh;overflow:hidden">',
    '<main data-stage style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:20px 20px 24px;gap:12px;height:100vh;overflow:hidden">', 1);
rep('<div style="display:flex;align-items:baseline;gap:12px;align-self:flex-start;max-width:100%">',
    '<div data-stage-title style="display:flex;align-items:baseline;gap:12px;align-self:flex-start;max-width:100%">', 1);
rep('<div style="transform:scale({{ zoom }});transform-origin:center center;flex:none">',
    '<div data-zoom style="transform:scale({{ zoom }});transform-origin:center center;flex:none">', 1);
rep('<div style="position:relative;width:{{ devW }};height:{{ devH }};flex:none;background:#111;',
    '<div data-device style="position:relative;width:{{ devW }};height:{{ devH }};flex:none;background:#111;', 1);
rep('<div style="position:relative;width:100%;height:100%;border-radius:{{ scrR }};overflow:hidden;background:{{ pageBg }};display:flex;flex-direction:column;font-family:{{ ff }}">',
    '<div data-screen style="position:relative;width:100%;height:100%;border-radius:{{ scrR }};overflow:hidden;background:{{ pageBg }};display:flex;flex-direction:column;font-family:{{ ff }}">', 1);
rep(`<div style="flex:none;height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;font:500 11.5px 'Roboto',sans-serif;color:{{ sbFg }};background:transparent;z-index:5">`,
    `<div data-statusbar style="flex:none;height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;font:500 11.5px 'Roboto',sans-serif;color:{{ sbFg }};background:transparent;z-index:5">`, 1);
rep('<div style="flex:none;height:48px;display:flex;align-items:center;justify-content:space-between;padding:14px 26px 0;',
    '<div data-statusbar style="flex:none;height:48px;display:flex;align-items:center;justify-content:space-between;padding:14px 26px 0;', 1);
rep('<div style="flex:none;height:22px;background:{{ navBg }};display:flex;align-items:center;justify-content:center"><span style="width:104px;',
    '<div data-homebar style="flex:none;height:22px;background:{{ navBg }};display:flex;align-items:center;justify-content:center"><span style="width:104px;', 1);
rep('<div style="flex:none;height:26px;background:{{ navBg }};display:flex;align-items:center;justify-content:center"><span style="width:136px;',
    '<div data-homebar style="flex:none;height:26px;background:{{ navBg }};display:flex;align-items:center;justify-content:center"><span style="width:136px;', 1);
rep(`<div style="flex:none;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:560px;font:400 12px/1.5 'Roboto',sans-serif;color:#6B6662;text-align:center">`,
    `<div data-stage-hint style="flex:none;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:560px;font:400 12px/1.5 'Roboto',sans-serif;color:#6B6662;text-align:center">`, 1);

/* ===================== 3. PANEL LATERAL del prototipo ===================== */
rep('PROTOTIPO APP · v1', 'PROTOTIPO APP · v2 · MVP', 1);
rep('Wireframe navegable. Las zonas rayadas en dorado son <strong style="color:#F5A623;font-weight:500">placeholders de fotografía</strong> a reemplazar con fotos reales de producto.',
    'Prototipo navegable con fotos reales de la carta 2026. <strong style="color:#F5A623;font-weight:500">Ábrelo desde un celular</strong> y se ve a pantalla completa, como una app.', 1);

/* ===================== 4. FOTOS REALES ===================== */
// Bienvenida (02): foto sobre el placeholder ilustrado
rep(`</svg>
<button type="button" onClick="{{ goHome }}" style="position:absolute;top:14px;right:16px;border:0;background:rgba(255,255,255,.86);`,
`</svg>
<img class="rq-photo" src="img/products/tequenos/queso-detail-main.jpg" alt="Tequeños de queso recién fritos" style="position:absolute;inset:0;width:100%;height:100%">
<button type="button" onClick="{{ goHome }}" style="position:absolute;top:14px;right:16px;border:0;background:rgba(255,255,255,.86);`, 1);
// Miniatura de la promo en Inicio (06)
rex(/<svg viewBox="0 0 82 82"[\s\S]*?<\/svg>/, '<img class="rq-photo" src="img/promos/promo-duo.jpg" alt="Promo Duo">', 1);
// Tarjetas de producto: Inicio (06), Menú (08) y Favoritos (11)
rex(/<svg viewBox="0 0 200 96"[\s\S]*?<\/svg>/g, '<img class="rq-photo" src="{{ p.img }}" alt="{{ p.name }}">', 3);
// Resultados de búsqueda (07)
rex(/<svg viewBox="0 0 74 74"[\s\S]*?<\/svg>/g, '<img class="rq-photo" src="{{ p.img }}" alt="{{ p.name }}">', 1);
// Líneas del carrito (13)
rex(/<div class="ph" style="width:66px;height:66px;border-radius:10px;flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#FFF8EE">[\s\S]*?ARTESANAL<\/span>\n<\/div>/,
    '<div class="ph" style="width:66px;height:66px;border-radius:10px;flex:none;overflow:hidden"><img class="rq-photo" src="{{ it.img }}" alt=""></div>', 1);
// Detalle de producto (09): foto grande y etiqueta
rex(/<div class="ph" style="height:250px;flex:none;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden">[\s\S]*?10 unid\. · 100% Queso<\/div>/,
`<div class="ph" style="height:250px;flex:none;position:relative;overflow:hidden">
<img class="rq-photo" src="{{ dImg }}" alt="{{ dName }}">
<div style="position:absolute;left:16px;bottom:14px;font:700 11.5px 'Roboto',sans-serif;color:#8C7A55;background:rgba(255,255,255,.92);padding:4px 12px;border-radius:999px">{{ dTag }}</div>`, 1);

/* ===================== 5. DETALLE DE PRODUCTO dinámico (09) ===================== */
rep(`>Tequeños de queso</div>
<div style="font:500 12px 'Roboto',sans-serif;color:#8C7A55;white-space:nowrap;padding-top:4px">★ 4.8 (140)</div>`,
`>{{ dName }}</div>
<div style="font:500 12px 'Roboto',sans-serif;color:#8C7A55;white-space:nowrap;padding-top:4px">★ {{ dRating }}</div>`, 1);
rep('10 unidades · Fritos al momento · 20 unid. S/ 27.00', '{{ dSub }}', 1);
rep(`<div>
<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px">
<div style="font:600 13px 'Roboto',sans-serif;color:#242424">🥣 Salsa incluida</div>`,
`<sc-if value="{{ dHasPres }}" hint-placeholder-val="{{ true }}">
<div>
<div style="font:600 13px 'Roboto',sans-serif;color:#242424;margin-bottom:8px">📦 Presentación</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
<sc-for list="{{ dPres }}" as="x" hint-placeholder-count="2">
<button type="button" onClick="{{ x.pick }}" style="border:1.5px solid {{ x.bd }};background:{{ x.bg }};color:{{ x.fg }};border-radius:12px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;font:600 12.5px 'Roboto',sans-serif;transition:all .18s"><span>{{ x.label }}</span><span style="font-weight:700">{{ x.price }}</span></button>
</sc-for>
</div>
</div>
</sc-if>
<sc-if value="{{ dHasSauce }}" hint-placeholder-val="{{ true }}">
<div>
<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px">
<div style="font:600 13px 'Roboto',sans-serif;color:#242424">🥣 Salsa incluida</div>`, 1);
rep(`<div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px">
<span style="font:500 13.5px 'Roboto',sans-serif">Cantidad</span>`,
`</sc-if>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px">
<span style="font:500 13.5px 'Roboto',sans-serif">Cantidad</span>`, 1);
rep(`<button type="button" onClick="{{ dec }}" style="border:0;background:transparent;font:700 17px/1 'Roboto',sans-serif;color:#D91F2A;cursor:pointer">−</button>`,
    `<button type="button" onClick="{{ dec }}" aria-label="Menos" style="border:0;background:transparent;font:700 17px/1 'Roboto',sans-serif;color:#D91F2A;cursor:pointer;padding:8px 10px">−</button>`, 1);
rep(`<button type="button" onClick="{{ inc }}" style="border:0;background:transparent;font:700 17px/1 'Roboto',sans-serif;color:#D91F2A;cursor:pointer">+</button>`,
    `<button type="button" onClick="{{ inc }}" aria-label="Más" style="border:0;background:transparent;font:700 17px/1 'Roboto',sans-serif;color:#D91F2A;cursor:pointer;padding:8px 10px">+</button>`, 1);

/* ===================== 6. INICIO (06) ===================== */
rep('<button type="button" onClick="{{ go12 }}" style="border:0;background:#fff;width:38px;height:38px;border-radius:{{ iconR }};display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative">',
    '<button type="button" onClick="{{ go23 }}" aria-label="Notificaciones" style="border:0;background:#fff;width:38px;height:38px;border-radius:{{ iconR }};display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative">', 1);
rep('<button type="button" onClick="{{ go13 }}" style="border:0;background:#FF3038;width:38px;height:38px;border-radius:{{ iconR }};display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative">',
    '<button type="button" onClick="{{ go13 }}" aria-label="Carrito" style="border:0;background:#FF3038;width:38px;height:38px;border-radius:{{ iconR }};display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative">', 1);
rep('<div style="display:flex;align-items:center;gap:5px;margin-top:6px">',
    '<div onClick="{{ go14 }}" style="display:flex;align-items:center;gap:5px;margin-top:6px;cursor:pointer">', 1);
rep(`<span style="font:400 13.5px 'Roboto',sans-serif;color:#9B948C">¿Qué se te antoja hoy?</span>
</div>
`,
`<span style="font:400 13.5px 'Roboto',sans-serif;color:#9B948C">¿Qué se te antoja hoy?</span>
</div>

<div style="display:flex;align-items:center;gap:8px;padding:10px 20px 0;flex-wrap:wrap">
<span style="display:inline-flex;align-items:center;gap:6px;background:#E7F6EE;color:#187348;font:600 11px 'Roboto',sans-serif;padding:5px 10px;border-radius:999px"><span style="width:7px;height:7px;border-radius:50%;background:#1F9D62"></span>{{ openStatus }}</span>
<span style="font:400 11px 'Roboto',sans-serif;color:#6B6662">🛵 Delivery S/ 5.90 · 35–45 min</span>
</div>
`, 1);
rep('<div onClick="{{ go10 }}" style="margin:18px 20px 4px;border:1.5px dashed #F5A623;',
`<div style="margin:16px 20px 0;background:#fff;border:1px solid #EFE6D6;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px">
<img src="img/products/tequenos/queso.jpg" alt="" style="width:46px;height:46px;border-radius:10px;object-fit:cover;flex:none">
<div style="flex:1;min-width:0"><div style="font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">TU ÚLTIMO PEDIDO</div><div style="font:600 13px/1.3 'Roboto',sans-serif;color:#242424;margin-top:3px">2× Tequeños de queso + Limonada ½ L</div><div style="font:400 11px 'Roboto',sans-serif;color:#6B6662;margin-top:2px">RTQ-1987 · S/ 45.90 · 12 ago.</div></div>
<button type="button" onClick="{{ repeatLast }}" style="border:0;background:#FF3038;color:#fff;font:700 11px 'Roboto',sans-serif;padding:10px 12px;border-radius:{{ pill }};cursor:pointer;flex:none">REPETIR</button>
</div>
<div onClick="{{ go10 }}" style="margin:18px 20px 4px;border:1.5px dashed #F5A623;`, 1);

/* ===================== 7. INICIO DE SESIÓN (03): invitado ===================== */
rep(`style-active="transform:scale(.98)">INICIAR SESIÓN</button>`,
`style-active="transform:scale(.98)">INICIAR SESIÓN</button>
<button type="button" onClick="{{ goHome }}" style="border:1.5px solid #DCD2C1;background:transparent;color:#242424;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:13px 0;border-radius:{{ btnR }};cursor:pointer">CONTINUAR COMO INVITADO</button>`, 1);

/* ===================== 8. BÚSQUEDA (07) ===================== */
rep(`<div style="display:flex;gap:8px;padding:0 18px 12px;overflow-x:auto" class="sc">
<button type="button" style="flex:none;border:0;background:#242424;color:#fff;font:500 12px 'Roboto',sans-serif;padding:8px 14px;border-radius:{{ pill }};display:flex;gap:6px;align-items:center;cursor:pointer">Filtrar</button>
<button type="button" style="flex:none;border:1px solid #DCD2C1;background:#fff;color:#242424;font:500 12px 'Roboto',sans-serif;padding:8px 14px;border-radius:{{ pill }};cursor:pointer">Ordenar</button>
<button type="button" style="flex:none;border:1px solid #FF3038;background:#FFE9E9;color:#D91F2A;font:500 12px 'Roboto',sans-serif;padding:8px 14px;border-radius:{{ pill }};cursor:pointer">Más pedidos</button>
</div>`,
`<div style="display:flex;gap:8px;padding:0 18px 12px;overflow-x:auto" class="sc">
<sc-for list="{{ searchChips }}" as="c" hint-placeholder-count="5">
<button type="button" onClick="{{ c.pick }}" style="flex:none;border:1px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font:500 12px 'Roboto',sans-serif;padding:8px 14px;border-radius:{{ pill }};cursor:pointer;transition:all .18s">{{ c.label }}</button>
</sc-for>
</div>`, 1);
rep(`<button type="button" onClick="{{ clearQuery }}" style="border:0;background:#EFE6D6;width:18px;height:18px;border-radius:50%;cursor:pointer;color:#6B6662;font:700 11px/1 'Roboto',sans-serif;display:flex;align-items:center;justify-content:center">×</button>`,
    `<button type="button" onClick="{{ clearQuery }}" aria-label="Borrar búsqueda" style="border:0;background:#EFE6D6;width:26px;height:26px;border-radius:50%;cursor:pointer;color:#6B6662;font:700 13px/1 'Roboto',sans-serif;display:flex;align-items:center;justify-content:center;flex:none">×</button>`, 1);

/* ===================== 9. MENÚ (08) ===================== */
rep(`<div style="padding:8px 20px 4px">
<div style="font:700 {{ h1Size }} 'Roboto',sans-serif;letter-spacing:-.02em">Nuestro menú</div>
</div>`,
`<div style="padding:8px 20px 4px;display:flex;align-items:center;justify-content:space-between;gap:10px">
<div style="font:700 {{ h1Size }} 'Roboto',sans-serif;letter-spacing:-.02em">Nuestro menú</div>
<button type="button" onClick="{{ go13 }}" aria-label="Carrito" style="border:0;background:#FF3038;width:38px;height:38px;border-radius:{{ iconR }};display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;flex:none">
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M6 7h12l-1 12H7L6 7z"></path><path d="M9 7V5.5a3 3 0 016 0V7"></path></svg>
<span style="position:absolute;top:-4px;right:-4px;min-width:19px;height:19px;border-radius:10px;background:#242424;color:#fff;font:700 11px 'Roboto',sans-serif;display:flex;align-items:center;justify-content:center;padding:0 5px">{{ cart }}</span>
</button>
</div>`, 1);
rep(`<div style="padding:0 20px 8px;font:400 12px 'Roboto',sans-serif;color:#6B6662">Tequeños de queso · Desde S/ 16.00</div>`,
    `<div style="padding:0 20px 8px;font:400 12px 'Roboto',sans-serif;color:#6B6662">{{ menuSub }}</div>`, 1);
// Botón "+" de las tarjetas: área táctil de 36 px
rep(`style="border:0;width:28px;height:28px;border-radius:{{ iconR }};background:#FF3038;color:#fff;font:700 17px/1 'Roboto',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding-bottom:2px"`,
    `aria-label="Agregar al carrito" style="border:0;width:36px;height:36px;border-radius:{{ iconR }};background:#FF3038;color:#fff;font:700 19px/1 'Roboto',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding-bottom:2px"`, 2);

/* ===================== 10. PERSONALIZAR COMBO (10) ===================== */
rep(`<div style="background:#fff;border:1px solid #EFE6D6;border-radius:11px;padding:10px 12px;font:400 12.5px 'Roboto',sans-serif;color:#9B948C;min-height:44px">Ej: cremas aparte, sin servilletas</div>`,
    `<textarea class="rq-notes" value="{{ comboNotes }}" onInput="{{ onComboNotes }}" placeholder="Ej: cremas aparte, sin servilletas" aria-label="Notas del combo"></textarea>`, 1);
rep(`cursor:pointer">Listo</button>`, `cursor:pointer">Cerrar</button>`, 1);

/* ===================== 11. CARRITO (13) ===================== */
rep(`<div class="stagger" style="padding:16px 20px 8px;display:flex;flex-direction:column;gap:10px;flex:1">
<sc-for list="{{ cartItems }}" as="it" hint-placeholder-count="2">`,
`<div class="stagger" style="padding:16px 20px 8px;display:flex;flex-direction:column;gap:10px;flex:1">
<sc-if value="{{ cartEmpty }}" hint-placeholder-val="{{ false }}">
<div style="text-align:center;padding:40px 20px;display:flex;flex-direction:column;gap:12px;align-items:center">
<img src="img/products/tequenos/queso.jpg" alt="" style="width:120px;height:80px;object-fit:cover;border-radius:14px;opacity:.9">
<div style="font:700 17px 'Roboto',sans-serif">Tu carrito está vacío</div>
<div style="font:400 13px/1.5 'Roboto',sans-serif;color:#6B6662;max-width:230px">Agrega tequeños, promos o pizzas desde el menú.</div>
<button type="button" onClick="{{ go08 }}" style="border:0;background:#FF3038;color:#fff;font:700 12.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:13px 22px;border-radius:{{ btnR }};cursor:pointer">VER EL MENÚ</button>
</div>
</sc-if>
<sc-if value="{{ cartHas }}" hint-placeholder-val="{{ true }}">
<sc-for list="{{ cartItems }}" as="it" hint-placeholder-count="2">`, 1);
rep(`</div>
</div>
<div style="position:sticky;bottom:0;padding:12px 20px 16px;background:#FFF8EE;border-top:1px solid #EFE6D6">
<button type="button" onClick="{{ go14 }}"`,
`</div>
</sc-if>
</div>
<div style="position:sticky;bottom:0;padding:12px 20px 16px;background:#FFF8EE;border-top:1px solid #EFE6D6">
<button type="button" onClick="{{ continueCart }}"`, 1);
rep(`<div style="display:flex;justify-content:space-between"><span>Delivery</span><span style="color:#242424">S/ 5.90</span></div>`,
    `<div style="display:flex;justify-content:space-between"><span>{{ feeName }}</span><span style="color:#242424">{{ feeLabel }}</span></div>`, 2);
rep(`<button type="button" onClick="{{ it.dec }}" style="border:0;background:transparent;color:#D91F2A;font:700 15px/1 'Roboto',sans-serif;cursor:pointer">−</button>`,
    `<button type="button" onClick="{{ it.dec }}" aria-label="Menos" style="border:0;background:transparent;color:#D91F2A;font:700 15px/1 'Roboto',sans-serif;cursor:pointer;padding:6px 6px">−</button>`, 1);
rep(`<button type="button" onClick="{{ it.inc }}" style="border:0;background:transparent;color:#D91F2A;font:700 15px/1 'Roboto',sans-serif;cursor:pointer">+</button>`,
    `<button type="button" onClick="{{ it.inc }}" aria-label="Más" style="border:0;background:transparent;color:#D91F2A;font:700 15px/1 'Roboto',sans-serif;cursor:pointer;padding:6px 6px">+</button>`, 1);
rep(`<button type="button" onClick="{{ it.remove }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex">`,
    `<button type="button" onClick="{{ it.remove }}" aria-label="Eliminar del carrito" style="border:0;background:transparent;cursor:pointer;padding:6px;margin:-6px;display:flex">`, 1);

/* ===================== 12. FLUJO: carrito → modalidad → dirección (solo delivery) → resumen ===================== */
rep(`<button type="button" onClick="{{ go13 }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" stroke-width="2"><path d="M15 5l-7 7 7 7"></path></svg></button>
<span style="font:700 18px 'Roboto',sans-serif;letter-spacing:-.01em">¿Dónde lo llevamos?</span>`,
`<button type="button" onClick="{{ go16 }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" stroke-width="2"><path d="M15 5l-7 7 7 7"></path></svg></button>
<span style="font:700 18px 'Roboto',sans-serif;letter-spacing:-.01em">¿Dónde lo llevamos?</span>`, 1);
rep(`onClick="{{ go16 }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer" style-active="transform:scale(.98)">CONFIRMAR DIRECCIÓN</button>`,
    `onClick="{{ go17 }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer" style-active="transform:scale(.98)">CONFIRMAR DIRECCIÓN</button>`, 1);
rep(`<button type="button" onClick="{{ go14 }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" stroke-width="2"><path d="M15 5l-7 7 7 7"></path></svg></button>
<span style="font:700 18px/1.25 'Roboto',sans-serif;letter-spacing:-.01em">¿Cómo recibirás tu pedido?</span>`,
`<button type="button" onClick="{{ go13 }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" stroke-width="2"><path d="M15 5l-7 7 7 7"></path></svg></button>
<span style="font:700 18px/1.25 'Roboto',sans-serif;letter-spacing:-.01em">¿Cómo recibirás tu pedido?</span>`, 1);
rep(`onClick="{{ go17 }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer" style-active="transform:scale(.98)">CONTINUAR</button>`,
    `onClick="{{ confirmMode }}" style="width:100%;border:0;background:#FF3038;color:#fff;font:700 13.5px 'Roboto',sans-serif;letter-spacing:.04em;padding:16px 0;border-radius:{{ btnR }};cursor:pointer" style-active="transform:scale(.98)">CONTINUAR</button>`, 1);
rep(`Listo en 20–25 min</span></span>`, `Listo en 20–25 min · {{ storeAddr }}</span></span>`, 1);

/* ===================== 13. RESUMEN DE COMPRA (17) con datos reales ===================== */
rep(`<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px">
<div style="display:flex;justify-content:space-between;align-items:center">
<span style="font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">ENTREGA</span>`,
`<div onClick="{{ go16 }}" style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;cursor:pointer">
<div style="display:flex;justify-content:space-between;align-items:center">
<span style="font:500 10px 'Roboto',sans-serif;letter-spacing:.14em;color:#8C867F">ENTREGA</span>`, 1);
rep(`<div style="font:500 13.5px 'Roboto',sans-serif;margin-top:8px">Av. Bolognesi 845</div>
<div style="font:400 12px 'Roboto',sans-serif;color:#6B6662;margin-top:3px">35–45 min</div>`,
`<div style="font:500 13.5px 'Roboto',sans-serif;margin-top:8px">{{ entregaLine }}</div>
<div style="font:400 12px 'Roboto',sans-serif;color:#6B6662;margin-top:3px">{{ entregaSub }}</div>`, 1);
rep(`<div style="display:flex;justify-content:space-between"><span>1 × Tequeños de queso</span><span>S/ 16.00</span></div>
<div style="display:flex;justify-content:space-between"><span>1 × Promo Duo</span><span>S/ 35.90</span></div>`,
`<sc-for list="{{ cartItems }}" as="it" hint-placeholder-count="2">
<div style="display:flex;justify-content:space-between;gap:10px"><span>{{ it.n }} × {{ it.name }}</span><span style="flex:none">{{ it.total }}</span></div>
</sc-for>`, 1);
rep(`<div style="background:#fff;border:1px solid #EFE6D6;border-radius:13px;padding:14px;font:400 13px 'Roboto',sans-serif;color:#9B948C;min-height:60px">Instrucciones para el repartidor</div>`,
    `<textarea class="rq-notes" value="{{ driverNotes }}" onInput="{{ onDriverNotes }}" placeholder="Instrucciones para el repartidor (opcional)" aria-label="Instrucciones" style="border-radius:13px;padding:14px;min-height:60px;font-size:13px"></textarea>`, 1);
rep(`<div style="display:flex;justify-content:space-between"><span>Subtotal</span><span style="color:#242424">S/ 51.90</span></div>`,
    `<div style="display:flex;justify-content:space-between"><span>Subtotal</span><span style="color:#242424">{{ subtotalLabel }}</span></div>`, 1);
rep(`<div style="display:flex;justify-content:space-between"><span>Descuento</span><span style="color:#1F9D62">− S/ 2.00</span></div>`,
    `<div style="display:flex;justify-content:space-between"><span>Descuento</span><span style="color:#1F9D62">{{ discount }}</span></div>`, 1);
rep(`<div style="display:flex;justify-content:space-between;font:700 15px 'Roboto',sans-serif;color:#242424"><span>Total</span><span>S/ 55.80</span></div>`,
    `<div style="display:flex;justify-content:space-between;font:700 15px 'Roboto',sans-serif;color:#242424"><span>Total</span><span>{{ cartTotal }}</span></div>`, 1);
rep(`CONFIRMAR PEDIDO CONTRAENTREGA · S/ 55.80`, `{{ payBtn }}`, 1);

/* ===================== 14. MÉTODO DE PAGO (18): datos para yapear ===================== */
rep(`💳 <strong>Yape / Plin / transferencia:</strong> nos envías la captura por WhatsApp, la verificamos en minutos y empezamos a preparar.</div>
</div>`,
`💳 <strong>Yape / Plin / transferencia:</strong> nos envías la captura por WhatsApp, la verificamos en minutos y empezamos a preparar.</div>
<sc-if value="{{ showYape }}" hint-placeholder-val="{{ false }}">
<div style="padding:12px 14px;background:#FFF3DF;border-top:1px dashed #F5A623;display:flex;align-items:center;gap:12px;animation:fadeUp .25s">
<span style="width:40px;height:40px;border-radius:10px;background:#742284;color:#fff;font:700 11px 'Roboto',sans-serif;display:flex;align-items:center;justify-content:center;flex:none">YAPE</span>
<div style="flex:1;font:400 12px/1.45 'Roboto',sans-serif;color:#6B6662">Yapea o plinea a <strong style="color:#242424;font-size:14px">{{ yapeNumber }}</strong> · Retequeños<br>Luego envía la captura al mismo número por WhatsApp.</div>
</div>
</sc-if>
</div>`, 1);

/* ===================== 15. CONFIRMACIÓN (19) y SEGUIMIENTO (20) con el pedido real ===================== */
rep('LLEGA A LAS', '{{ etaTitle }}', 1);
rep('7:47 p. m.', '{{ eta }}', 1);
rep('En aprox. 32 minutos', '{{ etaSub }}', 1);
rep('PEDIDO RTQ-2048', 'PEDIDO {{ orderId }}', 1);
rep(`<div style="display:flex;justify-content:space-between"><span>1 Promo Duo + 1 Tequeños de chocolate</span><span style="color:#242424;font-weight:600">S/ 52.90</span></div>
<div style="display:flex;justify-content:space-between"><span>Delivery a Calle Arias y Aragüez 550</span><span style="color:#242424;font-weight:600">S/ 5.90</span></div>`,
`<div style="display:flex;justify-content:space-between;gap:10px"><span>{{ orderSummary }}</span><span style="color:#242424;font-weight:600;flex:none">{{ orderSubtotal }}</span></div>
<div style="display:flex;justify-content:space-between;gap:10px"><span>{{ orderFeeName }}</span><span style="color:#242424;font-weight:600;flex:none">{{ orderFee }}</span></div>`, 1);
rep(`<span style="color:#FF3038;font:700 15px 'Roboto',sans-serif">S/ 58.80</span>`, `<span style="color:#FF3038;font:700 15px 'Roboto',sans-serif">{{ orderTotal }}</span>`, 1);
rep('Te avisamos por WhatsApp cuando el motorizado esté cerca', '{{ notifyLine }}', 1);
rep('RTQ-2048 · S/ 58.80', '{{ orderId }} · {{ orderTotal }}', 1);
rep('1 Promo Duo + 1 Tequeños de chocolate · Yape ✓', '{{ orderSummary }} · {{ orderPayShort }}', 1);

/* ===================== 16. TOAST con acción y BARRA "Ver carrito" ===================== */
rep(`<div style="position:absolute;left:16px;right:16px;bottom:92px;background:#242424;color:#fff;border-radius:11px;padding:14px 16px;font:500 13px 'Roboto',sans-serif;display:flex;align-items:center;gap:10px;animation:toastIn .28s cubic-bezier(.2,.8,.2,1);z-index:20;box-shadow:0 12px 30px rgba(0,0,0,.25)">
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7BE0A9" stroke-width="2.6"><path d="M4 12.5l5.2 5L20 6.5"></path></svg>
<span style="flex:1">{{ toast }}</span>`,
`<div onClick="{{ toastTap }}" role="status" style="position:absolute;left:16px;right:16px;bottom:92px;background:#242424;color:#fff;border-radius:11px;padding:14px 16px;font:500 13px 'Roboto',sans-serif;display:flex;align-items:center;gap:10px;animation:toastIn .28s cubic-bezier(.2,.8,.2,1);z-index:20;box-shadow:0 12px 30px rgba(0,0,0,.25);cursor:pointer">
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7BE0A9" stroke-width="2.6"><path d="M4 12.5l5.2 5L20 6.5"></path></svg>
<span style="flex:1">{{ toast }}</span>
<span style="font:700 12px 'Roboto',sans-serif;color:#FFD9B0;flex:none">{{ toastCta }}</span>`, 1);
rep(`
<sc-if value="{{ showNav }}" hint-placeholder-val="{{ false }}">`,
`
<sc-if value="{{ showCartBar }}" hint-placeholder-val="{{ false }}">
<button type="button" onClick="{{ go13 }}" aria-label="Ver carrito" style="flex:none;margin:0 14px 8px;border:0;background:#242424;color:#fff;border-radius:14px;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.18);font:600 13px 'Roboto',sans-serif;animation:fadeUp .25s">
<span style="display:flex;align-items:center;gap:10px"><span style="min-width:24px;height:24px;border-radius:12px;background:#FF3038;display:flex;align-items:center;justify-content:center;font:700 12px 'Roboto',sans-serif;padding:0 7px">{{ cartCount }}</span>Ver carrito</span>
<span style="font:700 14px 'Roboto',sans-serif">{{ cartBarTotal }}</span>
</button>
</sc-if>
<sc-if value="{{ showNav }}" hint-placeholder-val="{{ false }}">`, 1);

/* ===================== 17. ACCESIBILIDAD y CONTRASTE ===================== */
rep(`style="border:0;background:transparent;cursor:pointer;padding:0;display:flex"><svg width="22" height="22"`,
    `aria-label="Volver" style="border:0;background:transparent;cursor:pointer;padding:6px;margin:-6px;display:flex"><svg width="22" height="22"`, null);
rep(`<button type="button" onClick="{{ p.fav }}" style="border:0;background:transparent;cursor:pointer;padding:0;display:flex;animation:pop .3s">`,
    `<button type="button" onClick="{{ p.fav }}" aria-label="Favorito" style="border:0;background:transparent;cursor:pointer;padding:6px;margin:-6px;display:flex;animation:pop .3s">`, 1);
rep(`<button type="button" onClick="{{ favDetail }}" style=`, `<button type="button" onClick="{{ favDetail }}" aria-label="Favorito" style=`, 1);
rep('#9B948C', '#7A736B', null);

/* ===================== 18. LÓGICA (script del prototipo) ===================== */
rep(`const P = {coral:'#FF3038', dark:'#D91F2A', gold:'#F5A623', cream:'#FFF8EE', char:'#242424', gray:'#6B6662'};`,
String.raw`const P = {coral:'#FF3038', dark:'#D91F2A', gold:'#F5A623', cream:'#FFF8EE', char:'#242424', gray:'#6B6662'};

// Datos del local (configurables; el horario y la dirección deben confirmarse con Retequeños)
const STORE = {name:'Retequeños', addr:'Calle Alto Lima 1488, Tacna', hours:'Abierto hoy · delivery hasta 11:00 p. m.', fee:5.90, yape:'912 266 950'};

// Fotos reales de la carta (las mismas de la web)
const IMG_DEFAULT = 'img/products/tequenos/queso.jpg';
const IMG = {
  clasicos:'img/products/tequenos/queso.jpg', combo:'img/promos/promo-duo.jpg', jamon:'img/products/tequenos/jamon-queso.jpg',
  dulces:'img/products/tequenos/chocolate.jpg', tocino:'img/products/tequenos/tocino-queso.jpg', hotdog:'img/products/tequenos/hotdog-queso.jpg',
  tresquesos:'img/products/tequenos/tres-quesos.jpg', ajigallina:'img/products/tequenos/aji-de-gallina.jpg', oregano:'img/products/tequenos/queso.jpg',
  cheddar:'img/products/tequenos/queso-cheddar.jpg', jamoncheddar:'img/products/tequenos/jamon-cheddar.jpg',
  'promo-solo':'img/promos/promo-solo-para-mi.jpg', 'promo-extra':'img/promos/promo-extra.jpg', 'promo-familiar':'img/promos/promo-familiar.jpg',
  'promo-tequepizza':'img/promos/promo-tequepizza.jpg', 'promo-antojo':'img/promos/antojo-criollo.jpg', 'promo-sazon':'img/promos/sazon-antojo.jpg',
  'promo-bocados':'img/promos/bocaditos-de-felicidad.jpg', 'promo-fiesta':'img/promos/fiesta-de-sabor.jpg', 'promo-mundo':'img/promos/mundo-de-sabores.jpg',
  'promo-sinlimites':'img/promos/sabor-sin-limites.jpg', 'promo-tentacion':'img/promos/la-doble-tentacion.jpg', 'promo-placer':'img/promos/doble-placer.jpg',
  'pizza-americana':'img/products/pizzas/americana.jpg', 'pizza-italiana':'img/products/pizzas/italiana.jpg', 'pizza-supermargarita':'img/products/pizzas/super-margarita.jpg',
  'pizza-hawaiana':'img/products/pizzas/la-hawaiana.jpg', 'pizza-peperoni':'img/products/pizzas/full-peperoni.jpg', 'pizza-especial':'img/products/pizzas/la-especial.jpg',
  'pizza-espanola':'img/products/pizzas/espanola.jpg', 'pizza-vegetariana':'img/products/pizzas/vegetariana.jpg', 'pizza-oriental':'img/products/pizzas/oriental.jpg',
  'pizza-primavera':'img/products/pizzas/primavera.jpg', 'pizza-margarita':'img/products/pizzas/margarita.jpg', 'pizza-adicional':'img/products/pizzas/adicionales.jpg',
  'pastel-queso':'img/promos/antojo-criollo.jpg', 'pastel-jamonqueso':'img/promos/antojo-criollo.jpg', 'pastel-pizza':'img/promos/antojo-criollo.jpg',
  'pastel-pollo':'img/promos/antojo-criollo.jpg', 'pastel-carne':'img/promos/antojo-criollo.jpg',
  limonada:'img/products/bebidas/coca-cola-600ml.jpg', chicha:'img/products/bebidas/coca-cola-600ml.jpg', cocacola:'img/products/bebidas/coca-cola-600ml.jpg',
  inkakola:'img/products/bebidas/coca-cola-600ml.jpg', pepsi1l:'img/products/bebidas/coca-cola-600ml.jpg', pepsi2l:'img/products/bebidas/coca-cola-600ml.jpg',
  agua:'img/products/bebidas/coca-cola-600ml.jpg', infusiones:'img/products/bebidas/coca-cola-600ml.jpg', tartara:'img/products/cremas/mayonesa-ajo.jpg'
};
const num = (v) => parseFloat(String(v).replace(/[^\d.]/g, '')) || 0;
const money = (n) => 'S/ ' + n.toFixed(2);
const fmtTime = (d) => { let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? 'p. m.' : 'a. m.'; h = h % 12 || 12; return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ap; };
// Líneas de pedidos anteriores para "Pedir de nuevo"
const ORDER_LINES = {
  'RTQ-1987': [{pid:'clasicos', name:'Tequeños de queso', opts:'Mayonesa de ajo', unit:16.00, n:2}, {pid:'limonada', name:'Limonada', opts:'½ litro', unit:8.00, n:1}],
  'RTQ-1904': [{pid:'promo-solo', name:'Promo Solo para Mí', opts:'Queso · 2 cremas · gaseosa ½ L', unit:19.90, n:1}],
  'RTQ-2048': [{pid:'combo', name:'Promo Duo', opts:'Queso · Mayonesa de ajo y Mayopalta', unit:35.90, n:1}, {pid:'dulces', name:'Tequeños de chocolate', opts:'', unit:17.00, n:1}]
};`, 1);

rex(/  state = \{\n    plat: 'android', screen: '01', cart: 2,[\s\S]*?zoom: 1\n  \};/,
`  state = {
    plat: 'android', screen: '01', cart: 0, favs: ['clasicos'], cat: 'Todos', homeChip: 'Clásicos',
    query: '', sortTop: false, qty: 1, sauce: 'Mayonesa de ajo', relleno: 'Queso', sauces: ['Mayonesa de ajo', 'Mayopalta'],
    extraCheese: false, extraSauce: false, sel: 'clasicos', pres: 10,
    toast: '', toastGo: false, copied: false, terms: false,
    lines: [{id:'l1', pid:'clasicos', name:'Tequeños de queso', opts:'Mayonesa de ajo · Queso', unit:16.00, n:1, img: IMG.clasicos},
            {id:'l2', pid:'combo', name:'Promo Duo', opts:'Queso · Mayonesa de ajo y Mayopalta', unit:35.90, n:1, img: IMG.combo}],
    applied: true, addr: 'Casa', addrTag: 'Casa', mainAddr: true,
    mode: 'delivery', timing: 'Lo antes posible', pay: 'Pago contraentrega (Efectivo)',
    comboNotes: '', driverNotes: '', lastOrder: null,
    hist: 'En curso', rating: 0, unread: true,
    improve: [], source: '', surveySent: false,
    swOrders: true, swPromos: true, swLoc: false, zoom: 1
  };`, 1);

rep(`  flash = (msg) => {
    clearTimeout(this._tt);
    this.setState({toast: msg});
    this._tt = setTimeout(() => this.setState({toast: ''}), 2200);
  };`,
`  flash = (msg, toCart) => {
    clearTimeout(this._tt);
    this.setState({toast: msg, toastGo: !!toCart});
    this._tt = setTimeout(() => this.setState({toast: '', toastGo: false}), 2400);
  };`, 1);

rep(`  add = (name) => () => { this.setState(s => ({cart: s.cart + 1})); this.flash('Agregado al carrito · ' + name); };`,
`  // "+" agrega una línea real al carrito (o suma 1 si ya estaba sin opciones)
  add = (id) => () => {
    const p = CATALOG.filter(x => x.id === id)[0];
    if (!p) return;
    this.setState(s => {
      const idx = s.lines.findIndex(l => l.pid === p.id && !l.opts);
      if (idx > -1) return {lines: s.lines.map((l, j) => j === idx ? Object.assign({}, l, {n: Math.min(20, l.n + 1)}) : l)};
      return {lines: s.lines.concat([{id: 'l-' + Date.now(), pid: p.id, name: p.name, opts: '', unit: num(p.price), n: 1, img: IMG[p.id] || IMG_DEFAULT}])};
    });
    this.flash('Agregado al carrito · ' + p.name, true);
  };

  // Vuelve a pedir un pedido anterior con sus líneas reales
  reorder = (oid) => () => {
    const lo = this.state.lastOrder;
    const src = ORDER_LINES[oid] || (lo && lo.id === oid ? lo.lines : []);
    if (!src.length) { this.flash('No encontramos ese pedido'); return; }
    const t = Date.now();
    this.setState(s => ({lines: s.lines.concat(src.map((l, i) => Object.assign({}, l, {id: 'r' + t + i, img: IMG[l.pid] || IMG_DEFAULT}))), screen: '13'}));
    this.flash('Pedido ' + oid + ' agregado al carrito', true);
  };`, 1);

rex(/  addDetail = \(\) => \{[\s\S]*?this\.setState\(\{screen: '13'\}\);\n  \};/,
String.raw`  addDetail = () => {
    const st = this.state;
    const dp = CATALOG.filter(x => x.id === st.sel)[0] || CATALOG[0];
    const m = /20 unid\. S\/ ([\d.]+)/.exec(dp.desc || '');
    const p20 = m ? parseFloat(m[1]) : null;
    const hasSauce = ['Clásicos','Especiales','Pastelitos'].indexOf(dp.cat) > -1;
    const base = st.pres === 20 && p20 ? p20 : num(dp.price);
    const parts = [];
    if (hasSauce) parts.push(st.sauce || 'Mayonesa de ajo');
    if (st.pres === 20 && p20) parts.push('20 unid.');
    if (st.extraCheese) parts.push('Extra queso');
    if (st.extraSauce) parts.push('Crema extra');
    const opts = parts.join(' · ');
    const unit = base + (st.extraCheese ? 3.00 : 0) + (st.extraSauce ? 2.00 : 0);
    const qty = st.qty;
    this.setState(s => ({
      lines: s.lines.concat([{id: 'd-' + Date.now(), pid: dp.id, name: dp.name, opts: opts, unit: unit, n: qty, img: IMG[dp.id] || IMG_DEFAULT}]),
      screen: '13', qty: 1
    }));
    this.flash('Agregado · ' + qty + '× ' + dp.name + (opts ? ' (' + opts + ')' : ''));
  };`, 1);

rex(/  addCombo = \(\) => \{[\s\S]*?this\.setState\(\{screen: '13'\}\);\n  \};/,
`  addCombo = () => {
    const st = this.state;
    const sStr = st.sauces.length ? st.sauces.join(' y ') : 'Sin cremas';
    const opts = (st.relleno || 'Queso') + ' · ' + sStr + (st.comboNotes ? ' · Nota: ' + st.comboNotes : '');
    this.setState(s => ({
      lines: s.lines.concat([{id: 'c-' + Date.now(), pid: 'combo', name: 'Promo Duo', opts: opts, unit: 35.90, n: 1, img: IMG.combo}]),
      screen: '13'
    }));
    this.flash('Agregado · Promo Duo (' + opts + ')');
  };`, 1);

rep(`      add: this.add(p.name),
      open: () => this.setState({screen: p.id === 'combo' ? '10' : '09'}),`,
`      img: IMG[p.id] || IMG_DEFAULT,
      add: this.add(p.id),
      open: () => this.setState({screen: p.id === 'combo' ? '10' : '09', sel: p.id, pres: 10, qty: 1, extraCheese: false, extraSauce: false}),`, 1);

rep(`    const basePrice = 16.00 + (st.extraCheese ? 3.00 : 0) + (st.extraSauce ? 2.00 : 0);
    const price = basePrice * st.qty;`,
String.raw`    // Producto abierto en el detalle (09)
    const dp = CATALOG.filter(x => x.id === st.sel)[0] || CATALOG[0];
    const dm = /20 unid\. S\/ ([\d.]+)/.exec(dp.desc || '');
    const dPrice20 = dm ? parseFloat(dm[1]) : null;
    const dHasSauce = ['Clásicos','Especiales','Pastelitos'].indexOf(dp.cat) > -1;
    const dBase = st.pres === 20 && dPrice20 ? dPrice20 : num(dp.price);
    const basePrice = dBase + (st.extraCheese ? 3.00 : 0) + (st.extraSauce ? 2.00 : 0);
    const price = basePrice * st.qty;`, 1);

rep(`    const results = CATALOG.filter(p => !q || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().indexOf(q.replace('tequeños de queso','tequeños')) > -1);`,
`    const resultsRaw = CATALOG.filter(p => !q || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().indexOf(q) > -1);
    const results = st.sortTop ? resultsRaw.slice().sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)) : resultsRaw;`, 1);

rep(`    const total = sub + (st.lines.length ? 5.90 : 0) - (st.applied && st.lines.length ? 2 : 0);`,
`    const isPickup = st.mode === 'pickup';
    const fee = st.lines.length ? (isPickup ? 0 : STORE.fee) : 0;
    const disc = st.applied && st.lines.length ? 2 : 0;
    const total = sub + fee - disc;
    const cartCount = st.lines.reduce((a, l) => a + l.n, 0);
    const addrLine = st.addr === 'Casa' ? 'Av. Bolognesi 845, Tacna' : 'Calle Zela 320, Tacna';
    // Último pedido confirmado (o el de ejemplo RTQ-2048 mientras no se confirme ninguno)
    const lo = st.lastOrder || {id: 'RTQ-2048', lines: ORDER_LINES['RTQ-2048'], sub: 52.90, fee: 5.90, disc: 0, total: 58.80, mode: 'delivery', addr: 'Casa', addrLine: 'Av. Bolognesi 845, Tacna', pay: 'Yape / Plin (captura por WhatsApp)', eta: '7:47 p. m.'};
    const loSummary = lo.lines.map(l => l.n + ' ' + l.name).join(' + ');`, 1);

rep(`      cart: st.cart, toast: st.toast,`,
`      cart: cartCount, cartCount: cartCount, toast: st.toast,
      toastTap: () => { if (st.toastGo) this.setState({screen: '13', toast: '', toastGo: false}); },
      toastCta: st.toastGo ? 'Ver carrito ›' : '',
      showCartBar: st.lines.length > 0 && ['06','07','08','11','12'].indexOf(scr) > -1,
      cartBarTotal: money(total),
      cartEmpty: st.lines.length === 0, cartHas: st.lines.length > 0,
      continueCart: () => this.setState({screen: st.lines.length ? '16' : '08'}),
      feeName: isPickup ? 'Recojo en tienda' : 'Delivery', feeLabel: money(fee),
      openStatus: STORE.hours, storeAddr: STORE.addr,
      repeatLast: this.reorder('RTQ-1987'),
      menuSub: (st.cat === 'Todos' ? 'Toda la carta' : st.cat) + ' · ' + menu.length + (menu.length === 1 ? ' producto' : ' productos'),
      searchChips: [
        this.chip('Más pedidos', st.sortTop, () => this.setState(s => ({sortTop: !s.sortTop}))),
        this.chip('Tequeños', q === 'tequeños', () => this.setState({query: 'tequeños'})),
        this.chip('Promos', q === 'promo', () => this.setState({query: 'promo'})),
        this.chip('Pizzas', q === 'pizza', () => this.setState({query: 'pizza'})),
        this.chip('Bebidas', q === 'bebidas', () => this.setState({query: 'bebidas'}))
      ],
      dImg: IMG[dp.id] || IMG_DEFAULT, dName: dp.name, dRating: dp.rating, dTag: dp.qty,
      dSub: dp.qty + ' · ' + dp.desc, dHasSauce: dHasSauce, dHasPres: !!dPrice20,
      dPres: [{label: '10 unid.', price: num(dp.price), v: 10}, {label: '20 unid.', price: dPrice20 || 0, v: 20}].map(x => ({
        label: x.label, price: money(x.price), pick: () => this.setState({pres: x.v}),
        bd: st.pres === x.v ? P.coral : '#EFE6D6', bg: st.pres === x.v ? '#FFF8F6' : '#fff', fg: st.pres === x.v ? P.dark : '#242424'
      })),
      confirmMode: () => this.setState({screen: isPickup ? '17' : '14'}),
      entregaLine: isPickup ? 'Recojo en ' + STORE.addr : st.addr + ' · ' + addrLine,
      entregaSub: isPickup ? 'Listo en 20–25 min · pagas al retirar o por Yape' : 'Delivery · 35–45 min · ' + money(STORE.fee),
      driverNotes: st.driverNotes, onDriverNotes: (e) => this.setState({driverNotes: e.target.value}),
      comboNotes: st.comboNotes, onComboNotes: (e) => this.setState({comboNotes: e.target.value}),
      payBtn: 'CONFIRMAR PEDIDO · ' + money(total),
      showYape: /Yape|Plin|Transferencia/.test(st.pay), yapeNumber: STORE.yape,
      eta: lo.eta, etaTitle: lo.mode === 'pickup' ? 'LISTO PARA RECOGER' : 'LLEGA A LAS',
      etaSub: lo.mode === 'pickup' ? 'En aprox. 20–25 minutos' : 'En aprox. 35 minutos',
      notifyLine: lo.mode === 'pickup' ? 'Te avisamos por WhatsApp cuando tu pedido esté listo para recoger' : 'Te avisamos por WhatsApp cuando el motorizado esté cerca',
      orderId: lo.id, orderSummary: loSummary, orderSubtotal: money(lo.sub), orderTotal: money(lo.total),
      orderFeeName: lo.mode === 'pickup' ? 'Recojo en ' + STORE.addr : 'Delivery a ' + lo.addrLine, orderFee: money(lo.fee),
      orderPayShort: /Yape|Plin/.test(lo.pay) ? 'Yape ✓' : (/Transfer/.test(lo.pay) ? 'Transferencia' : (lo.mode === 'pickup' ? 'Pago en tienda' : 'Efectivo')),`, 1);

rep(`      go07: this.go('07'), go08: this.go('08'), go10: this.go('10'), go12: this.go('12'),`,
    `      go07: this.go('07'), go08: this.go('08'), go10: this.go('10'), go12: this.go('12'), go23: this.go('23'),`, 1);

rep(`      cartItems: st.lines.map((l, i) => ({
        name: l.name, opts: l.opts, n: l.n, total: 'S/ ' + (l.unit * l.n).toFixed(2),`,
`      cartItems: st.lines.map((l, i) => ({
        name: l.name, opts: l.opts, n: l.n, img: l.img || IMG_DEFAULT, total: 'S/ ' + (l.unit * l.n).toFixed(2),`, 1);
rep(`        edit: () => this.setState({screen: l.id === 'combo' ? '10' : '09'})`,
    `        edit: () => this.setState({screen: l.pid === 'combo' ? '10' : '09', sel: l.pid || 'clasicos'})`, 1);

rep(`      applyCoupon: () => { this.setState({applied: true}); this.flash('Cupón RETE10 aplicado'); },
      applyLabel: st.applied ? 'Aplicado' : 'Aplicar',`,
`      applyCoupon: () => { const on = !st.applied; this.setState({applied: on}); this.flash(on ? 'Cupón RETE10 aplicado' : 'Cupón quitado'); },
      applyLabel: st.applied ? 'Quitar' : 'Aplicar',`, 1);

rex(/      pay: \(\) => \{\n        this\.flash\('¡Pedido enviado! Pagarás al recibir'\);[\s\S]*?\} catch\(e\) \{\}\n      \},/,
`      pay: () => {
        const ordId = 'RTQ-' + (2050 + Math.floor(Math.random() * 200));
        const etaDate = new Date(Date.now() + (isPickup ? 22 : 35) * 60000);
        const order = {id: ordId, lines: st.lines.slice(), sub: sub, fee: fee, disc: disc, total: total, mode: st.mode, addr: st.addr, addrLine: addrLine, pay: st.pay, eta: fmtTime(etaDate), notes: st.driverNotes};
        this.flash(/Yape|Plin|Transferencia/.test(st.pay) ? '¡Pedido enviado! Envíanos la captura del pago' : (isPickup ? '¡Pedido enviado! Te avisamos cuando esté listo' : '¡Pedido enviado! Pagarás al recibir'));
        this.setState({screen: '19', lastOrder: order, lines: [], applied: false, driverNotes: '', hist: 'En curso'});
        try {
          fetch('/api/pedidos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: ordId,
              customer: 'Milton Flores (App)',
              phone: '952741852',
              address: isPickup ? 'Recojo en tienda · ' + STORE.addr : addrLine,
              items: st.lines.map(l => ({name: l.name + (l.opts ? ' (' + l.opts + ')' : ''), qty: l.n, price: l.unit, sauces: l.opts})),
              subtotal: sub, deliveryFee: fee, discount: disc, total: total,
              payMethod: st.pay || 'Pago contraentrega (Efectivo)',
              notes: (st.driverNotes ? st.driverNotes + ' · ' : '') + 'Pedido enviado desde la app.' + (isPickup ? ' Recojo en tienda.' : '')
            })
          }).catch(function(){});
        } catch(e) {}
      },`, 1);

rex(/      orders: \(st\.hist === 'En curso'[\s\S]*?again: \(\) => \{ this\.setState\(s => \(\{cart: s\.cart \+ 2\}\)\); this\.flash\('Pedido ' \+ o\[0\] \+ ' agregado al carrito'\); \}\n      \}\)\),/,
`      orders: (st.hist === 'En curso'
        ? [[lo.id, 'En camino', 'Hoy · llega ' + lo.eta, money(lo.total), P.coral, '#FFE9E9']]
        : [['RTQ-1987','Entregado','12 ago. 2026','S/ 45.90','#1F9D62','#E4F4EC'],
           ['RTQ-1904','Entregado','29 jul. 2026','S/ 21.90','#1F9D62','#E4F4EC']]
      ).map(o => ({
        id: o[0], status: o[1], date: o[2], total: o[3], stFg: o[4], stBg: o[5],
        detail: () => this.setState({screen: o[1] === 'En camino' ? '20' : '22'}),
        again: this.reorder(o[0])
      })),`, 1);

rep(`      orderAgain: () => { this.setState(s => ({cart: s.cart + 3, screen: '13'})); this.flash('RTQ-1987 agregado al carrito'); },`,
    `      orderAgain: this.reorder('RTQ-1987'),`, 1);

/* ===================== 19. PISTAS del prototipo ===================== */
rep(`  '06':'Toca +, los chips, el banner o el buscador.',`, `  '06':'Toca +, el estado del local, "Repetir" tu último pedido, los chips o el buscador. La barra "Ver carrito" aparece cuando hay productos.',`, 1);
rep(`  '07':'Escribe “tequeños”, “pizza” o “promo”. Toca el corazón.',`, `  '07':'Escribe o usa los chips de sugerencia. "Más pedidos" ordena por valoración. Toca el corazón.',`, 1);
rep(`  '09':'Elige salsa, ajusta cantidad y agrega al carrito.',`, `  '09':'Muestra el producto que tocaste (foto real). Elige 10 o 20 unidades, salsa, extras y cantidad.',`, 1);
rep(`  '13':'Aplica el cupón y ajusta cantidades; el total se recalcula.',`, `  '13':'Aplica o quita el cupón, ajusta cantidades o vacía el carrito (estado vacío). Continuar lleva a la modalidad.',`, 1);
rep(`  '14':'Elige entre Casa y Trabajo, o agrega una nueva.',`, `  '14':'Solo aparece si elegiste delivery. Elige Casa o Trabajo, o agrega una nueva.',`, 1);
rep(`  '16':'“Programar pedido” habilita fecha y franja horaria.',`, `  '16':'Delivery pide dirección; Recojo salta directo al resumen y el delivery cuesta S/ 0.',`, 1);
rep(`  '17':'Toca Método de pago para cambiarlo. Pagar lleva a la confirmación.',`, `  '17':'Muestra las líneas y totales reales del carrito. Escribe instrucciones; Confirmar genera el pedido.',`, 1);
rep(`  '19':'El badge de pago cambia según el método elegido en la pantalla 18.',`, `  '19':'Número de pedido, hora estimada y montos salen del pedido que acabas de confirmar.',`, 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK app');
