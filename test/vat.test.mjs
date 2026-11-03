import test from 'node:test';
import assert from 'node:assert/strict';
import { currentVat, vatCutActive, VAT_CUT_UNTIL } from '../src/lib/vat.js';

test('currentVat: 8% đến hết 31/12/2026, sau đó 10%', () => {
  assert.equal(currentVat(new Date(2025, 6, 1)), 0.08);
  assert.equal(currentVat(new Date(2026, 11, 31, 23, 59)), 0.08);
  assert.equal(currentVat(new Date(2027, 0, 1, 0, 0)), 0.1);
  assert.equal(vatCutActive(new Date(2027, 5, 1)), false);
  assert.equal(VAT_CUT_UNTIL.getFullYear(), 2026);
});

test('currentVat: ngày không hợp lệ không ra NaN', () => {
  assert.ok([0.08, 0.1].includes(currentVat(new Date('x'))));
});
