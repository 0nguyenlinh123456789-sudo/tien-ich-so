// Vietnamese lunar calendar (algorithm by Hồ Ngọc Đức, timezone GMT+7) + can chi, hoàng đạo.

const PI = Math.PI;
const INT = Math.floor;

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const CHI_EN = ['Rat', 'Ox', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
export const HOUR_RANGES = ['23h-1h', '1h-3h', '3h-5h', '5h-7h', '7h-9h', '9h-11h', '11h-13h', '13h-15h', '15h-17h', '17h-19h', '19h-21h', '21h-23h'];

export function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}

export function jdToDate(jd) {
  let b, c;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return { day, month, year };
}

function newMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  else deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  return jd1 + C1 - deltat;
}

function sunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return L;
}

const getSunLongitude = (dayNumber, tz) => INT((sunLongitude(dayNumber - 0.5 - tz / 24) / PI) * 6);
const getNewMoonDay = (k, tz) => INT(newMoon(k) + 0.5 + tz / 24);

function getLunarMonth11(yy, tz) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}

function getLeapMonthOffset(a11, tz) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function solarToLunar(dd, mm, yy, tz = 7) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
  let a11 = getLunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let leap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) leap = 1;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap, jd: dayNumber };
}

export const yearCanChi = (y) => ({ can: (y + 6) % 10, chi: (y + 8) % 12, text: `${CAN[(y + 6) % 10]} ${CHI[(y + 8) % 12]}` });
export const monthCanChi = (lm, ly) => ({ can: (ly * 12 + lm + 3) % 10, chi: (lm + 1) % 12, text: `${CAN[(ly * 12 + lm + 3) % 10]} ${CHI[(lm + 1) % 12]}` });
export const dayCanChi = (jd) => ({ can: (jd + 9) % 10, chi: (jd + 1) % 12, text: `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}` });

// Nạp âm (60 Giáp Tý)
const NAP_AM = [
  ['Hải Trung Kim', 'Kim', 'Gold in the Sea'], ['Lư Trung Hỏa', 'Hỏa', 'Fire in the Furnace'], ['Đại Lâm Mộc', 'Mộc', 'Wood of the Great Forest'],
  ['Lộ Bàng Thổ', 'Thổ', 'Earth by the Roadside'], ['Kiếm Phong Kim', 'Kim', 'Sword-edge Metal'], ['Sơn Đầu Hỏa', 'Hỏa', 'Fire on the Mountain'],
  ['Giản Hạ Thủy', 'Thủy', 'Water in the Ravine'], ['Thành Đầu Thổ', 'Thổ', 'Earth on the City Wall'], ['Bạch Lạp Kim', 'Kim', 'White Wax Metal'],
  ['Dương Liễu Mộc', 'Mộc', 'Willow Wood'], ['Tuyền Trung Thủy', 'Thủy', 'Water in the Well'], ['Ốc Thượng Thổ', 'Thổ', 'Earth on the Roof'],
  ['Tích Lịch Hỏa', 'Hỏa', 'Thunder Fire'], ['Tùng Bách Mộc', 'Mộc', 'Pine Wood'], ['Trường Lưu Thủy', 'Thủy', 'Long-flowing Water'],
  ['Sa Trung Kim', 'Kim', 'Gold in the Sand'], ['Sơn Hạ Hỏa', 'Hỏa', 'Fire at the Foot of the Mountain'], ['Bình Địa Mộc', 'Mộc', 'Wood of the Plain'],
  ['Bích Thượng Thổ', 'Thổ', 'Earth on the Wall'], ['Kim Bạch Kim', 'Kim', 'Gold Leaf Metal'], ['Phú Đăng Hỏa', 'Hỏa', 'Lamp Fire'],
  ['Thiên Hà Thủy', 'Thủy', 'Heavenly River Water'], ['Đại Trạch Thổ', 'Thổ', 'Great Post-station Earth'], ['Thoa Xuyến Kim', 'Kim', 'Jewellery Metal'],
  ['Tang Đố Mộc', 'Mộc', 'Mulberry Wood'], ['Đại Khê Thủy', 'Thủy', 'Great Stream Water'], ['Sa Trung Thổ', 'Thổ', 'Earth in the Sand'],
  ['Thiên Thượng Hỏa', 'Hỏa', 'Heavenly Fire'], ['Thạch Lựu Mộc', 'Mộc', 'Pomegranate Wood'], ['Đại Hải Thủy', 'Thủy', 'Great Ocean Water']
];
export const ELEMENT_EN = { Kim: 'Metal', Mộc: 'Wood', Thủy: 'Water', Hỏa: 'Fire', Thổ: 'Earth' };
export const ELEMENT_COLORS = {
  Kim: { good: ['Trắng', 'Xám', 'Ghi', 'Vàng (Thổ sinh Kim)', 'Nâu đất'], bad: ['Đỏ', 'Hồng', 'Tím'] },
  Mộc: { good: ['Xanh lá', 'Xanh dương', 'Đen (Thủy sinh Mộc)'], bad: ['Trắng', 'Xám', 'Ghi'] },
  Thủy: { good: ['Đen', 'Xanh dương', 'Trắng (Kim sinh Thủy)', 'Xám'], bad: ['Vàng', 'Nâu đất'] },
  Hỏa: { good: ['Đỏ', 'Hồng', 'Tím', 'Xanh lá (Mộc sinh Hỏa)'], bad: ['Đen', 'Xanh dương'] },
  Thổ: { good: ['Vàng', 'Nâu đất', 'Đỏ, Hồng, Tím (Hỏa sinh Thổ)'], bad: ['Xanh lá'] }
};
export const ELEMENT_COLORS_EN = {
  Kim: { good: ['White', 'Grey', 'Silver', 'Yellow', 'Brown'], bad: ['Red', 'Pink', 'Purple'] },
  Mộc: { good: ['Green', 'Blue', 'Black'], bad: ['White', 'Grey', 'Silver'] },
  Thủy: { good: ['Black', 'Blue', 'White', 'Grey'], bad: ['Yellow', 'Brown'] },
  Hỏa: { good: ['Red', 'Pink', 'Purple', 'Green'], bad: ['Black', 'Blue'] },
  Thổ: { good: ['Yellow', 'Brown', 'Red', 'Pink', 'Purple'], bad: ['Green'] }
};

export function napAm(lunarYear) {
  const idx = (((lunarYear - 4) % 60) + 60) % 60;
  const [name, element, en] = NAP_AM[INT(idx / 2)];
  return { name, element, en, elementEn: ELEMENT_EN[element], canChi: yearCanChi(lunarYear).text };
}

// 12 day/hour stars (Thanh Long ... Câu Trận). good = Hoàng đạo
export const STARS = [
  { vi: 'Thanh Long', en: 'Azure Dragon', good: true },
  { vi: 'Minh Đường', en: 'Bright Hall', good: true },
  { vi: 'Thiên Hình', en: 'Heavenly Punishment', good: false },
  { vi: 'Chu Tước', en: 'Vermilion Bird', good: false },
  { vi: 'Kim Quỹ', en: 'Golden Coffer', good: true },
  { vi: 'Kim Đường (Bảo Quang)', en: 'Precious Light', good: true },
  { vi: 'Bạch Hổ', en: 'White Tiger', good: false },
  { vi: 'Ngọc Đường', en: 'Jade Hall', good: true },
  { vi: 'Thiên Lao', en: 'Heavenly Prison', good: false },
  { vi: 'Huyền Vũ', en: 'Black Tortoise', good: false },
  { vi: 'Tư Mệnh', en: 'Life Controller', good: true },
  { vi: 'Câu Trận', en: 'Hook Array', good: false }
];

export function dayStar(lunarMonth, dayChi) {
  const start = ((lunarMonth - 1) % 6) * 2;
  return STARS[(dayChi - start + 12) % 12];
}

export function goodHours(dayChi) {
  const s = (8 + 2 * (dayChi % 6)) % 12;
  return [0, 1, 4, 5, 7, 10].map((o) => (s + o) % 12).sort((a, b) => a - b).map((h) => ({ chi: h, name: CHI[h], nameEn: CHI_EN[h], range: HOUR_RANGES[h] }));
}

const TAM_NUONG = [3, 7, 13, 18, 22, 27];
const NGUYET_KY = [5, 14, 23];

/**
 * Evaluate a solar date for a person born in birthYear (optional).
 */
export function evaluateDay(dd, mm, yy, birthYear) {
  const lunar = solarToLunar(dd, mm, yy);
  const dCC = dayCanChi(lunar.jd);
  const mCC = monthCanChi(lunar.month, lunar.year);
  const yCC = yearCanChi(lunar.year);
  const star = dayStar(lunar.month, dCC.chi);
  const notes = [];
  let score = star.good ? 2 : -2;
  notes.push({ type: star.good ? 'good' : 'bad', key: star.good ? 'hoangDao' : 'hacDao', star });
  if (TAM_NUONG.includes(lunar.day)) { score -= 1; notes.push({ type: 'bad', key: 'tamNuong' }); }
  if (NGUYET_KY.includes(lunar.day)) { score -= 1; notes.push({ type: 'bad', key: 'nguyetKy' }); }
  if (lunar.day === 1 || lunar.day === 15) notes.push({ type: 'info', key: lunar.day === 1 ? 'mung1' : 'ram' });
  let personal = null;
  if (birthYear) {
    const bChi = (Number(birthYear) + 8) % 12;
    const diff = Math.abs(bChi - dCC.chi);
    if (diff === 6) { score -= 2; personal = 'xung'; notes.push({ type: 'bad', key: 'xungTuoi' }); }
    else if ((bChi + dCC.chi) % 12 === 1) { score += 1; personal = 'lucHop'; notes.push({ type: 'good', key: 'lucHop' }); }
    else if (bChi % 4 === dCC.chi % 4 && bChi !== dCC.chi) { score += 1; personal = 'tamHop'; notes.push({ type: 'good', key: 'tamHop' }); }
  }
  const rating = score >= 2 ? 'good' : score >= 0 ? 'normal' : 'bad';
  return {
    solar: { day: dd, month: mm, year: yy },
    weekday: new Date(yy, mm - 1, dd).getDay(),
    lunar,
    canChi: { day: dCC.text, month: mCC.text, year: yCC.text },
    star,
    hours: goodHours(dCC.chi),
    score,
    rating,
    personal,
    notes
  };
}

export function monthDays(mm, yy, birthYear) {
  const days = new Date(yy, mm, 0).getDate();
  const out = [];
  for (let d = 1; d <= days; d++) out.push(evaluateDay(d, mm, yy, birthYear));
  return out;
}

