import { test } from 'node:test';
import assert from 'node:assert/strict';
import { textStats, stripVietnamese, TRANSFORMS, topWords } from '../src/lib/text-tools.js';

test('counts Vietnamese words and characters', () => {
  const s = 'Xin chào Việt Nam. Hôm nay trời đẹp!\n\nĐoạn hai.';
  const r = textStats(s);
  assert.equal(r.words, 10);
  assert.equal(r.sentences, 3);
  assert.equal(r.paragraphs, 2);
  assert.equal(textStats('').words, 0);
  assert.equal(textStats('  - ; ').words, 0);
  assert.equal(textStats('Việt').chars, 4);
});

test('transforms', () => {
  assert.equal(stripVietnamese('Đường phố Hà Nội'), 'Duong pho Ha Noi');
  assert.equal(TRANSFORMS.slug('Tính lương tăng ca 2026!'), 'tinh-luong-tang-ca-2026');
  assert.equal(TRANSFORMS.title('xin chào việt nam'), 'Xin Chào Việt Nam');
  assert.equal(TRANSFORMS.sentence('xin chào. hẹn gặp lại'), 'Xin chào. Hẹn gặp lại');
  assert.equal(TRANSFORMS.upper('đi'), 'ĐI');
  assert.deepEqual(topWords('a bb bb cc', 1), [['bb', 2]]);
});
