# Contributing to Smart Accessibility 

Thank you for taking the time to contribute!

---

## Reporting Bugs

1. Search [existing issues](https://github.com/iSpectra-co/smart-accessibility/issues) first — your bug may already be reported.
2. Open a new issue using the **Bug Report** template.
3. Include a minimal reproduction: a URL, CodePen, or a short HTML snippet.

## Suggesting Features

Open an issue with the title prefix `[Feature]` and describe:
- What problem it solves
- Who would benefit
- Any API or config you have in mind

## Submitting a Pull Request

1. Fork the repo and create a branch from `master`:
   ```
   git checkout -b fix/your-fix-name
   ```
2. Make your changes in `dist/smart-accessibility.js`.
3. Test manually by opening `demo/index.html` and `demo/configurator.html` in a browser.
4. Update `CHANGELOG.md` under a new version heading if applicable.
5. Open a PR against `master` and fill in the pull request template.

## Code Style

- Vanilla JavaScript only — no build tools, no dependencies.
- Keep the widget as a single self-contained file in `dist/smart-accessibility.js`.
- Prefer clarity over cleverness. Accessibility code must be readable.

## Questions

Open a [GitHub Discussion](https://github.com/iSpectra-co/smart-accessibility/discussions) for anything that isn't a bug or feature request.
