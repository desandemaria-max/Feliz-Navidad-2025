// === Nombre por URL (?n=Ana) ===
const params = new URLSearchParams(location.search);
const nombreURL = (params.get("n") || "").trim().replace(/[<>]/g, "");
const nombreSpan = document.getElementById("nombre");
if (nombreSpan) nombreSpan.textContent = nombreURL; // vacío si no hay nombre
// === Panel de personalización (minimal) ===
const panel = document.getElementById("panel");
const openP = document.getElementById("openP");
const nameInput = document.getElementById("nameInput");
const applyBtn = document.getElementById("applyName");
openP?.addEventListener("click", () => {
  if (nombreURL) nameInput.value = nombreURL;
  panel.showModal();
});
applyBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const n = (nameInput.value || "").trim();
  if (nombreSpan) nombreSpan.textContent = n;
  const url = new URL(location.href);
  if (n) url.searchParams.set("n", n);
  else url.searchParams.delete("n");
  history.replaceState({}, "", url);
  panel.close();
});
// Cerrar el <dialog> al hacer clic fuera
panel?.addEventListener("click", (e) => {
  const r = panel.getBoundingClientRect();
  const clickFuera =
    e.clientX < r.left ||
    e.clientX > r.right ||
    e.clientY < r.top ||
    e.clientY > r.bottom;
  if (clickFuera) panel.close();
});
// Cerrar con Esc (compat extra)
panel?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") panel.close();
});
// === Compartir: copiar enlace + feedback ===
const statusEl = document.getElementById("status");
document.getElementById("share")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    if (statusEl) {
      statusEl.textContent = "Enlace copiado ✓";
      clearTimeout(statusEl._t);
      statusEl._t = setTimeout(() => {
        statusEl.textContent = "";
      }, 2200);
    }
  } catch {
    if (statusEl) {
      statusEl.textContent = "No se pudo copiar. Selecciona y copia la URL.";
      clearTimeout(statusEl._t);
      statusEl._t = setTimeout(() => {
        statusEl.textContent = "";
      }, 3000);
    }
  }
});
// === Nieve (función base) ===
const prefersReduce = window.matchMedia(
  "(prefers-reduced-motion:reduce)"
).matches;
function makeSnow(selector, flakes = 40, size = 7) {
  if (prefersReduce) return;
  const cont = document.querySelector(selector);
  if (!cont) return;
  for (let i = 0; i < flakes; i++) {
    const d = document.createElement("div");
    d.className = "flake";
    const startX = Math.random() * 100;
    d.style.left = startX + "vw";
    d.style.width = d.style.height = size + "px";
    d.style.setProperty("--x", startX + "vw");
    d.style.setProperty("--drift", Math.random() * 60 - 30 + "vw");
    d.style.setProperty("--dur", 7 + Math.random() * 6 + "s");
    d.style.animationDelay = Math.random() * 6 + "s";
    cont.appendChild(d);
  }
}
// Nieve detrás (suave)
makeSnow(".snow-back", 40, 7);

// Nieve delante (más presente)
makeSnow(".snow-front", 32, 8);
