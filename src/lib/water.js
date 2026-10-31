// Tính tiền nước sinh hoạt lũy tiến. Cập nhật 10/2026. Đơn giá đồng/m³, CHƯA VAT.
// - Hà Nội: QĐ 3541/QĐ-UBND ngày 07/7/2023 (áp dụng từ 01/01/2024), bậc theo m³/đồng hồ/tháng.
// - TP.HCM (vùng Sawaco, trước sáp nhập): lộ trình QĐ 25/2019/QĐ-UBND, giữ nguyên năm 2026; định mức theo người/tháng.
//   Giá dịch vụ thoát nước = 30% tiền nước chưa VAT, chịu VAT 8% đến 31/12/2026 (NQ 204/2025/QH15), sau đó 10%.
// - Hải Phòng: QĐ 05/2024/QĐ-UBND (hiệu lực 01/3/2024).
// - VAT nước sạch 5% (Luật Thuế GTGT 48/2024/QH15); phí BVMT nước thải 10% giá nước chưa VAT (NĐ 346/2025/NĐ-CP).

export const WATER_VAT = 0.05;

export const WATER_REGIONS = {
  hanoi: { tiers: [{ to: 10, price: 8500, poor: 5973 }, { to: 20, price: 9900 }, { to: 30, price: 16000 }, { to: Infinity, price: 27000 }], fee: 0.1 },
  hcm: { perPerson: true, tiers: [{ to: 4, price: 6700, poor: 6300 }, { to: 6, price: 12900 }, { to: Infinity, price: 14400 }], drainage: 0.3 },
  haiphong_urban: { tiers: [{ to: 10, price: 10900 }, { to: 20, price: 13500 }, { to: 30, price: 18000 }, { to: Infinity, price: 21500 }] },
  haiphong_rural: { tiers: [{ to: 10, price: 9000 }, { to: 20, price: 11500 }, { to: 30, price: 15000 }, { to: Infinity, price: 18000 }] }
};

export const CUSTOM_DEFAULT = [{ to: 10, price: 8000 }, { to: 20, price: 10000 }, { to: 30, price: 13000 }, { to: Infinity, price: 16000 }];

const num = (x, d = 0) => (Number.isFinite(Number(x)) ? Number(x) : d);

export function drainageVat(now = new Date()) {
  return now.getFullYear() <= 2026 ? 0.08 : 0.1;
}

// Chia bậc lũy tiến: tiers [{to, price}] với `to` tăng dần (ngưỡng tích lũy).
export function splitTiers(m3, tiers) {
  let left = Math.max(0, num(m3));
  let prev = 0;
  return tiers.map((t, i) => {
    const to = Math.max(prev, num(t.to, Infinity) || 0);
    const cap = to === Infinity ? Infinity : to - prev;
    const used = Math.min(left, cap);
    left -= used;
    const from = prev;
    prev = to;
    const price = Math.max(0, num(t.price));
    return { tier: i + 1, from, to, m3: used, price, amount: used * price };
  });
}

// opts: { region, m3, people, poor, feeRate (HP/custom), customTiers, customVatIncluded, now }
export function waterBill(opts) {
  const { region = 'hanoi', poor = false, now = new Date() } = opts;
  const m3 = Math.max(0, num(opts.m3));
  let tiers, fee = 0, drainage = 0, dVat = 0;
  if (region === 'custom') {
    const inc = !!opts.customVatIncluded;
    tiers = (opts.customTiers || CUSTOM_DEFAULT).map((t) => ({ to: t.to, price: inc ? num(t.price) / (1 + WATER_VAT) : num(t.price) }));
    fee = num(opts.feeRate);
  } else {
    const R = WATER_REGIONS[region] || WATER_REGIONS.hanoi;
    const people = R.perPerson ? Math.max(1, Math.floor(num(opts.people, 1))) : 1;
    tiers = R.tiers.map((t) => ({ to: t.to === Infinity ? Infinity : t.to * people, price: poor && t.poor ? t.poor : t.price }));
    if (R.fee) fee = R.fee;
    if (region.startsWith('haiphong')) fee = num(opts.feeRate, 0.1);
    if (R.drainage) { drainage = R.drainage; dVat = drainageVat(now); }
  }
  fee = Math.min(1, Math.max(0, fee));
  const rows = splitTiers(m3, tiers);
  const subtotal = rows.reduce((s, r) => s + r.amount, 0);
  const vat = subtotal * WATER_VAT;
  const feeAmt = subtotal * fee;
  const drainAmt = subtotal * drainage;
  const drainVatAmt = drainAmt * dVat;
  const total = subtotal + vat + feeAmt + drainAmt + drainVatAmt;
  return { rows, subtotal, vat, fee, feeAmt, drainage, drainAmt, drainVat: dVat, drainVatAmt, total };
}

// Ngược: biết tổng tiền → số m³ (hàm đơn điệu), chia đôi.
export function m3FromBill(total, opts) {
  const t = num(total);
  if (t <= 0) return 0;
  let lo = 0, hi = 100000;
  if (waterBill({ ...opts, m3: hi }).total <= 0) return 0;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (waterBill({ ...opts, m3: mid }).total < t) lo = mid; else hi = mid;
  }
  return lo;
}
