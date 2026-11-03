// Tạo chuỗi VietQR (chuẩn EMVCo MPM, NAPAS 247) để chuyển khoản tới số tài khoản.
// Cấu trúc TLV: 00 phiên bản, 01 tĩnh(11)/động(12), 38 thông tin người nhận (AID A000000727, BIN ngân hàng,
// số tài khoản, dịch vụ QRIBFTTA), 53 tiền tệ 704, 54 số tiền, 58 VN, 62/08 nội dung, 63 CRC16-CCITT-FALSE.

const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;

export function crc16(s) {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Nội dung chuyển khoản: bỏ dấu, chỉ giữ ký tự an toàn, tối đa 25 ký tự (nhiều ngân hàng cắt dài hơn).
export function cleanMemo(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 25);
}

export function vietQr({ bin, account, amount, memo }) {
  const acc = String(account || '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(String(bin))) throw new Error('bin');
  if (!/^[A-Za-z0-9]{1,19}$/.test(acc)) throw new Error('account');
  const amt = Math.round(Number(amount) || 0);
  const m = cleanMemo(memo);
  let s = tlv('00', '01') + tlv('01', amt > 0 ? '12' : '11');
  s += tlv('38', tlv('00', 'A000000727') + tlv('01', tlv('00', String(bin)) + tlv('01', acc)) + tlv('02', 'QRIBFTTA'));
  s += tlv('53', '704');
  if (amt > 0) s += tlv('54', String(amt));
  s += tlv('58', 'VN');
  if (m) s += tlv('62', tlv('08', m));
  s += '6304';
  return s + crc16(s);
}

// BIN theo danh sách ngân hàng NAPAS/VietQR (các ngân hàng phổ biến).
export const BANKS = [
  ['970436', 'Vietcombank'], ['970415', 'VietinBank'], ['970418', 'BIDV'], ['970405', 'Agribank'],
  ['970407', 'Techcombank'], ['970422', 'MB Bank'], ['970416', 'ACB'], ['970432', 'VPBank'],
  ['970423', 'TPBank'], ['970403', 'Sacombank'], ['970437', 'HDBank'], ['970441', 'VIB'],
  ['970443', 'SHB'], ['970431', 'Eximbank'], ['970426', 'MSB'], ['970448', 'OCB'],
  ['970440', 'SeABank'], ['970449', 'LPBank'], ['970454', 'Bản Việt (BVBank)'], ['970429', 'SCB'],
  ['970425', 'ABBANK'], ['970427', 'VietABank'], ['970428', 'Nam A Bank'], ['970409', 'Bac A Bank'],
  ['970412', 'PVcomBank'], ['970419', 'NCB'], ['970400', 'Saigonbank'], ['970430', 'PG Bank'],
  ['970438', 'BaoVietBank'], ['970406', 'Vikki Bank (DongA)'], ['970414', 'MBV (OceanBank)'], ['970452', 'KienlongBank']
];
