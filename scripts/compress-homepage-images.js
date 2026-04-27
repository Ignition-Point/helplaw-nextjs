const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = '/Users/sarahmenkesservold/help-law/public/assets/alt';
const targets = ['section-2-image.png', 'section-3-image.png', 'section-4-image.png'];

(async () => {
  for (const file of targets) {
    const inPath = path.join(ASSETS_DIR, file);
    const outPath = inPath.replace(/\.png$/i, '.webp');
    if (!fs.existsSync(inPath)) {
      console.log(`SKIP (missing): ${file}`);
      continue;
    }
    const before = fs.statSync(inPath).size;
    await sharp(inPath)
      .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outPath);
    const after = fs.statSync(outPath).size;
    console.log(`${file}: ${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB (${Math.round((1 - after/before) * 100)}% reduction)`);
  }
})();
