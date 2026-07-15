"use client";

/**
 * Compresses an image file in the browser before upload — resizes to a max
 * dimension and re-encodes as JPEG at the given quality, so product photos
 * don't bloat Supabase Storage or slow the site down.
 *
 * Usage (e.g. in a future admin upload form):
 *   const compressed = await compressImage(file);
 *   const formData = new FormData();
 *   formData.append("file", compressed, file.name);
 *   await fetch("/api/products/upload-image", { method: "POST", body: formData });
 */
export function compressImage(file, { maxWidth = 1600, maxHeight = 1600, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };

    img.src = objectUrl;
  });
}