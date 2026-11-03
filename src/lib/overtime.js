// Tính tiền lương làm thêm giờ (tăng ca). Cập nhật 11/2026.
// - Điều 98 BLLĐ 45/2019/QH14: làm thêm ngày thường ≥150%, ngày nghỉ hằng tuần ≥200%, ngày lễ/tết/nghỉ có hưởng lương ≥300%
//   (chưa kể lương ngày lễ với người hưởng lương ngày); làm ban đêm +≥30%; làm thêm ban đêm +20% lương giờ ban ngày tương ứng.
// - Điều 57 NĐ 145/2020/NĐ-CP: ngày thường 200% (không làm thêm ban ngày trước đó) hoặc 210% (có làm thêm ban ngày);
//   ngày nghỉ hằng tuần 270%; ngày lễ, tết 390%.
// - Ban đêm: 22h–6h (Điều 106). Giới hạn làm thêm: 40 giờ/tháng, 200 giờ/năm (300 giờ với một số ngành) – Điều 107;
//   mức 60 giờ/tháng của NQ 17/2022/UBTVQH15 chỉ áp dụng đến 31/12/2022.

export const OT_RATES = { weekday: 1.5, weekend: 2, holiday: 3 };
export const NIGHT_BONUS = 0.3;
export const NIGHT_OT_BONUS = 0.2;
export const OT_LIMIT_MONTH = 40;

const num = (x) => (Number.isFinite(Number(x)) && Number(x) > 0 ? Number(x) : 0);

// Hệ số làm thêm ban đêm (Điều 57 NĐ 145): base + 30% + 20% × hệ số ban ngày của cùng loại ngày.
// Ngày thường không làm thêm ban ngày trước đó: hệ số ban ngày tính là 100%.
export function nightRate(kind, dayOt = false) {
  const base = OT_RATES[kind];
  const dayRate = kind === 'weekday' && !dayOt ? 1 : base;
  return base + NIGHT_BONUS + NIGHT_OT_BONUS * dayRate;
}

export function hourlyWage(salary, days = 26, hoursPerDay = 8) {
  const d = num(days), h = num(hoursPerDay);
  return d && h ? num(salary) / d / h : 0;
}

// hours: { weekday, weekdayNight, weekend, weekendNight, holiday, holidayNight, night } (night = làm ca đêm trong giờ chuẩn).
export function overtimePay({ salary, days = 26, hoursPerDay = 8, hours = {}, dayOtBeforeNight = false }) {
  const w = hourlyWage(salary, days, hoursPerDay);
  const rows = [
    { key: 'weekday', rate: OT_RATES.weekday },
    { key: 'weekdayNight', rate: nightRate('weekday', dayOtBeforeNight) },
    { key: 'weekend', rate: OT_RATES.weekend },
    { key: 'weekendNight', rate: nightRate('weekend') },
    { key: 'holiday', rate: OT_RATES.holiday },
    { key: 'holidayNight', rate: nightRate('holiday') },
    { key: 'night', rate: NIGHT_BONUS }
  ].map((r) => ({ ...r, hours: num(hours[r.key]), amount: num(hours[r.key]) * r.rate * w }));
  const otHours = rows.filter((r) => r.key !== 'night').reduce((s, r) => s + r.hours, 0);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  return { hourly: w, rows, otHours, total, overLimit: otHours > OT_LIMIT_MONTH };
}
