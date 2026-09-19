export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

/** Celular peruano: 9 dígitos que empiezan en 9 (acepta prefijo 51). */
export function isValidPeruMobile(value: string): boolean {
  const digits = normalizePhone(value);
  return /^9\d{8}$/.test(digits) || /^519\d{8}$/.test(digits);
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 3;
}
