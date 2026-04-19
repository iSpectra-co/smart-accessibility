# Changelog

All notable changes to AWIDGET are documented here.

---

## [2.3.0] — 2026-04-19

### Changed
- **Single-file distribution** — `accessibility-widget.js` merged into `awidget.js`; only one `<script>` tag needed
- `data-*` attributes are now read from the `awidget.js` script tag directly (no separate config file)
- `demo/index.html` updated to single-script integration

---

## [2.2.0] — 2026-04-19

### Added
- `data-*` attribute config on the `<script>` tag — zero JavaScript required
- `data-hide` — comma-separated list of sections to hide (e.g. `data-hide="tools,manage"`)
- `data-theme-name / data-theme-base / data-theme-active` — register and activate a custom theme from HTML
- `data-color-header / accent / bg / panel / text / border / muted` — custom theme CSS vars from HTML
- Built-in **Arabic (AR)** and **Spanish (ES)** language packs in `accessibility-widget.js`
- `normalizeConfig()` — supports both old flat keys and new structured keys (backward compatible)

### Changed
- Project restructured: production files moved to `dist/`, demo pages to `demo/`
- `accessibility-widget.js` now reads its own `<script>` tag via `document.currentScript`
- `window.AWIDGET_CONFIG` always overrides `data-*` attributes (JS wins for advanced cases)

---

## [2.1.0] — 2026-04-19

### Added
- `sections` config — show or hide any panel section
- `palettes` config — override default color swatches per category
- Lifecycle hooks: `onMount`, `onOpen`, `onClose`, `onReset`, `onLangChange`, `onThemeChange`
- `onOpen` / `onClose` implemented via `MutationObserver` on the panel class list
- `onLangChange` / `onThemeChange` implemented by wrapping the public API methods
- Built-in **German (DE)** language pack

### Changed
- `accessibility-widget.js` fully rebuilt with `normalizeConfig()` supporting legacy flat keys
- `statement` object replaces flat `statementHref` / `statementLabel` (legacy still works)
- `themes[]` replaces `customThemes[]` (legacy still works)
- `languages[]` replaces `extraLanguages[]` (legacy still works)

---

## [2.0.0] — 2026-04-19

### Added
- UMD module wrapper — works as CommonJS, AMD, or browser global
- `window.AWIDGET_CONFIG` global config object
- `data-*` attribute support on `awidget.js` script tag (basic: lang, theme, position)
- CDN auto-init block reads script tag attributes or `window.AWIDGET_CONFIG`
- Version `2.0.0` exposed as `window.AWIDGET.version`
- `accessibility-widget.js` rebuilt as a dedicated CDN config layer
- Built-in **French (FR)** and **German (DE)** language packs
- `DEFAULT_POSITION` constant (fixes `ReferenceError` from v1)

### Fixed
- `DEFAULT_POSITION` was used but never defined → added constant
- `console.log(newPos)` was outside its closure scope → removed
- `togglePanel()` used `getElementById('#aw-panel')` (invalid `#` prefix) → fixed
- Duplicate `applyUserColors()` and `renderSwatches()` definitions → removed duplicates
- `document.execCommand('insertText')` deprecated → replaced with Selection API
- Unused `options` variable causing lint warnings → removed

### Changed
- `state.colors` initialization deduplicated and cleaned up

---

## [1.0.0] — Initial release

- Core accessibility panel with dark/light themes
- Profiles: Blind, Color Blind, Dyslexia, Low Vision, ADHD, Seizure-safe
- Visuals: contrast modes, saturation, hide images, highlight structure/links
- Typography: font size, letter spacing, text alignment, OpenDyslexic font
- Focus aids: reading ruler, focus mask, cursor guide (line / bar / spotlight)
- Colors: custom text, link, heading, selection swatches
- Tools: read aloud, screen reader, talk-to-write dictation
- i18n system with English (EN) and Arabic (AR)
- Position: left / right, persisted in `localStorage`
- GSAP, Lottie, Anime.js animation pause support
