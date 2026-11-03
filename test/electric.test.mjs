import test from 'node:test';
import assert from 'node:assert/strict';
import { electricBill, kwhFromBill } from '../src/lib/electric.js';

const sub = (k) => electricBill(k, 0.08).subtotal;

test('giá điện theo bậc (QĐ 1279/QĐ-BCT), chưa VAT: 0, 50, 51, 400, 401 kWh', () => {
  assert.equal(sub(0), 0);
  assert.equal(sub(50), 50 * 1984);
  assert.equal(sub(51), 50 * 1984 + 2050);
  const to400 = 50 * 1984 + 50 * 2050 + 100 * 2380 + 100 * 2998 + 100 * 3350;
  assert.equal(sub(400), to400);
  assert.equal(sub(401), to400 + 3460);
});

test('VAT áp vào tổng', () => {
  const r = electricBill(100, 0.1);
  assert.equal(Math.round(r.total), Math.round(r.subtotal * 1.1));
});

test('tính ngược từ hóa đơn', () => {
  for (const k of [30, 120, 250, 450]) {
    assert.ok(Math.abs(kwhFromBill(electricBill(k, 0.08).total, 0.08) - k) < 0.01);
    assert.ok(Math.abs(kwhFromBill(electricBill(k, 0.1).total, 0.1) - k) < 0.01);
  }
  assert.ok(kwhFromBill(0, 0.08) < 0.01);
});
