const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const lockupPath = path.join(
  __dirname,
  '..',
  '..',
  'Landing Page Designs',
  'Logo SVG',
  'RatePocket-Clean-SVG',
  'RatePocket-Clean-SVG',
  'ratepocket-lockup-purple.svg',
);
const outSvg = path.join(__dirname, '..', 'public', 'brand', 'oauth', 'ratepocket-oauth-logo.svg');
const outPng = path.join(__dirname, '..', 'public', 'brand', 'oauth', 'ratepocket-oauth-logo.png');

let inner = fs.readFileSync(lockupPath, 'utf8');
inner = inner
  .replace(/<\?xml[^>]*>/i, '')
  .replace(/<svg[^>]*>/i, '')
  .replace(/<\/svg>\s*$/i, '')
  .trim();

const wrapped = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" role="img" aria-label="RatePocket">
  <title>RatePocket</title>
  <rect width="512" height="512" fill="#0A0A0E"/>
  <svg x="24" y="24" width="464" height="464" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet">
    ${inner}
  </svg>
</svg>
`;

fs.writeFileSync(outSvg, wrapped);
const png = new Resvg(Buffer.from(wrapped), { fitTo: { mode: 'width', value: 512 } }).render().asPng();
fs.writeFileSync(outPng, png);
console.log('wrote', outSvg, outPng, 'bytes', png.length);
