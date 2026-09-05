// On-device equivalent of the old backend's applyFilter.js. sharp's .normalize()/
// .sharpen() convolutions aren't ported 1:1 (no native image library on-device) —
// this uses a min/max contrast stretch instead of full histogram normalization,
// and skips sharpening.
//
// IMPORTANT: for gray/bw modes, brightness/contrast must be applied AFTER the
// min/max stretch, not before — the stretch re-maps whatever range exists back
// to 0-255, which silently erases any brightness/contrast shift applied earlier
// (that was the original bug here: sliders had no visible effect in gray/bw mode).

const MODES = new Set(["color", "gray", "bw"]);

function clamp255(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v;
}

/** Mutates `data` (RGBA8 buffer) in place applying mode conversion, then brightness/contrast. */
export function applyScanFilter({ data, width, height }, mode = "gray", adjust = {}) {
  const chosenMode = MODES.has(mode) ? mode : "gray";
  const brightness = Number(adjust.brightness) || 0;
  const contrast = Number(adjust.contrast) || 0;

  const brightnessFactor = 1 + brightness / 100;
  const contrastFactor = 1 + contrast / 100;
  const contrastOffset = 128 * (1 - contrastFactor);

  function applyBrightnessContrast(v) {
    v = v * brightnessFactor;
    v = v * contrastFactor + contrastOffset;
    return clamp255(v);
  }

  const pixelCount = width * height;

  if (chosenMode === "color") {
    for (let i = 0; i < pixelCount; i++) {
      const o = i * 4;
      data[o] = applyBrightnessContrast(data[o]);
      data[o + 1] = applyBrightnessContrast(data[o + 1]);
      data[o + 2] = applyBrightnessContrast(data[o + 2]);
    }
    return;
  }

  // gray / bw: convert to luminance, then min/max stretch (approximates .normalize())
  let min = 255;
  let max = 0;
  const gray = new Uint8ClampedArray(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const o = i * 4;
    const g = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
    gray[i] = g;
    if (g < min) min = g;
    if (g > max) max = g;
  }
  const range = max - min || 1;

  if (chosenMode === "gray") {
    for (let i = 0; i < pixelCount; i++) {
      const o = i * 4;
      const stretched = ((gray[i] - min) / range) * 255;
      const base = clamp255(stretched * 1.15 - 10);
      const v = applyBrightnessContrast(base);
      data[o] = v;
      data[o + 1] = v;
      data[o + 2] = v;
    }
  } else {
    // bw: stretch, apply brightness/contrast (shifts the effective cutoff), then threshold
    const threshold = 150;
    for (let i = 0; i < pixelCount; i++) {
      const o = i * 4;
      const stretched = ((gray[i] - min) / range) * 255;
      const adjusted = applyBrightnessContrast(stretched);
      const v = adjusted >= threshold ? 255 : 0;
      data[o] = v;
      data[o + 1] = v;
      data[o + 2] = v;
    }
  }
}
