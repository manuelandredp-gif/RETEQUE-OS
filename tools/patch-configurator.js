// Aplica las mejoras al configurador de promos (web/src/components/configurator/ProductConfiguratorModal.tsx)
// Uso: tools\node.cmd tools\patch-configurator.js
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'web', 'src', 'components', 'configurator', 'ProductConfiguratorModal.tsx');
let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const log = [];
let failed = false;

function rep(find, replace, expect) {
  const parts = s.split(find);
  const n = parts.length - 1;
  if (expect !== null && n !== expect) {
    log.push('FAIL (' + n + ' != ' + expect + '): ' + find.slice(0, 80).replace(/\n/g, '\\n'));
    failed = true;
    return;
  }
  if (n === 0) { log.push('FAIL (0): ' + find.slice(0, 80)); failed = true; return; }
  s = parts.join(replace);
  log.push('ok x' + n + ': ' + find.slice(0, 60).replace(/\n/g, '\\n'));
}

function rex(re, replace, expect) {
  const m = s.match(re) || [];
  if (expect !== null && m.length !== expect) {
    log.push('FAIL regex (' + m.length + ' != ' + expect + '): ' + String(re).slice(0, 80));
    failed = true;
    return;
  }
  s = s.replace(re, () => replace);
  log.push('ok regex x' + m.length + ': ' + String(re).slice(0, 60));
}

// 1. Imports: enlace universal de WhatsApp y tipo de configuración de promo
rep("import { siteConfig } from '../../config/site';",
    "import { openWhatsApp } from '../../lib/whatsapp';\nimport type { PromoConfig } from '../../data/promotions';", 1);

// 2. Reglas de la promo desde datos (con respaldo por texto)
rex(/  const isPromo = Boolean\(productOrPromo\?\.items[\s\S]*?const targetCreams = isPromo[\s\S]*?: 2;\n/,
`  const isPromo = Boolean(productOrPromo?.items || productOrPromo?.badge === 'Promo');
  const promoConfig: PromoConfig | undefined = isPromo ? productOrPromo?.config : undefined;
  const isDirectPizza = productOrPromo?.category === 'pizzas';
  const sniff = (text: string | undefined, needle: string) =>
    Boolean(text && text.toLowerCase().includes(needle));
  const itemsText: string = Array.isArray(productOrPromo?.items) ? productOrPromo.items.join(' ') : '';

  // Reglas explícitas de la promo (data/promotions.ts). Si faltan, se deducen del texto.
  const hasTequeños = promoConfig
    ? promoConfig.tequenos > 0
    : !isDirectPizza &&
      (productOrPromo?.category === 'tequenos' ||
        sniff(productOrPromo?.name, 'tequeño') ||
        sniff(productOrPromo?.description, 'tequeño') ||
        sniff(itemsText, 'tequeño'));

  const hasPizza = promoConfig
    ? promoConfig.pizzas > 0
    : isDirectPizza ||
      sniff(productOrPromo?.name, 'pizza') ||
      sniff(productOrPromo?.description, 'pizza') ||
      sniff(itemsText, 'pizza');

  const targetPizzasCount = promoConfig
    ? promoConfig.pizzas
    : hasPizza
    ? sniff(productOrPromo?.name, 'doble') || sniff(productOrPromo?.description, '2 pizza')
      ? 2
      : 1
    : 0;

  const targetTequeños = promoConfig
    ? promoConfig.tequenos
    : hasTequeños
    ? sniff(productOrPromo?.description, '40')
      ? 40
      : sniff(productOrPromo?.description, '20') || sniff(productOrPromo?.name, 'extra') || sniff(productOrPromo?.name, 'dúo')
      ? 20
      : sniff(productOrPromo?.description, '5 tequeño')
      ? 5
      : 10
    : 0;

  const targetCreams = promoConfig
    ? promoConfig.creams
    : isPromo
    ? sniff(productOrPromo?.description, '4 crema')
      ? 4
      : sniff(productOrPromo?.description, '3 crema')
      ? 3
      : 2
    : 2;

  const includesDrink = promoConfig ? promoConfig.drink : isPromo;
`, 1);

// 3. WhatsApp con enlace universal
rex(/    const message = buildWhatsAppMessage\(\);[\s\S]*?window\.open\(url, '_blank', 'noopener,noreferrer'\);/,
    '    openWhatsApp(buildWhatsAppMessage());', 1);

// 4. La bebida solo aparece si la promo la incluye
rep('isPromo && selectedDrink', 'includesDrink && selectedDrink', null);
rep("            {/* STEP: Drinks (if promo) */}\n            {isPromo && (",
    "            {/* STEP: Drinks (only when the promo includes one) */}\n            {includesDrink && (", 1);

// 5. Clases de Tailwind que no existían y tipado del acordeón
rep('shadow-xs', 'shadow-sm', null);
rep('active:scale-98', 'active:scale-[0.98]', null);
rep("'' as any", "''", null);
rep("useState<'pizzas' | 'receta' | 'cremas' | 'bebida' | 'agranda'>('receta')",
    "useState<'pizzas' | 'receta' | 'cremas' | 'bebida' | 'agranda' | ''>('receta')", 1);
rep('animate-in fade-in zoom-in duration-200', 'fade-in', 1);
rep('animate-in fade-in duration-200', 'fade-in', 1);

// 6. En celular: pasos primero, resumen después
rep('<div className="lg:col-span-5 space-y-4">', '<div className="lg:col-span-5 space-y-4 order-2 lg:order-1">', 1);
rep('<div className="lg:col-span-7 space-y-4">', '<div className="lg:col-span-7 space-y-4 order-1 lg:order-2">', 1);

// 7. Accesibilidad: rol de diálogo y cierre con Escape
rep('    <div\n      className="fixed inset-0 z-[9999] w-screen h-screen',
    '    <div\n      role="dialog"\n      aria-modal="true"\n      aria-label={productOrPromo.name}\n      className="fixed inset-0 z-[9999] w-screen h-screen', 1);
rep(`  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);`,
`  // Bloquea el scroll del fondo y cierra con Escape mientras el modal está abierto
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);`, 1);

// 8. Imágenes del catálogo con carga diferida
rep('className="w-10 h-10 object-cover rounded-lg shrink-0 border border-neutral-200"',
    'className="w-10 h-10 object-cover rounded-lg shrink-0 border border-neutral-200"\n                                  loading="lazy"', 1);

fs.writeFileSync(file, s);
console.log(log.join('\n'));
if (failed) { console.log('\nHUBO FALLOS'); process.exit(1); }
console.log('\nOK configurador');
