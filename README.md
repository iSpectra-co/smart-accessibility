# SMART Accessibility Widget

![SMART Accessibility Widget Banner](./assets/banner.png)

## Overview

SMART Accessibility Widget is an open-source JavaScript library developed by iSpectra to enhance web accessibility for websites and web applications.

The library provides an all-in-one accessibility toolkit designed to help organizations improve usability and support inclusive digital experiences for users with different accessibility needs — with zero licensing cost.

SMART Accessibility Widget can be integrated easily into any website regardless of the technology stack, offering a lightweight, customizable, and user-friendly accessibility experience.

The widget is designed to support accessibility best practices and help organizations align with WCAG 2.1 and WCAG 2.2 standards.

## Why SMART Accessibility Widget?

- Open-source and free to use
- Easy integration with any website or web application
- Supports WCAG 2.1 and WCAG 2.2 accessibility standards
- Modern and responsive accessibility interface
- Supports accessibility best practices and inclusive design
- Lightweight and performance-friendly
- Community-driven development and contributions

## Community & Contribution

We deeply appreciate the open-source community and welcome contributors from around the world to help improve, maintain, and expand the library.

Together, we aim to make SMART Accessibility Widget stable, reliable, and accessible for everyone.

## Developed By

Developed and maintained by [iSpectra](https://www.ispectra.co)
---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Core Options](#core-options)
  - [Accessibility Statement](#accessibility-statement)
  - [Custom Themes](#custom-themes)
  - [Extra Languages](#extra-languages)
  - [Section Visibility](#section-visibility)
  - [Custom Color Palettes](#custom-color-palettes)
  - [Lifecycle Hooks](#lifecycle-hooks)
- [JavaScript API](#javascript-api)
- [Built-in Languages](#built-in-languages)
- [Built-in Profiles](#built-in-profiles)
- [Browser Support](#browser-support)

---

## Features

| Category | Features |
|---|---|
| **Visuals** | High contrast, inverted colors, saturation control, hide images, highlight structure & links |
| **Typography** | Font size boost, OpenDyslexic font, letter spacing, text alignment |
| **Focus Aids** | Reading ruler, focus mask, cursor guide (line / bar / spotlight) |
| **Colors** | Custom text, link, heading, and text-selection colors |
| **Tools** | Read selection aloud, screen reader mode, talk-to-write dictation |
| **Profiles** | One-click presets: Blind, Color Blind, Dyslexia, Low Vision, ADHD, Seizure-safe |
| **i18n** | Built-in EN, FR, AR, ES, DE — add any language via config |
| **Themes** | Dark, Light, Auto (system), fully custom CSS-var themes |
| **Position** | Left or right side, remembered across sessions |

---

## Project Structure

```
smart-widget/
├── dist/
│   └── awidget.js               ← single production file (reference this)
├── demo/
│   ├── index.html               ← live demo & feature test page
│   └── configurator.html        ← visual configurator with live preview
├── CHANGELOG.md
└── README.md
```

---

## Quick Start

The fastest integration — no configuration required:

```html
<!-- In your <body>, before </body> -->
<script src="dist/awidget.js"></script>
```

The widget auto-detects the page language (`<html lang>`) and system color scheme (`prefers-color-scheme`) and mounts itself in the bottom-right corner.

---

## Installation

### Option 1 — Local files

Download `awidget.js` and host it yourself:

```html
<script src="/path/to/awidget.js"></script>
```

### Option 2 — CDN via jsDelivr (no download required)

Use directly from a versioned CDN URL — no npm, no download:

```html
<script src="https://cdn.jsdelivr.net/gh/iSpectra-co/smart-accessibility@2.3.0/dist/awidget.js"></script>
```

Replace `@2.3.0` with any [release tag](https://github.com/iSpectra-co/smart-accessibility/releases) or use `@latest` for the newest version.

---

### Option 3 — `data-*` attributes (recommended — no JavaScript required)

Configure directly on the `<script src="dist/awidget.js">` tag:

```html
<script src="dist/awidget.js"
  data-lang="fr"
  data-theme="dark"
  data-position="left"
  data-statement-href="https://example.com/accessibility"
  data-hide="tools,manage"
  data-theme-name="brand"
  data-theme-base="light"
  data-theme-active
  data-color-header="#6366f1"
  data-color-accent="#8b5cf6"
  data-color-bg="#f0f4ff">
</script>
```

Full list of `data-*` attributes:

| Attribute | Example | Description |
|---|---|---|
| `data-lang` | `"fr"` | Language code or `"auto"` |
| `data-theme` | `"dark"` | `"auto"` \| `"dark"` \| `"light"` |
| `data-position` | `"left"` | `"right"` \| `"left"` |
| `data-statement-href` | `"https://…"` | Accessibility statement URL |
| `data-statement-label` | `"Statement"` | Link label (English fallback) |
| `data-hide` | `"tools,manage"` | Comma-separated sections to hide |
| `data-theme-name` | `"brand"` | Custom theme identifier |
| `data-theme-base` | `"light"` | Base palette: `"light"` \| `"dark"` |
| `data-theme-active` | _(no value)_ | Activate custom theme on load |
| `data-color-header` | `"#6366f1"` | Header bar & FAB color |
| `data-color-accent` | `"#8b5cf6"` | Highlights & active states |
| `data-color-bg` | `"#f0f4ff"` | Widget background |
| `data-color-panel` | `"#e8edf8"` | Panel cards background |
| `data-color-text` | `"#111827"` | Widget text |
| `data-color-border` | `"#c7d2fe"` | Border & separators |
| `data-color-muted` | `"#818cf8"` | Secondary / muted text |

### Option 4 — `window.AWIDGET_CONFIG` (recommended for full control)

```html
<script>
  window.AWIDGET_CONFIG = { /* see Configuration below */ };
</script>
<script src="dist/awidget.js"></script>
```

> **Order matters:** `window.AWIDGET_CONFIG` must be defined **before** loading the script.

---

## Configuration

All options are set through `window.AWIDGET_CONFIG`. Every option is optional — defaults work out of the box.

```html
<script>
window.AWIDGET_CONFIG = {

  // ── Core ──────────────────────────────────────────────────────
  lang:     'auto',    // string — see Built-in Languages
  theme:    'auto',    // 'auto' | 'dark' | 'light'
  position: 'right',   // 'right' | 'left'

  // ── Accessibility Statement ────────────────────────────────────
  statement: {
    href: 'https://example.com/accessibility',
    labels: { en: 'Accessibility Statement' },
  },

  // ── Custom Themes ──────────────────────────────────────────────
  themes: [
    {
      name:   'brand',
      base:   'light',
      active: true,
      vars:   { '--aw-header': '#6366f1', '--aw-accent': '#8b5cf6' },
    },
  ],

  // ── Extra Languages ────────────────────────────────────────────
  languages: [
    { code: 'nl', label: '🇳🇱 NL', rtl: false, pack: { title: 'Toegankelijkheid' } },
  ],

  // ── Section Visibility ─────────────────────────────────────────
  sections: {
    language:   true,
    profiles:   true,
    visuals:    true,
    typography: true,
    colors:     true,
    tools:      true,
    manage:     true,
  },

  // ── Custom Color Palettes ──────────────────────────────────────
  palettes: {
    text:          ['#111827', '#ffffff', '#e11d48', '#22c55e'],
    link:          ['#2563eb', '#7aa8ff', '#22c55e'],
    heading:       ['#111827', '#7aa8ff', '#22c55e'],
    selectionBg:   ['#bde0fe', '#a7f3d0', '#fde68a'],
    selectionText: ['#111827', '#ffffff'],
  },

  // ── Lifecycle Hooks ────────────────────────────────────────────
  onMount:       (settings) => console.log('Mounted', settings),
  onOpen:        ()         => console.log('Panel opened'),
  onClose:       ()         => console.log('Panel closed'),
  onReset:       ()         => console.log('Settings reset'),
  onLangChange:  (code)     => console.log('Language →', code),
  onThemeChange: (theme)    => console.log('Theme →', theme),

};
</script>
```

---

### Core Options

| Option | Type | Default | Description |
|---|---|---|---|
| `lang` | `string` | `'auto'` | Widget UI language. `'auto'` reads `<html lang>` then `navigator.language` |
| `theme` | `string` | `'auto'` | `'auto'` follows `prefers-color-scheme`; or `'dark'` / `'light'` |
| `position` | `string` | `'right'` | `'right'` or `'left'`. Saved in `localStorage` across sessions |

---

### Accessibility Statement

Adds a link in the widget footer pointing to your accessibility statement page.

```js
statement: {
  href: 'https://example.com/accessibility',

  // Optional: override label per language (built-in langs auto-filled)
  labels: {
    en: 'Accessibility Statement',
    fr: 'Déclaration d\'accessibilité',
    ar: 'بيان إمكانية الوصول',
    es: 'Declaración de accesibilidad',
    de: 'Barrierefreiheitserklärung',
  },
},
```

---

### Custom Themes

Register one or more custom themes built from CSS custom properties.

```js
themes: [
  {
    name:   'brand',       // unique identifier
    base:   'light',       // 'light' | 'dark'  — base palette before overrides
    active: true,          // set this theme on load (first active:true wins)
    vars: {
      '--aw-bg':     '#f0f4ff',   // widget background
      '--aw-panel':  '#e8edf8',   // panel card background
      '--aw-text':   '#111827',   // panel text
      '--aw-accent': '#6366f1',   // highlights, borders, active states
      '--aw-header': '#4f46e5',   // header bar & FAB button
      '--aw-border': '#c7d2fe',   // separator lines
      '--aw-muted':  '#818cf8',   // secondary text
    },
  },
],
```

> To activate a registered theme later via JavaScript:
> ```js
> window.AWIDGET_THEME.set('custom:brand');
> ```

---

### Extra Languages

Add any language not included by default. Only the keys you provide are translated; missing keys fall back to English.

```js
languages: [
  {
    code:  'nl',           // BCP-47 language code
    label: '🇳🇱 NL',       // button label shown in the language grid
    rtl:   false,          // true for right-to-left languages
    pack: {
      title:           'Toegankelijkheidsmenu',
      language:        'Taal',
      profiles:        'Profielen',
      colors:          'Kleuren',
      typography:      'Typografie',
      visuals:         'Visueel',
      tools:           'Hulpmiddelen',
      manage:          'Beheer',
      resetAll:        'Alles resetten',
      // ... add any key from the pack reference below
    },
  },
],
```

<details>
<summary>Full pack key reference</summary>

```
title, language, profiles, colors, typography, visuals, focusAids, tools, manage,
contrastPlus, pauseAnimations, hideImages, highlightStructure, highlightLinks,
fontSize, dyslexicFont, letterSpacing, textAlign, cursor,
rulerTitle, focusTitle, cursorGuide, guideSize, guideOpacity,
textColor, linkColor, headingColor, selectionBackground, selectionText,
speak, stop, resetAll, position,
blind, colorBlind, dyslexia, lowVision, adhd, seizure,
saturation, screenReader, talktoWrite, accessibilityStatement,
theme, right, left, auto, dark, light, customTheme
```

</details>

---

### Section Visibility

Show or hide any section of the panel. Useful when certain features are not relevant to your site.

```js
sections: {
  language:   true,    // Language switcher
  profiles:   true,    // Disability profiles (Blind, ADHD, etc.)
  visuals:    true,    // Contrast, saturation, ruler, cursor guide
  typography: true,    // Font size, letter spacing, alignment
  colors:     true,    // Text / link / heading color swatches
  tools:      true,    // Read aloud, screen reader, dictation
  manage:     true,    // Theme & position toggles
},
```

Example — show only Typography and Colors:

```js
sections: {
  language:   false,
  profiles:   false,
  visuals:    false,
  typography: true,
  colors:     true,
  tools:      false,
  manage:     false,
},
```

---

### Custom Color Palettes

Override the default color swatches shown in the Colors section. Each palette is an array of hex color strings. The "site default" (no color) option is always prepended automatically.

```js
palettes: {
  text:          ['#111827', '#ffffff', '#e11d48', '#22c55e', '#eab308'],
  link:          ['#2563eb', '#7aa8ff', '#22c55e'],
  heading:       ['#111827', '#7aa8ff'],
  selectionBg:   ['#bde0fe', '#a7f3d0', '#fde68a'],
  selectionText: ['#111827', '#ffffff'],
},
```

| Palette key | Controls |
|---|---|
| `text` | Body text color |
| `link` | Anchor / link color |
| `heading` | `h1`–`h6` color |
| `selectionBg` | Text selection highlight background |
| `selectionText` | Text selection highlight foreground |

---

### Lifecycle Hooks

Callbacks fired at key moments in the widget's lifecycle.

```js
// Called once after the widget is fully mounted
onMount: (settings) => {
  console.log('Widget ready', settings);
},

// Called when the panel slides open
onOpen: () => {
  analytics.track('a11y_widget_opened');
},

// Called when the panel is closed
onClose: () => {
  analytics.track('a11y_widget_closed');
},

// Called when the user clicks "Reset all"
onReset: () => {
  console.log('Settings cleared');
},

// Called when the user switches language
onLangChange: (code) => {
  document.documentElement.lang = code;
},

// Called when the user switches theme
onThemeChange: (theme) => {
  console.log('Active theme:', theme);
},
```

---

## JavaScript API

After the widget is mounted, `window.AWIDGET` exposes a public API:

```js
// Open the panel programmatically
window.AWIDGET.open();

// Close the panel
window.AWIDGET.close();

// Unmount and clean up all DOM and event listeners
window.AWIDGET.unmount();

// Re-mount (e.g. after unmount)
window.AWIDGET.mount();
```

### Theme API — `window.AWIDGET_THEME`

```js
// Set theme: 'dark' | 'light' | 'custom:<name>'
window.AWIDGET_THEME.set('dark');
window.AWIDGET_THEME.set('custom:brand');

// Get the currently stored theme key
window.AWIDGET_THEME.get();   // → 'dark'

// Register a new custom theme at runtime
window.AWIDGET_THEME.add('ocean', {
  base: 'dark',
  vars: { '--aw-header': '#0369a1', '--aw-accent': '#38bdf8' },
});

// Remove a custom theme
window.AWIDGET_THEME.remove('ocean');

// List all registered custom theme names
window.AWIDGET_THEME.list();  // → ['brand', 'ocean']
```

### i18n API — `window.AWIDGET_I18N`

```js
// Switch language
window.AWIDGET_I18N.setLanguage('fr');

// Get the active language code
window.AWIDGET_I18N.getLanguage();  // → 'fr'

// Register a new language at runtime
window.AWIDGET_I18N.addLanguage('pt', {
  label: '🇵🇹 PT',
  rtl: false,
  pack: { title: 'Menu de acessibilidade', resetAll: 'Reiniciar tudo' },
});

// List all registered language codes
window.AWIDGET_I18N.list();  // → ['en', 'fr', 'ar', 'es', 'de', 'pt']
```

### Position API

```js
// Move the widget to the left or right
window.setAWIDGETPosition('left');
window.setAWIDGETPosition('right');
```

---

## Built-in Languages

The following languages are registered automatically — no configuration needed:

| Code | Language | Direction |
|---|---|---|
| `en` | English | LTR |
| `fr` | Français | LTR |
| `ar` | العربية | RTL |
| `es` | Español | LTR |
| `de` | Deutsch | LTR |

To switch the default on load, set `lang` in your config:

```js
window.AWIDGET_CONFIG = { lang: 'ar' };
```

---

## Built-in Profiles

One-click presets that combine multiple settings for common accessibility needs:

| Profile | What it enables |
|---|---|
| **Blind** | Screen reader mode |
| **Color Blind** | Grayscale filter, highlight links and headings |
| **Dyslexia** | OpenDyslexic font, larger font, wider letter spacing |
| **Low Vision** | Max font size, high contrast, big cursor, highlight structure |
| **ADHD** | Focus mask, cursor reading guide |
| **Seizure-safe** | Pause all animations, high contrast |

Activating a profile saves the previous state and restores it when the profile is toggled off.

---

## Browser Support

| Browser | Version |
|---|---|
| Chrome / Edge | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Mobile Chrome | 90+ |
| Mobile Safari | 14+ |

> Speech features (Read Aloud, Screen Reader, Talk-to-Write) require the Web Speech API, which is supported in all modern browsers except Firefox (partial support).
