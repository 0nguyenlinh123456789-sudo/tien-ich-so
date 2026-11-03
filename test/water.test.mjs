import test from 'node:test';
import assert from 'node:assert/strict';
import { waterBill, drainageVat } from '../src/lib/water.js';

test('Hà Nội 15 m³ → 154.675', () => {
  assert.equal(Math.round(waterBill({ region: 'hanoi', m3: 15 }).total), 154_675);
});

test('VAT thoát nước: 8% ngày 31/12/2026, 10% ngày 01/01/2027', () => {
  assert.equal(drainageVat(new Date(2026, 11, 31, 12)), 0.08);
  assert.equal(drainageVat(new Date(2027, 0, 1, 12)), 0.1);
  assert.equal(waterBill({ region: 'hcm', m3: 10, people: 2, now: new Date(2026, 11, 31, 12) }).drainVat, 0.08);
  assert.equal(waterBill({ region: 'hcm', m3: 10, people: 2, now: new Date(2027, 0, 1, 12) }).drainVat, 0.1);
});
