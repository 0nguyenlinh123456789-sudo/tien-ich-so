import test from 'node:test';
import assert from 'node:assert/strict';
import { solarToLunar } from '../src/lib/lunar.js';

const isTet = (d, m, y) => { const l = solarToLunar(d, m, y); return l.day === 1 && l.month === 1 && l.leap === 0; };

test('Tết 2026 = 17/02/2026', () => {
  assert.ok(isTet(17, 2, 2026));
  assert.equal(solarToLunar(17, 2, 2026).year, 2026);
  assert.ok(!isTet(16, 2, 2026));
});

test('Tết 2027 = 06/02/2027', () => {
  assert.ok(isTet(6, 2, 2027));
  assert.equal(solarToLunar(6, 2, 2027).year, 2027);
});
