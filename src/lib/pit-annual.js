// Quyết toán thuế TNCN năm & thuế phát sinh do thưởng (kỳ tính thuế 2026).
// - Biểu lũy tiến 5 bậc: Luật Thuế TNCN 109/2025/QH15 (áp dụng kỳ tính thuế 2026).
// - Giảm trừ gia cảnh 15.500.000 / 6.200.000 đ/tháng: NQ 110/2025/UBTVQH15.
// Số liệu đọc từ src/config/tax-vn.json qua salary.js, không hardcode.
import { progressiveTax, TAX_CONFIG as TAX } from './salary.js';

const safe = (x) => {
  const v = Number(x);
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export const ANNUAL_BRACKETS = TAX.taxBrackets.map((b) => ({ upTo: b.upTo == null ? null : b.upTo * 12, rate: b.rate }));

export function annualSettlement({ totalTaxableIncome, insurance, dependentMonths, withheld }) {
  const income = safe(totalTaxableIncome);
  const ins = safe(insurance);
  const depMonths = Math.floor(safe(dependentMonths)); // caller giới hạn người × tháng (tháng ≤ 12)
  const paid = safe(withheld);
  const personal = TAX.personalDeduction * 12;
  const dependent = TAX.dependentDeduction * depMonths;
  const assessable = Math.max(0, income - ins - personal - dependent);
  const { total, detail } = progressiveTax(assessable, ANNUAL_BRACKETS);
  const tax = Math.round(total);
  const diff = tax - paid;
  return { income, insurance: ins, dependentMonths: depMonths, personal, dependent, assessable, tax, brackets: detail, withheld: paid, diff, status: diff > 0 ? 'pay' : diff < 0 ? 'refund' : 'even' };
}

export function bonusTax({ monthlyGross, bonus, insurance, dependents }) {
  const gross = safe(monthlyGross);
  const b = safe(bonus);
  const ins = safe(insurance);
  const deps = Math.floor(safe(dependents));
  const deduction = TAX.personalDeduction + TAX.dependentDeduction * deps;
  const baseAssess = Math.max(0, gross - ins - deduction);
  const withAssess = Math.max(0, gross + b - ins - deduction);
  const taxBase = Math.round(progressiveTax(baseAssess).total);
  const taxWith = Math.round(progressiveTax(withAssess).total);
  const bonusTaxAmt = taxWith - taxBase;
  return { gross, bonus: b, insurance: ins, dependents: deps, deduction, baseAssess, withAssess, taxBase, taxWith, bonusTax: bonusTaxAmt, bonusNet: b - bonusTaxAmt, effectiveRate: b > 0 ? bonusTaxAmt / b : 0 };
}
