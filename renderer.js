// ── Construir sidebar desde menuConfig (definido en menu-config.js) ──────────
function buildSidebar() {
  const menuEl = document.getElementById("menu");

  menuConfig.forEach((materia) => {
    const li = document.createElement("li");
    li.className = "menu-item";

    // Botón de la materia
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.dataset.target = materia.id;
    btn.innerHTML = `<span class="icon">${materia.icon}</span> ${materia.label} <span class="arrow">▸</span>`;
    li.appendChild(btn);

    // Submenú de juegos
    const ul = document.createElement("ul");
    ul.className = "submenu";
    ul.id = materia.id;

    materia.games.forEach((game) => {
      const subLi = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.dataset.game = game.id;
      a.textContent = game.label;
      subLi.appendChild(a);
      ul.appendChild(subLi);
    });

    li.appendChild(ul);
    menuEl.appendChild(li);
  });
}

// ── Índice de juegos construido desde menuConfig ──────────────────────────────
function buildGameIndex() {
  const index = {};
  menuConfig.forEach((materia) => {
    materia.games.forEach((game) => {
      index[game.id] = { title: game.label, desc: game.desc };
    });
  });
  return index;
}

// ── Inicializar ───────────────────────────────────────────────────────────────
buildSidebar();
const gameDescriptions = buildGameIndex();

// Toggle submenús
document.getElementById("menu").addEventListener("click", (e) => {
  const btn = e.target.closest(".menu-btn");
  if (!btn) return;
  const parent = btn.parentElement;
  document.querySelectorAll(".menu-item.open").forEach((item) => {
    if (item !== parent) item.classList.remove("open");
  });
  parent.classList.toggle("open");
});

// Click en juegos del submenú
document.getElementById("menu").addEventListener("click", (e) => {
  const link = e.target.closest(".submenu a");
  if (!link) return;
  e.preventDefault();

  const gameId = link.dataset.game;
  const info = gameDescriptions[gameId];
  if (!info) return;

  document.querySelectorAll(".submenu a.active").forEach((a) => a.classList.remove("active"));
  link.classList.add("active");

  document.getElementById("welcome").style.display = "none";
  const gameView = document.getElementById("game-view");
  gameView.style.display = "block";
  document.getElementById("game-title").textContent = info.title;
  document.getElementById("game-description").textContent = info.desc;

  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";
  // Detener cualquier audio en curso al cambiar de juego
  if (typeof stopNarration === "function") stopNarration();
  if (gameRenderers[gameId]) {
    gameRenderers[gameId](gameArea);
  } else {
    gameArea.textContent = `🎮 ¡Próximamente! El juego "${info.title}" estará disponible pronto.`;
  }
});
