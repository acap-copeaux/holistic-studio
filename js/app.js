/* ============================================================
   app.js — Kernel principal Holistic Studio
   - Thèmes (6 thèmes)
   - Animations (off / low / full)
   - Intro + loader + scanner
   - Navigation + sidebar + swipe
   - Chargement modules
============================================================ */

const HS_APP_CONFIG = {
  modulesPath: "./modules/",
  defaultModule: "analysis"
};

/* ============================================================
   THEME & ANIMATIONS
============================================================ */

function hsApplyTheme(themeId) {
  if (!themeId) themeId = "dark-2"; // défaut : sombre orange
  document.body.setAttribute("data-theme", themeId);
  localStorage.setItem("holistic-theme", themeId);
}

function hsApplyAnimLevel(level) {
  const valid = ["off", "low", "full"];
  if (!valid.includes(level)) level = "off";

  document.body.classList.remove("animations-off", "animations-low", "animations-full");
  document.body.classList.add("animations-" + level);
  localStorage.setItem("holistic-anim-level", level);
}

/* Exposées pour settings.html */
window.hsSetTheme = function (themeId) {
  hsApplyTheme(themeId);
};
window.hsGetTheme = function () {
  return document.body.getAttribute("data-theme") || "dark-2";
};

window.hsSetAnimations = function (level) {
  hsApplyAnimLevel(level);
};
window.hsGetAnimations = function () {
  if (document.body.classList.contains("animations-full")) return "full";
  if (document.body.classList.contains("animations-low")) return "low";
  return "off";
};

/* Bascule rapide clair / sombre (bouton lune) */
window.hsToggleDarkLight = function () {
  let current = window.hsGetTheme();
  const parts = current.split("-");
  let mode = parts[0];
  const variant = parts[1] || "2";

  mode = mode === "dark" ? "light" : "dark";
  const next = `${mode}-${variant}`;
  hsApplyTheme(next);
};

/* Initialisation thème + animations à partir du localStorage */
function hsInitThemeAndAnim() {
  const savedTheme = localStorage.getItem("holistic-theme") || "dark-2";
  const savedAnim = localStorage.getItem("holistic-anim-level") || "off";
  hsApplyTheme(savedTheme);
  hsApplyAnimLevel(savedAnim);
}

/* ============================================================
   INTRO OVERLAY
============================================================ */

function hsInitIntro() {
  const intro = document.getElementById("hs-intro-overlay");
  if (!intro) return;

  // Remplace le contenu existant par le logo + texte
  intro.innerHTML = `
    <img src="img/bear-totem.png" alt="Holistic Studio" class="intro-logo">
    <div class="intro-text">HOLISTIC STUDIO</div>
  `;

  // Laisse l'animation CSS gérer le fade-out (voir theme.css)
  setTimeout(() => {
    intro.style.display = "none";
  }, 3400); // ~2s d'anim + fade
}

/* ============================================================
   LOADER + SCANNER
============================================================ */

function hsShowLoader() {
  const loader = HS_utils.hs$("#hs-loader");
  const container = HS_utils.hs$("#module-container");
  if (!loader || !container) return;

  loader.style.display = "block";
  container.style.display = "none";
}

function hsHideLoader() {
  const loader = HS_utils.hs$("#hs-loader");
  const container = HS_utils.hs$("#module-container");
  if (!loader || !container) return;

  loader.style.display = "none";
  container.style.display = "block";
}

/* Injecte / retire la barre scanner */
function hsAttachScanner() {
  const container = HS_utils.hs$("#module-container");
  if (!container) return;

  // Nettoyage ancienne barre
  const old = container.querySelector(".scanner-line");
  if (old) old.remove();

  // Animations désactivées => rien
  if (document.body.classList.contains("animations-off")) return;

  const line = document.createElement("div");
  line.className = "scanner-line";
  container.appendChild(line);
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
    console.error("Erreur de chargement module", moduleName, err);
    return HS_utils.hsErrorBox(`Impossible de charger <strong>${moduleName}</strong>.`);
  }
}

/* Callback JS optionnel : window.HS_<module>_init */
function hsCallModuleInit(moduleName, container) {
  const fn = window[`HS_${moduleName}_init`];
  if (typeof fn === "function") {
    try {
      fn(container);
    } catch (e) {
      console.error("Erreur dans HS_" + moduleName + "_init", e);
    }
  }
}

/* Chargement complet d’un module */
async function hsLoadModule(moduleName) {
  const container = HS_utils.hs$("#module-container");
  if (!container) return;

  hsShowLoader();

  const html = await hsLoadModuleHTML(moduleName);
  container.innerHTML = html;

  hsHideLoader();
  hsAttachScanner();
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
      if (!mod) return;

      // Surbrillance globale
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      hsLoadModule(mod);
    });
  });

  // Module par défaut
  const first = HS_utils.hs$('[data-module="' + HS_APP_CONFIG.defaultModule + '"]') || buttons[0];
  if (first) {
    first.classList.add("active");
    hsLoadModule(HS_APP_CONFIG.defaultModule);
  }
}

/* ============================================================
   SIDEBAR + SWIPE
============================================================ */

function hsOpenSidebar() {
  const sidebar = document.getElementById("hs-sidebar");
  const backdrop = document.getElementById("hs-sidebar-backdrop");
  if (!sidebar || !backdrop) return;
  sidebar.classList.add("open");
  backdrop.classList.add("visible");
}

function hsCloseSidebar() {
  const sidebar = document.getElementById("hs-sidebar");
  const backdrop = document.getElementById("hs-sidebar-backdrop");
  if (!sidebar || !backdrop) return;
  sidebar.classList.remove("open");
  backdrop.classList.remove("visible");
}

window.hsToggleSidebar = function () {
  const sidebar = document.getElementById("hs-sidebar");
  if (!sidebar) return;
  if (sidebar.classList.contains("open")) hsCloseSidebar();
  else hsOpenSidebar();
};

function hsInitSidebarSwipe() {
  const zone = document.createElement("div");
  zone.className = "sidebar-swipe-zone";
  document.body.appendChild(zone);

  let startX = null;
  let tracking = false;

  zone.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches.length) return;
    startX = e.touches[0].clientX;
    tracking = true;
  });

  zone.addEventListener("touchmove", (e) => {
    if (!tracking || startX == null) return;
    const x = e.touches[0].clientX;
    const delta = x - startX;
    if (delta > 40) {
      tracking = false;
      hsOpenSidebar();
    }
  });

  zone.addEventListener("touchend", () => {
    tracking = false;
    startX = null;
  });

  // Swipe pour fermer depuis l'intérieur du sidebar
  const sidebar = document.getElementById("hs-sidebar");
  if (sidebar) {
    let closeStartX = null;
    sidebar.addEventListener("touchstart", (e) => {
      if (!e.touches || !e.touches.length) return;
      closeStartX = e.touches[0].clientX;
    });
    sidebar.addEventListener("touchmove", (e) => {
      if (closeStartX == null) return;
      const x = e.touches[0].clientX;
      const delta = x - closeStartX;
      if (delta < -40) {
        closeStartX = null;
        hsCloseSidebar();
      }
    });
    sidebar.addEventListener("touchend", () => {
      closeStartX = null;
    });
  }

  // Backdrop + ESC pour fermer
  const backdrop = document.getElementById("hs-sidebar-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", hsCloseSidebar);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hsCloseSidebar();
  });
}

/* ============================================================
   BOOTSTRAP
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  hsInitThemeAndAnim();
  hsInitIntro();
  hsInitNavigation();
  hsInitSidebarSwipe();
});
