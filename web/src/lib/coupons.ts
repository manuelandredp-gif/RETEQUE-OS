// ===================================================
// MOTOR DE CUPONES Y PROMOCIONES WEB (SINCRONIZADO CON ADMIN Y APP)
// ===================================================

export interface CouponRule {
  code: string;
  name: string;
  type: 'fixed' | 'percent';
  value: number; // Monto fijo en Soles o porcentaje (ej: 10 para 10%)
  minOrder: number;
}

export const ACTIVE_COUPONS: CouponRule[] = [
  { code: 'BIENVENIDO10', name: 'Bienvenida nuevos clientes (-S/ 5.00)', type: 'fixed', value: 5.0, minOrder: 20.0 },
  { code: 'RETE10', name: '10% OFF en tu pedido', type: 'percent', value: 10, minOrder: 20.0 },
  { code: 'FIESTA20', name: '20% OFF Fiesta', type: 'percent', value: 20, minOrder: 50.0 },
  { code: 'DEMANDA15', name: '15% OFF Horario especial', type: 'percent', value: 15, minOrder: 25.0 },
  { code: 'ENCUESTA3', name: 'Cupón por encuesta (-S/ 3.00)', type: 'fixed', value: 3.0, minOrder: 15.0 },
];

export interface ValidationResult {
  valid: boolean;
  message: string;
  discount: number;
  rule?: CouponRule;
}

export function validateCoupon(rawCode: string, subtotal: number): ValidationResult {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) {
    return { valid: false, message: 'Ingresa un código de cupón', discount: 0 };
  }

  const rule = ACTIVE_COUPONS.find((c) => c.code === code);
  if (!rule) {
    return { valid: false, message: `El cupón "${code}" no es válido o ha expirado`, discount: 0 };
  }

  if (subtotal < rule.minOrder) {
    return {
      valid: false,
      message: `El cupón "${code}" requiere un pedido mínimo de S/ ${rule.minOrder.toFixed(2)}`,
      discount: 0,
      rule,
    };
  }

  let discount = 0;
  if (rule.type === 'fixed') {
    discount = Math.min(rule.value, subtotal);
  } else if (rule.type === 'percent') {
    discount = Math.round(((subtotal * rule.value) / 100 + Number.EPSILON) * 100) / 100;
  }

  return {
    valid: true,
    message: `¡Cupón "${rule.code}" aplicado con éxito! Descuento: S/ ${discount.toFixed(2)}`,
    discount,
    rule,
  };
}
