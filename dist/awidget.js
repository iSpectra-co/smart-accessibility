/*!
 * AWIDGET - Accessibility Widget
 * Version: 2.3.0
 * CDN Usage:
 *   <script src="awidget.js"
 *     data-lang="en"
 *     data-theme="dark"
 *     data-position="right"
 *     data-statement-href="https://example.com/accessibility"
 *     data-auto-init="true">
 *   </script>
 *
 * Or configure via window.AWIDGET_CONFIG before loading this script:
 *   window.AWIDGET_CONFIG = { lang: 'fr', theme: 'light', position: 'left' };
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(global);
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(global);
    });
  } else {
    global.AWIDGET = factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window) {
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
      --aw-accent: #093967;
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
      --aw-header: #062849;
    }

    :root[data-theme="dark"] .aw-close {
      color: #ffffff;
    }

    :root[data-theme="light"] {
      --aw-bg: #eff1f5;
      --aw-panel: #f9fafb;
      --aw-text: #111827;
      --aw-muted: #6b7280;
      --aw-accent: #2a3bd1;
      --aw-border: #e5e7eb;
      --aw-header: #093967;
    }

    .text-white {
      color: white;
    }
    
    .text-decoration-underline {
      text-decoration: underline;
    }
    
    .toggle-group {
      display: flex;
      border-radius: 4444px;
      background: var(--aw-bg);
      width: fit-content;
      gap: 29px;
      margin-top: 12px;
      padding: 4px;
      border: 1px solid var(--aw-header);

    }
    
    .toggle-group .aw-btn {
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 160%;
      padding: 0 12px;
      min-width: 75px;
      background: var(--aw-bg);
      border: 0;
    }

    .toggle-group .aw-btn.active {
      border-radius: 4444px;
      background: var(--aw-header);
      color: white;
    }

    .section-lable.section-lable {
      color: inherit;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
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

    #aw-root svg path:not(:where(.site-logo *)) {
      fill: currentColor;
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

    .aw-highlight-links a {
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
      color: #ffffff;
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
      justify-content: center;
      flex-direction: column;
      gap: 6px;
      padding: 14px 12px;
      min-height: 64px;
      border: 1px solid var(--aw-border);
      border-radius: 6px;
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

    .row-direction {
      flex-direction: row;
      justify-content: flex-start;
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
      width: fit-content;
      border-radius: 4px;
      background: rgba(230, 235, 240, 0.20);
      border: 0;
      color: white;
      font-weight: 700;
      letter-spacing: 0.02em;
      padding: 12px 14px;
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
      transform: translateY(-50%) rotate(90deg);
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
        -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M15 20C14.7167 20 14.4792 19.9042 14.2875 19.7125C14.0958 19.5208 14 19.2833 14 19C14 18.4833 14.3667 18.0208 15.1 17.6125C15.8333 17.2042 16.8 17 18 17C19.2 17 20.1667 17.2042 20.9 17.6125C21.6333 18.0208 22 18.4833 22 19C22 19.2833 21.9042 19.5208 21.7125 19.7125C21.5208 19.9042 21.2833 20 21 20H15ZM18 16C17.45 16 16.9792 15.8042 16.5875 15.4125C16.1958 15.0208 16 14.55 16 14C16 13.45 16.1958 12.9792 16.5875 12.5875C16.9792 12.1958 17.45 12 18 12C18.55 12 19.0208 12.1958 19.4125 12.5875C19.8042 12.9792 20 13.45 20 14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16ZM4 18V6V10.3V10V18ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H9.175C9.44167 4 9.69583 4.05 9.9375 4.15C10.1792 4.25 10.3917 4.39167 10.575 4.575L12 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V10C22 10.2833 21.9042 10.5208 21.7125 10.7125C21.5208 10.9042 21.2833 11 21 11C20.7167 11 20.4792 10.9042 20.2875 10.7125C20.0958 10.5208 20 10.2833 20 10V8H11.175L9.175 6H4V18H11C11.2833 18 11.5208 18.0958 11.7125 18.2875C11.9042 18.4792 12 18.7167 12 19C12 19.2833 11.9042 19.5208 11.7125 19.7125C11.5208 19.9042 11.2833 20 11 20H4Z'/></svg>") no-repeat center / contain;
        mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M15 20C14.7167 20 14.4792 19.9042 14.2875 19.7125C14.0958 19.5208 14 19.2833 14 19C14 18.4833 14.3667 18.0208 15.1 17.6125C15.8333 17.2042 16.8 17 18 17C19.2 17 20.1667 17.2042 20.9 17.6125C21.6333 18.0208 22 18.4833 22 19C22 19.2833 21.9042 19.5208 21.7125 19.7125C21.5208 19.9042 21.2833 20 21 20H15ZM18 16C17.45 16 16.9792 15.8042 16.5875 15.4125C16.1958 15.0208 16 14.55 16 14C16 13.45 16.1958 12.9792 16.5875 12.5875C16.9792 12.1958 17.45 12 18 12C18.55 12 19.0208 12.1958 19.4125 12.5875C19.8042 12.9792 20 13.45 20 14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16ZM4 18V6V10.3V10V18ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H9.175C9.44167 4 9.69583 4.05 9.9375 4.15C10.1792 4.25 10.3917 4.39167 10.575 4.575L12 6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V10C22 10.2833 21.9042 10.5208 21.7125 10.7125C21.5208 10.9042 21.2833 11 21 11C20.7167 11 20.4792 10.9042 20.2875 10.7125C20.0958 10.5208 20 10.2833 20 10V8H11.175L9.175 6H4V18H11C11.2833 18 11.5208 18.0958 11.7125 18.2875C11.9042 18.4792 12 18.7167 12 19C12 19.2833 11.9042 19.5208 11.7125 19.7125C11.5208 19.9042 11.2833 20 11 20H4Z'/></svg>") no-repeat center / contain;

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
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19 21'><path d='M17.75 10.8794L11.6888 16.957C9.9057 18.7449 9.0141 19.6389 7.91993 19.7377C7.73904 19.7541 7.55705 19.7541 7.37616 19.7377C6.28195 19.6389 5.39039 18.7449 3.60726 16.957L1.58687 14.9311C0.471043 13.8122 0.471043 11.9982 1.58687 10.8794M17.75 10.8794L9.6684 2.77587M17.75 10.8794H1.58687M1.58687 10.8794L9.6684 2.77587M9.6684 2.77587L7.64805 0.75' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>") no-repeat center / contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19 21'><path d='M17.75 10.8794L11.6888 16.957C9.9057 18.7449 9.0141 19.6389 7.91993 19.7377C7.73904 19.7541 7.55705 19.7541 7.37616 19.7377C6.28195 19.6389 5.39039 18.7449 3.60726 16.957L1.58687 14.9311C0.471043 13.8122 0.471043 11.9982 1.58687 10.8794M17.75 10.8794L9.6684 2.77587M17.75 10.8794H1.58687M1.58687 10.8794L9.6684 2.77587M9.6684 2.77587L7.64805 0.75' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>") no-repeat center / contain;
    }

    .aw-acc[data-sec="focus"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>")
        no-repeat center/contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>")
        no-repeat center/contain;
    }

    .aw-acc[data-sec="tools"] > summary::before {
      -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'><path fill='black' fill-rule='evenodd' clip-rule='evenodd' d='M11.9167 0.916687V3.66669H10.0833V0.916687H11.9167ZM11.9167 18.3334V21.0834H10.0833V18.3334H11.9167ZM11.9167 12.375V9.62502H10.0833V12.375H11.9167ZM10.0833 8.25002V7.33335H5.49999V9.85419H4.58332L0.916656 6.18752L4.58332 2.52085H5.49999V5.04169H11.9167V8.25002H10.0833ZM11.9167 14.6667V13.75H10.0833V16.9584H16.5V19.4792H17.4167L21.0833 15.8125L17.4167 12.1459H16.5V14.6667H11.9167Z'/></svg>") no-repeat center / contain;
      mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'><path fill='black' fill-rule='evenodd' clip-rule='evenodd' d='M11.9167 0.916687V3.66669H10.0833V0.916687H11.9167ZM11.9167 18.3334V21.0834H10.0833V18.3334H11.9167ZM11.9167 12.375V9.62502H10.0833V12.375H11.9167ZM10.0833 8.25002V7.33335H5.49999V9.85419H4.58332L0.916656 6.18752L4.58332 2.52085H5.49999V5.04169H11.9167V8.25002H10.0833ZM11.9167 14.6667V13.75H10.0833V16.9584H16.5V19.4792H17.4167L21.0833 15.8125L17.4167 12.1459H16.5V14.6667H11.9167Z'/></svg>") no-repeat center / contain;
    }

    .aw-acc[data-sec="manage"] > summary::before {
        -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M22.75 19C22.75 18.78 22.72 18.58 22.69 18.37L23.53 17.64C23.71 17.48 23.75 17.22 23.63 17.01L23.04 15.99C22.9832 15.8899 22.8929 15.8129 22.785 15.7727C22.6771 15.7325 22.5585 15.7315 22.45 15.77L21.39 16.13C21.07 15.86 20.71 15.65 20.31 15.5L20.09 14.41C20.0669 14.2971 20.0056 14.1956 19.9163 14.1227C19.827 14.0498 19.7153 14.01 19.6 14.01H18.42C18.18 14.01 17.98 14.18 17.93 14.41L17.71 15.5C17.31 15.65 16.95 15.86 16.63 16.13L15.57 15.77C15.4614 15.7327 15.3432 15.7342 15.2356 15.7744C15.128 15.8145 15.0377 15.8907 14.98 15.99L14.39 17.01C14.27 17.22 14.31 17.48 14.49 17.64L15.33 18.37C15.3 18.58 15.27 18.78 15.27 19C15.27 19.22 15.3 19.42 15.33 19.63L14.49 20.36C14.31 20.52 14.27 20.78 14.39 20.99L14.98 22.01C15.1 22.22 15.35 22.31 15.57 22.23L16.63 21.87C16.95 22.14 17.31 22.35 17.71 22.5L17.93 23.59C17.98 23.82 18.18 23.99 18.42 23.99H19.6C19.84 23.99 20.04 23.82 20.09 23.59L20.31 22.5C20.71 22.35 21.07 22.14 21.39 21.87L22.45 22.23C22.68 22.31 22.92 22.21 23.04 22.01L23.63 20.99C23.75 20.78 23.71 20.52 23.53 20.36L22.69 19.63C22.72 19.42 22.75 19.22 22.75 19ZM19 21C17.9 21 17 20.1 17 19C17 17.9 17.9 17 19 17C20.1 17 21 17.9 21 19C21 20.1 20.1 21 19 21ZM12 7C11.45 7 11 7.45 11 8V12C11 12.27 11.11 12.52 11.29 12.71L13.36 14.78L14.4 12.99L13 11.59V8C13 7.45 12.55 7 12 7ZM4.26 13C3.61 13 3.12 13.61 3.28 14.24C4.28 18.13 7.8 21 12 21H12.07L10.86 18.91C9.51882 18.6866 8.27157 18.0779 7.27017 17.1582C6.26878 16.2385 5.55646 15.0474 5.22 13.73C5.16491 13.5184 5.04033 13.3314 4.86625 13.199C4.69216 13.0666 4.47867 12.9965 4.26 13ZM4 10C3.45 10 3 9.55 3 9V5C3 4.45 3.45 4 4 4C4.55 4 5 4.45 5 5V6.36C6.65 4.32 9.17 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12H19C19 8.14 15.86 5 12 5C10.8725 5.00157 9.76202 5.27509 8.76276 5.79735C7.76351 6.31961 6.90497 7.07519 6.26 8H8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10H4Z'/></svg>") no-repeat center / contain;
        mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M22.75 19C22.75 18.78 22.72 18.58 22.69 18.37L23.53 17.64C23.71 17.48 23.75 17.22 23.63 17.01L23.04 15.99C22.9832 15.8899 22.8929 15.8129 22.785 15.7727C22.6771 15.7325 22.5585 15.7315 22.45 15.77L21.39 16.13C21.07 15.86 20.71 15.65 20.31 15.5L20.09 14.41C20.0669 14.2971 20.0056 14.1956 19.9163 14.1227C19.827 14.0498 19.7153 14.01 19.6 14.01H18.42C18.18 14.01 17.98 14.18 17.93 14.41L17.71 15.5C17.31 15.65 16.95 15.86 16.63 16.13L15.57 15.77C15.4614 15.7327 15.3432 15.7342 15.2356 15.7744C15.128 15.8145 15.0377 15.8907 14.98 15.99L14.39 17.01C14.27 17.22 14.31 17.48 14.49 17.64L15.33 18.37C15.3 18.58 15.27 18.78 15.27 19C15.27 19.22 15.3 19.42 15.33 19.63L14.49 20.36C14.31 20.52 14.27 20.78 14.39 20.99L14.98 22.01C15.1 22.22 15.35 22.31 15.57 22.23L16.63 21.87C16.95 22.14 17.31 22.35 17.71 22.5L17.93 23.59C17.98 23.82 18.18 23.99 18.42 23.99H19.6C19.84 23.99 20.04 23.82 20.09 23.59L20.31 22.5C20.71 22.35 21.07 22.14 21.39 21.87L22.45 22.23C22.68 22.31 22.92 22.21 23.04 22.01L23.63 20.99C23.75 20.78 23.71 20.52 23.53 20.36L22.69 19.63C22.72 19.42 22.75 19.22 22.75 19ZM19 21C17.9 21 17 20.1 17 19C17 17.9 17.9 17 19 17C20.1 17 21 17.9 21 19C21 20.1 20.1 21 19 21ZM12 7C11.45 7 11 7.45 11 8V12C11 12.27 11.11 12.52 11.29 12.71L13.36 14.78L14.4 12.99L13 11.59V8C13 7.45 12.55 7 12 7ZM4.26 13C3.61 13 3.12 13.61 3.28 14.24C4.28 18.13 7.8 21 12 21H12.07L10.86 18.91C9.51882 18.6866 8.27157 18.0779 7.27017 17.1582C6.26878 16.2385 5.55646 15.0474 5.22 13.73C5.16491 13.5184 5.04033 13.3314 4.86625 13.199C4.69216 13.0666 4.47867 12.9965 4.26 13ZM4 10C3.45 10 3 9.55 3 9V5C3 4.45 3.45 4 4 4C4.55 4 5 4.45 5 5V6.36C6.65 4.32 9.17 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12H19C19 8.14 15.86 5 12 5C10.8725 5.00157 9.76202 5.27509 8.76276 5.79735C7.76351 6.31961 6.90497 7.07519 6.26 8H8C8.55 8 9 8.45 9 9C9 9.55 8.55 10 8 10H4Z'/></svg>") no-repeat center / contain;

    }

    /* Make the panel a 3-row container: header / scrollable body / sticky footer */
    .aw-panel {
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 0;
      overflow: hidden;
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
      gap: 15px;
      align-items: center;
      justify-content: space-between;
      background: var(--aw-header);
      color: var(--aw-bg);
      padding: 15px;
      z-index: 10;
    }

    /* Header title */
    .aw-header h2 {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: #fff;
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
      background: var(--aw-header);
      color: var(--aw-text);
      border-top: 1px solid var(--aw-border);
      padding: 16px;
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
        <button class="aw-btn aw-reset-wide" data-action="reset" data-i18n="resetAll">
          Reset all
        </button>
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
            <div class="aw-grid" style="display: grid; grid-template-columns: repeat(2, 1fr);">
              <div class="aw-tile" tabindex="0" role="button" data-profile="blind" aria-pressed="false">
                <div class="aw-tile-head row-direction">
                  <span class="aw-tile-title" data-i18n="blind">Blind</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="colorblind" aria-pressed="false">
                <div class="aw-tile-head row-direction">
                  <span class="aw-tile-title" data-i18n="colorBlind">Color Blind</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="dyslexia" aria-pressed="false">
                <div class="aw-tile-head row-direction">
                  <span class="aw-tile-title" data-i18n="dyslexia">Dyslexia</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="lowvision" aria-pressed="false">
                <div class="aw-tile-head row-direction">
                  <span class="aw-tile-title" data-i18n="lowVision">Low Vision</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="adhd" aria-pressed="false">
                <div class="aw-tile-head row-direction">
                  <span class="aw-tile-title" data-i18n="adhd">ADHD</span>
                </div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-profile="seizure" aria-pressed="false">
                <div class="aw-tile-head row-direction">
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
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorIdx" data-steps="2" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="cursor">Pointer Type</span>
                </div>
                <div class="aw-steps"></div>
              </div>
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
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideMode" data-steps="3" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="cursorGuide">Cursor Reading Guide</span>
                </div>
                <div class="aw-steps"></div>
              </div>
              <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideSize" data-steps="2" aria-pressed="false">
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
              <div class="aw-tile" tabindex="0" role="button" data-toggle="highlightLinks" aria-pressed="false">
                <div class="aw-tile-head">
                  <span class="aw-tile-title" data-i18n="highlightLinks">Highlight Links</span>
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

        <details class="aw-acc" data-sec="manage">
            <summary data-i18n="manage">Manage</summary>
            <div class="acc-body">
              <div class="aw-grid" style="display: flex; flex-direction: row; gap: 12px; justify-content: space-between;">
                <div>
                  <span class="aw-section section-lable" data-i18n="theme">Theme</span>
                  <div class="toggle-group" data-type="theme">
                    <button class="aw-btn toggle-btn active" data-value="dark" data-i18n="dark">Dark</button>
                    <button class="aw-btn toggle-btn" data-value="light" data-i18n="light">Light</button>
                  </div>
                </div>
                
                <div>
                  <span class="aw-section section-lable" data-i18n="position">Position</span>
                  <div class="toggle-group" data-type="position">
                    <button class="aw-btn toggle-btn active" data-value="right" data-i18n="right">Right</button>
                    <button class="aw-btn toggle-btn" data-value="left" data-i18n="left">Left</button>
                  </div>
                </div>
                
              </div>
            </div>
          </details>
        <div class="aw-footer">

        </div>
      </div>
      <div class="aw-maintainer">
        <a href="https://ispectra.co" title="Home" rel="home" class="site-logo d-block" id="aw-logo"></a>
        <a class="aw-tile-link" target="_blank">
          <div class="aw-tile-head">
            <span class="aw-tile-title text-white text-decoration-underline" data-i18n="accessibilityStatement">Accessibility Statement</span>
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
    light: `<svg xmlns="http://www.w3.org/2000/svg" width="148" height="40" viewBox="0 0 148 40" fill="none">
      <path d="M8.60332 10.1995L12.0208 12.1925L6.54887 21.4273L3.13538 19.4342L8.60332 10.1995Z" fill="#10D4B6"/>
      <path d="M20.8226 11.9623L24.2361 9.96924L29.708 19.2079L26.2906 21.201L20.8226 11.9623Z" fill="#AED6FA"/>
      <path d="M3.13538 23.5276L6.70782 21.8243L11.385 31.4799L7.81253 33.1832L3.13538 23.5276Z" fill="#10D4B6"/>
      <path d="M26.4178 20.9111L29.9862 22.6144L25.3091 32.2699L21.7406 30.5667L26.4178 20.9111Z" fill="#D9F6FC"/>
      <path d="M22.6586 30.2571H11.8618V34.1876H22.6586V30.2571Z" fill="#D8F5FB"/>
      <path d="M20.8227 9.28625H10.0259V13.2168H20.8227V9.28625Z" fill="#B6DBFE"/>
      <path d="M10.0933 36.3314C12.4833 36.3314 14.4208 34.4099 14.4208 32.0396C14.4208 29.6693 12.4833 27.7478 10.0933 27.7478C7.70334 27.7478 5.76587 29.6693 5.76587 32.0396C5.76587 34.4099 7.70334 36.3314 10.0933 36.3314Z" fill="#13D6B8"/>
      <path d="M22.6546 36.3314C25.0446 36.3314 26.9821 34.4099 26.9821 32.0396C26.9821 29.6693 25.0446 27.7478 22.6546 27.7478C20.2646 27.7478 18.3272 29.6693 18.3272 32.0396C18.3272 34.4099 20.2646 36.3314 22.6546 36.3314Z" fill="#C5F5F8"/>
      <path d="M10.0933 14.8367C12.4833 14.8367 14.4208 12.9152 14.4208 10.5449C14.4208 8.17456 12.4833 6.25305 10.0933 6.25305C7.70334 6.25305 5.76587 8.17456 5.76587 10.5449C5.76587 12.9152 7.70334 14.8367 10.0933 14.8367Z" fill="#10D4B6"/>
      <path d="M22.6546 14.8367C25.0446 14.8367 26.9821 12.9152 26.9821 10.5449C26.9821 8.17456 25.0446 6.25305 22.6546 6.25305C20.2646 6.25305 18.3272 8.17456 18.3272 10.5449C18.3272 12.9152 20.2646 14.8367 22.6546 14.8367Z" fill="#77BFFD"/>
      <path d="M4.32746 25.866C6.71745 25.866 8.65492 23.9445 8.65492 21.5742C8.65492 19.2039 6.71745 17.2823 4.32746 17.2823C1.93747 17.2823 0 19.2039 0 21.5742C0 23.9445 1.93747 25.866 4.32746 25.866Z" fill="#10D4B6"/>
      <path d="M28.6551 25.866C31.0451 25.866 32.9826 23.9445 32.9826 21.5742C32.9826 19.2039 31.0451 17.2823 28.6551 17.2823C26.2651 17.2823 24.3277 19.2039 24.3277 21.5742C24.3277 23.9445 26.2651 25.866 28.6551 25.866Z" fill="#1687F6"/>
      <path d="M13.6937 19.3548C14.4408 18.9697 14.7666 18.3186 15.6448 18.1002C16.2966 17.9414 16.7098 17.9612 17.3695 18.1002C18.3311 18.3066 18.7524 18.9657 19.5511 19.3548C20.3498 19.7399 20.3538 21.0659 20.3538 21.0659C20.3538 21.0659 20.4849 21.9831 20.3538 22.5468C20.2227 23.1106 20.2703 23.6029 19.3921 23.9602C18.5139 24.3176 17.739 24.9409 17.3695 25.056C16.7734 25.2387 16.4754 25.191 15.9906 25.056C15.6886 24.9726 14.6832 24.3176 13.8884 23.9602C13.0937 23.6029 13.0221 23.1106 12.891 22.5468C12.7599 21.9831 12.7797 21.6337 12.891 21.0659C13.0341 20.3434 12.9466 19.7439 13.6937 19.3548Z" fill="#11D4B6"/>
      <path d="M39.2774 19.3548C38.5958 19.3548 37.9365 19.2915 37.3033 19.1686C36.6813 19.0569 36.104 18.8894 35.5714 18.6659C35.0499 18.4425 34.5843 18.1744 34.1746 17.8653L34.9009 15.9848C35.3106 16.2715 35.739 16.5173 36.1859 16.7296C36.6441 16.9269 37.1283 17.0833 37.6385 17.195C38.16 17.2956 38.7075 17.344 39.2774 17.344C40.257 17.344 40.9721 17.1839 41.419 16.8599C41.866 16.5248 42.0895 16.0965 42.0895 15.5752C42.0895 15.2885 42.0224 15.0464 41.8846 14.849C41.7468 14.6368 41.5233 14.458 41.2142 14.3091C40.905 14.1601 40.4953 14.0373 39.9851 13.9367L37.9365 13.5085C36.7558 13.259 35.8768 12.8456 35.292 12.261C34.7221 11.6652 34.4353 10.8832 34.4353 9.91502C34.4353 9.09578 34.6514 8.38081 35.0872 7.77383C35.5229 7.16686 36.1226 6.69393 36.8936 6.35879C37.6646 6.02365 38.5511 5.85608 39.5567 5.85608C40.1527 5.85608 40.7225 5.91938 41.2701 6.04227C41.8288 6.15398 42.339 6.329 42.7972 6.5636C43.2702 6.78703 43.6799 7.05887 44.0263 7.38284L43.3 9.17026C42.7785 8.73457 42.2087 8.41433 41.5866 8.20207C40.9646 7.97864 40.283 7.86693 39.5381 7.86693C38.9682 7.86693 38.4766 7.94885 38.0669 8.10898C37.6572 8.2691 37.3406 8.49997 37.1171 8.79788C36.9048 9.08461 36.8005 9.42348 36.8005 9.82192C36.8005 10.2688 36.9495 10.63 37.2474 10.9018C37.5454 11.1625 38.0557 11.3673 38.7745 11.5162L40.8045 11.9445C42.0336 12.2052 42.9461 12.6148 43.5421 13.1733C44.1492 13.7319 44.4546 14.4767 44.4546 15.4076C44.4546 16.1896 44.2423 16.8785 43.8214 17.4743C43.4005 18.0701 42.7972 18.5356 42.015 18.8707C41.244 19.1947 40.3314 19.3548 39.2774 19.3548ZM46.3132 19.1686V10.064H48.5852V11.8886H48.3804C48.5406 11.4678 48.764 11.1066 49.0508 10.8087C49.3376 10.5108 49.6766 10.2799 50.0751 10.1198C50.4736 9.9597 50.9131 9.87778 51.3973 9.87778C52.1311 9.87778 52.7308 10.0528 53.2038 10.3991C53.6768 10.7454 54.0046 11.2816 54.1908 12.0003H53.9301C54.1797 11.3412 54.5894 10.8273 55.1592 10.455C55.7291 10.0714 56.3884 9.87778 57.1333 9.87778C57.8298 9.87778 58.3997 10.0156 58.8466 10.2874C59.3048 10.5592 59.6474 10.9763 59.8709 11.5349C60.0944 12.0823 60.2061 12.7749 60.2061 13.6202V19.1686H57.8782V13.7133C57.8782 13.0169 57.759 12.5105 57.5244 12.1865C57.3009 11.8626 56.9173 11.7024 56.3697 11.7024C55.9712 11.7024 55.6248 11.803 55.3268 12.0003C55.0289 12.1865 54.7979 12.4584 54.6378 12.8196C54.4888 13.1808 54.4143 13.6127 54.4143 14.1229V19.1686H52.0864V13.7133C52.0864 13.0169 51.9672 12.5105 51.7326 12.1865C51.5091 11.8626 51.1292 11.7024 50.5966 11.7024C50.1868 11.7024 49.833 11.803 49.535 12.0003C49.2482 12.1865 49.0248 12.4584 48.8646 12.8196C48.7156 13.1808 48.6411 13.6127 48.6411 14.1229V19.1686H46.3132ZM65.6068 19.3548C64.9476 19.3548 64.3591 19.232 63.8376 18.9825C63.3274 18.7218 62.9251 18.3755 62.6271 17.9398C62.3403 17.5041 62.1988 17.0163 62.1988 16.4689C62.1988 15.7986 62.3739 15.2698 62.7203 14.8863C63.0666 14.4878 63.6328 14.2048 64.415 14.0298C65.1971 13.8548 66.2475 13.7691 67.5623 13.7691H68.4934V15.1097H67.5809C66.9961 15.1097 66.5082 15.1358 66.1097 15.1842C65.7111 15.2214 65.3908 15.2885 65.1413 15.389C64.9066 15.4746 64.7316 15.6013 64.6198 15.7614C64.5192 15.9215 64.4708 16.1226 64.4708 16.3572C64.4708 16.7668 64.6124 17.1019 64.8992 17.3626C65.186 17.6233 65.5808 17.7536 66.091 17.7536C66.5008 17.7536 66.862 17.6605 67.1712 17.4743C67.4952 17.277 67.7485 17.0088 67.9347 16.6737C68.121 16.3386 68.2141 15.955 68.2141 15.5193V13.3781C68.2141 12.7563 68.0763 12.3094 67.8044 12.0376C67.5325 11.7657 67.0706 11.628 66.4263 11.628C65.916 11.628 65.3945 11.7099 64.8619 11.87C64.3293 12.019 63.7892 12.2536 63.2417 12.5775L62.5713 10.9949C62.8953 10.7715 63.2715 10.5779 63.7073 10.4177C64.1542 10.2427 64.6198 10.1124 65.104 10.0267C65.5994 9.92619 66.065 9.87778 66.5008 9.87778C67.3947 9.87778 68.1284 10.0156 68.6983 10.2874C69.2831 10.5592 69.7151 10.9763 70.0019 11.5349C70.2887 12.0823 70.4303 12.7898 70.4303 13.6574V19.1686H68.2513V17.2323H68.4003C68.3147 17.668 68.1396 18.0441 67.8789 18.368C67.6293 18.6771 67.3127 18.9192 66.9291 19.0942C66.5455 19.2692 66.1022 19.3548 65.6068 19.3548ZM72.7917 19.1686V10.064H75.0637V12.261H74.8775C75.0525 11.5162 75.3915 10.9502 75.9017 10.5667C76.412 10.1682 77.0862 9.94108 77.9317 9.87778L78.6394 9.82192L78.7883 11.7955L77.4475 11.9259C76.6914 12.0003 76.1178 12.2349 75.7341 12.6334C75.3505 13.0169 75.1568 13.5643 75.1568 14.2719V19.1686H72.7917ZM84.785 19.3548C83.567 19.3548 82.662 19.0495 82.066 18.4425C81.4701 17.8355 81.1721 16.9455 81.1721 15.78V11.8142H79.4215V10.064H81.1721V7.3456H83.5V10.064H86.2562V11.8142H83.5V15.6497C83.5 16.2455 83.6304 16.6923 83.8911 16.9902C84.1518 17.2881 84.5727 17.4371 85.1575 17.4371C85.3325 17.4371 85.5113 17.4185 85.6975 17.3812C85.8838 17.3328 86.0775 17.2807 86.2749 17.2323L86.6287 18.9452C86.4052 19.0681 86.1184 19.1686 85.772 19.2431C85.4368 19.3176 85.109 19.3548 84.785 19.3548Z" fill="white"/>
      <path d="M34.1746 36.6501L40.11 23.5298H42.0637L47.9991 36.6501H45.5803L43.9988 32.9653L45.0035 33.6166H37.1516L38.1564 32.9653L36.5934 36.6501H34.1746ZM41.059 26.1166L38.4541 32.3139L37.9703 31.7184H44.1848L43.7197 32.3139L41.0962 26.1166H41.059ZM53.3243 36.8362C52.3679 36.8362 51.5381 36.6427 50.831 36.2593C50.124 35.8611 49.577 35.3027 49.1937 34.5844C48.8104 33.866 48.6169 33.0211 48.6169 32.0534C48.6169 31.0856 48.8104 30.2556 49.1937 29.5596C49.577 28.8524 50.124 28.3127 50.831 27.9405C51.5381 27.5571 52.3679 27.3635 53.3243 27.3635C53.9085 27.3635 54.4853 27.4566 55.0547 27.6427C55.624 27.8288 56.0966 28.0893 56.4687 28.4243L55.7803 30.0434C55.4566 29.7568 55.0919 29.541 54.6825 29.3921C54.2844 29.2432 53.9011 29.1687 53.5289 29.1687C52.7214 29.1687 52.0963 29.4218 51.6497 29.9318C51.2143 30.4268 50.9985 31.1414 50.9985 32.072C50.9985 33.0025 51.2143 33.7171 51.6497 34.2494C52.0963 34.7705 52.7214 35.031 53.5289 35.031C53.8899 35.031 54.2732 34.9566 54.6825 34.8077C55.0919 34.6588 55.4566 34.4355 55.7803 34.1377L56.4687 35.7754C56.0966 36.0993 55.6203 36.3598 55.0361 36.5571C54.4667 36.7432 53.8936 36.8362 53.3243 36.8362ZM61.9204 36.8362C60.964 36.8362 60.1342 36.6427 59.4272 36.2593C58.7201 35.8611 58.1731 35.3027 57.7898 34.5844C57.4065 33.866 57.213 33.0211 57.213 32.0534C57.213 31.0856 57.4065 30.2556 57.7898 29.5596C58.1731 28.8524 58.7201 28.3127 59.4272 27.9405C60.1342 27.5571 60.964 27.3635 61.9204 27.3635C62.5046 27.3635 63.0814 27.4566 63.6508 27.6427C64.2201 27.8288 64.6928 28.0893 65.0649 28.4243L64.3764 30.0434C64.0527 29.7568 63.688 29.541 63.2787 29.3921C62.8805 29.2432 62.4972 29.1687 62.1251 29.1687C61.3176 29.1687 60.6924 29.4218 60.2458 29.9318C59.8104 30.4268 59.5946 31.1414 59.5946 32.072C59.5946 33.0025 59.8104 33.7171 60.2458 34.2494C60.6924 34.7705 61.3176 35.031 62.1251 35.031C62.486 35.031 62.8693 34.9566 63.2787 34.8077C63.688 34.6588 64.0527 34.4355 64.3764 34.1377L65.0649 35.7754C64.6928 36.0993 64.2164 36.3598 63.6322 36.5571C63.0628 36.7432 62.4898 36.8362 61.9204 36.8362ZM70.7919 36.8362C69.7611 36.8362 68.8755 36.6427 68.1312 36.2593C67.387 35.8759 66.8102 35.3288 66.4008 34.6216C66.0026 33.9144 65.8054 33.0769 65.8054 32.1092C65.8054 31.1415 65.9989 30.3412 66.3822 29.634C66.7804 28.9268 67.32 28.3759 68.001 27.9777C68.6968 27.5682 69.482 27.3635 70.364 27.3635C71.2459 27.3635 71.9753 27.5496 72.5967 27.9218C73.2182 28.2941 73.6945 28.8226 74.0294 29.5037C74.3755 30.1849 74.5504 31 74.5504 31.9417V32.6303H67.6847V31.2903H72.913L72.6153 31.5695C72.6153 30.7246 72.4293 30.0807 72.0571 29.634C71.685 29.1762 71.1529 28.9454 70.457 28.9454C69.936 28.9454 69.4895 29.0683 69.1173 29.3176C68.7564 29.5521 68.4773 29.8946 68.2801 30.3412C68.094 30.7767 68.001 31.2978 68.001 31.9045V32.0348C68.001 32.7159 68.1052 33.2816 68.3173 33.7283C68.5294 34.1749 68.8457 34.5099 69.2662 34.7333C69.6867 34.9566 70.2077 35.0682 70.8291 35.0682C71.3389 35.0682 71.845 34.9938 72.3548 34.8449C72.8647 34.6849 73.3298 34.4355 73.7503 34.1005L74.4015 35.6638C73.9662 36.0248 73.4229 36.3077 72.7642 36.5199C72.1055 36.732 71.4506 36.8362 70.7919 36.8362ZM79.723 36.8362C79.2131 36.8362 78.7182 36.7916 78.2345 36.706C77.7619 36.6204 77.3302 36.5013 76.932 36.3524C76.5338 36.1923 76.1878 35.9913 75.8901 35.7568L76.4855 34.2308C76.7943 34.4281 77.1292 34.603 77.4902 34.7519C77.8512 34.9008 78.2233 35.0124 78.6066 35.0869C78.9899 35.1613 79.3694 35.1985 79.7416 35.1985C80.337 35.1985 80.7761 35.098 81.0626 34.9008C81.3603 34.6886 81.5092 34.4169 81.5092 34.0819C81.5092 33.7953 81.4087 33.5794 81.2115 33.4305C81.0254 33.2705 80.7389 33.1514 80.3556 33.0769L78.4949 32.7233C77.7246 32.5745 77.1367 32.2953 76.7273 31.8859C76.3292 31.4653 76.1319 30.9256 76.1319 30.2668C76.1319 29.6712 76.292 29.1576 76.6157 28.7221C76.9506 28.2866 77.4083 27.9516 77.9926 27.7171C78.5768 27.4826 79.2466 27.3635 80.0021 27.3635C80.4374 27.3635 80.858 27.4082 81.2673 27.4938C81.6766 27.5682 82.0599 27.6874 82.4209 27.8474C82.793 27.9963 83.1168 28.1936 83.3884 28.4429L82.7558 29.969C82.5214 29.7717 82.246 29.6042 81.9371 29.4665C81.6282 29.3176 81.3045 29.206 80.9696 29.1315C80.6458 29.0459 80.3295 29.0013 80.0207 29.0013C79.4141 29.0013 78.9601 29.1055 78.6624 29.3176C78.3759 29.5298 78.2345 29.8089 78.2345 30.1551C78.2345 30.4156 78.32 30.6315 78.4949 30.8065C78.6698 30.9814 78.9341 31.0968 79.295 31.1601L81.1557 31.5137C81.9632 31.6625 82.5697 31.9343 82.9791 32.3325C83.3996 32.7308 83.6117 33.263 83.6117 33.933C83.6117 34.5397 83.4517 35.0608 83.1279 35.4963C82.8042 35.9318 82.3539 36.2668 81.7697 36.5013C81.1854 36.7246 80.5044 36.8362 79.723 36.8362ZM88.8103 36.8362C88.3005 36.8362 87.8056 36.7916 87.3218 36.706C86.8492 36.6204 86.4175 36.5013 86.0193 36.3524C85.6212 36.1923 85.2751 35.9913 84.9774 35.7568L85.5728 34.2308C85.8817 34.4281 86.2166 34.603 86.5775 34.7519C86.9385 34.9008 87.3106 35.0124 87.6939 35.0869C88.0772 35.1613 88.4568 35.1985 88.8289 35.1985C89.4243 35.1985 89.8634 35.098 90.15 34.9008C90.4477 34.6886 90.5965 34.4169 90.5965 34.0819C90.5965 33.7953 90.496 33.5794 90.2988 33.4305C90.1127 33.2705 89.8262 33.1514 89.4429 33.0769L87.5823 32.7233C86.812 32.5745 86.224 32.2953 85.8147 31.8859C85.4165 31.4653 85.2193 30.9256 85.2193 30.2668C85.2193 29.6712 85.3793 29.1576 85.703 28.7221C86.038 28.2866 86.4957 27.9516 87.0799 27.7171C87.6642 27.4826 88.334 27.3635 89.0894 27.3635C89.5248 27.3635 89.9453 27.4082 90.3546 27.4938C90.764 27.5682 91.1473 27.6874 91.5082 27.8474C91.8803 27.9963 92.2041 28.1936 92.4758 28.4429L91.8431 29.969C91.6087 29.7717 91.3333 29.6042 91.0245 29.4665C90.7156 29.3176 90.3918 29.206 90.0569 29.1315C89.7332 29.0459 89.4169 29.0013 89.108 29.0013C88.5014 29.0013 88.0474 29.1055 87.7497 29.3176C87.4632 29.5298 87.3218 29.8089 87.3218 30.1551C87.3218 30.4156 87.4074 30.6315 87.5823 30.8065C87.7572 30.9814 88.0214 31.0968 88.3824 31.1601L90.243 31.5137C91.0505 31.6625 91.6571 31.9343 92.0664 32.3325C92.4869 32.7308 92.699 33.263 92.699 33.933C92.699 34.5397 92.539 35.0608 92.2153 35.4963C91.8915 35.9318 91.4412 36.2668 90.857 36.5013C90.2728 36.7246 89.5918 36.8362 88.8103 36.8362ZM94.4145 25.5955V23.3251H97.0194V25.5955H94.4145ZM94.5634 36.6501V27.5496H96.8892V36.6501H94.5634ZM104.555 36.8362C103.785 36.8362 103.111 36.6427 102.527 36.2593C101.958 35.8759 101.578 35.3586 101.392 34.7147H101.578V36.6501H99.308V23.5298H101.634V29.3921H101.411C101.608 28.7854 101.995 28.2941 102.564 27.9218C103.133 27.5496 103.8 27.3635 104.555 27.3635C105.363 27.3635 106.062 27.5571 106.658 27.9405C107.253 28.3238 107.718 28.871 108.053 29.5782C108.388 30.2742 108.555 31.1117 108.555 32.0906C108.555 33.0695 108.388 33.9032 108.053 34.6216C107.718 35.3288 107.245 35.8759 106.639 36.2593C106.044 36.6427 105.348 36.8362 104.555 36.8362ZM103.904 35.0682C104.6 35.0682 105.158 34.8189 105.578 34.3238C105.999 33.8139 106.211 33.0695 106.211 32.0906C106.211 31.1117 105.999 30.3598 105.578 29.8759C105.158 29.3809 104.6 29.1315 103.904 29.1315C103.208 29.1315 102.65 29.3809 102.229 29.8759C101.809 30.3598 101.597 31.0968 101.597 32.0906C101.597 33.0844 101.809 33.8139 102.229 34.3238C102.65 34.8189 103.208 35.0682 103.904 35.0682ZM110.316 25.5955V23.3251H112.92V25.5955H110.316ZM110.464 36.6501V27.5496H112.79V36.6501H110.464ZM118.368 36.8362C117.289 36.8362 116.489 36.5459 115.968 35.9616C115.458 35.366 115.205 34.4988 115.205 33.3561V23.5298H117.531V33.2444C117.531 33.6055 117.579 33.9144 117.68 34.1749C117.792 34.4243 117.952 34.6104 118.164 34.7333C118.376 34.8561 118.636 34.9194 118.945 34.9194C119.083 34.9194 119.217 34.9119 119.354 34.9008C119.492 34.8896 119.622 34.8635 119.745 34.8263L119.708 36.6687C119.485 36.7171 119.261 36.7544 119.038 36.7804C118.826 36.8176 118.603 36.8362 118.368 36.8362ZM120.999 25.5955V23.3251H123.604V25.5955H120.999ZM121.148 36.6501V27.5496H123.474V36.6501H121.148ZM130.057 36.8362C128.84 36.8362 127.936 36.531 127.34 35.9243C126.745 35.3176 126.447 34.4281 126.447 33.263V29.299H124.698V27.5496H126.447V24.8325H128.773V27.5496H131.527V29.299H128.773V33.1328C128.773 33.7283 128.903 34.1749 129.164 34.4727C129.424 34.7705 129.845 34.9194 130.429 34.9194C130.604 34.9194 130.782 34.9008 130.969 34.8635C131.155 34.8151 131.348 34.763 131.545 34.7147L131.899 36.4268C131.676 36.5496 131.389 36.6501 131.043 36.7246C130.708 36.799 130.381 36.8362 130.057 36.8362ZM133.994 40L135.892 35.8127V36.7804L131.891 27.5496H134.366L137.194 34.603H136.636L139.52 27.5496H141.864L136.394 40H133.994Z" fill="white"/>
      </svg>`,

    dark: `<svg xmlns="http://www.w3.org/2000/svg" width="148" height="40" viewBox="0 0 148 40" fill="none">
      <path d="M8.60332 10.1995L12.0208 12.1925L6.54887 21.4273L3.13538 19.4342L8.60332 10.1995Z" fill="#10D4B6"/>
      <path d="M20.8226 11.9623L24.2361 9.96924L29.708 19.2079L26.2906 21.201L20.8226 11.9623Z" fill="#7DD3FC"/>
      <path d="M3.13538 23.5276L6.70782 21.8243L11.385 31.4799L7.81253 33.1832L3.13538 23.5276Z" fill="#10D4B6"/>
      <path d="M26.4178 20.9111L29.9862 22.6144L25.3091 32.2699L21.7406 30.5667L26.4178 20.9111Z" fill="#67E8F9"/>
      <path d="M22.6586 30.2571H11.8618V34.1876H22.6586V30.2571Z" fill="#67E8F9"/>
      <path d="M20.8227 9.28625H10.0259V13.2168H20.8227V9.28625Z" fill="#93C5FD"/>
      <path d="M10.0933 36.3314C12.4833 36.3314 14.4208 34.4099 14.4208 32.0396C14.4208 29.6693 12.4833 27.7478 10.0933 27.7478C7.70334 27.7478 5.76587 29.6693 5.76587 32.0396C5.76587 34.4099 7.70334 36.3314 10.0933 36.3314Z" fill="#13D6B8"/>
      <path d="M22.6546 36.3314C25.0446 36.3314 26.9821 34.4099 26.9821 32.0396C26.9821 29.6693 25.0446 27.7478 22.6546 27.7478C20.2646 27.7478 18.3272 29.6693 18.3272 32.0396C18.3272 34.4099 20.2646 36.3314 22.6546 36.3314Z" fill="#A5F3FC"/>
      <path d="M10.0933 14.8367C12.4833 14.8367 14.4208 12.9152 14.4208 10.5449C14.4208 8.17456 12.4833 6.25305 10.0933 6.25305C7.70334 6.25305 5.76587 8.17456 5.76587 10.5449C5.76587 12.9152 7.70334 14.8367 10.0933 14.8367Z" fill="#10D4B6"/>
      <path d="M22.6546 14.8367C25.0446 14.8367 26.9821 12.9152 26.9821 10.5449C26.9821 8.17456 25.0446 6.25305 22.6546 6.25305C20.2646 6.25305 18.3272 8.17456 18.3272 10.5449C18.3272 12.9152 20.2646 14.8367 22.6546 14.8367Z" fill="#38BDF8"/>
      <path d="M4.32746 25.866C6.71745 25.866 8.65492 23.9445 8.65492 21.5742C8.65492 19.2039 6.71745 17.2823 4.32746 17.2823C1.93747 17.2823 0 19.2039 0 21.5742C0 23.9445 1.93747 25.866 4.32746 25.866Z" fill="#10D4B6"/>
      <path d="M28.6551 25.866C31.0451 25.866 32.9826 23.9445 32.9826 21.5742C32.9826 19.2039 31.0451 17.2823 28.6551 17.2823C26.2651 17.2823 24.3277 19.2039 24.3277 21.5742C24.3277 23.9445 26.2651 25.866 28.6551 25.866Z" fill="#1687F6"/>
      <path d="M13.6937 19.3548C14.4408 18.9697 14.7666 18.3186 15.6448 18.1002C16.2966 17.9414 16.7098 17.9612 17.3695 18.1002C18.3311 18.3066 18.7524 18.9657 19.5511 19.3548C20.3498 19.7399 20.3538 21.0659 20.3538 21.0659C20.3538 21.0659 20.4849 21.9831 20.3538 22.5468C20.2227 23.1106 20.2703 23.6029 19.3921 23.9602C18.5139 24.3176 17.739 24.9409 17.3695 25.056C16.7734 25.2387 16.4754 25.191 15.9906 25.056C15.6886 24.9726 14.6832 24.3176 13.8884 23.9602C13.0937 23.6029 13.0221 23.1106 12.891 22.5468C12.7599 21.9831 12.7797 21.6337 12.891 21.0659C13.0341 20.3434 12.9466 19.7439 13.6937 19.3548Z" fill="#11D4B6"/>
      <path d="M39.2774 19.3548C38.5958 19.3548 37.9365 19.2915 37.3033 19.1686C36.6813 19.0569 36.104 18.8894 35.5714 18.6659C35.0499 18.4425 34.5843 18.1744 34.1746 17.8653L34.9009 15.9848C35.3106 16.2715 35.739 16.5173 36.1859 16.7296C36.6441 16.9269 37.1283 17.0833 37.6385 17.195C38.16 17.2956 38.7075 17.344 39.2774 17.344C40.257 17.344 40.9721 17.1839 41.419 16.8599C41.866 16.5248 42.0895 16.0965 42.0895 15.5752C42.0895 15.2885 42.0224 15.0464 41.8846 14.849C41.7468 14.6368 41.5233 14.458 41.2142 14.3091C40.905 14.1601 40.4953 14.0373 39.9851 13.9367L37.9365 13.5085C36.7558 13.259 35.8768 12.8456 35.292 12.261C34.7221 11.6652 34.4353 10.8832 34.4353 9.91502C34.4353 9.09578 34.6514 8.38081 35.0872 7.77383C35.5229 7.16686 36.1226 6.69393 36.8936 6.35879C37.6646 6.02365 38.5511 5.85608 39.5567 5.85608C40.1527 5.85608 40.7225 5.91938 41.2701 6.04227C41.8288 6.15398 42.339 6.329 42.7972 6.5636C43.2702 6.78703 43.6799 7.05887 44.0263 7.38284L43.3 9.17026C42.7785 8.73457 42.2087 8.41433 41.5866 8.20207C40.9646 7.97864 40.283 7.86693 39.5381 7.86693C38.9682 7.86693 38.4766 7.94885 38.0669 8.10898C37.6572 8.2691 37.3406 8.49997 37.1171 8.79788C36.9048 9.08461 36.8005 9.42348 36.8005 9.82192C36.8005 10.2688 36.9495 10.63 37.2474 10.9018C37.5454 11.1625 38.0557 11.3673 38.7745 11.5162L40.8045 11.9445C42.0336 12.2052 42.9461 12.6148 43.5421 13.1733C44.1492 13.7319 44.4546 14.4767 44.4546 15.4076C44.4546 16.1896 44.2423 16.8785 43.8214 17.4743C43.4005 18.0701 42.7972 18.5356 42.015 18.8707C41.244 19.1947 40.3314 19.3548 39.2774 19.3548ZM46.3132 19.1686V10.064H48.5852V11.8886H48.3804C48.5406 11.4678 48.764 11.1066 49.0508 10.8087C49.3376 10.5108 49.6766 10.2799 50.0751 10.1198C50.4736 9.9597 50.9131 9.87778 51.3973 9.87778C52.1311 9.87778 52.7308 10.0528 53.2038 10.3991C53.6768 10.7454 54.0046 11.2816 54.1908 12.0003H53.9301C54.1797 11.3412 54.5894 10.8273 55.1592 10.455C55.7291 10.0714 56.3884 9.87778 57.1333 9.87778C57.8298 9.87778 58.3997 10.0156 58.8466 10.2874C59.3048 10.5592 59.6474 10.9763 59.8709 11.5349C60.0944 12.0823 60.2061 12.7749 60.2061 13.6202V19.1686H57.8782V13.7133C57.8782 13.0169 57.759 12.5105 57.5244 12.1865C57.3009 11.8626 56.9173 11.7024 56.3697 11.7024C55.9712 11.7024 55.6248 11.803 55.3268 12.0003C55.0289 12.1865 54.7979 12.4584 54.6378 12.8196C54.4888 13.1808 54.4143 13.6127 54.4143 14.1229V19.1686H52.0864V13.7133C52.0864 13.0169 51.9672 12.5105 51.7326 12.1865C51.5091 11.8626 51.1292 11.7024 50.5966 11.7024C50.1868 11.7024 49.833 11.803 49.535 12.0003C49.2482 12.1865 49.0248 12.4584 48.8646 12.8196C48.7156 13.1808 48.6411 13.6127 48.6411 14.1229V19.1686H46.3132ZM65.6068 19.3548C64.9476 19.3548 64.3591 19.232 63.8376 18.9825C63.3274 18.7218 62.9251 18.3755 62.6271 17.9398C62.3403 17.5041 62.1988 17.0163 62.1988 16.4689C62.1988 15.7986 62.3739 15.2698 62.7203 14.8863C63.0666 14.4878 63.6328 14.2048 64.415 14.0298C65.1971 13.8548 66.2475 13.7691 67.5623 13.7691H68.4934V15.1097H67.5809C66.9961 15.1097 66.5082 15.1358 66.1097 15.1842C65.7111 15.2214 65.3908 15.2885 65.1413 15.389C64.9066 15.4746 64.7316 15.6013 64.6198 15.7614C64.5192 15.9215 64.4708 16.1226 64.4708 16.3572C64.4708 16.7668 64.6124 17.1019 64.8992 17.3626C65.186 17.6233 65.5808 17.7536 66.091 17.7536C66.5008 17.7536 66.862 17.6605 67.1712 17.4743C67.4952 17.277 67.7485 17.0088 67.9347 16.6737C68.121 16.3386 68.2141 15.955 68.2141 15.5193V13.3781C68.2141 12.7563 68.0763 12.3094 67.8044 12.0376C67.5325 11.7657 67.0706 11.628 66.4263 11.628C65.916 11.628 65.3945 11.7099 64.8619 11.87C64.3293 12.019 63.7892 12.2536 63.2417 12.5775L62.5713 10.9949C62.8953 10.7715 63.2715 10.5779 63.7073 10.4177C64.1542 10.2427 64.6198 10.1124 65.104 10.0267C65.5994 9.92619 66.065 9.87778 66.5008 9.87778C67.3947 9.87778 68.1284 10.0156 68.6983 10.2874C69.2831 10.5592 69.7151 10.9763 70.0019 11.5349C70.2887 12.0823 70.4303 12.7898 70.4303 13.6574V19.1686H68.2513V17.2323H68.4003C68.3147 17.668 68.1396 18.0441 67.8789 18.368C67.6293 18.6771 67.3127 18.9192 66.9291 19.0942C66.5455 19.2692 66.1022 19.3548 65.6068 19.3548ZM72.7917 19.1686V10.064H75.0637V12.261H74.8775C75.0525 11.5162 75.3915 10.9502 75.9017 10.5667C76.412 10.1682 77.0862 9.94108 77.9317 9.87778L78.6394 9.82192L78.7883 11.7955L77.4475 11.9259C76.6914 12.0003 76.1178 12.2349 75.7341 12.6334C75.3505 13.0169 75.1568 13.5643 75.1568 14.2719V19.1686H72.7917ZM84.785 19.3548C83.567 19.3548 82.662 19.0495 82.066 18.4425C81.4701 17.8355 81.1721 16.9455 81.1721 15.78V11.8142H79.4215V10.064H81.1721V7.3456H83.5V10.064H86.2562V11.8142H83.5V15.6497C83.5 16.2455 83.6304 16.6923 83.8911 16.9902C84.1518 17.2881 84.5727 17.4371 85.1575 17.4371C85.3325 17.4371 85.5113 17.4185 85.6975 17.3812C85.8838 17.3328 86.0775 17.2807 86.2749 17.2323L86.6287 18.9452C86.4052 19.0681 86.1184 19.1686 85.772 19.2431C85.4368 19.3176 85.109 19.3548 84.785 19.3548Z" fill="white"/>
      <path d="M34.1746 36.6501L40.11 23.5298H42.0637L47.9991 36.6501H45.5803L43.9988 32.9653L45.0035 33.6166H37.1516L38.1564 32.9653L36.5934 36.6501H34.1746ZM41.059 26.1166L38.4541 32.3139L37.9703 31.7184H44.1848L43.7197 32.3139L41.0962 26.1166H41.059ZM53.3243 36.8362C52.3679 36.8362 51.5381 36.6427 50.831 36.2593C50.124 35.8611 49.577 35.3027 49.1937 34.5844C48.8104 33.866 48.6169 33.0211 48.6169 32.0534C48.6169 31.0856 48.8104 30.2556 49.1937 29.5596C49.577 28.8524 50.124 28.3127 50.831 27.9405C51.5381 27.5571 52.3679 27.3635 53.3243 27.3635C53.9085 27.3635 54.4853 27.4566 55.0547 27.6427C55.624 27.8288 56.0966 28.0893 56.4687 28.4243L55.7803 30.0434C55.4566 29.7568 55.0919 29.541 54.6825 29.3921C54.2844 29.2432 53.9011 29.1687 53.5289 29.1687C52.7214 29.1687 52.0963 29.4218 51.6497 29.9318C51.2143 30.4268 50.9985 31.1414 50.9985 32.072C50.9985 33.0025 51.2143 33.7171 51.6497 34.2494C52.0963 34.7705 52.7214 35.031 53.5289 35.031C53.8899 35.031 54.2732 34.9566 54.6825 34.8077C55.0919 34.6588 55.4566 34.4355 55.7803 34.1377L56.4687 35.7754C56.0966 36.0993 55.6203 36.3598 55.0361 36.5571C54.4667 36.7432 53.8936 36.8362 53.3243 36.8362ZM61.9204 36.8362C60.964 36.8362 60.1342 36.6427 59.4272 36.2593C58.7201 35.8611 58.1731 35.3027 57.7898 34.5844C57.4065 33.866 57.213 33.0211 57.213 32.0534C57.213 31.0856 57.4065 30.2556 57.7898 29.5596C58.1731 28.8524 58.7201 28.3127 59.4272 27.9405C60.1342 27.5571 60.964 27.3635 61.9204 27.3635C62.5046 27.3635 63.0814 27.4566 63.6508 27.6427C64.2201 27.8288 64.6928 28.0893 65.0649 28.4243L64.3764 30.0434C64.0527 29.7568 63.688 29.541 63.2787 29.3921C62.8805 29.2432 62.4972 29.1687 62.1251 29.1687C61.3176 29.1687 60.6924 29.4218 60.2458 29.9318C59.8104 30.4268 59.5946 31.1414 59.5946 32.072C59.5946 33.0025 59.8104 33.7171 60.2458 34.2494C60.6924 34.7705 61.3176 35.031 62.1251 35.031C62.486 35.031 62.8693 34.9566 63.2787 34.8077C63.688 34.6588 64.0527 34.4355 64.3764 34.1377L65.0649 35.7754C64.6928 36.0993 64.2164 36.3598 63.6322 36.5571C63.0628 36.7432 62.4898 36.8362 61.9204 36.8362ZM70.7919 36.8362C69.7611 36.8362 68.8755 36.6427 68.1312 36.2593C67.387 35.8759 66.8102 35.3288 66.4008 34.6216C66.0026 33.9144 65.8054 33.0769 65.8054 32.1092C65.8054 31.1415 65.9989 30.3412 66.3822 29.634C66.7804 28.9268 67.32 28.3759 68.001 27.9777C68.6968 27.5682 69.482 27.3635 70.364 27.3635C71.2459 27.3635 71.9753 27.5496 72.5967 27.9218C73.2182 28.2941 73.6945 28.8226 74.0294 29.5037C74.3755 30.1849 74.5504 31 74.5504 31.9417V32.6303H67.6847V31.2903H72.913L72.6153 31.5695C72.6153 30.7246 72.4293 30.0807 72.0571 29.634C71.685 29.1762 71.1529 28.9454 70.457 28.9454C69.936 28.9454 69.4895 29.0683 69.1173 29.3176C68.7564 29.5521 68.4773 29.8946 68.2801 30.3412C68.094 30.7767 68.001 31.2978 68.001 31.9045V32.0348C68.001 32.7159 68.1052 33.2816 68.3173 33.7283C68.5294 34.1749 68.8457 34.5099 69.2662 34.7333C69.6867 34.9566 70.2077 35.0682 70.8291 35.0682C71.3389 35.0682 71.845 34.9938 72.3548 34.8449C72.8647 34.6849 73.3298 34.4355 73.7503 34.1005L74.4015 35.6638C73.9662 36.0248 73.4229 36.3077 72.7642 36.5199C72.1055 36.732 71.4506 36.8362 70.7919 36.8362ZM79.723 36.8362C79.2131 36.8362 78.7182 36.7916 78.2345 36.706C77.7619 36.6204 77.3302 36.5013 76.932 36.3524C76.5338 36.1923 76.1878 35.9913 75.8901 35.7568L76.4855 34.2308C76.7943 34.4281 77.1292 34.603 77.4902 34.7519C77.8512 34.9008 78.2233 35.0124 78.6066 35.0869C78.9899 35.1613 79.3694 35.1985 79.7416 35.1985C80.337 35.1985 80.7761 35.098 81.0626 34.9008C81.3603 34.6886 81.5092 34.4169 81.5092 34.0819C81.5092 33.7953 81.4087 33.5794 81.2115 33.4305C81.0254 33.2705 80.7389 33.1514 80.3556 33.0769L78.4949 32.7233C77.7246 32.5745 77.1367 32.2953 76.7273 31.8859C76.3292 31.4653 76.1319 30.9256 76.1319 30.2668C76.1319 29.6712 76.292 29.1576 76.6157 28.7221C76.9506 28.2866 77.4083 27.9516 77.9926 27.7171C78.5768 27.4826 79.2466 27.3635 80.0021 27.3635C80.4374 27.3635 80.858 27.4082 81.2673 27.4938C81.6766 27.5682 82.0599 27.6874 82.4209 27.8474C82.793 27.9963 83.1168 28.1936 83.3884 28.4429L82.7558 29.969C82.5214 29.7717 82.246 29.6042 81.9371 29.4665C81.6282 29.3176 81.3045 29.206 80.9696 29.1315C80.6458 29.0459 80.3295 29.0013 80.0207 29.0013C79.4141 29.0013 78.9601 29.1055 78.6624 29.3176C78.3759 29.5298 78.2345 29.8089 78.2345 30.1551C78.2345 30.4156 78.32 30.6315 78.4949 30.8065C78.6698 30.9814 78.9341 31.0968 79.295 31.1601L81.1557 31.5137C81.9632 31.6625 82.5697 31.9343 82.9791 32.3325C83.3996 32.7308 83.6117 33.263 83.6117 33.933C83.6117 34.5397 83.4517 35.0608 83.1279 35.4963C82.8042 35.9318 82.3539 36.2668 81.7697 36.5013C81.1854 36.7246 80.5044 36.8362 79.723 36.8362ZM88.8103 36.8362C88.3005 36.8362 87.8056 36.7916 87.3218 36.706C86.8492 36.6204 86.4175 36.5013 86.0193 36.3524C85.6212 36.1923 85.2751 35.9913 84.9774 35.7568L85.5728 34.2308C85.8817 34.4281 86.2166 34.603 86.5775 34.7519C86.9385 34.9008 87.3106 35.0124 87.6939 35.0869C88.0772 35.1613 88.4568 35.1985 88.8289 35.1985C89.4243 35.1985 89.8634 35.098 90.15 34.9008C90.4477 34.6886 90.5965 34.4169 90.5965 34.0819C90.5965 33.7953 90.496 33.5794 90.2988 33.4305C90.1127 33.2705 89.8262 33.1514 89.4429 33.0769L87.5823 32.7233C86.812 32.5745 86.224 32.2953 85.8147 31.8859C85.4165 31.4653 85.2193 30.9256 85.2193 30.2668C85.2193 29.6712 85.3793 29.1576 85.703 28.7221C86.038 28.2866 86.4957 27.9516 87.0799 27.7171C87.6642 27.4826 88.334 27.3635 89.0894 27.3635C89.5248 27.3635 89.9453 27.4082 90.3546 27.4938C90.764 27.5682 91.1473 27.6874 91.5082 27.8474C91.8803 27.9963 92.2041 28.1936 92.4758 28.4429L91.8431 29.969C91.6087 29.7717 91.3333 29.6042 91.0245 29.4665C90.7156 29.3176 90.3918 29.206 90.0569 29.1315C89.7332 29.0459 89.4169 29.0013 89.108 29.0013C88.5014 29.0013 88.0474 29.1055 87.7497 29.3176C87.4632 29.5298 87.3218 29.8089 87.3218 30.1551C87.3218 30.4156 87.4074 30.6315 87.5823 30.8065C87.7572 30.9814 88.0214 31.0968 88.3824 31.1601L90.243 31.5137C91.0505 31.6625 91.6571 31.9343 92.0664 32.3325C92.4869 32.7308 92.699 33.263 92.699 33.933C92.699 34.5397 92.539 35.0608 92.2153 35.4963C91.8915 35.9318 91.4412 36.2668 90.857 36.5013C90.2728 36.7246 89.5918 36.8362 88.8103 36.8362ZM94.4145 25.5955V23.3251H97.0194V25.5955H94.4145ZM94.5634 36.6501V27.5496H96.8892V36.6501H94.5634ZM104.555 36.8362C103.785 36.8362 103.111 36.6427 102.527 36.2593C101.958 35.8759 101.578 35.3586 101.392 34.7147H101.578V36.6501H99.308V23.5298H101.634V29.3921H101.411C101.608 28.7854 101.995 28.2941 102.564 27.9218C103.133 27.5496 103.8 27.3635 104.555 27.3635C105.363 27.3635 106.062 27.5571 106.658 27.9405C107.253 28.3238 107.718 28.871 108.053 29.5782C108.388 30.2742 108.555 31.1117 108.555 32.0906C108.555 33.0695 108.388 33.9032 108.053 34.6216C107.718 35.3288 107.245 35.8759 106.639 36.2593C106.044 36.6427 105.348 36.8362 104.555 36.8362ZM103.904 35.0682C104.6 35.0682 105.158 34.8189 105.578 34.3238C105.999 33.8139 106.211 33.0695 106.211 32.0906C106.211 31.1117 105.999 30.3598 105.578 29.8759C105.158 29.3809 104.6 29.1315 103.904 29.1315C103.208 29.1315 102.65 29.3809 102.229 29.8759C101.809 30.3598 101.597 31.0968 101.597 32.0906C101.597 33.0844 101.809 33.8139 102.229 34.3238C102.65 34.8189 103.208 35.0682 103.904 35.0682ZM110.316 25.5955V23.3251H112.92V25.5955H110.316ZM110.464 36.6501V27.5496H112.79V36.6501H110.464ZM118.368 36.8362C117.289 36.8362 116.489 36.5459 115.968 35.9616C115.458 35.366 115.205 34.4988 115.205 33.3561V23.5298H117.531V33.2444C117.531 33.6055 117.579 33.9144 117.68 34.1749C117.792 34.4243 117.952 34.6104 118.164 34.7333C118.376 34.8561 118.636 34.9194 118.945 34.9194C119.083 34.9194 119.217 34.9119 119.354 34.9008C119.492 34.8896 119.622 34.8635 119.745 34.8263L119.708 36.6687C119.485 36.7171 119.261 36.7544 119.038 36.7804C118.826 36.8176 118.603 36.8362 118.368 36.8362ZM120.999 25.5955V23.3251H123.604V25.5955H120.999ZM121.148 36.6501V27.5496H123.474V36.6501H121.148ZM130.057 36.8362C128.84 36.8362 127.936 36.531 127.34 35.9243C126.745 35.3176 126.447 34.4281 126.447 33.263V29.299H124.698V27.5496H126.447V24.8325H128.773V27.5496H131.527V29.299H128.773V33.1328C128.773 33.7283 128.903 34.1749 129.164 34.4727C129.424 34.7705 129.845 34.9194 130.429 34.9194C130.604 34.9194 130.782 34.9008 130.969 34.8635C131.155 34.8151 131.348 34.763 131.545 34.7147L131.899 36.4268C131.676 36.5496 131.389 36.6501 131.043 36.7246C130.708 36.799 130.381 36.8362 130.057 36.8362ZM133.994 40L135.892 35.8127V36.7804L131.891 27.5496H134.366L137.194 34.603H136.636L139.52 27.5496H141.864L136.394 40H133.994Z" fill="white"/>
      </svg>`,
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
  const LS_KEY = 'awidget:prefs',
    SIDE_KEY = 'awidget:position',
    COLORS_KEY = 'awidget:colors';
  const THEME_KEY = 'awidget:theme';
  const DEFAULT_POSITION = 'right';
  const THEMES_KEY = 'awidget:customthemes';

  const defaultOptions = {
    position: 'right',
    theme: 'dark',
    accentColor: '#60a5fa',
    fontFamily:
      'system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial',
    lang: 'auto',
  };


  const _idle = (fn) =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(fn, { timeout: 300 })
      : setTimeout(fn, 0);
  let _savePending = false;
  const state = {
    colors: {},
    fontLevel: 0,
    letterLevel: 0,
    align: 0,
    cursorIdx: 0,
    noanim: false,
    hideimgs: false,
    highlight: false,
    highlightLinks: false,
    dyslexic: false,
    ruler: false,
    focusmode: false,
    contrastPlus: 0,
    saturation: 0,
    cursorGuideMode: 0,
    cursorGuideSize: 1,
    cursorGuideOpacity: 1,
    side: 'right',
    dictating: false,
    screenReader: false,
    colors: { text: '#f9fafb', link: '#7aa8ff' },
    profiles: {
      blind: false,
      colorblind: false,
      dyslexia: false,
      lowvision: false,
      adhd: false,
      seizure: false,
    },
  };

  function _persist() {
    if (_savePending) return;
    _savePending = true;
    _idle(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
        localStorage.setItem(COLORS_KEY, JSON.stringify(state.colors));
      } catch {}
      _savePending = false;
    });
  }

  function save() {
    _persist();
  }

  function load() {
    try {
      Object.assign(state, JSON.parse(localStorage.getItem(LS_KEY) || '{}'));
      const c = JSON.parse(localStorage.getItem(COLORS_KEY) || 'null');
      if (c) state.colors = c;
    } catch (e) {}
  }

  // setAWIDGETPosition function
  function setAWIDGETPosition(pos) {
    const panel = document.getElementById('aw-panel');
    const fab = document.getElementById('aw-fab');
    if (!panel || !fab) return;

    panel.style.left = panel.style.right = 'auto';
    fab.style.left = fab.style.right = 'auto';

    if (pos === 'left') {
      panel.style.left = '16px';
      fab.style.left = '16px';
    } else if (pos === 'right') {
      panel.style.right = '16px';
      fab.style.right = '16px';
    }
  }

  // Make it globally available
  window.setAWIDGETPosition = setAWIDGETPosition;

  // --- Apply on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Get position from localStorage or fallback
    const horizontal =
      localStorage.getItem('awidget:position') || DEFAULT_POSITION;

    // Apply panel & FAB position
    setAWIDGETPosition(horizontal);

    // Listen for select changes
    const select = document.getElementById('aw-side');

    if (select) {
      // Set initial value
      select.value = horizontal;
      select.addEventListener('change', (e) => {
        const newPos = e.target.value;
        localStorage.setItem('awidget:position', newPos);
        setAWIDGETPosition(newPos);
      });
    }
  });

  // Theme
  let _themeMedia = null;
  const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'light';
  const resolveAutoTheme = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  const applyThemeAttr = (mode) => {
    const resolved = mode === 'auto' ? resolveAutoTheme() : mode;
    document.documentElement.setAttribute('data-theme', resolved);
  };

  const _onThemeChange = () => {
    if (getStoredTheme() === 'auto') applyThemeAttr('auto');
    applyGuideStyles();
  };

  // Custom themes
  const CustomThemes = new Map();
  function loadCustomThemes() {
    try {
      const raw = localStorage.getItem(THEMES_KEY);
      if (raw) {
        const obj = JSON.parse(raw) || {};
        Object.entries(obj).forEach(([name, def]) => {
          if (def && typeof def === 'object') CustomThemes.set(name, def);
        });
      }
    } catch {}
  }

  function saveCustomThemes() {
    try {
      const obj = {};
      CustomThemes.forEach((def, name) => (obj[name] = def));
      localStorage.setItem(THEMES_KEY, JSON.stringify(obj));
    } catch {}
  }

  function clearInlineThemeVars() {
    const keys = [
      '--aw-bg',
      '--aw-panel',
      '--aw-text',
      '--aw-muted',
      '--aw-accent',
      '--aw-border',
      '--aw-header',
    ];

    const root = document.documentElement;

    keys.forEach((key) => {
      root.style.removeProperty(key);
    });
  }

  function applyCustom(name) {
    const def = CustomThemes.get(name);
    if (!def) return;
    const base = def.base === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', base);
    const root = document.documentElement;
    const vars = def.vars || {};
    Object.keys(vars).forEach((k) => root.style.setProperty(k, vars[k]));
  }

  function rebuildThemeSelect() {
    const sel = document.getElementById('aw-theme');
    if (!sel) return;

    // Remove old custom group
    Array.from(sel.querySelectorAll('optgroup[label="Custom"]')).forEach((g) =>
      g.remove(),
    );

    // Add custom themes if any
    if (CustomThemes.size) {
      const group = document.createElement('optgroup');
      group.label = 'Custom Theme';
      group.setAttribute('data-i18n', 'customTheme');

      [...CustomThemes.keys()].sort().forEach((name) => {
        const opt = document.createElement('option');
        opt.value = 'custom:' + name;
        opt.textContent = name;
        group.appendChild(opt);
      });

      sel.appendChild(group);
    }

    // Set current value
    const current = getStoredTheme();
    const has = Array.from(sel.options).some((o) => o.value === current);
    sel.value = has ? current : sel.value;

    // Apply theme immediately
    applyTheme(sel.value);

    // Listen for changes
    sel.addEventListener('change', (e) => {
      const value = e.target.value;
      applyTheme(value);
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

  function isCustomMode(mode) {
    return mode && mode.startsWith('custom:');
  }

  function customNameFromMode(mode) {
    return mode.replace(/^custom:/, '');
  }

  // Public theme API
  window.AWIDGET_THEME = {
    set: setTheme,
    get: getStoredTheme,
    add: (name, { base = 'dark', vars = {} } = {}) => {
      if (!name || typeof name !== 'string') return;
      CustomThemes.set(name, {
        base: base === 'light' ? 'light' : 'dark',
        vars: vars || {},
      });
      saveCustomThemes();
      rebuildThemeSelect();
    },
    remove: (name) => {
      CustomThemes.delete(name);
      saveCustomThemes();
      rebuildThemeSelect();
      if (getStoredTheme() === 'custom:' + name) {
        setTheme('auto');
      }
    },
    list: () => [...CustomThemes.keys()],
  };

  function setTheme(mode) {
    const val =
      mode === 'dark' || mode === 'light' || isCustomMode(mode) ? mode : 'auto';

    try {
      localStorage.setItem(THEME_KEY, val);
    } catch {}

    if (_themeMedia) {
      try {
        _themeMedia.removeEventListener('change', _onThemeChange);
      } catch {}
      _themeMedia = null;
    }

    if (val === 'auto' && window.matchMedia) {
      _themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      try {
        _themeMedia.addEventListener('change', _onThemeChange);
      } catch {}
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
    if (sel && Array.from(sel.options).some((o) => o.value === val))
      sel.value = val;
  }

  function initThemeUI() {
    const buttons = document.querySelectorAll(
      '.toggle-group[data-type="theme"] .toggle-btn',
    );
    if (!buttons.length) return;

    // Load custom themes if needed
    loadCustomThemes();
    rebuildThemeSelect();

    // Get the stored theme
    let current = getStoredTheme();

    // Validate custom theme
    if (
      isCustomMode(current) &&
      !CustomThemes.has(customNameFromMode(current))
    ) {
      try {
        localStorage.setItem(THEME_KEY, 'auto');
        current = 'auto';
      } catch {}
    }

    // Apply stored theme and update active button
    setTheme(current);
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.value === current);
    });

    // Add click event to buttons
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;

        // Update theme
        setTheme(value);

        // Update active button class
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Save to storage
        try {
          localStorage.setItem(THEME_KEY, value);
        } catch {}

        save();
      });
    });
  }

  // Tile updater
  window.updateAWIDGETTiles = function (settings) {
    if (!settings?.tiles) return;

    Object.keys(settings.tiles).forEach((tileKey) => {
      const tileSettings = settings.tiles[tileKey];
      if (!tileSettings) return;

      // Select the link containing the span with this data-i18n
      const span = document.querySelector(
        `.aw-tile-title[data-i18n="${tileKey}"]`,
      );
      if (!span) return;

      const tile = span.closest('.aw-tile-link');
      if (!tile) return;

      // Show / hide
      tile.style.display = tileSettings.enabled ? '' : 'none';
      if (!tileSettings.enabled) return;

      // Set href
      tile.setAttribute('href', tileSettings.href || '#');

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
  const isRTL = (code) => LangRegistry.get(code)?.rtl === true;
  const getStoredLang = () => localStorage.getItem(LANG_KEY) || 'en';
  const setStoredLang = (code) => {
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {}
  };

  const getActiveLang = () => {
    const code = getStoredLang();
    return LangRegistry.has(code) ? code : 'en';
  };

  const setDirByLang = (
    code,
    container = document.querySelector('#aw-panel'),
  ) => {
    if (!container) return;
    container.setAttribute('dir', isRTL(code) ? 'rtl' : 'ltr');
    container.setAttribute('lang', code);
  };

  function t(key) {
    const active = getActiveLang();
    const packActive = LangRegistry.get(active)?.pack || {};
    const packEN = LangRegistry.get('en')?.pack || {};
    return packActive[key] ?? packEN[key] ?? key;
  }

  function addLanguage(code, { label, rtl = false, pack = {} }) {
    LangRegistry.set(code, {
      label: label || code.toUpperCase(),
      rtl: !!rtl,
      pack,
    });
    if (getStoredLang() === code) {
      applyI18n();
      buildLangGrid();
    }
  }

  function buildLangGrid() {
    const grid = document.getElementById('aw-langgrid');
    if (!grid) return;
    grid.innerHTML = '';
    const entries = [...LangRegistry.entries()]
      .map(([c, d]) => [c, d.label || c.toUpperCase()])
      .sort((a, b) => a[1].localeCompare(b[1]));
    entries.forEach(([code, label]) => {
      const b = document.createElement('button');
      b.className = 'aw-langopt';
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('role', 'radio');
      b.dataset.lang = code;
      b.setAttribute('aria-checked', 'false');
      b.addEventListener('click', () => {
        setStoredLang(code);
        applyI18n();
      });
      grid.appendChild(b);
    });
    const current = getActiveLang();
    grid.querySelectorAll('.aw-langopt').forEach((btn) => {
      const on = btn.dataset.lang === current;
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });
  }

  function applyI18n() {
    const code = getActiveLang();
    setDirByLang(code);
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const val = t(key);
      if (typeof val === 'string') node.innerText = val;
    });
    const current = code;
    document.querySelectorAll('.aw-langopt').forEach((btn) => {
      const on = btn.dataset.lang === current;
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });
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
  };

  function initI18n() {
    if (!localStorage.getItem(LANG_KEY)) setStoredLang('en');
    buildLangGrid();
    applyI18n();
  }

  // UI helpers
  function updateSegDots(tile, steps, val) {
    let wrap = tile.querySelector('.aw-steps');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'aw-steps';
      tile.appendChild(wrap);
    }
    wrap.innerHTML = '';
    for (let i = 0; i <= steps; i++) {
      const s = document.createElement('span');
      s.className = 'aw-step' + (i <= val ? ' on' : '');
      wrap.appendChild(s);
    }
  }

  function syncCycleTiles() {
    document.querySelectorAll('.aw-tile[data-cycle]').forEach((tile) => {
      const key = tile.dataset.cycle;
      const steps = Number(tile.dataset.steps) || 1;
      const val = Number(state[key] || 0);
      tile.setAttribute('aria-pressed', String(val > 0));
      updateSegDots(tile, steps, val);
    });
  }

  function syncToggleTiles() {
    document
      .querySelectorAll('.aw-tile[data-toggle], .aw-tile[data-profile]')
      .forEach((tile) => {
        const val = tile.dataset.toggle
          ? !!state[tile.dataset.toggle]
          : !!state.profiles[tile.dataset.profile];
        tile.setAttribute('aria-pressed', String(val));
      });
  }

  function setStatus(msg) {
    const s = document.getElementById('aw-status');
    if (s) s.textContent = msg || '';
    if (msg) setTimeout(() => setStatus(''), 3000);
  }

  // Guides
  function ensureLayers() {
    window._awEls = window._awEls || {};
    const els = window._awEls;
    els.ruler = document.getElementById('aw-ruler');
    els.focus = document.getElementById('aw-focus');
    els.gLine = document.getElementById('aw-guide-line');
    els.gBar = document.getElementById('aw-guide-bar');
    els.gSpot = document.getElementById('aw-guide-spot');
    return els;
  }

  function sizeVars() {
    const s = Number(state.cursorGuideSize) || 0;
    return {
      thick: [2, 3, 4][s],
      band: [36, 44, 60][s],
      spot: [110, 140, 180][s],
    };
  }

  function opVar() {
    return [0.35, 0.5, 0.7][Number(state.cursorGuideOpacity) || 0];
  }

  function applyGuideStyles() {
    const root = document.documentElement;
    const { thick, band, spot } = sizeVars();
    const accent = (
      getComputedStyle(root).getPropertyValue('--aw-accent') || '#60a5fa'
    ).trim();
    root.style.setProperty('--aw-guide-color', accent);
    root.style.setProperty('--aw-guide-thickness', thick + 'px');
    root.style.setProperty('--aw-guide-band', band + 'px');
    root.style.setProperty('--aw-guide-spot', spot + 'px');
    root.style.setProperty('--aw-guide-opacity', String(opVar()));
  }

  function guidesVisible(line, spot, bar) {
    const els = ensureLayers();
    if (els.gLine) els.gLine.style.display = line ? 'block' : 'none';
    if (els.gBar) els.gBar.style.display = bar ? 'block' : 'none';
    if (els.gSpot) els.gSpot.style.display = spot ? 'block' : 'none';
  }

  // rAF-throttled pointer guide move
  let _rafId = null,
    _lastXY = null;
  function moveGuides(x, y) {
    _lastXY = [x, y];
    if (_rafId) return;
    _rafId = requestAnimationFrame(() => {
      const els = ensureLayers();
      if (els.gLine) els.gLine.style.top = Math.max(0, _lastXY[1]) + 'px';
      if (els.gBar) {
        const b = sizeVars().band;
        els.gBar.style.top = Math.max(0, _lastXY[1] - b / 2) + 'px';
      }
      const root = document.documentElement;
      root.style.setProperty('--gx', _lastXY[0] + 'px');
      root.style.setProperty('--gy', _lastXY[1] + 'px');
      _rafId = null;
    });
  }

  // Colors
  // Start empty; DO NOT set defaults anywhere (including reset)
  state.colors = state.colors || {}; // keys: text, link, heading, selectionBg, selectionText

  function applyUserColors() {
    const c = state.colors || {};
    const root = document.documentElement;
    const scope = document.getElementById('aw-scope') || document.body;

    const setOrClear = (cssVar, val) => {
      if (val && val !== 'none') root.style.setProperty(cssVar, val);
      else root.style.removeProperty(cssVar);
    };

    // Set/clear vars
    setOrClear('--aw-user-text', c.text);
    setOrClear('--aw-user-link', c.link);
    setOrClear('--aw-user-heading', c.heading);
    setOrClear('--aw-user-selection-bg', c.selectionBg);
    setOrClear('--aw-user-selection-text', c.selectionText);

    // Per-feature gates
    scope.classList.toggle('aw-has-text', !!(c.text && c.text !== 'none'));
    scope.classList.toggle('aw-has-link', !!(c.link && c.link !== 'none'));
    scope.classList.toggle(
      'aw-has-heading',
      !!(c.heading && c.heading !== 'none'),
    );

    const hasSel =
      (c.selectionBg && c.selectionBg !== 'none') ||
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
        state.colors[key] = val; // 'none' clears, hex sets
        applyUserColors();
        save();
        // pressed state
        Array.from(wrap.children).forEach((el) =>
          el.setAttribute('aria-pressed', 'false'),
        );
        b.setAttribute('aria-pressed', 'true');
      });
      return b;
    };

    items.forEach((v) => wrap.appendChild(btnFor(v)));

    // Initial visual selection = 'none' (but no CSS applied yet)
    const current = (state.colors?.[key] ?? 'none').toLowerCase();
    Array.from(wrap.children).forEach((c) =>
      c.setAttribute(
        'aria-pressed',
        (c.dataset.color || '').toLowerCase() === current ? 'true' : 'false',
      ),
    );
  }

  // Example init (all palettes start with 'none')
  function initSwatches() {
    renderSwatches(
      'swatch-text',
      [
        '#111827',
        '#f9fafb',
        '#e11d48',
        '#22c55e',
        '#eab308',
        '#06b6d4',
        '#a78bfa',
        '#f97316',
      ],
      'text',
    );

    renderSwatches(
      'swatch-link',
      ['#2563eb', '#7aa8ff', '#22c55e', '#e11d48', '#a78bfa', '#f59e0b'],
      'link',
    );

    renderSwatches(
      'swatch-heading',
      [
        '#111827',
        '#1f2937',
        '#0f172a',
        '#7aa8ff',
        '#22c55e',
        '#e11d48',
        '#a78bfa',
        '#f59e0b',
      ],
      'heading',
    );

    renderSwatches(
      'swatch-selection-bg',
      [
        '#bde0fe',
        '#a7f3d0',
        '#fde68a',
        '#fecaca',
        '#ddd6fe',
        '#fbcfe8',
        '#fef3c7',
        '#d1fae5',
      ],
      'selectionBg',
    );

    renderSwatches(
      'swatch-selection-text',
      ['#111827', '#000000', '#ffffff', '#1f2937', '#0b1220'],
      'selectionText',
    );
  }

  // Screen Reader + Speech
  const SR = {
    enabled: false,
    utter: null,
    speak(txt) {
      if (!window.speechSynthesis || !txt) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        String(txt).replace(/\s+/g, ' ').trim(),
      );
      try {
        const voices = window.speechSynthesis.getVoices();
        const code =
          document.documentElement.getAttribute('lang') ||
          navigator.language ||
          'en-US';
        const v = voices.find(
          (v) => v.lang && v.lang.toLowerCase().startsWith(code.toLowerCase()),
        );
        if (v) u.voice = v;
      } catch {}
      this.utter = u;
      window.speechSynthesis.speak(u);
    },
    stop() {
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    },
    onFocus(e) {
      if (!SR.enabled) return;
      const el = e.target;
      let label = el.getAttribute?.('aria-label') || '';
      const lb = el.getAttribute?.('aria-labelledby');
      if (lb) {
        const ids = lb.split(' ');
        ids.forEach((id) => {
          const ref = document.getElementById(id);
          if (ref)
            label =
              (label ? label + ' ' : '') +
              (ref.innerText || ref.textContent || '');
        });
      }
      const role = el.getAttribute?.('role') || el.tagName;
      const txt = (
        label ||
        el.innerText ||
        el.value ||
        el.textContent ||
        ''
      ).trim();
      SR.speak((txt ? txt + '. ' : '') + role.replace(/[-_]/g, ' '));
    },
    onClick(e) {
      if (!SR.enabled) return;
      const el = e.target.closest('button,a,[role="button"],[role="link"]');
      if (el) {
        const name =
          el.getAttribute('aria-label') || el.innerText || el.textContent;
        SR.speak((name || 'Activated') + '.');
      }
    },
    start() {
      if (this.enabled) return;
      this.enabled = true;
      document.addEventListener('focusin', SR.onFocus, true);
      document.addEventListener('click', SR.onClick, true);
      setStatus('Screen Reader ON');
    },
    stopAll() {
      this.enabled = false;
      document.removeEventListener('focusin', SR.onFocus, true);
      document.removeEventListener('click', SR.onClick, true);
      this.stop();
      setStatus('Screen Reader OFF');
    },
  };

  // Dictation
  let rec = null;
  let recActive = false;
  function dictateToggle() {
    if (recActive) {
      try {
        rec.stop();
      } catch {}
      recActive = false;
      state.dictating = false;
      setStatus('Dictation stopped');
      syncDictationTile();
      return;
    }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) {
      setStatus('Speech recognition not supported');
      return;
    }
    rec = new R();
    rec.lang = navigator.language || 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      const el = document.activeElement;
      if (!el) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        const pos = start + text.length;
        el.setSelectionRange(pos, pos);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (el.isContentEditable) {
        // insertText via Selection API (execCommand is deprecated)
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    };
    rec.onstart = () => {
      recActive = true;
      state.dictating = true;
      setStatus('Dictating…');
      syncDictationTile();
    };
    rec.onend = () => {
      recActive = false;
      state.dictating = false;
      setStatus('Dictation ended');
      syncDictationTile();
    };
    try {
      rec.start();
    } catch (err) {
      setStatus('Mic error');
    }
  }

  function syncDictationTile() {
    const tile = document.querySelector('.aw-tile[data-action="dictate"]');
    if (tile) tile.setAttribute('aria-pressed', String(!!state.dictating));
  }

  // AW Own-Size Font Booster (v2: robust reset)
  const BOOST_ATTR = 'data-aw-fb-delta';
  const ORIG_PX_ATTR = 'data-aw-fb-origpx';
  const ORIG_INLINE_ATTR = 'data-aw-fb-originline';
  const SKIP_ROOT_SEL = '#aw-root';

  // Reasonable target set; extend if you need more tags
  const TAGS = new Set([
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'P',
    'SPAN',
    'LI',
    'A',
    'LABEL',
    'BUTTON',
    'TD',
    'TH',
    'DIV',
    'SMALL',
    'EM',
    'STRONG',
    'B',
    'I',
    'CODE',
    'FIGCAPTION',
    'CAPTION',
  ]);

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
    el.style.setProperty(
      'font-size',
      Math.max(1, Math.round(px)) + 'px',
      'important',
    );
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
    const tw = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
    );
    let n,
      count = 0;
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
      touched.get(el)?.origInline ??
      null ??
      (el.hasAttribute(ORIG_INLINE_ATTR)
        ? el.getAttribute(ORIG_INLINE_ATTR)
        : null);

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
    if (mo) {
      mo.disconnect();
      mo = null;
    }

    for (const el of Array.from(touched.keys())) {
      if (el.isConnected) resetOne(el);
      else touched.delete(el);
    }

    document
      .querySelectorAll(
        `[${BOOST_ATTR}], [${ORIG_PX_ATTR}], [${ORIG_INLINE_ATTR}]`,
      )
      .forEach(resetOne);

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
      if (!Number.isFinite(deltaPx) || deltaPx <= 0) {
        this.reset();
        return;
      }
      applyDelta(deltaPx);
      startObserver(deltaPx);
    },
    reset() {
      resetAll();
    },
  };

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
    document.body.classList.toggle(
      'aw-highlight-links',
      !!state.highlightLinks,
    );
    document.body.classList.toggle('aw-dyslexic', !!state.dyslexic);
    document.body.classList.toggle('aw-focusmode', !!state.focusmode);

    // Build combined filter string
    const contrast =
      state.contrastPlus === 1
        ? 'invert(1) hue-rotate(180deg)'
        : state.contrastPlus === 2
          ? 'contrast(1.2) brightness(.9)'
          : state.contrastPlus === 3
            ? 'contrast(1.1) brightness(1.1)'
            : '';

    const saturation =
      ['', 'grayscale(1)', 'saturate(.5)', 'saturate(1.6)'][state.saturation] ||
      '';
    const combinedFilter =
      [contrast, saturation].filter(Boolean).join(' ') || 'none';

    // Apply filter **directly** to the scoped container
    scope.style.filter = combinedFilter;

    // Optionally toggle the filter class
    if (combinedFilter !== 'none') {
      scope.classList.add('aw-filter-scope');
    } else {
      scope.classList.remove('aw-filter-scope');
    }

    const satMap = [
      'saturate(1)',
      'grayscale(1)',
      'saturate(.5)',
      'saturate(1.6)',
    ];
    document.documentElement.style.setProperty(
      '--aw-sat-filter',
      satMap[state.saturation] || 'saturate(1)',
    );

    // Map each alignment state to its corresponding class + icon
    const alignCycleOrder = [
      '',
      'aw-align-left',
      'aw-align-center',
      'aw-align-right',
    ];
    const alignMap = {
      '': "<path fill='currentColor' d='M4 6h16v2H4Zm0 4h12v2H4Zm0 4h16v2H4Zm0 4h10v2H4Z'/>",
      'aw-align-left':
        "<path fill='currentColor' d='M4 6h10v2H4Zm0 4h16v2H4Zm0 4h10v2H4Zm0 4h16v2H4Z'/>",
      'aw-align-center': `
        <line x1="21" y1="6" x2="3" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="19" y1="10" x2="5" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="21" y1="14" x2="3" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="19" y1="18" x2="5" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `,
      'aw-align-right': `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 10H21M3 14H21M8 18H21M3 6H21"/>`,
    };

    // Get the tile
    const tile = document.querySelector('.aw-tile[data-cycle="align"]');
    if (!tile) throw new Error('Tile not found!');

    // Update alignment
    function updateAlignment(className) {
      // Remove all alignment classes (exclude default '')
      document.body.classList.remove(...alignCycleOrder.filter((c) => c));

      // Add new class if exists
      if (className) document.body.classList.add(className);

      // Update SVG
      const svg = tile.querySelector('.aw-tile-head svg');
      if (svg) svg.innerHTML = alignMap[className];

      // Store current index
      tile.dataset.alignIdx = alignCycleOrder.indexOf(className);
    }

    // Click to cycle
    tile.addEventListener('click', () => {
      let idx = Number(tile.dataset.alignIdx);
      idx = isNaN(idx) ? 0 : idx;

      // Cycle to next
      idx = (idx + 1) % alignCycleOrder.length;
      const className = alignCycleOrder[idx];

      updateAlignment(className);
    });

    // Initialize
    updateAlignment('');

    // Letter spacing
    const lsMap = [0, 0.02, 0.05]; // em
    const ls = lsMap[state.letterLevel || 0];

    // If 0: remove everything so the site’s original spacing remains untouched
    if (!ls) {
      scope.classList.remove('aw-letter-wide');
      document.documentElement.style.removeProperty('--aw-letter-spacing');
    } else {
      document.documentElement.style.setProperty(
        '--aw-letter-spacing',
        ls + 'em',
      );
      const isRTL =
        (document.documentElement.getAttribute('dir') || '').toLowerCase() ===
        'rtl';
      scope.classList.toggle('aw-letter-wide', !isRTL);
    }

    // Define cursor types and corresponding icons + optional titles
    const cursorMap = [
      {
        class: '',
        icon: `<path d="M1 2L2 1L14 5V7L10.0102 8.59595L14.7071 13.2929L13.2929 14.7071L8.59594 10.0102L7 14H5L1 2Z" fill="currentColor"></path>`,
        title: 'Default Cursor',
      },
      {
        class: 'aw-cursor-big',
        icon: `<circle cx="12" cy="12" r="4" fill="currentColor"></circle>`,
        title: 'Dot Cursor',
      },
      {
        class: 'aw-cursor-cross',
        icon: `<path d="M4 12H20M12 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`,
        title: 'Cross Cursor',
      },
    ];

    const cursorTile = document.querySelector(
      '.aw-tile[data-cycle="cursorIdx"]',
    );
    if (cursorTile) {
      const head = cursorTile.querySelector('.aw-tile-head');

      // Use existing SVG if present, otherwise create one
      let svg = head.querySelector('svg.aw-ico');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('aw-ico');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        head.prepend(svg);
      }

      let idx = Number(cursorTile.dataset.cursorIdx) || 0;

      function updateCursor(idx) {
        // Update body class
        document.body.classList.remove(
          ...cursorMap.map((c) => c.class).filter(Boolean),
        );
        if (cursorMap[idx].class)
          document.body.classList.add(cursorMap[idx].class);

        // Update SVG icon
        svg.innerHTML = cursorMap[idx].icon;

        // Update aria-pressed
        cursorTile.setAttribute('aria-pressed', idx > 0 ? 'true' : 'false');

        // Update data attribute
        cursorTile.dataset.cursorIdx = idx;

        // Update steps indicator if present
        const stepsEl = cursorTile.querySelectorAll('.aw-step');
        stepsEl.forEach((s, i) => s.classList.toggle('on', i <= idx));
      }

      // Initialize
      updateCursor(idx);

      // Cycle on click
      cursorTile.addEventListener('click', () => {
        const steps = Number(cursorTile.dataset.steps) || cursorMap.length - 1;
        idx = (idx + 1) % (steps + 1);
        updateCursor(idx);
      });
    }

    const panel = document.getElementById('aw-panel');
    const fab = document.getElementById('aw-fab');
    if (panel && fab) {
      if (state.side === 'left') {
        panel.style.left = '0px';
        panel.style.right = 'auto';
        fab.style.left = '16px';
        fab.style.right = 'auto';
      } else {
        panel.style.right = '0px';
        panel.style.left = 'auto';
        fab.style.right = '16px';
        fab.style.left = 'auto';
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
    if (state.screenReader) SR.start();
    else SR.stopAll();

    syncToggleTiles();
    syncCycleTiles();
  }

  // Profiles
  const profileSnapshots = {};
  function toggleProfile(id) {
    if (
      ![
        'blind',
        'colorblind',
        'dyslexia',
        'lowvision',
        'adhd',
        'seizure',
      ].includes(id)
    )
      return;
    const active = state.profiles[id];
    if (active) {
      const snap = profileSnapshots[id];
      if (snap) {
        Object.assign(state, JSON.parse(JSON.stringify(snap)));
      }
      state.profiles[id] = false;
      if (id === 'blind') {
        state.screenReader = false;
        SR.stopAll();
      }
      setStatus(id + ' profile off');
    } else {
      profileSnapshots[id] = JSON.parse(JSON.stringify(state));
      if (id === 'blind') {
        state.screenReader = true;
        SR.start();
      }
      if (id === 'colorblind') {
        state.saturation = Math.max(state.saturation, 1);
        state.highlight = true;
        state.highlightLinks = true;
      }
      if (id === 'dyslexia') {
        state.dyslexic = true;
        state.letterLevel = 2;
        state.align = 0;
        state.fontLevel = Math.max(state.fontLevel, 2);
      }
      if (id === 'lowvision') {
        state.fontLevel = 3;
        state.letterLevel = 2;
        state.contrastPlus = 2;
        state.cursorIdx = 1;
        state.highlight = true;
        state.highlightLinks = true;
      }
      if (id === 'adhd') {
        state.focusmode = true;
        state.cursorGuideMode = 3;
        state.cursorGuideSize = 1;
        state.cursorGuideOpacity = 0;
      }
      if (id === 'seizure') {
        state.noanim = true;
        state.contrastPlus = Math.max(state.contrastPlus, 2);
      }
      state.profiles[id] = true;
      setStatus(id + ' profile on');
    }
    apply();
    save();
    initSwatches();
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
  function speakSelection() {
    if (!window.speechSynthesis) {
      setStatus('Speech not supported');
      return;
    }
    const sel = window.getSelection();
    const text = sel && sel.toString().trim();
    if (!text) return setStatus('Select text first');
    SR.speak(text);
  }

  function initEvents() {
    document.addEventListener(
      'mousemove',
      (e) => {
        if (state.ruler) {
          const r = document.getElementById('aw-ruler');
          if (r) r.style.top = Math.max(0, e.clientY - 22) + 'px';
        }
        if (state.cursorGuideMode > 0) moveGuides(e.clientX, e.clientY);
      },
      { passive: true },
    );

    document.addEventListener(
      'click',
      (e) => {
        const tEl = e.target.closest(
          '.aw-tile, [data-action], .aw-close, .aw-langopt',
        );
        if (!tEl) return;

        if (tEl.classList.contains('aw-langopt')) {
          const code = tEl.dataset.lang || 'auto';
          try {
            localStorage.setItem(LANG_KEY, code);
          } catch {}
          applyI18n();
          return;
        }
        if (tEl.classList.contains('aw-close')) {
          closePanel();
          return;
        }

        if (tEl.classList.contains('aw-tile')) {
          e.preventDefault();

          if (tEl.dataset.profile) {
            toggleProfile(tEl.dataset.profile);
            return;
          }

          if (tEl.hasAttribute('data-cycle')) {
            const key = tEl.dataset.cycle;
            const steps = Number(tEl.dataset.steps) || 1;
            state[key] = (Number(state[key] || 0) + 1) % (steps + 1);
            apply();
            save();
            return;
          }

          if (tEl.hasAttribute('data-toggle')) {
            const key = tEl.dataset.toggle;
            if (key === 'screenReader') {
              state.screenReader = !state.screenReader;
              if (state.screenReader) SR.start();
              else SR.stopAll();
              apply();
              save();
              return;
            }
            state[key] = !state[key];
            if (key === 'ruler') {
              document
                .getElementById('aw-ruler')
                ?.classList.toggle('aw-on', state[key]);
            }
            if (key === 'focusmode') {
              document
                .getElementById('aw-focus')
                ?.classList.toggle('aw-on', state[key]);
            }
            apply();
            save();
            return;
          }
        }

        const action = tEl.getAttribute('data-action');
        if (action === 'dictate') {
          dictateToggle();
        } else if (action === 'read') {
          speakSelection();
        } else if (action === 'stop') {
          SR.stop();
          setStatus('Stopped');
        } else if (action === 'reset') {
          document.documentElement.style.setProperty(
            '--aw-contrast-filter',
            '',
          );
          document.documentElement.style.setProperty(
            '--aw-sat-filter',
            'saturate(1)',
          );
          const sideKeep = state.side;
          Object.assign(state, {
            fontLevel: 0,
            letterLevel: 0,
            align: 0,
            cursorIdx: 0,
            noanim: false,
            hideimgs: false,
            highlight: false,
            highlightLinks: false,
            dyslexic: false,
            ruler: false,
            focusmode: false,
            contrastPlus: 0,
            saturation: 0,
            cursorGuideMode: 0,
            cursorGuideSize: 1,
            cursorGuideOpacity: 1,
            side: sideKeep || 'right',
            dictating: false,
            screenReader: false,
            colors: { text: '#f9fafb', link: '#7aa8ff' },
            profiles: {
              blind: false,
              colorblind: false,
              dyslexia: false,
              lowvision: false,
              adhd: false,
              seizure: false,
            },
          });
          document.getElementById('aw-ruler')?.classList.remove('aw-on');
          document.getElementById('aw-focus')?.classList.remove('aw-on');
          try {
            if (recActive) dictateToggle();
          } catch {}
          SR.stopAll();
          apply();
          save();
          initSwatches();
          setStatus('All settings reset');
        }
      },
      true,
    );

    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (
        t?.classList?.contains('aw-tile') &&
        (e.key === ' ' || e.key === 'Enter')
      ) {
        e.preventDefault();
        t.click();
      }
      if (
        t?.classList?.contains('aw-tile') &&
        t.hasAttribute('data-cycle') &&
        (e.key === 'ArrowRight' || e.key === 'ArrowLeft')
      ) {
        e.preventDefault();
        const key = t.dataset.cycle;
        const steps = Number(t.dataset.steps) || 1;
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const cur = Number(state[key] || 0);
        state[key] = (cur + steps + delta) % (steps + 1);
        apply();
        save();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        togglePanel();
      }
      if (e.key === 'Escape') {
        closePanel();
      }
    });

    document.getElementById('aw-fab')?.addEventListener('click', () => {
      const p = document.getElementById('aw-panel');
      const opening = !p.classList.contains('aw-open');
      opening ? openPanel() : closePanel();
    });

    document
      .getElementById('aw-close')
      ?.addEventListener('click', () => closePanel());
    // Function to handle toggle clicks
    document
      .querySelectorAll('.toggle-group[data-type="position"] .toggle-btn')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value;

          // Update state
          state.side = value;

          // Save to localStorage
          try {
            localStorage.setItem(SIDE_KEY, state.side);
          } catch {}

          // Update active button styling
          const group = btn.closest('.toggle-group');
          group
            .querySelectorAll('.toggle-btn')
            .forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          // Apply changes
          apply();
          save();
        });
      });

    initThemeUI();
  }

  function togglePanel() {
    const p = document.getElementById('aw-panel');
    const opening = !p.classList.contains('aw-open');
    opening ? openPanel() : closePanel();
  }

  // Icons (same SVGs – injected based on data-* attributes)
  const ICONS = {
    blind:
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><mask id='mask0_1386_15203' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'><rect width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15203)'><path d='M5.42504 14H7.65004C7.88337 14 8.09171 13.9292 8.27504 13.7875C8.45837 13.6458 8.57504 13.4667 8.62504 13.25L9.40004 10.225C8.95004 10.1417 8.44171 10.0875 7.87504 10.0625C7.30837 10.0375 6.79171 10.025 6.32504 10.025C5.94171 10.025 5.52921 10.0292 5.08754 10.0375C4.64587 10.0458 4.23337 10.0667 3.85004 10.1L4.45004 13.2C4.50004 13.4333 4.61671 13.625 4.80004 13.775C4.98337 13.925 5.19171 14 5.42504 14ZM5.45004 16C4.75004 16 4.12087 15.775 3.56254 15.325C3.00421 14.875 2.65004 14.3 2.50004 13.6L1.77504 10.25H1.65004C1.36671 10.2667 1.12921 10.1875 0.937541 10.0125C0.745874 9.8375 0.633374 9.60833 0.600041 9.325C0.566708 9.04167 0.637541 8.8 0.812541 8.6C0.987541 8.4 1.21671 8.28333 1.50004 8.25L1.95004 8.2C2.86671 8.11667 3.67921 8.0625 4.38754 8.0375C5.09587 8.0125 5.74171 8 6.32504 8C7.40837 8 8.28338 8.05 8.95004 8.15C9.61671 8.25 10.2167 8.425 10.75 8.675C10.9834 8.79167 11.2042 8.875 11.4125 8.925C11.6209 8.975 11.8167 9 12 9C12.1834 9 12.3625 8.975 12.5375 8.925C12.7125 8.875 12.9167 8.8 13.15 8.7C13.7 8.45 14.3334 8.27083 15.05 8.1625C15.7667 8.05417 16.7167 8 17.9 8C18.3834 8 18.8959 8.0125 19.4375 8.0375C19.9792 8.0625 20.5584 8.09167 21.175 8.125L22.5 8.225C22.7834 8.25833 23.0125 8.375 23.1875 8.575C23.3625 8.775 23.4334 9.01667 23.4 9.3C23.3667 9.58333 23.2542 9.8125 23.0625 9.9875C22.8709 10.1625 22.6334 10.2333 22.35 10.2H22.25L21.9 11.825C21.8167 12.1583 21.6584 12.3792 21.425 12.4875C21.1917 12.5958 20.95 12.625 20.7 12.575C20.45 12.525 20.2417 12.3958 20.075 12.1875C19.9084 11.9792 19.8584 11.7167 19.925 11.4L20.2 10.075C19.8667 10.0583 19.4834 10.0458 19.05 10.0375C18.6167 10.0292 18.2334 10.025 17.9 10.025C17.4 10.025 16.8459 10.0375 16.2375 10.0625C15.6292 10.0875 15.0834 10.1417 14.6 10.225L15.225 12.65C15.3084 12.9667 15.2667 13.2292 15.1 13.4375C14.9334 13.6458 14.7334 13.7833 14.5 13.85C14.2667 13.9167 14.0292 13.8958 13.7875 13.7875C13.5459 13.6792 13.3834 13.4583 13.3 13.125L12.775 11.05H11.25L10.575 13.725C10.3917 14.4083 10.0334 14.9583 9.50004 15.375C8.96671 15.7917 8.35837 16 7.67504 16H5.45004ZM18.5 20C18.2834 20 18.1042 19.9292 17.9625 19.7875C17.8209 19.6458 17.75 19.4667 17.75 19.25V14.75C17.75 14.5333 17.8209 14.3542 17.9625 14.2125C18.1042 14.0708 18.2834 14 18.5 14C18.7167 14 18.8959 14.0708 19.0375 14.2125C19.1792 14.3542 19.25 14.5333 19.25 14.75V19.25C19.25 19.4667 19.1792 19.6458 19.0375 19.7875C18.8959 19.9292 18.7167 20 18.5 20ZM15.75 18.5C15.5334 18.5 15.3542 18.4292 15.2125 18.2875C15.0709 18.1458 15 17.9667 15 17.75V16.25C15 16.0333 15.0709 15.8542 15.2125 15.7125C15.3542 15.5708 15.5334 15.5 15.75 15.5C15.9667 15.5 16.1459 15.5708 16.2875 15.7125C16.4292 15.8542 16.5 16.0333 16.5 16.25V17.75C16.5 17.9667 16.4292 18.1458 16.2875 18.2875C16.1459 18.4292 15.9667 18.5 15.75 18.5ZM21.25 18.5C21.0334 18.5 20.8542 18.4292 20.7125 18.2875C20.5709 18.1458 20.5 17.9667 20.5 17.75V16.25C20.5 16.0333 20.5709 15.8542 20.7125 15.7125C20.8542 15.5708 21.0334 15.5 21.25 15.5C21.4667 15.5 21.6459 15.5708 21.7875 15.7125C21.9292 15.8542 22 16.0333 22 16.25V17.75C22 17.9667 21.9292 18.1458 21.7875 18.2875C21.6459 18.4292 21.4667 18.5 21.25 18.5Z' fill='#04182B'/></g></svg>",
    colorblind:
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><mask id='mask0_1386_15117' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'><rect width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15117)'><path d='M16.1 8.67502L18.6 6.32502L17.675 5.40002L15.275 7.80002L16.1 8.67502ZM15 21C15.95 21 16.8458 20.7834 17.6875 20.35C18.5292 19.9167 19.2167 19.3 19.75 18.5C19.2167 17.7 18.5292 17.0834 17.6875 16.65C16.8458 16.2167 15.95 16 15 16C14.05 16 13.1542 16.2167 12.3125 16.65C11.4708 17.0834 10.7833 17.7 10.25 18.5C10.7833 19.3 11.4708 19.9167 12.3125 20.35C13.1542 20.7834 14.05 21 15 21ZM15 20C14.5833 20 14.2292 19.8542 13.9375 19.5625C13.6458 19.2709 13.5 18.9167 13.5 18.5C13.5 18.0834 13.6458 17.7292 13.9375 17.4375C14.2292 17.1459 14.5833 17 15 17C15.4167 17 15.7708 17.1459 16.0625 17.4375C16.3542 17.7292 16.5 18.0834 16.5 18.5C16.5 18.9167 16.3542 19.2709 16.0625 19.5625C15.7708 19.8542 15.4167 20 15 20ZM15 23C13.6833 23 12.4542 22.7 11.3125 22.1C10.1708 21.5 9.25 20.65 8.55 19.55C8.45 19.4 8.375 19.2375 8.325 19.0625C8.275 18.8875 8.25 18.7084 8.25 18.525C8.25 18.3417 8.275 18.1584 8.325 17.975C8.375 17.7917 8.45 17.6167 8.55 17.45C9.25 16.35 10.1708 15.5 11.3125 14.9C12.4542 14.3 13.6833 14 15 14C16.3167 14 17.5458 14.3 18.6875 14.9C19.8292 15.5 20.75 16.35 21.45 17.45C21.55 17.6167 21.625 17.7875 21.675 17.9625C21.725 18.1375 21.75 18.3167 21.75 18.5C21.75 18.6834 21.725 18.8625 21.675 19.0375C21.625 19.2125 21.55 19.3834 21.45 19.55C20.75 20.65 19.8292 21.5 18.6875 22.1C17.5458 22.7 16.3167 23 15 23ZM4 21C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5209 3 20.2834 3 20V17.075C3 16.8084 3.05 16.55 3.15 16.3C3.25 16.05 3.39167 15.8334 3.575 15.65L11.925 7.32502L11.225 6.60002C11.025 6.40002 10.925 6.16669 10.925 5.90002C10.925 5.63336 11.025 5.40002 11.225 5.20002C11.425 5.00002 11.6583 4.90419 11.925 4.91252C12.1917 4.92086 12.425 5.01669 12.625 5.20002L13.85 6.40002L16.95 3.30002C17.0333 3.21669 17.1375 3.15002 17.2625 3.10002C17.3875 3.05002 17.5167 3.02502 17.65 3.02502C17.7833 3.02502 17.9083 3.05002 18.025 3.10002C18.1417 3.15002 18.25 3.21669 18.35 3.30002L20.7 5.65002C20.7833 5.75002 20.85 5.85836 20.9 5.97502C20.95 6.09169 20.975 6.21669 20.975 6.35002C20.975 6.48336 20.95 6.61252 20.9 6.73752C20.85 6.86252 20.7833 6.96669 20.7 7.05002L17.6 10.15L18.3 10.875C18.4833 11.075 18.5792 11.3125 18.5875 11.5875C18.5958 11.8625 18.5 12.1 18.3 12.3C18.1 12.5 17.8625 12.6 17.5875 12.6C17.3125 12.6 17.075 12.5 16.875 12.3L13.35 8.75002L5 17.075V19H6.2C6.48333 19 6.72083 19.0959 6.9125 19.2875C7.10417 19.4792 7.2 19.7167 7.2 20C7.2 20.2834 7.10417 20.5209 6.9125 20.7125C6.72083 20.9042 6.48333 21 6.2 21H4Z' fill='#04182B'/></g></svg>",
    dyslexia:
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><mask id='mask0_1386_15139' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'><rect width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15139)'><path d='M14.0999 19.2L19.0499 14.25C19.2333 14.0667 19.4666 13.975 19.7499 13.975C20.0333 13.975 20.2666 14.0667 20.4499 14.25C20.6333 14.4333 20.7249 14.6667 20.7249 14.95C20.7249 15.2333 20.6333 15.4667 20.4499 15.65L15.5249 20.575C15.3249 20.775 15.0999 20.925 14.8499 21.025C14.5999 21.125 14.3499 21.175 14.0999 21.175C13.8499 21.175 13.5999 21.125 13.3499 21.025C13.0999 20.925 12.8749 20.775 12.6749 20.575L10.5499 18.45C10.3666 18.2667 10.2749 18.0333 10.2749 17.75C10.2749 17.4667 10.3666 17.2333 10.5499 17.05C10.7333 16.8667 10.9666 16.775 11.2499 16.775C11.5333 16.775 11.7666 16.8667 11.9499 17.05L14.0999 19.2ZM6.34995 12.7L5.42495 15.325C5.34161 15.525 5.21661 15.6875 5.04995 15.8125C4.88328 15.9375 4.69161 16 4.47495 16C4.10828 16 3.82495 15.85 3.62495 15.55C3.42495 15.25 3.39161 14.9333 3.52495 14.6L7.57495 3.725C7.65828 3.50833 7.79578 3.33333 7.98745 3.2C8.17911 3.06667 8.39161 3 8.62495 3H9.42495C9.65828 3 9.87078 3.06667 10.0624 3.2C10.2541 3.33333 10.3916 3.50833 10.4749 3.725L14.5249 14.575C14.6583 14.925 14.6208 15.25 14.4124 15.55C14.2041 15.85 13.9083 16 13.5249 16C13.2916 16 13.0833 15.9333 12.8999 15.8C12.7166 15.6667 12.5833 15.4917 12.4999 15.275L11.5999 12.7H6.34995ZM7.04995 10.8H10.9499L9.04995 5.4H8.94995L7.04995 10.8Z' fill='#04182B'/></g></svg>",
    lowvision:
      "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'><path d='M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V8.875C18 9.15833 17.9042 9.39583 17.7125 9.5875C17.5208 9.77917 17.2833 9.875 17 9.875C16.7167 9.875 16.4792 9.77917 16.2875 9.5875C16.0958 9.39583 16 9.15833 16 8.875V6H9.75V9.5C9.75 10.05 9.55417 10.5208 9.1625 10.9125C8.77083 11.3042 8.3 11.5 7.75 11.5H2V16H3.625C3.90833 16 4.14583 16.0958 4.3375 16.2875C4.52917 16.4792 4.625 16.7167 4.625 17C4.625 17.2833 4.52917 17.5208 4.3375 17.7125C4.14583 17.9042 3.90833 18 3.625 18H2ZM2 9.5H7.75V6H2V9.5ZM2 4H16V2H2V4ZM13 20C11.6833 20 10.4542 19.7 9.3125 19.1C8.17083 18.5 7.25 17.65 6.55 16.55C6.45 16.4 6.375 16.2375 6.325 16.0625C6.275 15.8875 6.25 15.7083 6.25 15.525C6.25 15.3417 6.275 15.1583 6.325 14.975C6.375 14.7917 6.45 14.6167 6.55 14.45C7.25 13.35 8.17083 12.5 9.3125 11.9C10.4542 11.3 11.6833 11 13 11C14.3167 11 15.5458 11.3 16.6875 11.9C17.8292 12.5 18.75 13.35 19.45 14.45C19.55 14.6167 19.625 14.7875 19.675 14.9625C19.725 15.1375 19.75 15.3167 19.75 15.5C19.75 15.6833 19.725 15.8625 19.675 16.0375C19.625 16.2125 19.55 16.3833 19.45 16.55C18.75 17.65 17.8292 18.5 16.6875 19.1C15.5458 19.7 14.3167 20 13 20ZM13 18C13.95 18 14.8458 17.7833 15.6875 17.35C16.5292 16.9167 17.2167 16.3 17.75 15.5C17.2167 14.7 16.5292 14.0833 15.6875 13.65C14.8458 13.2167 13.95 13 13 13C12.05 13 11.1542 13.2167 10.3125 13.65C9.47083 14.0833 8.78333 14.7 8.25 15.5C8.78333 16.3 9.47083 16.9167 10.3125 17.35C11.1542 17.7833 12.05 18 13 18ZM13 17C12.5833 17 12.2292 16.8542 11.9375 16.5625C11.6458 16.2708 11.5 15.9167 11.5 15.5C11.5 15.0833 11.6458 14.7292 11.9375 14.4375C12.2292 14.1458 12.5833 14 13 14C13.4167 14 13.7708 14.1458 14.0625 14.4375C14.3542 14.7292 14.5 15.0833 14.5 15.5C14.5 15.9167 14.3542 16.2708 14.0625 16.5625C13.7708 16.8542 13.4167 17 13 17Z' fill='#04182B'/></svg>",
    adhd: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><mask id='mask0_1386_15223' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'><rect width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15223)'><path d='M6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.11667 14.2833 6.6375 14.0583 7.1625 13.875C7.6875 13.6917 8.21667 13.5333 8.75 13.4C9.13333 13.3167 9.50833 13.2417 9.875 13.175C10.2417 13.1083 10.6167 13.0583 11 13.025C11.2833 12.9917 11.5208 13.075 11.7125 13.275C11.9042 13.475 12 13.7167 12 14C12 14.2833 11.9042 14.5208 11.7125 14.7125C11.5208 14.9042 11.2833 15.0167 11 15.05C10.7 15.0833 10.4042 15.1167 10.1125 15.15C9.82083 15.1833 9.525 15.2417 9.225 15.325C8.75833 15.4417 8.3 15.5833 7.85 15.75C7.4 15.9167 6.95 16.1167 6.5 16.35C6.35 16.4333 6.22917 16.55 6.1375 16.7C6.04583 16.85 6 17.0167 6 17.2V18H11.45C11.7333 18 11.9708 18.0958 12.1625 18.2875C12.3542 18.4792 12.45 18.7167 12.45 19C12.45 19.2833 12.3542 19.5208 12.1625 19.7125C11.9708 19.9042 11.7333 20 11.45 20H6ZM14 14.625C14 14.4417 14.0458 14.2667 14.1375 14.1C14.2292 13.9333 14.3667 13.8083 14.55 13.725L17.55 12.225C17.6833 12.1417 17.8333 12.1 18 12.1C18.1667 12.1 18.3167 12.1417 18.45 12.225L21.45 13.725C21.6333 13.8083 21.7708 13.9333 21.8625 14.1C21.9542 14.2667 22 14.4417 22 14.625V16.55C22 17.7 21.7 18.7417 21.1 19.675C20.5 20.6083 19.6833 21.3167 18.65 21.8C18.55 21.85 18.4458 21.8833 18.3375 21.9C18.2292 21.9167 18.1167 21.925 18 21.925C17.8833 21.925 17.7708 21.9167 17.6625 21.9C17.5542 21.8833 17.45 21.85 17.35 21.8C16.3167 21.3167 15.5 20.6083 14.9 19.675C14.3 18.7417 14 17.7 14 16.55V14.625ZM18 19.9C18.6333 19.6 19.125 19.1417 19.475 18.525C19.825 17.9083 20 17.25 20 16.55V15.25L18 14.25L16 15.25V16.55C16 17.25 16.175 17.9083 16.525 18.525C16.875 19.1417 17.3667 19.6 18 19.9ZM12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM12 10C12.55 10 13.0208 9.80417 13.4125 9.4125C13.8042 9.02083 14 8.55 14 8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6C11.45 6 10.9792 6.19583 10.5875 6.5875C10.1958 6.97917 10 7.45 10 8C10 8.55 10.1958 9.02083 10.5875 9.4125C10.9792 9.80417 11.45 10 12 10Z' fill='#04182B'/></g></svg>",
    seizure:
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><mask id='mask0_1386_15228' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='24'><rect width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15228)'><path d='M11 20H4C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V10C22 10.2833 21.9042 10.5208 21.7125 10.7125C21.5208 10.9042 21.2833 11 21 11C20.7167 11 20.4792 10.9042 20.2875 10.7125C20.0958 10.5208 20 10.2833 20 10V6H4V18H11C11.2833 18 11.5208 18.0958 11.7125 18.2875C11.9042 18.4792 12 18.7167 12 19C12 19.2833 11.9042 19.5208 11.7125 19.7125C11.5208 19.9042 11.2833 20 11 20ZM9.5 15.125V8.875C9.5 8.575 9.62917 8.35417 9.8875 8.2125C10.1458 8.07083 10.4 8.08333 10.65 8.25L15.525 11.375C15.7583 11.525 15.875 11.7333 15.875 12C15.875 12.2667 15.7583 12.475 15.525 12.625L10.65 15.75C10.4 15.9167 10.1458 15.9292 9.8875 15.7875C9.62917 15.6458 9.5 15.425 9.5 15.125ZM17.775 22.6L17.55 21.5C17.35 21.4167 17.1625 21.3292 16.9875 21.2375C16.8125 21.1458 16.6333 21.0333 16.45 20.9L15.375 21.225C15.2583 21.2583 15.15 21.2542 15.05 21.2125C14.95 21.1708 14.8667 21.1 14.8 21L14.2 20C14.1333 19.9 14.1167 19.7917 14.15 19.675C14.1833 19.5583 14.2417 19.4583 14.325 19.375L15.15 18.65C15.1167 18.4167 15.1 18.2 15.1 18C15.1 17.8 15.1167 17.5833 15.15 17.35L14.325 16.625C14.2417 16.5417 14.1833 16.4417 14.15 16.325C14.1167 16.2083 14.1333 16.1 14.2 16L14.8 15C14.8667 14.9 14.95 14.8292 15.05 14.7875C15.15 14.7458 15.2583 14.7417 15.375 14.775L16.45 15.1C16.6333 14.9667 16.8125 14.8542 16.9875 14.7625C17.1625 14.6708 17.35 14.5833 17.55 14.5L17.775 13.4C17.8083 13.2833 17.8625 13.1875 17.9375 13.1125C18.0125 13.0375 18.1167 13 18.25 13H19.45C19.5833 13 19.6875 13.0375 19.7625 13.1125C19.8375 13.1875 19.8917 13.2833 19.925 13.4L20.15 14.5C20.35 14.5833 20.5375 14.675 20.7125 14.775C20.8875 14.875 21.0667 15 21.25 15.15L22.3 14.775C22.4167 14.7417 22.5292 14.7458 22.6375 14.7875C22.7458 14.8292 22.8333 14.9 22.9 15L23.5 16.05C23.5667 16.15 23.5875 16.2583 23.5625 16.375C23.5375 16.4917 23.4833 16.5917 23.4 16.675L22.55 17.4C22.5833 17.6 22.6 17.8083 22.6 18.025C22.6 18.2417 22.5833 18.45 22.55 18.65L23.375 19.375C23.4583 19.4583 23.5167 19.5583 23.55 19.675C23.5833 19.7917 23.5667 19.9 23.5 20L22.9 21C22.8333 21.1 22.75 21.1708 22.65 21.2125C22.55 21.2542 22.4417 21.2583 22.325 21.225L21.25 20.9C21.0667 21.0333 20.8875 21.1458 20.7125 21.2375C20.5375 21.3292 20.35 21.4167 20.15 21.5L19.925 22.6C19.8917 22.7167 19.8375 22.8125 19.7625 22.8875C19.6875 22.9625 19.5833 23 19.45 23H18.25C18.1167 23 18.0125 22.9625 17.9375 22.8875C17.8625 22.8125 17.8083 22.7167 17.775 22.6ZM18.85 20C19.4 20 19.8708 19.8042 20.2625 19.4125C20.6542 19.0208 20.85 18.55 20.85 18C20.85 17.45 20.6542 16.9792 20.2625 16.5875C19.8708 16.1958 19.4 16 18.85 16C18.3 16 17.8292 16.1958 17.4375 16.5875C17.0458 16.9792 16.85 17.45 16.85 18C16.85 18.55 17.0458 19.0208 17.4375 19.4125C17.8292 19.8042 18.3 20 18.85 20Z' fill='#04182B'/></g></svg>",
    contrastPlus:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1384_953' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1384_953)'><path d='M16.0001 29.3333C14.1556 29.3333 12.4223 28.9833 10.8001 28.2833C9.17786 27.5833 7.76675 26.6333 6.56675 25.4333C5.36675 24.2333 4.41675 22.8222 3.71675 21.2C3.01675 19.5777 2.66675 17.8444 2.66675 16C2.66675 14.1555 3.01675 12.4222 3.71675 10.8C4.41675 9.17774 5.36675 7.76663 6.56675 6.56663C7.76675 5.36663 9.17786 4.41663 10.8001 3.71663C12.4223 3.01663 14.1556 2.66663 16.0001 2.66663C17.8445 2.66663 19.5779 3.01663 21.2001 3.71663C22.8223 4.41663 24.2334 5.36663 25.4334 6.56663C26.6334 7.76663 27.5834 9.17774 28.2834 10.8C28.9834 12.4222 29.3334 14.1555 29.3334 16C29.3334 17.8444 28.9834 19.5777 28.2834 21.2C27.5834 22.8222 26.6334 24.2333 25.4334 25.4333C24.2334 26.6333 22.8223 27.5833 21.2001 28.2833C19.5779 28.9833 17.8445 29.3333 16.0001 29.3333ZM17.3334 26.5666C19.9779 26.2333 22.1945 25.0722 23.9834 23.0833C25.7723 21.0944 26.6667 18.7333 26.6667 16C26.6667 13.2666 25.7723 10.9055 23.9834 8.91663C22.1945 6.92774 19.9779 5.76663 17.3334 5.43329V26.5666Z' fill='currentColor'/></g></svg>",
    saturation:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><g><path d='M16 28C13.0444 28 10.5278 26.9722 8.44999 24.9167C6.37222 22.8611 5.33333 20.3778 5.33333 17.4667C5.33333 16 5.61111 14.6444 6.16666 13.4C6.72222 12.1555 7.48888 11.0444 8.46666 10.0667L14.6 4.03333C14.8 3.85555 15.0222 3.71666 15.2667 3.61666C15.5111 3.51666 15.7555 3.46666 16 3.46666C16.2444 3.46666 16.4889 3.51666 16.7333 3.61666C16.9778 3.71666 17.2 3.85555 17.4 4.03333L23.5333 10.0667C24.5111 11.0444 25.2778 12.1555 25.8333 13.4C26.3889 14.6444 26.6667 16 26.6667 17.4667C26.6667 20.3778 25.6278 22.8611 23.55 24.9167C21.4722 26.9722 18.9555 28 16 28ZM16 25.3333V6.39999L10.3333 12C9.55555 12.7333 8.97222 13.5611 8.58333 14.4833C8.19444 15.4055 7.99999 16.4 7.99999 17.4667C7.99999 19.6222 8.77777 21.4722 10.3333 23.0167C11.8889 24.5611 13.7778 25.3333 16 25.3333Z' fill='currentColor'/></g></svg>",
    noanim:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1384_1019' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1384_1019)'><path d='M13.3333 20C12.9555 20 12.6388 19.8722 12.3833 19.6166C12.1277 19.3611 11.9999 19.0444 11.9999 18.6666V13.3333C11.9999 12.9555 12.1277 12.6389 12.3833 12.3833C12.6388 12.1278 12.9555 12 13.3333 12C13.711 12 14.0277 12.1278 14.2833 12.3833C14.5388 12.6389 14.6666 12.9555 14.6666 13.3333V18.6666C14.6666 19.0444 14.5388 19.3611 14.2833 19.6166C14.0277 19.8722 13.711 20 13.3333 20ZM18.6666 20C18.2888 20 17.9721 19.8722 17.7166 19.6166C17.461 19.3611 17.3333 19.0444 17.3333 18.6666V13.3333C17.3333 12.9555 17.461 12.6389 17.7166 12.3833C17.9721 12.1278 18.2888 12 18.6666 12C19.0444 12 19.361 12.1278 19.6166 12.3833C19.8721 12.6389 19.9999 12.9555 19.9999 13.3333V18.6666C19.9999 19.0444 19.8721 19.3611 19.6166 19.6166C19.361 19.8722 19.0444 20 18.6666 20ZM15.9999 30.6666C13.5999 30.6666 11.3499 30.1166 9.24992 29.0166C7.14992 27.9166 5.39992 26.3778 3.99992 24.4V26.6666C3.99992 27.0444 3.87214 27.3611 3.61659 27.6166C3.36103 27.8722 3.04436 28 2.66659 28C2.28881 28 1.97214 27.8722 1.71659 27.6166C1.46103 27.3611 1.33325 27.0444 1.33325 26.6666V21.3333C1.33325 20.9555 1.46103 20.6389 1.71659 20.3833C1.97214 20.1278 2.28881 20 2.66659 20H7.99992C8.3777 20 8.69436 20.1278 8.94992 20.3833C9.20547 20.6389 9.33325 20.9555 9.33325 21.3333C9.33325 21.7111 9.20547 22.0278 8.94992 22.2833C8.69436 22.5389 8.3777 22.6666 7.99992 22.6666H6.06659C7.19992 24.3333 8.63881 25.6389 10.3833 26.5833C12.1277 27.5278 13.9999 28 15.9999 28C18.311 28 20.4221 27.4 22.3333 26.2C24.2444 25 25.711 23.3889 26.7333 21.3666C26.9333 20.9889 27.1944 20.6889 27.5166 20.4666C27.8388 20.2444 28.211 20.1778 28.6333 20.2666C29.0333 20.3555 29.2944 20.5833 29.4166 20.95C29.5388 21.3166 29.4999 21.7111 29.2999 22.1333C28.0999 24.7111 26.311 26.7778 23.9333 28.3333C21.5555 29.8889 18.911 30.6666 15.9999 30.6666ZM2.76659 14.6666C2.38881 14.6666 2.08325 14.5278 1.84992 14.25C1.61659 13.9722 1.53325 13.6444 1.59992 13.2666C1.82214 12.2222 2.11103 11.2611 2.46659 10.3833C2.82214 9.50554 3.29992 8.6222 3.89992 7.73331C4.12214 7.39998 4.41103 7.21109 4.76659 7.16665C5.12214 7.1222 5.44436 7.24443 5.73325 7.53331C6.04436 7.84443 6.19992 8.18331 6.19992 8.54998C6.19992 8.91665 6.0777 9.28887 5.83325 9.66665C5.45547 10.2444 5.15547 10.8222 4.93325 11.4C4.71103 11.9778 4.51103 12.6111 4.33325 13.3C4.24436 13.7 4.06103 14.0278 3.78325 14.2833C3.50547 14.5389 3.16659 14.6666 2.76659 14.6666ZM9.69992 5.83331C9.34436 6.07776 8.98325 6.18887 8.61658 6.16665C8.24992 6.14443 7.91103 5.97776 7.59992 5.66665C7.33325 5.39998 7.21659 5.09443 7.24992 4.74998C7.28325 4.40554 7.45547 4.11109 7.76659 3.86665C8.63325 3.28887 9.49436 2.81665 10.3499 2.44998C11.2055 2.08331 12.1555 1.79998 13.1999 1.59998C13.5999 1.53331 13.9444 1.61109 14.2333 1.83331C14.5221 2.05554 14.6666 2.35554 14.6666 2.73331C14.6666 3.15554 14.5388 3.49998 14.2833 3.76665C14.0277 4.03331 13.6888 4.21109 13.2666 4.29998C12.5999 4.45554 11.9833 4.65554 11.4166 4.89998C10.8499 5.14443 10.2777 5.45554 9.69992 5.83331ZM22.3333 5.79998C21.7555 5.4222 21.1777 5.1222 20.5999 4.89998C20.0221 4.67776 19.3888 4.47776 18.6999 4.29998C18.2999 4.21109 17.9721 4.02776 17.7166 3.74998C17.461 3.4722 17.3333 3.13331 17.3333 2.73331C17.3333 2.35554 17.4721 2.05554 17.7499 1.83331C18.0277 1.61109 18.3555 1.53331 18.7333 1.59998C19.7999 1.79998 20.7666 2.07776 21.6333 2.43331C22.4999 2.78887 23.3777 3.26665 24.2666 3.86665C24.5777 4.08887 24.7555 4.37776 24.7999 4.73331C24.8444 5.08887 24.7333 5.39998 24.4666 5.66665C24.1555 5.97776 23.811 6.13887 23.4333 6.14998C23.0555 6.16109 22.6888 6.04443 22.3333 5.79998ZM29.2666 14.6666C28.8444 14.6666 28.4999 14.5389 28.2333 14.2833C27.9666 14.0278 27.7888 13.6889 27.6999 13.2666C27.5221 12.5778 27.3166 11.95 27.0833 11.3833C26.8499 10.8166 26.5444 10.2333 26.1666 9.63331C25.9221 9.27776 25.811 8.91665 25.8333 8.54998C25.8555 8.18331 26.0221 7.84443 26.3333 7.53331C26.5999 7.26665 26.9055 7.15554 27.2499 7.19998C27.5944 7.24443 27.8888 7.4222 28.1333 7.73331C28.7333 8.6222 29.211 9.49998 29.5666 10.3666C29.9221 11.2333 30.1999 12.2 30.3999 13.2666C30.4666 13.6444 30.3888 13.9722 30.1666 14.25C29.9444 14.5278 29.6444 14.6666 29.2666 14.6666Z' fill='currentColor'/></g></svg>",
    hideimgs:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1384_1031' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1384_1031)'><path d='M28 6.66667V21.3333C28 21.7778 27.8611 22.1111 27.5833 22.3333C27.3056 22.5556 27 22.6667 26.6667 22.6667C26.3333 22.6667 26.0278 22.55 25.75 22.3167C25.4722 22.0833 25.3333 21.7444 25.3333 21.3V6.66667H10.6667C10.2222 6.66667 9.88891 6.52778 9.66668 6.25C9.44446 5.97222 9.33335 5.66667 9.33335 5.33333C9.33335 5 9.44446 4.69444 9.66668 4.41667C9.88891 4.13889 10.2222 4 10.6667 4H25.3333C26.0667 4 26.6945 4.26111 27.2167 4.78333C27.7389 5.30556 28 5.93333 28 6.66667ZM6.66668 28C5.93335 28 5.30557 27.7389 4.78335 27.2167C4.26113 26.6944 4.00002 26.0667 4.00002 25.3333V7.73333L2.80002 6.53333C2.55557 6.28889 2.43335 5.97778 2.43335 5.6C2.43335 5.22222 2.55557 4.91111 2.80002 4.66667C3.04446 4.42222 3.35557 4.3 3.73335 4.3C4.11113 4.3 4.42224 4.42222 4.66668 4.66667L27.3333 27.3333C27.5778 27.5778 27.7 27.8889 27.7 28.2667C27.7 28.6444 27.5778 28.9556 27.3333 29.2C27.0889 29.4444 26.7778 29.5667 26.4 29.5667C26.0222 29.5667 25.7111 29.4444 25.4667 29.2L24.2667 28H6.66668ZM18.9 22.6667H9.33335C9.06668 22.6667 8.86668 22.5444 8.73335 22.3C8.60002 22.0556 8.62224 21.8222 8.80002 21.6L11.4667 18.0333C11.6 17.8556 11.7778 17.7667 12 17.7667C12.2222 17.7667 12.4 17.8556 12.5333 18.0333L15 21.3333L16.1 19.8667L6.66668 10.4333V25.3333H21.5667L18.9 22.6667Z' fill='currentColor'/></g></svg>",
    highlight:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M16.0001 29.3333C14.1556 29.3333 12.4223 28.9831 10.8001 28.2826C9.17786 27.5822 7.76675 26.6324 6.56675 25.4333C5.36675 24.2342 4.41697 22.8231 3.71742 21.2C3.01786 19.5768 2.66764 17.8435 2.66675 16C2.66586 14.1564 3.01608 12.4231 3.71742 10.8C4.41875 9.17685 5.36853 7.76574 6.56675 6.56663C7.76497 5.36751 9.17608 4.41774 10.8001 3.71729C12.4241 3.01685 14.1574 2.66663 16.0001 2.66663C17.8427 2.66663 19.5761 3.01685 21.2001 3.71729C22.8241 4.41774 24.2352 5.36751 25.4334 6.56663C26.6316 7.76574 27.5819 9.17685 28.2841 10.8C28.9863 12.4231 29.3361 14.1564 29.3334 16C29.3308 17.8435 28.9805 19.5768 28.2828 21.2C27.585 22.8231 26.6352 24.2342 25.4334 25.4333C24.2316 26.6324 22.8205 27.5826 21.2001 28.284C19.5796 28.9853 17.8463 29.3351 16.0001 29.3333ZM16.0001 26.6666C18.9779 26.6666 21.5001 25.6333 23.5667 23.5666C25.6334 21.5 26.6668 18.9777 26.6668 16C26.6668 13.0222 25.6334 10.5 23.5667 8.43329C21.5001 6.36663 18.9779 5.33329 16.0001 5.33329C13.0223 5.33329 10.5001 6.36663 8.43342 8.43329C6.36675 10.5 5.33342 13.0222 5.33342 16C5.33342 18.9777 6.36675 21.5 8.43342 23.5666C10.5001 25.6333 13.0223 26.6666 16.0001 26.6666ZM13.3334 22.6666H18.6667C19.0445 22.6666 19.3614 22.5386 19.6174 22.2826C19.8734 22.0266 20.001 21.7102 20.0001 21.3333C19.9992 20.9564 19.8712 20.64 19.6161 20.384C19.361 20.128 19.0445 20 18.6667 20H17.3334V12H18.6667C19.0445 12 19.3614 11.872 19.6174 11.616C19.8734 11.36 20.001 11.0435 20.0001 10.6666C19.9992 10.2897 19.8712 9.97329 19.6161 9.71729C19.361 9.46129 19.0445 9.33329 18.6667 9.33329H13.3334C12.9556 9.33329 12.6392 9.46129 12.3841 9.71729C12.129 9.97329 12.001 10.2897 12.0001 10.6666C11.9992 11.0435 12.1272 11.3604 12.3841 11.6173C12.641 11.8742 12.9574 12.0017 13.3334 12H14.6667V20H13.3334C12.9556 20 12.6392 20.128 12.3841 20.384C12.129 20.64 12.001 20.9564 12.0001 21.3333C11.9992 21.7102 12.1272 22.0271 12.3841 22.284C12.641 22.5408 12.9574 22.6684 13.3334 22.6666Z' fill='#04182B'/></svg>",
    highlightLinks:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><g><path d='M9.33333 22.6666C7.48889 22.6666 5.91667 22.0166 4.61667 20.7166C3.31667 19.4166 2.66667 17.8444 2.66667 16C2.66667 14.1555 3.31667 12.5833 4.61667 11.2833C5.91667 9.98331 7.48889 9.33331 9.33333 9.33331H13.3333C13.7111 9.33331 14.0278 9.46109 14.2833 9.71665C14.5389 9.9722 14.6667 10.2889 14.6667 10.6666C14.6667 11.0444 14.5389 11.3611 14.2833 11.6166C14.0278 11.8722 13.7111 12 13.3333 12H9.33333C8.22222 12 7.27778 12.3889 6.5 13.1666C5.72222 13.9444 5.33333 14.8889 5.33333 16C5.33333 17.1111 5.72222 18.0555 6.5 18.8333C7.27778 19.6111 8.22222 20 9.33333 20H13.3333C13.7111 20 14.0278 20.1278 14.2833 20.3833C14.5389 20.6389 14.6667 20.9555 14.6667 21.3333C14.6667 21.7111 14.5389 22.0278 14.2833 22.2833C14.0278 22.5389 13.7111 22.6666 13.3333 22.6666H9.33333ZM12 17.3333C11.6222 17.3333 11.3056 17.2055 11.05 16.95C10.7944 16.6944 10.6667 16.3778 10.6667 16C10.6667 15.6222 10.7944 15.3055 11.05 15.05C11.3056 14.7944 11.6222 14.6666 12 14.6666H20C20.3778 14.6666 20.6944 14.7944 20.95 15.05C21.2056 15.3055 21.3333 15.6222 21.3333 16C21.3333 16.3778 21.2056 16.6944 20.95 16.95C20.6944 17.2055 20.3778 17.3333 20 17.3333H12ZM18.6667 22.6666C18.2889 22.6666 17.9722 22.5389 17.7167 22.2833C17.4611 22.0278 17.3333 21.7111 17.3333 21.3333C17.3333 20.9555 17.4611 20.6389 17.7167 20.3833C17.9722 20.1278 18.2889 20 18.6667 20H22.6667C23.7778 20 24.7222 19.6111 25.5 18.8333C26.2778 18.0555 26.6667 17.1111 26.6667 16C26.6667 14.8889 26.2778 13.9444 25.5 13.1666C24.7222 12.3889 23.7778 12 22.6667 12H18.6667C18.2889 12 17.9722 11.8722 17.7167 11.6166C17.4611 11.3611 17.3333 11.0444 17.3333 10.6666C17.3333 10.2889 17.4611 9.9722 17.7167 9.71665C17.9722 9.46109 18.2889 9.33331 18.6667 9.33331H22.6667C24.5111 9.33331 26.0833 9.98331 27.3833 11.2833C28.6833 12.5833 29.3333 14.1555 29.3333 16C29.3333 17.8444 28.6833 19.4166 27.3833 20.7166C26.0833 22.0166 24.5111 22.6666 22.6667 22.6666H18.6667Z' fill='currentColor'/></g></svg>",
    fontLevel:
      "<svg class='aw-ico' viewBox='0 0 36 23' aria-hidden='true'><g fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M27 21V2'/><path d='M20 6V2h14v4'/><path d='M23 21h8'/><path d='M7 18V5'/><path d='M2 8V5h11v3'/><path d='M4.5 18H9.5'/></g></svg>",
    dyslexic:
      "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M12 3l7 18h-2.5l-1.6-4H9l-1.6 4H5L12 3Zm0 5.5L10.1 14h3.8L12 8.5Z'/></svg>",
    letterLevel:
      "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><g fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M3 12h18M6 8l-4 4 4 4M18 8l4 4-4 4M9 12v-2m6 2v-2'/></g></svg>",
    align:
      "<svg class='aw-ico' viewBox='0 0 24 24' aria-hidden='true'><path fill='currentColor' d='M4 6h16v2H4Zm0 4h12v2H4Zm0 4h16v2H4Zm0 4h10v2H4Z'/></svg>",
    cursorIdx:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><g><path d='M10.6667 18.3333L13.3 14.6667H18.9667L10.6667 8.13334V18.3333ZM20.2 28.5C19.6889 28.7445 19.1778 28.7722 18.6667 28.5833C18.1556 28.3945 17.7778 28.0445 17.5333 27.5333L13.5333 18.9333L10.4333 23.2667C10.0556 23.8 9.55556 23.9667 8.93333 23.7667C8.31111 23.5667 8 23.1445 8 22.5V5.40001C8 4.84446 8.25 4.44446 8.75 4.20001C9.25 3.95557 9.72222 4.01112 10.1667 4.36668L23.6333 14.9667C24.1444 15.3445 24.2944 15.8333 24.0833 16.4333C23.8722 17.0333 23.4444 17.3333 22.8 17.3333H17.2L21.1667 25.8333C21.4111 26.3445 21.4389 26.8556 21.25 27.3667C21.0611 27.8778 20.7111 28.2556 20.2 28.5Z' fill='currentColor'/></g></svg>",
    ruler:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M25.3334 16.3093L26.6067 15.036C28.4241 13.2173 29.3334 12.3066 29.3334 11.1786C29.3334 10.0506 28.4241 9.13996 26.6067 7.32263L24.6774 5.39329C22.8601 3.57596 21.9507 2.66663 20.8214 2.66663C19.6907 2.66663 18.7814 3.57596 16.9641 5.39329L5.39341 16.964C3.57608 18.7826 2.66675 19.6906 2.66675 20.8213C2.66675 21.952 3.57608 22.86 5.39341 24.6773L7.32275 26.6066C9.14008 28.424 10.0494 29.3333 11.1787 29.3333C12.3081 29.3333 13.2187 28.424 15.0361 26.6066L21.6427 20M11.2854 11.2853L13.1734 13.1733M16.9427 5.62929L18.8281 7.51463M5.62941 16.9426L7.51475 18.828M8.45741 14.1146L11.2867 16.9426M14.1147 8.45729L16.9427 11.2853' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/></svg>",
    focusmode:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M10.6667 2.66663H4.00008C3.64646 2.66663 3.30732 2.8071 3.05727 3.05715C2.80722 3.3072 2.66675 3.64634 2.66675 3.99996V10.6666C2.66675 11.0202 2.80722 11.3594 3.05727 11.6094C3.30732 11.8595 3.64646 12 4.00008 12C4.3537 12 4.69284 11.8595 4.94289 11.6094C5.19294 11.3594 5.33341 11.0202 5.33341 10.6666V5.33329H10.6667C11.0204 5.33329 11.3595 5.19282 11.6096 4.94277C11.8596 4.69272 12.0001 4.35358 12.0001 3.99996C12.0001 3.64634 11.8596 3.3072 11.6096 3.05715C11.3595 2.8071 11.0204 2.66663 10.6667 2.66663ZM10.6667 26.6666H5.33341V21.3333C5.33341 20.9797 5.19294 20.6405 4.94289 20.3905C4.69284 20.1404 4.3537 20 4.00008 20C3.64646 20 3.30732 20.1404 3.05727 20.3905C2.80722 20.6405 2.66675 20.9797 2.66675 21.3333V28C2.66675 28.3536 2.80722 28.6927 3.05727 28.9428C3.30732 29.1928 3.64646 29.3333 4.00008 29.3333H10.6667C11.0204 29.3333 11.3595 29.1928 11.6096 28.9428C11.8596 28.6927 12.0001 28.3536 12.0001 28C12.0001 27.6463 11.8596 27.3072 11.6096 27.0571C11.3595 26.8071 11.0204 26.6666 10.6667 26.6666ZM28.0001 2.66663H21.3334C20.9798 2.66663 20.6407 2.8071 20.3906 3.05715C20.1406 3.3072 20.0001 3.64634 20.0001 3.99996C20.0001 4.35358 20.1406 4.69272 20.3906 4.94277C20.6407 5.19282 20.9798 5.33329 21.3334 5.33329H26.6667V10.6666C26.6667 11.0202 26.8072 11.3594 27.0573 11.6094C27.3073 11.8595 27.6465 12 28.0001 12C28.3537 12 28.6928 11.8595 28.9429 11.6094C29.1929 11.3594 29.3334 11.0202 29.3334 10.6666V3.99996C29.3334 3.64634 29.1929 3.3072 28.9429 3.05715C28.6928 2.8071 28.3537 2.66663 28.0001 2.66663ZM28.0001 20C27.6465 20 27.3073 20.1404 27.0573 20.3905C26.8072 20.6405 26.6667 20.9797 26.6667 21.3333V26.6666H21.3334C20.9798 26.6666 20.6407 26.8071 20.3906 27.0571C20.1406 27.3072 20.0001 27.6463 20.0001 28C20.0001 28.3536 20.1406 28.6927 20.3906 28.9428C20.6407 29.1928 20.9798 29.3333 21.3334 29.3333H28.0001C28.3537 29.3333 28.6928 29.1928 28.9429 28.9428C29.1929 28.6927 29.3334 28.3536 29.3334 28V21.3333C29.3334 20.9797 29.1929 20.6405 28.9429 20.3905C28.6928 20.1404 28.3537 20 28.0001 20Z' fill='currentColor'/></svg>",
    cursorGuideMode:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M9.75322 14.74V20.308M14.0812 11.5173V8.73996C14.0812 7.55063 13.1119 6.58663 11.9172 6.58663C10.7225 6.58663 9.75322 7.55063 9.75322 8.73996V13.736M9.75322 13.736L7.80788 14.352C7.02065 14.6015 6.32769 15.0841 5.8206 15.736C5.31351 16.3878 5.01617 17.1782 4.96788 18.0026L4.94788 18.344C4.87304 19.6278 5.06133 20.9135 5.50119 22.122C5.94104 23.3305 6.62319 24.4363 7.50578 25.3717C8.38837 26.3071 9.45278 27.0523 10.6337 27.5616C11.8146 28.0709 13.0872 28.3335 14.3732 28.3333H18.3065C20.6298 28.3333 22.858 27.4104 24.5008 25.7676C26.1436 24.1247 27.0665 21.8966 27.0665 19.5733V11.66C27.0648 11.0876 26.8359 10.5393 26.4301 10.1355C26.0244 9.73175 25.475 9.50557 24.9026 9.50663C24.3299 9.50521 23.7801 9.73124 23.3741 10.135C22.9681 10.5388 22.739 11.0873 22.7372 11.66M9.75322 13.736L9.75188 15.2M14.0812 12.9813V5.81996C14.083 5.24756 14.3119 4.69926 14.7176 4.29551C15.1234 3.89175 15.6728 3.66557 16.2452 3.66663C17.4412 3.66663 18.4092 4.63063 18.4092 5.81996V12.9733M18.4092 12.98V8.73996C18.4289 8.17918 18.6655 7.64794 19.0692 7.25819C19.4729 6.86843 20.0121 6.65061 20.5732 6.65061C21.1343 6.65061 21.6736 6.86843 22.0772 7.25819C22.4809 7.64794 22.7175 8.17918 22.7372 8.73996V11.66M22.7372 11.66V12.98' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>",
    cursorGuideSize:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1384_1101' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1384_1101)'><path d='M5.36678 19.8C5.01123 19.5334 4.839 19.1834 4.85011 18.75C4.86123 18.3167 5.04456 17.9667 5.40011 17.7C5.64456 17.5223 5.91123 17.4334 6.20011 17.4334C6.489 17.4334 6.75567 17.5223 7.00011 17.7L16.0001 24.6667L25.0001 17.7C25.2446 17.5223 25.5112 17.4334 25.8001 17.4334C26.089 17.4334 26.3557 17.5223 26.6001 17.7C26.9557 17.9667 27.139 18.3167 27.1501 18.75C27.1612 19.1834 26.989 19.5334 26.6334 19.8L17.6334 26.8C17.1446 27.1778 16.6001 27.3667 16.0001 27.3667C15.4001 27.3667 14.8557 27.1778 14.3668 26.8L5.36678 19.8ZM14.3668 20.0667L6.70011 14.1C6.01123 13.5667 5.66678 12.8667 5.66678 12C5.66678 11.1334 6.01123 10.4334 6.70011 9.90003L14.3668 3.93337C14.8557 3.55559 15.4001 3.3667 16.0001 3.3667C16.6001 3.3667 17.1446 3.55559 17.6334 3.93337L25.3001 9.90003C25.989 10.4334 26.3334 11.1334 26.3334 12C26.3334 12.8667 25.989 13.5667 25.3001 14.1L17.6334 20.0667C17.1446 20.4445 16.6001 20.6334 16.0001 20.6334C15.4001 20.6334 14.8557 20.4445 14.3668 20.0667ZM16.0001 17.9334L23.6668 12L16.0001 6.0667L8.33345 12L16.0001 17.9334Z' fill='currentColor'/></g></svg>",
    cursorGuideOpacity:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1384_1112' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1384_1112)'><path d='M15.9999 28C13.0444 28 10.5277 26.9722 8.44992 24.9167C6.37214 22.8611 5.33325 20.3778 5.33325 17.4667C5.33325 16 5.61103 14.6445 6.16659 13.4C6.72214 12.1556 7.48881 11.0445 8.46659 10.0667L14.5999 4.03334C14.7999 3.85556 15.0221 3.71667 15.2666 3.61667C15.511 3.51667 15.7555 3.46667 15.9999 3.46667C16.2444 3.46667 16.4888 3.51667 16.7333 3.61667C16.9777 3.71667 17.1999 3.85556 17.3999 4.03334L23.5333 10.0667C24.511 11.0445 25.2777 12.1556 25.8333 13.4C26.3888 14.6445 26.6666 16 26.6666 17.4667C26.6666 20.3778 25.6277 22.8611 23.5499 24.9167C21.4721 26.9722 18.9555 28 15.9999 28ZM15.9999 25.3333V6.40001L10.3333 12C9.55547 12.7333 8.97214 13.5611 8.58325 14.4833C8.19436 15.4056 7.99992 16.4 7.99992 17.4667C7.99992 19.6222 8.7777 21.4722 10.3333 23.0167C11.8888 24.5611 13.7777 25.3333 15.9999 25.3333Z' fill='currentColor'/></g></svg>",
    read: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><mask id='mask0_1386_15240' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='32' height='32'><rect width='32' height='32' fill='#D9D9D9'/></mask><g mask='url(#mask0_1386_15240)'><path d='M25.3333 15.9667C25.3333 14.1223 24.8444 12.4389 23.8666 10.9167C22.8888 9.39448 21.5777 8.2556 19.9333 7.50004C19.5999 7.34448 19.3555 7.1056 19.1999 6.78337C19.0444 6.46115 19.0221 6.13337 19.1333 5.80004C19.2666 5.44449 19.4999 5.18893 19.8333 5.03337C20.1666 4.87782 20.511 4.87782 20.8666 5.03337C23.0221 5.98893 24.7499 7.44449 26.0499 9.40004C27.3499 11.3556 27.9999 13.5445 27.9999 15.9667C27.9999 18.3889 27.3499 20.5778 26.0499 22.5334C24.7499 24.4889 23.0221 25.9445 20.8666 26.9C20.511 27.0556 20.1666 27.0556 19.8333 26.9C19.4999 26.7445 19.2666 26.4889 19.1333 26.1334C19.0221 25.8 19.0444 25.4723 19.1999 25.15C19.3555 24.8278 19.5999 24.5889 19.9333 24.4334C21.5777 23.6778 22.8888 22.5389 23.8666 21.0167C24.8444 19.4945 25.3333 17.8112 25.3333 15.9667ZM9.33325 20H5.33325C4.95547 20 4.63881 19.8723 4.38325 19.6167C4.1277 19.3612 3.99992 19.0445 3.99992 18.6667V13.3334C3.99992 12.9556 4.1277 12.6389 4.38325 12.3834C4.63881 12.1278 4.95547 12 5.33325 12H9.33325L13.7333 7.60004C14.1555 7.17782 14.6388 7.08337 15.1833 7.31671C15.7277 7.55004 15.9999 7.96671 15.9999 8.56671V23.4334C15.9999 24.0334 15.7277 24.45 15.1833 24.6834C14.6388 24.9167 14.1555 24.8223 13.7333 24.4L9.33325 20ZM21.9999 16C21.9999 16.9112 21.8055 17.7723 21.4166 18.5834C21.0277 19.3945 20.4888 20.0778 19.7999 20.6334C19.5555 20.8112 19.3055 20.85 19.0499 20.75C18.7944 20.65 18.6666 20.4445 18.6666 20.1334V11.8C18.6666 11.4889 18.7944 11.2834 19.0499 11.1834C19.3055 11.0834 19.5555 11.1223 19.7999 11.3C20.4888 11.8556 21.0277 12.5445 21.4166 13.3667C21.8055 14.1889 21.9999 15.0667 21.9999 16ZM13.3333 20.2V11.8L10.4666 14.6667H6.66658V17.3334H10.4666L13.3333 20.2ZM2.66659 9.33337C2.28881 9.33337 1.97214 9.2056 1.71659 8.95004C1.46103 8.69448 1.33325 8.37782 1.33325 8.00004V4.00004C1.33325 3.26671 1.59436 2.63893 2.11659 2.11671C2.63881 1.59449 3.26659 1.33337 3.99992 1.33337H7.99992C8.3777 1.33337 8.69436 1.46115 8.94992 1.71671C9.20547 1.97226 9.33325 2.28893 9.33325 2.66671C9.33325 3.04448 9.20547 3.36115 8.94992 3.61671C8.69436 3.87226 8.3777 4.00004 7.99992 4.00004H3.99992V8.00004C3.99992 8.37782 3.87214 8.69448 3.61659 8.95004C3.36103 9.2056 3.04436 9.33337 2.66659 9.33337ZM23.9999 30.6667C23.6221 30.6667 23.3055 30.5389 23.0499 30.2834C22.7944 30.0278 22.6666 29.7111 22.6666 29.3334C22.6666 28.9556 22.7944 28.6389 23.0499 28.3834C23.3055 28.1278 23.6221 28 23.9999 28H27.9999V24C27.9999 23.6223 28.1277 23.3056 28.3833 23.05C28.6388 22.7945 28.9555 22.6667 29.3333 22.6667C29.711 22.6667 30.0277 22.7945 30.2832 23.05C30.5388 23.3056 30.6666 23.6223 30.6666 24V28C30.6666 28.7334 30.4055 29.3612 29.8833 29.8834C29.361 30.4056 28.7332 30.6667 27.9999 30.6667H23.9999Z' fill='currentColor'/></g></svg>",
    stop: "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M13.3334 10.6666C12.6262 10.6666 11.9479 10.9476 11.4478 11.4477C10.9477 11.9478 10.6667 12.626 10.6667 13.3333V18.6666C10.6667 19.3739 10.9477 20.0521 11.4478 20.5522C11.9479 21.0523 12.6262 21.3333 13.3334 21.3333H18.6667C19.374 21.3333 20.0523 21.0523 20.5524 20.5522C21.0525 20.0521 21.3334 19.3739 21.3334 18.6666V13.3333C21.3334 12.626 21.0525 11.9478 20.5524 11.4477C20.0523 10.9476 19.374 10.6666 18.6667 10.6666H13.3334ZM29.3334 16C29.3334 19.5362 27.9287 22.9276 25.4282 25.428C22.9277 27.9285 19.5363 29.3333 16.0001 29.3333C12.4639 29.3333 9.07248 27.9285 6.57199 25.428C4.07151 22.9276 2.66675 19.5362 2.66675 16C2.66675 12.4637 4.07151 9.07235 6.57199 6.57187C9.07248 4.07138 12.4639 2.66663 16.0001 2.66663C19.5363 2.66663 22.9277 4.07138 25.4282 6.57187C27.9287 9.07235 29.3334 12.4637 29.3334 16ZM26.6667 16C26.6667 13.171 25.5429 10.4579 23.5426 8.45749C21.5422 6.4571 18.8291 5.33329 16.0001 5.33329C13.1711 5.33329 10.458 6.4571 8.45761 8.45749C6.45722 10.4579 5.33341 13.171 5.33341 16C5.33341 18.8289 6.45722 21.542 8.45761 23.5424C10.458 25.5428 13.1711 26.6666 16.0001 26.6666C18.8291 26.6666 21.5422 25.5428 23.5426 23.5424C25.5429 21.542 26.6667 18.8289 26.6667 16Z' fill='currentColor'/></svg>",
    screenReader:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><path d='M8.00008 21.3334H24.0001V10.6667H8.00008V21.3334ZM10.6667 13.3334H21.3334V18.6667H10.6667V13.3334ZM5.33341 20H2.66675V24C2.66675 25.4667 3.86675 26.6667 5.33341 26.6667H9.33341V24H5.33341V20ZM5.33341 8.00004H9.33341V5.33337H5.33341C3.86675 5.33337 2.66675 6.53337 2.66675 8.00004V12H5.33341V8.00004ZM26.6667 5.33337H22.6667V8.00004H26.6667V12H29.3334V8.00004C29.3334 6.53337 28.1334 5.33337 26.6667 5.33337ZM26.6667 24H22.6667V26.6667H26.6667C28.1334 26.6667 29.3334 25.4667 29.3334 24V20H26.6667V24Z' fill='currentColor'/></svg>",
    dictate:
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'><g><path d='M18.7999 25.6L25.3999 19C25.6444 18.7556 25.9555 18.6333 26.3333 18.6333C26.711 18.6333 27.0222 18.7556 27.2666 19C27.511 19.2444 27.6333 19.5556 27.6333 19.9333C27.6333 20.3111 27.511 20.6222 27.2666 20.8667L20.6999 27.4333C20.4333 27.7 20.1333 27.9 19.7999 28.0333C19.4666 28.1667 19.1333 28.2333 18.7999 28.2333C18.4666 28.2333 18.1333 28.1667 17.7999 28.0333C17.4666 27.9 17.1666 27.7 16.8999 27.4333L14.0666 24.6C13.8222 24.3556 13.6999 24.0444 13.6999 23.6667C13.6999 23.2889 13.8222 22.9778 14.0666 22.7333C14.311 22.4889 14.6222 22.3667 14.9999 22.3667C15.3777 22.3667 15.6888 22.4889 15.9333 22.7333L18.7999 25.6ZM8.46659 16.9333L7.23326 20.4333C7.12215 20.7 6.95548 20.9167 6.73326 21.0833C6.51104 21.25 6.25548 21.3333 5.9666 21.3333C5.47771 21.3333 5.09993 21.1333 4.83326 20.7333C4.5666 20.3333 4.52215 19.9111 4.69993 19.4667L10.0999 4.96667C10.211 4.67778 10.3944 4.44444 10.6499 4.26667C10.9055 4.08889 11.1888 4 11.4999 4H12.5666C12.8777 4 13.161 4.08889 13.4166 4.26667C13.6722 4.44444 13.8555 4.67778 13.9666 4.96667L19.3666 19.4333C19.5444 19.9 19.4944 20.3333 19.2166 20.7333C18.9388 21.1333 18.5444 21.3333 18.0333 21.3333C17.7222 21.3333 17.4444 21.2444 17.1999 21.0667C16.9555 20.8889 16.7777 20.6556 16.6666 20.3667L15.4666 16.9333H8.46659ZM9.39993 14.4H14.5999L12.0666 7.2H11.9333L9.39993 14.4Z' fill='currentColor'/></g></svg>",
  };

  function iconForTile(tile) {
    const k =
      tile.dataset.profile ||
      tile.dataset.toggle ||
      tile.dataset.cycle ||
      tile.dataset.action;
    return ICONS[k] || null;
  }

  function attachIcons() {
    document.querySelectorAll('.aw-tile .aw-tile-head').forEach((head) => {
      if (head.querySelector('.aw-ico')) return;
      const tile = head.closest('.aw-tile');
      const svg = tile ? iconForTile(tile) : null;
      if (!svg) return;
      const span = head.querySelector('.aw-tile-title');
      if (!span) return;
      span.insertAdjacentHTML('beforebegin', svg);
    });
  }

  // Mount / Unmount
  function injectStyle() {
    if (document.getElementById('aw-style')) return;
    const s = document.createElement('style');
    s.id = 'aw-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function injectHTML() {
    if (document.getElementById('aw-root')) return;
    const wrap = document.createElement('div');
    wrap.id = 'aw-root';
    wrap.innerHTML = HTML;
    document.body.appendChild(wrap);
  }

  function initCore() {
    load();
    Object.assign(defaultOptions, window.AWIDGET_OPTIONS || {});
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
        manage: 'Manage',
        contrastPlus: 'Smart Contrast',
        pauseAnimations: 'Pause Animations',
        hideImages: 'Hide Images',
        highlightStructure: 'Highlight Structure',
        highlightLinks: 'Highlight Links',
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
        blind: 'Blind',
        colorBlind: 'Color Blind',
        dyslexia: 'Dyslexia',
        lowVision: 'Low Vision',
        adhd: 'ADHD',
        seizure: 'Epilepsy',
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
        customTheme: 'Custom',
      },
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
        manage: 'إدارة',
        contrastPlus: 'أنماط التباين',
        pauseAnimations: 'إيقاف الحركات',
        hideImages: 'إخفاء الصور',
        highlightStructure: 'إبراز البنية',
        highlightLinks: 'تمييز الروابط',
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
        blind: 'كفيف',
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
        customTheme: 'مخصص',
      },
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
        manage: 'Gestionar',
        contrastPlus: 'Modos de contraste',
        pauseAnimations: 'Pausar animaciones',
        hideImages: 'Ocultar imágenes',
        highlightStructure: 'Resaltar estructura',
        highlightLinks: 'Resaltar enlaces',
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
        blind: 'Ceguera',
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
        customTheme: 'Personalizado',
      },
    });

    initI18n();
    initEvents();
    initSwatches();
    apply();
    document
      .getElementById('aw-ruler')
      ?.classList.toggle('aw-on', !!state.ruler);
    document
      .getElementById('aw-focus')
      ?.classList.toggle('aw-on', !!state.focusmode);
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
      window.addEventListener('DOMContentLoaded', () => mount(opts), {
        once: true,
      });
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
      shield.style.cssText =
        'position:fixed;inset:0;pointer-events:none;z-index:2147483646';
      document.body.appendChild(shield);

      const hit = (el) =>
        el && (el.closest('#aw-panel') || el.closest('#aw-fab'));
      document.addEventListener(
        'pointerdown',
        (e) => {
          if (hit(e.target)) {
            // Capture and stop overlays behind from handling
            shield.style.pointerEvents = 'auto';
            shield.addEventListener(
              'pointerdown',
              (ev) => ev.stopPropagation(),
              { once: true, capture: true },
            );
            setTimeout(() => (shield.style.pointerEvents = 'none'), 0);
          }
        },
        true,
      );
    };
    if (document.body) install();
    else window.addEventListener('DOMContentLoaded', install, { once: true });
  })();

  function unmount() {
    if (!mounted) return;
    try {
      document.getElementById('aw-style')?.remove();
      document.getElementById('aw-root')?.remove();
      document.body.classList.remove(
        'aw-filter-scope',
        'aw-noanim',
        'aw-hide-imgs',
        'aw-highlight',
        'aw-highlightLinks',
        'aw-dyslexic',
        'aw-focusmode',
        'aw-cursor-big',
        'aw-cursor-cross',
      );
      document.body.style.overflow = '';
      SR.stopAll();
    } catch {}
    mounted = false;
  }

  // Animation Pause/Resume State
  const _awAnimState = {
    gsapTimeScale: 1,
    animeWasRunning: new WeakSet(),
  };

  // GSAP + ScrollTrigger Pause/Resume
  function _pauseGSAP(on) {
    const g = window.gsap;
    if (!g) return;

    try {
      if (on) {
        _awAnimState.gsapTimeScale = g.globalTimeline.timeScale();
        g.globalTimeline.timeScale(0);
        g.ticker?.sleep?.();
        if (g.ScrollTrigger) {
          g.ScrollTrigger.getAll().forEach((st) => {
            st.animation?.pause?.();
            st.scrubTween?.pause?.();
          });
        }
      } else {
        g.ticker?.wake?.();
        if (g.ScrollTrigger) {
          g.ScrollTrigger.getAll().forEach((st) => {
            st.animation?.play?.();
            st.scrubTween?.play?.();
          });
        }
        g.globalTimeline.timeScale(_awAnimState.gsapTimeScale || 1);
      }
    } catch {}
  }

  // Lottie Pause/Resume
  function _pauseLottie(on) {
    document.querySelectorAll('lottie-player').forEach((p) => {
      try {
        on ? p.pause() : p.play();
      } catch {}
    });

    const reg = window.lottie?.getRegisteredAnimations?.();
    if (Array.isArray(reg)) {
      reg.forEach((inst) => {
        try {
          on ? inst.pause() : inst.play();
        } catch {}
      });
    }
  }

  // Anime.js Pause/Resume
  function _pauseAnimeJS(on) {
    const anime = window.anime;
    if (!anime) return;

    try {
      const running = anime.running || [];
      running.forEach((instance) => {
        if (on) {
          _awAnimState.animeWasRunning.add(instance);
          instance.pause?.();
        } else {
          if (_awAnimState.animeWasRunning.has(instance)) instance.play?.();
        }
      });
      if (!on) _awAnimState.animeWasRunning = new WeakSet();
    } catch {}
  }

  // General JS Animations Pause/Resume
  function pauseJSAnimations(on) {
    _pauseGSAP(on);
    _pauseLottie(on);
    _pauseAnimeJS(on);
  }

  // Apply pause/resume to page
  function applyNoAnimScope(on) {
    const scope = document.getElementById('aw-scope') || document.body;

    // CSS class to disable animations
    scope.classList.toggle('aw-noanim', !!on);

    // Disable smooth scroll
    document.documentElement.style.scrollBehavior = on ? 'auto' : '';

    // Pause/resume <video>/<audio>
    scope.querySelectorAll('video, audio').forEach((m) => {
      try {
        if (on) {
          if (!m.paused) m.dataset._awWasPlaying = '1';
          m.pause();
          m.autoplay = false;
          m.setAttribute('preload', 'none');
        } else {
          if (m.dataset._awWasPlaying === '1') m.play().catch(() => {});
          delete m.dataset._awWasPlaying;
        }
      } catch {}
    });

    // Pause/resume JS engines
    pauseJSAnimations(!!on);
  }

  // Pause/Play Icons
  const pauseIcon = `<path fill="currentColor" d="M6 4h3v16H6V4Zm9 0h3v16h-3V4Z"></path>`;
  const playIcon = `<path fill="currentColor" d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"></path>`;

  let isPaused = false;

  // Connect to your .aw-tile HTML
  document.addEventListener('DOMContentLoaded', () => {
    const tile = document.querySelector('.aw-tile[data-toggle="noanim"]');
    if (!tile) return;

    const svg = tile.querySelector('svg');

    // Initialize icon
    if (svg) svg.innerHTML = pauseIcon;

    // Click to toggle
    tile.addEventListener('click', () => {
      isPaused = !isPaused;
      applyNoAnimScope(isPaused);

      if (svg) svg.innerHTML = isPaused ? playIcon : pauseIcon;

      // Update ARIA for accessibility
      tile.setAttribute('aria-pressed', isPaused ? 'true' : 'false');

      // Optional: change text dynamically
      const text = tile.querySelector('.aw-tile-title');
      if (text)
        text.textContent = isPaused ? 'Resume Animations' : 'Pause Animations';
    });
  });

  // Exposed control helpers
  function open() {
    mount();
    openPanel();
  }

  function close() {
    closePanel();
  }

  // Public API
  return {
    mount,
    unmount,
    open,
    close,
    version: '2.0.0',
    // Advanced: passthrough to theme / i18n singletons you already expose
    theme: window.AWIDGET_THEME,
    i18n: window.AWIDGET_I18N,
  };
});


/*!
 * accessibility-widget.js — Easy Config Layer for AWIDGET v2.2.0
 *
 * ══════════════════════════════════════════════════════════════════
 *  THE EASIEST WAY — just add data-* attributes to the script tag:
 * ══════════════════════════════════════════════════════════════════
 *
 *  <script src="awidget.js"></script>
 *  <script src="accessibility-widget.js"
 *    data-lang="fr"
 *    data-theme="dark"
 *    data-position="left"
 *    data-statement-href="https://example.com/a11y"
 *    data-hide="tools,manage"
 *    data-theme-name="brand"
 *    data-theme-base="light"
 *    data-theme-active
 *    data-color-header="#6366f1"
 *    data-color-accent="#8b5cf6"
 *    data-color-bg="#f0f4ff"
 *    data-color-text="#111827"
 *    data-color-border="#c7d2fe"
 *    data-color-muted="#818cf8">
 *  </script>
 *
 * ══════════════════════════════════════════════════════════════════
 *  ALL data-* ATTRIBUTES  (every one is optional)
 * ══════════════════════════════════════════════════════════════════
 *
 *  data-lang              Language code or 'auto'  (default: auto)
 *  data-theme             'auto' | 'dark' | 'light'  (default: auto)
 *  data-position          'right' | 'left'  (default: right)
 *
 *  data-statement-href    URL for the accessibility statement link
 *  data-statement-label   Link label in English (default: "Accessibility Statement")
 *
 *  data-hide              Comma-separated sections to hide:
 *                         language, profiles, visuals, typography,
 *                         colors, tools, manage
 *                         Example:  data-hide="tools,manage"
 *
 *  data-theme-name        Custom theme identifier  e.g. "brand"
 *  data-theme-base        'light' | 'dark'  (default: light)
 *  data-theme-active      (no value needed) — activate theme on load
 *
 *  — Custom theme CSS variables (all optional):
 *  data-color-header      Widget header & FAB color   e.g. "#6366f1"
 *  data-color-accent      Highlights & active states  e.g. "#8b5cf6"
 *  data-color-bg          Widget background           e.g. "#f0f4ff"
 *  data-color-panel       Panel cards background      e.g. "#e8edf8"
 *  data-color-text        Widget text color           e.g. "#111827"
 *  data-color-border      Border / separator color    e.g. "#c7d2fe"
 *  data-color-muted       Secondary text color        e.g. "#818cf8"
 *
 * ══════════════════════════════════════════════════════════════════
 *  ADVANCED — window.AWIDGET_CONFIG (overrides data-* attributes)
 * ══════════════════════════════════════════════════════════════════
 *
 *  <script>
 *  window.AWIDGET_CONFIG = {
 *    lang:     'fr',
 *    theme:    'dark',
 *    position: 'left',
 *
 *    statement: {
 *      href:   'https://example.com/a11y',
 *      labels: { en: 'Accessibility Statement', fr: 'Déclaration d\'accessibilité' },
 *    },
 *
 *    themes: [
 *      { name: 'brand', base: 'light', active: true,
 *        vars: { '--aw-header': '#6366f1', '--aw-accent': '#8b5cf6' } },
 *    ],
 *
 *    languages: [
 *      { code: 'nl', label: '🇳🇱 NL', rtl: false,
 *        pack: { title: 'Toegankelijkheidsmenu' } },
 *    ],
 *
 *    sections: { tools: false, manage: false },
 *
 *    palettes: {
 *      text:    ['#111827', '#ffffff', '#e11d48'],
 *      link:    ['#2563eb', '#7aa8ff'],
 *    },
 *
 *    onMount:       (s) => console.log('mounted', s),
 *    onOpen:        ()  => {},
 *    onClose:       ()  => {},
 *    onReset:       ()  => {},
 *    onLangChange:  (c) => {},
 *    onThemeChange: (t) => {},
 *  };
 *  </script>
 *  <script src="awidget.js"></script>
 *  <script src="accessibility-widget.js"></script>
 */
(function () {
  'use strict';

  var VERSION      = '2.2.0';
  var MAX_RETRIES  = 40;
  var RETRY_DELAY  = 150;

  // ── Grab own <script> tag ────────────────────────────────────────────────
  var _ownScript = document.currentScript || (function () {
    var tags = document.querySelectorAll('script[src*="accessibility-widget"]');
    return tags[tags.length - 1] || null;
  })();

  // ── Read one data attribute (returns null if missing) ────────────────────
  function attr(name) {
    return _ownScript ? (_ownScript.getAttribute('data-' + name)) : null;
  }

  function hasAttr(name) {
    return _ownScript ? _ownScript.hasAttribute('data-' + name) : false;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Build config: merge data-* attrs  +  window.AWIDGET_CONFIG
  // AWIDGET_CONFIG always wins over data-* attrs.
  // ─────────────────────────────────────────────────────────────────────────
  function buildConfig() {
    var js  = window.AWIDGET_CONFIG || {};   // JS config (advanced)
    var cfg = {};

    // ── Core ──────────────────────────────────────────────────────────────
    cfg.lang     = js.lang     || attr('lang')     || 'auto';
    cfg.theme    = js.theme    || attr('theme')    || 'auto';
    cfg.position = js.position || attr('position') || 'right';

    // ── Statement ─────────────────────────────────────────────────────────
    if (js.statement && js.statement.href) {
      cfg.statement = js.statement;
    } else {
      var href  = js.statementHref  || attr('statement-href')  || null;
      var label = js.statementLabel || attr('statement-label') || 'Accessibility Statement';
      cfg.statement = href ? { href: href, labels: { en: label } } : null;
    }

    // ── Themes ────────────────────────────────────────────────────────────
    cfg.themes = js.themes || js.customThemes || [];

    // Build a theme from data-color-* attributes if data-theme-name is set
    var themeName = js.themeName || attr('theme-name') || null;
    if (themeName) {
      var vars = {};
      var colorKeys = {
        'header': '--aw-header',
        'accent': '--aw-accent',
        'bg':     '--aw-bg',
        'panel':  '--aw-panel',
        'text':   '--aw-text',
        'border': '--aw-border',
        'muted':  '--aw-muted',
      };
      Object.keys(colorKeys).forEach(function (k) {
        var v = attr('color-' + k);
        if (v) vars[colorKeys[k]] = v;
      });

      cfg.themes = cfg.themes.concat([{
        name:   themeName,
        base:   js.themeBase || attr('theme-base') || 'light',
        active: !!(js.themeActive || hasAttr('theme-active')),
        vars:   vars,
      }]);
    }

    // ── Languages ─────────────────────────────────────────────────────────
    cfg.languages = js.languages || js.extraLanguages || [];

    // ── Section visibility ─────────────────────────────────────────────────
    // data-hide="tools,manage"  OR  sections: { tools: false }
    var ALL_SECTIONS = ['language','profiles','visuals','typography','colors','tools','manage'];
    var sections = {};
    ALL_SECTIONS.forEach(function (s) { sections[s] = true; });

    var hideAttr = attr('hide') || '';
    hideAttr.split(',').forEach(function (s) {
      var key = s.trim();
      if (key) sections[key] = false;
    });

    if (js.sections) {
      Object.keys(js.sections).forEach(function (k) {
        sections[k] = js.sections[k] !== false;
      });
    }
    cfg.sections = sections;

    // ── Palettes ──────────────────────────────────────────────────────────
    cfg.palettes = Object.assign({}, DEFAULT_PALETTES, js.palettes || {});

    // ── Hooks ─────────────────────────────────────────────────────────────
    cfg.onMount       = js.onMount       || null;
    cfg.onOpen        = js.onOpen        || null;
    cfg.onClose       = js.onClose       || null;
    cfg.onReset       = js.onReset       || null;
    cfg.onLangChange  = js.onLangChange  || null;
    cfg.onThemeChange = js.onThemeChange || null;

    cfg.extraData = js.extraData || {};
    return cfg;
  }

  // ── Default palettes ──────────────────────────────────────────────────────
  var DEFAULT_PALETTES = {
    text:          ['#111827','#f9fafb','#e11d48','#22c55e','#eab308','#06b6d4','#a78bfa','#f97316'],
    link:          ['#2563eb','#7aa8ff','#22c55e','#e11d48','#a78bfa','#f59e0b'],
    heading:       ['#111827','#1f2937','#0f172a','#7aa8ff','#22c55e','#e11d48','#a78bfa','#f59e0b'],
    selectionBg:   ['#bde0fe','#a7f3d0','#fde68a','#fecaca','#ddd6fe','#fbcfe8','#fef3c7','#d1fae5'],
    selectionText: ['#111827','#000000','#ffffff','#1f2937','#0b1220'],
  };

  var DEFAULT_STATEMENT_LABELS = {
    en: 'Accessibility Statement',
    fr: 'Déclaration d\'accessibilité',
    ar: 'بيان إمكانية الوصول',
    es: 'Declaración de accesibilidad',
    de: 'Barrierefreiheitserklärung',
  };

  // ── Built-in language packs ───────────────────────────────────────────────
  var BUILTIN_LANGUAGES = {
    fr: { label:'🇫🇷 FR', rtl:false, pack:{
      title:'Menu d\'accessibilité',language:'Langue',profiles:'Profils',colors:'Couleurs',
      typography:'Typographie',visuals:'Visuels',focusAids:'Aides à la mise au point',
      tools:'Outils',manage:'Gérer',contrastPlus:'Modes de contraste',
      pauseAnimations:'Mettre les animations en pause',hideImages:'Masquer les images',
      highlightStructure:'Mettre en évidence la structure',highlightLinks:'Mettre en évidence les liens',
      fontSize:'Taille de la police',dyslexicFont:'Police pour la dyslexie',
      letterSpacing:'Espacement des lettres',textAlign:'Alignement du texte',cursor:'Type de curseur',
      rulerTitle:'Règle de lecture',focusTitle:'Masque de mise au point',cursorGuide:'Guide du curseur',
      guideSize:'Taille du guide',guideOpacity:'Opacité du guide',textColor:'Couleur du texte',
      linkColor:'Couleur des liens',headingColor:'Couleur du titre',speak:'Lire la sélection',
      stop:'Arrêter la voix',resetAll:'Réinitialiser tout',position:'Position',
      blind:'Cécité (lecteur d\'écran)',colorBlind:'Daltonisme',dyslexia:'Dyslexie',
      lowVision:'Basse vision',adhd:'TDAH (concentration)',seizure:'Photosensibilité / épilepsie',
      selectionBackground:'Arrière-plan de la sélection',selectionText:'Couleur du texte sélectionné',
      saturation:'Saturation',screenReader:'Lecteur d\'écran',talktoWrite:'Parler pour écrire',
      accessibilityStatement:'Déclaration d\'accessibilité',theme:'Thème',right:'Droite',left:'Gauche',
      auto:'Automatique',dark:'Sombre',light:'Clair',customTheme:'Personnalisé',
    }},
    ar: { label:'🇸🇦 AR', rtl:true, pack:{
      title:'قائمة إمكانية الوصول',language:'اللغة',profiles:'ملفات التعريف',colors:'الألوان',
      typography:'الطباعة',visuals:'المرئيات',focusAids:'أدوات التركيز',tools:'الأدوات',manage:'الإدارة',
      contrastPlus:'أوضاع التباين',pauseAnimations:'إيقاف الرسوم المتحركة',hideImages:'إخفاء الصور',
      highlightStructure:'إبراز الهيكل',highlightLinks:'إبراز الروابط',fontSize:'حجم الخط',
      dyslexicFont:'خط عسر القراءة',letterSpacing:'تباعد الأحرف',textAlign:'محاذاة النص',
      cursor:'نوع المؤشر',rulerTitle:'مسطرة القراءة',focusTitle:'قناع التركيز',
      cursorGuide:'دليل المؤشر',guideSize:'حجم الدليل',guideOpacity:'شفافية الدليل',
      textColor:'لون النص',linkColor:'لون الرابط',headingColor:'لون العناوين',
      speak:'قراءة التحديد',stop:'إيقاف القراءة',resetAll:'إعادة الضبط',position:'الموضع',
      blind:'كفيف',colorBlind:'عمى الألوان',dyslexia:'عُسر القراءة',lowVision:'ضعف البصر',
      adhd:'فرط الحركة / تشتت الانتباه',seizure:'حساسية الضوء / الصرع',
      selectionBackground:'خلفية النص المحدد',selectionText:'لون النص المحدد',
      saturation:'التشبع اللوني',screenReader:'قارئ الشاشة',talktoWrite:'التحدث للكتابة',
      accessibilityStatement:'بيان إمكانية الوصول',theme:'سمة',right:'يمين',left:'يسار',
      auto:'تلقائي',dark:'داكن',light:'فاتح',customTheme:'مخصص',
    }},
    es: { label:'🇪🇸 ES', rtl:false, pack:{
      title:'Menú de accesibilidad',language:'Idioma',profiles:'Perfiles',colors:'Colores',
      typography:'Tipografía',visuals:'Visuales',focusAids:'Ayudas de enfoque',
      tools:'Herramientas',manage:'Gestionar',contrastPlus:'Modos de contraste',
      pauseAnimations:'Pausar animaciones',hideImages:'Ocultar imágenes',
      highlightStructure:'Resaltar estructura',highlightLinks:'Resaltar enlaces',
      fontSize:'Tamaño de fuente',dyslexicFont:'Fuente para dislexia',
      letterSpacing:'Espaciado entre letras',textAlign:'Alineación del texto',cursor:'Tipo de cursor',
      rulerTitle:'Regla de lectura',focusTitle:'Máscara de enfoque',cursorGuide:'Guía del cursor',
      guideSize:'Tamaño de la guía',guideOpacity:'Opacidad de la guía',textColor:'Color del texto',
      linkColor:'Color de los enlaces',headingColor:'Color del título',speak:'Leer selección',
      stop:'Detener voz',resetAll:'Restablecer todo',position:'Posición',blind:'Ceguera',
      colorBlind:'Daltonismo',dyslexia:'Dislexia',lowVision:'Baja visión',adhd:'TDAH (enfoque)',
      seizure:'Fotosensibilidad / epilepsia',selectionBackground:'Fondo de selección',
      selectionText:'Color del texto seleccionado',saturation:'Saturación',
      screenReader:'Lector de pantalla',talktoWrite:'Hablar para escribir',
      accessibilityStatement:'Declaración de accesibilidad',theme:'Tema',right:'Derecha',
      left:'Izquierda',auto:'Automático',dark:'Oscuro',light:'Claro',customTheme:'Personalizado',
    }},
    de: { label:'🇩🇪 DE', rtl:false, pack:{
      title:'Barrierefreiheitsmenü',language:'Sprache',profiles:'Profile',colors:'Farben',
      typography:'Typografie',visuals:'Visuelles',focusAids:'Fokushilfen',
      tools:'Werkzeuge',manage:'Verwalten',contrastPlus:'Kontrastmodi',
      pauseAnimations:'Animationen pausieren',hideImages:'Bilder ausblenden',
      highlightStructure:'Struktur hervorheben',highlightLinks:'Links hervorheben',
      fontSize:'Schriftgröße',dyslexicFont:'Legasthenie-Schrift',letterSpacing:'Zeichenabstand',
      textAlign:'Textausrichtung',cursor:'Zeigertyp',rulerTitle:'Leselineal',focusTitle:'Fokusmaske',
      cursorGuide:'Cursor-Lesehilfe',guideSize:'Hilfsgröße',guideOpacity:'Hilfsdeckkraft',
      textColor:'Textfarbe',linkColor:'Linkfarbe',headingColor:'Überschriftenfarbe',
      speak:'Auswahl vorlesen',stop:'Sprache stoppen',resetAll:'Alles zurücksetzen',
      position:'Position',blind:'Blindheit (Screenreader)',colorBlind:'Farbblindheit',
      dyslexia:'Legasthenie',lowVision:'Sehschwäche',adhd:'ADHS (Konzentration)',
      seizure:'Lichtempfindlichkeit / Epilepsie',selectionBackground:'Auswahlhintergrund',
      selectionText:'Ausgewählte Textfarbe',saturation:'Sättigung',screenReader:'Screenreader',
      talktoWrite:'Sprechen zum Schreiben',accessibilityStatement:'Barrierefreiheitserklärung',
      theme:'Thema',right:'Rechts',left:'Links',auto:'Automatisch',dark:'Dunkel',light:'Hell',
      customTheme:'Benutzerdefiniert',
    }},
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Wait for AWIDGET core
  // ─────────────────────────────────────────────────────────────────────────
  function waitForWidget(cb, retries) {
    if (retries === undefined) retries = MAX_RETRIES;
    if (window.AWIDGET && window.AWIDGET_I18N && window.AWIDGET_THEME) {
      cb();
    } else if (retries > 0) {
      setTimeout(function () { waitForWidget(cb, retries - 1); }, RETRY_DELAY);
    } else {
      console.warn('[accessibility-widget v' + VERSION + '] awidget.js not ready — ensure it loads before this script.');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Main
  // ─────────────────────────────────────────────────────────────────────────
  function init() {
    if (document.getElementById('aw-panel')) return;

    var cfg = buildConfig();

    // 1. Languages
    registerBuiltinLanguages();
    cfg.languages.forEach(function (def) {
      if (def.code && window.AWIDGET_I18N.addLanguage) {
        window.AWIDGET_I18N.addLanguage(def.code, {
          label: def.label || def.code.toUpperCase(),
          rtl:   !!def.rtl,
          pack:  def.pack || {},
        });
      }
    });

    // 2. Theme
    cfg.themes.forEach(function (t) {
      if (t.name && window.AWIDGET_THEME.add) {
        window.AWIDGET_THEME.add(t.name, { base: t.base || 'light', vars: t.vars || {} });
      }
    });

    var activeTheme = resolveTheme(cfg);
    if (window.AWIDGET_THEME.set) window.AWIDGET_THEME.set(activeTheme);

    // 3. Language
    var lang = resolveLang(cfg.lang);
    if (window.AWIDGET_I18N.setLanguage) window.AWIDGET_I18N.setLanguage(lang);

    // 4. Position
    var position = resolvePosition(cfg.position);

    // 5. Settings + mount
    var settings = {
      lang:      { default: window.AWIDGET_I18N.getLanguage() || lang },
      theme:     window.AWIDGET_THEME.get() || activeTheme,
      position:  position,
      tiles:     buildTiles(cfg),
      extraData: cfg.extraData,
    };

    window.AWIDGET.mount({ settings: settings });
    if (window.setAWIDGETPosition)  window.setAWIDGETPosition(settings.position);
    if (window.updateAWIDGETTiles)  window.updateAWIDGETTiles(settings);

    // 6. Post-mount DOM tweaks
    setTimeout(function () {
      applySections(cfg.sections);
      applyPalettes(cfg.palettes);
      wireHooks(cfg);
    }, 0);

    if (typeof cfg.onMount === 'function') cfg.onMount(settings);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────
  function resolveLang(lang) {
    if (!lang || lang === 'auto') {
      return document.documentElement.lang ||
             (navigator.language || 'en').split('-')[0];
    }
    return lang;
  }

  function resolveTheme(cfg) {
    // Any theme marked active: true wins first
    for (var i = 0; i < cfg.themes.length; i++) {
      if (cfg.themes[i].active) return 'custom:' + cfg.themes[i].name;
    }
    if (!cfg.theme || cfg.theme === 'auto') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
    }
    return cfg.theme;
  }

  function resolvePosition(pos) {
    try { return localStorage.getItem('awidget:position') || pos || 'right'; }
    catch (e) { return pos || 'right'; }
  }

  function buildTiles(cfg) {
    var tiles = {};
    if (cfg.statement && cfg.statement.href) {
      tiles.accessibilityStatement = {
        enabled: true,
        href:    cfg.statement.href,
        labels:  Object.assign({}, DEFAULT_STATEMENT_LABELS, cfg.statement.labels || {}),
      };
    }
    return tiles;
  }

  function registerBuiltinLanguages() {
    if (!window.AWIDGET_I18N || !window.AWIDGET_I18N.addLanguage) return;
    Object.keys(BUILTIN_LANGUAGES).forEach(function (code) {
      window.AWIDGET_I18N.addLanguage(code, BUILTIN_LANGUAGES[code]);
    });
  }

  function applySections(sections) {
    Object.keys(sections).forEach(function (key) {
      var el = document.querySelector('.aw-acc[data-sec="' + key + '"]');
      if (el) el.style.display = sections[key] === false ? 'none' : '';
    });
  }

  // Swatch map: palette key → DOM id
  var SWATCH_IDS = {
    text:          'swatch-text',
    link:          'swatch-link',
    heading:       'swatch-heading',
    selectionBg:   'swatch-selection-bg',
    selectionText: 'swatch-selection-text',
  };

  var CSS_VAR_MAP = {
    text:          '--aw-user-text',
    link:          '--aw-user-link',
    heading:       '--aw-user-heading',
    selectionBg:   '--aw-user-selection-bg',
    selectionText: '--aw-user-selection-text',
  };

  var CLASS_MAP = {
    text:    'aw-has-text',
    link:    'aw-has-link',
    heading: 'aw-has-heading',
  };

  function applyPalettes(palettes) {
    Object.keys(SWATCH_IDS).forEach(function (key) {
      renderSwatches(SWATCH_IDS[key], palettes[key] || [], key);
    });
  }

  function renderSwatches(id, palette, key) {
    var wrap = document.getElementById(id);
    if (!wrap || !palette.length) return;
    wrap.innerHTML = '';

    var items = ['none'].concat(palette);
    items.forEach(function (val) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'aw-swatch' + (val === 'none' ? ' none' : '');
      btn.setAttribute('data-color', val);
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', val === 'none' ? 'Use site default' : val);
      btn.title = btn.getAttribute('aria-label');
      if (val !== 'none') btn.style.background = val;

      btn.addEventListener('click', function () {
        Array.from(wrap.children).forEach(function (el) {
          el.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');

        var root  = document.documentElement;
        var scope = document.getElementById('aw-scope') || document.body;
        var cssVar = CSS_VAR_MAP[key];

        if (cssVar) {
          if (val === 'none') root.style.removeProperty(cssVar);
          else root.style.setProperty(cssVar, val);
        }

        if (CLASS_MAP[key]) {
          scope.classList.toggle(CLASS_MAP[key], val !== 'none');
        }

        if (key === 'selectionBg' || key === 'selectionText') {
          var hasSel = root.style.getPropertyValue('--aw-user-selection-bg') ||
                       root.style.getPropertyValue('--aw-user-selection-text');
          scope.classList.toggle('aw-has-selection', !!hasSel);
        }
      });

      wrap.appendChild(btn);
    });
  }

  function wireHooks(cfg) {
    var panel = document.getElementById('aw-panel');
    if (!panel) return;

    if (cfg.onOpen || cfg.onClose) {
      var wasOpen = panel.classList.contains('aw-open');
      new MutationObserver(function () {
        var isOpen = panel.classList.contains('aw-open');
        if (isOpen === wasOpen) return;
        wasOpen = isOpen;
        if (isOpen  && typeof cfg.onOpen  === 'function') cfg.onOpen();
        if (!isOpen && typeof cfg.onClose === 'function') cfg.onClose();
      }).observe(panel, { attributes: true, attributeFilter: ['class'] });
    }

    if (typeof cfg.onReset === 'function') {
      var resetBtn = panel.querySelector('[data-action="reset"]');
      if (resetBtn) resetBtn.addEventListener('click', function () {
        setTimeout(cfg.onReset, 0);
      });
    }

    if (typeof cfg.onLangChange === 'function' && window.AWIDGET_I18N) {
      var _setLang = window.AWIDGET_I18N.setLanguage.bind(window.AWIDGET_I18N);
      window.AWIDGET_I18N.setLanguage = function (code) {
        _setLang(code);
        cfg.onLangChange(code);
      };
    }

    if (typeof cfg.onThemeChange === 'function' && window.AWIDGET_THEME) {
      var _setTheme = window.AWIDGET_THEME.set.bind(window.AWIDGET_THEME);
      window.AWIDGET_THEME.set = function (theme) {
        _setTheme(theme);
        cfg.onThemeChange(theme);
      };
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  waitForWidget(init);

})();
