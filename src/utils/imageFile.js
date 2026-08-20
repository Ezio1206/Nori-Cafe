// Helpers for turning a user-selected image file (e.g. a payment receipt
// screenshot) into a compressed base64 data URL that's small enough to store
// directly on a Firestore document — this project intentionally doesn't use
// Firebase Storage (see firebase/config.js), so uploaded images are kept as
// data URLs, the same way drink images are kept as plain URL strings.

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/** Reads a File as a data URL. */
function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

/** Loads a data URL into an HTMLImageElement. */
function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read the selected image.'));
    img.src = dataUrl;
  });
}

/**
 * Reads an image file and returns a compressed base64 JPEG data URL, scaled
 * down so its longest side is at most MAX_DIMENSION. Keeps receipt uploads
 * small enough to store as a field on the order document.
 */
export async function fileToCompressedDataUrl(file) {
  const original = await readAsDataUrl(file);

  // Non-image files (rare, but the file input isn't foolproof on every
  // platform) — just pass the raw data URL through rather than failing.
  if (!file.type?.startsWith('image/')) return original;

  const img = await loadImage(original);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  try {
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } catch {
    // Canvas export can fail in rare cases (e.g. tainted canvas) — fall back
    // to the original file so the upload still succeeds.
    return original;
  }
}
