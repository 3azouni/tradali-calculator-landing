const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '../..');
const srcDir = path.join(root, 'App screenshots');
const outs = [
  path.join(root, 'Landing/public/screenshots'),
  path.join(root, 'App screenshots/play-store'),
  path.join(root, '../Dawa Website/sites/tradali/public/screenshots'),
];

const files = [
  ['WhatsApp Image 2026-09-17 at 10.54.07 PM.jpeg', '01-calculator'],
  ['WhatsApp Image 2026-09-17 at 10.54.45 PM.jpeg', '02-convert'],
  ['WhatsApp Image 2026-09-17 at 10.55.24 PM.jpeg', '03-statistics'],
  ['WhatsApp Image 2026-09-17 at 10.55.42 PM.jpeg', '04-spending'],
  ['WhatsApp Image 2026-09-17 at 10.56.10 PM.jpeg', '05-groups'],
  ['WhatsApp Image 2026-09-17 at 10.57.00 PM.jpeg', '06-settings'],
  ['WhatsApp Image 2026-09-17 at 10.57.24 PM.jpeg', '07-export'],
  ['WhatsApp Image 2026-09-17 at 10.58.05 PM.jpeg', '08-history'],
];

const marketing = [
  [
    'C:/Users/Z790/.cursor/projects/d-Development-RatePocket-App/assets/marketing-01-calculator.png',
    'marketing-01-calculator',
  ],
  [
    'C:/Users/Z790/.cursor/projects/d-Development-RatePocket-App/assets/marketing-02-convert.png',
    'marketing-02-convert',
  ],
  [
    'C:/Users/Z790/.cursor/projects/d-Development-RatePocket-App/assets/marketing-03-stats.png',
    'marketing-03-stats',
  ],
];

(async () => {
  for (const dir of outs) fs.mkdirSync(dir, { recursive: true });

  for (const [srcName, slug] of files) {
    const src = path.join(srcDir, srcName);
    if (!fs.existsSync(src)) {
      console.log('missing', srcName);
      continue;
    }
    const buf = await sharp(src)
      .rotate()
      .resize(1080, 1920, { fit: 'cover', position: 'top' })
      .png()
      .toBuffer();
    for (const outDir of outs) {
      fs.writeFileSync(path.join(outDir, `${slug}.png`), buf);
    }
    console.log('ok', slug);
  }

  for (const [src, slug] of marketing) {
    if (!fs.existsSync(src)) {
      console.log('missing marketing', slug);
      continue;
    }
    const buf = await sharp(src)
      .rotate()
      .resize(1080, 1920, { fit: 'cover', position: 'centre' })
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
