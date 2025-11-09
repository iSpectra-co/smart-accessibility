(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(global);
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return factory(global); });
  } else {
    global.AWIDGET = factory(global);
  }
}(typeof window !== 'undefined' ? window : this, function (window) {
  'use strict';

  // DOM helpers
  let mounted = false;

  // CSS
  const CSS = `
    :root {
      --aw-user-heading: inherit;
      --aw-user-selection-bg: Highlight;
      --aw-user-selection-text: HighlightText;
      --aw-bg: #0b1220;
      --aw-panel: #111827;
      --aw-text: #f9fafb;
      --aw-muted: #9ca3af;
      --aw-accent: #60a5fa;
      --aw-border: #1f2937;
      --aw-user-bg: transparent;
      --aw-user-text: inherit;
      --aw-user-link: inherit;
      --aw-font-scale: 1;
      --aw-letter-spacing: 0.01em;
      --aw-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      --aw-contrast-filter: ;
      --aw-sat-filter: saturate(1);
      --aw-guide-color: var(--aw-accent);
      --aw-guide-opacity: 0.5;
      --aw-guide-thickness: 2px;
      --aw-guide-band: 44px;
      --aw-guide-spot: 140px;
      --aw-guide-shadow: 9999px;
    }

    :root[data-theme="dark"] {
      --aw-bg: #0b1220;
      --aw-panel: #111827;
      --aw-text: #f9fafb;
      --aw-muted: #9ca3af;
      --aw-accent: #60a5fa;
      --aw-border: #1f2937;
      --aw-header: #f9fafb;
    }

    :root[data-theme="light"] {
      --aw-bg: #eff1f5;
      --aw-panel: #f9fafb;
      --aw-text: #111827;
      --aw-muted: #6b7280;
      --aw-accent: #2a3bd1;
      --aw-border: #e5e7eb;
      --aw-header: #2a3bd1;
    }

    /* Text color (only if chosen) */
    #aw-scope.aw-has-text
      :where(
        p,
        li,
        blockquote,
        span,
        small,
        em,
        strong,
        b,
        i,
        code,
        kbd,
        mark,
        a,
        label,
        button,
        input,
        textarea,
        select,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        figcaption,
        caption,
        dd,
        dt,
        th,
        td,
        div
      ) {
      color: var(--aw-user-text) !important;
    }

    .aw-tile-link {
      color: var(--aw-user-text) !important;
    }

    /* Link color (only if chosen) */
    #aw-scope.aw-has-link a {
      color: var(--aw-user-link) !important;
    }

    /* Heading color (only if chosen) */
    #aw-scope.aw-has-heading :is(h1, h2, h3, h4, h5, h6) {
      color: var(--aw-user-heading) !important;
    }

    /* Selection colors (only if chosen) */
    #aw-scope.aw-has-selection ::selection {
      background: var(--aw-user-selection-bg);
      color: var(--aw-user-selection-text);
    }

    #aw-scope.aw-has-selection::-moz-selection {
      background: var(--aw-user-selection-bg);
      color: var(--aw-user-selection-text);
    }

    #aw-scope.aw-letter-wide
      :where(
        p,
        li,
        blockquote,
        span,
        a,
        label,
        button,
        input,
        textarea,
        select,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        small,
        em,
        strong,
        b,
        i,
        code,
        figcaption,
        caption
      ) {
      letter-spacing: var(--aw-letter-spacing) !important;
    }

    /* Keep the widget crisp and interactive */
    .aw-panel,
    .aw-panel * {
      filter: none !important;
    }

    #aw-scope.aw-filter-scope {
      will-change: filter;
      transition: filter 0.3s ease;
    }

    /* Only the page content inside #aw-scope is frozen */
    #aw-scope.aw-noanim,
    #aw-scope.aw-noanim *,
    #aw-scope.aw-noanim *::before,
    #aw-scope.aw-noanim *::after {
      animation: none !important;
      animation-play-state: paused !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }

    #aw-scope.aw-noanim {
      scroll-snap-type: none !important;
    }

    #aw-scope.aw-noanim * {
      scroll-snap-align: none !important;
      scroll-snap-stop: normal !important;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.001s !important;
        animation-iteration-count: 1 !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }

    .aw-panel {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue",
        Arial;
      margin: 0;
      color: var(--aw-user-text, var(--aw-text));
      background: var(--aw-user-bg, var(--aw-bg));
      line-height: 1.6;
      letter-spacing: var(--aw-letter-spacing);
      font-size: calc(16px * var(--aw-font-scale));
      position: fixed;
      contain: paint;
      isolation: isolate;
    }

    .aw-contrast-invert {
      --aw-contrast-filter: invert(1) hue-rotate(180deg);
    }

    .aw-contrast-dark {
      --aw-contrast-filter: contrast(1.2) brightness(0.9);
    }

    .aw-contrast-light {
      --aw-contrast-filter: contrast(1.1) brightness(1.1);
    }

    .aw-noanim *,
    .aw-noanim *::before,
    .aw-noanim *::after {
      animation: none !important;
      transition: none !important;
    }

    /* Hide all site images EXCEPT the ones inside the widget */
    .aw-hide-imgs img,
    .aw-hide-imgs picture,
    .aw-hide-imgs video,
    .aw-hide-imgs figure,
    .aw-hide-imgs svg {
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.2s;
    }

    /* Keep the widget's images fully visible */
    #aw-root img,
    #aw-root picture,
    #aw-root video,
    #aw-root figure,
    #aw-root svg {
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    @font-face {
      font-family: "OpenDyslexic";
      src: url("https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/otf/OpenDyslexic-Regular.otf")
        format("opentype");
      font-display: swap;
    }

    .aw-dyslexic {
      font-family: "OpenDyslexic";
    }

    .aw-highlight a {
      background: rgba(96, 165, 250, 0.2);
      outline: 2px dashed var(--aw-accent);
    }

    .aw-highlight :is(h1, h2, h3, h4, h5, h6) {
      background: rgba(16, 185, 129, 0.18);
      outline: 2px dashed #10b981;
    }

    .aw-align-left
      :where(
        p,
        li,
        blockquote,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        div,
        section,
        article,
        span,
        a,
        label,
        figcaption,
        caption
      ) {
      text-align: left !important;
    }

    .aw-align-center
      :where(
        p,
        li,
        blockquote,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        div,
        section,
        article,
        span,
        a,
        label,
        figcaption,
        caption
      ) {
      text-align: center !important;
    }

    .aw-align-right
      :where(
        p,
        li,
        blockquote,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        div,
        section,
        article,
        span,
        a,
        label,
        figcaption,
        caption
      ) {
      text-align: right !important;
    }

    .aw-align-justify
      :where(
        p,
        li,
        blockquote,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        div,
        section,
        article,
        span,
        a,
        label,
        figcaption,
        caption
      ) {
      text-align: center !important;
    }

    /* Never touch the widget UI */
    #aw-root span {
      text-align: center !important;
    }

    #aw-root span {
      text-align: center !important;
    }

    .aw-cursor-big,
    .aw-cursor-big * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='6' cy='6' r='5' fill='white' stroke='black' stroke-width='2'/%3E%3C/svg%3E")
          2 2,
        default !important;
    }

    .aw-cursor-cross,
    .aw-cursor-cross * {
      cursor: crosshair !important;
    }

    .aw-ruler {
      position: fixed;
      left: 0;
      width: 100vw;
      height: 44px;
      pointer-events: none;
      z-index: 2147483645;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55) inset, 0 0 0 2px var(--aw-accent);
      border-radius: 4px;
      display: none;
    }

    .aw-ruler.aw-on {
      display: block;
    }

    .aw-focusmask {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: saturate(60%) blur(0.5px);
      z-index: 2147483644;
      display: none;
    }

    .aw-focusmask.aw-on {
      display: block;
    }

    .aw-guide-line {
      position: fixed;
      left: 0;
      width: 100vw;
      height: var(--aw-guide-thickness);
      background: var(--aw-guide-color);
      box-shadow: 0 0 0 2px var(--aw-guide-color);
      pointer-events: none;
      z-index: 2147483643;
      display: none;
    }

    .aw-guide-bar {
      position: fixed;
      left: 0;
      width: 100vw;
      height: var(--aw-guide-band);
      background: color-mix(in srgb, var(--aw-guide-color) 25%, transparent);
      outline: 2px solid var(--aw-guide-color);
      pointer-events: none;
      z-index: 2147483643;
      display: none;
      border-radius: 4px;
    }

    .aw-guide-spot-wrap {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483642;
      display: none;
    }

    .aw-guide-spot-wrap::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, var(--aw-guide-opacity));
      -webkit-mask: radial-gradient(
        circle var(--aw-guide-spot) at var(--gx) var(--gy),
        transparent 0 98%,
        #000 99%
      );
      mask: radial-gradient(
        circle var(--aw-guide-spot) at var(--gx) var(--gy),
        transparent 0 98%,
        #000 99%
      );
      box-shadow: 0 0 0 var(--aw-guide-shadow)
        color-mix(in srgb, var(--aw-guide-color) 35%, transparent);
    }

    .aw-fab {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      background: var(--aw-header);
      color: var(--aw-panel);
      border: 1px solid var(--aw-border);
      display: grid;
      place-items: center;
      cursor: pointer;
      z-index: 2147483646;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .aw-fab:hover {
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
    }

    .aw-panel {
      position: fixed;
      right: 0px;
      bottom: 0;
      top: 0;
      width: min(92vw, 500px);
      background: var(--aw-bg);
      color: var(--aw-text);
      border: 1px solid var(--aw-border);
      padding: 12px;
      z-index: 2147483647;
      box-shadow: var(--aw-shadow);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      overflow-y: auto;
      scrollbar-color: var(--aw-accent) var(--aw-bg);
      padding-top: 0;
    }

    .aw-panel::-webkit-scrollbar {
      width: 10px;
    }

    .aw-panel::-webkit-scrollbar-track {
      background: #0f172a;
      border-radius: 12px;
    }

    .aw-panel::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--aw-accent) 90%, transparent),
        color-mix(in srgb, var(--aw-accent) 60%, transparent)
      );
      border-radius: 12px;
      border: 2px solid #0f172a;
    }

    .aw-panel::-webkit-scrollbar-thumb:hover {
      filter: brightness(1.1);
    }

    .aw-panel.aw-open {
      opacity: 1;
      pointer-events: auto;
    }

    .aw-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }

    .aw-close {
      background: transparent;
      border: 0;
      color: var(--aw-text);
      font-size: 20px;
      cursor: pointer;
      border-radius: 8px;
      padding: 4px;
    }

    .aw-acc {
      box-shadow: 2px 1px 4px 3px var(--aw-border);
      border: 1px solid var(--aw-border);
      border-radius: 14px;
      margin: 10px 0;
    }

    .aw-acc > summary {
      list-style: none;
      cursor: pointer;
      user-select: none;
      padding: 12px 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .aw-acc > summary::marker {
      display: none;
    }

    .aw-acc[open] > summary {
      background: rgba(96, 165, 250, 0.08);
      border-radius: 10px 10px 0 0;
    }

    .aw-acc .acc-body {
      padding: 10px 12px 14px;
    }

    .aw-langgrid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 6px;
    }

    .aw-langopt {
      appearance: none;
      -webkit-appearance: none;
      background: var(--aw-bg);
      border: 1px solid var(--aw-border);
      color: var(--aw-text);
      padding: 6px 8px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      text-align: center;
    }

    .aw-langopt[aria-checked="true"] {
      border-color: var(--aw-accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--aw-accent) 40%, transparent);
      background: linear-gradient(
        180deg,
        rgba(96, 165, 250, 0.12),
        rgba(96, 165, 250, 0.06)
      );
    }

    .aw-section {
      font-size: 12px;
      color: var(--aw-muted);
      margin: 6px 2px 6px;
    }

    .aw-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }

    @media (min-width: 520px) {
      .aw-grid {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }

    .aw-grid-no {
      grid-template-columns: 1fr;
    }

    .aw-tile {
      background: var(--aw-panel);
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 12px;
      min-height: 64px;
      border: 1px solid var(--aw-border);
      border-radius: 14px;
      cursor: pointer;
      user-select: none;
      outline: none;
    }

    .aw-tile:hover {
      border-color: var(--aw-accent);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25);
      background: linear-gradient(
        to bottom right,
        rgba(96, 165, 250, 0.1),
        rgba(96, 165, 250, 0.05)
      );
    }

    .aw-tile:focus-visible {
      outline: 3px solid var(--aw-accent);
      outline-offset: 2px;
    }

    .aw-tile[aria-pressed="true"] {
      border-color: var(--aw-accent);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25);
      background: linear-gradient(
        to bottom right,
        rgba(96, 165, 250, 0.1),
        rgba(96, 165, 250, 0.05)
      );
    }

    .aw-tile-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-direction: column;
    }

    .aw-tile-title {
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }

    .aw-ico {
      width: 2rem;
      height: 1.975rem;
      display: inline-flex;
    }

    .aw-steps {
      margin-top: auto;
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .aw-step {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
    }

    .aw-step.on {
      background: var(--aw-accent);
    }

    .aw-footer {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 8px;
      padding-top: 8px;
      flex-wrap: wrap;
      border-top: 1px solid var(--aw-border);
    }

    .aw-btn {
      background: var(--aw-bg);
      color: var(--aw-text);
      border: 1px solid var(--aw-border);
      border-radius: 10px;
      padding: 6px 10px;
      cursor: pointer;
    }

    .aw-small {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 8px;
    }

    .aw-reset-wide {
      display: block;
      width: 100%;
      margin-top: 12px;
      background: linear-gradient(90deg, #4463ef, #1a2ed6);
      border: 0;
      color: white;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 12px 14px;
      border-radius: 12px;
    }

    .aw-reset-wide:hover {
      filter: brightness(1.05);
    }

    .aw-swatch-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
    }

    .aw-swatch {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: 2px solid #374151;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .aw-swatch[aria-pressed="true"] {
      outline: 3px solid var(--aw-accent) !important;
    }

    .aw-swatch.none {
      background: repeating-conic-gradient(#aaa 0 25%, transparent 0 50%) 50%/8px
        8px #222;
    }

    .aw-acc > summary {
      position: relative;
      padding-right: 34px;
      padding-left: 34px;
    }

    .aw-acc > summary::after {
      content: "";
      position: absolute;
      right: 12px;
      top: 50%;
      width: 18px;
      height: 18px;
      transform: translateY(-50%) rotate(-90deg);
      transition: transform 0.2s ease, opacity 0.2s ease;
      opacity: 0.9;
      background: var(--aw-muted);
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M8.12 4.71L6.71 6.12 12.59 12l-5.88 5.88 1.41 1.41L15.41 12 8.12 4.71z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M8.12 4.71L6.71 6.12 12.59 12l-5.88 5.88 1.41 1.41L15.41 12 8.12 4.71z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[open] > summary::after {
      transform: translateY(-50%) rotate(0deg);
      background: var(--aw-accent);
    }

    .aw-panel.aw-open[dir="rtl"] .aw-acc > summary {
      padding-right: 34px;
      padding-left: 34px;
    }

    .aw-panel.aw-open[dir="rtl"] .aw-acc > summary::after {
      right: auto;
      left: 12px;
      transform: translateY(-50%) scaleX(-1) rotate(-90deg);
    }

    .aw-panel.aw-open[dir="rtl"] .aw-acc[open] > summary::after {
      transform: translateY(-50%) scaleX(-1) rotate(0deg);
    }

    .aw-acc > summary::before {
      content: "";
      position: absolute;
      left: 10px;
      top: 50%;
      width: 18px;
      height: 18px;
      transform: translateY(-50%);
      background: currentColor;
      opacity: 0.9;
    }

    .aw-panel.aw-open[dir="rtl"] .aw-acc > summary::before {
      left: auto;
      right: 10px;
    }

    .aw-acc[data-sec="language"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 7.75 6H13a17 17 0 0 0-1-4 8 8 0 0 1 0-2ZM12 20a8 8 0 0 1 0-16 17 17 0 0 0 0 16Zm2-2.1a15 15 0 0 1-1-3.9h6.75A8 8 0 0 1 14 17.9Zm-1-5.9a15 15 0 0 1 0-2h7.75a8 8 0 0 1 0 2H13Zm0-4a15 15 0 0 1 1-3.9A8 8 0 0 1 19.75 10H13Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 7.75 6H13a17 17 0 0 0-1-4 8 8 0 0 1 0-2ZM12 20a8 8 0 0 1 0-16 17 17 0 0 0 0 16Zm2-2.1a15 15 0 0 1-1-3.9h6.75A8 8 0 0 1 14 17.9Zm-1-5.9a15 15 0 0 1 0-2h7.75a8 8 0 0 1 0 2H13Zm0-4a15 15 0 0 1 1-3.9A8 8 0 0 1 19.75 10H13Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="profiles"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="visuals"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M5 10h6v2H5v-2Zm8 0h6v2h-6v-2ZM3 6h10v2H3V6Zm8 8h10v2H11v-2ZM3 18h6v2H3v-2Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M5 10h6v2H5v-2Zm8 0h6v2h-6v-2ZM3 6h10v2H3V6Zm8 8h10v2H11v-2ZM3 18h6v2H3v-2Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="typography"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M4 17h16v2H4v-2ZM10 5h4l4 10h-2.5l-1-2.5h-5L8 15H5l5-10Zm1.8 5h2.4L12 7.8 11.8 10Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M4 17h16v2H4v-2ZM10 5h4l4 10h-2.5l-1-2.5h-5L8 15H5l5-10Zm1.8 5h2.4L12 7.8 11.8 10Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="colors"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a3 3 0 1 1 0-6h1a2.5 2.5 0 0 0 0-5H12Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a3 3 0 1 1 0-6h1a2.5 2.5 0 0 0 0-5H12Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="focus"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="tools"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M22 12.3 18.7 9l-2.1.7-.8 2.1L19.7 15a6.5 6.5 0 0 1-10 3.4L7 21H4v-3l2.6-2.6A6.5 6.5 0 0 1 20 5.3l-4.2 4.2.7 2.2 2.2.6 3.3 3.3Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M22 12.3 18.7 9l-2.1.7-.8 2.1L19.7 15a6.5 6.5 0 0 1-10 3.4L7 21H4v-3l2.6-2.6A6.5 6.5 0 0 1 20 5.3l-4.2 4.2.7 2.2 2.2.6 3.3 3.3Z'/></svg>")
        no-repeat center/contain;
    }

    /* Make the panel a 3-row container: header / scrollable body / sticky footer */
    .aw-panel {
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 0;
      overflow: hidden;
      border-radius: 10px;
      border: none;
    }

    #aw-scope ::selection {
      background: var(--aw-user-selection-bg, Highlight);
      color: var(--aw-user-selection-text, HighlightText);
    }

    #aw-scope::-moz-selection {
      background: var(--aw-user-selection-bg, Highlight);
      color: var(--aw-user-selection-text, HighlightText);
    }

    /* Scroll only the body area */
    .aw-body {
      overflow: auto;
      padding: 12px;
    }

    /* Keep header behavior as-is (already sticky) */
    .aw-header {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--aw-header);
      color: var(--aw-bg);
      padding: 15px;
      z-index: 10;
      border-radius: 10px;
    }

    /* Header title */
    .aw-header h2 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: inherit;
    }

    /* Close (X) button */
    .aw-close {
      background: none;
      color: var(--aw-bg);
      display: flex;
    }

    .aw-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .aw-close svg {
      width: 20px;
      height: 20px;
      pointer-events: none;
    }

    /* Footer pinned to bottom *inside* the panel */
    .aw-maintainer {
      position: sticky;
      display: none;
      align-items: center;
      justify-content: space-between;
      bottom: 0;
      background: var(--aw-bg);
      color: var(--aw-text);
      border-top: 1px solid var(--aw-border);
      padding: 10px 12px;
      margin: 0;
      width: auto;
      z-index: 1;
    }

    .aw-panel.aw-open .aw-maintainer {
      display: flex;
    }
  `;

  // HTML (panel + overlays + fab)
  const HTML = `
    <button id="aw-fab" class="aw-fab" type="button" aria-haspopup="dialog" aria-controls="aw-panel">
      <svg class="aw-ico" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="4.5" r="1.8" fill="currentColor"></circle>
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 7v4h4"></path>
          <path d="M14 11l2 5h3"></path>
          <circle cx="10" cy="16" r="4.5"></circle>
          <path d="M8 14l2 2"></path>
        </g>
      </svg>
    </button>

    <div class="aw-panel" id="aw-panel" role="dialog" aria-modal="true" aria-labelledby="aw-title">
      <div class="aw-header" id="aw-drag">
        <h2 id="aw-title" data-i18n="title">Accessibility Menu</h2>
        <button class="aw-close" id="aw-close" aria-label="Close menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor"
              d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z" />
          </svg>
        </button>
      </div>
      <div class="aw-body">
        <details class="aw-acc" data-sec="language">
          <summary data-i18n="language">Language</summary>
          <div class="acc-body">
            <div id="aw-langgrid" class="aw-langgrid" role="radiogroup" aria-label="Language"></div>
          </div>
        </details>

        <details class="aw-acc" data-sec="profiles" open>
          <summary data-i18n="profiles">Profiles</summary>
          <div class="acc-body">
            <div class="aw-grid">
              <div class="aw-tile" tabindex="0" role="button" data-profile="blind" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="blind">Blind</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="colorblind" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="colorBlind">Color Blind</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="dyslexia" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="dyslexia">Dyslexia</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="lowvision" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="lowVision">Low Vision</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="adhd" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="adhd">ADHD</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="seizure" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="seizure">Seizure & Epileptic</span>
                </div>
              </div>
            </div>
          </div>
        </details>

        <details class="aw-acc" data-sec="visuals">
          <summary data-i18n="visuals">Visuals</summary>
          <div class="acc-body">
            <div class="aw-grid">
              <div class="aw-tile" tabindex="0" role="button" data-cycle="contrastPlus" data-steps="3" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="contrastPlus">Contrast Modes</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="saturation" data-steps="3" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="saturation">Saturation</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="noanim" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="pauseAnimations">Pause Animations</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="hideimgs" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="hideImages">Hide Images</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="highlight" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="highlightStructure">Highlight Structure</span>
                </div>
              </div>
            </div>
          </div>
        </details>

        <details class="aw-acc" data-sec="typography">
          <summary data-i18n="typography">Typography</summary>
          <div class="acc-body">
            <div class="aw-grid">
              <div class="aw-tile" tabindex="0" role="button" data-cycle="fontLevel" data-steps="3" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="fontSize">Font Size</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="dyslexic" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="dyslexicFont">Dyslexia-Friendly Font</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="letterLevel" data-steps="2" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="letterSpacing">Letter Spacing</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="align" data-steps="3" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="textAlign">Text Alignment</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorIdx" data-steps="2" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="cursor">Pointer Type</span>
                </div>
                <div class="aw-steps"></div>
              </div>
            </div>
          </div>
        </details>

        <details class="aw-acc" data-sec="colors">
          <summary data-i18n="colors">Colors</summary>
          <div class="acc-body">
            <div class="aw-grid aw-grid-no">
              <div class="aw-tile" tabindex="-1" role="group" aria-label="Text color">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="textColor">Text Color</span>
                </div>
                <div id="swatch-text" class="aw-swatch-row"></div>
              </div>

              <div class="aw-tile" tabindex="-1" role="group" aria-label="Link color">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="linkColor">Link Color</span>
                </div>
                <div id="swatch-link" class="aw-swatch-row"></div>
              </div>

              <!-- NEW: Headings color -->
              <div class="aw-tile" tabindex="-1" role="group" aria-label="Heading color">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="headingColor">Heading Color</span>
                </div>
                <div id="swatch-heading" class="aw-swatch-row"></div>
              </div>

              <!-- NEW: Selection colors -->
              <div class="aw-tile" tabindex="-1" role="group" aria-label="Selection colors">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="selectionBackground">Selection Background</span>
                </div>
                <div id="swatch-selection-bg" class="aw-swatch-row"></div>
              </div>

              <div class="aw-tile" tabindex="-1" role="group" aria-label="Selection text color">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="selectionText">Selection Text</span>
                </div>
                <div id="swatch-selection-text" class="aw-swatch-row"></div>
              </div>
            </div>
          </div>
        </details>

        <details class="aw-acc" data-sec="focus">
          <summary data-i18n="focusAids">Focus</summary>
          <div class="acc-body">
            <div class="aw-grid">
              <div class="aw-tile" tabindex="0" role="button" data-toggle="ruler" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="rulerTitle">Reading Ruler</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="focusmode" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="focusTitle">Focus Mask</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideMode" data-steps="3"
                aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="cursorGuide">Cursor Reading Guide</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideSize" data-steps="2"
                aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="guideSize">Guide Size</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideOpacity" data-steps="2"
                aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="guideOpacity">Guide Opacity</span>
                </div>
                <div class="aw-steps"></div>
              </div>
            </div>
          </div>
        </details>

        <details class="aw-acc" data-sec="tools">
          <summary data-i18n="tools">Tools</summary>
          <div class="acc-body">
            <div class="aw-grid">
              <div class="aw-tile" tabindex="0" role="button" data-action="read" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="speak">Read Selection Aloud</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-action="stop" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="stop">Stop Speech</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-toggle="screenReader" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="screenReader">Screen Reader</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-action="dictate" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="talktoWrite">Talk-to-Write</span>
                </div>
              </div>
            </div>
          </div>
        </details>

        <div class="aw-footer">
          <div style="display: flex; gap: 8px; align-items: center">
            <label class="aw-section" for="aw-theme" data-i18n="theme">Theme</label>
            <select id="aw-theme" class="aw-btn aw-small" title="Theme">
              <option value="dark" data-i18n="dark">Dark</option>
              <option value="light" data-i18n="light">Light</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px; align-items: center">
            <label for="aw-side" class="aw-section" data-i18n="position">Position</label>
            <select id="aw-side" class="aw-btn aw-small" title="Snap to side">
              <option value="right" data-i18n="right">Right</option>
              <option value="left" data-i18n="left">Left</option>
            </select>
          </div>
          <span class="aw-section" id="aw-status" aria-live="polite"></span>
        </div>

        <button class="aw-btn aw-reset-wide" data-action="reset" data-i18n="resetAll">
          Reset all
        </button>
      </div>
      <div class="aw-maintainer">
        <a href="https://ispectra.co" title="Home" rel="home" class="site-logo d-block" id="aw-logo"></a>
        <a class="aw-tile-link" target="_blank">
          <div class="aw-tile-head">
            <span class="aw-tile-title" data-i18n="accessibilityStatement">Accessibility Statement</span>
          </div>
        </a>
      </div>
    </div>

    <div class="aw-ruler" id="aw-ruler"></div>
    <div class="aw-focusmask" id="aw-focus"></div>
    <div class="aw-guide-line" id="aw-guide-line"></div>
    <div class="aw-guide-bar" id="aw-guide-bar"></div>
    <div class="aw-guide-spot-wrap" id="aw-guide-spot"></div>
  `;

  // Site Logo (Dark, Light)
  const Logos = {
    light: ` <svg xmlns="http://www.w3.org/2000/svg" width="160" height="79" viewBox="0 0 160 79" fill="none">
      <rect x="10.5229" y="26.7928" width="4.38498" height="11.9475" transform="rotate(30.4443 10.5229 26.7928)" fill="#10D4B6"/>
      <rect x="24.0425" y="28.7609" width="4.38498" height="11.9475" transform="rotate(-30.44 24.0425 28.7609)" fill="#AED6FA"/>
      <rect x="4.46924" y="41.6571" width="4.38554" height="11.9475" transform="rotate(-25.6726 4.46924 41.6571)" fill="#10D4B6"/>
      <rect x="30.2344" y="38.7405" width="4.38498" height="11.9475" transform="rotate(25.67 30.2344 38.7405)" fill="#D9F6FC"/>
      <rect x="14.1289" y="53.5477" width="4.38498" height="11.9475" transform="rotate(-90 14.1289 53.5477)" fill="#D8F5FB"/>
      <rect x="12.0947" y="30.161" width="4.38498" height="11.9475" transform="rotate(-90 12.0947 30.161)" fill="#B6DBFE"/>
      <circle cx="12.1689" cy="51.1491" r="4.78706" fill="#13D6B8"/>
      <circle cx="26.0707" cy="51.1491" r="4.78706" fill="#C5F5F8"/>
      <circle cx="12.1689" cy="27.1802" r="4.78706" fill="#10D4B6"/>
      <circle cx="26.0707" cy="27.1802" r="4.78706" fill="#77BFFD"/>
      <circle cx="5.78706" cy="39.4807" r="4.78706" fill="#10D4B6"/>
      <circle cx="32.7143" cy="39.4807" r="4.78706" fill="#1687F6"/>
      <path d="M16.1567 37.0061C16.9855 36.5746 17.3419 35.8501 18.3174 35.608C19.04 35.4287 19.496 35.4514 20.2239 35.608C21.2893 35.8372 21.7558 36.5746 22.6388 37.0061C23.5218 37.4377 23.5285 38.9127 23.5285 38.9127C23.5285 38.9127 23.6754 39.9366 23.5285 40.565C23.3818 41.1926 23.4362 41.7425 22.4635 42.1401C21.4908 42.5376 20.633 43.2344 20.2239 43.3612C19.5628 43.5661 19.2328 43.5107 18.6987 43.3612C18.3634 43.2673 17.2505 42.5376 16.3729 42.1401C15.4954 41.7425 15.4136 41.1913 15.267 40.565C15.1199 39.9367 15.1441 39.5461 15.267 38.9127C15.4235 38.1061 15.3279 37.4377 16.1567 37.0061Z" fill="#11D4B6"/>
      <path d="M45.0711 34.753C44.4911 34.753 43.9079 34.7244 43.2994 34.642C42.6909 34.5596 42.1363 34.4487 41.6102 34.2807C41.0841 34.1159 40.6151 33.9195 40.1999 33.6722C39.8956 33.5074 39.6738 33.2856 39.5343 33.0352C39.4234 32.7595 39.3695 32.5091 39.4234 32.2334C39.4519 31.9577 39.5629 31.7073 39.7277 31.514C39.8925 31.2921 40.089 31.1527 40.3647 31.0988C40.6404 31.0449 40.9193 31.0988 41.2489 31.2636C41.8289 31.5678 42.4374 31.7897 43.1029 31.9291C43.7685 32.0686 44.4309 32.151 45.0679 32.151C46.063 32.151 46.7571 32.0115 47.1976 31.7073C47.6382 31.403 47.8632 31.0164 47.8632 30.5727C47.8632 30.1575 47.6984 29.8533 47.3941 29.6314C47.0899 29.4096 46.5638 29.2162 45.8158 29.0768L43.4896 28.5792C42.1902 28.3035 41.2204 27.8313 40.5834 27.1689C39.9463 26.5065 39.6421 25.6476 39.6421 24.5669C39.6421 23.876 39.7815 23.2675 40.0573 22.6844C40.333 22.1298 40.7228 21.6322 41.2458 21.217C41.7687 20.8018 42.3803 20.4976 43.0998 20.3043C43.8192 20.0824 44.621 20 45.5084 20C46.2564 20 47.0043 20.0824 47.7491 20.2757C48.497 20.4405 49.1341 20.7194 49.7141 21.0776C49.9644 21.2424 50.1577 21.4389 50.2687 21.6861C50.3796 21.9364 50.4081 22.1836 50.3796 22.4625C50.3511 22.7414 50.2402 22.9601 50.0753 23.1281C49.9105 23.3214 49.6887 23.4323 49.4383 23.4894C49.1879 23.5432 48.8583 23.4894 48.497 23.296C48.0533 23.0742 47.5843 22.9094 47.0867 22.7985C46.5606 22.6875 46.063 22.6337 45.5084 22.6337C44.9284 22.6337 44.4562 22.7161 44.041 22.8555C43.6259 22.995 43.3216 23.2168 43.1283 23.4925C42.935 23.7683 42.824 24.0725 42.824 24.4338C42.824 24.8205 42.9635 25.1247 43.2392 25.3751C43.515 25.6255 44.0157 25.8188 44.7351 25.9551L47.0328 26.4526C48.3893 26.7284 49.3844 27.2006 50.05 27.8376C50.7155 28.4746 51.0451 29.305 51.0451 30.3572C51.0451 31.0481 50.9057 31.6566 50.6014 32.2112C50.3257 32.7658 49.9105 33.2349 49.413 33.6215C48.9154 34.0082 48.2784 34.3124 47.5589 34.5343C46.811 34.6452 46.0092 34.7561 45.0679 34.7561L45.0711 34.753Z" fill="#102235"/>
      <path d="M54.3706 34.6992C53.9015 34.6992 53.5117 34.5597 53.236 34.3125C52.9603 34.0368 52.8208 33.647 52.8208 33.1494V25.8696C52.8208 25.372 52.9602 24.9853 53.2075 24.7064C53.4832 24.4307 53.8445 24.3198 54.3421 24.3198C54.8111 24.3198 55.2009 24.4592 55.4481 24.7064C55.6985 24.9822 55.8348 25.372 55.8348 25.8696V27.169L55.6129 26.3925C55.8887 25.7555 56.3038 25.2294 56.887 24.8712C57.467 24.4846 58.1325 24.2913 58.9058 24.2913C59.6791 24.2913 60.3447 24.4846 60.8422 24.8459C61.3683 25.2072 61.7265 25.7872 61.9483 26.5351H61.6726C61.9768 25.8442 62.4491 25.3181 63.0576 24.9029C63.6946 24.4878 64.3855 24.2944 65.1873 24.2944C65.9891 24.2944 66.5976 24.4339 67.0984 24.7381C67.5991 25.0424 67.9826 25.5146 68.233 26.1485C68.4834 26.7855 68.5943 27.5873 68.5943 28.5286V33.1494C68.5943 33.647 68.4548 34.0336 68.2076 34.3125C67.9319 34.5882 67.5421 34.6992 67.0445 34.6992C66.5755 34.6992 66.1856 34.5597 65.9099 34.3125C65.6342 34.0368 65.4947 33.647 65.4947 33.1494V28.611C65.4947 27.9201 65.3838 27.4225 65.1905 27.1151C64.9972 26.8077 64.6105 26.646 64.0844 26.646C63.5044 26.646 63.0607 26.8394 62.728 27.2545C62.3952 27.6697 62.2304 28.2497 62.2304 28.9976V33.1209C62.2304 33.6184 62.0909 34.0051 61.8437 34.284C61.568 34.5597 61.2067 34.6706 60.7091 34.6706C60.2115 34.6706 59.8249 34.5312 59.5745 34.284C59.2988 34.0083 59.1593 33.6184 59.1593 33.1209V28.5825C59.1593 27.8916 59.0484 27.394 58.8266 27.0866C58.6047 26.7823 58.2466 26.6175 57.7744 26.6175C57.1944 26.6175 56.7222 26.8108 56.3894 27.226C56.0566 27.6412 55.8918 28.2212 55.8918 28.9691V33.0923C55.9204 34.1984 55.3943 34.696 54.3706 34.696V34.6992Z" fill="#102235"/>
      <path d="M74.4061 34.7529C73.6296 34.7529 72.9672 34.6134 72.3872 34.3377C71.8073 34.062 71.3636 33.6722 71.0308 33.2031C70.698 32.7055 70.5332 32.1509 70.5332 31.5424C70.5332 30.7945 70.7265 30.2145 71.1132 29.7993C71.4998 29.3841 72.1083 29.0799 72.9672 28.8865C73.8261 28.6932 74.9607 28.6108 76.371 28.6108H77.4517V30.2145H76.3995C75.6801 30.2145 75.1255 30.243 74.7103 30.3254C74.2951 30.4078 73.9909 30.5187 73.7976 30.712C73.6042 30.9054 73.5218 31.1272 73.5218 31.4315C73.5218 31.7928 73.6613 32.097 73.9085 32.3442C74.1842 32.5946 74.5455 32.7055 75.0431 32.7055C75.4297 32.7055 75.791 32.6231 76.0953 32.4298C76.3995 32.265 76.6499 32.0146 76.8432 31.6818C77.008 31.3776 77.119 30.9909 77.119 30.5472V28.221C77.119 27.6125 76.9795 27.1973 76.7038 26.947C76.4281 26.6966 75.9558 26.5603 75.2935 26.5603C74.9322 26.5603 74.5455 26.5888 74.105 26.6712C73.6613 26.7536 73.1922 26.8931 72.6947 27.1149C72.3904 27.2258 72.1147 27.2544 71.8928 27.1973C71.671 27.1403 71.5062 27.004 71.3667 26.8107C71.2558 26.6173 71.1734 26.3955 71.1734 26.1451C71.1734 25.8948 71.2273 25.6761 71.3667 25.4542C71.5062 25.2324 71.728 25.0676 72.0576 24.9566C72.6947 24.7063 73.2746 24.5415 73.8578 24.4305C74.4124 24.3196 74.9385 24.2657 75.4075 24.2657C76.4597 24.2657 77.3186 24.4305 78.0095 24.7348C78.7004 25.039 79.198 25.5113 79.5593 26.1451C79.8921 26.7822 80.0569 27.6125 80.0569 28.5791V33.1175C80.0569 33.6151 79.9174 34.0018 79.6702 34.2807C79.423 34.5595 79.0617 34.6673 78.618 34.6673C78.149 34.6673 77.7877 34.5279 77.5373 34.2807C77.2869 34.0049 77.1506 33.6151 77.1506 33.1175V32.3696L77.2901 32.509C77.2077 32.9527 77.0397 33.3394 76.764 33.6722C76.4883 34.0049 76.1555 34.2521 75.7688 34.4486C75.3822 34.6451 74.9385 34.7529 74.4124 34.7529H74.4061Z" fill="#102235"/>
      <path d="M84.0084 34.6991C83.4823 34.6991 83.0957 34.5597 82.82 34.3125C82.5442 34.0367 82.4048 33.6469 82.4048 33.1493V25.8695C82.4048 25.3719 82.5442 24.9853 82.7914 24.7064C83.0386 24.4275 83.4285 24.3197 83.926 24.3197C84.3951 24.3197 84.7849 24.4592 85.0321 24.7064C85.2825 24.9821 85.4188 25.3719 85.4188 25.8695V26.9217H85.2254C85.3649 26.0914 85.723 25.4543 86.3062 25.0106C86.8608 24.5669 87.6056 24.3197 88.5215 24.2627C88.8543 24.2342 89.1015 24.3166 89.298 24.5131C89.4913 24.7064 89.5737 25.0392 89.6022 25.5082C89.6022 25.9234 89.5198 26.2562 89.3265 26.5034C89.1332 26.7506 88.8004 26.89 88.3313 26.9471L87.8623 26.9756C87.0858 27.0295 86.5058 27.2798 86.1192 27.6411C85.7325 28.0278 85.5645 28.5824 85.5645 29.3018V33.1208C85.5645 33.6184 85.4251 34.005 85.1779 34.2839C84.9307 34.5628 84.5409 34.6991 84.0148 34.6991H84.0084Z" fill="#102235"/>
      <path d="M95.7986 34.753C94.8573 34.753 94.0555 34.5882 93.447 34.284C92.81 33.9797 92.3409 33.5075 92.0367 32.9275C91.7324 32.319 91.593 31.5711 91.593 30.6583V26.7823H90.6802C90.3189 26.7823 90.0147 26.6714 89.8213 26.478C89.5995 26.2847 89.5171 26.009 89.5171 25.6192C89.5171 25.2293 89.628 24.9821 89.8213 24.7888C90.0432 24.5955 90.3189 24.5131 90.6802 24.5131H91.593V22.9348C91.593 22.4087 91.7324 22.022 91.9796 21.7717C92.2553 21.5213 92.6166 21.385 93.1142 21.385C93.6118 21.385 93.9984 21.5245 94.2773 21.7717C94.5562 22.0189 94.664 22.4087 94.664 22.9348V24.5131H96.5751C96.9617 24.5131 97.266 24.5955 97.4878 24.7888C97.6811 24.9821 97.7921 25.2579 97.7921 25.6192C97.7921 25.9805 97.6811 26.2847 97.4878 26.478C97.2945 26.6714 96.9902 26.7823 96.5751 26.7823H94.664V30.5189C94.664 31.0988 94.8034 31.514 95.0506 31.7929C95.2979 32.0718 95.7415 32.2081 96.3247 32.2081C96.518 32.2081 96.7113 32.1796 96.9047 32.1542C97.098 32.1288 97.2374 32.1003 97.3737 32.1003C97.567 32.1003 97.735 32.1542 97.8428 32.2651C97.9822 32.4046 98.0361 32.6803 98.0361 33.124C98.0361 33.4568 97.9822 33.761 97.8713 34.0082C97.7604 34.2586 97.567 34.4234 97.2913 34.5058C97.1265 34.5597 96.8761 34.6167 96.5434 34.6706C96.2676 34.7245 96.0173 34.753 95.7954 34.753H95.7986Z" fill="#102235"/>
      <path d="M40.8088 54.6465C40.4222 54.6465 40.1179 54.5641 39.8675 54.3961C39.6172 54.2281 39.4809 53.9809 39.4238 53.6767C39.3668 53.3724 39.4238 53.0397 39.5886 52.6815L44.8465 41.1676C45.0683 40.7239 45.3155 40.3911 45.6229 40.1724C45.9272 39.9791 46.2885 39.8682 46.6466 39.8682C47.0333 39.8682 47.3946 39.9791 47.6988 40.1724C48.0031 40.3657 48.2534 40.6985 48.4753 41.1676L53.7331 52.6815C53.8979 53.0682 53.9835 53.401 53.9264 53.7052C53.8726 54.0095 53.7331 54.2313 53.4827 54.3961C53.2324 54.5609 52.9566 54.6465 52.5985 54.6465C52.1295 54.6465 51.7682 54.5356 51.5178 54.3422C51.2674 54.1204 51.0487 53.7876 50.8522 53.3186L49.6352 50.4694L50.9093 51.3536H42.3586L43.6326 50.4694L42.4156 53.3186C42.1938 53.7876 41.9719 54.1204 41.7501 54.3422C41.5853 54.5356 41.2525 54.6465 40.8088 54.6465ZM46.6751 43.4114L44.0446 49.6676L43.49 48.8372H49.911L49.3849 49.6676L46.7544 43.4114H46.672H46.6751Z" fill="#102235"/>
      <path d="M60.4837 54.6749C59.403 54.6749 58.4363 54.4531 57.6345 54.0379C56.8327 53.6228 56.1957 53.0142 55.752 52.2124C55.3083 51.4106 55.0864 50.4978 55.0864 49.4171C55.0864 48.6153 55.1974 47.8959 55.4477 47.2588C55.6981 46.6218 56.0562 46.0704 56.5284 45.6267C57.0007 45.183 57.5806 44.8248 58.243 44.603C58.9086 44.3526 59.6533 44.2417 60.4837 44.2417C60.8989 44.2417 61.3679 44.2956 61.8401 44.4065C62.3377 44.5174 62.8099 44.6822 63.2505 44.9041C63.5008 45.0435 63.6942 45.2369 63.8051 45.4587C63.916 45.6806 63.9445 45.9024 63.916 46.1496C63.8875 46.3968 63.8051 46.5933 63.6656 46.7866C63.5262 46.98 63.3329 47.0909 63.111 47.1479C62.8892 47.2018 62.642 47.1764 62.3631 47.037C62.1127 46.8976 61.837 46.7866 61.5612 46.7327C61.2855 46.6503 61.0066 46.6218 60.7848 46.6218C60.3696 46.6218 60.0083 46.6757 59.7041 46.8152C59.3998 46.9546 59.1241 47.1194 58.9276 47.3698C58.7057 47.6201 58.5409 47.8959 58.43 48.254C58.3191 48.6153 58.2652 49.0019 58.2652 49.471C58.2652 50.3838 58.4871 51.0747 58.9308 51.6008C59.3744 52.1269 60.0115 52.3772 60.8133 52.3772C61.0637 52.3772 61.3109 52.3487 61.5898 52.2663C61.8655 52.2124 62.1444 52.1015 62.4201 51.9335C62.6959 51.7941 62.9462 51.7687 63.1395 51.8226C63.3614 51.8765 63.5262 52.0159 63.6656 52.2093C63.8051 52.4026 63.8875 52.5959 63.916 52.8463C63.916 53.0967 63.8875 53.3153 63.7766 53.5372C63.6656 53.759 63.5008 53.9238 63.222 54.0348C62.7783 54.2851 62.3092 54.4499 61.837 54.5323C61.3394 54.6433 60.8957 54.6718 60.4805 54.6718L60.4837 54.6749Z" fill="#102235"/>
      <path d="M70.2547 54.6749C69.174 54.6749 68.2073 54.4531 67.4055 54.0379C66.6037 53.6228 65.9667 53.0142 65.523 52.2124C65.0793 51.4106 64.8574 50.4978 64.8574 49.4171C64.8574 48.6153 64.9683 47.8959 65.2187 47.2588C65.4691 46.6218 65.8272 46.0704 66.2994 45.6267C66.7717 45.183 67.3516 44.8248 68.014 44.603C68.6796 44.3526 69.4243 44.2417 70.2547 44.2417C70.6699 44.2417 71.1389 44.2956 71.6111 44.4065C72.1087 44.5174 72.5809 44.6822 73.0215 44.9041C73.2718 45.0435 73.4652 45.2369 73.5761 45.4587C73.687 45.6806 73.7155 45.9024 73.687 46.1496C73.6585 46.3968 73.5761 46.5933 73.4366 46.7866C73.2972 46.98 73.1039 47.0909 72.882 47.1479C72.6602 47.2018 72.413 47.1764 72.1341 47.037C71.8837 46.8976 71.608 46.7866 71.3322 46.7327C71.0565 46.6503 70.7776 46.6218 70.5558 46.6218C70.1406 46.6218 69.7793 46.6757 69.4751 46.8152C69.1708 46.9546 68.8951 47.1194 68.6986 47.3698C68.4767 47.6201 68.3119 47.8959 68.201 48.254C68.0901 48.6153 68.0362 49.0019 68.0362 49.471C68.0362 50.3838 68.258 51.0747 68.7017 51.6008C69.1454 52.1269 69.7825 52.3772 70.5843 52.3772C70.8347 52.3772 71.0819 52.3487 71.3608 52.2663C71.6365 52.2124 71.9154 52.1015 72.1911 51.9335C72.4668 51.7941 72.7172 51.7687 72.9105 51.8226C73.1324 51.8765 73.2972 52.0159 73.4366 52.2093C73.5761 52.4026 73.6585 52.5959 73.687 52.8463C73.687 53.0967 73.6585 53.3153 73.5476 53.5372C73.4366 53.759 73.2718 53.9238 72.9929 54.0348C72.5492 54.2851 72.0802 54.4499 71.608 54.5323C71.1389 54.6433 70.6952 54.6718 70.2515 54.6718L70.2547 54.6749Z" fill="#102235"/>
      <path d="M80.3836 54.6749C79.1951 54.6749 78.1683 54.4531 77.3126 54.0379C76.4569 53.6227 75.7913 53.0142 75.3476 52.2378C74.8786 51.4613 74.6567 50.5232 74.6567 49.4425C74.6567 48.3618 74.8786 47.506 75.3223 46.7296C75.766 45.9531 76.3745 45.3446 77.1478 44.9041C77.9243 44.4604 78.8085 44.2385 79.7783 44.2385C80.5262 44.2385 81.1886 44.3494 81.7718 44.5998C82.3549 44.8502 82.8525 45.1798 83.2677 45.6235C83.6828 46.0672 84.0156 46.6186 84.2375 47.2272C84.4593 47.8357 84.5702 48.5551 84.5702 49.3569C84.5702 49.6073 84.4878 49.8006 84.3199 49.9369C84.1519 50.0732 83.9047 50.1302 83.6004 50.1302H77.1795V48.5266H82.3264L81.9936 48.8023C81.9936 48.2477 81.9112 47.7786 81.7432 47.392C81.5753 47.0053 81.3566 46.7264 81.0238 46.5331C80.7196 46.3398 80.3329 46.2288 79.8892 46.2288C79.3916 46.2288 78.9479 46.3398 78.5898 46.5901C78.2285 46.812 77.9528 47.1701 77.7595 47.6138C77.5661 48.0575 77.4837 48.5836 77.4837 49.1921V49.3569C77.4837 50.4091 77.7341 51.157 78.2032 51.6546C78.6722 52.1522 79.3916 52.4026 80.3614 52.4026C80.6942 52.4026 81.0523 52.3741 81.4675 52.2917C81.8827 52.2092 82.2693 52.0698 82.656 51.905C82.9888 51.7656 83.2645 51.7117 83.4863 51.7655C83.7082 51.8194 83.9015 51.9304 84.041 52.0983C84.1804 52.2663 84.2628 52.4596 84.2913 52.7068C84.2913 52.9287 84.2628 53.1759 84.1265 53.3977C84.0156 53.6196 83.8223 53.8129 83.5466 53.9523C83.0775 54.2281 82.5229 54.4214 81.9429 54.5323C81.4738 54.6147 80.9192 54.6718 80.3931 54.6718L80.3836 54.6749Z" fill="#102235"/>
      <path d="M90.2374 54.6748C89.6574 54.6748 89.0489 54.6209 88.3834 54.51C87.7464 54.3991 87.1664 54.2343 86.6688 53.9554C86.3931 53.8159 86.1712 53.6511 86.0603 53.4293C85.9494 53.2074 85.8955 52.9856 85.8955 52.7637C85.8955 52.5419 85.9779 52.3485 86.1174 52.1837C86.2568 52.0189 86.4216 51.908 86.6149 51.8224C86.8368 51.7686 87.0586 51.7939 87.3344 51.9048C87.889 52.1267 88.4151 52.2915 88.8841 52.4024C89.3532 52.4848 89.7969 52.5419 90.2406 52.5419C90.8206 52.5419 91.2357 52.4595 91.5146 52.2661C91.7935 52.0728 91.9298 51.8224 91.9298 51.5182C91.9298 51.2678 91.8474 51.0745 91.6541 50.9382C91.4893 50.7988 91.2104 50.7164 90.8776 50.634L88.7193 50.2473C87.889 50.0825 87.252 49.7783 86.7829 49.306C86.3138 48.837 86.092 48.2538 86.092 47.5059C86.092 46.815 86.2853 46.2065 86.672 45.7343C87.0586 45.2367 87.5847 44.8754 88.2503 44.5997C88.9158 44.3239 89.6891 44.213 90.548 44.213C91.1565 44.213 91.7365 44.2669 92.2372 44.3778C92.7348 44.4887 93.2609 44.6821 93.7331 44.9324C93.9835 45.0434 94.1483 45.2082 94.2592 45.4015C94.3701 45.5948 94.3987 45.8167 94.3416 46.0385C94.3131 46.2604 94.2022 46.4537 94.0912 46.6185C93.9518 46.7833 93.787 46.8942 93.5937 46.9798C93.3718 47.0337 93.1246 47.0083 92.8457 46.8974C92.402 46.7326 92.0154 46.5931 91.6287 46.5107C91.2674 46.4283 90.9093 46.3713 90.605 46.3713C89.968 46.3713 89.5243 46.4537 89.2486 46.647C88.9729 46.8403 88.8334 47.0907 88.8334 47.395C88.8334 47.6168 88.9158 47.8101 89.0838 47.9749C89.2518 48.1397 89.499 48.2507 89.8317 48.2792L91.99 48.6405C92.8742 48.8053 93.5398 49.1095 94.0088 49.5532C94.4779 49.9969 94.6998 50.6054 94.6998 51.3534C94.6998 52.4056 94.2846 53.2359 93.4828 53.8159C92.6809 54.3959 91.6002 54.6748 90.2438 54.6748H90.2374Z" fill="#102235"/>
      <path d="M100.337 54.6748C99.757 54.6748 99.1485 54.6209 98.483 54.51C97.846 54.3991 97.266 54.2343 96.7684 53.9554C96.4927 53.8159 96.2708 53.6511 96.1599 53.4293C96.049 53.2074 95.9951 52.9856 95.9951 52.7637C95.9951 52.5419 96.0775 52.3485 96.217 52.1837C96.3564 52.0189 96.5212 51.908 96.7145 51.8224C96.9364 51.7686 97.1582 51.7939 97.434 51.9048C97.9886 52.1267 98.5147 52.2915 98.9837 52.4024C99.4528 52.4848 99.8965 52.5419 100.34 52.5419C100.92 52.5419 101.335 52.4595 101.614 52.2661C101.893 52.0728 102.029 51.8224 102.029 51.5182C102.029 51.2678 101.947 51.0745 101.754 50.9382C101.589 50.7988 101.31 50.7164 100.977 50.634L98.8189 50.2473C97.9886 50.0825 97.3516 49.7783 96.8825 49.306C96.4135 48.837 96.1916 48.2538 96.1916 47.5059C96.1916 46.815 96.3849 46.2065 96.7716 45.7343C97.1582 45.2367 97.6843 44.8754 98.3499 44.5997C99.0154 44.3239 99.7887 44.213 100.648 44.213C101.256 44.213 101.836 44.2669 102.337 44.3778C102.834 44.4887 103.361 44.6821 103.833 44.9324C104.083 45.0434 104.248 45.2082 104.359 45.4015C104.47 45.5948 104.498 45.8167 104.441 46.0385C104.413 46.2604 104.302 46.4537 104.191 46.6185C104.051 46.7833 103.887 46.8942 103.693 46.9798C103.471 47.0337 103.224 47.0083 102.945 46.8974C102.502 46.7326 102.115 46.5931 101.728 46.5107C101.367 46.4283 101.009 46.3713 100.705 46.3713C100.068 46.3713 99.6239 46.4537 99.3482 46.647C99.0725 46.8403 98.933 47.0907 98.933 47.395C98.933 47.6168 99.0154 47.8101 99.1834 47.9749C99.3514 48.1397 99.5986 48.2507 99.9314 48.2792L102.09 48.6405C102.974 48.8053 103.639 49.1095 104.108 49.5532C104.578 49.9969 104.799 50.6054 104.799 51.3534C104.799 52.4056 104.384 53.2359 103.582 53.8159C102.752 54.3959 101.671 54.6748 100.343 54.6748H100.337Z" fill="#102235"/>
      <path d="M108.086 42.6094C107.531 42.6094 107.091 42.47 106.786 42.1943C106.482 41.9185 106.343 41.5287 106.343 41.0311C106.343 40.5336 106.482 40.1723 106.786 39.8965C107.091 39.6208 107.506 39.5099 108.086 39.5099C108.666 39.5099 109.11 39.6493 109.414 39.8965C109.718 40.1723 109.883 40.5336 109.883 41.0311C109.883 41.5287 109.718 41.9154 109.414 42.1943C109.11 42.47 108.666 42.6094 108.086 42.6094ZM108.086 54.6463C107.617 54.6463 107.227 54.5069 106.951 54.2026C106.676 53.8984 106.536 53.4832 106.536 52.9571V45.9277C106.536 45.373 106.676 44.9579 106.951 44.6821C107.227 44.4064 107.588 44.267 108.086 44.267C108.583 44.267 108.97 44.4064 109.249 44.6821C109.528 44.9579 109.636 45.373 109.636 45.9277V52.9571C109.636 53.4832 109.496 53.8984 109.249 54.2026C108.999 54.4784 108.612 54.6463 108.086 54.6463Z" fill="#102235"/>
      <path d="M118.243 54.6749C117.441 54.6749 116.722 54.4816 116.113 54.095C115.505 53.7083 115.09 53.1537 114.868 52.4913L115.09 51.8258V53.0998C115.09 53.5974 114.95 53.984 114.703 54.2629C114.427 54.5387 114.066 54.6496 113.597 54.6496C113.099 54.6496 112.738 54.5101 112.462 54.2629C112.187 53.9872 112.076 53.5974 112.076 53.0998V41.4496C112.076 40.9235 112.215 40.5368 112.491 40.2864C112.767 40.0361 113.128 39.8998 113.625 39.8998C114.123 39.8998 114.51 40.0392 114.789 40.2864C115.067 40.5336 115.175 40.9235 115.175 41.4496V46.2922H114.953C115.147 45.6837 115.562 45.1861 116.17 44.7963C116.779 44.4097 117.498 44.2163 118.275 44.2163C119.159 44.2163 119.935 44.4382 120.601 44.8534C121.267 45.2685 121.764 45.877 122.122 46.6535C122.48 47.43 122.677 48.3681 122.677 49.4488C122.677 50.5295 122.484 51.4676 122.122 52.2441C121.761 53.0459 121.238 53.6291 120.573 54.0442C119.882 54.4879 119.134 54.6813 118.246 54.6813L118.243 54.6749ZM117.33 52.3772C117.774 52.3772 118.161 52.2663 118.493 52.073C118.826 51.8511 119.073 51.5469 119.27 51.1032C119.463 50.6595 119.546 50.108 119.546 49.4425C119.546 48.4473 119.352 47.6994 118.937 47.2271C118.522 46.7549 117.996 46.5077 117.334 46.5077C116.89 46.5077 116.503 46.6186 116.17 46.812C115.838 47.0053 115.59 47.3381 115.394 47.7818C115.201 48.2255 115.118 48.7769 115.118 49.4139C115.118 50.4376 115.312 51.157 115.727 51.6546C116.142 52.1522 116.668 52.374 117.33 52.374V52.3772Z" fill="#102235"/>
      <path d="M126.075 42.6094C125.52 42.6094 125.079 42.47 124.775 42.1943C124.471 41.9185 124.332 41.5287 124.332 41.0311C124.332 40.5336 124.471 40.1723 124.775 39.8965C125.079 39.6208 125.495 39.5099 126.075 39.5099C126.655 39.5099 127.098 39.6493 127.403 39.8965C127.707 40.1723 127.872 40.5336 127.872 41.0311C127.872 41.5287 127.707 41.9154 127.403 42.1943C127.07 42.47 126.626 42.6094 126.075 42.6094ZM126.075 54.6463C125.606 54.6463 125.216 54.5069 124.94 54.2026C124.664 53.8984 124.525 53.4832 124.525 52.9571V45.9277C124.525 45.373 124.664 44.9579 124.94 44.6821C125.216 44.4064 125.577 44.267 126.075 44.267C126.572 44.267 126.959 44.4064 127.238 44.6821C127.517 44.9579 127.624 45.373 127.624 45.9277V52.9571C127.624 53.4832 127.485 53.8984 127.238 54.2026C126.962 54.4784 126.572 54.6463 126.075 54.6463Z" fill="#102235"/>
      <path d="M133.63 54.6749C132.413 54.6749 131.5 54.3421 130.917 53.6797C130.334 53.0174 130.004 52.019 130.004 50.6626V41.4178C130.004 40.8917 130.144 40.5051 130.42 40.2547C130.695 40.0043 131.057 39.868 131.554 39.868C132.052 39.868 132.438 40.0075 132.717 40.2547C132.996 40.5019 133.104 40.8917 133.104 41.4178V50.5231C133.104 51.0778 133.215 51.4929 133.465 51.7687C133.716 52.0444 134.02 52.1553 134.407 52.1553C134.517 52.1553 134.628 52.1553 134.711 52.1268C134.822 52.1268 134.904 52.0983 135.015 52.0983C135.237 52.0983 135.376 52.1521 135.484 52.3201C135.566 52.4849 135.624 52.7892 135.624 53.2614C135.624 53.648 135.541 53.9523 135.373 54.1741C135.205 54.396 134.958 54.5354 134.625 54.5893C134.514 54.5893 134.349 54.6178 134.181 54.6178C133.988 54.6717 133.82 54.6717 133.627 54.6717L133.63 54.6749Z" fill="#102235"/>
      <path d="M138.362 42.6094C137.808 42.6094 137.367 42.47 137.063 42.1943C136.759 41.9185 136.619 41.5287 136.619 41.0311C136.619 40.5336 136.759 40.1723 137.063 39.8965C137.367 39.6208 137.782 39.5099 138.362 39.5099C138.942 39.5099 139.386 39.6493 139.69 39.8965C139.994 40.1723 140.159 40.5336 140.159 41.0311C140.159 41.5287 139.994 41.9154 139.69 42.1943C139.386 42.4732 138.942 42.6094 138.362 42.6094ZM138.362 54.6463C137.893 54.6463 137.503 54.5069 137.228 54.2026C136.952 53.8984 136.812 53.4832 136.812 52.9571V45.9277C136.812 45.373 136.952 44.9579 137.228 44.6821C137.503 44.4064 137.865 44.267 138.362 44.267C138.86 44.267 139.246 44.4064 139.525 44.6821C139.804 44.9579 139.912 45.373 139.912 45.9277V52.9571C139.912 53.4832 139.773 53.8984 139.525 54.2026C139.275 54.4784 138.888 54.6463 138.362 54.6463Z" fill="#102235"/>
      <path d="M147.274 54.6749C146.333 54.6749 145.531 54.5101 144.923 54.2058C144.286 53.9016 143.817 53.4294 143.512 52.8494C143.208 52.2409 143.069 51.4929 143.069 50.5802V46.7042H142.156C141.795 46.7042 141.49 46.5932 141.297 46.3999C141.075 46.2066 140.993 45.9309 140.993 45.541C140.993 45.1512 141.104 44.904 141.297 44.7107C141.519 44.5174 141.795 44.435 142.156 44.435H143.069V42.8567C143.069 42.3306 143.208 41.9439 143.455 41.6935C143.731 41.4432 144.092 41.3069 144.59 41.3069C145.087 41.3069 145.474 41.4463 145.753 41.6935C146.032 41.9407 146.14 42.3306 146.14 42.8567V44.435H148.051C148.437 44.435 148.742 44.5174 148.963 44.7107C149.157 44.904 149.268 45.1797 149.268 45.541C149.268 45.9023 149.157 46.2066 148.963 46.3999C148.77 46.5932 148.466 46.7042 148.051 46.7042H146.14V50.4407C146.14 51.0207 146.279 51.4359 146.526 51.7148C146.773 51.9937 147.217 52.13 147.8 52.13C147.994 52.13 148.187 52.1014 148.38 52.0761C148.574 52.0507 148.713 52.0222 148.849 52.0222C149.043 52.0222 149.211 52.0761 149.318 52.187C149.458 52.3265 149.512 52.6022 149.512 53.0459C149.512 53.3786 149.458 53.6829 149.347 53.9301C149.236 54.1773 149.043 54.3453 148.767 54.4277C148.602 54.4816 148.352 54.5386 148.019 54.5925C147.715 54.6464 147.464 54.6749 147.271 54.6749H147.274Z" fill="#102235"/>
      <path d="M153.337 58.329C152.976 58.329 152.672 58.2466 152.453 58.0533C152.231 57.8599 152.092 57.6096 152.038 57.3053C151.984 57.0011 152.038 56.6683 152.203 56.3355L153.588 53.3184V54.5639L149.962 46.2604C149.822 45.8991 149.797 45.5695 149.851 45.2653C149.905 44.961 150.044 44.7106 150.295 44.5173C150.545 44.324 150.875 44.2416 151.347 44.2416C151.733 44.2416 152.038 44.324 152.26 44.492C152.481 44.6599 152.675 44.9895 152.84 45.4871L155.274 51.6038H154.637L157.128 45.4586C157.321 44.9895 157.543 44.6821 157.765 44.5173C158.015 44.3525 158.319 44.2669 158.734 44.2669C159.096 44.2669 159.371 44.3493 159.593 44.5427C159.815 44.736 159.926 44.9578 159.98 45.2621C160.034 45.5663 159.98 45.8991 159.815 46.2572L155.001 57.1627C154.808 57.6318 154.557 57.9392 154.31 58.104C154.06 58.2434 153.73 58.3258 153.34 58.3258L153.337 58.329Z" fill="#102235"/>
      </svg>`,
    
    dark: `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="79" viewBox="0 0 160 79" fill="none">
      <rect width="4.38496" height="11.9474" transform="matrix(0.862123 0.506698 -0.506702 0.862121 10.5225 26.7928)" fill="white"/>
      <rect width="4.38496" height="11.9474" transform="matrix(0.862161 -0.506634 0.506638 0.862159 24.042 28.7607)" fill="white"/>
      <rect width="4.38552" height="11.9474" transform="matrix(0.901285 -0.433226 0.433229 0.901284 4.46924 41.657)" fill="white"/>
      <rect width="4.38496" height="11.9474" transform="matrix(0.901305 0.433186 -0.433189 0.901303 30.2344 38.7404)" fill="white"/>
      <rect x="14.1289" y="53.5475" width="4.38495" height="11.9474" transform="rotate(-90 14.1289 53.5475)" fill="white"/>
      <rect x="12.0952" y="30.1609" width="4.38495" height="11.9474" transform="rotate(-90 12.0952 30.1609)" fill="white"/>
      <ellipse cx="12.1694" cy="51.1488" rx="4.78704" ry="4.78702" fill="white"/>
      <ellipse cx="26.0707" cy="51.1488" rx="4.78704" ry="4.78702" fill="white"/>
      <ellipse cx="12.1694" cy="27.1801" rx="4.78704" ry="4.78702" fill="white"/>
      <ellipse cx="26.0707" cy="27.1801" rx="4.78704" ry="4.78702" fill="white"/>
      <ellipse cx="5.78704" cy="39.4805" rx="4.78704" ry="4.78702" fill="white"/>
      <ellipse cx="32.7143" cy="39.4805" rx="4.78704" ry="4.78702" fill="white"/>
      <path d="M16.1562 37.0059C16.985 36.5744 17.3414 35.8498 18.3169 35.6078C19.0395 35.4285 19.4955 35.4512 20.2234 35.6078C21.2888 35.837 21.7553 36.5744 22.6383 37.0059C23.5213 37.4374 23.528 38.9124 23.528 38.9124C23.528 38.9124 23.6749 39.9364 23.528 40.5647C23.3813 41.1924 23.4357 41.7422 22.463 42.1398C21.4903 42.5373 20.6325 43.2341 20.2234 43.3609C19.5623 43.5658 19.2323 43.5104 18.6982 43.3609C18.3629 43.267 17.25 42.5373 16.3724 42.1398C15.4949 41.7422 15.4131 41.191 15.2665 40.5647C15.1194 39.9364 15.1436 39.5458 15.2665 38.9124C15.423 38.1058 15.3274 37.4374 16.1562 37.0059Z" fill="white"/>
      <path d="M45.0715 34.7529C44.4916 34.7529 43.9084 34.7243 43.2999 34.6419C42.6914 34.5595 42.1368 34.4486 41.6107 34.2806C41.0846 34.1158 40.6156 33.9193 40.2004 33.6721C39.8961 33.5073 39.6743 33.2855 39.5348 33.0351C39.4239 32.7594 39.37 32.509 39.4239 32.2333C39.4524 31.9576 39.5634 31.7072 39.7282 31.5139C39.893 31.292 40.0895 31.1526 40.3652 31.0987C40.6409 31.0448 40.9198 31.0987 41.2494 31.2635C41.8294 31.5678 42.4379 31.7896 43.1034 31.9291C43.769 32.0685 44.4313 32.1509 45.0684 32.1509C46.0635 32.1509 46.7576 32.0115 47.1981 31.7072C47.6386 31.403 47.8637 31.0163 47.8637 30.5726C47.8637 30.1574 47.6989 29.8532 47.3946 29.6314C47.0904 29.4095 46.5643 29.2162 45.8163 29.0767L43.4901 28.5792C42.1907 28.3034 41.2209 27.8312 40.5839 27.1688C39.9468 26.5065 39.6426 25.6476 39.6426 24.5669C39.6426 23.876 39.782 23.2675 40.0578 22.6844C40.3335 22.1297 40.7233 21.6322 41.2462 21.217C41.7692 20.8018 42.3808 20.4976 43.1003 20.3042C43.8197 20.0824 44.6215 20 45.5089 20C46.2568 20 47.0048 20.0824 47.7496 20.2757C48.4975 20.4405 49.1345 20.7194 49.7145 21.0775C49.9649 21.2423 50.1582 21.4388 50.2691 21.686C50.3801 21.9364 50.4086 22.1836 50.3801 22.4625C50.3515 22.7414 50.2406 22.9601 50.0758 23.1281C49.911 23.3214 49.6892 23.4323 49.4388 23.4893C49.1884 23.5432 48.8588 23.4893 48.4975 23.296C48.0538 23.0742 47.5848 22.9094 47.0872 22.7984C46.5611 22.6875 46.0635 22.6336 45.5089 22.6336C44.9289 22.6336 44.4567 22.716 44.0415 22.8555C43.6264 22.9949 43.3221 23.2168 43.1288 23.4925C42.9355 23.7682 42.8245 24.0725 42.8245 24.4338C42.8245 24.8204 42.964 25.1247 43.2397 25.375C43.5154 25.6254 44.0162 25.8187 44.7356 25.955L47.0333 26.4526C48.3898 26.7283 49.3849 27.2005 50.0505 27.8376C50.716 28.4746 51.0456 29.3049 51.0456 30.3571C51.0456 31.048 50.9062 31.6565 50.6019 32.2111C50.3262 32.7657 49.911 33.2348 49.4134 33.6214C48.9159 34.0081 48.2788 34.3123 47.5594 34.5342C46.8115 34.6451 46.0096 34.756 45.0684 34.756L45.0715 34.7529Z" fill="white"/>
      <path d="M54.3706 34.699C53.9015 34.699 53.5117 34.5595 53.236 34.3123C52.9603 34.0366 52.8208 33.6468 52.8208 33.1492V25.8694C52.8208 25.3719 52.9602 24.9852 53.2075 24.7063C53.4832 24.4306 53.8445 24.3197 54.342 24.3197C54.8111 24.3197 55.2009 24.4591 55.4481 24.7063C55.6985 24.982 55.8348 25.3719 55.8348 25.8694V27.1688L55.6129 26.3924C55.8887 25.7553 56.3038 25.2292 56.887 24.8711C57.4669 24.4845 58.1325 24.2911 58.9058 24.2911C59.6791 24.2911 60.3446 24.4845 60.8422 24.8458C61.3683 25.2071 61.7264 25.787 61.9483 26.535H61.6726C61.9768 25.8441 62.449 25.318 63.0575 24.9028C63.6946 24.4876 64.3855 24.2943 65.1873 24.2943C65.9891 24.2943 66.5976 24.4338 67.0983 24.738C67.5991 25.0422 67.9826 25.5145 68.2329 26.1483C68.4833 26.7853 68.5942 27.5872 68.5942 28.5284V33.1492C68.5942 33.6468 68.4548 34.0334 68.2076 34.3123C67.9319 34.588 67.542 34.699 67.0445 34.699C66.5754 34.699 66.1856 34.5595 65.9099 34.3123C65.6341 34.0366 65.4947 33.6468 65.4947 33.1492V28.6108C65.4947 27.9199 65.3838 27.4224 65.1905 27.1149C64.9971 26.8075 64.6105 26.6459 64.0844 26.6459C63.5044 26.6459 63.0607 26.8392 62.7279 27.2544C62.3952 27.6696 62.2304 28.2495 62.2304 28.9975V33.1207C62.2304 33.6182 62.0909 34.0049 61.8437 34.2838C61.568 34.5595 61.2067 34.6704 60.7091 34.6704C60.2115 34.6704 59.8249 34.531 59.5745 34.2838C59.2988 34.0081 59.1593 33.6182 59.1593 33.1207V28.5823C59.1593 27.8914 59.0484 27.3938 58.8266 27.0864C58.6047 26.7822 58.2466 26.6174 57.7744 26.6174C57.1944 26.6174 56.7222 26.8107 56.3894 27.2259C56.0566 27.641 55.8918 28.221 55.8918 28.969V33.0921C55.9203 34.1982 55.3942 34.6958 54.3706 34.6958V34.699Z" fill="white"/>
      <path d="M74.406 34.7529C73.6296 34.7529 72.9672 34.6135 72.3872 34.3377C71.8072 34.062 71.3636 33.6722 71.0308 33.2032C70.698 32.7056 70.5332 32.151 70.5332 31.5425C70.5332 30.7945 70.7265 30.2146 71.1132 29.7994C71.4998 29.3842 72.1083 29.08 72.9672 28.8866C73.8261 28.6933 74.9607 28.6109 76.371 28.6109H77.4517V30.2146H76.3995C75.6801 30.2146 75.1255 30.2431 74.7103 30.3255C74.2951 30.4079 73.9909 30.5188 73.7975 30.7121C73.6042 30.9054 73.5218 31.1273 73.5218 31.4315C73.5218 31.7928 73.6613 32.0971 73.9085 32.3443C74.1842 32.5947 74.5455 32.7056 75.0431 32.7056C75.4297 32.7056 75.791 32.6232 76.0953 32.4299C76.3995 32.2651 76.6499 32.0147 76.8432 31.6819C77.008 31.3777 77.1189 30.991 77.1189 30.5473V28.2211C77.1189 27.6126 76.9795 27.1974 76.7038 26.9471C76.428 26.6967 75.9558 26.5604 75.2934 26.5604C74.9321 26.5604 74.5455 26.5889 74.105 26.6713C73.6613 26.7537 73.1922 26.8932 72.6946 27.115C72.3904 27.2259 72.1147 27.2545 71.8928 27.1974C71.671 27.1404 71.5062 27.0041 71.3667 26.8108C71.2558 26.6175 71.1734 26.3956 71.1734 26.1452C71.1734 25.8949 71.2273 25.6762 71.3667 25.4543C71.5062 25.2325 71.728 25.0677 72.0576 24.9568C72.6946 24.7064 73.2746 24.5416 73.8578 24.4307C74.4124 24.3197 74.9385 24.2659 75.4075 24.2659C76.4597 24.2659 77.3186 24.4307 78.0095 24.7349C78.7004 25.0392 79.198 25.5114 79.5593 26.1452C79.892 26.7823 80.0569 27.6126 80.0569 28.5792V33.1176C80.0569 33.6152 79.9174 34.0018 79.6702 34.2807C79.423 34.5596 79.0617 34.6673 78.618 34.6673C78.149 34.6673 77.7877 34.5279 77.5373 34.2807C77.2869 34.005 77.1506 33.6152 77.1506 33.1176V32.3696L77.2901 32.5091C77.2077 32.9528 77.0397 33.3394 76.764 33.6722C76.4883 34.005 76.1555 34.2522 75.7688 34.4487C75.3822 34.6452 74.9385 34.7529 74.4124 34.7529H74.406Z" fill="white"/>
      <path d="M84.0084 34.699C83.4823 34.699 83.0957 34.5596 82.82 34.3124C82.5442 34.0367 82.4048 33.6468 82.4048 33.1493V25.8695C82.4048 25.3719 82.5442 24.9853 82.7914 24.7064C83.0386 24.4275 83.4285 24.3197 83.926 24.3197C84.3951 24.3197 84.7849 24.4592 85.0321 24.7064C85.2825 24.9821 85.4188 25.3719 85.4188 25.8695V26.9217H85.2254C85.3649 26.0914 85.723 25.4543 86.3062 25.0106C86.8608 24.5669 87.6055 24.3197 88.5215 24.2627C88.8542 24.2342 89.1014 24.3166 89.2979 24.5131C89.4913 24.7064 89.5737 25.0392 89.6022 25.5082C89.6022 25.9234 89.5198 26.2562 89.3265 26.5034C89.1331 26.7506 88.8004 26.89 88.3313 26.9471L87.8623 26.9756C87.0858 27.0295 86.5058 27.2798 86.1192 27.6411C85.7325 28.0278 85.5645 28.5824 85.5645 29.3018V33.1208C85.5645 33.6183 85.4251 34.005 85.1779 34.2839C84.9307 34.5628 84.5409 34.699 84.0148 34.699H84.0084Z" fill="white"/>
      <path d="M95.7986 34.753C94.8573 34.753 94.0555 34.5882 93.447 34.284C92.81 33.9797 92.3409 33.5075 92.0367 32.9275C91.7324 32.319 91.593 31.5711 91.593 30.6584V26.7824H90.6802C90.3189 26.7824 90.0147 26.6714 89.8213 26.4781C89.5995 26.2848 89.5171 26.0091 89.5171 25.6193C89.5171 25.2294 89.628 24.9822 89.8213 24.7889C90.0432 24.5956 90.3189 24.5132 90.6802 24.5132H91.593V22.9349C91.593 22.4088 91.7324 22.0222 91.9796 21.7718C92.2553 21.5214 92.6166 21.3851 93.1142 21.3851C93.6118 21.3851 93.9984 21.5246 94.2773 21.7718C94.5562 22.019 94.664 22.4088 94.664 22.9349V24.5132H96.5751C96.9617 24.5132 97.266 24.5956 97.4878 24.7889C97.6811 24.9822 97.792 25.258 97.792 25.6193C97.792 25.9805 97.6811 26.2848 97.4878 26.4781C97.2945 26.6714 96.9902 26.7824 96.5751 26.7824H94.664V30.5189C94.664 31.0989 94.8034 31.5141 95.0506 31.7929C95.2978 32.0718 95.7415 32.2081 96.3247 32.2081C96.518 32.2081 96.7113 32.1796 96.9047 32.1542C97.098 32.1289 97.2374 32.1004 97.3737 32.1004C97.567 32.1004 97.735 32.1542 97.8428 32.2652C97.9822 32.4046 98.0361 32.6803 98.0361 33.124C98.0361 33.4568 97.9822 33.7611 97.8713 34.0083C97.7604 34.2586 97.567 34.4234 97.2913 34.5058C97.1265 34.5597 96.8761 34.6168 96.5434 34.6706C96.2676 34.7245 96.0173 34.753 95.7954 34.753H95.7986Z" fill="white"/>
      <path d="M40.8093 54.6463C40.4226 54.6463 40.1184 54.5639 39.868 54.3959C39.6177 54.2279 39.4814 53.9807 39.4243 53.6765C39.3673 53.3722 39.4243 53.0394 39.5891 52.6813L44.8469 41.1674C45.0688 40.7237 45.316 40.391 45.6234 40.1723C45.9277 39.979 46.289 39.868 46.6471 39.868C47.0337 39.868 47.395 39.979 47.6993 40.1723C48.0035 40.3656 48.2539 40.6984 48.4757 41.1674L53.7336 52.6813C53.8984 53.068 53.9839 53.4007 53.9269 53.705C53.873 54.0092 53.7336 54.2311 53.4832 54.3959C53.2328 54.5607 52.9571 54.6463 52.599 54.6463C52.1299 54.6463 51.7686 54.5353 51.5182 54.342C51.2679 54.1202 51.0492 53.7874 50.8527 53.3183L49.6357 50.4692L50.9097 51.3534H42.3591L43.6331 50.4692L42.4161 53.3183C42.1943 53.7874 41.9724 54.1202 41.7506 54.342C41.5858 54.5353 41.253 54.6463 40.8093 54.6463ZM46.6756 43.4113L44.0451 49.6674L43.4905 48.837H49.9114L49.3853 49.6674L46.7548 43.4113H46.6724H46.6756Z" fill="white"/>
      <path d="M60.4837 54.6747C59.403 54.6747 58.4363 54.4529 57.6345 54.0377C56.8327 53.6226 56.1957 53.0141 55.752 52.2122C55.3083 51.4104 55.0864 50.4977 55.0864 49.417C55.0864 48.6151 55.1973 47.8957 55.4477 47.2587C55.6981 46.6217 56.0562 46.0702 56.5284 45.6265C57.0007 45.1828 57.5806 44.8247 58.243 44.6029C58.9086 44.3525 59.6533 44.2416 60.4837 44.2416C60.8989 44.2416 61.3679 44.2955 61.8401 44.4064C62.3377 44.5173 62.8099 44.6821 63.2505 44.904C63.5008 45.0434 63.6941 45.2367 63.8051 45.4586C63.916 45.6804 63.9445 45.9023 63.916 46.1495C63.8875 46.3967 63.8051 46.5932 63.6656 46.7865C63.5262 46.9798 63.3329 47.0907 63.111 47.1478C62.8892 47.2017 62.642 47.1763 62.3631 47.0369C62.1127 46.8974 61.837 46.7865 61.5612 46.7326C61.2855 46.6502 61.0066 46.6217 60.7848 46.6217C60.3696 46.6217 60.0083 46.6756 59.704 46.815C59.3998 46.9545 59.1241 47.1193 58.9276 47.3696C58.7057 47.62 58.5409 47.8957 58.43 48.2538C58.3191 48.6151 58.2652 49.0018 58.2652 49.4708C58.2652 50.3836 58.487 51.0745 58.9307 51.6006C59.3744 52.1267 60.0115 52.377 60.8133 52.377C61.0637 52.377 61.3109 52.3485 61.5898 52.2661C61.8655 52.2122 62.1444 52.1013 62.4201 51.9333C62.6958 51.7939 62.9462 51.7685 63.1395 51.8224C63.3614 51.8763 63.5262 52.0157 63.6656 52.2091C63.8051 52.4024 63.8875 52.5957 63.916 52.8461C63.916 53.0965 63.8875 53.3151 63.7766 53.537C63.6656 53.7588 63.5008 53.9236 63.2219 54.0346C62.7782 54.2849 62.3092 54.4497 61.837 54.5321C61.3394 54.6431 60.8957 54.6716 60.4805 54.6716L60.4837 54.6747Z" fill="white"/>
      <path d="M70.2542 54.6747C69.1735 54.6747 68.2068 54.4529 67.405 54.0377C66.6032 53.6226 65.9662 53.0141 65.5225 52.2122C65.0788 51.4104 64.8569 50.4977 64.8569 49.417C64.8569 48.6151 64.9679 47.8957 65.2182 47.2587C65.4686 46.6217 65.8267 46.0702 66.2989 45.6265C66.7712 45.1828 67.3511 44.8247 68.0135 44.6029C68.6791 44.3525 69.4238 44.2416 70.2542 44.2416C70.6694 44.2416 71.1384 44.2955 71.6106 44.4064C72.1082 44.5173 72.5804 44.6821 73.021 44.904C73.2713 45.0434 73.4647 45.2367 73.5756 45.4586C73.6865 45.6804 73.715 45.9023 73.6865 46.1495C73.658 46.3967 73.5756 46.5932 73.4361 46.7865C73.2967 46.9798 73.1034 47.0907 72.8815 47.1478C72.6597 47.2017 72.4125 47.1763 72.1336 47.0369C71.8832 46.8974 71.6075 46.7865 71.3317 46.7326C71.056 46.6502 70.7771 46.6217 70.5553 46.6217C70.1401 46.6217 69.7788 46.6756 69.4746 46.815C69.1703 46.9545 68.8946 47.1193 68.6981 47.3696C68.4762 47.62 68.3114 47.8957 68.2005 48.2538C68.0896 48.6151 68.0357 49.0018 68.0357 49.4708C68.0357 50.3836 68.2576 51.0745 68.7012 51.6006C69.1449 52.1267 69.782 52.377 70.5838 52.377C70.8342 52.377 71.0814 52.3485 71.3603 52.2661C71.636 52.2122 71.9149 52.1013 72.1906 51.9333C72.4663 51.7939 72.7167 51.7685 72.91 51.8224C73.1319 51.8763 73.2967 52.0157 73.4361 52.2091C73.5756 52.4024 73.658 52.5957 73.6865 52.8461C73.6865 53.0965 73.658 53.3151 73.5471 53.537C73.4361 53.7588 73.2713 53.9236 72.9924 54.0346C72.5487 54.2849 72.0797 54.4497 71.6075 54.5321C71.1384 54.6431 70.6947 54.6716 70.251 54.6716L70.2542 54.6747Z" fill="white"/>
      <path d="M80.3836 54.6747C79.1951 54.6747 78.1683 54.4529 77.3126 54.0377C76.4569 53.6226 75.7913 53.0141 75.3476 52.2376C74.8786 51.4611 74.6567 50.523 74.6567 49.4423C74.6567 48.3616 74.8786 47.5059 75.3223 46.7294C75.766 45.953 76.3745 45.3445 77.1478 44.9039C77.9243 44.4603 78.8085 44.2384 79.7783 44.2384C80.5262 44.2384 81.1886 44.3493 81.7717 44.5997C82.3549 44.8501 82.8525 45.1797 83.2676 45.6234C83.6828 46.0671 84.0156 46.6185 84.2374 47.227C84.4593 47.8355 84.5702 48.5549 84.5702 49.3567C84.5702 49.6071 84.4878 49.8004 84.3198 49.9367C84.1519 50.073 83.9047 50.13 83.6004 50.13H77.1795V48.5264H82.3264L81.9936 48.8021C81.9936 48.2475 81.9112 47.7785 81.7432 47.3918C81.5752 47.0052 81.3566 46.7263 81.0238 46.5329C80.7195 46.3396 80.3329 46.2287 79.8892 46.2287C79.3916 46.2287 78.9479 46.3396 78.5898 46.59C78.2285 46.8118 77.9528 47.17 77.7594 47.6137C77.5661 48.0574 77.4837 48.5834 77.4837 49.1919V49.3567C77.4837 50.4089 77.7341 51.1569 78.2031 51.6544C78.6722 52.152 79.3916 52.4024 80.3614 52.4024C80.6942 52.4024 81.0523 52.3739 81.4675 52.2915C81.8827 52.2091 82.2693 52.0696 82.656 51.9048C82.9887 51.7654 83.2645 51.7115 83.4863 51.7654C83.7082 51.8192 83.9015 51.9302 84.0409 52.0981C84.1804 52.2661 84.2628 52.4594 84.2913 52.7066C84.2913 52.9285 84.2628 53.1757 84.1265 53.3975C84.0156 53.6194 83.8223 53.8127 83.5465 53.9522C83.0775 54.2279 82.5229 54.4212 81.9429 54.5321C81.4738 54.6145 80.9192 54.6716 80.3931 54.6716L80.3836 54.6747Z" fill="white"/>
      <path d="M90.2374 54.6746C89.6574 54.6746 89.0489 54.6207 88.3834 54.5098C87.7464 54.3989 87.1664 54.2341 86.6688 53.9552C86.3931 53.8157 86.1712 53.6509 86.0603 53.4291C85.9494 53.2072 85.8955 52.9854 85.8955 52.7635C85.8955 52.5417 85.9779 52.3484 86.1174 52.1836C86.2568 52.0188 86.4216 51.9078 86.6149 51.8223C86.8368 51.7684 87.0586 51.7937 87.3343 51.9047C87.889 52.1265 88.4151 52.2913 88.8841 52.4022C89.3532 52.4846 89.7969 52.5417 90.2406 52.5417C90.8205 52.5417 91.2357 52.4593 91.5146 52.266C91.7935 52.0726 91.9298 51.8223 91.9298 51.518C91.9298 51.2676 91.8474 51.0743 91.6541 50.938C91.4893 50.7986 91.2104 50.7162 90.8776 50.6338L88.7193 50.2471C87.889 50.0823 87.2519 49.7781 86.7829 49.3059C86.3138 48.8368 86.092 48.2537 86.092 47.5057C86.092 46.8148 86.2853 46.2063 86.672 45.7341C87.0586 45.2366 87.5847 44.8753 88.2503 44.5995C88.9158 44.3238 89.6891 44.2129 90.548 44.2129C91.1565 44.2129 91.7365 44.2668 92.2372 44.3777C92.7348 44.4886 93.2609 44.6819 93.7331 44.9323C93.9835 45.0432 94.1483 45.208 94.2592 45.4014C94.3701 45.5947 94.3986 45.8165 94.3416 46.0384C94.3131 46.2602 94.2022 46.4535 94.0912 46.6184C93.9518 46.7832 93.787 46.8941 93.5936 46.9796C93.3718 47.0335 93.1246 47.0082 92.8457 46.8972C92.402 46.7324 92.0154 46.593 91.6287 46.5106C91.2674 46.4282 90.9093 46.3711 90.605 46.3711C89.968 46.3711 89.5243 46.4536 89.2486 46.6469C88.9729 46.8402 88.8334 47.0906 88.8334 47.3948C88.8334 47.6167 88.9158 47.81 89.0838 47.9748C89.2518 48.1396 89.499 48.2505 89.8317 48.279L91.99 48.6403C92.8742 48.8051 93.5398 49.1094 94.0088 49.5531C94.4779 49.9968 94.6997 50.6053 94.6997 51.3532C94.6997 52.4054 94.2846 53.2357 93.4827 53.8157C92.6809 54.3957 91.6002 54.6746 90.2437 54.6746H90.2374Z" fill="white"/>
      <path d="M100.337 54.6746C99.757 54.6746 99.1485 54.6207 98.483 54.5098C97.846 54.3989 97.266 54.2341 96.7684 53.9552C96.4927 53.8157 96.2708 53.6509 96.1599 53.4291C96.049 53.2072 95.9951 52.9854 95.9951 52.7635C95.9951 52.5417 96.0775 52.3484 96.217 52.1836C96.3564 52.0188 96.5212 51.9078 96.7145 51.8223C96.9364 51.7684 97.1582 51.7937 97.434 51.9047C97.9886 52.1265 98.5147 52.2913 98.9837 52.4022C99.4528 52.4846 99.8965 52.5417 100.34 52.5417C100.92 52.5417 101.335 52.4593 101.614 52.266C101.893 52.0726 102.029 51.8223 102.029 51.518C102.029 51.2676 101.947 51.0743 101.754 50.938C101.589 50.7986 101.31 50.7162 100.977 50.6338L98.8189 50.2471C97.9886 50.0823 97.3516 49.7781 96.8825 49.3059C96.4135 48.8368 96.1916 48.2537 96.1916 47.5057C96.1916 46.8148 96.3849 46.2063 96.7716 45.7341C97.1582 45.2366 97.6843 44.8753 98.3499 44.5995C99.0154 44.3238 99.7887 44.2129 100.648 44.2129C101.256 44.2129 101.836 44.2668 102.337 44.3777C102.834 44.4886 103.36 44.6819 103.833 44.9323C104.083 45.0432 104.248 45.208 104.359 45.4014C104.47 45.5947 104.498 45.8165 104.441 46.0384C104.413 46.2602 104.302 46.4535 104.191 46.6184C104.051 46.7832 103.887 46.8941 103.693 46.9796C103.471 47.0335 103.224 47.0082 102.945 46.8972C102.502 46.7324 102.115 46.593 101.728 46.5106C101.367 46.4282 101.009 46.3711 100.705 46.3711C100.068 46.3711 99.6239 46.4536 99.3482 46.6469C99.0725 46.8402 98.933 47.0906 98.933 47.3948C98.933 47.6167 99.0154 47.81 99.1834 47.9748C99.3514 48.1396 99.5986 48.2505 99.9313 48.279L102.09 48.6403C102.974 48.8051 103.639 49.1094 104.108 49.5531C104.577 49.9968 104.799 50.6053 104.799 51.3532C104.799 52.4054 104.384 53.2357 103.582 53.8157C102.752 54.3957 101.671 54.6746 100.343 54.6746H100.337Z" fill="white"/>
      <path d="M108.086 42.6094C107.531 42.6094 107.091 42.47 106.786 42.1942C106.482 41.9185 106.343 41.5287 106.343 41.0311C106.343 40.5336 106.482 40.1723 106.786 39.8965C107.091 39.6208 107.506 39.5099 108.086 39.5099C108.666 39.5099 109.11 39.6493 109.414 39.8965C109.718 40.1723 109.883 40.5336 109.883 41.0311C109.883 41.5287 109.718 41.9153 109.414 42.1942C109.11 42.47 108.666 42.6094 108.086 42.6094ZM108.086 54.6462C107.617 54.6462 107.227 54.5068 106.951 54.2025C106.676 53.8983 106.536 53.4831 106.536 52.957V45.9276C106.536 45.373 106.676 44.9578 106.951 44.6821C107.227 44.4064 107.588 44.2669 108.086 44.2669C108.583 44.2669 108.97 44.4064 109.249 44.6821C109.528 44.9578 109.636 45.373 109.636 45.9276V52.957C109.636 53.4831 109.496 53.8983 109.249 54.2025C108.999 54.4783 108.612 54.6462 108.086 54.6462Z" fill="white"/>
      <path d="M118.243 54.6748C117.441 54.6748 116.722 54.4815 116.113 54.0949C115.505 53.7082 115.09 53.1536 114.868 52.4912L115.09 51.8257V53.0997C115.09 53.5973 114.95 53.9839 114.703 54.2628C114.427 54.5385 114.066 54.6495 113.597 54.6495C113.099 54.6495 112.738 54.51 112.462 54.2628C112.187 53.9871 112.076 53.5973 112.076 53.0997V41.4495C112.076 40.9234 112.215 40.5368 112.491 40.2864C112.767 40.0361 113.128 39.8998 113.625 39.8998C114.123 39.8998 114.51 40.0392 114.789 40.2864C115.067 40.5336 115.175 40.9234 115.175 41.4495V46.2922H114.953C115.147 45.6837 115.562 45.1861 116.17 44.7963C116.779 44.4096 117.498 44.2163 118.275 44.2163C119.159 44.2163 119.935 44.4381 120.601 44.8533C121.267 45.2685 121.764 45.877 122.122 46.6535C122.48 47.4299 122.677 48.368 122.677 49.4487C122.677 50.5294 122.484 51.4675 122.122 52.244C121.761 53.0458 121.238 53.629 120.572 54.0441C119.882 54.4878 119.134 54.6812 118.246 54.6812L118.243 54.6748ZM117.33 52.3771C117.774 52.3771 118.161 52.2662 118.493 52.0729C118.826 51.851 119.073 51.5468 119.27 51.1031C119.463 50.6594 119.546 50.1079 119.546 49.4424C119.546 48.4472 119.352 47.6993 118.937 47.2271C118.522 46.7549 117.996 46.5077 117.333 46.5077C116.89 46.5077 116.503 46.6186 116.17 46.8119C115.838 47.0052 115.59 47.338 115.394 47.7817C115.201 48.2254 115.118 48.7768 115.118 49.4139C115.118 50.4375 115.312 51.157 115.727 51.6545C116.142 52.1521 116.668 52.3739 117.33 52.3739V52.3771Z" fill="white"/>
      <path d="M126.075 42.6094C125.52 42.6094 125.079 42.47 124.775 42.1942C124.471 41.9185 124.332 41.5287 124.332 41.0311C124.332 40.5336 124.471 40.1723 124.775 39.8965C125.079 39.6208 125.495 39.5099 126.075 39.5099C126.655 39.5099 127.098 39.6493 127.403 39.8965C127.707 40.1723 127.872 40.5336 127.872 41.0311C127.872 41.5287 127.707 41.9153 127.403 42.1942C127.07 42.47 126.626 42.6094 126.075 42.6094ZM126.075 54.6462C125.606 54.6462 125.216 54.5068 124.94 54.2025C124.664 53.8983 124.525 53.4831 124.525 52.957V45.9276C124.525 45.373 124.664 44.9578 124.94 44.6821C125.216 44.4064 125.577 44.2669 126.075 44.2669C126.572 44.2669 126.959 44.4064 127.238 44.6821C127.517 44.9578 127.624 45.373 127.624 45.9276V52.957C127.624 53.4831 127.485 53.8983 127.238 54.2025C126.962 54.4783 126.572 54.6462 126.075 54.6462Z" fill="white"/>
      <path d="M133.63 54.6745C132.413 54.6745 131.5 54.3418 130.917 53.6794C130.334 53.017 130.004 52.0187 130.004 50.6623V41.4176C130.004 40.8915 130.144 40.5048 130.42 40.2544C130.695 40.0041 131.057 39.8678 131.554 39.8678C132.052 39.8678 132.438 40.0072 132.717 40.2544C132.996 40.5016 133.104 40.8915 133.104 41.4176V50.5228C133.104 51.0774 133.215 51.4926 133.465 51.7683C133.716 52.0441 134.02 52.155 134.406 52.155C134.517 52.155 134.628 52.155 134.711 52.1265C134.822 52.1265 134.904 52.0979 135.015 52.0979C135.237 52.0979 135.376 52.1518 135.484 52.3198C135.566 52.4846 135.624 52.7888 135.624 53.261C135.624 53.6477 135.541 53.9519 135.373 54.1738C135.205 54.3956 134.958 54.5351 134.625 54.589C134.514 54.589 134.349 54.6175 134.181 54.6175C133.988 54.6714 133.82 54.6714 133.627 54.6714L133.63 54.6745Z" fill="white"/>
      <path d="M138.362 42.6094C137.808 42.6094 137.367 42.47 137.063 42.1942C136.759 41.9185 136.619 41.5287 136.619 41.0311C136.619 40.5336 136.759 40.1723 137.063 39.8965C137.367 39.6208 137.782 39.5099 138.362 39.5099C138.942 39.5099 139.386 39.6493 139.69 39.8965C139.994 40.1723 140.159 40.5336 140.159 41.0311C140.159 41.5287 139.994 41.9153 139.69 42.1942C139.386 42.4731 138.942 42.6094 138.362 42.6094ZM138.362 54.6462C137.893 54.6462 137.503 54.5068 137.228 54.2025C136.952 53.8983 136.812 53.4831 136.812 52.957V45.9276C136.812 45.373 136.952 44.9578 137.228 44.6821C137.503 44.4064 137.865 44.2669 138.362 44.2669C138.86 44.2669 139.246 44.4064 139.525 44.6821C139.804 44.9578 139.912 45.373 139.912 45.9276V52.957C139.912 53.4831 139.773 53.8983 139.525 54.2025C139.275 54.4783 138.888 54.6462 138.362 54.6462Z" fill="white"/>
      <path d="M147.275 54.6748C146.333 54.6748 145.532 54.51 144.923 54.2057C144.286 53.9015 143.817 53.4293 143.513 52.8493C143.208 52.2408 143.069 51.4929 143.069 50.5801V46.7041H142.156C141.795 46.7041 141.491 46.5932 141.297 46.3999C141.076 46.2065 140.993 45.9308 140.993 45.541C140.993 45.1512 141.104 44.904 141.297 44.7107C141.519 44.5173 141.795 44.4349 142.156 44.4349H143.069V42.8566C143.069 42.3306 143.208 41.9439 143.456 41.6935C143.731 41.4432 144.093 41.3069 144.59 41.3069C145.088 41.3069 145.475 41.4463 145.753 41.6935C146.032 41.9407 146.14 42.3306 146.14 42.8566V44.4349H148.051C148.438 44.4349 148.742 44.5173 148.964 44.7107C149.157 44.904 149.268 45.1797 149.268 45.541C149.268 45.9023 149.157 46.2065 148.964 46.3999C148.771 46.5932 148.466 46.7041 148.051 46.7041H146.14V50.4407C146.14 51.0206 146.28 51.4358 146.527 51.7147C146.774 51.9936 147.218 52.1299 147.801 52.1299C147.994 52.1299 148.187 52.1014 148.381 52.076C148.574 52.0506 148.713 52.0221 148.85 52.0221C149.043 52.0221 149.211 52.076 149.319 52.1869C149.458 52.3264 149.512 52.6021 149.512 53.0458C149.512 53.3786 149.458 53.6828 149.347 53.93C149.236 54.1772 149.043 54.3452 148.767 54.4276C148.603 54.4815 148.352 54.5385 148.019 54.5924C147.715 54.6463 147.465 54.6748 147.271 54.6748H147.275Z" fill="white"/>
      <path d="M153.337 58.3289C152.975 58.3289 152.671 58.2465 152.452 58.0532C152.231 57.8598 152.091 57.6095 152.037 57.3052C151.983 57.001 152.037 56.6682 152.202 56.3354L153.587 53.3183V54.5638L149.961 46.2604C149.822 45.8991 149.797 45.5695 149.85 45.2652C149.904 44.961 150.044 44.7106 150.294 44.5173C150.545 44.324 150.874 44.2416 151.346 44.2416C151.733 44.2416 152.037 44.324 152.259 44.4919C152.481 44.6599 152.674 44.9895 152.839 45.4871L155.273 51.6037H154.636L157.127 45.4586C157.32 44.9895 157.542 44.6821 157.764 44.5173C158.014 44.3525 158.319 44.2669 158.734 44.2669C159.095 44.2669 159.371 44.3493 159.593 44.5427C159.815 44.736 159.926 44.9578 159.979 45.2621C160.033 45.5663 159.979 45.8991 159.815 46.2572L155.001 57.1626C154.807 57.6317 154.557 57.9391 154.31 58.1039C154.059 58.2433 153.73 58.3257 153.34 58.3257L153.337 58.3289Z" fill="white"/>
      </svg>`
  };
  
  // Function to update logo based on theme
  function updateLogo(theme) {

    const logoContainer = document.getElementById('aw-logo');
    if (!logoContainer) return;

    if (theme === 'dark') {
      logoContainer.innerHTML = Logos.dark;
    } else {
      logoContainer.innerHTML = Logos.light;
    }
  }
  
  // Logic (your script, packaged)
  const LS_KEY = 'awidget:prefs', SIDE_KEY = 'awidget:side', COLORS_KEY = 'awidget:colors';
  const THEME_KEY = 'awidget:theme';
  const THEMES_KEY = 'awidget:customthemes';
  const defaultOptions = { position: 'right', theme: 'dark', accentColor: '#60a5fa', fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial', lang: 'auto' };
  let options = { ...defaultOptions };

  const _idle = (fn) => ('requestIdleCallback' in window) ? window.requestIdleCallback(fn, { timeout: 300 }) : setTimeout(fn, 0);
  let _savePending = false;
  const state = {   colors: {},fontLevel: 0, letterLevel: 0, align: 0, cursorIdx: 0, noanim: false, hideimgs: false, highlight: false, dyslexic: false, ruler: false, focusmode: false, contrastPlus: 0, saturation: 0, cursorGuideMode: 0, cursorGuideSize: 1, cursorGuideOpacity: 1, side: 'right', dictating: false, screenReader: false, colors: { text: '#f9fafb', link: '#7aa8ff' }, profiles: { blind: false, colorblind: false, dyslexia: false, lowvision: false, adhd: false, seizure: false } };

  function _persist() { if (_savePending) return; _savePending = true; _idle(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); localStorage.setItem(COLORS_KEY, JSON.stringify(state.colors)); } catch { } _savePending = false; }); }
  function save() { _persist(); }
  function load() { try { Object.assign(state, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); const c = JSON.parse(localStorage.getItem(COLORS_KEY) || 'null'); if (c) state.colors = c } catch (e) { } }

  // setAWIDGETPosition function
  function setAWIDGETPosition(pos) {
    const panel = document.getElementById("aw-panel");
    const fab = document.getElementById("aw-fab");
    if (!panel || !fab) return;

    panel.style.left = panel.style.right = "auto";
    fab.style.left = fab.style.right = "auto";

    if (pos === "left") {
      panel.style.left = "0";
      fab.style.left = "0";
    } else if (pos === "right") {
      panel.style.right = "0";
      fab.style.right = "0";
    }
  }

  // Make it globally available
  window.setAWIDGETPosition = setAWIDGETPosition;

  // Apply on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    // Get position from localStorage or fallback
    const horizontal = localStorage.getItem("awidget:position") || DEFAULT_POSITION;

    // Apply panel & FAB position
    setAWIDGETPosition(horizontal);

    // Listen for select changes
    const select = document.getElementById("aw-side");
    if (select) {
      // Set initial value
      select.value = horizontal;

      select.addEventListener("change", (e) => {
        const newPos = e.target.value;
        localStorage.setItem("awidget:position", newPos);
        setAWIDGETPosition(newPos);
      });
    }
  });

  // Make it globally available 
  window.setAWIDGETPosition = setAWIDGETPosition;

  // Apply on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    const horizontal = localStorage.getItem("awidget:position") || defaultSettings.position || "left";

    // Apply panel & FAB position
    setAWIDGETPosition(horizontal);

    // Listen for select changes
    const select = document.getElementById("aw-side");
    if (select) {
      select.addEventListener("change", (e) => {
        const newPos = e.target.value;
        localStorage.setItem("awidget:position", newPos);
        setAWIDGETPosition(newPos);
      });
    }
  });

  // Theme
  let _themeMedia = null;
  const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'light';
  const resolveAutoTheme = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  const applyThemeAttr = (mode) => { const resolved = (mode === 'auto') ? resolveAutoTheme() : mode; document.documentElement.setAttribute('data-theme', resolved); };
  const _onThemeChange = () => { if (getStoredTheme() === 'auto') applyThemeAttr('auto'); applyGuideStyles(); };


  // Custom themes
  const CustomThemes = new Map();
  function loadCustomThemes() { try { const raw = localStorage.getItem(THEMES_KEY); if (raw) { const obj = JSON.parse(raw) || {}; Object.entries(obj).forEach(([name, def]) => { if (def && typeof def === 'object') CustomThemes.set(name, def); }); } } catch { } }
  function saveCustomThemes() { try { const obj = {}; CustomThemes.forEach((def, name) => obj[name] = def); localStorage.setItem(THEMES_KEY, JSON.stringify(obj)); } catch { } }
  function clearInlineThemeVars() {
    const keys = [
      '--aw-bg',
      '--aw-panel',
      '--aw-text',
      '--aw-muted',
      '--aw-accent',
      '--aw-border',
      '--aw-header'
    ];

    const root = document.documentElement;

    keys.forEach(key => {
      root.style.removeProperty(key);
    });
  }
  
  function applyCustom(name) {
    const def = CustomThemes.get(name); if (!def) return;
    const base = (def.base === 'light' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', base);
    const root = document.documentElement;
    const vars = def.vars || {};
    Object.keys(vars).forEach(k => root.style.setProperty(k, vars[k]));
  }

  function rebuildThemeSelect() {
    const sel = document.getElementById('aw-theme');
    if (!sel) return;

    // Remove old custom group
    Array.from(sel.querySelectorAll('optgroup[label="Custom"]')).forEach(g => g.remove());

    // Add custom themes if any
    if (CustomThemes.size) {
      const group = document.createElement('optgroup');
      group.label = 'Custom Theme';
      group.setAttribute('data-i18n', 'customTheme');

      [...CustomThemes.keys()].sort().forEach(name => {
        const opt = document.createElement('option');
        opt.value = 'custom:' + name;
        opt.textContent = name;
        group.appendChild(opt);
      });

      sel.appendChild(group);
    }

    // Set current value
    const current = getStoredTheme();
    const has = Array.from(sel.options).some(o => o.value === current);
    sel.value = has ? current : sel.value;

    // Apply theme immediately
    applyTheme(sel.value);

    // Listen for changes
    sel.addEventListener('change', (e) => {
      const value = e.target.value;
      applyTheme(value);
      saveTheme(value);
    });
  }

  // Apply the theme and update logo
  function applyTheme(value) {
    let base = 'light';

    if (value.startsWith('custom:')) {
      const themeName = value.replace('custom:', '');
      const data = CustomThemes.get(themeName);
      if (data && data.base) {
        base = data.base;

        // Apply custom CSS vars
        if (data.vars) {
          Object.entries(data.vars).forEach(([key, val]) => {
            document.documentElement.style.setProperty(key, val);
          });
        }
      }
    } else {
      base = value;
    }

    updateLogo(base);
  }

  function isCustomMode(mode) { return mode && mode.startsWith('custom:'); }
  function customNameFromMode(mode) { return mode.replace(/^custom:/, ''); }

  // Public theme API
  window.AWIDGET_THEME = {
    set: setTheme,
    get: getStoredTheme,
    add: (name, { base = 'dark', vars = {} } = {}) => {
      if (!name || typeof name !== 'string') return;
      CustomThemes.set(name, { base: (base === 'light' ? 'light' : 'dark'), vars: vars || {} });
      saveCustomThemes();
      rebuildThemeSelect();

    },
    remove: (name) => {
      CustomThemes.delete(name);
      saveCustomThemes();
      rebuildThemeSelect();
      if (getStoredTheme() === 'custom:' + name) { setTheme('auto'); }
    },
    list: () => [...CustomThemes.keys()]
  };

  function setTheme(mode) {
    const val = (mode === 'dark' || mode === 'light' || isCustomMode(mode)) ? mode : 'auto';

    try { localStorage.setItem(THEME_KEY, val); } catch {}

    if (_themeMedia) {
      try { _themeMedia.removeEventListener('change', _onThemeChange); } catch {}
      _themeMedia = null;
    }

    if (val === 'auto' && window.matchMedia) {
      _themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      try { _themeMedia.addEventListener('change', _onThemeChange); } catch {}
    }

    if (isCustomMode(val)) {
      applyCustom(customNameFromMode(val));
    } else {
      clearInlineThemeVars();
      applyThemeAttr(val);
      updateLogo(val);
    }

    applyGuideStyles();

    const sel = document.getElementById('aw-theme');
    if (sel && Array.from(sel.options).some(o => o.value === val)) sel.value = val;
  }

  function initThemeUI() {
    const sel = document.getElementById('aw-theme'); if (!sel) return;
    loadCustomThemes();
    rebuildThemeSelect();
    // updateSiteLogo();
    const current = getStoredTheme();
    if (isCustomMode(current) && !CustomThemes.has(customNameFromMode(current))) { try { localStorage.setItem(THEME_KEY, 'auto') } catch { } }
    const selected = getStoredTheme(); sel.value = selected; setTheme(selected);
    sel.addEventListener('change', e => { setTheme(e.target.value); save(); });
  }

  // Tile updater
  window.updateAWIDGETTiles = function (settings) {
    if (!settings?.tiles) return;

    Object.keys(settings.tiles).forEach((tileKey) => {
      const tileSettings = settings.tiles[tileKey];
      if (!tileSettings) return;

      // Select the link containing the span with this data-i18n
      const span = document.querySelector(`.aw-tile-title[data-i18n="${tileKey}"]`);
      if (!span) return;

      const tile = span.closest(".aw-tile-link");
      if (!tile) return;

      // Show / hide
      tile.style.display = tileSettings.enabled ? "" : "none";
      if (!tileSettings.enabled) return;

      // Set href
      tile.setAttribute("href", tileSettings.href || "#");

      // Determine current language (use AWIDGET_I18N if available)
      let lang = settings.lang.default; // fallback
      if (window.AWIDGET_I18N?.getLanguage) {
        lang = window.AWIDGET_I18N.getLanguage() || lang;
      }
    });
  };

  // i18n
  const LANG_KEY = 'awidget:lang';
  const LangRegistry = new Map();
  const isRTL = code => (LangRegistry.get(code)?.rtl) === true;
  const getStoredLang = () => localStorage.getItem(LANG_KEY) || 'en';
  const setStoredLang = code => { try { localStorage.setItem(LANG_KEY, code) } catch { } };
  const getActiveLang = () => { const code = getStoredLang(); return LangRegistry.has(code) ? code : 'en'; };
  const setDirByLang = (code, container = document.querySelector('#aw-panel')) => {
    if (!container) return;
    container.setAttribute('dir', isRTL(code) ? 'rtl' : 'ltr');
    container.setAttribute('lang', code);
  };
  function t(key) { const active = getActiveLang(); const packActive = LangRegistry.get(active)?.pack || {}; const packEN = LangRegistry.get('en')?.pack || {}; return (packActive[key] ?? packEN[key] ?? key); }
  function addLanguage(code, { label, rtl = false, pack = {} }) { LangRegistry.set(code, { label: label || code.toUpperCase(), rtl: !!rtl, pack }); if (getStoredLang() === code) { applyI18n(); buildLangGrid(); } }
  
  function buildLangGrid() {
    const grid = document.getElementById('aw-langgrid'); if (!grid) return; grid.innerHTML = ''; const entries = [...LangRegistry.entries()].map(([c, d]) => [c, d.label || c.toUpperCase()]).sort((a, b) => a[1].localeCompare(b[1]));
    entries.forEach(([code, label]) => { const b = document.createElement('button'); b.className = 'aw-langopt'; b.type = 'button'; b.textContent = label; b.setAttribute('role', 'radio'); b.dataset.lang = code; b.setAttribute('aria-checked', 'false'); b.addEventListener('click', () => { setStoredLang(code); applyI18n(); }); grid.appendChild(b); });
    const current = getActiveLang(); grid.querySelectorAll('.aw-langopt').forEach(btn => { const on = btn.dataset.lang === current; btn.setAttribute('aria-checked', on ? 'true' : 'false'); btn.tabIndex = on ? 0 : -1; });
  }
  
  function applyI18n() {
    const code = getActiveLang(); setDirByLang(code); document.querySelectorAll('[data-i18n]').forEach(node => { const key = node.getAttribute('data-i18n'); const val = t(key); if (typeof val === 'string') node.innerText = val; });
    const current = code; document.querySelectorAll('.aw-langopt').forEach(btn => { const on = btn.dataset.lang === current; btn.setAttribute('aria-checked', on ? 'true' : 'false'); btn.tabIndex = on ? 0 : -1; });
  }

  window.AWIDGET_I18N = {
    addLanguage,
    setLanguage: (code) => {
      setStoredLang(code);
      applyI18n();
      buildLangGrid();
    },
    getLanguage: getActiveLang,
    list: () => [...LangRegistry.keys()],
  }

  function initI18n() {
    if (!localStorage.getItem(LANG_KEY)) setStoredLang("en");
    buildLangGrid();
    applyI18n();
  }

  // UI helpers
  function updateSegDots(tile, steps, val) { let wrap = tile.querySelector('.aw-steps'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'aw-steps'; tile.appendChild(wrap) } wrap.innerHTML = ''; for (let i = 0; i <= steps; i++) { const s = document.createElement('span'); s.className = 'aw-step' + (i <= val ? ' on' : ''); wrap.appendChild(s) } }
  function syncCycleTiles() { document.querySelectorAll('.aw-tile[data-cycle]').forEach(tile => { const key = tile.dataset.cycle; const steps = Number(tile.dataset.steps) || 1; const val = Number(state[key] || 0); tile.setAttribute('aria-pressed', String(val > 0)); updateSegDots(tile, steps, val) }) }
  function syncToggleTiles() { document.querySelectorAll('.aw-tile[data-toggle], .aw-tile[data-profile]').forEach(tile => { const key = tile.dataset.toggle ? tile.dataset.toggle : ('profiles.' + tile.dataset.profile); const val = tile.dataset.toggle ? !!state[tile.dataset.toggle] : !!state.profiles[tile.dataset.profile]; tile.setAttribute('aria-pressed', String(val)) }) }
  function setStatus(msg) { const s = document.getElementById('aw-status'); if (s) s.textContent = msg || ''; if (msg) setTimeout(() => setStatus(''), 3000) }

  // Guides
  function ensureLayers() { window._awEls = window._awEls || {}; const els = window._awEls; els.ruler = document.getElementById('aw-ruler'); els.focus = document.getElementById('aw-focus'); els.gLine = document.getElementById('aw-guide-line'); els.gBar = document.getElementById('aw-guide-bar'); els.gSpot = document.getElementById('aw-guide-spot'); return els }
  function sizeVars() { const s = Number(state.cursorGuideSize) || 0; return { thick: [2, 3, 4][s], band: [36, 44, 60][s], spot: [110, 140, 180][s] } }
  function opVar() { return [0.35, 0.5, 0.7][Number(state.cursorGuideOpacity) || 0] }
  function applyGuideStyles() { const root = document.documentElement; const { thick, band, spot } = sizeVars(); const accent = (getComputedStyle(root).getPropertyValue('--aw-accent') || '#60a5fa').trim(); root.style.setProperty('--aw-guide-color', accent); root.style.setProperty('--aw-guide-thickness', thick + 'px'); root.style.setProperty('--aw-guide-band', band + 'px'); root.style.setProperty('--aw-guide-spot', spot + 'px'); root.style.setProperty('--aw-guide-opacity', String(opVar())); }

  function guidesVisible(line, spot, bar) {
    const els = ensureLayers();
    if (els.gLine) els.gLine.style.display = line ? 'block' : 'none';
    if (els.gBar) els.gBar.style.display = bar ? 'block' : 'none';
    if (els.gSpot) els.gSpot.style.display = spot ? 'block' : 'none';
  }

  // rAF-throttled pointer guide move
  let _rafId = null, _lastXY = null;
  function moveGuides(x, y) {
    _lastXY = [x, y];
    if (_rafId) return;
    _rafId = requestAnimationFrame(() => {
      const els = ensureLayers(); if (els.gLine) els.gLine.style.top = Math.max(0, _lastXY[1]) + 'px';
      if (els.gBar) { const b = sizeVars().band; els.gBar.style.top = Math.max(0, _lastXY[1] - b / 2) + 'px' }
      const root = document.documentElement;
      root.style.setProperty('--gx', _lastXY[0] + 'px');
      root.style.setProperty('--gy', _lastXY[1] + 'px');
      _rafId = null;
    });
  }

  // Colors
  function applyUserColors() {
    const c = state.colors || {};
    const root  = document.documentElement;
    const scope = document.getElementById('aw-scope') || document.body;

    const setOrClear = (name, val) => {
      if (val && val !== 'none') root.style.setProperty(name, val);
      else root.style.removeProperty(name);
    };

    // Never touch body style directly; only CSS vars when chosen
    setOrClear('--aw-user-text',         c.text);
    setOrClear('--aw-user-link',         c.link);
    setOrClear('--aw-user-heading',      c.heading);
    setOrClear('--aw-user-selection-bg', c.selectionBg);
    setOrClear('--aw-user-selection-text', c.selectionText);

    // Gate class only if at least one real color is present
    const hasAny =
      ['text','link','heading','selectionBg','selectionText']
        .some(k => c[k] && c[k] !== 'none');

    scope.classList.toggle('aw-has-user-colors', hasAny);
  }

  // Universal swatch renderer: first item = 'none'
  function renderSwatches(id, palette, key) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.innerHTML = '';

    const items = ['none', ...palette];

    const btnFor = (val) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'aw-swatch' + (val === 'none' ? ' none' : '');
      b.setAttribute('data-color', val);
      b.setAttribute('aria-label', val === 'none' ? 'Use site default' : val);
      b.title = val === 'none' ? 'Use site default' : val;
      if (val !== 'none') b.style.background = val;

      b.addEventListener('click', () => {
        state.colors = state.colors || {};
        state.colors[key] = val;         // 'none' clears, hex sets
        applyUserColors();
        save();
        // pressed state
        Array.from(wrap.children).forEach(el => el.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
      });
      return b;
    };

    items.forEach(v => wrap.appendChild(btnFor(v)));

    // Initial visual selection = 'none' (but no CSS applied yet)
    const current = (state.colors?.[key] ?? 'none').toLowerCase();
    Array.from(wrap.children).forEach(c =>
      c.setAttribute('aria-pressed', ((c.dataset.color || '').toLowerCase() === current) ? 'true' : 'false')
    );
  }

  // Start empty; DO NOT set defaults anywhere (including reset)
  state.colors = state.colors || {}; // keys: text, link, heading, selectionBg, selectionText

  function applyUserColors() {
    const c = state.colors || {};
    const root  = document.documentElement;
    const scope = document.getElementById('aw-scope') || document.body;

    const setOrClear = (cssVar, val) => {
      if (val && val !== 'none') root.style.setProperty(cssVar, val);
      else root.style.removeProperty(cssVar);
    };

    // Set/clear vars
    setOrClear('--aw-user-text',           c.text);
    setOrClear('--aw-user-link',           c.link);
    setOrClear('--aw-user-heading',        c.heading);
    setOrClear('--aw-user-selection-bg',   c.selectionBg);
    setOrClear('--aw-user-selection-text', c.selectionText);

    // Per-feature gates
    scope.classList.toggle('aw-has-text',      !!(c.text && c.text !== 'none'));
    scope.classList.toggle('aw-has-link',      !!(c.link && c.link !== 'none'));
    scope.classList.toggle('aw-has-heading',   !!(c.heading && c.heading !== 'none'));

    const hasSel = (c.selectionBg && c.selectionBg !== 'none') ||
                  (c.selectionText && c.selectionText !== 'none');
    scope.classList.toggle('aw-has-selection', !!hasSel);
  }

  // Universal swatch renderer: first item = 'none'
  function renderSwatches(id, palette, key) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.innerHTML = '';

    const items = ['none', ...palette];

    const btnFor = (val) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'aw-swatch' + (val === 'none' ? ' none' : '');
      b.setAttribute('data-color', val);
      b.setAttribute('aria-label', val === 'none' ? 'Use site default' : val);
      b.title = val === 'none' ? 'Use site default' : val;
      if (val !== 'none') b.style.background = val;

      b.addEventListener('click', () => {
        state.colors = state.colors || {};
        state.colors[key] = val;         // 'none' clears, hex sets
        applyUserColors();
        save();
        // pressed state
        Array.from(wrap.children).forEach(el => el.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
      });
      return b;
    };

    items.forEach(v => wrap.appendChild(btnFor(v)));

    // Initial visual selection = 'none' (but no CSS applied yet)
    const current = (state.colors?.[key] ?? 'none').toLowerCase();
    Array.from(wrap.children).forEach(c =>
      c.setAttribute('aria-pressed', ((c.dataset.color || '').toLowerCase() === current) ? 'true' : 'false')
    );
  }

  // Example init (all palettes start with 'none')
  function initSwatches() {
    renderSwatches('swatch-text', [
      '#111827','#f9fafb','#e11d48','#22c55e','#eab308','#06b6d4','#a78bfa','#f97316'
    ], 'text');

    renderSwatches('swatch-link', [
      '#2563eb','#7aa8ff','#22c55e','#e11d48','#a78bfa','#f59e0b'
    ], 'link');

    renderSwatches('swatch-heading', [
      '#111827','#1f2937','#0f172a','#7aa8ff','#22c55e','#e11d48','#a78bfa','#f59e0b'
    ], 'heading');

    renderSwatches('swatch-selection-bg', [
      '#bde0fe','#a7f3d0','#fde68a','#fecaca','#ddd6fe','#fbcfe8','#fef3c7','#d1fae5'
    ], 'selectionBg');

    renderSwatches('swatch-selection-text', [
      '#111827','#000000','#ffffff','#1f2937','#0b1220'
    ], 'selectionText');
  }

  // Screen Reader + Speech
  const SR = {
    enabled: false, utter: null, speak(txt) {
      if (!window.speechSynthesis || !txt) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(txt).replace(/\s+/g, ' ').trim());
      try { const voices = window.speechSynthesis.getVoices(); const code = document.documentElement.getAttribute('lang') || navigator.language || 'en-US'; const v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(code.toLowerCase())); if (v) u.voice = v; } catch { }
      this.utter = u; window.speechSynthesis.speak(u);
    }, stop() { try { window.speechSynthesis?.cancel() } catch { } }, onFocus(e) { if (!SR.enabled) return; const el = e.target; let label = el.getAttribute?.('aria-label') || ''; const lb = el.getAttribute?.('aria-labelledby'); if (lb) { const ids = lb.split(' '); ids.forEach(id => { const ref = document.getElementById(id); if (ref) label = (label ? label + ' ' : '') + (ref.innerText || ref.textContent || ''); }); } const role = el.getAttribute?.('role') || el.tagName; const txt = (label || el.innerText || el.value || el.textContent || '').trim(); SR.speak((txt ? txt + '. ' : '') + role.replace(/[-_]/g, ' ')); }, onClick(e) { if (!SR.enabled) return; const el = e.target.closest('button,a,[role="button"],[role="link"]'); if (el) { const name = el.getAttribute('aria-label') || el.innerText || el.textContent; SR.speak((name || 'Activated') + '.'); } }, start() { if (this.enabled) return; this.enabled = true; document.addEventListener('focusin', SR.onFocus, true); document.addEventListener('click', SR.onClick, true); setStatus('Screen Reader ON'); }, stopAll() { this.enabled = false; document.removeEventListener('focusin', SR.onFocus, true); document.removeEventListener('click', SR.onClick, true); this.stop(); setStatus('Screen Reader OFF'); }
  };

  // Dictation
  let rec = null; let recActive = false;
  function dictateToggle() { if (recActive) { try { rec.stop() } catch { } recActive = false; state.dictating = false; setStatus('Dictation stopped'); syncDictationTile(); return; } const R = window.SpeechRecognition || window.webkitSpeechRecognition; if (!R) { setStatus('Speech recognition not supported'); return; } rec = new R(); rec.lang = navigator.language || 'en-US'; rec.continuous = true; rec.interimResults = true; rec.onresult = e => { let text = ''; for (let i = e.resultIndex; i < e.results.length; i++) { text += e.results[i][0].transcript; } const el = document.activeElement; if (!el) return; if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { const start = el.selectionStart ?? el.value.length; const end = el.selectionEnd ?? el.value.length; el.value = el.value.slice(0, start) + text + el.value.slice(end); const pos = start + text.length; el.setSelectionRange(pos, pos); el.dispatchEvent(new Event('input', { bubbles: true })); } else if (el.isContentEditable) { document.execCommand('insertText', false, text); } }; rec.onstart = () => { recActive = true; state.dictating = true; setStatus('Dictating…'); syncDictationTile(); }; rec.onend = () => { recActive = false; state.dictating = false; setStatus('Dictation ended'); syncDictationTile(); }; try { rec.start() } catch (err) { setStatus('Mic error'); } }
  function syncDictationTile() { const tile = document.querySelector('.aw-tile[data-action="dictate"]'); if (tile) tile.setAttribute('aria-pressed', String(!!state.dictating)); }

  // AW Own-Size Font Booster (v2: robust reset) 
  const BOOST_ATTR = 'data-aw-fb-delta';
  const ORIG_PX_ATTR = 'data-aw-fb-origpx';
  const ORIG_INLINE_ATTR = 'data-aw-fb-originline';
  const SKIP_ROOT_SEL = '#aw-root';

  // Reasonable target set; extend if you need more tags
  const TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LI', 'A', 'LABEL', 'BUTTON', 'TD', 'TH', 'DIV', 'SMALL', 'EM', 'STRONG', 'B', 'I', 'CODE', 'FIGCAPTION', 'CAPTION']);

  const same = (a, b) => Math.abs(a - b) < 0.35;

  // Iterable record of touched elements -> meta
  /** @type {Map<Element, {origInline:string|null, basePx:number}>} */
  const touched = new Map();

  let mo = null;
  let activeDelta = 0;

  function ownsFontSize(el) {
    if (!(el instanceof Element)) return false;
    if (!TAGS.has(el.tagName)) return false;
    if (el.closest(SKIP_ROOT_SEL)) return false;

    const cs = getComputedStyle(el);
    const parent = el.parentElement || document.documentElement;
    const cps = getComputedStyle(parent);
    const myPx = parseFloat(cs.fontSize) || 0;
    const parentPx = parseFloat(cps.fontSize) || 0;
    return !same(myPx, parentPx);
  }

  function markOriginal(el) {
    if (touched.has(el)) return;

    // Preserve the *exact* original inline string (could be "", "1.2rem", etc.)
    const origInline = el.style.fontSize || '';
    const basePx = parseFloat(getComputedStyle(el).fontSize) || 0;

    touched.set(el, { origInline, basePx });

    // mirror in data-* so we can clean up even if Map entry is lost due to node moves
    el.setAttribute(ORIG_INLINE_ATTR, origInline);
    el.setAttribute(ORIG_PX_ATTR, String(basePx));
  }

  function setFontPx(el, px) {
    // Force with !important so inline beats authored rules reliably
    el.style.setProperty('font-size', Math.max(1, Math.round(px)) + 'px', 'important');
  }

  function bumpElement(el, deltaPx) {
    markOriginal(el);
    const meta = touched.get(el);
    const base = meta?.basePx || parseFloat(el.getAttribute(ORIG_PX_ATTR)) || 0;
    const next = base + deltaPx;
    setFontPx(el, next);
    el.setAttribute(BOOST_ATTR, String(deltaPx));
  }

  function eachOwnSized(cb, limit = 50000) {
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let n, count = 0;
    while ((n = tw.nextNode())) {
      if (++count > limit) break;
      if (ownsFontSize(n)) cb(n);
    }
  }

  function applyDelta(deltaPx) {
    // Re-apply to everything we own first (fast path)
    if (touched.size) {
      for (const [el, meta] of touched) {
        if (!el.isConnected) continue;
        setFontPx(el, (meta.basePx || 0) + deltaPx);
        el.setAttribute(BOOST_ATTR, String(deltaPx));
      }
    }
    // Also cover any own-sized elements we haven't seen yet
    eachOwnSized((el) => bumpElement(el, deltaPx));
  }

  function resetOne(el) {
    // Prefer the exact original inline string if we have it
    const origInline =
      (touched.get(el)?.origInline ?? null) ??
      (el.hasAttribute(ORIG_INLINE_ATTR) ? el.getAttribute(ORIG_INLINE_ATTR) : null);

    if (origInline !== null) {
      if (origInline === '') {
        el.style.removeProperty('font-size');
      } else {
        // Put back exactly what the author had (e.g., "1rem", "clamp(...)", etc.)
        el.style.setProperty('font-size', origInline);
      }
    } else {
      // Fallback: remove our override
      el.style.removeProperty('font-size');
    }
    el.removeAttribute(BOOST_ATTR);
    el.removeAttribute(ORIG_PX_ATTR);
    el.removeAttribute(ORIG_INLINE_ATTR);
    touched.delete(el);
  }

  function resetAll() {
    state.colors = {};
    applyUserColors();
    if (mo) { mo.disconnect(); mo = null; }

    for (const el of Array.from(touched.keys())) {
      if (el.isConnected) resetOne(el);
      else touched.delete(el);
    }

    document.querySelectorAll(`[${BOOST_ATTR}], [${ORIG_PX_ATTR}], [${ORIG_INLINE_ATTR}]`).forEach(resetOne);

    activeDelta = 0;
  }

  function startObserver(deltaPx) {
    if (mo) mo.disconnect();
    activeDelta = deltaPx;
    if (!activeDelta) return;

    mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;

          const process = (el) => {
            if (ownsFontSize(el)) bumpElement(el, activeDelta);
          };

          process(node);
          node.querySelectorAll && node.querySelectorAll('*').forEach(process);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  window.__AW_FontBoostOwn = {
    setDelta(deltaPx) {
      if (!Number.isFinite(deltaPx) || deltaPx <= 0) { this.reset(); return; }
      applyDelta(deltaPx);
      startObserver(deltaPx);
    },
    reset() {
      resetAll();
    }
  }

  // Apply
  function apply() {
    // Scoped container
    const scope = document.getElementById('aw-scope') || document.body;

    // Add base filter class
    scope.classList.add('aw-filter-scope');

    // Toggle accessibility classes on body
    document.body.classList.toggle('aw-noanim', !!state.noanim);
    document.body.classList.toggle('aw-hide-imgs', !!state.hideimgs);
    document.body.classList.toggle('aw-highlight', !!state.highlight);
    document.body.classList.toggle('aw-dyslexic', !!state.dyslexic);
    document.body.classList.toggle('aw-focusmode', !!state.focusmode);

    // Build combined filter string
    const contrast =
      state.contrastPlus === 1 ? 'invert(1) hue-rotate(180deg)' :
      state.contrastPlus === 2 ? 'contrast(1.2) brightness(.9)' :
      state.contrastPlus === 3 ? 'contrast(1.1) brightness(1.1)' :
      '';

    const saturation = ['', 'grayscale(1)', 'saturate(.5)', 'saturate(1.6)'][state.saturation] || '';
    const combinedFilter = [contrast, saturation].filter(Boolean).join(' ') || 'none';

    // Apply filter **directly** to the scoped container
    scope.style.filter = combinedFilter;

    // Optionally toggle the filter class
    if (combinedFilter !== 'none') {
      scope.classList.add('aw-filter-scope');
    } else {
      scope.classList.remove('aw-filter-scope');
    }

    const satMap = ['saturate(1)', 'grayscale(1)', 'saturate(.5)', 'saturate(1.6)'];
    document.documentElement.style.setProperty('--aw-sat-filter', satMap[state.saturation] || 'saturate(1)');

    document.body.classList.remove('aw-align-left', 'aw-align-center', 'aw-align-right', 'aw-align-justify');
    const alignIdx = Number(state.align) || 0;
    if (alignIdx > 0) {
      const alignMap = ['', 'aw-align-left', 'aw-align-right', 'aw-align-justify'];
      document.body.classList.add(alignMap[alignIdx]);
    }

    // Letter spacing
    const lsMap = [0, 0.02, 0.05]; // em
    const ls = lsMap[state.letterLevel || 0];

    // If 0: remove everything so the site’s original spacing remains untouched
    if (!ls) {
      scope.classList.remove('aw-letter-wide');
      document.documentElement.style.removeProperty('--aw-letter-spacing');
    } else {
      document.documentElement.style.setProperty('--aw-letter-spacing', ls + 'em');
      const isRTL = (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl';
      scope.classList.toggle('aw-letter-wide', !isRTL);
    }

    const map = ['', 'aw-cursor-big', 'aw-cursor-cross'];
    document.body.classList.remove('aw-cursor-big', 'aw-cursor-cross');
    if (map[state.cursorIdx]) document.body.classList.add(map[state.cursorIdx]);

    const panel = document.getElementById("aw-panel");
    const fab = document.getElementById("aw-fab");
    if (panel && fab) {
      if (state.side === 'left') {
        panel.style.left = '0px'; panel.style.right = 'auto';
        fab.style.left = '16px'; fab.style.right = 'auto';
      } else {
        panel.style.right = '0px'; panel.style.left = 'auto';
        fab.style.right = '16px'; fab.style.left = 'auto';
      }
    }

    // No default change; only when user selects a larger size.
    const LEVEL_TO_DELTA = [0, 2, 4, 6]; // 0 = no change
    const delta = LEVEL_TO_DELTA[state.fontLevel || 0];
    if (delta > 0) {
      window.__AW_FontBoostOwn.setDelta(delta);
    } else {
      window.__AW_FontBoostOwn.reset();
    }

    applyUserColors();
    applyGuideStyles();
    applyNoAnimScope(!!state.noanim);


    const m = Number(state.cursorGuideMode) || 0;
    guidesVisible(m === 1, m === 2, m === 3);
    if (state.screenReader) SR.start(); else SR.stopAll();

    syncToggleTiles(); syncCycleTiles();
  }

  // Profiles
  const profileSnapshots = {};
  function toggleProfile(id) {
    if (!['blind', 'colorblind', 'dyslexia', 'lowvision', 'adhd', 'seizure'].includes(id)) return;
    const active = state.profiles[id];
    if (active) {
      const snap = profileSnapshots[id]; if (snap) { Object.assign(state, JSON.parse(JSON.stringify(snap))); }
      state.profiles[id] = false;
      if (id === 'blind') { state.screenReader = false; SR.stopAll(); }
      setStatus(id + ' profile off');
    } else {
      profileSnapshots[id] = JSON.parse(JSON.stringify(state));
      if (id === 'blind') { state.screenReader = true; SR.start(); }
      if (id === 'colorblind') { state.saturation = Math.max(state.saturation, 1); state.highlight = true; }
      if (id === 'dyslexia') { state.dyslexic = true; state.letterLevel = 2; state.align = 0; state.fontLevel = Math.max(state.fontLevel, 2); }
      if (id === 'lowvision') { state.fontLevel = 3; state.letterLevel = 2; state.contrastPlus = 2; state.cursorIdx = 1; state.highlight = true; }
      if (id === 'adhd') { state.focusmode = true; state.cursorGuideMode = 3; state.cursorGuideSize = 1; state.cursorGuideOpacity = 0; }
      if (id === 'seizure') { state.noanim = true; state.contrastPlus = Math.max(state.contrastPlus, 2); }
      state.profiles[id] = true;
      setStatus(id + ' profile on');
    }
    apply(); save(); initSwatches();
  }

  function openPanel() {
    const p = document.getElementById('aw-panel');
    if (p instanceof HTMLDialogElement) {
      if (!p.open) p.showModal(); // enters top layer
      p.classList.add('aw-open');
    } else {
      p.classList.add('aw-open');
    }
    // document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    const p = document.getElementById('aw-panel');
    p.classList.remove('aw-open');
    if (p instanceof HTMLDialogElement && p.open) p.close();
    document.body.style.overflow = '';
  }

  // Events
  function speakSelection() { if (!window.speechSynthesis) { setStatus('Speech not supported'); return; } const sel = window.getSelection(); const text = sel && sel.toString().trim(); if (!text) return setStatus('Select text first'); SR.speak(text); }
  function initEvents() {
    document.addEventListener('mousemove', e => {
      if (state.ruler) { const r = document.getElementById('aw-ruler'); if (r) r.style.top = Math.max(0, e.clientY - 22) + 'px'; }
      if (state.cursorGuideMode > 0) moveGuides(e.clientX, e.clientY);
    }, { passive: true });

    document.addEventListener('click', e => {
      const tEl = e.target.closest('.aw-tile, [data-action], .aw-close, .aw-langopt'); if (!tEl) return;

      if (tEl.classList.contains('aw-langopt')) { const code = tEl.dataset.lang || 'auto'; try { localStorage.setItem(LANG_KEY, code) } catch { }; applyI18n(); return; }
      if (tEl.classList.contains('aw-close')) { closePanel(); return }

      if (tEl.classList.contains('aw-tile')) {
        e.preventDefault();

        if (tEl.dataset.profile) { toggleProfile(tEl.dataset.profile); return; }

        if (tEl.hasAttribute('data-cycle')) {
          const key = tEl.dataset.cycle; const steps = Number(tEl.dataset.steps) || 1;
          state[key] = (Number(state[key] || 0) + 1) % (steps + 1);
          apply(); save(); return;
        }

        if (tEl.hasAttribute('data-toggle')) {
          const key = tEl.dataset.toggle;
          if (key === 'screenReader') { state.screenReader = !state.screenReader; if (state.screenReader) SR.start(); else SR.stopAll(); apply(); save(); return; }
          state[key] = !state[key];
          if (key === 'ruler') { document.getElementById('aw-ruler')?.classList.toggle('aw-on', state[key]) }
          if (key === 'focusmode') { document.getElementById('aw-focus')?.classList.toggle('aw-on', state[key]) }
          apply(); save(); return;
        }
      }

      const action = tEl.getAttribute('data-action');
      if (action === 'dictate') { dictateToggle(); }
      else if (action === 'read') { speakSelection(); }
      else if (action === 'stop') { SR.stop(); setStatus('Stopped'); }
      else if (action === 'reset') {
        document.documentElement.style.setProperty('--aw-contrast-filter', '');
        document.documentElement.style.setProperty('--aw-sat-filter', 'saturate(1)');
        const sideKeep = state.side;
        Object.assign(state, {
          fontLevel: 0, letterLevel: 0, align: 0, cursorIdx: 0,
          noanim: false, hideimgs: false, highlight: false, dyslexic: false, ruler: false, focusmode: false,
          contrastPlus: 0, saturation: 0,
          cursorGuideMode: 0, cursorGuideSize: 1, cursorGuideOpacity: 1,
          side: sideKeep || 'right', dictating: false,
          screenReader: false,
          colors: { text: '#f9fafb', link: '#7aa8ff' },
          profiles: { blind: false, colorblind: false, dyslexia: false, lowvision: false, adhd: false, seizure: false }
        });
        document.getElementById('aw-ruler')?.classList.remove('aw-on');
        document.getElementById('aw-focus')?.classList.remove('aw-on');
        try { if (recActive) dictateToggle(); } catch { }
        SR.stopAll();
        apply(); save(); initSwatches(); setStatus('All settings reset');
      }
    }, true);

    document.addEventListener('keydown', e => {
      const t = e.target;
      if (t?.classList?.contains('aw-tile') && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); t.click() }
      if (t?.classList?.contains('aw-tile') && t.hasAttribute('data-cycle') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        const key = t.dataset.cycle; const steps = Number(t.dataset.steps) || 1;
        const delta = (e.key === 'ArrowRight') ? 1 : -1;
        const cur = Number(state[key] || 0);
        state[key] = (cur + steps + delta) % (steps + 1);
        apply(); save();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u')) { e.preventDefault(); togglePanel(); }
      if (e.key === 'Escape') { closePanel(); }
    });

    document.getElementById('aw-fab')?.addEventListener('click', () => {
      const p = document.getElementById('aw-panel');
      const opening = !p.classList.contains('aw-open');
      opening ? openPanel() : closePanel();
    });
    document.getElementById('aw-close')?.addEventListener('click', () => closePanel());
    document.getElementById('aw-side')?.addEventListener('change', e => { state.side = e.target.value; try { localStorage.setItem(SIDE_KEY, state.side) } catch { } apply(); save() });

    initThemeUI();
  }

  function togglePanel() { const p = document.getElementById('#aw-panel'); const opening = !p.classList.contains('aw-open'); opening ? openPanel() : closePanel(); }

  // Icons (same SVGs – injected based on data-* attributes)
  const ICONS = {
    blind: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M2 3.27 3.28 2 22 20.72 20.73 22l-3.02-3.02A11.8 11.8 0 0 1 12 19C5 19 2 12 2 12c.8-1.66 2.25-3.86 4.4-5.53L2 3.27Zm8.73 8.73 2.27 2.27A3.5 3.5 0 0 1 8.5 12c0-.37.06-.72.17-1.05l2.06 1.05ZM12 5c7 0 10 7 10 7a17 17 0 0 1-3.32 4.73l-1.42-1.41A9.7 9.7 0 0 0 20 12s-3-7-8-7c-1.03 0-1.98.25-2.85.64L7.7 4.2A8.6 8.6 0 0 1 12 5Z'/></svg>",
    colorblind: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 2a5 5 0 1 1-4.9 6.1A5 5 0 0 0 12 17a5 5 0 1 1 0 5 7 7 0 1 0 0-20Z'/></svg>",
    dyslexia: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M3 18 7 6h4l4 12h-2.6l-.8-2.5H6.4L5.6 18H3Zm6.4-5.5h5.2L12.5 7.9 9.4 12.5Z'/></svg>",
    lowvision: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>",
    adhd: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM11 3h2v3h-2V3Zm0 15h2v3h-2v-3Z'/></svg>",
    seizure: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M10 2 3 13h6v9l8-14h-6l-1-6Z'/></svg>",
    contrastPlus: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 2a10 10 0 1 0 0 20V2Z'/></svg>",
    saturation: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 3s6 6 6 10a6 6 0 1 1-12 0c0-4 6-10 6-10Z'/></svg>",
    noanim: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M6 4h3v16H6V4Zm9 0h3v16h-3V4Z'/></svg>",
    hideimgs: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><g fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 17l5-5 4 4 5-6 4 4'/><path d='M3 3l18 18'/></g></svg>",
    highlight: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M3 4h18v4H3V4Zm0 6h12v4H3v-4Zm0 6h18v4H3v-4Z'/></svg>",
    fontLevel: "<svg class='aw-ico' viewBox='0 0 36 23' aria-hidden='true'><g fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M27 21V2'/><path d='M20 6V2h14v4'/><path d='M23 21h8'/><path d='M7 18V5'/><path d='M2 8V5h11v3'/><path d='M4.5 18H9.5'/></g></svg>",
    dyslexic: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 3l7 18h-2.5l-1.6-4H9l-1.6 4H5L12 3Zm0 5.5L10.1 14h3.8L12 8.5Z'/></svg>",
    letterLevel: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><g fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M3 12h18M6 8l-4 4 4 4M18 8l4 4-4 4M9 12v-2m6 2v-2'/></g></svg>",
    align: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M4 6h16v2H4Zm0 4h12v2H4Zm0 4h16v2H4Zm0 4h10v2H4Z'/></svg>",
    cursorIdx: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M4 3 18 10l-5 2 2 6-3 1-2-6-6 2V3Z'/></svg>",
    ruler: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M3 7h18v10H3V7Zm2 2v6h14V9H5Zm2 1h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z'/></svg>",
    focusmode: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M3 3h6v2H5v4H3V3Zm12 0h6v6h-2V5h-4V3ZM3 15h2v6h4v2H3v-6Zm16 0h2v6h-6v-2h4v-4Z'/></svg>",
    cursorGuideMode: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M4 11h16v2H4zM12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z'/></svg>",
    cursorGuideSize: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M4 18h4V6H4v12Zm6 0h4V8h-4v10Zm6 0h4v-6h-4v6Z'/></svg>",
    cursorGuideOpacity: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 3s6 6 6 10a6 6 0 1 1-12 0c0-4 6-10 6-10Z' opacity='.6'/></svg>",
    read: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M3 6h14a4 4 0 0 1 4 4v8h-2V10a2 2 0 0 0-2-2H3V6Zm0 4h14v2H3v-2Zm0 4h11v2H3v-2Z'/></svg>",
    stop: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><rect x='6' y='6' width='12' height='12' rx='2' fill='currentColor'/></svg>",
    screenReader: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 3a6 6 0 0 1 6 6v6a4 4 0 1 1-8 0V9a4 4 0 1 1 8 0H8a4 4 0 0 1 4-4Z'/></svg>",
    dictate: "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 2a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V5a3 3 0 0 1 3-3Zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.92V21h-2v-3.08A7 7 0 0 1 5 11Z'/></svg>"
  }

  function iconForTile(tile) { const k = tile.dataset.profile || tile.dataset.toggle || tile.dataset.cycle || tile.dataset.action; return ICONS[k] || null; }
  function attachIcons() { document.querySelectorAll('.aw-tile .aw-tile-head').forEach(head => { if (head.querySelector('.aw-ico')) return; const tile = head.closest('.aw-tile'); const svg = tile ? iconForTile(tile) : null; if (!svg) return; const span = head.querySelector('.aw-tile-title'); if (!span) return; span.insertAdjacentHTML('beforebegin', svg); }); }

  // Mount / Unmount 
  function injectStyle() { if (document.getElementById("aw-style")) return; const s = document.createElement('style'); s.id = "aw-style"; s.textContent = CSS; document.head.appendChild(s); }
  function injectHTML() { if (document.getElementById('aw-root')) return; const wrap = document.createElement('div'); wrap.id = "aw-root"; wrap.innerHTML = HTML; document.body.appendChild(wrap); }

  function initCore() {
    load();
    options = { ...defaultOptions, ...(window.AWIDGET_OPTIONS || {}) };
    loadCustomThemes();

    // Seed languages (EN/AR/ES)
    addLanguage('en', {
      label: '🇺🇸 EN',
      rtl: false,
      pack: {
        title: 'Accessibility Menu',
        language: 'Language',
        profiles: 'Profiles',
        colors: 'Colors',
        typography: 'Typography',
        visuals: 'Visual Elements',
        focusAids: 'Focus Tools',
        tools: 'Tools',
        contrastPlus: 'Contrast Modes',
        pauseAnimations: 'Pause Animations',
        hideImages: 'Hide Images',
        highlightStructure: 'Highlight Structure',
        fontSize: 'Font Size',
        dyslexicFont: 'Dyslexia',
        letterSpacing: 'Letter Spacing',
        textAlign: 'Text Alignment',
        cursor: 'Cursor Type',
        rulerTitle: 'Reading Ruler',
        focusTitle: 'Focus Mask',
        cursorGuide: 'Cursor Guide',
        guideSize: 'Guide Size',
        guideOpacity: 'Guide Opacity',
        textColor: 'Text Color',
        linkColor: 'Link Color',
        headingColor: 'Heading Color',
        speak: 'Read Selection Aloud',
        stop: 'Stop Reading',
        resetAll: 'Reset All',
        position: 'Position',
        blind: 'Blind (Screen Reader)',
        colorBlind: 'Color Blind',
        dyslexia: 'Dyslexia',
        lowVision: 'Low Vision',
        adhd: 'ADHD / Focus Issues',
        seizure: 'Photosensitivity / Seizures',
        selectionBackground: 'Selection Background',
        selectionText: 'Selection Text Color',
        saturation: 'Saturation',
        screenReader: 'Screen Reader',
        talktoWrite: 'Speak to Write',
        accessibilityStatement: 'Accessibility Statement',
        theme: 'Theme',
        right: 'Right',
        left: 'Left',
        auto: 'Auto',
        dark: 'Dark',
        light: 'Light',
        customTheme: 'Custom'
      }
    });
    addLanguage('ar', {
      label: '🇸🇦 AR',
      rtl: true,
      pack: {
        title: 'قائمة الوصول',
        language: 'اللغة',
        profiles: 'الملفات الشخصية',
        colors: 'الألوان',
        typography: 'الخطوط',
        visuals: 'العناصر المرئية',
        focusAids: 'مساعدات التركيز',
        tools: 'الأدوات',
        contrastPlus: 'أنماط التباين',
        pauseAnimations: 'إيقاف الحركات',
        hideImages: 'إخفاء الصور',
        highlightStructure: 'إبراز البنية',
        fontSize: 'حجم الخط',
        dyslexicFont: 'خط لعسر القراءة',
        letterSpacing: 'تباعد الأحرف',
        textAlign: 'محاذاة النص',
        cursor: 'نوع المؤشر',
        rulerTitle: 'مسطرة القراءة',
        focusTitle: 'قناع التركيز',
        cursorGuide: 'دليل المؤشر',
        guideSize: 'حجم الدليل',
        guideOpacity: 'شفافية الدليل',
        textColor: 'لون النص',
        linkColor: 'لون الروابط',
        headingColor: 'لون العناوين',
        speak: 'قراءة التحديد',
        stop: 'إيقاف القراءة',
        resetAll: 'إعادة الضبط',
        position: 'الموضع',
        blind: 'كفيف (قارئ الشاشة)',
        colorBlind: 'عمى الألوان',
        dyslexia: 'عُسر القراءة',
        lowVision: 'ضعف البصر',
        adhd: 'فرط الحركة / تشتت الانتباه',
        seizure: 'حساسية الضوء / الصرع',
        selectionBackground: 'خلفية النص المحدد',
        selectionText: 'لون النص المحدد',
        saturation: 'التشبع اللوني',
        screenReader: 'قارئ الشاشة',
        talktoWrite: 'التحدث للكتابة',
        accessibilityStatement: 'بيان إمكانية الوصول',
        theme: 'سمة',
        right: 'يمين',
        left: 'يسار',
        auto: 'تلقائي',
        dark: 'داكن',
        light: 'فاتح',
        customTheme: 'مخصص'
      }
    });
    addLanguage('es', {
      label: '🇪🇸 ES',
      rtl: false,
      pack: {
        title: 'Menú de accesibilidad',
        language: 'Idioma',
        profiles: 'Perfiles',
        colors: 'Colores',
        typography: 'Tipografía',
        visuals: 'Visuales',
        focusAids: 'Ayudas de enfoque',
        tools: 'Herramientas',
        contrastPlus: 'Modos de contraste',
        pauseAnimations: 'Pausar animaciones',
        hideImages: 'Ocultar imágenes',
        highlightStructure: 'Resaltar estructura',
        fontSize: 'Tamaño de fuente',
        dyslexicFont: 'Fuente para dislexia',
        letterSpacing: 'Espaciado entre letras',
        textAlign: 'Alineación del texto',
        cursor: 'Tipo de cursor',
        rulerTitle: 'Regla de lectura',
        focusTitle: 'Máscara de enfoque',
        cursorGuide: 'Guía del cursor',
        guideSize: 'Tamaño de la guía',
        guideOpacity: 'Opacidad de la guía',
        textColor: 'Color del texto',
        linkColor: 'Color de los enlaces',
        headingColor: 'Color del título',
        speak: 'Leer selección',
        stop: 'Detener voz',
        resetAll: 'Restablecer todo',
        position: 'Posición',
        blind: 'Ceguera (lector de pantalla)',
        colorBlind: 'Daltonismo',
        dyslexia: 'Dislexia',
        lowVision: 'Baja visión',
        adhd: 'TDAH (enfoque)',
        seizure: 'Fotosensibilidad / epilepsia',
        selectionBackground: 'Fondo de selección de texto',
        selectionText: 'Color del texto seleccionado',
        saturation: 'Saturación',
        screenReader: 'Lector de pantalla',
        talktoWrite: 'Hablar para escribir',
        accessibilityStatement: 'Declaración de accesibilidad',
        theme: 'Tema',
        right: 'Derecha',
        left: 'Izquierda',
        auto: 'Automático',
        dark: 'Oscuro',
        light: 'Claro',
        customTheme: 'Personalizado'
      }
    });

    initI18n();
    initEvents();
    initSwatches();
    apply();
    document.getElementById('aw-ruler')?.classList.toggle('aw-on', !!state.ruler);
    document.getElementById('aw-focus')?.classList.toggle('aw-on', !!state.focusmode);
    attachIcons();
  }

  function ensureScopeContainer() {
    let scope = document.getElementById('aw-scope');
    if (!scope) {
      scope = document.createElement('div');
      scope.id = 'aw-scope';
      // Move all existing body children into #aw-scope
      while (document.body.firstChild) {
        scope.appendChild(document.body.firstChild);
      }
      document.body.appendChild(scope);
    }
    return scope;
  }

  // In mount(opts) — do this first:
  function mount(opts) {
    if (mounted) return;
    if (!document.body || document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => mount(opts), { once: true });
      return;
    }

    if (opts && typeof opts === 'object') {
      window.AWIDGET_OPTIONS = { ...(window.AWIDGET_OPTIONS || {}), ...opts };
    }

    ensureScopeContainer();
    injectStyle();
    injectHTML();
    initCore();
    mounted = true;
  }

  // Install once after mount() — click shield to block site overlays stealing clicks
  (function clickShield() {
    const install = () => {
      const shield = document.createElement('div');
      shield.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646';
      document.body.appendChild(shield);

      const hit = (el) => el && (el.closest('#aw-panel') || el.closest('#aw-fab'));
      document.addEventListener('pointerdown', (e) => {
        if (hit(e.target)) {
          // Capture and stop overlays behind from handling
          shield.style.pointerEvents = 'auto';
          shield.addEventListener('pointerdown', ev => ev.stopPropagation(), { once: true, capture: true });
          setTimeout(() => shield.style.pointerEvents = 'none', 0);
        }
      }, true);
    };
    if (document.body) install();
    else window.addEventListener('DOMContentLoaded', install, { once: true });
  })();

  function unmount() {
    if (!mounted) return;
    try {
      document.getElementById("aw-style")?.remove();
      document.getElementById("aw-root")?.remove();
      document.body.classList.remove('aw-filter-scope', 'aw-noanim', 'aw-hide-imgs', 'aw-highlight', 'aw-dyslexic', 'aw-focusmode', 'aw-cursor-big', 'aw-cursor-cross');
      document.body.style.overflow = '';
      SR.stopAll();
    } catch { }
    mounted = false;
  }

  // Pause/resume JS animation engines (GSAP, ScrollTrigger, Lottie, Anime.js)
  const _awAnimState = {
    gsapTimeScale: 1,
    animeWasRunning: new WeakSet(),
  };

  function _pauseGSAP(on) {
    const g = window.gsap;
    if (!g) return;

    try {
      if (on) {
        // remember current timescale and freeze the global timeline
        _awAnimState.gsapTimeScale = g.globalTimeline.timeScale();
        g.globalTimeline.timeScale(0);

        // pause ticker (halts RAF updates)
        g.ticker?.sleep?.();

        // pause ScrollTrigger-linked animations (don’t fully disable to avoid layout revert)
        if (g.ScrollTrigger) {
          g.ScrollTrigger.getAll().forEach(st => {
            // main animation
            st.animation?.pause?.();
            // scrub tween (created internally when scrub:true)
            st.scrubTween?.pause?.();
          });
        }
      } else {
        // resume ticker
        g.ticker?.wake?.();

        // resume ScrollTrigger animations
        if (g.ScrollTrigger) {
          g.ScrollTrigger.getAll().forEach(st => {
            st.animation?.play?.();
            st.scrubTween?.play?.();
          });
        }

        g.globalTimeline.timeScale(_awAnimState.gsapTimeScale || 1);
      }
    } catch { }
  }

  function _pauseLottie(on) {
    // web component <lottie-player>
    document.querySelectorAll('lottie-player').forEach(p => {
      try { on ? p.pause() : p.play(); } catch { }
    });

    // bodymovin / lottie-web
    const reg = window.lottie?.getRegisteredAnimations?.();
    if (Array.isArray(reg)) {
      reg.forEach(inst => {
        try { on ? inst.pause() : inst.play(); } catch { }
      });
    }
  }

  function _pauseAnimeJS(on) {
    const anime = window.anime;
    if (!anime) return;
    try {
      const running = anime.running || [];
      running.forEach(instance => {
        if (on) {
          _awAnimState.animeWasRunning.add(instance);
          instance.pause?.();
        } else {
          if (_awAnimState.animeWasRunning.has(instance)) {
            instance.play?.();
          }
        }
      });
      if (!on) _awAnimState.animeWasRunning = new WeakSet();
    } catch { }
  }

  /**
   * Pauses/resumes third-party JS animations.
   * Extend here if you use other engines (e.g., Swiper autoplay, Splide, Velocity).
   */
  function pauseJSAnimations(on) {
    _pauseGSAP(on);
    _pauseLottie(on);
    _pauseAnimeJS(on);

    // Example: Swiper autoplay
    try {
      document.querySelectorAll('.swiper').forEach(el => {
        const inst = el.swiper;
        if (!inst || !inst.params?.autoplay) return;
        on ? inst.autoplay?.stop?.() : inst.autoplay?.start?.();
      });
    } catch { }

    // Example: HTML <marquee> (legacy)
    try {
      document.querySelectorAll('marquee').forEach(m => on ? m.stop?.() : m.start?.());
    } catch { }
  }

  // Your existing page-scope pause (CSS + media)
  function applyNoAnimScope(on) {
    const scope = document.getElementById('aw-scope') || document.body;

    // Toggle CSS "no animation" for the page content only
    scope.classList.toggle('aw-noanim', !!on);

    // Disable smooth scrolling on the root while paused
    document.documentElement.style.scrollBehavior = on ? 'auto' : '';

    // Pause/resume <video>/<audio>
    const media = scope.querySelectorAll('video, audio');
    media.forEach(m => {
      try {
        if (on) {
          if (!m.paused) m.dataset._awWasPlaying = '1';
          m.pause();
          m.autoplay = false;
          m.setAttribute('preload', 'none');
        } else {
          if (m.dataset._awWasPlaying === '1') {
            m.play().catch(() => { });
          }
          delete m.dataset._awWasPlaying;
        }
      } catch { }
    });

    // NEW: Pause/resume JS engines too
    pauseJSAnimations(!!on);
  }

  // Exposed control helpers
  function open() { mount(); openPanel(); }
  function close() { closePanel(); }

  // Public API
  return {
    mount, unmount, open, close,
    // Advanced: passthrough to theme / i18n singletons you already expose
    theme: window.AWIDGET_THEME,
    i18n: window.AWIDGET_I18N
  };
}));
