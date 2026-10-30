// Vietnamese Gross <-> Net salary calculator (tax period 2026).
import TAX from '../config/tax-vn.json';

export const TAX_CONFIG = TAX;

export function progressiveTax(assessable, brackets = TAX.taxBrackets) {
  let remaining = Math.max(0, assessable);
  let lower = 0;
  let total = 0;
  const detail = [];
  for (const b of brackets) {
    const upper = b.upTo == null ? Infinity : b.upTo;
    const span = upper - lower;
    const portion = Math.min(remaining, span);
    const tax = portion > 0 ? portion * b.rate : 0;
    detail.push({ from: lower, to: b.upTo, rate: b.rate, taxable: Math.max(0, portion), tax });
    total += tax;
    remaining -= Math.max(0, portion);
    lower = upper;
  }
  return { total, detail };
}

/**
 * @param {object} p
 * @param {number} p.gross             Monthly gross salary (VND)
 * @param {number} [p.insuranceSalary] Salary used for compulsory insurance (default = gross)
 * @param {number} [p.dependents]
 * @param {number|string} [p.region]   1..4
 * @param {number} [p.nonTaxable]      Tax-exempt allowances included in gross (meal, phone...)
 */
export function grossToNet({ gross, insuranceSalary, dependents = 0, region = 1, nonTaxable = 0 }) {
  gross = Math.max(0, Number(gross) || 0);
  const insBase = insuranceSalary && Number(insuranceSalary) > 0 ? Number(insuranceSalary) : gross;
  const capSocial = TAX.baseSalary * TAX.insuranceCapMultiplier;
  const minWage = TAX.regionalMinWage[String(region)] || TAX.regionalMinWage['1'];
  const capUnemployment = minWage * TAX.insuranceCapMultiplier;

  const bhxhBase = Math.min(insBase, capSocial);
  const bhytBase = Math.min(insBase, capSocial);
  const bhtnBase = Math.min(insBase, capUnemployment);

  const bhxh = Math.round(bhxhBase * TAX.employee.bhxh);
  const bhyt = Math.round(bhytBase * TAX.employee.bhyt);
  const bhtn = Math.round(bhtnBase * TAX.employee.bhtn);
  const insurance = bhxh + bhyt + bhtn;

  const erBhxh = Math.round(bhxhBase * TAX.employer.bhxh);
  const erTnld = Math.round(bhxhBase * TAX.employer.tnld);
  const erBhyt = Math.round(bhytBase * TAX.employer.bhyt);
  const erBhtn = Math.round(bhtnBase * TAX.employer.bhtn);
  const employerInsurance = erBhxh + erTnld + erBhyt + erBhtn;

  const taxableIncome = Math.max(0, gross - Math.max(0, Number(nonTaxable) || 0));
  const personalDeduction = TAX.personalDeduction;
  const dependentDeduction = TAX.dependentDeduction * Math.max(0, Number(dependents) || 0);
  const assessable = Math.max(0, taxableIncome - insurance - personalDeduction - dependentDeduction);
  const { total, detail } = progressiveTax(assessable);
  const pit = Math.round(total);
  const net = gross - insurance - pit;

  return {
    gross,
    insBase,
    bhxhBase,
    bhtnBase,
    bhxh,
    bhyt,
    bhtn,
    insurance,
    taxableIncome,
    personalDeduction,
    dependentDeduction,
    dependents: Number(dependents) || 0,
    assessable,
    pit,
    brackets: detail,
    net,
    employer: { bhxh: erBhxh, tnld: erTnld, bhyt: erBhyt, bhtn: erBhtn, total: employerInsurance },
    employerCost: gross + employerInsurance,
    effectiveTaxRate: gross > 0 ? pit / gross : 0,
    takeHomeRate: gross > 0 ? net / gross : 0
  };
}

/** Find gross salary producing the requested net (binary search, monotonic). */
export function netToGross(p) {
  const target = Math.max(0, Number(p.net) || 0);
  let lo = target;
  let hi = target * 2 + 50_000_000;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const r = grossToNet({ ...p, gross: mid, insuranceSalary: p.insuranceSalary });
    if (r.net < target) lo = mid;
    else hi = mid;
    if (hi - lo < 0.5) break;
  }
  const gross = Math.round(hi);
  return grossToNet({ ...p, gross });
}

export function calcSalary(params) {
  const mode = params.mode === 'net' ? 'net' : 'gross';
  const amount = Number(params.amount) || 0;
  return mode === 'net' ? netToGross({ ...params, net: amount }) : grossToNet({ ...params, gross: amount });
}
