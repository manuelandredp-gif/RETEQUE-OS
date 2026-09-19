export type PromotionCategory = 'tequenos' | 'pizza-tequenos' | 'familiares';

/** Reglas explícitas de cada promo para el configurador (qué se elige y cuánto). */
export interface PromoConfig {
  /** Cantidad de tequeños a repartir entre sabores (0 = la promo no lleva tequeños). */
  tequenos: number;
  /** Cantidad de pizzas familiares cuyo sabor se elige. */
  pizzas: number;
  /** Cremas de 2 oz incluidas. */
  creams: number;
  /** Si la promo incluye una bebida a elegir. */
  drink: boolean;
}

export interface Promotion {
  id: string;
  slug: string;
  name: string;
  category: PromotionCategory;
  description: string;
  items: string[];
  price: number;
  image: string;
  badge?: string;
  featuredHome?: boolean;
  romanticPhrase?: string;
  config: PromoConfig;
}

export const PROMOTIONS: Promotion[] = [
  // Destacadas en el inicio:
  {
    id: 'promo-solo-para-mi',
    slug: 'promo-solo-para-mi',
    name: 'Promo Solo para mí',
    category: 'tequenos',
    description: '10 tequeños de queso + 2 cremas + 1 gaseosa 1/2 L',
    items: ['10 tequeños de queso', '2 cremas', '1 gaseosa 1/2 L'],
    price: 19.90,
    image: '/assets/promos/promo-solo-para-mi.jpg',
    badge: 'Promo',
    featuredHome: true,
    romanticPhrase: 'Pequeños antojos, grandes momentos ♡',
    config: { tequenos: 10, pizzas: 0, creams: 2, drink: true },
  },
  {
    id: 'promo-extra',
    slug: 'promo-extra',
    name: 'Promo Extra',
    category: 'tequenos',
    description: '20 tequeños (2 sabores) + 2 cremas + 1 gaseosa 1/2 L',
    items: ['20 tequeños (2 sabores)', '2 cremas', '1 gaseosa 1/2 L'],
    price: 32.90,
    image: '/assets/promos/promo-extra.jpg',
    badge: 'Promo',
    featuredHome: true,
    romanticPhrase: 'Más sabor para seguir disfrutando ♡',
    config: { tequenos: 20, pizzas: 0, creams: 2, drink: true },
  },
  {
    id: 'promo-familiar',
    slug: 'promo-familiar',
    name: 'Promo Familiar',
    category: 'familiares',
    description: '40 tequeños (4 sabores) + 4 cremas + 1 gaseosa 2L',
    items: ['40 tequeños (4 sabores)', '4 cremas', '1 gaseosa 2L'],
    price: 63.90,
    image: '/assets/promos/promo-familiar.jpg',
    badge: 'Promo',
    featuredHome: true,
    romanticPhrase: 'La mejor comida sabe mejor en familia ♡',
    config: { tequenos: 40, pizzas: 0, creams: 4, drink: true },
  },

  // Resto de promociones:
  {
    id: 'promo-antojo-criollo',
    slug: 'antojo-criollo',
    name: 'Antojo Criollo',
    category: 'tequenos',
    description: '10 mini empanaditas de ají de gallina, lomo saltado y queso + 1 Coca Cola 600 ml + 2 cremas',
    items: ['10 mini empanaditas de ají de gallina, lomo saltado y queso', '1 Coca Cola 600 ml', '2 cremas'],
    price: 19.90,
    image: '/assets/promos/antojo-criollo.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 0, creams: 2, drink: true },
  },
  {
    id: 'promo-sazon-antojo',
    slug: 'sazon-y-antojo',
    name: 'Sazón & Antojo',
    category: 'familiares',
    description: '20 mini tequeños de queso + 20 mini empanaditas de ají de gallina, lomo saltado y queso + 1 Pepsi 1L + 4 cremas',
    items: ['20 mini tequeños de queso', '20 mini empanaditas (ají gallina, lomo, queso)', '1 Pepsi 1L', '4 cremas'],
    price: 47.90,
    image: '/assets/promos/sazon-antojo.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 0, creams: 4, drink: true },
  },
  {
    id: 'promo-duo',
    slug: 'promo-duo',
    name: 'Promo Dúo',
    category: 'tequenos',
    description: '20 tequeños (2 sabores) + 2 cremas + 2 gaseosas 1/2 L',
    items: ['20 tequeños (2 sabores)', '2 cremas', '2 gaseosas 1/2 L'],
    price: 35.90,
    image: '/assets/promos/promo-duo.jpg',
    badge: 'Promo',
    config: { tequenos: 20, pizzas: 0, creams: 2, drink: true },
  },
  {
    id: 'promo-tequepizza',
    slug: 'promo-tequepizza',
    name: 'Promo Tequepizza',
    category: 'pizza-tequenos',
    description: '1 pizza familiar 35 cm + 5 tequeños de queso + 1 gaseosa 1L',
    items: ['1 pizza familiar 35 cm', '5 tequeños de queso', '1 gaseosa 1L'],
    price: 43.90,
    image: '/assets/promos/promo-tequepizza.jpg',
    badge: 'Promo',
    config: { tequenos: 5, pizzas: 1, creams: 1, drink: true },
  },
  {
    id: 'promo-bocaditos-felicidad',
    slug: 'bocaditos-de-felicidad',
    name: 'Bocaditos de Felicidad',
    category: 'familiares',
    description: '20 mini tequeños de queso + 20 mini empanaditas (carne, pollo y queso/jamón) + 3 cremas',
    items: ['20 mini tequeños de queso', '20 mini empanaditas (carne, pollo, jamón/queso)', '3 cremas'],
    price: 36.90,
    image: '/assets/promos/bocaditos-de-felicidad.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 0, creams: 3, drink: false },
  },
  {
    id: 'promo-fiesta-sabor',
    slug: 'fiesta-de-sabor',
    name: 'Fiesta de Sabor',
    category: 'familiares',
    description: '20 tequeños de queso + 20 mini empanaditas (carne, pollo y queso/jamón) + 3 cremas',
    items: ['20 tequeños de queso', '20 mini empanaditas (carne, pollo, jamón/queso)', '3 cremas'],
    price: 43.90,
    image: '/assets/promos/fiesta-de-sabor.jpg',
    badge: 'Promo',
    config: { tequenos: 20, pizzas: 0, creams: 3, drink: false },
  },
  {
    id: 'promo-mundo-sabores',
    slug: 'mundo-de-sabores',
    name: 'Mundo de Sabores',
    category: 'pizza-tequenos',
    description: '1 pizza familiar (elige sabor) + 20 mini tequeños de queso + 1 Pepsi 1L + 2 cremas',
    items: ['1 pizza familiar (elige sabor)', '20 mini tequeños de queso', '1 Pepsi 1L', '2 cremas'],
    price: 51.90,
    image: '/assets/promos/mundo-de-sabores.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 1, creams: 2, drink: true },
  },
  {
    id: 'promo-sabor-sin-limites',
    slug: 'sabor-sin-limites',
    name: 'Sabor Sin Límites',
    category: 'pizza-tequenos',
    description: '1 pizza familiar (elige sabor) + 20 mini empanaditas mixtas (carne, pollo, jamón/queso) + 1 Pepsi 1L + 3 cremas',
    items: ['1 pizza familiar (elige sabor)', '20 mini empanaditas mixtas', '1 Pepsi 1L', '3 cremas'],
    price: 54.90,
    image: '/assets/promos/sabor-sin-limites.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 1, creams: 3, drink: true },
  },
  {
    id: 'promo-doble-tentacion',
    slug: 'la-doble-tentacion',
    name: 'La Doble Tentación',
    category: 'pizza-tequenos',
    description: '1 pizza Hawaiana familiar + 20 tequeños de jamón y queso + 2 cremas',
    items: ['1 pizza Hawaiana familiar', '20 tequeños de jamón y queso', '2 cremas'],
    price: 53.90,
    image: '/assets/promos/la-doble-tentacion.jpg',
    badge: 'Promo',
    config: { tequenos: 20, pizzas: 1, creams: 2, drink: false },
  },
  {
    id: 'promo-doble-placer',
    slug: 'doble-placer',
    name: 'Doble Placer',
    category: 'pizza-tequenos',
    description: '2 pizzas familiares (elige sabor) + 1 Pepsi 1L + 2 cremas',
    items: ['2 pizzas familiares (elige sabor)', '1 Pepsi 1L', '2 cremas'],
    price: 64.90,
    image: '/assets/promos/doble-placer.jpg',
    badge: 'Promo',
    config: { tequenos: 0, pizzas: 2, creams: 2, drink: true },
  },
];
