import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vietQr, crc16, cleanMemo } from '../src/lib/vietqr.js';

test('VietQR payload matches a published sample (incl. CRC)', () => {
  assert.equal(vietQr({ bin: '970407', account: '9602091996' }), '00020101021138540010A00000072701240006970407011096020919960208QRIBFTTA53037045802VN630434A0');
});

test('dynamic QR with amount and memo has valid CRC', () => {
  const s = vietQr({ bin: '970436', account: '0123456789', amount: 150000, memo: 'Tiền nhà tháng 11' });
  assert.ok(s.startsWith('000201010212'));
  assert.ok(s.includes('5406150000'));
  assert.ok(s.includes('62210817Tien nha thang 11'));
  assert.equal(crc16(s.slice(0, -4)), s.slice(-4));
  assert.equal(cleanMemo('Đặt cọc #12 (A)'), 'Dat coc 12 A');
  assert.throws(() => vietQr({ bin: '97', account: '1' }));
});
