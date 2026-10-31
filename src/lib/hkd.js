// Thuế hộ kinh doanh 2026.
// - Ngưỡng doanh thu không chịu thuế: Luật Thuế TNCN 109/2025/QH15 Điều 7 (gốc 500 triệu),
//   nâng lên 1 tỷ đồng bởi NĐ 141/2026/NĐ-CP, áp dụng từ 01/01/2026.
// - Bỏ thuế khoán, bỏ lệ phí môn bài từ 01/01/2026: NQ 198/2025/QH15 Điều 10.
// - GTGT theo phương pháp trực tiếp trên doanh thu: Luật Thuế GTGT 48/2024/QH15.
// - Cho thuê bất động sản: (R − ngưỡng) × 5%, không có phương pháp thu nhập (Điều 7 khoản 4 Luật 109/2025/QH15).
export const THRESHOLD = 1_000_000_000;
export const TIER_3B = 3_000_000_000;
export const TIER_50B = 50_000_000_000;

// vat/pit: tỷ lệ; vatEst: tỷ lệ GTGT là ước tính; rent: cho thuê BĐS.
export const SECTORS = [
  { id: 'goods', vat: 0.01, pit: 0.005, vi: 'Phân phối, cung cấp hàng hóa', en: 'Distribution of goods' },
  { id: 'service', vat: 0.05, pit: 0.02, vi: 'Dịch vụ, xây dựng không bao thầu nguyên vật liệu', en: 'Services, construction without materials' },
  { id: 'production', vat: 0.03, pit: 0.015, vi: 'Sản xuất, vận tải, dịch vụ gắn với hàng hóa, xây dựng có bao thầu nguyên vật liệu', en: 'Manufacturing, transport, goods-related services, construction with materials' },
  { id: 'agency', vat: 0.05, pit: 0.05, vi: 'Cho thuê tài sản; đại lý bảo hiểm, xổ số, bán hàng đa cấp', en: 'Asset leasing; insurance, lottery, multi-level agents' },
  { id: 'digital', vat: 0.05, pit: 0.05, vatEst: true, vi: 'Nội dung số: quảng cáo, game, phim, nhạc số', en: 'Digital content: ads, games, films, music' },
  { id: 'other', vat: 0.02, pit: 0.01, vi: 'Hoạt động kinh doanh khác', en: 'Other business activities' },
  { id: 'rent', vat: 0.05, pit: 0.05, vatEst: true, rent: true, vi: 'Cho thuê bất động sản (không phải lưu trú)', en: 'Real-estate leasing (non-accommodation)' },
];

const safe = (x) => (Number.isFinite(x) && x > 0 ? x : 0);

export function hkdTax(revenue, sectorId = 'goods', expenses = 0) {
  const R = safe(revenue);
  const C = safe(expenses);
  const s = SECTORS.find((x) => x.id === sectorId) ?? SECTORS[0];
  const base = { sector: s, revenue: R, expenses: C, exempt: R <= THRESHOLD };
  if (base.exempt) return { ...base, vat: 0, pit: 0, total: 0, monthly: 0, mode: 'exempt' };

  const vat = R * s.vat;
  let pit, mode, rateAmt = null, incomeAmt = null, lower = null, incomeRate = null;
  if (s.rent) {
    mode = 'rent';
    pit = (R - THRESHOLD) * s.pit;
  } else if (R <= TIER_3B) {
    mode = 'choice';
    incomeRate = 0.15;
    rateAmt = (R - THRESHOLD) * s.pit;
    incomeAmt = Math.max(0, R - C) * incomeRate;
    lower = incomeAmt < rateAmt ? 'income' : 'rate';
    pit = Math.min(rateAmt, incomeAmt);
  } else {
    mode = 'income';
    incomeRate = R <= TIER_50B ? 0.17 : 0.2;
    pit = Math.max(0, R - C) * incomeRate;
  }
  const total = vat + pit;
  // Trên 3 tỷ bắt buộc phương pháp thu nhập: chi phí = 0 cho ra số thuế phóng đại → cảnh báo.
  const missingExpenses = mode === 'income' && C === 0;
  return { ...base, vat, pit, total, monthly: total / 12, mode, rateAmt, incomeAmt, lower, incomeRate, missingExpenses };
}
