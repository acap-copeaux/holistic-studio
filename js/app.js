/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Gestion des thèmes (6 thèmes dans un seul theme.css)
   - Bascule rapide clair/sombre (bouton persistant)
   - Navigation entre modules
   - Chargement HTML des modules
   - Initialisation
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ============================================================
   SYSTEME DE THEMES — 6 thèmes dans un seul theme.css
   Utilise body[data-theme="xxx"]
============================================================ */

function hsInitTheme() {

    // Thème actuel ou défaut
    let current = localStorage.getItem("holistic-theme") || "dark-1";

    // Appliquer au chargement
    document.body.setAttribute("data-theme", current);

    /* ---------------------------------------------------------
       Fonction globale pour changer complètement de thème
       (utilisée dans settings.html)
    --------------------------------------------------------- */
    window.hsSetTheme = function(newTheme) {
        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
    };

    /* ---------------------------------------------------------
       Fonction globale pour alterner clair ↔ sombre
       en conservant la variante 1 / 2 / 3
       (utilisée par le bouton persistant “Mode”)
    --------------------------------------------------------- */
    window.hsToggleDarkLight = function () {
        let current = localStorage.getItem("holistic-theme") || "dark-1";

        // découpe "dark-1" → ["dark", "1"]
        const [mode, variant] = current.split("-");

        // bascule sombre <-> clair
        const newMode = mode === "dark" ? "light" : "dark";
        const newTheme = `${newMode}-${variant}`;

        // sauvegarde + applique
        localStorage.setItem("holistic-theme", newTheme);
        document.body.setAttribute("data-theme", newTheme);
    };
}

/* ============================================================
   CHARGEMENT HTML D’UN MODULE — via fetch()
============================================================ */

async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Erreur de chargement HTML", moduleName, err);
    return `<div class="card error">Impossible de charger le module <strong>${moduleName}</strong>.</div>`;
  }
}

/* ============================================================
   INITIALISATION OPTIONNELLE D’UN MODULE JS
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
  if (!container) return;

  // Loader ON
  loader.style.display = "block";
  container.style.display = "none";

  // Charger
  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  // Loader OFF
  loader.style.display = "none";
  container.style.display = "block";

  // Callback JS interne éventuel
  hsCallModuleInit(moduleName, container);
}

/* ============================================================
   NAVIGATION — boutons data-module
============================================================ */

function hsInitNavigation() {
  const buttons = HS_utils.hs$all("[data-module]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      const mod = btn.dataset.module;

      // Surbrillance
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Charge module
      hsLoadModule(mod);
    });
  });

  // Module d’accueil
  const first = buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ============================================================
   BOOT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitNavigation();
});
