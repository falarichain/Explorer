const TOKEN_UNIT = 100_000_000;

export function formatGF(amount: number): string {
  const whole = Math.floor(amount / TOKEN_UNIT);
  const frac = amount % TOKEN_UNIT;
  if (frac === 0) return `${whole} GF`;
  const s = `${whole}.${frac.toString().padStart(8, '0')}`.replace(/0+$/, '');
  return `${s} GF`;
}
