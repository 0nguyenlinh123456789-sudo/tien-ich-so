import './helpers/json-hook.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { annualSettlement } = await import('../src/lib/pit-annual.js');

test('quyết toán năm: 240tr, bảo hiểm 25,2tr → thuế 1.440.000', () => {
  const r = annualSettlement({ totalTaxableIncome: 240_000_000, insurance: 25_200_000, dependentMonths: 0, withheld: 0 });
  assert.equal(r.tax, 1_440_000);
});
