// In-browser photo & ID portrait studio:
// - Smart background replacement (White, Passport Blue, Sky Blue, Studio Gray, Custom color) with edge feathering
// - Standard ID photo sizes (2×3 cm, 3×4 cm, 4×6 cm, 3.5×4.5 cm Passport, 1:1 Avatar) & custom pixel dimensions
// - Real-time file size (KB) indicator & automatic target-KB compression (≤50KB, ≤100KB, ≤200KB, ≤500KB)
// - Crop, zoom/pan, rotate/flip, light/color adjustments, filter presets, and text layers.
import { escapeHtml as e, downloadBlob } from './format.js';

const RATIOS = [
  ['orig', 'Gốc', 'Original', 0],
  ['3/4', '3×4 cm (Ảnh thẻ)', '3×4 ID Photo', 472],
  ['2/3', '4×6 cm (Ảnh thẻ)', '4×6 ID Photo', 600],
  ['7/9', '3.5×4.5 (Hộ chiếu)', '3.5×4.5 Passport', 500],
  ['1', '1:1 (Avatar)', '1:1 Square', 600],
  ['4/3', '4:3', '4:3', 1200],
  ['16/9', '16:9', '16:9', 1400]
];

const BG_PRESETS = [
  { key: 'none', vi: 'Giữ nền gốc', en: 'Original', color: '' },
  { key: 'white', vi: 'Nền Trắng', en: 'White', color: '#ffffff' },
  { key: 'blue', vi: 'Xanh Chuẩn', en: 'ID Blue', color: '#1d70b8' },
  { key: 'sky', vi: 'Xanh Nhạt', en: 'Sky Blue', color: '#38bdf8' },
  { key: 'gray', vi: 'Xám Studio', en: 'Studio Gray', color: '#e2e8f0' },
  { key: 'red', vi: 'Đỏ Hồ Sơ', en: 'ID Red', color: '#dc2626' },
  { key: 'transparent', vi: 'Trong suốt (PNG)', en: 'Transparent', color: 'transparent' }
];

const KB_TARGETS = [
  [0, 'Tự động', 'Auto'],
  [50, '≤ 50 KB', '≤ 50 KB'],
  [100, '≤ 100 KB', '≤ 100 KB'],
  [200, '≤ 200 KB', '≤ 200 KB'],
  [500, '≤ 500 KB', '≤ 500 KB']
];

const PRESETS = {
  none: { vi: 'Gốc', en: 'None', v: {} },
  idclean: { vi: 'Sáng rõ (Ảnh thẻ)', en: 'ID Bright', v: { brightness: 106, contrast: 108, saturate: 105 } },
  vivid: { vi: 'Rực rỡ', en: 'Vivid', v: { contrast: 115, saturate: 135 } },
  warm: { vi: 'Ấm áp', en: 'Warm', v: { sepia: 18, saturate: 115, brightness: 104 } },
  cool: { vi: 'Lạnh', en: 'Cool', v: { hue: -10, saturate: 92, brightness: 104 } },
  mono: { vi: 'Đen trắng', en: 'B&W', v: { grayscale: 100, contrast: 118 } },
  film: { vi: 'Film cổ', en: 'Vintage', v: { sepia: 40, contrast: 92, brightness: 105, saturate: 82 } },
  drama: { vi: 'Kịch tính', en: 'Drama', v: { contrast: 138, brightness: 94, saturate: 108 } }
};

const BASE = { brightness: 100, contrast: 100, saturate: 100, hue: 0, sepia: 0, grayscale: 0, blur: 0, vignette: 0 };
const FONTS = [['Be Vietnam Pro', 'Be Vietnam Pro'], ['Lora', 'Lora (có chân)'], ['Impact', 'Impact'], ['Courier New', 'Mono']];

export const defaultState = () => ({
  ratio: 'orig',
  zoom: 1,
  panX: 0,
  panY: 0,
  rot: 0,
  flip: false,
  preset: 'none',
  adj: { ...BASE },
  texts: [],
  radius: 0,
  bgMode: 'none',
  bgColor: '#ffffff',
  bgTolerance: 38,
  bgFeather: 2,
  brushMode: 'pan', // 'pan' | 'erase' | 'keep'
  brushSize: 28,
  brushStrokes: [],
  outWidth: 0,
  targetKb: 0,
  quality: 88,
  format: 'image/jpeg'
});

const ratioOf = (r, img, rot) => {
  if (r === 'orig') return rot % 180 ? img.height / img.width : img.width / img.height;
  const [a, b] = r.split('/').map(Number);
  return a / (b || 1);
};

const filterOf = (a) =>
  `brightness(${a.brightness}%) contrast(${a.contrast}%) saturate(${a.saturate}%) hue-rotate(${a.hue}deg) sepia(${a.sepia}%) grayscale(${a.grayscale}%)` +
  (a.blur ? ` blur(${a.blur}px)` : '');

const hexToRgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return [255, 255, 255];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// --- AI Neural Portrait Segmentation (@mediapipe/tasks-vision ImageSegmenter) ---
let aiSegmenter = null;
let aiLoadingPromise = null;
const aiReadyListeners = new Set();

export function isAiSegmenterReady() {
  return !!aiSegmenter;
}

export function onAiSegmenterReady(cb) {
  if (aiSegmenter) { cb(true); return () => {}; }
  aiReadyListeners.add(cb);
  ensureAiSegmenter();
  return () => aiReadyListeners.delete(cb);
}

export async function ensureAiSegmenter() {
  if (aiSegmenter) return aiSegmenter;
  if (aiLoadingPromise) return aiLoadingPromise;
  aiLoadingPromise = (async () => {
    try {
      const visionUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
      const vision = await import(/* @vite-ignore */ visionUrl);
      const fileset = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      const modelUrls = [
        'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
        'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation_general.tflite'
      ];
      for (const modelAssetPath of modelUrls) {
        for (const delegate of ['GPU', 'CPU']) {
          try {
            aiSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
              baseOptions: { modelAssetPath, delegate },
              runningMode: 'IMAGE',
              outputCategoryMask: false,
              outputConfidenceMasks: true
            });
            break;
          } catch { /* try next delegate/url */ }
        }
        if (aiSegmenter) break;
      }
    } catch { /* offline fallback */ }
    aiReadyListeners.forEach((fn) => { try { fn(!!aiSegmenter); } catch {} });
    aiReadyListeners.clear();
    return aiSegmenter;
  })();
  return aiLoadingPromise;
}

// Compute foreground (person) probability 0..1 using MediaPipe AI + Joint Bilateral Edge Matting
function computeAiForegroundMask(sourceCanvas, d, w, h) {
  if (!aiSegmenter) return null;
  try {
    // Cache raw AI probability on canvas if geometry matches
    let mw = w, mh = h;
    const maxDim = 512;
    if (Math.max(w, h) > maxDim) {
      const sc = maxDim / Math.max(w, h);
      mw = Math.max(64, Math.round(w * sc));
      mh = Math.max(64, Math.round(h * sc));
    }
    const workCv = document.createElement('canvas');
    workCv.width = mw;
    workCv.height = mh;
    workCv.getContext('2d').drawImage(sourceCanvas, 0, 0, mw, mh);

    const segResult = aiSegmenter.segment(workCv);
    const masks = segResult?.confidenceMasks;
    if (!masks || !masks.length) {
      segResult?.close?.();
      return null;
    }
    const chosenMask = masks.length >= 2 ? masks[1] : masks[0];
    const rawArr = new Float32Array(chosenMask.getAsFloat32Array());
    segResult.close?.();

    // Auto-check polarity (ensure 1.0 = person in center, 0.0 = outer corners)
    const cornerAvg = (
      rawArr[0] +
      rawArr[mw - 1] +
      rawArr[Math.floor(mh * 0.15) * mw] +
      rawArr[Math.floor(mh * 0.15) * mw + mw - 1]
    ) / 4;
    const centerAvg = (
      rawArr[Math.floor(mh * 0.45) * mw + Math.floor(mw * 0.5)] +
      rawArr[Math.floor(mh * 0.65) * mw + Math.floor(mw * 0.5)] +
      rawArr[Math.floor(mh * 0.35) * mw + Math.floor(mw * 0.5)]
    ) / 3;
    const invert = cornerAvg > centerAvg + 0.15;

    // Bilinear upsample from (mw x mh) to (w x h)
    const fg = new Float32Array(w * h);
    const xRatio = (mw - 1) / Math.max(1, w - 1);
    const yRatio = (mh - 1) / Math.max(1, h - 1);
    for (let y = 0; y < h; y++) {
      const gy = y * yRatio;
      const y0 = gy | 0;
      const y1 = Math.min(mh - 1, y0 + 1);
      const wy = gy - y0;
      const row0 = y0 * mw, row1 = y1 * mw;
      const dstRow = y * w;
      for (let x = 0; x < w; x++) {
        const gx = x * xRatio;
        const x0 = gx | 0;
        const x1 = Math.min(mw - 1, x0 + 1);
        const wx = gx - x0;
        const v00 = rawArr[row0 + x0], v10 = rawArr[row0 + x1];
        const v01 = rawArr[row1 + x0], v11 = rawArr[row1 + x1];
        const val = (v00 * (1 - wx) + v10 * wx) * (1 - wy) + (v01 * (1 - wx) + v11 * wx) * wy;
        fg[dstRow + x] = invert ? 1 - val : val;
      }
    }

    // Joint Bilateral Edge Filter: snaps coarse neural boundary to full-res hair strands & clothes edges
    const refined = new Float32Array(fg);
    const radius = 3;
    const invColorSigmaSq = 1 / (2 * 26 * 26);
    for (let y = radius; y < h - radius; y++) {
      const row = y * w;
      for (let x = radius; x < w - radius; x++) {
        const p = row + x;
        const cProb = fg[p];
        // Only refine pixels near the transition boundary
        if (cProb <= 0.03 || cProb >= 0.97) continue;
        const idx = p * 4;
        const cr = d[idx], cg = d[idx + 1], cb = d[idx + 2];
        let wSum = 0, pSum = 0;
        for (let dy = -radius; dy <= radius; dy += 1) {
          const nRow = (y + dy) * w;
          for (let dx = -radius; dx <= radius; dx += 1) {
            const np = nRow + x + dx;
            const nIdx = np * 4;
            const dr = cr - d[nIdx], dg = cg - d[nIdx + 1], db = cb - d[nIdx + 2];
            const cDistSq = (dr * dr + dg * dg + db * db) * 0.333;
            const weight = Math.exp(-cDistSq * invColorSigmaSq);
            wSum += weight;
            pSum += fg[np] * weight;
          }
        }
        if (wSum > 0) refined[p] = pSum / wSum;
      }
    }
    return refined;
  } catch {
    return null;
  }
}

// Smart AI + Edge-Matting Portrait Background Replacement
export function replaceBackgroundCanvas(sourceCanvas, bgHex, tolerance = 38, feather = 2, brushStrokes = null, cachedAiFg = null) {
  const w = sourceCanvas.width, h = sourceCanvas.height;
  if (!w || !h || !bgHex) return null;
  const ctx = sourceCanvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const isTransparentOut = bgHex === 'transparent';
  const [br, bg, bb] = isTransparentOut ? [255, 255, 255] : hexToRgb(bgHex);

  // 1. If image already has transparent background (e.g. PNG cutout), composite over studio backdrop keeping character 100% intact
  let transBorder = 0, totalBorder = 0;
  const stepX = Math.max(1, Math.floor(w / 24));
  for (let x = 0; x < w; x += stepX) {
    totalBorder++;
    if (d[x * 4 + 3] < 220) transBorder++;
  }
  if (transBorder >= Math.max(3, Math.floor(totalBorder * 0.25)) && (!brushStrokes || !brushStrokes.length)) {
    if (!isTransparentOut) {
      for (let p = 0; p < w * h; p++) {
        const i = p * 4;
        const alpha = d[i + 3] / 255;
        if (alpha >= 0.995) continue;
        const yRatio = ((p / w) | 0) / h;
        const shade = bgHex.toLowerCase() === '#ffffff' ? 1 : (1.03 - yRatio * 0.06);
        const tr = Math.min(255, br * shade), tg = Math.min(255, bg * shade), tb = Math.min(255, bb * shade);
        d[i] = Math.round(d[i] * alpha + tr * (1 - alpha));
        d[i + 1] = Math.round(d[i + 1] * alpha + tg * (1 - alpha));
        d[i + 2] = Math.round(d[i + 2] * alpha + tb * (1 - alpha));
        d[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    return null;
  }

  // 2. Primary Engine: MediaPipe AI Portrait Segmentation + Joint Bilateral Edge Matting
  const aiFg = (cachedAiFg && cachedAiFg.length === w * h) ? cachedAiFg : computeAiForegroundMask(sourceCanvas, d, w, h);
  let bgMask = null; // 1 = background, 0 = foreground person

  if (aiFg) {
    bgMask = new Float32Array(w * h);
    // Map tolerance (10..85, default 38) to foreground probability cutoff (0.28..0.75)
    const cutoff = 0.22 + (tolerance / 100) * 0.56;
    const halfBand = Math.max(0.04, 0.04 + feather * 0.055);
    const lo = Math.max(0.02, cutoff - halfBand);
    const hi = Math.min(0.98, cutoff + halfBand);
    const span = Math.max(0.01, hi - lo);

    for (let p = 0; p < w * h; p++) {
      const fp = aiFg[p];
      if (fp <= lo) {
        bgMask[p] = 1;
      } else if (fp >= hi) {
        bgMask[p] = 0;
      } else {
        // Smooth Hermite S-curve transition for natural hair & shoulder edges
        const t = (fp - lo) / span;
        const fgAlpha = t * t * (3 - 2 * t);
        bgMask[p] = 1 - fgAlpha;
      }
    }
  } else {
    // 3. Fallback Engine (when AI model is still downloading or offline): Multi-seed border flood-fill with portrait protection
    const rawSamples = [];
    for (let k = 0; k <= 12; k++) {
      const sx = Math.min(w - 2, Math.max(1, Math.round((w - 3) * (k / 12))));
      rawSamples.push([sx, 2]);
    }
    for (let k = 1; k <= 5; k++) {
      const sy = Math.min(h - 2, Math.max(1, Math.round(h * 0.36 * (k / 5))));
      rawSamples.push([2, sy], [w - 3, sy]);
    }
    const candidates = [];
    for (const [sx, sy] of rawSamples) {
      const idx = (sy * w + sx) * 4;
      if (d[idx + 3] >= 128) candidates.push([d[idx], d[idx + 1], d[idx + 2]]);
    }
    if (!candidates.length) return null;

    let bestIdx = 0, bestScore = 1e12;
    for (let i = 0; i < candidates.length; i++) {
      let sum = 0;
      for (let j = 0; j < candidates.length; j++) {
        const dr = candidates[i][0] - candidates[j][0], dg = candidates[i][1] - candidates[j][1], db = candidates[i][2] - candidates[j][2];
        sum += Math.sqrt((dr * dr + dg * dg + db * db) / 3);
      }
      if (sum < bestScore) { bestScore = sum; bestIdx = i; }
    }
    const ref = candidates[bestIdx];
    const seeds = candidates.filter((c) => {
      const dr = c[0] - ref[0], dg = c[1] - ref[1], db = c[2] - ref[2];
      return Math.sqrt((dr * dr + dg * dg + db * db) / 3) <= 38;
    });
    if (!seeds.length) seeds.push(ref);
    const refIsSkin = ref[0] > 110 && ref[1] > 60 && ref[2] > 40 && ref[0] > ref[1] && ref[1] > ref[2] && (ref[0] - ref[2]) > 28;

    const colorDist = (i) => {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      let minD = 1e9;
      for (let s = 0; s < seeds.length; s++) {
        const sr = seeds[s][0], sg = seeds[s][1], sb = seeds[s][2];
        const dr = r - sr, dg = g - sg, db = b - sb;
        const dist = Math.sqrt((dr * dr + dg * dg + db * db) / 3) + (Math.abs((r - g) - (sr - sg)) + Math.abs((g - b) - (sg - sb))) * 0.22;
        if (dist < minD) minD = dist;
      }
      return minD;
    };

    const subjectWeight = (x, y) => {
      const nx = (x / w - 0.5) * 2, ny = y / h;
      const headD = Math.pow(nx / 0.42, 2) + Math.pow((ny - 0.36) / 0.22, 2);
      const bodyD = Math.pow(nx / 0.68, 2) + Math.pow((ny - 0.78) / 0.34, 2);
      const minEll = Math.min(headD, bodyD);
      return minEll >= 1 ? 0 : Math.pow(1 - minEll, 1.4);
    };

    const runFloodFill = (tolVal, enforceSilhouette) => {
      const baseTol = 6 + tolVal * 0.44;
      const maxStep = Math.max(7, 4 + tolVal * 0.19);
      const visited = new Uint8Array(w * h);
      const mask = new Float32Array(w * h);
      const queue = new Int32Array(w * h);
      let qHead = 0, qTail = 0;

      const tryPush = (x, y, fromIdx) => {
        const pos = y * w + x;
        if (visited[pos]) return;
        const idx = pos * 4;
        const sw = subjectWeight(x, y);
        if (enforceSilhouette && sw > 0.28) return;
        if (!refIsSkin && sw > 0.08) {
          const r = d[idx], g = d[idx + 1], b = d[idx + 2];
          if (r > 95 && g > 45 && b > 25 && r > g && g >= b - 8 && (r - Math.min(g, b)) > 22) return;
        }
        if (fromIdx >= 0) {
          const step = (Math.abs(d[idx] - d[fromIdx]) + Math.abs(d[idx + 1] - d[fromIdx + 1]) + Math.abs(d[idx + 2] - d[fromIdx + 2])) / 3;
          if (step > maxStep * (1 - sw * 0.55)) return;
        }
        if (colorDist(idx) <= baseTol * (1 - sw * 0.65)) {
          visited[pos] = 1;
          mask[pos] = 1;
          queue[qTail++] = pos;
        }
      };
      for (let x = 0; x < w; x++) tryPush(x, 0, -1);
      for (let y = 1; y < Math.floor(h * 0.86); y++) { tryPush(0, y, -1); tryPush(w - 1, y, -1); }
      while (qHead < qTail) {
        const pos = queue[qHead++];
        const idx = pos * 4;
        const x = pos % w, y = (pos - x) / w;
        if (x > 0 && !visited[pos - 1]) tryPush(x - 1, y, idx);
        if (x < w - 1 && !visited[pos + 1]) tryPush(x + 1, y, idx);
        if (y > 0 && !visited[pos - w]) tryPush(x, y - 1, idx);
        if (y < h - 1 && !visited[pos + w]) tryPush(x, y + 1, idx);
      }
      return mask;
    };

    bgMask = runFloodFill(tolerance, false);
    let centerBg = 0, centerTotal = 0;
    for (let y = Math.floor(h * 0.20); y < Math.ceil(h * 0.84); y += 2) {
      for (let x = Math.floor(w * 0.28); x < Math.ceil(w * 0.72); x += 2) {
        centerTotal++;
        if (bgMask[y * w + x] > 0.5) centerBg++;
      }
    }
    if (centerTotal > 0 && centerBg / centerTotal > 0.42) {
      bgMask = runFloodFill(Math.min(28, tolerance * 0.6), true);
    }
  }

  // 4. Apply Manual Touch-Up Brush Strokes ('erase' = background 1, 'keep' = foreground 0)
  if (Array.isArray(brushStrokes) && brushStrokes.length) {
    for (const st of brushStrokes) {
      const cx = st.x * w, cy = st.y * h;
      const rad = Math.max(4, (st.r / 100) * Math.min(w, h));
      const radSq = rad * rad;
      const targetVal = st.mode === 'erase' ? 1 : 0;
      const x0 = Math.max(0, Math.floor(cx - rad)), x1 = Math.min(w - 1, Math.ceil(cx + rad));
      const y0 = Math.max(0, Math.floor(cy - rad)), y1 = Math.min(h - 1, Math.ceil(cy + rad));
      for (let y = y0; y <= y1; y++) {
        const dy = y - cy;
        const row = y * w;
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx;
          const dSq = dx * dx + dy * dy;
          if (dSq > radSq) continue;
          const strength = 1 - Math.pow(dSq / radSq, 1.5);
          bgMask[row + x] = bgMask[row + x] * (1 - strength) + targetVal * strength;
        }
      }
    }
  }

  // 5. Soft edge feathering along boundary
  const passes = Math.max(1, Math.min(4, Math.round(feather)));
  for (let pass = 0; pass < passes; pass++) {
    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const p = row + x;
        const m = bgMask[p];
        const nSum = bgMask[p - 1] + bgMask[p + 1] + bgMask[p - w] + bgMask[p + w];
        if ((m === 1 && nSum < 4) || (m === 0 && nSum > 0) || (m > 0 && m < 1)) {
          bgMask[p] = (nSum + m * 2) / 6;
        }
      }
    }
  }

  // 6. Hair & Edge Color Decontamination + Backdrop Compositing
  for (let y = 0; y < h; y++) {
    const row = y * w;
    const yRatio = y / h;
    const shade = bgHex.toLowerCase() === '#ffffff' ? 1 : (1.03 - yRatio * 0.06);
    const tr = Math.min(255, br * shade), tg = Math.min(255, bg * shade), tb = Math.min(255, bb * shade);

    for (let x = 0; x < w; x++) {
      const p = row + x;
      const a = bgMask[p]; // 1 = background, 0 = foreground
      if (a <= 0.005) continue;
      const i = p * 4;

      if (isTransparentOut) {
        d[i + 3] = Math.round(d[i + 3] * (1 - a));
        continue;
      }

      let fgR = d[i], fgG = d[i + 1], fgB = d[i + 2];
      // Decontaminate semi-transparent hair/shoulder edge pixels by pulling color from nearby solid interior foreground
      if (a > 0.06 && a < 0.92 && x >= 4 && x < w - 4 && y >= 4 && y < h - 4) {
        const offsets = [[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, 3]];
        for (let k = 0; k < offsets.length; k++) {
          const np = (y + offsets[k][1]) * w + (x + offsets[k][0]);
          if (bgMask[np] < 0.08) {
            const ni = np * 4;
            fgR = Math.round(fgR * 0.4 + d[ni] * 0.6);
            fgG = Math.round(fgG * 0.4 + d[ni + 1] * 0.6);
            fgB = Math.round(fgB * 0.4 + d[ni + 2] * 0.6);
            break;
          }
        }
      }

      d[i] = Math.round(fgR * (1 - a) + tr * a);
      d[i + 1] = Math.round(fgG * (1 - a) + tg * a);
      d[i + 2] = Math.round(fgB * (1 - a) + tb * a);
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return aiFg;
}

// Draws the edited image into a canvas of width W.
export function paint(cv, img, s, W) {
  const ratio = ratioOf(s.ratio, img, s.rot);
  const targetW = Math.round(W);
  const targetH = Math.round(targetW / ratio);
  cv.width = targetW;
  cv.height = targetH;
  const ctx = cv.getContext('2d');
  const turned = s.rot % 180 !== 0;
  const iw = turned ? img.height : img.width, ih = turned ? img.width : img.height;
  const k = Math.max(cv.width / iw, cv.height / ih) * s.zoom;

  ctx.save();
  if (s.radius) {
    ctx.beginPath();
    ctx.roundRect(0, 0, cv.width, cv.height, (s.radius / 100) * Math.min(cv.width, cv.height) / 2);
    ctx.clip();
  }
  ctx.filter = filterOf(s.adj);
  ctx.translate(cv.width / 2 + s.panX * cv.width, cv.height / 2 + s.panY * cv.height);
  ctx.rotate((s.rot * Math.PI) / 180);
  if (s.flip) ctx.scale(-1, 1);
  ctx.drawImage(img, (-img.width * k) / 2, (-img.height * k) / 2, img.width * k, img.height * k);
  ctx.restore();

  if (s.bgMode && s.bgMode !== 'none' && s.bgColor) {
    const geomKey = `${targetW}x${targetH}:${s.zoom.toFixed(3)}:${s.panX.toFixed(4)}:${s.panY.toFixed(4)}:${s.rot}:${s.flip ? 1 : 0}`;
    const cachedFg = cv._aiCacheKey === geomKey ? cv._aiCacheFg : null;
    const computedFg = replaceBackgroundCanvas(
      cv,
      s.bgColor,
      Number(s.bgTolerance) || 38,
      Number(s.bgFeather) ?? 2,
      s.brushStrokes,
      cachedFg
    );
    if (computedFg) {
      cv._aiCacheKey = geomKey;
      cv._aiCacheFg = computedFg;
    }
  }

  if (s.adj.vignette) {
    const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, Math.min(cv.width, cv.height) * 0.3, cv.width / 2, cv.height / 2, Math.hypot(cv.width, cv.height) / 2);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${s.adj.vignette / 100})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cv.width, cv.height);
  }
  for (const t of s.texts || []) {
    const size = (t.size / 100) * cv.width;
    ctx.font = `${t.bold ? 800 : 400} ${size}px "${t.font}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const x = t.x * cv.width, y = t.y * cv.height;
    if (t.bg) {
      const w = ctx.measureText(t.text).width + size * 0.8;
      ctx.fillStyle = t.bg;
      ctx.fillRect(x - w / 2, y - size * 0.75, w, size * 1.5);
    }
    if (t.shadow) {
      ctx.shadowColor = 'rgba(0,0,0,.55)';
      ctx.shadowBlur = size * 0.25;
      ctx.shadowOffsetY = size * 0.06;
    }
    ctx.fillStyle = t.color;
    ctx.fillText(t.text, x, y);
    ctx.shadowColor = 'transparent';
  }
}

export function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

export const dataUrlBytes = (dataUrl) => {
  const base64 = String(dataUrl || '').split(',')[1] || '';
  return Math.round((base64.length * 3) / 4);
};

export const formatKb = (bytes) => (bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`);

// Encodes canvas to fit within targetKb (if > 0) by binary-searching quality, or uses state.quality
export function encodeCanvasToTarget(cv, s) {
  const fmt = (s.radius || s.bgColor === 'transparent' || s.bgMode === 'transparent') ? 'image/png' : (s.format || 'image/jpeg');
  const baseQ = Math.min(0.98, Math.max(0.1, (Number(s.quality) || 88) / 100));
  const maxBytes = (Number(s.targetKb) || 0) * 1024;
  if (!maxBytes || fmt === 'image/png') {
    const url = cv.toDataURL(fmt, baseQ);
    return { dataUrl: url, bytes: dataUrlBytes(url), width: cv.width, height: cv.height };
  }
  let lo = 0.12, hi = baseQ, best = cv.toDataURL(fmt, baseQ);
  if (dataUrlBytes(best) <= maxBytes) {
    return { dataUrl: best, bytes: dataUrlBytes(best), width: cv.width, height: cv.height };
  }
  for (let step = 0; step < 6; step++) {
    const mid = (lo + hi) / 2;
    const candidate = cv.toDataURL(fmt, mid);
    if (dataUrlBytes(candidate) <= maxBytes) {
      best = candidate;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  // If still slightly above maxBytes at lowest quality, scale down canvas slightly to guarantee target KB
  if (dataUrlBytes(best) > maxBytes) {
    const shrinkFactor = Math.max(0.45, Math.sqrt(maxBytes / dataUrlBytes(best)) * 0.92);
    const small = document.createElement('canvas');
    small.width = Math.max(120, Math.round(cv.width * shrinkFactor));
    small.height = Math.max(120, Math.round(cv.height * shrinkFactor));
    small.getContext('2d').drawImage(cv, 0, 0, small.width, small.height);
    best = small.toDataURL(fmt, 0.72);
    return { dataUrl: best, bytes: dataUrlBytes(best), width: small.width, height: small.height };
  }
  return { dataUrl: best, bytes: dataUrlBytes(best), width: cv.width, height: cv.height };
}

export async function renderEdited(src, state, W = 1200) {
  await ensureAiSegmenter();
  const img = await loadImage(src);
  const s = { ...defaultState(), ...state };
  const cv = document.createElement('canvas');
  const exportW = Number(s.outWidth) > 0 ? Number(s.outWidth) : Math.min(W, Math.max(img.width, img.height));
  paint(cv, img, s, exportW);
  return encodeCanvasToTarget(cv, s).dataUrl;
}

const css = `.ie-bg{position:fixed;inset:0;z-index:100;background:rgba(15,23,42,.78);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:12px}
.ie{background:#fff;border-radius:18px;width:min(1140px,100%);max-height:96vh;display:grid;grid-template-columns:minmax(0,1fr) 340px;overflow:hidden;font:13.5px "Be Vietnam Pro",system-ui,sans-serif;color:#0f172a;box-shadow:0 25px 50px -12px rgba(0,0,0,.4)}
.ie-stage{background:repeating-conic-gradient(#e2e8f0 0 25%,#f8fafc 0 50%) 0 0/20px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;min-height:320px;position:relative}
.ie-stage canvas{max-width:100%;max-height:calc(96vh - 115px);box-shadow:0 12px 32px rgba(15,23,42,.25);cursor:grab;touch-action:none;border-radius:4px}
.ie-meta{position:absolute;top:12px;left:12px;right:12px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;pointer-events:none}
.ie-pill{background:rgba(15,23,42,.82);color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;backdrop-filter:blur(4px);pointer-events:auto;display:inline-flex;align-items:center;gap:6px}
.ie-side{border-left:1px solid #e2e8f0;overflow:auto;max-height:96vh;padding:14px 16px;display:flex;flex-direction:column;gap:12px}
.ie-box{border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:10px 12px}
.ie-side h4{margin:0 0 6px;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#475569}
.ie-row{display:flex;flex-wrap:wrap;gap:5px}.ie-b{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:5px 8px;font:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:.15s}
.ie-b:hover{border-color:#2563eb;color:#1d4ed8}.ie-b.on{background:#2563eb;border-color:#2563eb;color:#fff}
.ie-s{display:grid;grid-template-columns:92px 1fr 38px;align-items:center;gap:6px;font-size:12.5px;padding:2px 0}.ie-s input{width:100%;accent-color:#2563eb}.ie-s output{text-align:right;color:#64748b;font-size:11.5px;font-variant-numeric:tabular-nums}
.ie-pre{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.ie-pre button{border:2px solid transparent;border-radius:8px;padding:0;background:none;cursor:pointer;font-size:11px;color:#334155}
.ie-pre button.on{border-color:#2563eb;font-weight:700}.ie-pre canvas{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;display:block}
.ie-t{border:1px solid #e2e8f0;background:#fff;border-radius:10px;padding:8px;display:grid;gap:6px}.ie-t.on{border-color:#2563eb;box-shadow:0 0 0 2px #bfdbfe}
.ie-t input[type=text],.ie-t select,.ie-inp{width:100%;border:1px solid #cbd5e1;background:#fff;border-radius:7px;padding:5px 8px;font:inherit;font-size:12.5px}
.ie-foot{display:flex;flex-wrap:wrap;gap:6px;position:sticky;bottom:-14px;background:#fff;padding:10px 0 2px;margin-top:auto;border-top:1px solid #f1f5f9}
.ie-ok{flex:1;background:#2563eb;color:#fff;border:0;border-radius:10px;padding:9px 12px;font:inherit;font-weight:700;cursor:pointer}
.ie-ok:hover{background:#1d4ed8}
.ie-hint{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,.75);color:#fff;font-size:11.5px;padding:3px 12px;border-radius:99px;white-space:nowrap}
@media(max-width:820px){.ie{grid-template-columns:1fr;overflow:auto}.ie-side{border-left:0;max-height:none}.ie-stage canvas{max-height:46vh}}`;

export function openImageEditor(src, prev, lang = 'vi') {
  const vi = lang !== 'en';
  const L = (a, b) => (vi ? a : b);
  const s = JSON.parse(JSON.stringify({ ...defaultState(), ...(prev || {}) }));
  s.adj = { ...BASE, ...(s.adj || {}) };
  if (!Array.isArray(s.brushStrokes)) s.brushStrokes = [];
  if (!document.getElementById('ie-css')) {
    const st = document.createElement('style');
    st.id = 'ie-css';
    st.textContent = css;
    document.head.appendChild(st);
  }
  ensureAiSegmenter();
  return loadImage(src).then((img) => new Promise((resolve) => {
    if (!s.outWidth) s.outWidth = Math.min(1200, Math.max(img.width, img.height));
    const bg = document.createElement('div');
    bg.className = 'ie-bg';
    const slider = (key, label, min, max) => `<label class="ie-s">${label}<input type="range" min="${min}" max="${max}" data-adj="${key}" value="${s.adj[key]}"><output data-out="${key}">${s.adj[key]}</output></label>`;
    bg.innerHTML = `<div class="ie" role="dialog" aria-label="${L('Studio sửa ảnh thẻ & kích thước dung lượng', 'Photo & ID Studio')}">
<div class="ie-stage">
  <div class="ie-meta">
    <span class="ie-pill" data-meta-info>📏 -- × -- px · 💾 -- KB</span>
    <span class="ie-pill" data-ai-badge style="background:#312e81">✨ ${isAiSegmenterReady() ? L('AI Tách Nền Chân Dung', 'AI Portrait Segmenter') : L('⏳ Đang khởi tạo AI tách nền...', '⏳ Loading AI Segmenter...')}</span>
    <button type="button" class="ie-pill" data-act="dl-direct" style="cursor:pointer;background:#059669">⬇ ${L('Tải ảnh này', 'Download image')}</button>
  </div>
  <canvas data-cv></canvas>
  <span class="ie-hint" data-stage-hint>${L('Kéo ảnh để căn khung · Lăn chuột để phóng to', 'Drag to pan · Scroll to zoom')}</span>
</div>
<div class="ie-side">
  <div class="ie-box" style="background:#eff6ff;border-color:#bfdbfe">
    <h4 style="color:#1e40af">🪪 ${L('1. Phông nền Ảnh thẻ (AI Tách Nền)', '1. ID Photo Background (AI Cutout)')}</h4>
    <div class="ie-row">
      ${BG_PRESETS.map((b) => `<button type="button" class="ie-b" data-bgmode="${b.key}" data-bgcolor="${b.color}" style="display:inline-flex;align-items:center;gap:5px">${b.color && b.color !== 'transparent' ? `<span style="width:12px;height:12px;border-radius:50%;background:${b.color};border:1px solid #94a3b8;display:inline-block"></span>` : ''}${vi ? b.vi : b.en}</button>`).join('')}
      <label class="ie-b" style="display:inline-flex;align-items:center;gap:4px;padding:3px 7px" title="${L('Màu nền tùy chọn', 'Custom background color')}">🎨 <input type="color" data-bgcustom value="${s.bgColor && s.bgColor !== 'transparent' ? s.bgColor : '#1d70b8'}" style="width:20px;height:20px;border:0;padding:0;background:none;cursor:pointer"></label>
    </div>
    <div data-bg-controls style="margin-top:8px;${s.bgMode === 'none' ? 'display:none' : ''}">
      <label class="ie-s">${L('Độ nhạy viền', 'Edge trim')}<input type="range" min="10" max="85" data-bgtol value="${s.bgTolerance}"><output data-out="bgtol">${s.bgTolerance}</output></label>
      <label class="ie-s">${L('Mịn viền tóc', 'Hair soft')}<input type="range" min="0" max="5" data-bgfeather value="${s.bgFeather}"><output data-out="bgfeather">${s.bgFeather}</output></label>
      <div style="margin-top:6px;padding-top:6px;border-top:1px dashed #bfdbfe">
        <div style="font-size:11px;font-weight:700;color:#1e40af;margin-bottom:4px">🖌 ${L('Cọ chỉnh chi tiết trên ảnh (Tùy chọn):', 'Touch-up Brush on Image:')}</div>
        <div class="ie-row">
          <button type="button" class="ie-b" data-brush="pan">✋ ${L('Kéo ảnh', 'Move')}</button>
          <button type="button" class="ie-b" data-brush="erase">🧹 ${L('Xóa nền thừa', 'Erase bg')}</button>
          <button type="button" class="ie-b" data-brush="keep">🖌 ${L('Giữ người', 'Keep body')}</button>
          <button type="button" class="ie-b" data-act="clearbrush" title="${L('Xóa các nét cọ vẽ tay', 'Clear brush strokes')}">↺</button>
        </div>
      </div>
    </div>
  </div>

  <div class="ie-box">
    <h4>📐 ${L('2. Kích thước Ảnh thẻ & Cắt khung', '2. ID Photo Size & Crop')}</h4>
    <div class="ie-row">${RATIOS.map(([k, a, b, w]) => `<button type="button" class="ie-b" data-ratio="${k}" data-defw="${w}">${L(a, b)}</button>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">
      <label style="font-size:11.5px;color:#475569">${L('Rộng xuất (px)', 'Width (px)')}<input type="number" min="100" max="4000" step="10" class="ie-inp" data-outw value="${s.outWidth}"></label>
      <label style="font-size:11.5px;color:#475569">${L('Cao xuất (px)', 'Height (px)')}<input type="number" class="ie-inp" data-outh disabled value=""></label>
    </div>
    <label class="ie-s" style="margin-top:6px">${L('Phóng to', 'Zoom')}<input type="range" min="100" max="350" data-zoom value="${Math.round(s.zoom * 100)}"><output data-out="zoom">${Math.round(s.zoom * 100)}%</output></label>
    <label class="ie-s">${L('Bo góc', 'Corners')}<input type="range" min="0" max="100" data-radius value="${s.radius}"><output data-out="radius">${s.radius}</output></label>
    <div class="ie-row" style="margin-top:6px"><button type="button" class="ie-b" data-act="rotl">⟲ ${L('Xoay trái', 'Left')}</button><button type="button" class="ie-b" data-act="rotr">⟳ ${L('Xoay phải', 'Right')}</button><button type="button" class="ie-b" data-act="flip">⇋ ${L('Lật', 'Flip')}</button><button type="button" class="ie-b" data-act="center">⊕ ${L('Căn giữa', 'Center')}</button></div>
  </div>

  <div class="ie-box" style="background:#f0fdf4;border-color:#bbf7d0">
    <h4 style="color:#166534">💾 ${L('3. Dung lượng File Ảnh (KB) & Định dạng', '3. File Size Limit (KB) & Format')}</h4>
    <div class="ie-row">
      ${KB_TARGETS.map(([kbVal, a, b]) => `<button type="button" class="ie-b" data-targetkb="${kbVal}">${L(a, b)}</button>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;align-items:center">
      <select class="ie-inp" data-fmt>
        <option value="image/jpeg"${s.format === 'image/jpeg' ? ' selected' : ''}>JPEG (.jpg)</option>
        <option value="image/webp"${s.format === 'image/webp' ? ' selected' : ''}>WebP (.webp)</option>
        <option value="image/png"${s.format === 'image/png' ? ' selected' : ''}>PNG (.png)</option>
      </select>
      <label class="ie-s" style="grid-template-columns:46px 1fr 30px">${L('Nén', 'Qual')}<input type="range" min="20" max="98" data-qual value="${s.quality}"><output data-out="qual">${s.quality}%</output></label>
    </div>
  </div>

  <div><h4>${L('4. Bộ lọc & Ánh sáng', '4. Filters & Light')}</h4><div class="ie-pre">${Object.entries(PRESETS).map(([k, p]) => `<button type="button" data-preset="${k}"><canvas data-pre="${k}" width="72" height="72"></canvas>${vi ? p.vi : p.en}</button>`).join('')}</div>
  <div style="margin-top:8px">${slider('brightness', L('Độ sáng', 'Brightness'), 50, 150)}${slider('contrast', L('Tương phản', 'Contrast'), 50, 160)}${slider('saturate', L('Bão hòa', 'Saturation'), 0, 180)}</div></div>

  <details class="ie-box">
    <summary style="cursor:pointer;font-size:12px;font-weight:700;color:#475569">${L('Chữ trên ảnh & Hiệu ứng mở rộng', 'Text layers & More effects')}</summary>
    <div style="margin-top:8px">
      ${slider('hue', L('Tông màu', 'Hue'), -180, 180)}${slider('sepia', L('Ngả nâu', 'Sepia'), 0, 100)}${slider('grayscale', L('Đen trắng', 'Grayscale'), 0, 100)}${slider('blur', L('Làm mờ', 'Blur'), 0, 10)}${slider('vignette', L('Tối viền', 'Vignette'), 0, 90)}
      <div data-texts style="display:grid;gap:8px;margin-top:8px"></div>
      <button type="button" class="ie-b" data-act="addtext" style="margin-top:6px">＋ ${L('Thêm chữ', 'Add text')}</button>
    </div>
  </details>

  <div class="ie-foot">
    <button type="button" class="ie-b" data-act="reset">${L('Đặt lại', 'Reset')}</button>
    <button type="button" class="ie-b" data-act="cancel">${L('Hủy', 'Cancel')}</button>
    <button type="button" class="ie-ok" data-act="ok">✓ ${L('Áp dụng ảnh', 'Apply Photo')}</button>
  </div>
</div></div>`;
    document.body.appendChild(bg);
    const cv = bg.querySelector('[data-cv]');
    const metaInfo = bg.querySelector('[data-meta-info]');
    const aiBadge = bg.querySelector('[data-ai-badge]');
    const stageHint = bg.querySelector('[data-stage-hint]');
    const outWInput = bg.querySelector('[data-outw]');
    const outHInput = bg.querySelector('[data-outh]');
    let active = -1;

    const unsubAi = onAiSegmenterReady((ok) => {
      if (aiBadge) {
        aiBadge.textContent = ok
          ? `✨ ${L('AI Tách Nền Chân Dung', 'AI Portrait Segmenter')}`
          : `⚡ ${L('Tách Nền Thông Minh', 'Smart Segmenter')}`;
      }
      cv._aiCacheKey = '';
      preview();
    });

    const buildFinalResult = () => {
      const out = document.createElement('canvas');
      const exportW = Math.min(4000, Math.max(100, Number(s.outWidth) || 800));
      paint(out, img, s, exportW);
      return encodeCanvasToTarget(out, s);
    };

    const preview = () => {
      const stage = bg.querySelector('.ie-stage');
      const r = ratioOf(s.ratio, img, s.rot);
      const maxW = Math.max(220, stage.clientWidth - 32);
      const maxH = Math.max(220, Math.min(innerHeight * 0.96 - 115, innerWidth <= 820 ? innerHeight * 0.45 : 9999));
      paint(cv, img, s, Math.min(maxW, maxH * r, 920));
      const exportW = Math.min(4000, Math.max(100, Number(s.outWidth) || 800));
      const exportH = Math.round(exportW / r);
      outHInput.value = String(exportH);
      const est = encodeCanvasToTarget(cv, s);
      const scaleArea = (exportW * exportH) / Math.max(1, cv.width * cv.height);
      const estBytes = s.targetKb ? Math.min(s.targetKb * 1024, Math.round(est.bytes * Math.min(2.2, Math.max(0.7, scaleArea * 0.85)))) : Math.round(est.bytes * Math.min(2.4, Math.max(0.75, scaleArea * 0.85)));
      metaInfo.textContent = `📐 ${exportW} × ${exportH} px · 💾 ~${formatKb(estBytes)}`;
    };

    const sync = () => {
      bg.querySelectorAll('[data-ratio]').forEach((b) => b.classList.toggle('on', b.dataset.ratio === s.ratio));
      bg.querySelectorAll('[data-bgmode]').forEach((b) => b.classList.toggle('on', b.dataset.bgmode === s.bgMode));
      bg.querySelectorAll('[data-brush]').forEach((b) => b.classList.toggle('on', b.dataset.brush === (s.brushMode || 'pan')));
      bg.querySelectorAll('[data-targetkb]').forEach((b) => b.classList.toggle('on', Number(b.dataset.targetkb) === Number(s.targetKb)));
      bg.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('on', b.dataset.preset === s.preset));
      bg.querySelectorAll('[data-adj]').forEach((i) => {
        i.value = s.adj[i.dataset.adj];
        bg.querySelector(`[data-out="${i.dataset.adj}"]`).textContent = s.adj[i.dataset.adj];
      });
      bg.querySelector('[data-zoom]').value = Math.round(s.zoom * 100);
      bg.querySelector('[data-out="zoom"]').textContent = Math.round(s.zoom * 100) + '%';
      bg.querySelector('[data-radius]').value = s.radius;
      bg.querySelector('[data-out="radius"]').textContent = s.radius;
      bg.querySelector('[data-bgtol]').value = s.bgTolerance;
      bg.querySelector('[data-out="bgtol"]').textContent = s.bgTolerance;
      bg.querySelector('[data-bgfeather]').value = s.bgFeather;
      bg.querySelector('[data-out="bgfeather"]').textContent = s.bgFeather;
      bg.querySelector('[data-qual]').value = s.quality;
      bg.querySelector('[data-out="qual"]').textContent = s.quality + '%';
      outWInput.value = s.outWidth;
      bg.querySelector('[data-bg-controls]').style.display = s.bgMode === 'none' ? 'none' : '';
      cv.style.cursor = s.brushMode && s.brushMode !== 'pan' ? 'crosshair' : 'grab';
      if (stageHint) {
        stageHint.textContent = s.brushMode === 'erase'
          ? L('🧹 Tô lên vùng cảnh thừa để xóa thành màu nền', '🧹 Paint over unwanted background areas to erase')
          : s.brushMode === 'keep'
            ? L('🖌 Tô lên vùng tóc/áo nhân vật để giữ lại', '🖌 Paint over subject hair/clothes to restore')
            : L('Kéo ảnh để căn khung · Lăn chuột để phóng to', 'Drag to pan · Scroll to zoom');
      }
      preview();
    };

    const drawTexts = () => {
      bg.querySelector('[data-texts]').innerHTML = (s.texts || []).map((t, i) => `<div class="ie-t${i === active ? ' on' : ''}" data-ti="${i}">
<input type="text" data-tk="text" value="${e(t.text)}" maxlength="120">
<div class="ie-row" style="align-items:center"><select data-tk="font" style="flex:1">${FONTS.map(([f, n]) => `<option value="${e(f)}"${f === t.font ? ' selected' : ''}>${e(n)}</option>`).join('')}</select>
<input type="color" data-tk="color" value="${t.color}" style="width:32px;height:28px;border:0;padding:0">
<input type="color" data-tk="bg" value="${t.bg || '#000000'}" style="width:32px;height:28px;border:0;padding:0;opacity:${t.bg ? 1 : 0.35}"></div>
<label class="ie-s">${L('Cỡ chữ', 'Size')}<input type="range" min="2" max="30" data-tk="size" value="${t.size}"><output>${t.size}</output></label>
<div class="ie-row"><button type="button" class="ie-b${t.bold ? ' on' : ''}" data-tt="bold"><b>B</b></button><button type="button" class="ie-b${t.shadow ? ' on' : ''}" data-tt="shadow">${L('Bóng', 'Shadow')}</button><button type="button" class="ie-b${t.bg ? ' on' : ''}" data-tt="bg">${L('Nền', 'Box')}</button><button type="button" class="ie-b" data-tt="del" style="margin-left:auto">🗑</button></div></div>`).join('');
    };

    const thumbs = () => Object.entries(PRESETS).forEach(([k, p]) => {
      const c = bg.querySelector(`[data-pre="${k}"]`);
      if (c) paint(c, img, { ...defaultState(), ratio: '1', adj: { ...BASE, ...p.v } }, 72);
    });

    const close = (val) => {
      unsubAi();
      removeEventListener('resize', preview);
      removeEventListener('keydown', onKey);
      bg.remove();
      resolve(val);
    };
    const onKey = (ev) => { if (ev.key === 'Escape') close(null); };
    addEventListener('resize', preview);
    addEventListener('keydown', onKey);

    bg.addEventListener('click', (ev) => {
      const t = ev.target.closest('button');
      if (ev.target === bg) return close(null);
      if (!t) return;
      if (t.dataset.ratio) {
        s.ratio = t.dataset.ratio;
        if (Number(t.dataset.defw) > 0) s.outWidth = Number(t.dataset.defw);
        s.panX = s.panY = 0;
        return sync();
      }
      if (t.dataset.bgmode) {
        s.bgMode = t.dataset.bgmode;
        if (t.dataset.bgcolor) s.bgColor = t.dataset.bgcolor;
        if (s.bgMode === 'none') s.brushMode = 'pan';
        return sync();
      }
      if (t.dataset.brush) {
        s.brushMode = t.dataset.brush;
        return sync();
      }
      if (t.dataset.targetkb !== undefined) {
        s.targetKb = Number(t.dataset.targetkb);
        return sync();
      }
      if (t.dataset.preset) {
        s.preset = t.dataset.preset;
        s.adj = { ...BASE, blur: s.adj.blur, vignette: s.adj.vignette, ...PRESETS[s.preset].v };
        return sync();
      }
      const box = t.closest('[data-ti]');
      if (box && t.dataset.tt) {
        const i = Number(box.dataset.ti), tx = s.texts[i];
        if (t.dataset.tt === 'del') { s.texts.splice(i, 1); active = -1; }
        else if (t.dataset.tt === 'bg') tx.bg = tx.bg ? '' : '#000000';
        else tx[t.dataset.tt] = !tx[t.dataset.tt];
        drawTexts();
        return preview();
      }
      switch (t.dataset.act) {
        case 'rotl': s.rot = (s.rot + 270) % 360; break;
        case 'rotr': s.rot = (s.rot + 90) % 360; break;
        case 'flip': s.flip = !s.flip; break;
        case 'center': s.panX = s.panY = 0; s.zoom = 1; break;
        case 'clearbrush': s.brushStrokes = []; break;
        case 'reset': Object.assign(s, defaultState(), { outWidth: Math.min(1200, Math.max(img.width, img.height)) }); active = -1; drawTexts(); break;
        case 'addtext': s.texts.push({ text: L('Chú thích', 'Caption'), x: 0.5, y: 0.88, size: 7, color: '#ffffff', font: 'Be Vietnam Pro', bold: true, shadow: true, bg: '' }); active = s.texts.length - 1; drawTexts(); break;
        case 'dl-direct': {
          const res = buildFinalResult();
          const ext = s.radius || s.bgColor === 'transparent' || s.format === 'image/png' ? 'png' : s.format === 'image/webp' ? 'webp' : 'jpg';
          fetch(res.dataUrl).then((r) => r.blob()).then((blob) => downloadBlob(`anh-the-${res.width}x${res.height}.${ext}`, blob));
          return;
        }
        case 'cancel': return close(null);
        case 'ok': {
          const res = buildFinalResult();
          return close({ dataUrl: res.dataUrl, bytes: res.bytes, width: res.width, height: res.height, state: s });
        }
        default: return;
      }
      sync();
    });

    bg.addEventListener('input', (ev) => {
      const el = ev.target;
      if (el.dataset.adj) { s.adj[el.dataset.adj] = Number(el.value); s.preset = ''; return sync(); }
      if (el.hasAttribute('data-zoom')) { s.zoom = Number(el.value) / 100; return sync(); }
      if (el.hasAttribute('data-radius')) { s.radius = Number(el.value); return sync(); }
      if (el.hasAttribute('data-bgtol')) { s.bgTolerance = Number(el.value); return sync(); }
      if (el.hasAttribute('data-bgfeather')) { s.bgFeather = Number(el.value); return sync(); }
      if (el.hasAttribute('data-bgcustom')) { s.bgMode = 'custom'; s.bgColor = el.value; return sync(); }
      if (el.hasAttribute('data-outw')) { s.outWidth = Math.max(100, Math.min(4000, Number(el.value) || 600)); preview(); return; }
      if (el.hasAttribute('data-qual')) { s.quality = Number(el.value); return sync(); }
      if (el.hasAttribute('data-fmt')) { s.format = el.value; return sync(); }
      const box = el.closest('[data-ti]');
      if (box && el.dataset.tk) {
        const tx = s.texts[Number(box.dataset.ti)];
        tx[el.dataset.tk] = el.dataset.tk === 'size' ? Number(el.value) : el.value;
        if (el.dataset.tk === 'size') el.nextElementSibling.textContent = el.value;
        if (el.dataset.tk === 'bg') el.style.opacity = '1';
        preview();
      }
    });

    let drag = null;
    cv.addEventListener('pointerdown', (ev) => {
      const r = cv.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      if (s.bgMode !== 'none' && (s.brushMode === 'erase' || s.brushMode === 'keep')) {
        s.brushStrokes.push({ x: px, y: py, r: 5.5, mode: s.brushMode });
        drag = { brush: true, r };
        cv.setPointerCapture(ev.pointerId);
        preview();
        return;
      }
      const hit = (s.texts || []).findIndex((t) => Math.abs(t.x - px) < 0.25 && Math.abs(t.y - py) < Math.max(0.05, (t.size / 100) * (r.width / r.height)));
      drag = { hit, x: ev.clientX, y: ev.clientY, w: r.width, h: r.height, start: hit >= 0 ? { ...s.texts[hit] } : { panX: s.panX, panY: s.panY } };
      if (hit >= 0 && hit !== active) { active = hit; drawTexts(); }
      cv.setPointerCapture(ev.pointerId);
      cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', (ev) => {
      if (!drag) return;
      if (drag.brush) {
        const r = cv.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
        const py = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
        const last = s.brushStrokes[s.brushStrokes.length - 1];
        if (!last || Math.hypot(px - last.x, py - last.y) > 0.015) {
          s.brushStrokes.push({ x: px, y: py, r: 5.5, mode: s.brushMode });
          preview();
        }
        return;
      }
      const dx = (ev.clientX - drag.x) / drag.w, dy = (ev.clientY - drag.y) / drag.h;
      if (drag.hit >= 0) {
        const t = s.texts[drag.hit];
        t.x = Math.min(1, Math.max(0, drag.start.x + dx));
        t.y = Math.min(1, Math.max(0, drag.start.y + dy));
      } else {
        s.panX = drag.start.panX + dx;
        s.panY = drag.start.panY + dy;
      }
      preview();
    });
    const end = () => {
      drag = null;
      cv.style.cursor = s.brushMode && s.brushMode !== 'pan' ? 'crosshair' : 'grab';
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      s.zoom = Math.min(3.5, Math.max(1, s.zoom - ev.deltaY * 0.001));
      sync();
    }, { passive: false });

    drawTexts();
    thumbs();
    requestAnimationFrame(sync);
  }));
}
