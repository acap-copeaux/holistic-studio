/* ============================================================
   utils.js — Outils génériques Holistic Studio
   ============================================================ */

/* ---------- Sélecteurs DOM rapides ---------- */

function hs$(sel, root) {
  return (root || document).querySelector(sel);
}

function hs$all(sel, root) {
  return Array.from((root || document).querySelectorAll(sel));
}

/* ---------- Boîte d’erreur HTML ---------- */

function hsErrorBox(message) {
  return `
    <div class="card error-card">
      <h3>Erreur de chargement</h3>
      <p>${message}</p>
    </div>
  `;
}

/* ---------- Seed & RNG (mulberry32) ---------- */

function createSeed(str) {
  str = String(str || "");
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Export global ---------- */

window.HS_utils = {
  hs$,
  hs$all,
  hsErrorBox,
  createSeed,
  mulberry32
};
