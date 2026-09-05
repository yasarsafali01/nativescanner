import * as ImageManipulator from "expo-image-manipulator";
import { decodeToRaw, encodeRawToJpeg } from "./skiaImage";
import { warpToRectangle, rotateRaw } from "./perspectiveWarp";
import { applyScanFilter } from "./applyFilter";

// The perspective warp is a pure-JS per-pixel loop (no GPU/native accel — see
// SCANNERAPP_NATIVE_MOBILE_SPEC.md §9 for why). At full camera resolution
// (12-48MP+) this blocks the JS thread for minutes, which is unusable. Capping
// the working resolution here keeps it to a few seconds while staying well
// above what's needed for a readable scanned document (a typical scanner app
// targets ~150-200 DPI for A4, i.e. well under 2000px on the long side).
const MAX_WORKING_DIMENSION = 1800;

/**
 * Runs the full on-device "scan" pipeline on one photo: EXIF-normalize -> downscale
 * -> decode -> perspective warp -> rotate -> brightness/contrast/mode filter -> JPEG encode.
 * Mirrors the old backend's processPage() step-for-step, just running locally.
 *
 * @returns {Promise<{ bytes: Uint8Array, width: number, height: number }>}
 */
export async function processImage({ uri, corners, rotation = 0, mode = "gray", brightness = 0, contrast = 0 }) {
  // Camera/gallery JPEGs often carry EXIF orientation instead of physically-rotated
  // pixels. Skia's decoder does not auto-apply EXIF orientation, so we run the photo
  // through expo-image-manipulator first (native re-encode bakes EXIF into pixels).
  // NOTE: verify this on a few real device photos in portrait/landscape — if photos
  // come out sideways, this is the first place to look.
  const normalized = await ImageManipulator.manipulateAsync(uri, [{ rotate: 0 }], {
    compress: 1,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  let workingUri = normalized.uri;
  let scale = 1;
  const longSide = Math.max(normalized.width, normalized.height);
  if (longSide > MAX_WORKING_DIMENSION) {
    scale = MAX_WORKING_DIMENSION / longSide;
    const resizeAction =
      normalized.width >= normalized.height
        ? { resize: { width: Math.round(normalized.width * scale) } }
        : { resize: { height: Math.round(normalized.height * scale) } };
    const resized = await ImageManipulator.manipulateAsync(normalized.uri, [resizeAction], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    workingUri = resized.uri;
  }

  const raw = decodeToRaw(workingUri);

  // Corners were picked against the pre-downscale image; scale them down to match.
  const scaledCorners = corners && scale !== 1 ? corners.map((c) => ({ x: c.x * scale, y: c.y * scale })) : corners;

  let page = scaledCorners ? warpToRectangle(raw, scaledCorners) : raw;
  page = rotateRaw(page, rotation);
  applyScanFilter(page, mode, { brightness, contrast });

  const bytes = encodeRawToJpeg(page, 88);
  return { bytes, width: page.width, height: page.height };
}
