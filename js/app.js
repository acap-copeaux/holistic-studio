/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Gestion des thèmes (6 thèmes dans un seul theme.css)
   - Bascule rapide clair/sombre
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

    window.hsSetTheme = function(newTheme) {
        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
    };

    window.hsToggleDarkLight = function () {
        let current = localStorage.getItem("holistic-theme") || "dark-1";
        const [mode, variant] = current.split("-");
        const newMode = mode === "dark" ? "light" : "dark";
        const newTheme = `${newMode}-${variant}`;

        // petit effet de fondu
        document.body.classList.add("theme-switching");
        setTimeout(() => {
          document.body.classList.remove("theme-switching");
        }, 400);

        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
    };
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

  // on laisse l'intro visible un court instant puis on la fade out
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
  hsInitNavigation();
  hsInitIntro();
});
