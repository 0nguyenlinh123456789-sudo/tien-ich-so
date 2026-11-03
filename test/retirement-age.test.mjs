import test from 'node:test';
import assert from 'node:assert/strict';
import { retirementAge } from '../src/lib/retirement-age.js';

test('Nam sinh 3/1966 → 61 tuổi 9 tháng, nghỉ 12/2027', () => {
  const r = retirementAge({ sex: 'male', month: 3, year: 1966 });
  assert.equal(r.ageYears, 61);
  assert.equal(r.ageMonths, 9);
  assert.equal(r.retireMonth, 12);
  assert.equal(r.retireYear, 2027);
});

test('Nữ sinh 5/1975 → 60 tuổi, nghỉ 5/2035', () => {
  const r = retirementAge({ sex: 'female', month: 5, year: 1975 });
  assert.equal(r.ageYears, 60);
  assert.equal(r.ageMonths, 0);
  assert.equal(r.retireMonth, 5);
  assert.equal(r.retireYear, 2035);
});
