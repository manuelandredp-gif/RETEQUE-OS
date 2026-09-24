// ===================================================
// RETEQUEÑOS APP MOVIL - DATOS & CONFIGURACION OFICIAL
// ===================================================

const P = {coral:'#FF3038', dark:'#D91F2A', gold:'#F5A623', cream:'#FFF8EE', char:'#242424', gray:'#6B6662'};

// Datos del local (configurables; el horario y la dirección deben confirmarse con Retequeños)
const STORE = {name:'Retequeños', addr:'Calle Alto Lima 1488, Tacna', hours:'Abierto hoy · delivery hasta 11:00 p. m.', fee:0, yape:'912 266 950', whatsapp:'51912266950'};

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
};

const RAIL = [
  ['01','Lanzamiento'],['02','Bienvenida'],['03','Inicio de sesión'],['04','Crear cuenta'],
  ['05','Recuperar contraseña'],['06','Inicio'],['07','Búsqueda'],['08','Menú'],
  ['09','Detalle de producto'],['10','Personalizar combo'],['11','Favoritos'],['12','Promociones'],
  ['13','Carrito'],['16','Modalidad'],
  ['17','Resumen de compra'],['18','Método de pago'],['19','Pedido confirmado'],['20','Seguimiento'],
  ['21','Historial'],['22','Detalle y valoración'],['23','Notificaciones'],['24','Perfil'],
  ['25','Configuración'],['26','Estados excepcionales']
];

const TITLES = {
  '01':['Lote 01 · Pantalla de lanzamiento','Carga inicial, sin controles'],
  '02':['Lote 02 · Bienvenida','Última pantalla de onboarding'],
  '03':['Lote 03 · Inicio de sesión','Acceso con correo y proveedores'],
  '04':['Lote 04 · Creación de cuenta','Formulario de registro'],
  '05':['Lote 05 · Recuperación de contraseña','Enlace por correo'],
  '06':['Lote 06 · Inicio principal','Descubrimiento y accesos rápidos'],
  '07':['Lote 07 · Búsqueda de productos','Escribe para filtrar resultados'],
  '08':['Lote 08 · Menú por categorías','Catálogo completo'],
  '09':['Lote 09 · Detalle de producto','Salsa, cantidad y carrito'],
  '10':['Lote 10 · Personalización','Relleno, 2 salsas y notas'],
  '11':['Lote 11 · Favoritos','Colección guardada'],
  '12':['Lote 12 · Promociones y cupones','Cupón copiable y condiciones'],
  '13':['Lote 13 · Carrito','Dos productos, cupón y desglose'],
  '16':['Lote 16 · Modalidad','Delivery por WhatsApp o recojo en tienda'],
  '17':['Lote 17 · Resumen de compra','Checkout final'],
  '18':['Lote 18 · Método de pago','Selección segura'],
  '19':['Lote 19 · Pedido confirmado','Estado de éxito'],
  '20':['Lote 20 · Estado del pedido','Solo para recojo en tienda'],
  '21':['Lote 21 · Historial de pedidos','En curso y anteriores'],
  '22':['Lote 22 · Detalle y valoración','RTQ-1987 entregado · encuesta y cupón'],
  '23':['Lote 23 · Notificaciones','Centro de avisos'],
  '24':['Lote 24 · Perfil del cliente','Accesos de cuenta'],
  '25':['Lote 25 · Configuración','Preferencias y privacidad'],
  '26':['Lote 26 · Estados excepcionales','Android: sin conexión · iOS: búsqueda vacía']
};

const HINTS = {
  '01':'Avanza automáticamente a la bienvenida.',
  '02':'“COMENZAR” u “Omitir” llevan al Inicio.',
  '03':'Los textos cambian entre Android e iOS según el plan.',
  '04':'Registro con prefijo +51 y medidor de contraseña.',
  '05':'“ENVIAR ENLACE” muestra la confirmación.',
  '06':'Toca +, el estado del local, "Repetir" tu último pedido, los chips o el buscador. La barra "Ver carrito" aparece cuando hay productos.',
  '07':'Escribe o usa los chips de sugerencia. "Más pedidos" ordena por valoración. Toca el corazón.',
  '08':'Cambia de categoría y abre cualquier producto.',
  '09':'Muestra el producto que tocaste (foto real). Elige 10 o 20 unidades, salsa, extras y cantidad.',
  '10':'Máximo 2 salsas: la tercera selección se bloquea.',
  '11':'Quita un favorito con el corazón.',
  '12':'Copia el cupón y abre las condiciones.',
  '13':'Aplica o quita el cupón, ajusta cantidades o vacía el carrito (estado vacío). Continuar lleva a la modalidad.',
  '16':'Delivery no pide nada aquí: se coordina todo por WhatsApp. Recojo permite elegir horario.',
  '17':'Muestra las líneas y totales reales del carrito. Escribe instrucciones; Confirmar genera el pedido.',
  '18':'Sin pasarela: efectivo, Yape/Plin o transferencia con captura por WhatsApp.',
  '19':'Número de pedido, hora estimada y montos salen del pedido que acabas de confirmar.',
  '20':'Sin mapa ni moto: son los pasos de preparación del pedido para recojo (demo).',
  '21':'Cambia entre “En curso” y “Anteriores”.',
  '22':'Califica, marca qué mejorar y dónde nos viste; 4-5★ invita a Google Reviews. Enviar da el cupón ENCUESTA3.',
  '23':'“Marcar todo como leído” apaga los puntos.',
  '24':'Los accesos llevan a favoritos, promociones y configuración.',
  '25':'Los switches y la acción destructiva son funcionales.',
  '26':'Cambia de plataforma: Android muestra sin conexión, iOS búsqueda vacía.'
};

// Carta oficial Retequeños 2026 (precios en soles). Tequeños: precio de 10 unid.; el de 20 unid. va en la descripción.
const CATALOG = [
  {id:'clasicos', name:'Tequeños de queso', qty:'10 unidades', price:'S/ 16.00', cat:'Clásicos', desc:'Queso fundido · 20 unid. S/ 27.00', rating:'4.8'},
  {id:'combo', name:'Promo Duo', qty:'20 unid. + 2 gaseosas', price:'S/ 35.90', cat:'Combos', desc:'20 tequeños (2 sabores) + 2 cremas + 2 gaseosas ½ L', rating:'4.9'},
  {id:'jamon', name:'Tequeños de jamón y queso', qty:'10 unidades', price:'S/ 16.00', cat:'Clásicos', desc:'Jamón y queso · 20 unid. S/ 28.00', rating:'4.7'},
  {id:'dulces', name:'Tequeños de chocolate', qty:'10 unidades', price:'S/ 17.00', cat:'Especiales', desc:'Chocolate · 20 unid. S/ 31.00', rating:'4.6'},
  {id:'tocino', name:'Tequeños de tocino y queso', qty:'10 unidades', price:'S/ 17.00', cat:'Clásicos', desc:'Tocino y queso · 20 unid. S/ 29.00', rating:'4.7'},
  {id:'hotdog', name:'Tequeños de hotdog y queso', qty:'10 unidades', price:'S/ 16.00', cat:'Clásicos', desc:'Hotdog y queso · 20 unid. S/ 28.00', rating:'4.6'},
  {id:'tresquesos', name:'Tequeños tres quesos', qty:'10 unidades', price:'S/ 17.00', cat:'Clásicos', desc:'Tres quesos · 20 unid. S/ 28.00', rating:'4.7'},
  {id:'ajigallina', name:'Tequeños de ají de gallina', qty:'10 unidades', price:'S/ 17.00', cat:'Especiales', desc:'Ají de gallina · 20 unid. S/ 29.00', rating:'4.8'},
  {id:'oregano', name:'Tequeños de queso con masa de orégano', qty:'10 unidades', price:'S/ 16.00', cat:'Especiales', desc:'Masa especial de orégano · 20 unid. S/ 27.00', rating:'4.6'},
  {id:'cheddar', name:'Tequeños de queso cheddar', qty:'10 unidades', price:'S/ 18.00', cat:'Especiales', desc:'Queso cheddar · 20 unid. S/ 34.00', rating:'4.7'},
  {id:'jamoncheddar', name:'Tequeños de jamón y cheddar', qty:'10 unidades', price:'S/ 19.00', cat:'Especiales', desc:'Jamón y cheddar · 20 unid. S/ 36.00', rating:'4.7'},
  {id:'promo-solo', name:'Promo Solo para Mí', qty:'10 unid. + 1 gaseosa', price:'S/ 19.90', cat:'Combos', desc:'10 tequeños de queso + 2 cremas + 1 gaseosa ½ L', rating:'4.8'},
  {id:'promo-extra', name:'Promo Extra', qty:'20 unid. + 1 gaseosa', price:'S/ 32.90', cat:'Combos', desc:'20 tequeños (2 sabores) + 2 cremas + 1 gaseosa ½ L', rating:'4.8'},
  {id:'promo-familiar', name:'Promo Familiar', qty:'40 unid. + 1 gaseosa 2 L', price:'S/ 63.90', cat:'Combos', desc:'40 tequeños (4 sabores) + 4 cremas + 1 gaseosa 2 L', rating:'4.9'},
  {id:'promo-tequepizza', name:'Promo Tequepizza', qty:'1 pizza + 5 tequeños', price:'S/ 43.90', cat:'Combos', desc:'1 pizza familiar + 5 tequeños de queso + 1 crema + 1 gaseosa 1 L', rating:'4.8'},
  {id:'promo-antojo', name:'Promo Antojo Criollo', qty:'10 mini empanaditas', price:'S/ 19.90', cat:'Combos', desc:'Ají de gallina, lomo saltado y queso + 1 Coca Cola 600 ml + 2 cremas', rating:'4.7'},
  {id:'promo-sazon', name:'Promo Sazón & Antojo', qty:'20 mini tequeños + 20 mini empanaditas', price:'S/ 47.90', cat:'Combos', desc:'Mini tequeños de queso + mini empanaditas + 1 Pepsi 1 L + 4 cremas', rating:'4.8'},
  {id:'promo-bocados', name:'Promo Bocados de Felicidad', qty:'20 mini tequeños + 20 mini empanaditas', price:'S/ 36.90', cat:'Combos', desc:'Mini tequeños de queso + mini empanaditas (carne, pollo, queso/jamón) + 3 cremas', rating:'4.7'},
  {id:'promo-fiesta', name:'Promo Fiesta de Sabor', qty:'20 tequeños + 20 mini empanaditas', price:'S/ 43.90', cat:'Combos', desc:'Tequeños de queso + mini empanaditas (carne, pollo, queso/jamón) + 3 cremas', rating:'4.8'},
  {id:'promo-mundo', name:'Promo Mundo de Sabores', qty:'1 pizza + 20 mini tequeños', price:'S/ 51.90', cat:'Combos', desc:'1 pizza familiar + 20 mini tequeños de queso + 1 Pepsi 1 L + 2 cremas', rating:'4.8'},
  {id:'promo-sinlimites', name:'Promo Sabor sin Límites', qty:'1 pizza + 20 mini empanaditas', price:'S/ 54.90', cat:'Combos', desc:'1 pizza familiar + 20 mini empanaditas mixtas + 1 Pepsi 1 L + 3 cremas', rating:'4.8'},
  {id:'promo-tentacion', name:'Promo La Doble Tentación', qty:'1 pizza + 20 tequeños', price:'S/ 53.90', cat:'Combos', desc:'1 pizza hawaiana familiar + 20 tequeños de jamón/queso + 2 cremas', rating:'4.9'},
  {id:'promo-placer', name:'Promo Doble Placer', qty:'2 pizzas + 1 gaseosa', price:'S/ 64.90', cat:'Combos', desc:'2 pizzas familiares (elige sabor) + 1 Pepsi 1 L + 2 cremas', rating:'4.9'},
  {id:'pizza-americana', name:'Pizza Americana', qty:'Familiar 35 cm', price:'S/ 35.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella y jamón', rating:'4.7'},
  {id:'pizza-italiana', name:'Pizza Italiana', qty:'Familiar 35 cm', price:'S/ 38.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, jamón, aceituna negra, pollo y pimentón', rating:'4.8'},
  {id:'pizza-supermargarita', name:'Pizza Super Margarita', qty:'Familiar 35 cm', price:'S/ 36.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, jamón, pimentón y aceituna verde', rating:'4.7'},
  {id:'pizza-hawaiana', name:'Pizza La Hawaiana', qty:'Familiar 35 cm', price:'S/ 37.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, jamón y piña', rating:'4.8'},
  {id:'pizza-peperoni', name:'Pizza Full Peperoni', qty:'Familiar 35 cm', price:'S/ 38.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, peperoni y jamón', rating:'4.8'},
  {id:'pizza-especial', name:'Pizza La Especial', qty:'Familiar 35 cm', price:'S/ 39.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, pimentón, tocino ahumado, champiñones y queso parmesano', rating:'4.9'},
  {id:'pizza-espanola', name:'Pizza Española', qty:'Familiar 35 cm', price:'S/ 38.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, chorizo, pimentón y aceituna verde', rating:'4.7'},
  {id:'pizza-vegetariana', name:'Pizza Vegetariana', qty:'Familiar 35 cm', price:'S/ 36.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, aceituna verde y negra, pimentón y champiñón', rating:'4.6'},
  {id:'pizza-oriental', name:'Pizza Oriental', qty:'Familiar 35 cm', price:'S/ 37.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, piña y pollo', rating:'4.7'},
  {id:'pizza-primavera', name:'Pizza Primavera', qty:'Familiar 35 cm', price:'S/ 35.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, jamón y maíz', rating:'4.6'},
  {id:'pizza-margarita', name:'Pizza Margarita', qty:'Familiar 35 cm', price:'S/ 34.00', cat:'Pizzas', desc:'Salsa de tomate, mozarella, tomate y aceite de oliva', rating:'4.6'},
  {id:'pizza-adicional', name:'Adicional para pizza', qty:'1 ingrediente', price:'S/ 3.00', cat:'Pizzas', desc:'Maíz, champiñones, jamón, queso parmesano, tocino o aceituna verde', rating:'4.5'},
  {id:'pastel-queso', name:'Pastelito de queso', qty:'1 unidad', price:'S/ 3.50', cat:'Pastelitos', desc:'Pastelito relleno de queso', rating:'4.6'},
  {id:'pastel-jamonqueso', name:'Pastelito de jamón y queso', qty:'1 unidad', price:'S/ 4.00', cat:'Pastelitos', desc:'Pastelito relleno de jamón y queso', rating:'4.6'},
  {id:'pastel-pizza', name:'Pastelito de pizza', qty:'1 unidad', price:'S/ 4.50', cat:'Pastelitos', desc:'Pastelito relleno sabor pizza', rating:'4.6'},
  {id:'pastel-pollo', name:'Pastelito de pollo deshilachado', qty:'1 unidad', price:'S/ 4.50', cat:'Pastelitos', desc:'Pastelito relleno de pollo deshilachado', rating:'4.7'},
  {id:'pastel-carne', name:'Pastelito de carne deshilachada', qty:'1 unidad', price:'S/ 4.50', cat:'Pastelitos', desc:'Pastelito relleno de carne deshilachada', rating:'4.7'},
  {id:'limonada', name:'Limonada', qty:'½ litro', price:'S/ 8.00', cat:'Bebidas', desc:'Refresco natural · 1 litro S/ 15.00', rating:'4.5'},
  {id:'chicha', name:'Chicha morada', qty:'½ litro', price:'S/ 8.00', cat:'Bebidas', desc:'Refresco natural · 1 litro S/ 15.00', rating:'4.6'},
  {id:'cocacola', name:'Coca Cola', qty:'600 ml', price:'S/ 5.00', cat:'Bebidas', desc:'Gaseosa personal', rating:'4.5'},
  {id:'inkakola', name:'Inka Kola', qty:'600 ml', price:'S/ 5.00', cat:'Bebidas', desc:'Gaseosa personal', rating:'4.5'},
  {id:'pepsi1l', name:'Pepsi', qty:'1 litro', price:'S/ 6.00', cat:'Bebidas', desc:'Gaseosa para compartir', rating:'4.4'},
  {id:'pepsi2l', name:'Pepsi', qty:'2 litros', price:'S/ 8.00', cat:'Bebidas', desc:'Gaseosa familiar', rating:'4.4'},
  {id:'agua', name:'Agua', qty:'Botella', price:'S/ 4.50', cat:'Bebidas', desc:'Agua mineral', rating:'4.3'},
  {id:'infusiones', name:'Infusiones', qty:'1 taza', price:'S/ 3.50', cat:'Bebidas', desc:'Infusión caliente', rating:'4.3'},
  {id:'tartara', name:'Crema adicional', qty:'2 oz', price:'S/ 2.00', cat:'Salsas', desc:'Mayonesa de ajo, salsa tocino, mayopalta o ají especial', rating:'4.6'}
];


// Export to window for global access
window.P = P;
window.STORE = STORE;
window.IMG_DEFAULT = IMG_DEFAULT;
window.IMG = IMG;
window.num = num;
window.money = money;
window.fmtTime = fmtTime;
window.ORDER_LINES = ORDER_LINES;
window.RAIL = RAIL;
window.TITLES = TITLES;
window.HINTS = HINTS;
window.MOBILE_CATALOG = CATALOG;

window.MOBILE_DATA = {
  P, STORE, IMG_DEFAULT, IMG, num, money, fmtTime, ORDER_LINES, RAIL, TITLES, HINTS, CATALOG
};
