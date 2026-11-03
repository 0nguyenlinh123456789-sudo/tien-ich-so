import test from 'node:test';
import assert from 'node:assert/strict';
import { round1, semesterAvg } from '../src/lib/grade-avg.js';

test('round1: 6.45 → 6.5', () => {
  assert.equal(round1(6.45), 6.5);
  assert.ok(Number.isNaN(round1(NaN)));
});

test('semesterAvg [8,7,9], GK 7.5, CK 8 → 7.9', () => {
  assert.equal(semesterAvg([8, 7, 9], 7.5, 8).avg, 7.9);
  assert.equal(semesterAvg([], 7, 8), null);
});
