# Contributing to Amdad

Thanks for your interest in Amdad (إمداد)! This is a small, static MVP, so contributing is simple.

## Run locally

No build step and no dependencies. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/RushdiJa/amdad.git
cd amdad
```

Then open `index.html` directly, or serve the folder (optional) with any static server, e.g. `python3 -m http.server 8000`.

## Project rules

- **Plain HTML, CSS and vanilla JavaScript.** No frameworks, no build tools, no external APIs.
- **All text goes in `js/i18n.js`**, in both `ar` and `en`. Use `data-i18n`, `data-i18n-html` or `data-i18n-attr` in the HTML.
- **Model logic stays in `js/model.js` and `js/allocation.js`**, with clear comments. If you change a formula or a sample value, update `docs/model.md` too.
- **Mobile first.** Check 375 px width and desktop, in both Arabic (RTL) and English (LTR).
- Prefer CSS logical properties (`margin-inline-start`, `inset-inline-end`, …) so layouts work in both directions.
- Sample values must stay clearly labelled as samples.

## Before opening a pull request

1. Open the page and check the browser console: no errors.
2. Toggle the language and reload: the choice is remembered.
3. Check the calculator example in `docs/model.md` still gives 5.8 days (6.0 in the shade).
4. Use clear commit messages, e.g. `feat: …`, `fix: …`, `docs: …`.

## Reporting issues

Open a GitHub issue describing what you expected, what happened, the browser and device, and the language you were using.
