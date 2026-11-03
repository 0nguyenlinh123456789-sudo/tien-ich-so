import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nightRate, hourlyWage, overtimePay } from '../src/lib/overtime.js';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test('night overtime rates match Điều 57 NĐ 145/2020', () => {
  near(nightRate('weekday'), 2.0);
  near(nightRate('weekday', true), 2.1);
  near(nightRate('weekend'), 2.7);
  near(nightRate('holiday'), 3.9);
});

test('hourly wage and totals', () => {
  assert.equal(hourlyWage(10_400_000, 26, 8), 50_000);
  const r = overtimePay({ salary: 10_400_000, hours: { weekday: 10, weekend: 8, holiday: 8, night: 4 } });
  // 10×75k + 8×100k + 8×150k + 4×15k
  assert.equal(Math.round(r.total), 750_000 + 800_000 + 1_200_000 + 60_000);
  assert.equal(r.otHours, 26);
  assert.equal(r.overLimit, false);
  assert.equal(overtimePay({ salary: 1, hours: { weekday: 41 } }).overLimit, true);
});
