export interface CategoryItem {
  id: string;
  name: string;
  path: string;
  iconName: 'LayoutGrid' | 'Percent' | 'Tequeño' | 'Pastelito' | 'Pizza' | 'Cup' | 'Utensils';
}

export const CATEGORIES = [
  { id: 'todo', name: 'Todo', path: '/', icon: 'LayoutGrid' },
  { id: 'promociones', name: 'Promociones', path: '/promociones', icon: 'Percent' },
  { id: 'tequenos', name: 'Tequeños', path: '/tequenos', icon: 'Tequeño' },
  { id: 'pastelitos', name: 'Pastelitos', path: '/pastelitos', icon: 'Pastelito' },
  { id: 'pizzas', name: 'Pizzas', path: '/pizzas', icon: 'Pizza' },
  { id: 'bebidas', name: 'Bebidas', path: '/bebidas', icon: 'Cup' },
  { id: 'cremas', name: 'Cremas', path: '/cremas', icon: 'Bowl' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
