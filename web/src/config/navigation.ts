export const NAV_LINKS = [
  { id: 'todo', label: 'Todo el menú', path: '/' },
  { id: 'promociones', label: 'Promociones', path: '/promociones' },
  { id: 'tequenos', label: 'Tequeños', path: '/tequenos' },
  { id: 'pizzas', label: 'Pizzas familiares 35 cm', path: '/pizzas' },
  { id: 'bebidas', label: 'Bebidas', path: '/bebidas' },
  { id: 'pastelitos', label: 'Pastelitos', path: '/pastelitos' },
  { id: 'cremas', label: 'Cremas', path: '/cremas' },
] as const;

export type NavLinkItem = (typeof NAV_LINKS)[number];
