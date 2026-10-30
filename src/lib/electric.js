// Residential retail tariff, MoIT Decision 1279/QĐ-BCT (effective 10/05/2025), VND/kWh before VAT.
// The 5-tier structure in Decision 14/2025/QĐ-TTg is not yet applied to bills; switch here when it is.
export const ELECTRIC_TIERS = [
  { from: 0, to: 50, price: 1984 },
  { from: 51, to: 100, price: 2050 },
  { from: 101, to: 200, price: 2380 },
  { from: 201, to: 300, price: 2998 },
  { from: 301, to: 400, price: 3350 },
  { from: 401, to: Infinity, price: 3460 }
];

export function electricBill(kwh, vat = 0.08) {
  let left = Math.max(0, kwh);
  let prev = 0;
  const rows = ELECTRIC_TIERS.map((t, i) => {
    const cap = t.to === Infinity ? Infinity : t.to - prev;
    const used = Math.min(left, cap);
    left -= used;
    prev = t.to;
    return { tier: i + 1, kwh: used, price: t.price, amount: used * t.price };
  });
  const subtotal = rows.reduce((s, r) => s + r.amount, 0);
  const tax = subtotal * vat;
  return { rows, subtotal, tax, total: subtotal + tax };
}

// Inverse of electricBill (monotonic), by bisection.
export function kwhFromBill(total, vat = 0.08) {
  let lo = 0, hi = 100000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (electricBill(mid, vat).total < total) lo = mid; else hi = mid;
  }
  return lo;
}
