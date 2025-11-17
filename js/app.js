/* ============================================================
   app.js — Kernel Holistic Studio
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ================== THEMES ================== */

function hsInitTheme() {
  let current = localStorage.getItem("holistic-theme") || "dark-2"; // X-Vision par défaut
  document.body.setAttribute("data-theme", current);

  // Pour settings.html
  window.hsSetTheme = function (newTheme) {
    localStorage.setItem("holistic-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  // Bascule rapide clair/sombre en conservant la variante
  window.hsToggleDarkLight = function () {
    let cur = localStorage.getItem("holistic-theme") || "dark-2";
    const [mode, variant] = cur.split("-");
    const newMode = mode === "dark" ? "light" : "dark";
    const newTheme = `${newMode}-${variant}`;
    localStorage.setItem("holistic-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };
}

/* ================== UTILS MODULE ================== */

async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    console.error("Erreur module", moduleName, err);
    return `<div class="card error">Impossible de charger <strong>${moduleName}</strong>.</div>`;
  }
}

function hsCallModuleInit(moduleName, container) {
  const fn = window[`HS_${moduleName}_init`];
  if (typeof fn === "function") fn(container);
}

/* ================== CHARGEMENT MODULE ================== */

async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  const loader = HS_utils.hs$("#hs-loader");
  if (!container || !loader) return;

  loader.style.display = "block";
  container.style.display = "none";

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  loader.style.display = "none";
  container.style.display = "block";

  hsCallModuleInit(moduleName, container);
}

/* ================== NAVIGATION ================== */

function hsInitNavigation() {
  const buttons = HS_utils.hs$all("[data-module]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mod = btn.dataset.module;
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      hsLoadModule(mod);

      // fermeture sidebar mobile si ouverte
      document.body.classList.remove("sidebar-open");
    });
  });

  const first = buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ================== SIDEBAR ================== */

function hsToggleSidebar() {
  document.body.classList.toggle("sidebar-open");
}

function hsInitSidebar() {
  const backdrop = HS_utils.hs$("#hs-sidebar-backdrop");
  if (backdrop) backdrop.addEventListener("click", () => {
    document.body.classList.remove("sidebar-open");
  });

  // Gesture swipe depuis bord gauche (simple)
  let startX = null;
  window.addEventListener("touchstart", e => {
    if (e.touches[0].clientX < 24) startX = e.touches[0].clientX;
  });
  window.addEventListener("touchend", e => {
    if (startX !== null) {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 40) {
        document.body.classList.add("sidebar-open");
      }
    }
    startX = null;
  });
}

/* ================== BOOT ================== */

document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitSidebar();
  hsInitNavigation();
});
