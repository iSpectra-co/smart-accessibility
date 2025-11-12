// --- Accessibility Widget standalone version ---
(function () {
  // Wait for AWIDGET and AWIDGET_I18N to load
  function waitForWidget(callback, retries = 30) {
    if (window.AWIDGET && window.AWIDGET_I18N) {
      callback();
    } else if (retries > 0) {
      setTimeout(() => waitForWidget(callback, retries - 1), 200);
    } else {
      console.warn("AWIDGET or AWIDGET_I18N did not load in time.");
    }
  }

  waitForWidget(() => {
    if (document.getElementById("aw-panel")) return;

    // Default widget settings
    const defaultSettings = {
      lang: { default: "fr" },
      theme: "light",
      position: "left",
      customThemeEnabled: false,
      tiles: {
        accessibilityStatement: {
          enabled: true,
          href: "https://www.google.com/",
          labels: {
            en: "Accessibility Statement",
            ar: "بيان إمكانية الوصول",
            fr: "Déclaration d’accessibilité",
          },
        },
      },
    };

    // Detect page language (fallback to default)
    const currentLang =
      document.documentElement.lang || defaultSettings.lang.default;
    defaultSettings.lang.default = currentLang;

    // Get widget position from localStorage
    function getWidgetPosition() {
      const stored = localStorage.getItem("awidget:position");
      return stored || defaultSettings.position;
    }

    // Add custom languages dynamically
    if (window.AWIDGET_I18N?.addLanguage) {
      window.AWIDGET_I18N.addLanguage("fr", {
        label: "🇫🇷 FR",
        rtl: false,
        pack: {
          title: "Menu d’accessibilité",
          language: "Langue",
          profiles: "Profils",
          colors: "Couleurs",
          typography: "Typographie",
          visuals: "Visuels",
          focusAids: "Aides à la mise au point",
          tools: "Outils",
          contrastPlus: "Modes de contraste",
          pauseAnimations: "Mettre les animations en pause",
          hideImages: "Masquer les images",
          highlightStructure: "Mettre en évidence la structure",
          fontSize: "Taille de la police",
          dyslexicFont: "Police pour la dyslexie",
          letterSpacing: "Espacement des lettres",
          textAlign: "Alignement du texte",
          cursor: "Type de curseur",
          rulerTitle: "Règle de lecture",
          focusTitle: "Masque de mise au point",
          cursorGuide: "Guide du curseur",
          guideSize: "Taille du guide",
          guideOpacity: "Opacité du guide",
          textColor: "Couleur du texte",
          linkColor: "Couleur des liens",
          headingColor: "Couleur du titre",
          speak: "Lire la sélection",
          stop: "Arrêter la voix",
          resetAll: "Réinitialiser tout",
          position: "Position",
          blind: "Cécité (lecteur d’écran)",
          colorBlind: "Daltonisme",
          dyslexia: "Dyslexie",
          lowVision: "Basse vision",
          adhd: "TDAH (concentration)",
          seizure: "Photosensibilité / épilepsie",
          selectionBackground: "Arrière-plan de la sélection de texte",
          selectionText: "Couleur du texte sélectionné",
          saturation: "Saturation",
          screenReader: "Lecteur d’écran",
          talktoWrite: "Parler pour écrire",
          accessibilityStatement: "Déclaration d’accessibilité",
          theme: "Thème",
          right: "Droite",
          left: "Gauche",
          auto: "Automatique",
          dark: "Sombre",
          light: "Clair",
          customTheme: "Personnalisé",
        },
      });
    }

    // Apply custom theme if enabled
    if (defaultSettings.customThemeEnabled) {
      const customThemeData = {
        name: "customTheme",
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

    // Set detected language
    window.AWIDGET_I18N?.setLanguage?.(currentLang);

    // Merge settings and mount widget
    const mergedSettings = {
      ...defaultSettings,
      theme: window.AWIDGET_THEME?.get?.() || defaultSettings.theme,
      lang: {
        default:
          window.AWIDGET_I18N?.getLanguage?.() || defaultSettings.lang.default,
      },
      position: getWidgetPosition(),
      extraData: { source: "Standalone Page", timestamp: Date.now() },
    };

    // Mount widget
    window.AWIDGET.mount({ settings: mergedSettings });

    // Apply position
    window.setAWIDGETPosition?.(mergedSettings.position);

    // Update tiles if available
    window.updateAWIDGETTiles?.(mergedSettings);

    console.info(
      `Accessibility widget mounted with ${currentLang} language.`,
      mergedSettings
    );
  });
})();