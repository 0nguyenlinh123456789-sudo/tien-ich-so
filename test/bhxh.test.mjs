import './helpers/json-hook.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
const { roundYears, pensionRate } = await import('../src/lib/bhxh.js');

test('roundYears: lẻ 1-6 tháng = 0,5 năm; 7-11 tháng = 1 năm', () => {
  assert.equal(roundYears(10, 0), 10);
  assert.equal(roundYears(10, 1), 10.5);
  assert.equal(roundYears(10, 6), 10.5);
  assert.equal(roundYears(10, 7), 11);
});

test('pensionRate: nữ 15 năm 45%, nam 20 năm 45%, tối đa 75%', () => {
  assert.equal(pensionRate('f', 15), 45);
  assert.equal(pensionRate('m', 20), 45);
  assert.equal(pensionRate('m', 15), 40);
  assert.equal(pensionRate('f', 40), 75);
  assert.equal(pensionRate('m', 45), 75);
  assert.equal(pensionRate('f', 14), 0);
});
