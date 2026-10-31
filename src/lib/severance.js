// Trợ cấp thôi việc / mất việc làm (Bộ luật Lao động 2019, Điều 46–47; NĐ 145/2020/NĐ-CP Điều 8)
// và trợ cấp thất nghiệp (Luật Việc làm 74/2025/QH15, hiệu lực 01/01/2026, Điều 38–39).
// Lương tối thiểu vùng: NĐ 293/2025/NĐ-CP, đọc từ src/config/tax-vn.json.
import TAX from '../config/tax-vn.json';
export const MIN_WAGE = TAX.regionalMinWage;

const safe = (x) => (Number.isFinite(x) && x > 0 ? x : 0);

// Khoản 3 Điều 8 NĐ 145/2020: tháng lẻ 1–6 tính 1/2 năm, trên 6 tháng tính 1 năm.
export function roundServiceYears(months) {
  const m = Math.floor(safe(months));
  const y = Math.floor(m / 12), r = m % 12;
  return y + (r === 0 ? 0 : r <= 6 ? 0.5 : 1);
}

// Thời gian tính = thực tế − đã đóng BHTN − đã được chi trả trợ cấp (không âm).
export const countedMonths = (total, insured = 0, paid = 0) => Math.max(0, safe(total) - safe(insured) - safe(paid));

// Điều kiện chung Đ46, Đ47 BLLĐ 2019: đã làm việc thường xuyên từ đủ 12 tháng trở lên.
export const MIN_SERVICE_MONTHS = 12;

// Điều 46 BLLĐ 2019: mỗi năm làm việc được 1/2 tháng tiền lương.
// months: thời gian tính trợ cấp; totalMonths: tổng thời gian làm việc thực tế (xét điều kiện ≥ 12 tháng).
export function severance(avgSalary, months, totalMonths = months) {
  const eligible = safe(totalMonths) >= MIN_SERVICE_MONTHS;
  if (!eligible) return { eligible, years: 0, amount: 0 };
  const years = roundServiceYears(months);
  return { eligible, years, amount: 0.5 * safe(avgSalary) * years };
}

// Điều 47 BLLĐ 2019: mỗi năm 1 tháng tiền lương, ít nhất 2 tháng.
// Mức sàn 2 tháng chỉ áp dụng khi đủ điều kiện và thời gian tính > 0;
// thời gian tính = 0 (đã đóng BHTN toàn bộ) → 0, được bù bằng trợ cấp thất nghiệp.
export function jobLoss(avgSalary, months, totalMonths = months) {
  const eligible = safe(totalMonths) >= MIN_SERVICE_MONTHS;
  if (!eligible) return { eligible, years: 0, amount: 0, floored: false, coveredByUI: false };
  const s = safe(avgSalary);
  const years = roundServiceYears(months);
  if (years === 0) return { eligible, years, amount: 0, floored: false, coveredByUI: true };
  const raw = s * years;
  return { eligible, years, amount: Math.max(raw, 2 * s), floored: raw < 2 * s, coveredByUI: false };
}

// Điều 39 Luật Việc làm 2025: 60% lương bình quân, tối đa 5 × lương tối thiểu vùng;
// 12–36 tháng đóng: 3 tháng; mỗi 12 tháng thêm: +1 tháng, tối đa 12 tháng.
export function unemployment(avgInsuredSalary, insuredMonths, region = 1) {
  const s = safe(avgInsuredSalary);
  const m = Math.floor(safe(insuredMonths));
  const minWage = MIN_WAGE[String(region)] ?? MIN_WAGE['1'];
  const cap = 5 * minWage;
  const monthly = Math.min(0.6 * s, cap);
  const duration = m < 12 ? 0 : m <= 36 ? 3 : Math.min(12, 3 + Math.floor((m - 36) / 12));
  return { monthly, capped: 0.6 * s > cap, cap, duration, total: monthly * duration, eligible: m >= 12 };
}
