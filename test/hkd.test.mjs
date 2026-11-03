import test from 'node:test';
import assert from 'node:assert/strict';
import { hkdTax } from '../src/lib/hkd.js';

test('HKD hàng hóa 2 tỷ → GTGT 20tr, TNCN 5tr', () => {
  const r = hkdTax(2_000_000_000, 'goods');
  assert.equal(r.vat, 20_000_000);
  assert.equal(r.pit, 5_000_000);
});

test('HKD doanh thu 1 tỷ → miễn thuế', () => {
  const r = hkdTax(1_000_000_000, 'goods');
  assert.equal(r.exempt, true);
  assert.equal(r.total, 0);
});
