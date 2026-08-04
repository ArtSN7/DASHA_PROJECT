# Mabon landing page

Frontend-only homepage concept based on the Mabon technical brief and 2026 brand book.

## Preview

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

No build step, package installation, backend, checkout, or API is required.

## Files

- `index.html` - homepage structure and Russian content
- `styles.css` - responsive layout, brand styling, and motion
- `script.js` - mobile navigation, collection carousel, scroll reveals, and placeholder notices
- `assets/` - optimised imagery extracted from the supplied Mabon brand book

## Production note

The prototype uses system fallbacks for CoFo Gothic, ABC Gaisyr, and Reckless Neue because licensed webfont files were not included. Add licensed WOFF2 files before production and replace the text wordmark with the approved logo SVG.
