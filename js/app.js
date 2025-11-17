/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Navigation entre modules
   - Thème clair / sombre
   - Chargement HTML des modules
   ============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ===========================================
   THÈME CLAIR / SOMBRE — Version stable
=========================================== */
function hsInitTheme() {
    const toggle = document.querySelector("#theme-toggle");
    if (!toggle) return;

    // Thème par défaut : sombre
    let current = localStorage.getItem("holistic-theme") || "dark";

    hsApplyTheme(current);

    toggle.addEventListener("click", () => {
        current = current === "dark" ? "light" : "dark";
        localStorage.setItem("holistic-theme", current);
        hsApplyTheme(current);
    });
}

function hsApplyTheme(mode) {
    const dark = document.querySelector("#theme-dark");
    const light = document.querySelector("#theme-light");

    if (mode === "dark") {
        dark.disabled = false;
        light.disabled = true;
        document.body.dataset.theme = "dark";
    } else {
        dark.disabled = true;
        light.disabled = false;
        document.body.dataset.theme = "light";
    }
}

/* ---------- Chargement HTML d’un module ---------- */

async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Erreur de chargement HTML", moduleName, err);
    return HS_utils.hsErrorBox(`Impossible de charger le module <strong>${moduleName}</strong>.`);
  }
}

/* ---------- Initialisation d’un module déjà chargé en JS ---------- */
/* Convention : chaque module définit window.HS_<nom>_init(container)  */

function hsCallModuleInit(moduleName, container) {
  const fnName = `HS_${moduleName}_init`;
  const initFn = window[fnName];
  if (typeof initFn === "function") {
    initFn(container);
  }
}

/* ---------- Chargement complet d’un module ---------- */

async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  if (!container) return;

  container.innerHTML = `<div class="card">Chargement du module <strong>${moduleName}</strong>…</div>`;

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  hsCallModuleInit(moduleName, container);
}

/* ---------- Navigation ---------- */

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

  // Activer le premier bouton par défaut
  const first = buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitNavigation();
});
