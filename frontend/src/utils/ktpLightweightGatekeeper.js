/**
 * LIGHTWEIGHT KTP GATEKEEPER & FEATURE ANALYZER (Pure JS - 0 WASM Overhead)
 * Single Responsibility: Fast client-side image feature validation in < 15ms.
 */

/**
 * Analyze Canvas Image Features: Edge Variance, Contrast, & SIM Red Header Banner
 * @param {string} base64Str - Image data URL or raw Base64 string
 * @returns {Promise<{ isValidCandidate: boolean, isSIM: boolean, reason?: string }>}
 */
export async function validateCardImageLightweight(base64Str) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = 120;
      const height = 80; // ~1.5 Aspect ratio (Standard ID Card)

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const totalPixels = width * height;

      let topRedPixelCount = 0;
      let topRegionTotal = 0;

      let totalLuminance = 0;
      let edgeContrastSum = 0;

      // 1. Analyze Top 25% Header Region for SIM Red Banner
      const topBoundary = Math.floor(height * 0.25);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];

          // Luminance calculation
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;

          // Horizontal Edge Gradient (Contrast Check)
          if (x < width - 1) {
            const nextIdx = idx + 4;
            const nextLum = 0.299 * pixels[nextIdx] + 0.587 * pixels[nextIdx + 1] + 0.114 * pixels[nextIdx + 2];
            edgeContrastSum += Math.abs(lum - nextLum);
          }

          // Top Header SIM Red Banner Check (Dominant Red in Top 25%)
          if (y < topBoundary) {
            topRegionTotal++;
            if (r > 135 && r > g + 35 && r > b + 35) {
              topRedPixelCount++;
            }
          }
        }
      }

      const avgLuminance = totalLuminance / totalPixels;
      const avgEdgeContrast = edgeContrastSum / totalPixels;
      const topRedRatio = topRedPixelCount / topRegionTotal;

      // 2. Feature Decision Rules

      // Rule A: Detect SIM Card (Dominant Red Header Banner > 14%)
      if (topRedRatio > 0.14) {
        return resolve({
          isValidCandidate: false,
          isSIM: true,
          reason: 'Dokumen yang dideteksi adalah SIM (Surat Izin Mengemudi), bukan e-KTP Indonesia!'
        });
      }

      // Rule B: Detect Blank/Dark/Extreme Overexposed Background (Out of Focus / Plain Wall)
      if (avgLuminance < 15 || avgLuminance > 245) {
        return resolve({
          isValidCandidate: false,
          isSIM: false,
          reason: 'Objek tidak jelas atau terlalu gelap/terang. Posisikan e-KTP di dalam bingkai.'
        });
      }

      // Rule C: Low Edge Contrast (No card boundaries / smooth plain surface like floor/blank table)
      if (avgEdgeContrast < 4.5) {
        return resolve({
          isValidCandidate: false,
          isSIM: false,
          reason: 'Objek e-KTP tidak terdeteksi. Posisikan e-KTP tepat di tengah bingkai.'
        });
      }

      // Passed Lightweight Gatekeeper Checks in ~10ms!
      return resolve({
        isValidCandidate: true,
        isSIM: false
      });
    };

    img.onerror = () => {
      resolve({
        isValidCandidate: true, // Fail-open to avoid blocking valid captures on load error
        isSIM: false
      });
    };

    img.src = base64Str.startsWith('data:') ? base64Str : `data:image/jpeg;base64,${base64Str}`;
  });
}
