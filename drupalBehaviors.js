(function ($, Drupal) {
  // --- Accessibility Widget behavior ---
  Drupal.behaviors.accessibilityWidget = {
    attach: function (context) {
      if (!window.AWIDGET || document.getElementById("aw-panel")) return;

      const defaultSettings = {
        lang: { default: "en" },
        theme: "dark",
        position: "right",
        customThemeEnabled: false,
        tiles: {
          accessibilityStatement: {
            enabled: true,
            href: "https://www.google.com/",
            labels: {
              en: "Accessibility Statement",
              ar: "بيان إمكانية الوصول",
            },
          },
        },
      };

      // --- Function to get dynamic position ---
      function getWidgetPosition() {
        const stored = localStorage.getItem("awidget:position");
        if (stored) return stored;
        return defaultSettings.position;
      }

      // --- Apply custom theme if enabled ---
      if (defaultSettings.customThemeEnabled) {
        const customThemeData = {
          name: "Mahdi",
          base: "light",
          vars: {
            "--aw-bg": "#f5f7fa",
            "--aw-panel": "#d0d8e6ff",
            "--aw-text": "#0e0512ff",
            "--aw-accent": "#3b82f6",
            "--aw-border": "#94a3b8",
            "--aw-header": "#3badf8ff",
            "--aw-muted": "#ff5500ff",
          },
        };

        window.AWIDGET_THEME?.add?.(customThemeData.name, {
          base: customThemeData.base,
          vars: customThemeData.vars,
        });
        window.AWIDGET_THEME?.set?.("custom:" + customThemeData.name);
      } else {
        window.AWIDGET_THEME?.set?.(defaultSettings.theme);
      }

      // --- Apply language dynamically ---
      window.AWIDGET_I18N?.setLanguage?.(defaultSettings.lang.default);

      // --- Merge all settings ---
      const mergedSettings = {
        ...defaultSettings,
        theme: window.AWIDGET_THEME?.get?.() || defaultSettings.theme,
        lang: {
          default:
            window.AWIDGET_I18N?.getLanguage?.() ||
            defaultSettings.lang.default,
        },
        position: getWidgetPosition(),
        extraData: {
          source: "Drupal Behavior",
          timestamp: Date.now(),
        },
      };

      // --- Mount widget ---
      window.AWIDGET.mount({ settings: mergedSettings });

      // --- Apply position using awidget.js function ---
      if (window.setAWIDGETPosition) {
        window.setAWIDGETPosition(mergedSettings.position);
      }

      // --- Update tiles if function exists ---
      if (window.updateAWIDGETTiles) {
        window.updateAWIDGETTiles(mergedSettings);
      }
    },
  };
})(jQuery, Drupal);
