/**
 * HTML5 Canvas 2D Preprocessor for KTP Image Auto-Crop, Contrast Boost & Watermarking
 * Converted and optimized from OpenCV Python image preprocessing pipeline
 */

/**
 * Preprocesses a raw camera snapshot image (Auto-Crop 4:3 / 1.58:1, Contrast Boost & Watermark)
 * @param {string|HTMLImageElement} imageSource - Base64 Data URL or Image Element
 * @param {Object} options - Config options for crop, contrast, and PDP watermark
 * @returns {Promise<{ croppedImage: string, processedImage: string }>}
 */
export function preprocessKTPImage(imageSource, options = {}) {
  const {
    cropRatio = 1.58, // Standard e-KTP ID-1 Card Aspect Ratio (85.6mm x 53.98mm)
    contrastBoost = 1.25,
    brightnessBoost = 5,
    kapalNama = 'KM SYAHBANDAR KSOP',
    petugasNama = 'Petugas Inspeksi KSOP',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const srcWidth = img.naturalWidth || img.width;
        const srcHeight = img.naturalHeight || img.height;

        // 1. Calculate Crop Area (Center Bounding Box for e-KTP)
        let targetCropWidth = srcWidth * 0.85;
        let targetCropHeight = targetCropWidth / cropRatio;

        if (targetCropHeight > srcHeight * 0.85) {
          targetCropHeight = srcHeight * 0.85;
          targetCropWidth = targetCropHeight * cropRatio;
        }

        const cropX = (srcWidth - targetCropWidth) / 2;
        const cropY = (srcHeight - targetCropHeight) / 2;

        // 2. Create Canvas for Cropped & Filtered Image
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(targetCropWidth);
        canvas.height = Math.round(targetCropHeight);
        const ctx = canvas.getContext('2d');

        // Draw cropped region
        ctx.drawImage(
          img,
          cropX, cropY, targetCropWidth, targetCropHeight,
          0, 0, canvas.width, canvas.height
        );

        // 3. Image Enhancement Filter (Grayscale & Contrast Boost for OCR)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Grayscale luminance
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          // Contrast Boost
          gray = (gray - 128) * contrastBoost + 128 + brightnessBoost;
          gray = Math.min(255, Math.max(0, gray));

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);

        // 4. UU PDP Automatic Watermark Overlay
        const now = new Date();
        const timestampStr = `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;

        const watermarkText = `ARSIP KTP INSPEKSI KSOP - KAPAL: ${kapalNama.toUpperCase()} - ${timestampStr}`;
        ctx.fillText(watermarkText, canvas.width - 15, canvas.height - 12);
        ctx.restore();

        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);

        resolve({
          croppedImage: croppedBase64,
          processedImage: croppedBase64,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(new Error('Gagal memuat gambar untuk preprocessing Canvas: ' + err));

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof HTMLImageElement) {
      img.src = imageSource.src;
    } else {
      reject(new Error('Format imageSource tidak valid.'));
    }
  });
}
