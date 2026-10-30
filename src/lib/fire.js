// Compound interest & FIRE (Financial Independence, Retire Early) simulator.

/**
 * @param {object} p
 * @param {number} p.currentAge
 * @param {number} p.initial            current invested savings
 * @param {number} p.monthly            monthly contribution
 * @param {number} p.annualReturn       nominal return % / year
 * @param {number} p.contributionGrowth % / year increase of contribution
 * @param {number} p.annualExpenses     yearly living expenses in today's money
 * @param {number} p.inflation          % / year
 * @param {number} p.withdrawalRate     safe withdrawal rate %, e.g. 4
 * @param {number} p.years              horizon for the table
 */
export function simulateFire(p) {
  const currentAge = Math.max(0, Number(p.currentAge) || 30);
  const initial = Math.max(0, Number(p.initial) || 0);
  let monthly = Math.max(0, Number(p.monthly) || 0);
  const r = (Number(p.annualReturn) || 0) / 100;
  const g = (Number(p.contributionGrowth) || 0) / 100;
  const inf = (Number(p.inflation) || 0) / 100;
  const wr = Math.max(0.5, Number(p.withdrawalRate) || 4) / 100;
  const expenses = Math.max(0, Number(p.annualExpenses) || 0);
  const years = Math.min(70, Math.max(1, Math.round(Number(p.years) || 30)));
  const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;

  const fireNumberToday = expenses / wr;
  let balance = initial;
  let contributed = initial;
  const rows = [];
  let fireYear = null;
  const maxYears = Math.max(years, 70);

  for (let y = 1; y <= maxYears; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly;
      contributed += monthly;
    }
    const target = fireNumberToday * Math.pow(1 + inf, y);
    const realBalance = balance / Math.pow(1 + inf, y);
    const passiveIncomeMonthly = (balance * wr) / 12;
    const reached = balance >= target && expenses > 0;
    if (reached && fireYear === null) fireYear = y;
    if (y <= years || (fireYear === y)) {
      rows.push({
        year: y,
        age: currentAge + y,
        contribution: monthly * 12,
        contributed,
        balance,
        interest: balance - contributed,
        realBalance,
        target,
        passiveIncomeMonthly,
        reached
      });
    }
    monthly = monthly * (1 + g);
    if (y >= years && fireYear !== null) break;
  }

  const last = rows.filter((x) => x.year <= years).pop() || rows[rows.length - 1];
  return {
    fireNumberToday,
    fireYear,
    fireAge: fireYear ? currentAge + fireYear : null,
    rows: rows.filter((x) => x.year <= years || x.year === fireYear),
    finalBalance: last ? last.balance : initial,
    finalContributed: last ? last.contributed : initial,
    finalInterest: last ? last.balance - last.contributed : 0,
    finalReal: last ? last.realBalance : initial,
    years
  };
}

/** Simple compound interest: FV of a lump sum + monthly deposits. */
export function compound({ initial, monthly, annualReturn, years }) {
  const r = Math.pow(1 + (Number(annualReturn) || 0) / 100, 1 / 12) - 1;
  const n = Math.round((Number(years) || 0) * 12);
  const fvLump = (Number(initial) || 0) * Math.pow(1 + r, n);
  const fvAnn = r === 0 ? (Number(monthly) || 0) * n : (Number(monthly) || 0) * ((Math.pow(1 + r, n) - 1) / r);
  const total = fvLump + fvAnn;
  const contributed = (Number(initial) || 0) + (Number(monthly) || 0) * n;
  return { total, contributed, interest: total - contributed };
}

