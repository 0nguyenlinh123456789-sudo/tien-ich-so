import './helpers/json-hook.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { severance, unemployment } = await import('../src/lib/severance.js');

test('trợ cấp thôi việc: 63 tháng, lương 10tr → 27.500.000', () => {
  assert.equal(severance(10_000_000, 63).amount, 27_500_000);
});

test('trợ cấp thôi việc: dưới 12 tháng → 0', () => {
  const r = severance(10_000_000, 11);
  assert.equal(r.eligible, false);
  assert.equal(r.amount, 0);
});

test('thất nghiệp: 48 tháng → 4 tháng; trần vùng I 26.550.000', () => {
  assert.equal(unemployment(10_000_000, 48, 1).duration, 4);
  const r = unemployment(100_000_000, 48, 1);
  assert.equal(r.cap, 26_550_000);
  assert.equal(r.monthly, 26_550_000);
  assert.equal(r.capped, true);
});
