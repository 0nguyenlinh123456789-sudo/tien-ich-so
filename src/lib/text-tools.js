// Đếm từ/ký tự và biến đổi văn bản; chạy hoàn toàn trên trình duyệt.

export function stripVietnamese(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export function textStats(s) {
  const t = String(s);
  const words = t.trim() ? t.trim().split(/\s+/u).filter((w) => /[\p{L}\p{N}]/u.test(w)) : [];
  const chars = [...t.normalize('NFC')].length;
  const noSpace = [...t.normalize('NFC').replace(/\s/g, '')].length;
  const sentences = (t.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu) || []).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
  const paragraphs = t.split(/\n\s*\n/).filter((x) => x.trim()).length;
  const lines = t ? t.split('\n').length : 0;
  // Tốc độ đọc trung bình ~200 từ/phút, nói ~130 từ/phút.
  return { words: words.length, chars, noSpace, sentences, paragraphs, lines, readMin: words.length / 200, speakMin: words.length / 130 };
}

export function topWords(s, n = 8) {
  const counts = new Map();
  for (const w of String(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []) if (w.length > 1) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}

export const TRANSFORMS = {
  upper: (s) => s.toLocaleUpperCase('vi'),
  lower: (s) => s.toLocaleLowerCase('vi'),
  title: (s) => s.toLocaleLowerCase('vi').replace(/(^|\s)(\p{L})/gu, (_, a, b) => a + b.toLocaleUpperCase('vi')),
  sentence: (s) => s.toLocaleLowerCase('vi').replace(/(^\s*|[.!?…]\s+)(\p{L})/gu, (_, a, b) => a + b.toLocaleUpperCase('vi')),
  strip: stripVietnamese,
  slug: (s) => stripVietnamese(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  spaces: (s) => s.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim()
};
