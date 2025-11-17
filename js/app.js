/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Gestion des thèmes (6 thèmes dans un seul theme.css)
   - Bascule rapide clair/sombre
   - Réglages d'animations (intro, HUD, scan, hover)
   - Navigation
   - Chargement modules + loader premium
   - Animation d'intro Armor Vision
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ============================================================
   SYSTEME DE THEMES
============================================================ */
function hsInitTheme() {
    let current = localStorage.getItem("holistic-theme") || "dark-1";
    document.body.setAttribute("data-theme", current);

    // Change complètement de thème (boutons de settings)
    window.hsSetTheme = function(newTheme) {
        // petit effet de fondu
        document.body.classList.add("theme-switching");
        setTimeout(() => {
          document.body.classList.remove("theme-switching");
        }, 400);

        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
        hsTriggerScanEffect();
    };

    // Bascule rapide clair/sombre (bouton persistant)
    window.hsToggleDarkLight = function () {
        let current = localStorage.getItem("holistic-theme") || "dark-1";
        const [mode, variant] = current.split("-");
        const newMode = mode === "dark" ? "light" : "dark";
        const newTheme = `${newMode}-${variant}`;

        document.body.classList.add("theme-switching");
        setTimeout(() => {
          document.body.classList.remove("theme-switching");
        }, 400);

        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
        hsTriggerScanEffect();
    };
}

/* ============================================================
   SYSTEME D'ANIMATIONS (intro, HUD, scan, hover)
============================================================ */
function hsInitAnimations() {
    const b = document.body;

    const intro = localStorage.getItem("hs-anim-intro") || "on";
    const hud   = localStorage.getItem("hs-anim-hud")   || "full";
    const scan  = localStorage.getItem("hs-anim-scan")  || "light";
    const hover = localStorage.getItem("hs-anim-hover") || "on";

    b.dataset.animIntro = intro;
    b.dataset.animHud   = hud;
    b.dataset.animScan  = scan;
    b.dataset.animHover = hover;

    window.hsSetAnimIntro = function(mode) {
        localStorage.setItem("hs-anim-intro", mode);
        b.dataset.animIntro = mode;
        // si OFF, on supprime immédiatement l'intro si déjà présente
        const introEl = document.getElementById("hs-intro-overlay");
        if (mode === "off" && introEl && introEl.parentNode) {
            introEl.parentNode.removeChild(introEl);
        }
    };

    window.hsSetAnimHud = function(mode) {
        localStorage.setItem("hs-anim-hud", mode);
        b.dataset.animHud = mode;
    };

    window.hsSetAnimScan = function(mode) {
        localStorage.setItem("hs-anim-scan", mode);
        b.dataset.animScan = mode;
    };

    window.hsSetAnimHover = function(mode) {
        localStorage.setItem("hs-anim-hover", mode);
        b.dataset.animHover = mode;
    };
}

/* ============================================================
   SCAN VERTICAL HUD (au changement de thème)
============================================================ */
function hsTriggerScanEffect() {
    const mode = document.body.dataset.animScan || "light";
    if (mode === "off") return;

    const container = document.getElementById("module-container");
    if (!container) return;

    // Reset éventuel pour pouvoir relancer l'anim
    container.classList.remove("hud-scan-effect");
    // force reflow pour relancer l'animation
    void container.offsetWidth;
    container.classList.add("hud-scan-effect");

    setTimeout(() => {
        container.classList.remove("hud-scan-effect");
    }, 1800);
}

/* ============================================================
   CHARGEMENT HTML D’UN MODULE
============================================================ */
async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    return `<div class="card error">Impossible de charger <strong>${moduleName}</strong>.</div>`;
  }
}

/* ============================================================
   MODULE JS OPTIONNEL
============================================================ */
function hsCallModuleInit(moduleName, container) {
  const fn = window[`HS_${moduleName}_init`];
  if (typeof fn === "function") fn(container);
}

/* ============================================================
   CHARGEMENT COMPLET D’UN MODULE
============================================================ */
async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  const loader = HS_utils.hs$("#hs-loader");

  if (loader) {
    loader.style.display = "block";
  }
  container.style.display = "none";

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  if (loader) {
    loader.style.display = "none";
  }
  container.style.display = "block";

  hsCallModuleInit(moduleName, container);
}

/* ============================================================
   MENU LATERAL (sidebar) + gestes tactiles
============================================================ */

function hsToggleSidebar(force) {
  const body = document.body;
  const isOpen = body.classList.contains("sidebar-open");
  const shouldOpen = (typeof force === "boolean") ? force : !isOpen;

  if (shouldOpen) {
    body.classList.add("sidebar-open");
  } else {
    body.classList.remove("sidebar-open");
  }
}

function hsInitSidebarGestures() {
  const backdrop = document.getElementById("hs-sidebar-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => hsToggleSidebar(false));
  }

  let startX = null;

  window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const body = document.body;

    // ouverture par slide depuis le bord gauche
    if (!body.classList.contains("sidebar-open") && touch.clientX < 20) {
      startX = touch.clientX;
    }
    // fermeture par slide depuis n'importe où quand le menu est ouvert
    else if (body.classList.contains("sidebar-open")) {
      startX = touch.clientX;
    }
  });

  window.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const body = document.body;

    if (!body.classList.contains("sidebar-open") && startX < 30 && dx > 60) {
      // slide droite : ouvrir
      hsToggleSidebar(true);
    } else if (body.classList.contains("sidebar-open") && dx < -60) {
      // slide gauche : fermer
      hsToggleSidebar(false);
    }

    startX = null;
  });
}

/* ============================================================
   NAVIGATION
============================================================ */
function hsInitNavigation() {
  const buttons = HS_utils.hs$all("[data-module]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mod = btn.dataset.module;
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      hsLoadModule(mod);
    });
  });

  const first = buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ============================================================
   INTRO ARMOR VISION
============================================================ */
function hsInitIntro() {
  const intro = document.getElementById("hs-intro-overlay");
  if (!intro) return;

  // si animations d'intro désactivées, on enlève directement
  if (document.body.dataset.animIntro === "off") {
    if (intro.parentNode) intro.parentNode.removeChild(intro);
    return;
  }

  setTimeout(() => {
    intro.classList.add("hide");
  }, 1200);

  setTimeout(() => {
    if (intro && intro.parentNode) {
      intro.parentNode.removeChild(intro);
    }
  }, 2100);
}

/* ============================================================
   BOOT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitAnimations();
  hsInitNavigation();
  hsInitIntro();
});
