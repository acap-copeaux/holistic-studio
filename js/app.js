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

/* ---------- Thème clair / sombre ---------- */

function hsInitTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("hs-theme") || "dark";
  document.body.dataset.theme = saved;
  btn.textContent = saved === "light" ? "Mode sombre" : "Mode clair";

  btn.addEventListener("click", () => {
    const current = document.body.dataset.theme || "dark";
    const next = current === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    btn.textContent = next === "light" ? "Mode sombre" : "Mode clair";
    localStorage.setItem("hs-theme", next);

    // Activer / désactiver les feuilles de style optionnelles
    const darkLink = document.getElementById("theme-dark");
    const lightLink = document.getElementById("theme-light");
    if (darkLink && lightLink) {
      if (next === "light") {
        darkLink.disabled = true;
        lightLink.disabled = false;
      } else {
        darkLink.disabled = false;
        lightLink.disabled = true;
      }
    }
  });

  // Appliquer cohérence CSS dès le début
  const darkLink = document.getElementById("theme-dark");
  const lightLink = document.getElementById("theme-light");
  if (darkLink && lightLink) {
    if (saved === "light") {
      darkLink.disabled = true;
      lightLink.disabled = false;
    } else {
      darkLink.disabled = false;
      lightLink.disabled = true;
    }
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
