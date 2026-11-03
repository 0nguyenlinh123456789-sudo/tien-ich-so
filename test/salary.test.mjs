import './helpers/json-hook.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { progressiveTax, grossToNet } = await import('../src/lib/salary.js');

test('progressiveTax: mốc 10tr và 30tr', () => {
  assert.equal(progressiveTax(10_000_000).total, 500_000);
  assert.equal(progressiveTax(30_000_000).total, 2_500_000);
  assert.equal(progressiveTax(0).total, 0);
  assert.equal(progressiveTax(-5).total, 0);
});

test('grossToNet: Gross 20tr, vùng I, 0 người phụ thuộc → net 17.780.000', () => {
  assert.equal(grossToNet({ gross: 20_000_000, region: 1, dependents: 0 }).net, 17_780_000);
});
