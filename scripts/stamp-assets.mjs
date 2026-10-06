// Adds a content hash to site.css / site.js links in every page (e.g. site.css?v=1a2b3c4d),
// so a deploy always reaches returning visitors even though CSS/JS are cached for 7 days.
// Runs before `wrangler deploy` (see package.json "deploy").
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const hashOf = (file) => createHash('sha256').update(readFileSync(join(pub, file))).digest('hex').slice(0, 8);
const assets = { 'site.css': hashOf('site.css'), 'site.js': hashOf('site.js') };

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
};
walk(pub);

for (const page of pages) {
  const before = readFileSync(page, 'utf8');
  let after = before;
  for (const [file, hash] of Object.entries(assets)) {
    const re = new RegExp(`(${file.replace('.', '\\.')})(\\?v=[0-9a-f]*)?"`, 'g');
    after = after.replace(re, `$1?v=${hash}"`);
  }
  if (after !== before) {
    writeFileSync(page, after);
    console.log('stamped', page.slice(pub.length + 1));
  }
}
console.log('versions', assets);
