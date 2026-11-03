# Conscribe brand

The mark is a capsule split by a `>` prompt seam. Conscribe packs what it finds on a broken page into one report, a "capsule", for an AI coding agent: the solid half is the captured signal, and the `>` is the console prompt.

## Files

| File | Use |
|---|---|
| `app-icon.svg` | The capsule cut out of an indigo rounded tile, with a white capsule behind the cut-out so it stays white on dark toolbars. Source of the extension icons, the popup logo and the store logo |
| `icon.svg` | The capsule alone, for places with their own background |
| `horizontal.svg` | Capsule and wordmark side by side. The main lockup |
| `stacked.svg` | Capsule above the wordmark |
| `wordmark.svg` | The name alone |

The SVGs are the source. Regenerate the PNGs with `npm run icons` (needs `rsvg-convert`, from librsvg), which writes:

- `public/icons/icon-16.png`, `icon-48.png`, `icon-128.png` (the 128 icon has the tile at 96 px with a 16 px transparent border, as the Chrome Web Store asks)
- `src/popup/assets/logo.png` (128 px)
- `store/assets/logo.png` (512 px)

Then re-render the promo tile with headless Chrome:

```bash
google-chrome --headless --hide-scrollbars --window-size=440,280 --screenshot=store/assets/promo-small.png store/promo-small.html
```

## Colours

| Name | Hex | RGB | Use |
|---|---|---|---|
| Indigo | `#3047E0` | 48, 71, 224 | The mark (the popup's `--accent`) |
| Ink | `#1A1D2E` | 26, 29, 46 | The wordmark (the popup's `--ink`) |

On dark backgrounds, use the mark and wordmark in white.

## Type

The wordmark is Space Grotesk SemiBold (600), lowercase, tracking −2%, outlined to paths. Space Grotesk is licensed under the SIL Open Font License.

## Don'ts

Don't stretch, rotate or recolour the mark outside these colours. Don't add shadows or gradients, and don't rearrange the lockups. Keep at least the capsule's height of clear space around a lockup. Don't use the bare capsule below 24 px wide; use the tile instead.
