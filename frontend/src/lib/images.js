// Client-side image compressor used before S3 upload. Phone photos run
// 3–10 MB out of the camera; the avatar is shown at 32–120px on screen so
// there is no reason to upload the full-resolution original. Canvas resize
// to maxDim (longest edge), re-encode as JPEG at quality 0.85, returns a
// File that drops in where the original would have gone. If anything goes
// wrong, the original file is returned untouched.
export async function compressImage(file, { maxDim = 1280, quality = 0.85 } = {}) {
  if (!file || !file.type?.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });
    if (!blob) return file;

    return new File([blob], (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
