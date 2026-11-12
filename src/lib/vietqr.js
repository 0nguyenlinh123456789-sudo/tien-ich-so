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
import qrcode from 'qrcode-generator';

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

const ALIAS_BIN = {
  vcb: '970436', vietcombank: '970436',
  ctg: '970415', icb: '970415', vietinbank: '970415', vietin: '970415',
  bidv: '970418',
  agribank: '970405', vba: '970405',
  tcb: '970407', techcombank: '970407',
  mb: '970422', mbbank: '970422',
  acb: '970416',
  vpb: '970432', vpbank: '970432',
  tpb: '970423', tpbank: '970423',
  stb: '970403', sacombank: '970403',
  hdb: '970437', hdbank: '970437',
  vib: '970441',
  shb: '970443',
  eib: '970431', eximbank: '970431',
  msb: '970426',
  ocb: '970448',
  seabank: '970440',
  lpb: '970449', lpbank: '970449',
  bvbank: '970454', banviet: '970454',
  scb: '970429',
};

export function resolveBankBin(bankNameOrBin) {
  const raw = String(bankNameOrBin || '').trim();
  if (/^\d{6}$/.test(raw)) return raw;
  const key = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (ALIAS_BIN[key]) return ALIAS_BIN[key];
  const found = BANKS.find(([bin, name]) => bin === raw || name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(key) || key.includes(name.toLowerCase().replace(/[^a-z0-9]/g, '')));
  return found ? found[0] : '970415';
}

export function buildVietQrSvg({ bank, bin, account, amount = 0, memo = '' } = {}) {
  const acc = String(account || '').replace(/\s+/g, '');
  if (!acc) return '';
  const bankBin = bin || resolveBankBin(bank);
  try {
    const payload = vietQr({ bin: bankBin, account: acc, amount, memo });
    const q = qrcode(0, 'M');
    q.addData(payload);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  } catch {
    return '';
  }
}
