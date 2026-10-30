// Read money amounts as words – Vietnamese & English. Works on digit strings (supports very large numbers).

const VI_DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function viTriple(h, t, u, full) {
  const out = [];
  if (h > 0 || full) out.push(VI_DIGITS[h], 'trăm');
  if (t === 0) {
    if (u > 0 && (h > 0 || full)) out.push('linh', VI_DIGITS[u]);
    else if (u > 0) out.push(VI_DIGITS[u]);
  } else if (t === 1) {
    out.push('mười');
    if (u === 5) out.push('lăm');
    else if (u > 0) out.push(VI_DIGITS[u]);
  } else {
    out.push(VI_DIGITS[t], 'mươi');
    if (u === 1) out.push('mốt');
    else if (u === 4) out.push('tư');
    else if (u === 5) out.push('lăm');
    else if (u > 0) out.push(VI_DIGITS[u]);
  }
  return out.join(' ');
}

function viUnit(i) {
  const base = ['', 'nghìn', 'triệu'][i % 3];
  const ty = ' tỷ'.repeat(Math.floor(i / 3)).trim();
  return [base, ty].filter(Boolean).join(' ');
}

export function integerToVietnamese(digits) {
  digits = String(digits).replace(/\D/g, '').replace(/^0+/, '');
  if (!digits) return 'không';
  const groups = [];
  for (let i = digits.length; i > 0; i -= 3) groups.unshift(digits.slice(Math.max(0, i - 3), i));
  const n = groups.length;
  const parts = [];
  groups.forEach((g, idx) => {
    const v = g.padStart(3, '0').split('').map(Number);
    const unitIndex = n - 1 - idx;
    const isZero = v[0] === 0 && v[1] === 0 && v[2] === 0;
    if (isZero) {
      // keep the "tỷ" marker when a whole billion block is empty but higher digits exist
      if (unitIndex % 3 === 0 && unitIndex > 0 && parts.length) {
        const unit = viUnit(unitIndex);
        if (!parts[parts.length - 1].endsWith('tỷ')) parts.push(unit);
      }
      return;
    }
    const full = idx > 0;
    parts.push([viTriple(v[0], v[1], v[2], full), viUnit(unitIndex)].filter(Boolean).join(' '));
  });
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const EN_ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const EN_SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion'];

function enTriple(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const out = [];
  if (h) out.push(EN_ONES[h], 'hundred');
  if (r) {
    if (h) out.push('and');
    if (r < 20) out.push(EN_ONES[r]);
    else out.push(EN_TENS[Math.floor(r / 10)] + (r % 10 ? '-' + EN_ONES[r % 10] : ''));
  }
  return out.join(' ');
}

export function integerToEnglish(digits) {
  digits = String(digits).replace(/\D/g, '').replace(/^0+/, '');
  if (!digits) return 'zero';
  const groups = [];
  for (let i = digits.length; i > 0; i -= 3) groups.unshift(Number(digits.slice(Math.max(0, i - 3), i)));
  const n = groups.length;
  const parts = [];
  groups.forEach((g, idx) => {
    if (!g) return;
    const scale = EN_SCALES[n - 1 - idx] || '';
    parts.push([enTriple(g), scale].filter(Boolean).join(' '));
  });
  return parts.join(' ');
}

/**
 * @param {string|number} amount  e.g. "1250000" or "1,250.75"
 * @param {'VND'|'USD'} currency
 * @param {'vi'|'en'} lang
 */
export function moneyToWords(amount, currency = 'VND', lang = 'vi') {
  const raw = String(amount ?? '').trim();
  const negative = raw.startsWith('-');
  // decimal separator: last "." or "," followed by 1-2 digits
  const m = raw.replace(/\s/g, '').match(/^-?([\d.,]*?)(?:[.,](\d{1,2}))?$/);
  let intPart = raw.replace(/\D/g, '');
  let frac = '';
  if (m && m[2] !== undefined && currency === 'USD') {
    intPart = (m[1] || '0').replace(/\D/g, '');
    frac = m[2].padEnd(2, '0');
  }
  const cents = frac ? Number(frac) : 0;
  let text;
  if (lang === 'vi') {
    const words = integerToVietnamese(intPart);
    if (currency === 'VND') text = `${words} đồng`;
    else text = `${words} đô la Mỹ` + (cents ? ` và ${integerToVietnamese(String(cents))} xu` : '');
    if (negative) text = 'âm ' + text;
    if (currency === 'VND' && !cents) text += ' chẵn';
  } else {
    const words = integerToEnglish(intPart);
    if (currency === 'VND') text = `${words} Vietnamese dong`;
    else text = `${words} US dollar${intPart === '1' ? '' : 's'}` + (cents ? ` and ${integerToEnglish(String(cents))} cent${cents === 1 ? '' : 's'}` : '');
    if (negative) text = 'minus ' + text;
    text += ' only';
  }
  return capitalize(text.replace(/\s+/g, ' ').trim());
}

