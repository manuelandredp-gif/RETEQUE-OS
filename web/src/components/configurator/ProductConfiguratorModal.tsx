import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Bike,
  Store,
  X,
  Pizza as PizzaIcon,
  Sparkles,
} from 'lucide-react';
import { formatMoney } from '../../lib/money';
import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import { openWhatsApp } from '../../lib/whatsapp';
import type { PromoConfig } from '../../data/promotions';

interface ProductConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productOrPromo: any;
  onOpenCartDrawer?: () => void;
}

// Available flavors for tequeños
const TEQUEÑO_FLAVORS = [
  { id: 'queso', name: 'Tequeños de Queso', image: '/assets/products/tequenos/queso.jpg' },
  { id: 'jamon-queso', name: 'Tequeños Jamón y Queso', image: '/assets/products/tequenos/jamon-queso.jpg' },
  { id: 'tocino-queso', name: 'Tequeños Tocino y Queso', image: '/assets/products/tequenos/tocino-queso.jpg' },
  { id: 'hotdog-queso', name: 'Tequeños Hotdog y Queso', image: '/assets/products/tequenos/hotdog-queso.jpg' },
  { id: 'tres-quesos', name: 'Tequeños Tres Quesos', image: '/assets/products/tequenos/tres-quesos.jpg' },
  { id: 'aji-gallina', name: 'Ají de Gallina Criollo', image: '/assets/products/tequenos/aji-de-gallina.jpg' },
  { id: 'queso-cheddar', name: 'Queso Cheddar', image: '/assets/products/tequenos/queso-cheddar.jpg' },
];

// Available pizza flavors
const PIZZA_FLAVORS = [
  { id: 'americana', name: 'Americana (Jamón y Mozarella)', image: '/assets/products/pizzas/americana.jpg' },
  { id: 'peperoni', name: 'Full Peperoni (Mozarella y Peperoni)', image: '/assets/products/pizzas/full-peperoni.jpg' },
  { id: 'hawaiana', name: 'La Hawaiana (Jamón, Mozarella y Piña)', image: '/assets/products/pizzas/la-hawaiana.jpg' },
  { id: 'italiana', name: 'Italiana (Pollo, Jamón, Aceituna)', image: '/assets/products/pizzas/italiana.jpg' },
  { id: 'la-especial', name: 'La Especial (Tocino, Champiñones, Parmesano)', image: '/assets/products/pizzas/la-especial.jpg' },
  { id: 'super-margarita', name: 'Super Margarita (Tomate, Mozarella, Pimentón)', image: '/assets/products/pizzas/super-margarita.jpg' },
];

// Available creams
const CREAMS = [
  { id: 'mayonesa-ajo', name: 'Mayonesa de ajo (2 oz)', image: '/assets/products/cremas/mayonesa-ajo.jpg' },
  { id: 'salsa-tocino', name: 'Salsa tocino (2 oz)', image: '/assets/products/cremas/salsa-tocino.jpg' },
  { id: 'mayopalta', name: 'Mayopalta (2 oz)', image: '/assets/products/cremas/mayopalta.jpg' },
  { id: 'aji-especial', name: 'Ají especial (2 oz)', image: '/assets/products/cremas/aji-especial.jpg' },
];

// Available drinks
const DRINKS = [
  { id: 'inka-cola-600', name: 'Inka Cola 600 ml', extraPrice: 0, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'coca-cola-600', name: 'Coca-Cola 600 ml', extraPrice: 0, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'pepsi-1l', name: 'Pepsi 1 Litro', extraPrice: 2.00, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
  { id: 'chicha-morada', name: 'Chicha Morada Artesanal 1/2 L', extraPrice: 3.00, image: '/assets/products/bebidas/coca-cola-600ml.jpg' },
];

// Extra upgrades
const UPGRADES = [
  { id: 'extra-10-queso', name: '10 Tequeños de Queso adicionales', price: 16.00, image: '/assets/products/tequenos/queso.jpg' },
  { id: 'extra-pastelito-queso', name: 'Pastelito de Queso crujiente', price: 3.50, image: '/assets/promos/antojo-criollo.jpg' },
  { id: 'extra-pastelito-jamon', name: 'Pastelito Jamón y Queso', price: 4.00, image: '/assets/promos/antojo-criollo.jpg' },
  { id: 'extra-crema-mayo', name: 'Crema Mayonesa de ajo extra 2 oz', price: 2.00, image: '/assets/products/cremas/mayonesa-ajo.jpg' },
  { id: 'extra-crema-tocino', name: 'Crema Salsa tocino extra 2 oz', price: 2.00, image: '/assets/products/cremas/salsa-tocino.jpg' },
  { id: 'extra-crema-palta', name: 'Crema Mayopalta extra 2 oz', price: 2.00, image: '/assets/products/cremas/mayopalta.jpg' },
  { id: 'extra-crema-aji', name: 'Crema Ají especial extra 2 oz', price: 2.00, image: '/assets/products/cremas/aji-especial.jpg' },
];

export const ProductConfiguratorModal: React.FC<ProductConfiguratorModalProps> = ({
  isOpen,
  onClose,
  productOrPromo,
  onOpenCartDrawer,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const { fullName, phone, deliveryType, address, reference, generalNotes, setField } = useCheckoutStore();

  const isPromo = Boolean(productOrPromo?.items || productOrPromo?.badge === 'Promo');
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

  // Selected presentation for regular tequeños
  const [selectedPresentation, setSelectedPresentation] = useState<string>('10 unid.');
  const [quantity, setQuantity] = useState(1);

  // Pizza flavor selection (array of flavor ids up to targetPizzasCount)
  const [selectedPizzaFlavors, setSelectedPizzaFlavors] = useState<string[]>(['americana']);

  // Flavors selection for tequeños
  const [flavorCounts, setFlavorCounts] = useState<Record<string, number>>({});

  // Creams selection
  const [creamCounts, setCreamCounts] = useState<Record<string, number>>({
    'mayonesa-ajo': 1,
    'salsa-tocino': 1,
  });

  // Drink selection
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('inka-cola-600');

  // Upgrades selection
  const [upgradeCounts, setUpgradeCounts] = useState<Record<string, number>>({});

  // Accordion active step
  const [openSection, setOpenSection] = useState<'pizzas' | 'receta' | 'cremas' | 'bebida' | 'agranda' | ''>('receta');

  // WhatsApp checkout prompt
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});

  // Bloquea el scroll del fondo y cierra con Escape mientras el modal está abierto
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
  }, [isOpen, onClose]);

  // Sync state when productOrPromo changes
  useEffect(() => {
    if (productOrPromo) {
      if (hasPizza) {
        if (targetPizzasCount === 2) {
          setSelectedPizzaFlavors(['americana', 'peperoni']);
        } else {
          setSelectedPizzaFlavors(['americana']);
        }
        setOpenSection(hasPizza && !hasTequeños ? 'pizzas' : 'receta');
      } else {
        setOpenSection('receta');
      }

      if (hasTequeños && targetTequeños > 0) {
        if (targetTequeños === 40) {
          setFlavorCounts({ queso: 10, 'jamon-queso': 10, 'tocino-queso': 10, 'hotdog-queso': 10 });
        } else if (targetTequeños === 20) {
          setFlavorCounts({ queso: 10, 'jamon-queso': 10 });
        } else {
          setFlavorCounts({ queso: targetTequeños });
        }
      } else {
        setFlavorCounts({});
      }

      if (targetCreams === 4) {
        setCreamCounts({ 'mayonesa-ajo': 2, 'salsa-tocino': 1, mayopalta: 1 });
      } else if (targetCreams === 3) {
        setCreamCounts({ 'mayonesa-ajo': 1, 'salsa-tocino': 1, mayopalta: 1 });
      } else {
        setCreamCounts({ 'mayonesa-ajo': 1, 'salsa-tocino': 1 });
      }

      setUpgradeCounts({});
      setQuantity(1);
    }
  }, [productOrPromo, targetTequeños, targetPizzasCount, hasPizza, hasTequeños, targetCreams]);

  if (!isOpen || !productOrPromo) return null;

  // Base price calculation
  const basePrice = isPromo
    ? productOrPromo.price
    : selectedPresentation === '20 unid.' && productOrPromo.presentations?.[1]
    ? productOrPromo.presentations[1].price
    : productOrPromo.presentations?.[0]?.price || productOrPromo.basePrice || 0;

  const totalSelectedTequeños = Object.values(flavorCounts).reduce((a, b) => a + b, 0);
  const isFlavorsCompleted = !hasTequeños || totalSelectedTequeños === targetTequeños;

  const totalSelectedCreams = Object.values(creamCounts).reduce((a, b) => a + b, 0);
  const isCreamsCompleted = totalSelectedCreams === targetCreams;

  const upgradesCost = Object.entries(upgradeCounts).reduce((sum, [upId, count]) => {
    const item = UPGRADES.find((u) => u.id === upId);
    return sum + (item ? item.price * count : 0);
  }, 0);

  const selectedDrink = DRINKS.find((d) => d.id === selectedDrinkId) || DRINKS[0];
  const drinkExtraCost = includesDrink && selectedDrink ? selectedDrink.extraPrice : 0;

  const unitFinalPrice = basePrice + drinkExtraCost + upgradesCost;
  const grandTotalPrice = unitFinalPrice * quantity;

  // Stepper handlers for tequeños
  const handleFlavorDelta = (flavorId: string, delta: number) => {
    const step = targetTequeños >= 20 ? 10 : 5;
    const actualDelta = delta * step;
    const current = flavorCounts[flavorId] || 0;
    const nextVal = current + actualDelta;
    if (nextVal < 0) return;

    const newTotal = totalSelectedTequeños + actualDelta;
    if (delta > 0 && newTotal > targetTequeños) return;

    setFlavorCounts((prev) => {
      const next = { ...prev };
      if (nextVal === 0) {
        delete next[flavorId];
      } else {
        next[flavorId] = nextVal;
      }
      return next;
    });
  };

  // Stepper handlers for creams
  const handleCreamDelta = (creamId: string, delta: number) => {
    const current = creamCounts[creamId] || 0;
    const nextVal = current + delta;
    if (nextVal < 0) return;

    const newTotal = totalSelectedCreams + delta;
    if (delta > 0 && newTotal > targetCreams) return;

    setCreamCounts((prev) => {
      const next = { ...prev };
      if (nextVal === 0) {
        delete next[creamId];
      } else {
        next[creamId] = nextVal;
      }
      return next;
    });
  };

  // Upgrades handler
  const handleUpgradeDelta = (upgradeId: string, delta: number) => {
    const current = upgradeCounts[upgradeId] || 0;
    const nextVal = current + delta;
    if (nextVal < 0) return;

    setUpgradeCounts((prev) => {
      const next = { ...prev };
      if (nextVal === 0) {
        delete next[upgradeId];
      } else {
        next[upgradeId] = nextVal;
      }
      return next;
    });
  };

  // Pizza flavor toggle handler
  const handleSelectPizzaFlavor = (flavorId: string, slotIndex: number) => {
    setSelectedPizzaFlavors((prev) => {
      const updated = [...prev];
      updated[slotIndex] = flavorId;
      return updated;
    });
  };

  const flavorsSummaryText = hasTequeños
    ? Object.entries(flavorCounts)
        .map(([id, count]) => {
          const fl = TEQUEÑO_FLAVORS.find((f) => f.id === id);
          return `${fl?.name || id} x ${count} un`;
        })
        .join(', ') || 'Pendiente de selección'
    : 'No incluye';

  const pizzasSummaryText = hasPizza
    ? selectedPizzaFlavors
        .map((id, idx) => {
          const pz = PIZZA_FLAVORS.find((f) => f.id === id);
          return `Pizza ${idx + 1}: ${pz?.name.split(' (')[0] || id}`;
        })
        .join(', ')
    : '';

  const creamsSummaryText = Object.entries(creamCounts)
    .map(([id, count]) => {
      const cr = CREAMS.find((c) => c.id === id);
      return `${cr?.name.replace(' (2 oz)', '') || id} x ${count}`;
    })
    .join(', ') || 'Pendiente de selección';

  const upgradesCountTotal = Object.values(upgradeCounts).reduce((a, b) => a + b, 0);

  // Generate WhatsApp message with 100% Retequeños branding
  const buildWhatsAppMessage = () => {
    const lines: string[] = [
      '🧀 *¡HOLA RETEQUEÑOS!* 👋',
      '',
      'Quiero realizar el siguiente pedido personalizado:',
      '',
      `📦 *${quantity} x ${productOrPromo.name}* — ${formatMoney(grandTotalPrice)}`,
    ];

    if (productOrPromo.description) {
      lines.push(`   📝 ${productOrPromo.description}`);
    }

    if (hasPizza) {
      lines.push('');
      lines.push(`🍕 *PIZZAS FAMILIARES 35 CM:*`);
      selectedPizzaFlavors.forEach((id, idx) => {
        const pz = PIZZA_FLAVORS.find((f) => f.id === id);
        lines.push(`   • Pizza ${idx + 1}: ${pz?.name || id}`);
      });
    }

    if (hasTequeños && targetTequeños > 0) {
      lines.push('');
      lines.push(`👉 *SABORES DE TEQUEÑOS (${totalSelectedTequeños} unid.):*`);
      Object.entries(flavorCounts).forEach(([id, count]) => {
        const fl = TEQUEÑO_FLAVORS.find((f) => f.id === id);
        lines.push(`   • ${count} un. de ${fl?.name || id}`);
      });
    }

    lines.push('');
    lines.push(`🥣 *CREMAS INCLUIDAS (${totalSelectedCreams} unid.):*`);
    Object.entries(creamCounts).forEach(([id, count]) => {
      const cr = CREAMS.find((c) => c.id === id);
      lines.push(`   • ${count} x ${cr?.name || id}`);
    });

    if (includesDrink && selectedDrink) {
      lines.push('');
      lines.push(`🥤 *BEBIDA ELEGIDA:*`);
      lines.push(`   • ${selectedDrink.name}${selectedDrink.extraPrice > 0 ? ` (+${formatMoney(selectedDrink.extraPrice)})` : ''}`);
    }

    if (upgradesCountTotal > 0) {
      lines.push('');
      lines.push(`➕ *ADICIONALES MARCADOS:*`);
      Object.entries(upgradeCounts).forEach(([id, count]) => {
        const up = UPGRADES.find((u) => u.id === id);
        if (up) {
          lines.push(`   • ${count} x ${up.name} (+${formatMoney(up.price * count)})`);
        }
      });
    }

    lines.push('');
    lines.push(`💰 *TOTAL PEDIDO:* ${formatMoney(grandTotalPrice)}`);
    lines.push(`🚚 *TIPO DE ENTREGA:* ${deliveryType === 'delivery' ? 'Delivery (por confirmar)' : 'Recojo en tienda (S/ 0.00)'}`);
    lines.push('');
    lines.push('👤 *DATOS DEL CLIENTE:*');
    lines.push(`• Nombre: ${fullName || 'No especificado'}`);
    lines.push(`• Celular: ${phone || 'No especificado'}`);

    if (deliveryType === 'delivery') {
      lines.push(`• Dirección: ${address || 'No especificada'}`);
      if (reference) {
        lines.push(`• Referencia: ${reference}`);
      }
    }

    if (generalNotes) {
      lines.push(`• Indicaciones: ${generalNotes}`);
    }

    lines.push('');
    lines.push('Deseo confirmar disponibilidad, delivery y realizar el pago por Yape/Plin/Transferencia. ¡Gracias!');

    return lines.join('\n');
  };

  const handleComprarAhora = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleModalConfirmWhatsApp = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Ingresa tu nombre completo';
    if (!phone.trim()) errs.phone = 'Ingresa tu número de celular';
    if (deliveryType === 'delivery' && !address.trim()) errs.address = 'Ingresa tu dirección para el delivery';

    if (Object.keys(errs).length > 0) {
      setCheckoutErrors(errs);
      return;
    }

    setCheckoutErrors({});
    setIsCheckoutModalOpen(false);

    openWhatsApp(buildWhatsAppMessage());
  };

  const handleAddToCart = () => {
    const optionsList: string[] = [];

    if (hasPizza) {
      optionsList.push(`Pizzas: ${pizzasSummaryText}`);
    }
    if (hasTequeños && targetTequeños > 0) {
      optionsList.push(`Tequeños: ${flavorsSummaryText}`);
    }
    optionsList.push(`Cremas: ${creamsSummaryText}`);
    if (includesDrink && selectedDrink) {
      optionsList.push(`Bebida: ${selectedDrink.name}`);
    }
    Object.entries(upgradeCounts).forEach(([id, cnt]) => {
      const up = UPGRADES.find((u) => u.id === id);
      if (up) optionsList.push(`${cnt}x ${up.name}`);
    });

    addItem({
      productId: productOrPromo.id,
      name: `${productOrPromo.name}`,
      image: productOrPromo.image,
      quantity,
      unitPrice: unitFinalPrice,
      selectedPresentation: hasPizza && !hasTequeños ? 'Familiar 35 cm' : undefined,
      selectedOptions: optionsList,
      notes: generalNotes || undefined,
    });

    onClose();
    if (onOpenCartDrawer) {
      onOpenCartDrawer();
    }
  };

  // Render modal in portal directly into document.body to prevent any stacking context / backdrop cut bugs!
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={productOrPromo.name}
      className="fixed inset-0 z-[9999] w-screen h-screen bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-neutral-200 flex flex-col my-auto">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div>
            <span className="text-xs font-bold text-[#C5161D] bg-[#FFF0F1] px-2.5 py-1 rounded-full uppercase tracking-wider">
              {isPromo ? 'Combo Promocional Retequeños' : 'Personaliza tu Producto'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
              {productOrPromo.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Split Layout */}
        <div className="p-4 sm:p-6 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1">
          {/* LEFT: Photo & Summary */}
          <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-sm border border-neutral-200 bg-[#C5161D]">
              <img
                src={productOrPromo.image}
                alt={productOrPromo.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-neutral-900">
                {formatMoney(basePrice)}
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                {productOrPromo.description}
              </p>
            </div>

            {/* Presentation selector if item has presentations */}
            {productOrPromo.presentations && productOrPromo.presentations.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-neutral-700">Presentación:</span>
                <div className="flex gap-2">
                  {productOrPromo.presentations.map((p: any) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPresentation(p.label)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        selectedPresentation === p.label
                          ? 'border-[#C5161D] bg-[#FFF0F1] text-[#C5161D]'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {p.label} ({formatMoney(p.price)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* "Personaliza tu pedido" summary box */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                Resumen de personalización
              </h3>

              <div className="divide-y divide-neutral-200/70 text-xs">
                {hasPizza && (
                  <div className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900">Pizzas seleccionadas</div>
                      <div className="text-neutral-500 truncate mt-0.5">{pizzasSummaryText}</div>
                    </div>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-[#E8F8EE] text-[#16B959]">
                      Completado
                    </span>
                  </div>
                )}

                {hasTequeños && targetTequeños > 0 && (
                  <div className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900">Sabores de tequeños</div>
                      <div className="text-neutral-500 truncate mt-0.5">{flavorsSummaryText}</div>
                    </div>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                        isFlavorsCompleted
                          ? 'bg-[#E8F8EE] text-[#16B959]'
                          : 'bg-[#FFF0F1] text-[#C5161D]'
                      }`}
                    >
                      {isFlavorsCompleted ? 'Completado' : `Faltan ${targetTequeños - totalSelectedTequeños}`}
                    </span>
                  </div>
                )}

                <div className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-neutral-900">Cremas incluidas</div>
                    <div className="text-neutral-500 truncate mt-0.5">{creamsSummaryText}</div>
                  </div>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      isCreamsCompleted
                        ? 'bg-[#E8F8EE] text-[#16B959]'
                        : 'bg-[#FFF0F1] text-[#C5161D]'
                    }`}
                  >
                    {isCreamsCompleted ? 'Completado' : `Faltan ${targetCreams - totalSelectedCreams}`}
                  </span>
                </div>

                {includesDrink && selectedDrink && (
                  <div className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-neutral-900">Bebida</div>
                      <div className="text-neutral-500 truncate mt-0.5">{selectedDrink.name}</div>
                    </div>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-[#E8F8EE] text-[#16B959]">
                      Completado
                    </span>
                  </div>
                )}

                <div className="py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-neutral-900">Adicionales</div>
                    <div className="text-neutral-500 truncate mt-0.5">
                      {upgradesCountTotal > 0 ? `${upgradesCountTotal} extra (+${formatMoney(upgradesCost)})` : 'Sin adicionales'}
                    </div>
                  </div>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                    Opcional
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Accordion Steps */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            {/* STEP: Pizzas (if promo or product includes pizza) */}
            {hasPizza && (
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'pizzas' ? '' : 'pizzas')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF0F1] flex items-center justify-center text-[#C5161D]">
                      <PizzaIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm sm:text-base text-neutral-900">
                        {targetPizzasCount === 2 ? 'Elige los Sabores de tus 2 Pizzas' : 'Elige el Sabor de tu Pizza Familiar (35 cm)'}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {pizzasSummaryText}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E8F8EE] text-[#16B959] font-bold text-xs px-2.5 py-1 rounded">
                      Completado
                    </span>
                    {openSection === 'pizzas' ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </div>
                </button>

                {openSection === 'pizzas' && (
                  <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
                    {Array.from({ length: targetPizzasCount }).map((_, slotIdx) => (
                      <div key={slotIdx} className="py-3 space-y-2">
                        <div className="text-xs font-bold text-neutral-700">
                          {targetPizzasCount === 2 ? `Sabor para Pizza #${slotIdx + 1}:` : 'Sabor de Pizza:'}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PIZZA_FLAVORS.map((flavor) => {
                            const isSelected = selectedPizzaFlavors[slotIdx] === flavor.id;
                            return (
                              <button
                                key={flavor.id}
                                type="button"
                                onClick={() => handleSelectPizzaFlavor(flavor.id, slotIdx)}
                                className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#C5161D] bg-[#FFF0F1] text-neutral-900 shadow-sm'
                                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                                }`}
                              >
                                <img
                                  src={flavor.image}
                                  alt={flavor.name}
                                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-neutral-200"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs leading-tight truncate">
                                    {flavor.name}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 mt-0.5">35 cm familiar</div>
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-[#C5161D] bg-[#C5161D]' : 'border-neutral-300'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP: Tequeños Flavors (only if hasTequeños) */}
            {hasTequeños && targetTequeños > 0 && (
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'receta' ? '' : 'receta')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF0F1] flex items-center justify-center text-[#C5161D]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm sm:text-base text-neutral-900">
                        Elige los Sabores de tus Tequeños
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {totalSelectedTequeños}/{targetTequeños} unidades seleccionadas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-xs px-2.5 py-1 rounded ${
                        isFlavorsCompleted
                          ? 'bg-[#E8F8EE] text-[#16B959]'
                          : 'bg-[#FFF0F1] text-[#C5161D]'
                      }`}
                    >
                      {isFlavorsCompleted ? 'Completado' : `Faltan ${targetTequeños - totalSelectedTequeños}`}
                    </span>
                    {openSection === 'receta' ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </div>
                </button>

                {openSection === 'receta' && (
                  <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
                    {TEQUEÑO_FLAVORS.map((flavor) => {
                      const count = flavorCounts[flavor.id] || 0;
                      return (
                        <div key={flavor.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={flavor.image}
                              alt={flavor.name}
                              className="w-12 h-9 object-cover rounded-lg border border-neutral-200"
                            />
                            <span className="font-bold text-xs sm:text-sm text-neutral-900">
                              {flavor.name}
                            </span>
                          </div>

                          {count > 0 ? (
                            <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => handleFlavorDelta(flavor.id, -1)}
                                className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center font-black text-neutral-900 text-xs">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleFlavorDelta(flavor.id, 1)}
                                disabled={totalSelectedTequeños >= targetTequeños}
                                className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] disabled:opacity-40 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleFlavorDelta(flavor.id, 1)}
                              disabled={totalSelectedTequeños >= targetTequeños}
                              className="w-7 h-7 rounded-lg border border-neutral-200 hover:border-[#C5161D] text-neutral-500 hover:text-[#C5161D] flex items-center justify-center disabled:opacity-30 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP: Cremas */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'cremas' ? '' : 'cremas')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="font-black text-sm sm:text-base text-neutral-900">
                    Elige tus Cremas de 2 oz
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {totalSelectedCreams}/{targetCreams} cremas incluidas
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-xs px-2.5 py-1 rounded ${
                      isCreamsCompleted
                        ? 'bg-[#E8F8EE] text-[#16B959]'
                        : 'bg-[#FFF0F1] text-[#C5161D]'
                    }`}
                  >
                    {isCreamsCompleted ? 'Completado' : `Faltan ${targetCreams - totalSelectedCreams}`}
                  </span>
                  {openSection === 'cremas' ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </button>

              {openSection === 'cremas' && (
                <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
                  {CREAMS.map((cream) => {
                    const count = creamCounts[cream.id] || 0;
                    return (
                      <div key={cream.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={cream.image}
                            alt={cream.name}
                            className="w-10 h-8 object-contain rounded"
                          />
                          <span className="font-bold text-xs sm:text-sm text-neutral-900">
                            {cream.name}
                          </span>
                        </div>

                        {count > 0 ? (
                          <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleCreamDelta(cream.id, -1)}
                              className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-black text-neutral-900 text-xs">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCreamDelta(cream.id, 1)}
                              disabled={totalSelectedCreams >= targetCreams}
                              className="w-6 h-6 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold hover:bg-[#A3001E] disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCreamDelta(cream.id, 1)}
                            disabled={totalSelectedCreams >= targetCreams}
                            className="w-7 h-7 rounded-lg border border-neutral-200 hover:border-[#C5161D] text-neutral-500 hover:text-[#C5161D] flex items-center justify-center disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP: Drinks (only when the promo includes one) */}
            {includesDrink && (
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'bebida' ? '' : 'bebida')}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-neutral-900">
                      Elige el Sabor de tu Bebida
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{selectedDrink.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E8F8EE] text-[#16B959] font-bold text-xs px-2.5 py-1 rounded">
                      Completado
                    </span>
                    {openSection === 'bebida' ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </div>
                </button>

                {openSection === 'bebida' && (
                  <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100">
                    {DRINKS.map((drink) => {
                      const isSelected = selectedDrinkId === drink.id;
                      return (
                        <div
                          key={drink.id}
                          onClick={() => setSelectedDrinkId(drink.id)}
                          className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={drink.image}
                              alt={drink.name}
                              className="w-8 h-8 object-contain rounded"
                            />
                            <span className="font-bold text-xs sm:text-sm text-neutral-900">
                              {drink.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {drink.extraPrice > 0 && (
                              <span className="text-xs font-bold text-neutral-500">
                                +{formatMoney(drink.extraPrice)}
                              </span>
                            )}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#C5161D] bg-[#C5161D]' : 'border-neutral-300'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP: Adicionales y Extras */}
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'agranda' ? '' : 'agranda')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="font-black text-sm sm:text-base text-neutral-900">
                    Adicionales y Cremas Extra
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Elige porciones adicionales</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-neutral-300 text-neutral-700 font-bold text-xs px-2.5 py-1 rounded">
                    Opcional
                  </span>
                  {openSection === 'agranda' ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </div>
              </button>

              {openSection === 'agranda' && (
                <div className="p-4 pt-0 border-t border-neutral-100 divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                  {UPGRADES.map((upgrade) => {
                    const count = upgradeCounts[upgrade.id] || 0;
                    return (
                      <div key={upgrade.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={upgrade.image}
                            alt={upgrade.name}
                            className="w-9 h-7 object-cover rounded shrink-0 border border-neutral-100"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-neutral-900 truncate">
                              {upgrade.name}
                            </div>
                            <div className="text-[11px] font-bold text-neutral-500">
                              +{formatMoney(upgrade.price)}
                            </div>
                          </div>
                        </div>

                        {count > 0 ? (
                          <div className="inline-flex items-center bg-neutral-100 rounded-lg p-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleUpgradeDelta(upgrade.id, -1)}
                              className="w-5 h-5 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-neutral-900 text-xs">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpgradeDelta(upgrade.id, 1)}
                              className="w-5 h-5 flex items-center justify-center bg-[#C5161D] text-white rounded font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpgradeDelta(upgrade.id, 1)}
                            className="w-6 h-6 bg-[#C5161D] hover:bg-[#A3001E] text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Bottom Bar */}
        <div className="fixed sm:absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="inline-flex items-center border border-neutral-300 rounded-xl p-1 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-lg font-bold transition-colors"
                aria-label="Menos cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-black text-neutral-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center bg-[#C5161D] text-white rounded-lg font-bold hover:bg-[#A3001E] transition-colors"
                aria-label="Más cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:hidden text-right">
              <span className="text-[11px] text-neutral-500 block">Total</span>
              <span className="text-base font-black text-[#C5161D]">{formatMoney(grandTotalPrice)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-xl justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none sm:min-w-[170px] h-11 px-5 rounded-xl border-2 border-[#C5161D] text-[#C5161D] hover:bg-[#FFF0F1] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al pedido</span>
            </button>

            <button
              type="button"
              onClick={handleComprarAhora}
              className="flex-1 sm:flex-none sm:min-w-[210px] h-11 px-6 rounded-xl bg-[#C5161D] hover:bg-[#A3001E] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Pedir por WhatsApp ({formatMoney(grandTotalPrice)})</span>
            </button>
          </div>
        </div>

        {/* Customer Data Modal before WhatsApp */}
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[10010] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 fade-in text-left">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-black text-neutral-900">
                    Datos para tu pedido en Tacna
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Se enviará tu pedido detallado a nuestro WhatsApp oficial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Nombre completo <span className="text-[#C5161D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    placeholder="Ej. Milton Flores"
                    className={`w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      checkoutErrors.fullName ? 'border-[#C5161D] focus:ring-[#C5161D]/20' : 'border-neutral-200 focus:border-[#C5161D]'
                    }`}
                  />
                  {checkoutErrors.fullName && (
                    <p className="text-[11px] text-[#C5161D] mt-1">{checkoutErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    Celular / WhatsApp <span className="text-[#C5161D]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="Ej. 912 266 950"
                    className={`w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      checkoutErrors.phone ? 'border-[#C5161D] focus:ring-[#C5161D]/20' : 'border-neutral-200 focus:border-[#C5161D]'
                    }`}
                  />
                  {checkoutErrors.phone && (
                    <p className="text-[11px] text-[#C5161D] mt-1">{checkoutErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Tipo de entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setField('deliveryType', 'delivery')}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 font-bold cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'border-[#C5161D] bg-[#FFF0F1] text-[#C5161D]'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setField('deliveryType', 'recojo')}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 font-bold cursor-pointer ${
                        deliveryType === 'recojo'
                          ? 'border-[#C5161D] bg-[#FFF0F1] text-[#C5161D]'
                          : 'border-neutral-200 text-neutral-600'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Recojo en tienda</span>
                    </button>
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">
                      Dirección en Tacna <span className="text-[#C5161D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setField('address', e.target.value)}
                      placeholder="Ej. Av. San Martín 450, Tacna"
                      className={`w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        checkoutErrors.address ? 'border-[#C5161D] focus:ring-[#C5161D]/20' : 'border-neutral-200 focus:border-[#C5161D]'
                      }`}
                    />
                    {checkoutErrors.address && (
                      <p className="text-[11px] text-[#C5161D] mt-1">{checkoutErrors.address}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Order compact summary in modal */}
              <div className="bg-[#FFF8ED] border border-[#F5E4CE] rounded-2xl p-3.5 space-y-1.5 text-left text-xs">
                <div className="flex items-center justify-between font-black text-neutral-900 border-b border-[#F5E4CE]/80 pb-1.5">
                  <span>{quantity} x {productOrPromo.name}</span>
                  <span className="text-[#C5161D]">{formatMoney(grandTotalPrice)}</span>
                </div>
                {hasPizza && (
                  <p className="text-neutral-600">
                    <span className="font-bold">Pizzas:</span> {pizzasSummaryText}
                  </p>
                )}
                {hasTequeños && targetTequeños > 0 && (
                  <p className="text-neutral-600">
                    <span className="font-bold">Sabores:</span> {flavorsSummaryText}
                  </p>
                )}
                <p className="text-neutral-600">
                  <span className="font-bold">Cremas:</span> {creamsSummaryText}
                </p>
                {includesDrink && selectedDrink && (
                  <p className="text-neutral-600">
                    <span className="font-bold">Bebida:</span> {selectedDrink.name}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleModalConfirmWhatsApp}
                className="w-full h-12 bg-[#16B959] hover:bg-[#13A24D] text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Continuar a WhatsApp ({formatMoney(grandTotalPrice)})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
