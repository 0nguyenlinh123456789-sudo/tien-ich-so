// Lệ phí trước bạ & phí đăng ký, cấp biển số xe (cập nhật 31/10/2026).
// - Giá tính lệ phí: Bảng giá UBND tỉnh/thành nơi đăng ký (NĐ 175/2025/NĐ-CP sửa Điều 7 NĐ 10/2022/NĐ-CP).
//   Người dùng tự nhập; KHÔNG tự áp tỷ lệ chất lượng còn lại cho xe cũ.
// - Mức thu (Điều 8 NĐ 10/2022/NĐ-CP, sửa bởi NĐ 175/2025/NĐ-CP):
//   + Xe máy: lần đầu 2%, lần 2 trở đi 1% (toàn quốc).
//   + Ô tô chở người ≤ 9 chỗ (kể cả pick-up chở người) lần đầu: 10%; HĐND tỉnh được tăng tối đa 50% (≤ 15%).
//     Hải Phòng 12% theo NQ 14/2026/NQ-HĐND; tỉnh khác: xem nghị quyết HĐND tỉnh.
//   + Pick-up chở hàng cabin kép, VAN ≥ 2 hàng ghế lần đầu: 60% mức ô tô con của tỉnh.
//   + Ô tô khác (tải, khách > 9 chỗ...): 2%. Ô tô lần 2 trở đi: 2%.
//   + Ô tô điện chạy pin lần đầu: 0% đến hết 28/02/2027 (NĐ 51/2025/NĐ-CP).
// - Phí đăng ký, cấp biển số lần đầu: TT 60/2023/TT-BTC sửa bởi TT 71/2025/TT-BTC (từ 01/7/2025).
//   Khu vực I: Hà Nội, TP.HCM; khu vực II: tỉnh khác.
//   Mức 20tr/1tr chỉ cho ô tô chở người ≤ 9 chỗ (kể cả "xe con pick-up" và ô tô điện ≤ 9 chỗ);
//   "ô tô tải pick-up cabin kép", VAN thuộc nhóm ô tô khác: 500.000 / 150.000.

export const CAR_RATES = [0.1, 0.11, 0.12, 0.13, 0.14, 0.15];
export const EV_FREE_UNTIL = new Date(2027, 1, 28, 23, 59, 59); // hết 28/02/2027

export const VEHICLES = [
  { id: 'moto', vi: 'Xe máy', en: 'Motorbike' },
  { id: 'car9', vi: 'Ô tô ≤ 9 chỗ (kể cả pick-up chở người)', en: 'Car ≤ 9 seats (incl. passenger pick-up)' },
  { id: 'pickup', vi: 'Pick-up chở hàng cabin kép / VAN ≥ 2 hàng ghế', en: 'Double-cab cargo pick-up / VAN with ≥ 2 seat rows' },
  { id: 'ev', vi: 'Ô tô điện chạy pin', en: 'Battery electric car' },
  { id: 'other', vi: 'Ô tô khác (tải, khách > 9 chỗ...)', en: 'Other vehicles (trucks, buses > 9 seats...)' },
];

// [khu vực I, khu vực II]
export const PLATE_FEES = {
  car9: [20_000_000, 1_000_000],
  carOther: [500_000, 150_000],
  moto15: [1_000_000, 200_000],
  moto40: [2_000_000, 400_000],
  motoMax: [4_000_000, 800_000],
};

export const MAX_PRICE = 1e13;
const safe = (x) => (Number.isFinite(x) && x > 0 ? Math.min(x, MAX_PRICE) : 0);

export function plateFee(vehicle, price, region) {
  const i = region === '1' ? 0 : 1;
  if (vehicle === 'moto') {
    if (price <= 15_000_000) return PLATE_FEES.moto15[i];
    if (price <= 40_000_000) return PLATE_FEES.moto40[i];
    return PLATE_FEES.motoMax[i];
  }
  // Pick-up chở hàng cabin kép, VAN và ô tô khác: nhóm ô tô khác. "Xe con pick-up", ô tô điện ≤ 9 chỗ: nhóm ≤ 9 chỗ.
  if (vehicle === 'other' || vehicle === 'pickup') return PLATE_FEES.carOther[i];
  return PLATE_FEES.car9[i];
}

export function registrationFee({ vehicle = 'moto', price = 0, first = true, carRate = 0.1, region = '2', now = new Date() } = {}) {
  const P = safe(price);
  const v = VEHICLES.some((x) => x.id === vehicle) ? vehicle : 'moto';
  const cr = CAR_RATES.includes(Number(carRate)) ? Number(carRate) : 0.1;
  const evExpired = v === 'ev' && first && now > EV_FREE_UNTIL;
  let rate;
  if (v === 'moto') rate = first ? 0.02 : 0.01;
  else if (!first) rate = 0.02;
  else if (v === 'car9') rate = cr;
  else if (v === 'pickup') rate = Math.round(cr * 0.6 * 10000) / 10000;
  else if (v === 'ev') rate = evExpired ? cr : 0;
  else rate = 0.02;
  const tax = Math.round(P * rate);
  const plate = first ? plateFee(v, P, region) : 0;
  if (P <= 0) return { vehicle: v, price: 0, first, rate, carRate: cr, region: region === '1' ? '1' : '2', tax: 0, plate: 0, total: 0, evExpired, missingPrice: true };
  return { vehicle: v, price: P, first, rate, carRate: cr, region: region === '1' ? '1' : '2', tax, plate, total: tax + plate, evExpired, missingPrice: false };
}
