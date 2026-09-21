// Limpieza de textos residuales tras el parche principal: pantalla 18 (pago) es solo para recojo,
// y el título/pista de la pantalla 20 aún describían el tracking de delivery eliminado.
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
    log.push('FAIL (' + n + (expect === null ? '' : ' != ' + expect) + '): ' + find.slice(0, 90));
    failed = true;
    return;
  }
  s = parts.join(replace);
  log.push('ok x' + n + ': ' + find.slice(0, 70));
}

rep("  '16':['Lote 16 · Modalidad y horario','Delivery o recojo'],",
    "  '16':['Lote 16 · Modalidad','Delivery por WhatsApp o recojo en tienda'],", 1);
rep("  '20':['Lote 20 · Seguimiento','Pedido RTQ-2048 en camino'],",
    "  '20':['Lote 20 · Estado del pedido','Solo para recojo en tienda'],", 1);

rep("  '16':'Delivery pide dirección; Recojo salta directo al resumen y el delivery cuesta S/ 0.',",
    "  '16':'Delivery no pide nada aquí: se coordina todo por WhatsApp. Recojo permite elegir horario.',", 1);
rep("  '20':'La moto recorre la ruta; el timeline marca el estado actual.',",
    "  '20':'Sin mapa ni moto: son los pasos de preparación del pedido para recojo (demo).',", 1);

rep("        ['Pago contraentrega (Efectivo)','Pagas en efectivo al repartidor al recibir · lleva sencillo','EFEC'],\n        ['Yape / Plin (captura por WhatsApp)','Yapeas ahora y nos envías la captura; verificamos y preparamos','YAPE'],\n        ['Transferencia BCP / Banco de la Nación','Transfieres y envías el comprobante por WhatsApp','TRANSF'],\n        ['Recojo en local (Efectivo/Yape)','Pagas en tienda al retirar tus tequeños','LOCAL']",
    "        ['Efectivo al recoger','Pagas en tienda al retirar tu pedido','EFEC'],\n        ['Yape / Plin (captura por WhatsApp)','Yapeas ahora y nos envías la captura; verificamos y preparamos','YAPE'],\n        ['Transferencia BCP / Banco de la Nación','Transfieres y envías el comprobante por WhatsApp','TRANSF']", 1);

rep('🛵 <strong>Efectivo:</strong> el motorizado lleva sencillo y le pagas en tu puerta.<br>💳 <strong>Yape / Plin / transferencia:</strong> nos envías la captura por WhatsApp, la verificamos en minutos y empezamos a preparar.',
    '🏪 <strong>Efectivo:</strong> pagas al retirar tu pedido en tienda.<br>💳 <strong>Yape / Plin / transferencia:</strong> nos envías la captura por WhatsApp, la verificamos en minutos y empezamos a preparar.', 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK fix2');
