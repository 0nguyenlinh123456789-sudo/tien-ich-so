// Social insurance benefits under the Social Insurance Law 2024 (effective 01/07/2025).
// Lương cơ sở (Nghị định 161/2026/NĐ-CP, from 01/07/2026) is used as the "mức tham chiếu" until one is set.
import TAX from '../config/tax-vn.json';
export const BASE_SALARY = TAX.baseSalary;

// Months beyond whole years: 1–6 count as half a year, 7–11 as a full year.
export const roundYears = (years, months = 0) => years + (months === 0 ? 0 : months <= 6 ? 0.5 : 1);

// Điều 70 khoản 3: 1.5 months/year before 2014, 2 months/year from 2014; under one year capped at 2 months.
export function lumpSum({ avg, yBefore = 0, mBefore = 0, yAfter = 0, mAfter = 0 }) {
  const totalMonths = yBefore * 12 + mBefore + yAfter * 12 + mAfter;
  // Under one year: equals the amount contributed, capped at 2 months; we only show the cap.
  if (totalMonths < 12) return { months: 2, amount: avg * 2, short: true };
  const before = roundYears(yBefore, mBefore);
  const after = roundYears(yAfter, mAfter);
  const months = before * 1.5 + after * 2;
  return { before, after, months, amount: avg * months, short: false };
}

// Điều 66: women 45% at 15 years; men 40% at 15 years (+1%/year to 20), 45% at 20 years; then +2%/year, max 75%.
export function pensionRate(sex, years) {
  if (years < 15) return 0;
  let r;
  if (sex === 'f') r = 45 + (years - 15) * 2;
  else r = years < 20 ? 40 + (years - 15) : 45 + (years - 20) * 2;
  return Math.min(75, r);
}

export function pension({ sex, years, months = 0, avg }) {
  const y = roundYears(years, months);
  const rate = pensionRate(sex, y);
  const cap = sex === 'f' ? 30 : 35; // years that reach 75%
  const extra = Math.max(0, y - cap);
  return { years: y, rate, monthly: (avg * rate) / 100, extraYears: extra, extraLump: extra * 0.5 * avg };
}

// Maternity for the mother: 6 months at 100% of the 6-month average, +1 month per extra child,
// plus a lump sum of 2 × reference level per child.
export function maternity({ avg, children = 1 }) {
  const months = 6 + Math.max(0, children - 1);
  const monthly = avg;
  const lump = 2 * BASE_SALARY * children;
  return { months, monthly, leavePay: monthly * months, lump, total: monthly * months + lump };
}

// Father: 5 working days (normal), 7 (C-section or <32 weeks), 10 (twins), +3 per child from the third.
export function paternity({ avg, kind = 'normal', children = 1 }) {
  let days = children >= 2 ? 10 + Math.max(0, children - 2) * 3 : kind === 'normal' ? 5 : 7;
  // Daily rate = monthly average ÷ 24 working days.
  return { days, amount: (avg / 24) * days };
}
