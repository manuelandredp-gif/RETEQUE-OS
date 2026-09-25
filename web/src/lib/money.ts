export function roundMoney(amount: number): number {
  return Math.round((Number(amount || 0) + Number.EPSILON) * 100) / 100;
}

export function formatMoney(amount: number): string {
  return `S/ ${roundMoney(amount).toFixed(2)}`;
}
