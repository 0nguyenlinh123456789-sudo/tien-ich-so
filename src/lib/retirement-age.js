// Tuổi nghỉ hưu trong điều kiện lao động bình thường và nghỉ hưu sớm.
// Căn cứ: Điều 169 Bộ luật Lao động 45/2019/QH14; NĐ 135/2020/NĐ-CP Điều 3, 4, 5 + Phụ lục I, II.
// - Từ 2021: nam 60 tuổi 3 tháng, nữ 55 tuổi 4 tháng; mỗi năm tăng nam 3 tháng (đến 62 tuổi năm 2028),
//   nữ 4 tháng (đến 60 tuổi năm 2035).
// - Nghỉ hưu sớm: thấp hơn tối đa 5 tuổi so với tuổi nghỉ hưu bình thường cùng năm (Điều 5).
// - Thời điểm nghỉ hưu: kết thúc ngày cuối cùng của tháng đủ tuổi; hưởng lương hưu từ ngày 01 tháng liền kề (Điều 3).

export const MIN_YEAR = 1950;
export const MAX_YEAR = 2010;
const RULES = { male: { base: 720, step: 3, cap: 744 }, female: { base: 660, step: 4, cap: 720 } };

// Tuổi nghỉ hưu bình thường (tháng) áp dụng cho năm R (2021+).
export function requiredMonths(sex, R) {
  const r = RULES[sex === 'female' ? 'female' : 'male'];
  return Math.min(r.base + r.step * Math.max(0, R - 2020), r.cap);
}

export function retirementAge({ sex = 'male', month = 1, year = 1970, early = false, now = new Date() } = {}) {
  const M = Math.trunc(Number(month));
  const Y = Math.trunc(Number(year));
  if (!Number.isFinite(M) || M < 1 || M > 12 || !Number.isFinite(Y) || Y < MIN_YEAR || Y > MAX_YEAR) return { invalid: true };
  const s = sex === 'female' ? 'female' : 'male';
  const { base } = RULES[s];
  const cut = early ? 60 : 0;
  const b = Y * 12 + (M - 1);
  let req, t;
  if (b + base - cut < 2021 * 12) {
    req = base - cut; t = b + req;
  } else {
    for (let R = 2021; R <= 2040; R++) {
      req = requiredMonths(s, R) - cut; t = b + req;
      if (Math.floor(t / 12) <= R) break;
    }
  }
  const ty = Math.floor(t / 12), tm = (t % 12) + 1; // tháng đủ tuổi (1-12)
  const lastDay = new Date(ty, tm, 0).getDate();
  const py = tm === 12 ? ty + 1 : ty, pm = tm === 12 ? 1 : tm + 1;
  const cur = now.getFullYear() * 12 + now.getMonth();
  const left = Math.max(0, t - cur);
  return {
    invalid: false, sex: s, early: !!early,
    ageYears: Math.floor(req / 12), ageMonths: req % 12,
    retireMonth: tm, retireYear: ty, retireDay: lastDay,
    pensionMonth: pm, pensionYear: py,
    reached: t < cur, leftYears: Math.floor(left / 12), leftMonths: left % 12,
  };
}
