const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = 'C:/Users/Z790/AppData/Local/Temp/cursor/screenshots';
const outs = [
  'd:/___Development/RatePocket/App screenshots/play-store',
  'd:/___Development/RatePocket/Landing/public/screenshots',
  'd:/___Development/Dawa Website/sites/tradali/public/screenshots',
];
const map = {
  'shot-01-stats-balance.png': '01-statistics-balance',
  'shot-02-stats-spending.png': '02-statistics-spending',
  'shot-03b-calculator-128.png': '03-calculator',
  'shot-04b-convert-filled.png': '04-convert',
  'shot-05-history.png': '05-history',
  'shot-06-settings.png': '06-settings',
  'shot-07-spending-groups.png': '07-spending-groups',
  'shot-08-add-spend.png': '08-add-spend',
};

(async () => {
  for (const dir of outs) fs.mkdirSync(dir, { recursive: true });
  for (const [file, slug] of Object.entries(map)) {
    const src = path.join(srcDir, file);
    if (!fs.existsSync(src)) {
      console.log('missing', file);
      continue;
    }
    const buf = await sharp(src)
      .rotate()
      .resize(1080, 1920, {
        fit: 'contain',
        background: { r: 11, g: 12, b: 14, alpha: 1 },
        position: 'centre',
      })
      .png()
      .toBuffer();
    for (const outDir of outs) {
      fs.writeFileSync(path.join(outDir, `${slug}.png`), buf);
    }
    console.log('ok', slug);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
