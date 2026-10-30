// Loan / installment calculator: reducing-balance (equal principal) vs annuity (equal payment).

/**
 * @param {object} p
 * @param {number} p.principal
 * @param {number} p.annualRate   percent per year, e.g. 9.5
 * @param {number} p.months
 * @param {'reducing'|'annuity'} p.method
 * @param {number} [p.promoMonths]  months at promo rate
 * @param {number} [p.promoRate]    promo annual rate percent
 */
export function loanSchedule({ principal, annualRate, months, method = 'reducing', promoMonths = 0, promoRate = 0 }) {
  principal = Math.max(0, Number(principal) || 0);
  months = Math.max(1, Math.round(Number(months) || 1));
  const baseRate = Math.max(0, Number(annualRate) || 0) / 100 / 12;
  const pRate = Math.max(0, Number(promoRate) || 0) / 100 / 12;
  promoMonths = Math.min(months, Math.max(0, Math.round(Number(promoMonths) || 0)));

  const rows = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  const equalPrincipal = principal / months;

  for (let m = 1; m <= months; m++) {
    const r = m <= promoMonths ? pRate : baseRate;
    const interest = balance * r;
    let principalPart;
    let payment;
    if (method === 'annuity') {
      const remaining = months - m + 1;
      payment = r === 0 ? balance / remaining : (balance * r) / (1 - Math.pow(1 + r, -remaining));
      principalPart = payment - interest;
    } else {
      principalPart = Math.min(equalPrincipal, balance);
      payment = principalPart + interest;
    }
    if (m === months) {
      principalPart = balance;
      payment = principalPart + interest;
    }
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    totalPaid += payment;
    rows.push({ month: m, rate: r * 12 * 100, payment, principal: principalPart, interest, balance });
  }

  const first = rows[0] || { payment: 0 };
  const last = rows[rows.length - 1] || { payment: 0 };
  const maxPayment = rows.reduce((a, r) => Math.max(a, r.payment), 0);
  return { method, principal, months, rows, totalInterest, totalPaid, firstPayment: first.payment, lastPayment: last.payment, maxPayment };
}

export function compareLoans(p) {
  return {
    reducing: loanSchedule({ ...p, method: 'reducing' }),
    annuity: loanSchedule({ ...p, method: 'annuity' })
  };
}

/** Maximum loan affordable given income: payment <= ratio * income (annuity). */
export function affordableLoan({ monthlyIncome, ratio = 0.4, annualRate, months }) {
  const pay = (Number(monthlyIncome) || 0) * ratio;
  const r = (Number(annualRate) || 0) / 100 / 12;
  if (r === 0) return pay * months;
  return (pay * (1 - Math.pow(1 + r, -months))) / r;
}

