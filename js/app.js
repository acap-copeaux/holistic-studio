/* ============================================================
   Holistic Studio — core JS
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ============================================================
   THEME SYSTEM
============================================================ */
function hsInitTheme() {
  let current = localStorage.getItem("holistic-theme") || "dark-1";
  document.body.setAttribute("data-theme", current);

  window.hsSetTheme = function(newTheme) {
    localStorage.setItem("holistic-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  window.hsToggleDarkLight = function() {
    let current = localStorage.getItem("holistic-theme") || "dark-1";
    const [mode, variant] = current.split("-");
    const newMode = mode === "dark" ? "light" : "dark";
    const newTheme = `${newMode}-${variant}`;
    localStorage.setItem("holistic-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };
}

/* ============================================================
   INTRO
============================================================ */
function hsInitIntro() {
  const overlay = document.getElementById("hs-intro-overlay");
  if (!overlay) return;

  setTimeout(() => {
    overlay.classList.add("fade-out");
    setTimeout(() => overlay.remove(), 400);
  }, 1200);
}

/* ============================================================
   MODULE LOADING
============================================================ */
async function hsLoadModuleHTML(moduleName) {
  const path = `${HS_APP_CONFIG.modulesPath}${moduleName}.html?_=${Date.now()}`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    return `<div class="card error">Impossible de charger : <strong>${moduleName}</strong></div>`;
  }
}

function hsCallModuleInit(moduleName, container) {
  const fn = window[`HS_${moduleName}_init`];
  if (typeof fn === "function") fn(container);
}

async function hsLoadModule(moduleName) {
  const container = document.querySelector("#module-container");
  const loader = document.getElementById("hs-loader");

  loader.style.display = "block";
  container.style.display = "none";

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  loader.style.display = "none";
  container.style.display = "block";

  hsCallModuleInit(moduleName, container);
}

/* ============================================================
   NAV
============================================================ */
function hsInitNavigation() {
  const buttons = document.querySelectorAll("[data-module]");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mod = btn.dataset.module;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      hsLoadModule(mod);
      document.body.classList.remove("sidebar-open");
    });
  });

  buttons[0].classList.add("active");
  hsLoadModule(HS_APP_CONFIG.defaultModule);
}

/* ============================================================
   SIDEBAR
============================================================ */
function hsToggleSidebar(force) {
  const body = document.body;
  const isOpen = body.classList.contains("sidebar-open");

  if (typeof force === "boolean") {
    force ? body.classList.add("sidebar-open") : body.classList.remove("sidebar-open");
    return;
  }

  isOpen ? body.classList.remove("sidebar-open") : body.classList.add("sidebar-open");
}

function hsInitSidebarGestures() {
  const backdrop = document.getElementById("hs-sidebar-backdrop");
  if (backdrop) backdrop.addEventListener("click", () => hsToggleSidebar(false));

  let startX = null;

  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX;
    if (x < 20) startX = x;
    else if (document.body.classList.contains("sidebar-open")) startX = x;
  });

  window.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;

    if (startX < 30 && dx > 60) hsToggleSidebar(true);
    if (document.body.classList.contains("sidebar-open") && dx < -60) hsToggleSidebar(false);

    startX = null;
  });
}

/* ============================================================
   SERVICE WORKER
============================================================ */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* ============================================================
   BOOT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  hsInitTheme();
  hsInitIntro();
  hsInitNavigation();
  hsInitSidebarGestures();
});
