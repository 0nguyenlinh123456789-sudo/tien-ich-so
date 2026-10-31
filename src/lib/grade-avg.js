// Điểm trung bình môn THCS/THPT theo Thông tư 22/2021/TT-BGDĐT (cập nhật 31/10/2026).
// TT 89/2026/TT-BGDĐT (hiệu lực 01/12/2026) không sửa Điều 5, Điều 9.
// - Điều 5 k3 điểm b: điểm đánh giá và ĐTB môn là số nguyên hoặc số thập phân 1 chữ số, làm tròn đến 1 chữ số.
// - Điều 6 k2 điểm b: số ĐĐGtx: môn 35 tiết/năm: 2; trên 35 đến 70 tiết: 3; trên 70 tiết: 4.
// - Điều 9 k1 điểm b: ĐTBmhk = (TĐĐGtx + 2×ĐĐGgk + 3×ĐĐGck) / (số ĐĐGtx + 5).
//   ĐTBmcn = (ĐTBmhkI + 2×ĐTBmhkII) / 3.
// - Điều 9 k2: mức Tốt / Khá / Đạt / Chưa đạt; Điều 9 k3: điều chỉnh khi bị hạ ≥ 2 bậc chỉ vì 1 môn.
// Tiểu học không tính điểm trung bình (TT 27/2020/TT-BGDĐT).

export const LEVELS = [
  { vi: 'Chưa đạt', en: 'Not achieved' },
  { vi: 'Đạt', en: 'Achieved' },
  { vi: 'Khá', en: 'Good' },
  { vi: 'Tốt', en: 'Excellent' },
];

export const SUBJECTS = {
  thpt: [
    { vi: 'Toán', en: 'Mathematics' }, { vi: 'Ngữ văn', en: 'Literature' }, { vi: 'Ngoại ngữ 1', en: 'Foreign language' },
    { vi: 'Lịch sử', en: 'History' }, { vi: 'Giáo dục quốc phòng và an ninh', en: 'Defence & security education' },
    // Môn lựa chọn: tên mặc định, người dùng sửa được theo tổ hợp của trường.
    { vi: 'Vật lí', en: 'Physics' }, { vi: 'Hóa học', en: 'Chemistry' },
    { vi: 'Sinh học', en: 'Biology' }, { vi: 'Tin học', en: 'Informatics' },
  ],
  thcs: [
    { vi: 'Toán', en: 'Mathematics' }, { vi: 'Ngữ văn', en: 'Literature' }, { vi: 'Ngoại ngữ 1', en: 'Foreign language' },
    { vi: 'Giáo dục công dân', en: 'Civic education' }, { vi: 'Lịch sử và Địa lí', en: 'History & Geography' },
    { vi: 'Khoa học tự nhiên', en: 'Natural science' }, { vi: 'Công nghệ', en: 'Technology' }, { vi: 'Tin học', en: 'Informatics' },
  ],
};

export const MAX_SUBJECTS = 14;

// Gợi ý số ĐĐGtx theo số tiết/năm (Điều 6 k2 điểm b).
export const suggestTx = (periods) => (periods <= 35 ? 2 : periods <= 70 ? 3 : 4);

// Làm tròn 1 chữ số thập phân, nửa lên, tránh lỗi số thực (6.45 → 6.5).
export function round1(x) {
  if (!Number.isFinite(x)) return NaN;
  return Math.round((x + Number.EPSILON * Math.max(1, Math.abs(x))) * 10) / 10;
}

// Đọc điểm: chấp nhận "7,5" hoặc "7.5"; hợp lệ 0–10, tối đa 1 chữ số thập phân.
export function parseScore(s) {
  const t = String(s ?? '').trim().replace(',', '.');
  if (!/^\d{1,2}(\.\d)?$/.test(t)) return NaN;
  const v = Number(t);
  return v >= 0 && v <= 10 ? v : NaN;
}

const ok = (v) => Number.isFinite(v) && v >= 0 && v <= 10;
const tenths = (v) => Math.round(v * 10);

// Tính trên số nguyên (đơn vị 0,1) rồi chia; trường hợp đúng ,x5 biểu diễn chính xác nên Math.round an toàn.
export function semesterAvg(tx = [], gk, ck) {
  const list = (Array.isArray(tx) ? tx : []).filter(ok).slice(0, 8);
  if (!list.length || !ok(gk) || !ok(ck)) return null;
  const sum = list.reduce((a, v) => a + tenths(v), 0) + 2 * tenths(gk) + 3 * tenths(ck);
  const den = list.length + 5;
  return { avg: Math.round(sum / den) / 10, raw: sum / den / 10, sum: sum / 10, den, n: list.length };
}

export function yearAvg(hk1, hk2) {
  if (!ok(hk1) || !ok(hk2)) return null;
  const sum = tenths(round1(hk1)) + 2 * tenths(round1(hk2));
  return { avg: Math.round(sum / 3) / 10, raw: sum / 30 };
}

// Mức theo Điều 9 k2 (không điều chỉnh). failed = số môn đánh giá bằng nhận xét "Chưa đạt".
function baseLevel(scores, failed) {
  const cnt = (t) => scores.filter((v) => v >= t).length;
  if (failed === 0 && scores.every((v) => v >= 6.5) && cnt(8) >= 6) return 3;
  if (failed === 0 && scores.every((v) => v >= 5) && cnt(6.5) >= 6) return 2;
  if (failed <= 1 && cnt(5) >= 6 && scores.every((v) => v >= 3.5)) return 1;
  return 0;
}

export function classify(scores = [], failed = 0) {
  const s = (Array.isArray(scores) ? scores : []).filter(ok);
  const f = Number.isFinite(failed) && failed > 0 ? Math.min(Math.floor(failed), 20) : 0;
  if (s.length < 6) return { level: null, tooFew: true, count: s.length };
  const base = baseLevel(s, f);
  // Điều 9 k3: thử "gỡ" đúng 1 môn (môn tính điểm lên 10, hoặc bớt 1 môn Chưa đạt).
  let best = -1, culprit = null;
  s.forEach((_, i) => {
    const l = baseLevel(s.map((v, j) => (j === i ? 10 : v)), f);
    if (l > best) { best = l; culprit = { type: 'score', index: i }; }
  });
  if (f > 0) {
    const l = baseLevel(s, f - 1);
    if (l > best) { best = l; culprit = { type: 'comment' }; }
  }
  const adjusted = best - base >= 2;
  return { level: adjusted ? base + 1 : base, base, adjusted, culprit: adjusted ? culprit : null, count: s.length, failed: f };
}
