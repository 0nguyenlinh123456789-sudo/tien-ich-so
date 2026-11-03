// Thuế suất GTGT chung theo thời điểm.
// Giảm 10% -> 8% từ 01/7/2025 đến hết 31/12/2026: Nghị quyết 204/2025/QH15, Nghị định 174/2025/NĐ-CP
// (trừ một số nhóm: viễn thông, tài chính - ngân hàng, chứng khoán, hàng hóa trong phụ lục...).
// Sau ngày này trở về 10% (Luật Thuế GTGT 48/2024/QH15) trừ khi có nghị quyết gia hạn.
export const VAT_CUT_UNTIL = new Date(2026, 11, 31, 23, 59, 59, 999); // hết 31/12/2026 (giờ địa phương)

export function vatCutActive(now = new Date()) {
  const t = now instanceof Date ? now.getTime() : NaN;
  return Number.isFinite(t) ? t <= VAT_CUT_UNTIL.getTime() : true;
}

export function currentVat(now = new Date()) {
  return vatCutActive(now) ? 0.08 : 0.1;
}
