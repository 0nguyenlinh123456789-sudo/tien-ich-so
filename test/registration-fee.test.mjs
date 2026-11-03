import test from 'node:test';
import assert from 'node:assert/strict';
import { registrationFee } from '../src/lib/registration-fee.js';

test('xe máy 40tr, khu vực II → 1.200.000', () => {
  assert.equal(registrationFee({ vehicle: 'moto', price: 40_000_000, region: '2' }).total, 1_200_000);
});

test('pickup khu vực I, 1 tỷ, mức ô tô 12% → 72.500.000', () => {
  assert.equal(registrationFee({ vehicle: 'pickup', price: 1_000_000_000, carRate: 0.12, region: '1' }).total, 72_500_000);
});

test('ô tô điện: 0% đến hết 28/02/2027, từ 01/3/2027 hết miễn', () => {
  const a = registrationFee({ vehicle: 'ev', price: 1e9, carRate: 0.1, now: new Date(2027, 1, 28, 12) });
  assert.equal(a.rate, 0);
  assert.equal(a.evExpired, false);
  const b = registrationFee({ vehicle: 'ev', price: 1e9, carRate: 0.1, now: new Date(2027, 2, 1, 12) });
  assert.notEqual(b.rate, 0);
  assert.equal(b.evExpired, true);
});
