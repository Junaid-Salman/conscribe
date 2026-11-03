/** P10.2: the committed icon PNGs are the ones `npm run icons` renders from brand/app-icon.svg. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { ICONS, paddedSvg, renderIcons } from '../scripts/icons.mjs';
import { alphaAt, decodePng } from './helpers/png';

const root = new URL('..', import.meta.url).pathname;
const hasRsvg = (() => {
  try {
    execFileSync('rsvg-convert', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe('brand masters', () => {
  it('are plain vector files: no live text, raster images or filters', () => {
    for (const name of ['app-icon', 'icon', 'horizontal', 'stacked', 'wordmark']) {
      const svg = readFileSync(join(root, `brand/${name}.svg`), 'utf8');
      expect(svg, name).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
      expect(svg, name).not.toMatch(/<(text|image|filter|foreignObject)\b/);
    }
  });

  it('pads the tile by the border on every side', () => {
    expect(paddedSvg('<svg viewBox="0 0 100 100"><path d="M0 0"/></svg>', 128, 16)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><g transform="translate(16 16) scale(0.96)"><path d="M0 0"/></g></svg>',
    );
  });
});

describe.skipIf(!hasRsvg)('committed icons match the masters', () => {
  const out = mkdtempSync(join(tmpdir(), 'conscribe-icons-'));
  afterAll(() => rmSync(out, { recursive: true, force: true }));
  renderIcons(out);

  it.each(ICONS)('$path', ({ path, size, border }) => {
    const committed = decodePng(new Uint8Array(readFileSync(join(root, path))));
    const fresh = decodePng(new Uint8Array(readFileSync(join(out, path))));
    expect([committed.width, committed.height]).toEqual([size, size]);
    expect(committed.channels).toBe(4);
    // Compare decoded pixels rather than bytes, so a different zlib level does not fail the test.
    expect(Buffer.concat(committed.rows).equals(Buffer.concat(fresh.rows)), `${path} is stale: run npm run icons`).toBe(true);
    const mid = Math.floor(size / 2);
    expect(alphaAt(committed, mid, border + 1)).toBeGreaterThan(0);
  });
});
