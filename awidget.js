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

  // ===== DOM helpers =====
  let mounted = false;

  // ===== CSS =====
  const CSS = `
  :root{
    --aw-user-heading: inherit;
  --aw-user-selection-bg: Highlight;
  --aw-user-selection-text: HighlightText;

    --aw-bg:#0b1220; --aw-panel:#111827; --aw-text:#f9fafb; --aw-muted:#9ca3af; --aw-accent:#60a5fa; --aw-border:#1f2937;
    --aw-user-bg: transparent; --aw-user-text: inherit; --aw-user-link: inherit;
    --aw-font-scale: 1;
    --aw-letter-spacing:.01em; --aw-shadow:0 10px 30px rgba(0,0,0,.45);
    --aw-contrast-filter: ; --aw-sat-filter: saturate(1);
    --aw-guide-color: var(--aw-accent); --aw-guide-opacity:.5; --aw-guide-thickness:2px; --aw-guide-band:44px; --aw-guide-spot:140px; --aw-guide-shadow:9999px;
  }
  :root[data-theme="dark"]{ --aw-bg:#0b1220; --aw-panel:#111827; --aw-text:#f9fafb; --aw-muted:#9ca3af; --aw-accent:#60a5fa; --aw-border:#1f2937; --aw-header:#0b1220; }
  :root[data-theme="light"]{ --aw-bg:#eff1f5; --aw-panel:#f9fafb; --aw-text:#111827; --aw-muted:#6b7280; --aw-accent:#2a3bd1; --aw-border:#e5e7eb; --aw-header:#2a3bd1; }

/* Remove any default --aw-user-* from :root */

/* Text color (only if chosen) */
#aw-scope.aw-has-text :where(
  p, li, blockquote, span, small, em, strong, b, i, code, kbd, mark,
  a, label, button, input, textarea, select,
  h1, h2, h3, h4, h5, h6,
  figcaption, caption, dd, dt, th, td, div
){
  color: var(--aw-user-text) !important;
}

/* Link color (only if chosen) */
#aw-scope.aw-has-link a {
  color: var(--aw-user-link) !important;
}

/* Heading color (only if chosen) */
#aw-scope.aw-has-heading :is(h1,h2,h3,h4,h5,h6){
  color: var(--aw-user-heading) !important;
}

/* Selection colors (only if chosen) */
#aw-scope.aw-has-selection ::selection{
  background: var(--aw-user-selection-bg);
  color: var(--aw-user-selection-text);
}
#aw-scope.aw-has-selection::-moz-selection{
  background: var(--aw-user-selection-bg);
  color: var(--aw-user-selection-text);
}



#aw-scope.aw-letter-wide :where(
  p, li, blockquote, span, a, label, button,
  input, textarea, select,
  h1, h2, h3, h4, h5, h6, small, em, strong, b, i, code, figcaption, caption
){
  letter-spacing: var(--aw-letter-spacing) !important;
}

/* Keep the widget crisp and interactive */
.aw-panel, .aw-panel * {
  filter: none !important;
}

#aw-scope.aw-filter-scope { will-change: filter; }


/* Only the page content inside #aw-scope is frozen */
#aw-scope.aw-noanim,
#aw-scope.aw-noanim * ,
#aw-scope.aw-noanim *::before,
#aw-scope.aw-noanim *::after {
  animation: none !important;
  animation-play-state: paused !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
#aw-scope.aw-noanim { scroll-snap-type: none !important; }
#aw-scope.aw-noanim * { scroll-snap-align: none !important; scroll-snap-stop: normal !important; }


  @media (prefers-reduced-motion: reduce){
    *{animation-duration:0.001s!important; animation-iteration-count:1!important; transition:none!important; scroll-behavior:auto!important}
  }


  .aw-panel{
  font-family:system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;
  margin:0;
  color:var(--aw-user-text, var(--aw-text));
  background:var(--aw-user-bg, var(--aw-bg));
  line-height:1.6;letter-spacing:var(--aw-letter-spacing);
  font-size:calc(16px * var(--aw-font-scale));
  position:fixed; contain:paint; isolation:isolate;
  }

  .aw-contrast-invert{--aw-contrast-filter: invert(1) hue-rotate(180deg)}
  .aw-contrast-dark{--aw-contrast-filter: contrast(1.2) brightness(.9)}
  .aw-contrast-light{--aw-contrast-filter: contrast(1.1) brightness(1.1)}

  .aw-noanim *, .aw-noanim *::before, .aw-noanim *::after{animation:none!important; transition:none!important}
/* Hide all site images EXCEPT the ones inside the widget */
.aw-hide-imgs img,
.aw-hide-imgs picture,
.aw-hide-imgs video,
.aw-hide-imgs figure,
.aw-hide-imgs svg {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity .2s;
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



  @font-face{font-family:'OpenDyslexic'; src:url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/otf/OpenDyslexic-Regular.otf') format('opentype'); font-display:swap}
  .aw-dyslexic{font-family:'OpenDyslexic'}
  .aw-highlight a{background:rgba(96,165,250,.2); outline:2px dashed var(--aw-accent)}
  .aw-highlight :is(h1,h2,h3,h4,h5,h6){background:rgba(16,185,129,.18); outline:2px dashed #10b981}

.aw-align-left :where(p, li, blockquote, h1, h2, h3, h4, h5, h6,div, section, article, span, a, label, figcaption, caption){
  text-align: left !important;
}

.aw-align-center :where(p, li, blockquote, h1, h2, h3, h4, h5, h6,div, section, article, span, a, label, figcaption, caption){
  text-align: center !important;
}

.aw-align-right :where(p, li, blockquote, h1, h2, h3, h4, h5, h6,div, section, article, span, a, label, figcaption, caption){
  text-align: right !important;
}

.aw-align-justify :where(p, li, blockquote, h1, h2, h3, h4, h5, h6,div, section, article, span, a, label, figcaption, caption){
  text-align: center !important;
}
/* Never touch the widget UI */
#aw-root span {
  text-align: center !important;
}

#aw-root span {
  text-align: center !important;
}
  .aw-cursor-big, .aw-cursor-big *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='6' cy='6' r='5' fill='white' stroke='black' stroke-width='2'/%3E%3C/svg%3E") 2 2, default!important}
  .aw-cursor-cross, .aw-cursor-cross *{cursor:crosshair !important}

  .aw-ruler{position:fixed;left:0;width:100vw;height:44px;pointer-events:none;z-index:2147483645;box-shadow:0 0 0 9999px rgba(0,0,0,.55) inset,0 0 0 2px var(--aw-accent);border-radius:4px;display:none}
  .aw-ruler.aw-on{display:block}
  .aw-focusmask{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:saturate(60%) blur(.5px);z-index:2147483644;display:none}
  .aw-focusmask.aw-on{display:block}
  .aw-guide-line{position:fixed;left:0;width:100vw;height:var(--aw-guide-thickness);background:var(--aw-guide-color);box-shadow:0 0 0 2px var(--aw-guide-color);pointer-events:none;z-index:2147483643;display:none}
  .aw-guide-bar{position:fixed;left:0;width:100vw;height:var(--aw-guide-band);background:color-mix(in srgb,var(--aw-guide-color) 25%, transparent);outline:2px solid var(--aw-guide-color);pointer-events:none;z-index:2147483643;display:none;border-radius:4px}
  .aw-guide-spot-wrap{position:fixed;inset:0;pointer-events:none;z-index:2147483642;display:none}
  .aw-guide-spot-wrap::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,var(--aw-guide-opacity));-webkit-mask:radial-gradient(circle var(--aw-guide-spot) at var(--gx) var(--gy), transparent 0 98%, #000 99%);mask:radial-gradient(circle var(--aw-guide-spot) at var(--gx) var(--gy), transparent 0 98%, #000 99%);box-shadow:0 0 0 var(--aw-guide-shadow) color-mix(in srgb, var(--aw-guide-color) 35%, transparent)}

  .aw-fab{position:fixed;right:16px;bottom:16px;width:56px;height:56px;border-radius:999px;background:var(--aw-header);color:var(--aw-panel);border:1px solid var(--aw-border);display:grid;place-items:center;cursor:pointer;z-index:2147483646;box-shadow:0 8px 20px rgba(0,0,0,.3)}
  .aw-fab:hover{box-shadow:0 10px 24px rgba(0,0,0,.4)}

  .aw-panel{position:fixed;
  right:0px;bottom:0;top:0;width:min(92vw,500px);background:var(--aw-bg);color:var(--aw-text);border:1px solid var(--aw-border);padding:12px;z-index:2147483647;box-shadow:var(--aw-shadow);opacity:0;pointer-events:none;transition:opacity .2s ease;overflow-y:auto;;scrollbar-color:var(--aw-accent) var(--aw-bg);padding-top:0}
  .aw-panel::-webkit-scrollbar{width:10px}
  .aw-panel::-webkit-scrollbar-track{background:#0f172a;border-radius:12px}
  .aw-panel::-webkit-scrollbar-thumb{background:linear-gradient(180deg, color-mix(in srgb,var(--aw-accent) 90%, transparent), color-mix(in srgb,var(--aw-accent) 60%, transparent));border-radius:12px;border:2px solid #0f172a}
  .aw-panel::-webkit-scrollbar-thumb:hover{filter:brightness(1.1)}
  .aw-panel.aw-open{opacity:1;pointer-events:auto}
  .aw-title{margin:0;font-size:16px;font-weight:700}
  .aw-close{background:transparent;border:0;color:var(--aw-text);font-size:20px;cursor:pointer;border-radius:8px;padding:4px}

  .aw-acc{
      box-shadow: 2px 1px 4px 3px var(--aw-border);
  border:1px solid var(--aw-border);border-radius:14px;margin:10px 0}
  .aw-acc > summary{list-style:none;cursor:pointer;user-select:none;padding:12px 14px;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:8px}
  .aw-acc > summary::marker{display:none}
  .aw-acc[open] > summary{background: rgba(96, 165, 250, .08);border-radius: 10px 10px 0 0}
  .aw-acc .acc-body{padding:10px 12px 14px}

  .aw-langgrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}
  .aw-langopt{appearance:none;-webkit-appearance:none;background:var(--aw-bg);border:1px solid var(--aw-border);color:var(--aw-text);padding:6px 8px;border-radius:10px;cursor:pointer;font-size:12px;line-height:1;text-align:center}
  .aw-langopt[aria-checked="true"]{border-color:var(--aw-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--aw-accent) 40%, transparent);background:linear-gradient(180deg, rgba(96,165,250,.12), rgba(96,165,250,.06))}

  .aw-section{font-size:12px;color:var(--aw-muted);margin:6px 2px 6px}
  .aw-grid{display:grid;grid-template-columns:1fr;gap:8px}
  @media(min-width:520px){.aw-grid{grid-template-columns:1fr 1fr 1fr}}
  .aw-grid-no{grid-template-columns:1fr}
  .aw-tile{background:var(--aw-panel);display:flex;flex-direction:column;gap:6px;padding:14px 12px;min-height:64px;border:1px solid var(--aw-border);border-radius:14px;cursor:pointer;user-select:none;outline:none}
  .aw-tile:hover{border-color:var(--aw-accent);box-shadow:0 0 0 3px rgba(96,165,250,.25);background:linear-gradient(to bottom right, rgba(96,165,250,.10), rgba(96,165,250,.05))}
  .aw-tile:focus-visible{outline:3px solid var(--aw-accent);outline-offset:2px}
  .aw-tile[aria-pressed="true"]{border-color:var(--aw-accent);box-shadow:0 0 0 3px rgba(96,165,250,.25);background:linear-gradient(to bottom right, rgba(96,165,250,.10), rgba(96,165,250,.05))}
  .aw-tile-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-direction:column}
  .aw-tile-title{font-size:14px;font-weight:600;text-align:center}
  .aw-ico{width:2rem;height:1.975rem;display:inline-flex}
  .aw-steps{margin-top:auto;display:flex;gap:4px;justify-content:center}
  .aw-step{width:6px;height:6px;border-radius:999px;background:rgba(255,255,255,.18)}
  .aw-step.on{background:var(--aw-accent)}

  .aw-footer{display:flex;gap:8px;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;flex-wrap:wrap;border-top:1px solid var(--aw-border)}
  .aw-btn{background:var(--aw-bg);color:var(--aw-text);border:1px solid var(--aw-border);border-radius:10px;padding:6px 10px;cursor:pointer}
  .aw-small{font-size:12px;padding:4px 8px;border-radius:8px}
  .aw-reset-wide{display:block;width:100%;margin-top:12px;background:linear-gradient(90deg,#ef4444, #f97316);border:0;color:white;font-weight:700;letter-spacing:.02em;padding:12px 14px;border-radius:12px;box-shadow:0 6px 16px rgba(239,68,68,.35)}
  .aw-reset-wide:hover{filter:brightness(1.05)}

  .aw-swatch-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
  .aw-swatch{width:28px;height:28px;border-radius:8px;border:2px solid #374151;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
  .aw-swatch[aria-pressed="true"]{outline:3px solid var(--aw-accent) !important;}
  .aw-swatch.none{background:repeating-conic-gradient(#aaa 0 25%, transparent 0 50%) 50%/8px 8px #222}

  .aw-acc > summary{position:relative;padding-right:34px;padding-left:34px}
  .aw-acc > summary::after{content:""; position:absolute; right:12px; top:50%; width:18px; height:18px; transform:translateY(-50%) rotate(-90deg); transition:transform .2s ease, opacity .2s ease; opacity:.9; background:var(--aw-muted);
    -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M8.12 4.71L6.71 6.12 12.59 12l-5.88 5.88 1.41 1.41L15.41 12 8.12 4.71z'/></svg>") no-repeat center/contain;
            mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M8.12 4.71L6.71 6.12 12.59 12l-5.88 5.88 1.41 1.41L15.41 12 8.12 4.71z'/></svg>") no-repeat center/contain;}
  .aw-acc[open] > summary::after{ transform:translateY(-50%) rotate(0deg); background:var(--aw-accent) }
  [dir="rtl"] .aw-acc > summary{ padding-right:34px; padding-left:34px }
  [dir="rtl"] .aw-acc > summary::after{ right:auto; left:12px; transform:translateY(-50%) scaleX(-1) rotate(-90deg) }
  [dir="rtl"] .aw-acc[open] > summary::after{ transform:translateY(-50%) scaleX(-1) rotate(0deg) }
  .aw-acc > summary::before{content:""; position:absolute; left:10px; top:50%; width:18px; height:18px; transform:translateY(-50%); background:currentColor; opacity:.9}
  [dir="rtl"] .aw-acc > summary::before{ left:auto; right:10px }
  .aw-acc[data-sec="language"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 7.75 6H13a17 17 0 0 0-1-4 8 8 0 0 1 0-2ZM12 20a8 8 0 0 1 0-16 17 17 0 0 0 0 16Zm2-2.1a15 15 0 0 1-1-3.9h6.75A8 8 0 0 1 14 17.9Zm-1-5.9a15 15 0 0 1 0-2h7.75a8 8 0 0 1 0 2H13Zm0-4a15 15 0 0 1 1-3.9A8 8 0 0 1 19.75 10H13Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 7.75 6H13a17 17 0 0 0-1-4 8 8 0 0 1 0-2ZM12 20a8 8 0 0 1 0-16 17 17 0 0 0 0 16Zm2-2.1a15 15 0 0 1-1-3.9h6.75A8 8 0 0 1 14 17.9Zm-1-5.9a15 15 0 0 1 0-2h7.75a8 8 0 0 1 0 2H13Zm0-4a15 15 0 0 1 1-3.9A8 8 0 0 1 19.75 10H13Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="profiles"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="visuals"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M5 10h6v2H5v-2Zm8 0h6v2h-6v-2ZM3 6h10v2H3V6Zm8 8h10v2H11v-2ZM3 18h6v2H3v-2Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M5 10h6v2H5v-2Zm8 0h6v2h-6v-2ZM3 6h10v2H3V6Zm8 8h10v2H11v-2ZM3 18h6v2H3v-2Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="typography"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M4 17h16v2H4v-2ZM10 5h4l4 10h-2.5l-1-2.5h-5L8 15H5l5-10Zm1.8 5h2.4L12 7.8 11.8 10Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M4 17h16v2H4v-2ZM10 5h4l4 10h-2.5l-1-2.5h-5L8 15H5l5-10Zm1.8 5h2.4L12 7.8 11.8 10Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="colors"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a3 3 0 1 1 0-6h1a2.5 2.5 0 0 0 0-5H12Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a3 3 0 1 1 0-6h1a2.5 2.5 0 0 0 0-5H12Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="focus"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M11 3h2v3h-2V3Zm0 15h2v3h-2v-3ZM3 11h3v2H3v-2Zm15 0h3v2h-3v-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'/></svg>") no-repeat center/contain; }
  .aw-acc[data-sec="tools"] > summary::before{ -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M22 12.3 18.7 9l-2.1.7-.8 2.1L19.7 15a6.5 6.5 0 0 1-10 3.4L7 21H4v-3l2.6-2.6A6.5 6.5 0 0 1 20 5.3l-4.2 4.2.7 2.2 2.2.6 3.3 3.3Z'/></svg>") no-repeat center/contain; mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='black' d='M22 12.3 18.7 9l-2.1.7-.8 2.1L19.7 15a6.5 6.5 0 0 1-10 3.4L7 21H4v-3l2.6-2.6A6.5 6.5 0 0 1 20 5.3l-4.2 4.2.7 2.2 2.2.6 3.3 3.3Z'/></svg>") no-repeat center/contain; }

/* Make the panel a 3-row container: header / scrollable body / sticky footer */
.aw-panel{
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 0;             /* header/body/footer handle their own padding */
  overflow: hidden;       /* the body will scroll instead */
  border-radius: 10px;
  border: none;
}

#aw-scope ::selection{
  background: var(--aw-user-selection-bg, Highlight);
  color: var(--aw-user-selection-text, HighlightText);
}
#aw-scope::-moz-selection{
  background: var(--aw-user-selection-bg, Highlight);
  color: var(--aw-user-selection-text, HighlightText);
}


/* Scroll only the body area */
.aw-body{
  overflow: auto;
  padding: 12px;          /* keep your inner spacing */
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
  background: rgba(255,255,255,0.1);
}

.aw-close svg {
  width: 20px;
  height: 20px;
  pointer-events: none;
}


/* Footer pinned to bottom *inside* the panel */
.aw-maintainer{
  position: sticky;
  bottom: 0;
  background: var(--aw-bg);
  color: var(--aw-text);
  border-top: 1px solid var(--aw-border);
  padding: 10px 12px;
  margin: 0;              /* remove the negative margins */
  width: auto;            /* let it fit the panel */
  z-index: 1;             /* sit above scroll content if needed */
}

  `;

  // ===== HTML (panel + overlays + fab) =====
  const HTML = `<button id="aw-fab" class="aw-fab" type="button" aria-haspopup="dialog" aria-controls="aw-panel">
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
      <path fill="currentColor" d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/>
    </svg>
  </button>
</div>
  <div class="aw-body">
    <details class="aw-acc" data-sec="language">
      <summary data-i18n="language">Language</summary>
      <div class="acc-body"><div id="aw-langgrid" class="aw-langgrid" role="radiogroup" aria-label="Language"></div></div>
    </details>

    <details class="aw-acc" data-sec="profiles" open>
      <summary data-i18n="profiles">Profiles</summary>
      <div class="acc-body">
        <div class="aw-grid">
          <div class="aw-tile" tabindex="0" role="button" data-profile="blind" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="blind">Blind</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-profile="colorblind" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="colorBlind">Color Blind</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-profile="dyslexia" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="dyslexia">Dyslexia</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-profile="lowvision" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="lowVision">Low Vision</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-profile="adhd" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="adhd">ADHD</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-profile="seizure" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="seizure">Seizure & Epileptic</span></div></div>
        </div>
      </div>
    </details>

    <details class="aw-acc" data-sec="visuals">
      <summary data-i18n="visuals">Visuals</summary>
      <div class="acc-body">
        <div class="aw-grid">
          <div class="aw-tile" tabindex="0" role="button" data-cycle="contrastPlus" data-steps="3" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="contrastPlus">Contrast Modes</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="saturation" data-steps="3" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title">Saturation</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="noanim" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="pauseAnimations">Pause Animations</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="hideimgs" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="hideImages">Hide Images</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="highlight" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="highlightStructure">Highlight Structure</span></div></div>
        </div>
      </div>
    </details>

    <details class="aw-acc" data-sec="typography">
      <summary data-i18n="typography">Typography</summary>
      <div class="acc-body">
        <div class="aw-grid">
          <div class="aw-tile" tabindex="0" role="button" data-cycle="fontLevel" data-steps="3" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="fontSize">Font Size</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="dyslexic" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="dyslexicFont">Dyslexia-Friendly Font</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="letterLevel" data-steps="2" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="letterSpacing">Letter Spacing</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="align" data-steps="3" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="textAlign">Text Alignment</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorIdx" data-steps="2" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="cursor">Pointer Type</span></div><div class="aw-steps"></div></div>
        </div>
      </div>
    </details>

<details class="aw-acc" data-sec="colors">
  <summary data-i18n="colors">Colors</summary>
  <div class="acc-body">
    <div class="aw-grid aw-grid-no">

      <div class="aw-tile" tabindex="-1" role="group" aria-label="Text color">
        <div class="aw-tile-head"><span class="aw-tile-title" data-i18n="textColor">Text Color</span></div>
        <div id="swatch-text" class="aw-swatch-row"></div>
      </div>

      <div class="aw-tile" tabindex="-1" role="group" aria-label="Link color">
        <div class="aw-tile-head"><span class="aw-tile-title" data-i18n="linkColor">Link Color</span></div>
        <div id="swatch-link" class="aw-swatch-row"></div>
      </div>

      <!-- NEW: Headings color -->
      <div class="aw-tile" tabindex="-1" role="group" aria-label="Heading color">
        <div class="aw-tile-head"><span class="aw-tile-title">Heading Color</span></div>
        <div id="swatch-heading" class="aw-swatch-row"></div>
      </div>

      <!-- NEW: Selection colors -->
      <div class="aw-tile" tabindex="-1" role="group" aria-label="Selection colors">
        <div class="aw-tile-head"><span class="aw-tile-title">Selection Background</span></div>
        <div id="swatch-selection-bg" class="aw-swatch-row"></div>
      </div>

      <div class="aw-tile" tabindex="-1" role="group" aria-label="Selection text color">
        <div class="aw-tile-head"><span class="aw-tile-title">Selection Text</span></div>
        <div id="swatch-selection-text" class="aw-swatch-row"></div>
      </div>

    </div>
  </div>
</details>


    <details class="aw-acc" data-sec="focus">
      <summary data-i18n="focusAids">Focus</summary>
      <div class="acc-body">
        <div class="aw-grid">
          <div class="aw-tile" tabindex="0" role="button" data-toggle="ruler" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="rulerTitle">Reading Ruler</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="focusmode" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="focusTitle">Focus Mask</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideMode" data-steps="3" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="cursorGuide">Cursor Reading Guide</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideSize" data-steps="2" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="guideSize">Guide Size</span></div><div class="aw-steps"></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-cycle="cursorGuideOpacity" data-steps="2" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="guideOpacity">Guide Opacity</span></div><div class="aw-steps"></div></div>
        </div>
      </div>
    </details>

    <details class="aw-acc" data-sec="tools">
      <summary data-i18n="tools">Tools</summary>
      <div class="acc-body">
        <div class="aw-grid">
          <div class="aw-tile" tabindex="0" role="button" data-action="read" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="speak">Read Selection Aloud</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-action="stop" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title" data-i18n="stop">Stop Speech</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-toggle="screenReader" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title">Screen Reader</span></div></div>
          <div class="aw-tile" tabindex="0" role="button" data-action="dictate" aria-pressed="false"><div class="aw-tile-head"><span class="aw-tile-title">Talk-to-Write</span></div></div>
          <a class="aw-tile" tabindex="0" role="button" href="#" onclick="alert('Demo link. Replace with your Accessibility Statement URL.');return false;"><div class="aw-tile-head"><span class="aw-tile-title">Accessibility Statement</span></div></a>
        </div>
      </div>
    </details>

    <div class="aw-footer">
      <div style="display:flex;gap:8px;align-items:center">
        <label class="aw-section">Theme</label>
        <select id="aw-theme" class="aw-btn aw-small" title="Theme">
          <option value="auto">Auto</option><option value="dark">Dark</option><option value="light">Light</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <label for="aw-side" class="aw-section" data-i18n="position">Position</label>
        <select id="aw-side" class="aw-btn aw-small" title="Snap to side"><option value="right">Right</option><option value="left">Left</option></select>
      </div>
      <span class="aw-section" id="aw-status" aria-live="polite"></span>
    </div>

    <button class="aw-btn aw-reset-wide" data-action="reset" data-i18n="resetAll">Reset all</button>
    </div>
    <div class="aw-maintainer">
      <a href="https://ispectra.co" title="Home" rel="home" class="site-logo d-block">
        <svg width="150" height="50" viewBox="0 0 132 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.01046 0.78418H0V21.219H7.01046V0.78418Z" fill="#222222"></path>
          <path d="M14.379 0.783936H9.70703V21.2188H14.379V0.783936Z" fill="#222222"></path>
          <path d="M19.3651 0.783936H17.0283V21.2188H19.3651V0.783936Z" fill="#222222"></path>
          <path d="M22.3193 16.7208L23.5282 15.9328C24.1586 18.3848 26.0259 20.0489 29.0484 20.0489C32.1238 20.0489 33.675 18.2978 33.675 15.9621C33.675 13.51 31.7293 12.5717 28.9172 11.5839C25.8419 10.4742 23.0818 9.5112 23.0818 5.94946C23.0818 2.59206 25.5258 0.461603 28.6548 0.461603C29.9175 0.4194 31.1616 0.808057 32.2193 1.57515C33.277 2.34225 34.0975 3.45092 34.5703 4.75182L33.3879 5.4849C33.0379 4.41565 32.3911 3.49743 31.541 2.86258C30.6908 2.22774 29.6811 1.90905 28.6573 1.95247C26.1076 1.95247 24.5043 3.6165 24.5043 5.89264C24.5043 8.34471 26.3708 9.09976 28.9989 10.0674C32.2591 11.2641 35.0984 12.4022 35.0984 15.9319C35.0984 19.3223 32.7055 21.537 29.0517 21.537C25.6051 21.537 23.1602 19.6109 22.3193 16.7208Z" fill="#222222"></path>
          <path d="M50.3688 7.12138C50.3858 7.95953 50.2487 8.79274 49.966 9.57012C49.6834 10.3475 49.261 11.0528 48.7247 11.6428C48.1884 12.2329 47.5495 12.6954 46.8468 13.0021C46.1442 13.3088 45.3927 13.4532 44.6381 13.4266H39.7747V21.2208H38.3818V0.786858H44.6381C45.3947 0.761002 46.1482 0.906959 46.8522 1.21577C47.5563 1.52458 48.1962 1.98974 48.7327 2.58278C49.2692 3.17582 49.691 3.88425 49.9723 4.66467C50.2536 5.44508 50.3886 6.28104 50.3688 7.12138ZM48.9751 7.12138C49.0004 6.47863 48.9059 5.83703 48.6975 5.23672C48.4892 4.63641 48.1714 4.09034 47.7642 3.63271C47.357 3.17509 46.8691 2.81576 46.331 2.57725C45.793 2.33873 45.2163 2.22615 44.6373 2.24657H39.7739V11.9678H44.6373C45.214 11.9878 45.7882 11.876 46.3243 11.6392C46.8604 11.4024 47.3469 11.0457 47.7536 10.5913C48.1604 10.1369 48.4786 9.59444 48.6886 8.99767C48.8986 8.40091 48.9958 7.76256 48.9743 7.1223L48.9751 7.12138Z" fill="#222222"></path>
          <path d="M64.4046 19.7582V21.2179H53.8105V0.783936H64.2735V2.24362H55.2034V10.1835H63.6158V11.6433H55.2034V19.7582H64.4046Z" fill="#222222"></path>
          <path d="M66.6382 10.9999C66.6155 9.60133 66.8482 8.21218 67.3222 6.91623C67.7962 5.62028 68.5018 4.44441 69.3963 3.45961C70.2908 2.47482 71.3558 1.70151 72.5268 1.18634C73.6979 0.671176 74.9508 0.424827 76.21 0.462191C77.7974 0.432578 79.3635 0.870766 80.7488 1.73209C82.134 2.59341 83.289 3.84709 84.0959 5.36544L82.8582 6.15346C82.1918 4.85407 81.2225 3.77804 80.0522 3.03842C78.8819 2.2988 77.5538 1.92293 76.2075 1.95032C74.0462 1.95032 71.9734 2.90375 70.4452 4.60087C68.9169 6.298 68.0583 8.59978 68.0583 10.9999C68.0583 13.4 68.9169 15.7018 70.4452 17.3989C71.9734 19.096 74.0462 20.0495 76.2075 20.0495C77.5702 20.0765 78.914 19.6915 80.0948 18.9356C81.2756 18.1798 82.2491 17.0815 82.911 15.7584L84.1487 16.5464C83.3473 18.0897 82.1883 19.3665 80.7923 20.2442C79.3962 21.1219 77.814 21.5685 76.21 21.5376C74.9508 21.5749 73.6979 21.3286 72.5268 20.8134C71.3558 20.2983 70.2908 19.5249 69.3963 18.5401C68.5018 17.5554 67.7962 16.3795 67.3222 15.0836C66.8482 13.7876 66.6155 12.3984 66.6382 10.9999Z" fill="#222222"></path>
          <path d="M98.4715 2.24389H92.6881V21.219H91.2688V2.24389H85.4854V0.78418H98.4715V2.24389Z" fill="#222222"></path>
          <path d="M108.564 12.84H102.754V21.2179H101.36V0.783965H108.616C109.936 0.779398 111.212 1.30958 112.206 2.27514C113.199 3.2407 113.842 4.57537 114.013 6.02912C114.183 7.48287 113.871 8.95592 113.134 10.1723C112.397 11.3886 111.286 12.2648 110.009 12.6366L114.583 21.2188H112.979L108.564 12.84ZM102.754 11.3803H108.613C109.704 11.3803 110.75 10.8989 111.522 10.0421C112.293 9.18533 112.727 8.02324 112.727 6.81153C112.727 5.59981 112.293 4.43772 111.522 3.58091C110.75 2.7241 109.704 2.24276 108.613 2.24276H102.754V11.3803Z" fill="#222222"></path>
          <path d="M128.07 16.0217H118.842L117.055 21.2181H115.583L122.734 0.78418H124.206L131.33 21.2181H129.858L128.07 16.0217ZM127.57 14.562L123.469 2.68094L119.369 14.562H127.57Z" fill="#222222"></path>
        </svg>
      </a>
    </div>
  </div>

  <div class="aw-ruler" id="aw-ruler"></div>
  <div class="aw-focusmask" id="aw-focus"></div>
  <div class="aw-guide-line" id="aw-guide-line"></div>
  <div class="aw-guide-bar"  id="aw-guide-bar"></div>
  <div class="aw-guide-spot-wrap" id="aw-guide-spot"></div>
  `;

  // ===== Logic (your script, packaged) =====
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

  // Theme
  let _themeMedia = null;
  const getStoredTheme = () => localStorage.getItem(THEME_KEY) || 'auto';
  const resolveAutoTheme = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  const applyThemeAttr = (mode) => { const resolved = (mode === 'auto') ? resolveAutoTheme() : mode; document.documentElement.setAttribute('data-theme', resolved); };
  const _onThemeChange = () => { if (getStoredTheme() === 'auto') applyThemeAttr('auto'); applyGuideStyles(); };

  // Custom themes
  const CustomThemes = new Map();
  function loadCustomThemes() { try { const raw = localStorage.getItem(THEMES_KEY); if (raw) { const obj = JSON.parse(raw) || {}; Object.entries(obj).forEach(([name, def]) => { if (def && typeof def === 'object') CustomThemes.set(name, def); }); } } catch { } }
  function saveCustomThemes() { try { const obj = {}; CustomThemes.forEach((def, name) => obj[name] = def); localStorage.setItem(THEMES_KEY, JSON.stringify(obj)); } catch { } }
  function clearInlineThemeVars() { const keys = ['--aw-bg', '--aw-panel', '--aw-text', '--aw-muted', '--aw-accent', '--aw-border', '--aw-header']; const root = document.documentElement; keys.forEach(k => root.style.removeProperty(k)); }
  function applyCustom(name) {
    const def = CustomThemes.get(name); if (!def) return;
    const base = (def.base === 'light' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', base);
    const root = document.documentElement;
    const vars = def.vars || {};
    Object.keys(vars).forEach(k => root.style.setProperty(k, vars[k]));
  }
  function rebuildThemeSelect() {
    const sel = document.getElementById('aw-theme'); if (!sel) return;
    Array.from(sel.querySelectorAll('optgroup[label="Custom"]')).forEach(g => g.remove());
    if (CustomThemes.size) {
      const group = document.createElement('optgroup'); group.label = 'Custom';
      [...CustomThemes.keys()].sort().forEach(name => {
        const opt = document.createElement('option'); opt.value = 'custom:' + name; opt.textContent = name; group.appendChild(opt);
      });
      sel.appendChild(group);
    }
    const current = getStoredTheme();
    const has = Array.from(sel.options).some(o => o.value === current);
    sel.value = has ? current : sel.value;
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
    try { localStorage.setItem(THEME_KEY, val); } catch { }
    if (_themeMedia) { try { _themeMedia.removeEventListener('change', _onThemeChange) } catch { } _themeMedia = null; }
    if (val === 'auto' && window.matchMedia) {
      _themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
      try { _themeMedia.addEventListener('change', _onThemeChange) } catch { }
    }
    if (isCustomMode(val)) { applyCustom(customNameFromMode(val)); }
    else { clearInlineThemeVars(); applyThemeAttr(val); }
    applyGuideStyles();
    const sel = document.getElementById('aw-theme'); if (sel && Array.from(sel.options).some(o => o.value === val)) sel.value = val;
  }
  function initThemeUI() {
    const sel = document.getElementById('aw-theme'); if (!sel) return;
    loadCustomThemes();
    rebuildThemeSelect();
    const current = getStoredTheme();
    if (isCustomMode(current) && !CustomThemes.has(customNameFromMode(current))) { try { localStorage.setItem(THEME_KEY, 'auto') } catch { } }
    const selected = getStoredTheme(); sel.value = selected; setTheme(selected);
    sel.addEventListener('change', e => { setTheme(e.target.value); save(); });
  }

  // i18n
  const LANG_KEY = 'awidget:lang';
  const LangRegistry = new Map();
  const isRTL = code => (LangRegistry.get(code)?.rtl) === true;
  const getStoredLang = () => localStorage.getItem(LANG_KEY) || 'en';
  const setStoredLang = code => { try { localStorage.setItem(LANG_KEY, code) } catch { } };
  const getActiveLang = () => { const code = getStoredLang(); return LangRegistry.has(code) ? code : 'en'; };
  const setDirByLang = (code) => { document.documentElement.setAttribute('dir', isRTL(code) ? 'rtl' : 'ltr'); document.documentElement.setAttribute('lang', code); };
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
  window.AWIDGET_I18N = { addLanguage, setLanguage: (code) => { setStoredLang(code); applyI18n(); buildLangGrid(); }, getLanguage: getActiveLang, list: () => [...LangRegistry.keys()] };
  function initI18n() { if (!localStorage.getItem(LANG_KEY)) setStoredLang('en'); buildLangGrid(); applyI18n(); }
  function autoDetectLang() { const html = (document.documentElement.getAttribute('lang') || '').toLowerCase(); const nav = (navigator.language || 'en').toLowerCase(); const pick = c => c ? c.split('-')[0] : 'en'; return pick(html || nav) }
  function getLang() { const v = getStoredLang(); return v === 'auto' ? autoDetectLang() : v.split('-')[0] }

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

  // === AW Own-Size Font Booster (v2: robust reset) ============================
  const BOOST_ATTR = 'data-aw-fb-delta';     // current applied delta (px)
  const ORIG_PX_ATTR = 'data-aw-fb-origpx';  // cached computed px baseline
  const ORIG_INLINE_ATTR = 'data-aw-fb-originline'; // original inline value (string or "")
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
    // inside reset handler:
state.colors = {}; // no defaults
applyUserColors(); // will remove vars and gate classes
    // Stop observing so nothing re-applies during cleanup
    if (mo) { mo.disconnect(); mo = null; }

    // Reset everything we know we touched
    for (const el of Array.from(touched.keys())) {
      if (el.isConnected) resetOne(el);
      else touched.delete(el);
    }

    // Safety pass: clean up any stragglers that still carry our attributes
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
  };

  // Apply
  function apply() {
    document.body.classList.add('aw-filter-scope');


    document.body.classList.toggle('aw-noanim', !!state.noanim);
    document.body.classList.toggle('aw-hide-imgs', !!state.hideimgs);
    document.body.classList.toggle('aw-highlight', !!state.highlight);
    document.body.classList.toggle('aw-dyslexic', !!state.dyslexic);
    document.body.classList.toggle('aw-focusmode', !!state.focusmode);

    // Build one combined filter string from contrast + saturation
    const contrast =
      state.contrastPlus === 1 ? 'invert(1) hue-rotate(180deg)' :
        state.contrastPlus === 2 ? 'contrast(1.2) brightness(.9)' :
          state.contrastPlus === 3 ? 'contrast(1.1) brightness(1.1)' :
            '';

    const sat = (['', 'grayscale(1)', 'saturate(.5)', 'saturate(1.6)'][state.saturation] || '');

    const combinedFilter = [contrast, sat].filter(Boolean).join(' ') || 'none';
    document.documentElement.style.setProperty('--aw-filter', combinedFilter);

    // Toggle filter only on the scoped page container
    const scope = document.getElementById('aw-scope') || document.body;
    if (combinedFilter !== 'none') {
      scope.classList.add('aw-filter-scope');
    } else {
      scope.classList.remove('aw-filter-scope');
    }

    const satMap = ['saturate(1)', 'grayscale(1)', 'saturate(.5)', 'saturate(1.6)'];
    document.documentElement.style.setProperty('--aw-sat-filter', satMap[state.saturation] || 'saturate(1)');

    document.body.classList.remove('aw-align-left', 'aw-align-center', 'aw-align-right', 'aw-align-justify');
    const alignIdx = Number(state.align) || 0; // 0 = off (no override)
    if (alignIdx > 0) {
      const alignMap = ['', 'aw-align-left', 'aw-align-right', 'aw-align-justify'];
      document.body.classList.add(alignMap[alignIdx]);
    }

    // Letter spacing
    const lsMap = [0, 0.02, 0.05]; // em
    const ls = lsMap[state.letterLevel || 0];

    // If 0: remove everything so the site’s original spacing remains untouched
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
    document.body.style.overflow = 'hidden';
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
  };
  function iconForTile(tile) { const k = tile.dataset.profile || tile.dataset.toggle || tile.dataset.cycle || tile.dataset.action; return ICONS[k] || null; }
  function attachIcons() { document.querySelectorAll('.aw-tile .aw-tile-head').forEach(head => { if (head.querySelector('.aw-ico')) return; const tile = head.closest('.aw-tile'); const svg = tile ? iconForTile(tile) : null; if (!svg) return; const span = head.querySelector('.aw-tile-title'); if (!span) return; span.insertAdjacentHTML('beforebegin', svg); }); }

  // ===== Mount / Unmount =====
  function injectStyle() { if (document.getElementById("aw-style")) return; const s = document.createElement('style'); s.id = "aw-style"; s.textContent = CSS; document.head.appendChild(s); }
  function injectHTML() { if (document.getElementById('aw-root')) return; const wrap = document.createElement('div'); wrap.id = "aw-root"; wrap.innerHTML = HTML; document.body.appendChild(wrap); }

  function initCore() {
    load();
    options = { ...defaultOptions, ...(window.AWIDGET_OPTIONS || {}) };
    loadCustomThemes();

    // Seed languages (EN/AR/ES)
    addLanguage('en', { label: '🇺🇸 EN', rtl: false, pack: { title: 'Accessibility Menu', language: 'Language', profiles: 'Profiles', colors: 'Colors', typography: 'Typography', visuals: 'Visuals', focusAids: 'Focus', tools: 'Tools', contrastPlus: 'Contrast Modes', pauseAnimations: 'Pause Animations', hideImages: 'Hide Images', highlightStructure: 'Highlight Structure', fontSize: 'Font Size', dyslexicFont: 'Dyslexia-Friendly Font', letterSpacing: 'Letter Spacing', textAlign: 'Text Alignment', cursor: 'Pointer Type', rulerTitle: 'Reading Ruler', focusTitle: 'Focus Mask', cursorGuide: 'Cursor Reading Guide', guideSize: 'Guide Size', guideOpacity: 'Guide Opacity', textColor: 'Text Color', linkColor: 'Link Color', speak: 'Read Selection Aloud', stop: 'Stop Speech', resetAll: 'Reset all', position: 'Position', blind: 'Blind', colorBlind: 'Color Blind', dyslexia: 'Dyslexia', lowVision: 'Low Vision', adhd: 'ADHD', seizure: 'Seizure & Epileptic' } });
    addLanguage('ar', { label: '🇸🇦 AR', rtl: true, pack: { title: 'قائمة إمكانية الوصول', language: 'اللغة', profiles: 'الملفات', colors: 'الألوان', typography: 'نص', visuals: 'مرئي', focusAids: 'تركيز', tools: 'أدوات', contrastPlus: 'أوضاع التباين', pauseAnimations: 'إيقاف الحركة', hideImages: 'إخفاء الصور', highlightStructure: 'إبراز البنية', fontSize: 'حجم الخط', dyslexicFont: 'خط عُسر القراءة', letterSpacing: 'تباعد الأحرف', textAlign: 'محاذاة النص', cursor: 'نوع المؤشر', rulerTitle: 'مسطرة القراءة', focusTitle: 'قناع التركيز', cursorGuide: 'مرشد المؤشر', guideSize: 'حجم المرشد', guideOpacity: 'عتامة المرشد', textColor: 'لون النص', linkColor: 'لون الروابط', speak: 'اقرأ التحديد', stop: 'إيقاف الصوت', resetAll: 'إعادة تعيين', position: 'الموضع', blind: 'كفيف (قارئ الشاشة)', colorBlind: 'عمى الألوان', dyslexia: 'عسر القراءة', lowVision: 'ضعف البصر', adhd: 'فرط الحركة (التركيز)', seizure: 'حساسية الضوء/الصرع' } });
    addLanguage('es', { label: '🇪🇸 ES', rtl: false, pack: { title: 'Menú de accesibilidad', language: 'Idioma', profiles: 'Perfiles', colors: 'Colores', typography: 'Tipografía', visuals: 'Visuales', focusAids: 'Enfoque', tools: 'Herramientas', contrastPlus: 'Modos de contraste', pauseAnimations: 'Pausar animaciones', hideImages: 'Ocultar imágenes', highlightStructure: 'Resaltar estructura', fontSize: 'Tamaño de fuente', dyslexicFont: 'Fuente para dislexia', letterSpacing: 'Espaciado de letras', textAlign: 'Alineación de texto', cursor: 'Tipo de puntero', rulerTitle: 'Regla de lectura', focusTitle: 'Máscara de enfoque', cursorGuide: 'Guía del puntero', guideSize: 'Tamaño de guía', guideOpacity: 'Opacidad de guía', textColor: 'Color del texto', linkColor: 'Color de enlaces', speak: 'Leer selección', stop: 'Detener voz', resetAll: 'Restablecer', position: 'Posición', blind: 'Ceguera (lector de pantalla)', colorBlind: 'Daltonismo', dyslexia: 'Dislexia', lowVision: 'Baja visión', adhd: 'TDAH (enfoque)', seizure: 'Convulsiones/Epiléptico' } });

    const lang = (function () { const v = getStoredLang(); return v === 'auto' ? autoDetectLang() : v.split('-')[0]; })();
    (function setDirByLangInit(code) { document.documentElement.setAttribute('dir', isRTL(code) ? 'rtl' : 'ltr'); document.documentElement.setAttribute('lang', code); })(lang);

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

    ensureScopeContainer();     // <-- add this line
    injectStyle();
    injectHTML();               // aw-root will be appended as a SIBLING of #aw-scope
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

  // --- Pause/resume JS animation engines (GSAP, ScrollTrigger, Lottie, Anime.js) ---
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

  // --- Your existing page-scope pause (CSS + media) ---
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

  // ===== Public API =====
  return {
    mount, unmount, open, close,
    // Advanced: passthrough to theme / i18n singletons you already expose
    theme: window.AWIDGET_THEME,
    i18n: window.AWIDGET_I18N
  };
}));
