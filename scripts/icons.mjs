// Renders the icon PNGs from brand/app-icon.svg with rsvg-convert (librsvg).
// Usage: npm run icons   (writes into the repo; the PNGs are committed)
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** Each output: path relative to the repo, size in px, and the transparent border in px. */
export const ICONS = [
  { path: 'public/icons/icon-16.png', size: 16, border: 0 },
  { path: 'public/icons/icon-48.png', size: 48, border: 0 },
  { path: 'public/icons/icon-128.png', size: 128, border: 16 },
  { path: 'src/popup/assets/logo.png', size: 128, border: 0 },
  { path: 'store/assets/logo.png', size: 512, border: 0 },
];

/** The tile SVG drawn at `size` px with `border` px of transparent space on every side. */
export function paddedSvg(svg, size, border) {
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const scale = (size - 2 * border) / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><g transform="translate(${border} ${border}) scale(${scale})">${inner}</g></svg>`;
}

/** Renders every icon into `outRoot` (the repo by default). Returns the written paths. */
export function renderIcons(outRoot = root) {
  const svg = readFileSync(join(root, 'brand/app-icon.svg'), 'utf8');
  return ICONS.map(({ path, size, border }) => {
    let png;
    try {
      png = execFileSync('rsvg-convert', ['--format=png', '-'], { input: paddedSvg(svg, size, border) });
    } catch (error) {
      if (error && error.code === 'ENOENT') throw new Error('rsvg-convert was not found. Install librsvg (for example `apt install librsvg2-bin`).');
      throw error;
    }
    const target = join(outRoot, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, png);
    return target;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    for (const file of renderIcons()) console.log(file);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
