// Pythagorean numerology – 100% deterministic, client-side.

const MASTER = new Set([11, 22, 33]);
const LETTER_VALUE = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch, i) => { LETTER_VALUE[ch] = (i % 9) + 1; });
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export function digitSum(n) {
  return String(Math.abs(n)).split('').reduce((a, d) => a + (Number(d) || 0), 0);
}

export function reduceNumber(n, keepMaster = true) {
  n = Math.abs(Number(n) || 0);
  while (n > 9 && !(keepMaster && MASTER.has(n))) n = digitSum(n);
  return n;
}

export function toSingle(n) {
  return reduceNumber(n, false);
}

export function normalizeName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isVowelAt(letters, i) {
  const ch = letters[i];
  if (VOWELS.has(ch)) return true;
  if (ch === 'Y') {
    const prev = letters[i - 1];
    const next = letters[i + 1];
    // Y acts as a vowel when it is not next to another vowel (e.g. "VY", "LY", "THUY" -> U is vowel so Y consonant)
    return !(prev && VOWELS.has(prev)) && !(next && VOWELS.has(next));
  }
  return false;
}

export function nameNumbers(fullName) {
  const norm = normalizeName(fullName);
  let all = 0;
  let vowels = 0;
  let consonants = 0;
  const letterCounts = {};
  for (const word of norm.split(' ').filter(Boolean)) {
    const letters = word.split('');
    letters.forEach((ch, i) => {
      const v = LETTER_VALUE[ch];
      if (!v) return;
      all += v;
      letterCounts[v] = (letterCounts[v] || 0) + 1;
      if (isVowelAt(letters, i)) vowels += v;
      else consonants += v;
    });
  }
  return {
    normalized: norm,
    expression: norm ? reduceNumber(all) : 0,
    soulUrge: norm ? reduceNumber(vowels) : 0,
    personality: norm ? reduceNumber(consonants) : 0,
    letterCounts
  };
}

export const ARROWS = [
  { id: '123', digits: [1, 2, 3] },
  { id: '456', digits: [4, 5, 6] },
  { id: '789', digits: [7, 8, 9] },
  { id: '147', digits: [1, 4, 7] },
  { id: '258', digits: [2, 5, 8] },
  { id: '369', digits: [3, 6, 9] },
  { id: '159', digits: [1, 5, 9] },
  { id: '357', digits: [3, 5, 7] }
];

export function birthChart(day, month, year) {
  const digits = `${day}${month}${year}`.split('').map(Number).filter((d) => d > 0);
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  digits.forEach((d) => { counts[d]++; });
  const strong = [];
  const missing = [];
  for (const a of ARROWS) {
    if (a.digits.every((d) => counts[d] > 0)) strong.push(a.id);
    else if (a.digits.every((d) => counts[d] === 0)) missing.push(a.id);
  }
  const isolated = [];
  // isolated numbers: 1,3,7,9 when neighbours are empty
  const neighbours = { 1: [2, 4, 5], 3: [2, 5, 6], 7: [4, 5, 8], 9: [5, 6, 8] };
  for (const [n, nb] of Object.entries(neighbours)) {
    if (counts[n] > 0 && nb.every((d) => counts[d] === 0)) isolated.push(Number(n));
  }
  return { counts, strong, missing, isolated };
}

/**
 * Full numerology profile.
 * @param {{name?: string, day: number, month: number, year: number, targetYear?: number}} p
 */
export function numerologyProfile({ name = '', day, month, year, targetYear }) {
  day = Number(day); month = Number(month); year = Number(year);
  const now = new Date();
  targetYear = Number(targetYear) || now.getFullYear();

  const totalDigits = digitSum(day) + digitSum(month) + digitSum(year);
  const lifePath = reduceNumber(totalDigits);
  const lifePathSingle = toSingle(lifePath);
  const birthdayNumber = reduceNumber(day);
  const attitude = reduceNumber(day + month);

  const m = toSingle(month);
  const d = toSingle(day);
  const y = toSingle(digitSum(year));

  const p1 = reduceNumber(m + d);
  const p2 = reduceNumber(d + y);
  const p3 = reduceNumber(toSingle(p1) + toSingle(p2));
  const p4 = reduceNumber(m + y);
  const age1 = 36 - lifePathSingle;
  const pinnacles = [
    { index: 1, number: p1, fromAge: 0, toAge: age1, year: year + age1 },
    { index: 2, number: p2, fromAge: age1 + 1, toAge: age1 + 9, year: year + age1 + 9 },
    { index: 3, number: p3, fromAge: age1 + 10, toAge: age1 + 18, year: year + age1 + 18 },
    { index: 4, number: p4, fromAge: age1 + 19, toAge: null, year: year + age1 + 27 }
  ];
  // Peak ("đỉnh cao") = the age at which each pinnacle culminates
  const peaks = [age1, age1 + 9, age1 + 18, age1 + 27].map((age, i) => ({ index: i + 1, age, year: year + age, number: [p1, p2, p3, p4][i] }));

  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);
  const challenges = [c1, c2, c3, c4];

  const personalYear = toSingle(d + m + toSingle(digitSum(targetYear)));
  const currentMonth = now.getMonth() + 1;
  const personalMonth = toSingle(personalYear + currentMonth);
  const nextYears = [0, 1, 2].map((k) => ({ year: targetYear + k, number: toSingle(d + m + toSingle(digitSum(targetYear + k))) }));

  const names = name ? nameNumbers(name) : null;
  const maturity = names ? reduceNumber(toSingle(lifePath) + toSingle(names.expression)) : null;

  return {
    input: { name, day, month, year, targetYear },
    lifePath,
    lifePathSingle,
    birthdayNumber,
    attitude,
    chart: birthChart(day, month, year),
    pinnacles,
    peaks,
    challenges,
    personalYear,
    personalMonth,
    nextYears,
    names,
    maturity,
    luckyNumbers: Array.from(new Set([lifePathSingle, toSingle(day), personalYear, toSingle(lifePath + personalYear) || 9])).slice(0, 4)
  };
}

