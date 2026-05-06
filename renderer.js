// ── Event listeners para botones de control de ventana ──────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const minimizeBtn = document.getElementById("minimize-btn");
  const closeBtn = document.getElementById("close-btn");

  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", () => {
      window.electron?.ipcRenderer?.send("minimize-window");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      // Mostrar confirmación antes de cerrar
      if (confirm("¿Estás seguro de que deseas cerrar la aplicación?")) {
        window.electron?.ipcRenderer?.send("close-window");
      }
    });
  }
});

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

// ── Burbuja del gato mascota ──────────────────────────────────────────────────
const catBubbleMessages = [
  "¡Elige una materia! 🐾",
  "¡Vamos a aprender! 🌟",
  "¡Tú puedes! 💪",
  "¡Qué divertido! 😸",
  "¡Soy tu amigo! 🐱",
];
let bubbleTimer = null;

function setCatBubble(text) {
  const bubble = document.getElementById("cat-bubble");
  if (!bubble) return;
  bubble.style.opacity = "0";
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => {
    bubble.textContent = text;
    bubble.style.animation = "none";
    void bubble.offsetHeight; // reflow para reiniciar animación
    bubble.style.animation = "bubblePop 0.4s ease-out";
    bubble.style.opacity = "1";
  }, 180);
}

// ── Volver al inicio ─────────────────────────────────────────────────────────
function goHome() {
  if (typeof stopNarration === "function") stopNarration();
  document.querySelectorAll(".submenu a.active").forEach((a) => a.classList.remove("active"));
  document.querySelectorAll(".menu-item.open").forEach((item) => item.classList.remove("open"));
  document.getElementById("game-view").style.display = "none";
  document.getElementById("welcome").style.display = "";
  setCatBubble("🏠 ¡De vuelta al inicio!");
}

// Gato + logo: clic en gato → mensaje, clic en logo → volver al inicio
document.addEventListener("DOMContentLoaded", () => {
  const cat = document.getElementById("cat-mascot");
  if (cat) {
    cat.addEventListener("click", () => {
      const msg = catBubbleMessages[Math.floor(Math.random() * catBubbleMessages.length)];
      setCatBubble(msg);
    });
  }
  const logo = document.querySelector(".sidebar-title");
  if (logo) {
    logo.title = "🏠 Volver al inicio";
    logo.addEventListener("click", goHome);
  }
});

// ── Inicializar ───────────────────────────────────────────────────────────────
buildSidebar();
const gameDescriptions = buildGameIndex();

// ── Mini-juego de globos en la pantalla de bienvenida ─────────────────────────
(function initBalloonGame() {
  const canvas = document.getElementById("balloon-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const EMOJIS = ["🎈", "🎀", "⭐", "🌟", "💜", "❤️", "💛", "💚", "💙", "🎊", "🎉", "🦋", "🌈", "🍭", "🍬"];
  const COLORS = [
    "#ff6b9d",
    "#c44dff",
    "#4d79ff",
    "#f1c40f",
    "#2ecc71",
    "#ff9f43",
    "#00cec9",
    "#fd79a8",
    "#6c5ce7",
    "#e17055",
  ];
  const POP_FX = ["💥", "✨", "🌟", "💫", "🎊", "🎉"];

  let balloons = [];
  let particles = [];
  let score = 0;
  let combo = 0;
  let comboTimer = null;
  let raf = null;

  // Combo label
  const comboEl = document.getElementById("balloon-combo-label");

  function showCombo(n) {
    if (!comboEl) return;
    if (n >= 3) {
      const labels = { 3: "🔥 x3 Combo!", 4: "⚡ x4 Super!", 5: "🌟 x5 Mega!", 6: "💥 x6 BOOM!" };
      comboEl.textContent = labels[Math.min(n, 6)] || `🎆 x${n} COMBO!`;
      comboEl.classList.add("show");
    } else {
      comboEl.classList.remove("show");
    }
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
      combo = 0;
      comboEl.classList.remove("show");
    }, 1200);
  }

  function updateScore(delta) {
    score += delta;
    const el = document.getElementById("balloon-score");
    if (el) el.textContent = score;
  }

  // Crear globo
  function spawnBalloon() {
    const r = 22 + Math.random() * 18;
    const x = r + Math.random() * (W - r * 2);
    const speed = 0.6 + Math.random() * 1.1;
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const wobble = Math.random() * Math.PI * 2;
    const wobbleSpeed = 0.02 + Math.random() * 0.02;
    balloons.push({ x, y: H + r, r, speed, emoji, color, wobble, wobbleSpeed, popped: false, opacity: 1 });
  }

  // Crear partículas de explosión
  function spawnParticles(x, y, color) {
    const fx = POP_FX[Math.floor(Math.random() * POP_FX.length)];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.035 + Math.random() * 0.03,
        r: 4 + Math.random() * 4,
        color,
        emoji: i === 0 ? fx : null,
      });
    }
  }

  // Dibujar un globo
  function drawBalloon(b) {
    if (b.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = b.opacity;
    // Sombra
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 8;
    // Cuerpo del globo
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.r, b.r * 1.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
    // Brillo
    ctx.beginPath();
    ctx.ellipse(b.x - b.r * 0.28, b.y - b.r * 0.4, b.r * 0.25, b.r * 0.2, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
    // Hilo
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.r * 1.2);
    ctx.quadraticCurveTo(b.x + Math.sin(b.wobble) * 8, b.y + b.r * 2, b.x, b.y + b.r * 2.8);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();
    // Emoji
    ctx.font = `${b.r * 0.95}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.emoji, b.x, b.y);
    ctx.restore();
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.life;
    if (p.emoji) {
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.emoji, p.x, p.y);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.restore();
  }

  // Bucle de animación
  let frameCount = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);

    // Fondo decorativo: nubes simples
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    [
      [80, 40, 50],
      [200, 70, 35],
      [380, 30, 45],
      [520, 60, 38],
      [600, 90, 28],
    ].forEach(([cx, cy, cr]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + cr * 0.7, cy - cr * 0.3, cr * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - cr * 0.7, cy - cr * 0.2, cr * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    frameCount++;
    // Spawn cada ~55 frames
    if (frameCount % 55 === 0 && balloons.filter((b) => !b.popped).length < 12) spawnBalloon();

    // Actualizar globos
    balloons.forEach((b) => {
      if (b.popped) {
        b.opacity -= 0.08;
        return;
      }
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.6;
      b.y -= b.speed;
    });
    balloons = balloons.filter((b) => b.opacity > 0 && b.y > -60);

    // Actualizar partículas
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravedad leve
      p.life -= p.decay;
    });
    particles = particles.filter((p) => p.life > 0);

    // Dibujar
    balloons.forEach(drawBalloon);
    particles.forEach(drawParticle);

    // Mensaje invitación si pocos globos
    if (balloons.filter((b) => !b.popped).length === 0) {
      ctx.save();
      ctx.font = "bold 22px 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(108,92,231,0.7)";
      ctx.fillText("¡Espera los globos! 🎈", W / 2, H / 2);
      ctx.restore();
    }
  }

  // Pop al hacer clic
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    let hit = false;
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      if (b.popped) continue;
      const dist = Math.hypot(mx - b.x, my - b.y);
      if (dist < b.r * 1.3) {
        b.popped = true;
        combo++;
        const points = combo >= 3 ? combo * 2 : 1;
        updateScore(points);
        showCombo(combo);
        spawnParticles(b.x, b.y, b.color);
        hit = true;
        break;
      }
    }
    if (!hit) {
      combo = 0;
      comboEl && comboEl.classList.remove("show");
    }
  });

  // Sembrar globos iniciales
  for (let i = 0; i < 6; i++) {
    spawnBalloon();
    const last = balloons[balloons.length - 1];
    last.y = H * 0.2 + Math.random() * H * 0.7;
  }

  loop();

  // Pausar cuando no es visible (juego activo)
  const observer = new MutationObserver(() => {
    const welcome = document.getElementById("welcome");
    if (welcome && welcome.style.display === "none") {
      cancelAnimationFrame(raf);
    } else if (welcome && welcome.style.display !== "none") {
      frameCount = 0;
      loop();
    }
  });
  const welcome = document.getElementById("welcome");
  if (welcome) observer.observe(welcome, { attributes: true, attributeFilter: ["style"] });
})();

// ── Mini-juegos didácticos de concentración y retroalimentación ───────────────
(function buildWelcomeMiniGames() {
  const panel = document.getElementById("wg-panel");
  const tilesWrap = document.getElementById("wg-tiles");
  const balloonWrap = document.querySelector(".welcome-game-wrap");
  if (!panel || !tilesWrap) return;

  function showTiles() {
    panel.style.display = "none";
    panel.innerHTML = "";
    tilesWrap.style.display = "flex";
    if (balloonWrap) balloonWrap.style.display = "";
  }

  function showPanel(html) {
    if (balloonWrap) balloonWrap.style.display = "none";
    tilesWrap.style.display = "none";
    panel.innerHTML = html;
    panel.style.display = "block";
    panel.querySelector(".wg-back-btn")?.addEventListener("click", showTiles);
  }

  // ── Juego 1: Memoria (concentración — parejas de emojis) ─────────────────
  function runMemoria() {
    const pool = ["🐱", "🐶", "🦋", "🌈", "⭐", "🎈", "🍭", "🌸", "🦄", "🎊"];
    const chosen = pool.slice(0, 6);
    const cards = [...chosen, ...chosen].sort(() => Math.random() - 0.5);
    let flipped = [],
      matched = 0,
      moves = 0,
      locked = false;

    showPanel(`
      <div class="wg-game-header">
        <button class="wg-back-btn">← Volver</button>
        <span class="wg-game-title">🧠 Memoria</span>
        <span class="wg-game-stat" id="mem-moves">👆 0 movimientos</span>
      </div>
      <div class="mem-grid" id="mem-grid"></div>
      <div class="wg-msg" id="wg-msg"></div>
    `);

    const grid = document.getElementById("mem-grid");
    cards.forEach((emoji) => {
      const btn = document.createElement("button");
      btn.className = "mem-card";
      btn.textContent = "❓";
      btn.dataset.emoji = emoji;
      btn.addEventListener("click", () => {
        if (locked || btn.classList.contains("matched") || btn.classList.contains("flipped")) return;
        btn.textContent = emoji;
        btn.classList.add("flipped");
        flipped.push(btn);
        if (flipped.length === 2) {
          locked = true;
          moves++;
          document.getElementById("mem-moves").textContent = `👆 ${moves} movimiento${moves !== 1 ? "s" : ""}`;
          if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
            flipped.forEach((c) => c.classList.add("matched"));
            matched += 2;
            flipped = [];
            locked = false;
            if (matched === cards.length) {
              const msg = document.getElementById("wg-msg");
              msg.textContent = `🎉 ¡Ganaste en ${moves} movimientos!`;
              msg.insertAdjacentHTML(
                "beforeend",
                ` <button class="wg-replay-btn" id="mem-replay" style="margin-left:10px">🔄 Otra vez</button>`,
              );
              document.getElementById("mem-replay")?.addEventListener("click", runMemoria);
            }
          } else {
            setTimeout(() => {
              flipped.forEach((c) => {
                c.textContent = "❓";
                c.classList.remove("flipped");
              });
              flipped = [];
              locked = false;
            }, 900);
          }
        }
      });
      grid.appendChild(btn);
    });
  }

  // ── Juego 2: Rompecabezas del Cauca (imágenes temáticas) ──────────────────
  function runRompecabezas() {
    const themes = [
      {
        title: "Volcán Purace",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <defs><linearGradient id='s' x1='0' x2='0' y1='0' y2='1'><stop offset='0%' stop-color='#87ceeb'/><stop offset='100%' stop-color='#d4f1ff'/></linearGradient></defs>
          <rect width='600' height='400' fill='url(#s)'/>
          <circle cx='500' cy='70' r='36' fill='#ffd166'/>
          <polygon points='130,360 300,120 470,360' fill='#5f5f72'/>
          <polygon points='252,188 300,120 348,188' fill='#ffffff'/>
          <ellipse cx='300' cy='100' rx='80' ry='26' fill='#e6e6e6'/>
          <ellipse cx='330' cy='84' rx='62' ry='20' fill='#f2f2f2'/>
          <rect y='350' width='600' height='50' fill='#64b66f'/>
        </svg>`,
      },
      {
        title: "Ciudad de Popayán",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <rect width='600' height='400' fill='#bde7ff'/>
          <rect y='300' width='600' height='100' fill='#a7c7a0'/>
          <rect x='80' y='160' width='130' height='140' fill='#fff'/>
          <rect x='240' y='130' width='140' height='170' fill='#fff'/>
          <rect x='410' y='175' width='110' height='125' fill='#fff'/>
          <rect x='286' y='90' width='46' height='40' fill='#f5f5f5'/>
          <rect x='160' y='220' width='24' height='40' fill='#b3d9ff'/>
          <rect x='280' y='200' width='24' height='40' fill='#b3d9ff'/>
          <rect x='330' y='200' width='24' height='40' fill='#b3d9ff'/>
          <rect x='445' y='220' width='24' height='40' fill='#b3d9ff'/>
          <path d='M285 90 h48 l-24 -40 z' fill='#e8e8e8'/>
          <text x='300' y='345' text-anchor='middle' font-size='30' fill='#444' font-family='Arial'>Popayan</text>
        </svg>`,
      },
      {
        title: "Bailes Típicos",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <rect width='600' height='400' fill='#ffe8d6'/>
          <rect y='320' width='600' height='80' fill='#f4a261'/>
          <circle cx='210' cy='130' r='30' fill='#f1c27d'/>
          <circle cx='390' cy='130' r='30' fill='#8d5524'/>
          <path d='M170 280 q40 -110 80 0 z' fill='#ff5d8f'/>
          <path d='M350 280 q40 -110 80 0 z' fill='#4d79ff'/>
          <rect x='203' y='160' width='14' height='80' fill='#f1c27d'/>
          <rect x='383' y='160' width='14' height='80' fill='#8d5524'/>
          <path d='M120 290 q90 -40 180 0' stroke='#d1495b' stroke-width='8' fill='none'/>
          <path d='M300 290 q90 -40 180 0' stroke='#2a9d8f' stroke-width='8' fill='none'/>
        </svg>`,
      },
      {
        title: "Chirimía",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <rect width='600' height='400' fill='#fefae0'/>
          <rect y='300' width='600' height='100' fill='#95d5b2'/>
          <circle cx='170' cy='140' r='26' fill='#f1c27d'/>
          <circle cx='300' cy='130' r='26' fill='#8d5524'/>
          <circle cx='430' cy='140' r='26' fill='#f1c27d'/>
          <rect x='162' y='165' width='16' height='80' fill='#f1c27d'/>
          <rect x='292' y='155' width='16' height='80' fill='#8d5524'/>
          <rect x='422' y='165' width='16' height='80' fill='#f1c27d'/>
          <rect x='120' y='210' width='100' height='16' rx='8' fill='#264653'/>
          <rect x='250' y='200' width='100' height='16' rx='8' fill='#e76f51'/>
          <circle cx='430' cy='220' r='34' fill='#2a9d8f'/>
          <circle cx='430' cy='220' r='18' fill='#fefae0'/>
        </svg>`,
      },
      {
        title: "Raíces Afro",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <rect width='600' height='400' fill='#f5efe6'/>
          <rect y='310' width='600' height='90' fill='#c0a98f'/>
          <circle cx='220' cy='135' r='38' fill='#5c3b2e'/>
          <circle cx='380' cy='135' r='38' fill='#3b251d'/>
          <path d='M180 280 q40 -110 80 0 z' fill='#ef476f'/>
          <path d='M340 280 q40 -110 80 0 z' fill='#118ab2'/>
          <circle cx='220' cy='85' r='26' fill='#1d1d1d'/>
          <circle cx='380' cy='85' r='26' fill='#1d1d1d'/>
          <text x='300' y='350' text-anchor='middle' font-size='28' fill='#5b3d2e' font-family='Arial'>Cultura Afro</text>
        </svg>`,
      },
      {
        title: "Comidas Típicas",
        svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'>
          <rect width='600' height='400' fill='#fff5e6'/>
          <rect y='310' width='600' height='90' fill='#ffd6a5'/>
          <ellipse cx='300' cy='250' rx='180' ry='70' fill='#ffffff' stroke='#e0e0e0' stroke-width='6'/>
          <circle cx='240' cy='240' r='42' fill='#f77f00'/>
          <circle cx='310' cy='230' r='32' fill='#e63946'/>
          <circle cx='360' cy='255' r='30' fill='#2a9d8f'/>
          <rect x='190' y='130' width='70' height='24' rx='12' fill='#f4a261'/>
          <rect x='280' y='130' width='90' height='24' rx='12' fill='#e76f51'/>
          <rect x='390' y='130' width='60' height='24' rx='12' fill='#f4a261'/>
        </svg>`,
      },
    ];

    const rows = 2;
    const cols = 3;
    const total = rows * cols;
    let orderThemes = [...themes].sort(() => Math.random() - 0.5);
    let themeIndex = 0;
    let solvedCount = 0;

    function imageUrl(svg) {
      return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
    }

    function shuffledPieces() {
      const arr = Array.from({ length: total }, (_, i) => i);
      do {
        arr.sort(() => Math.random() - 0.5);
      } while (arr.every((n, i) => n === i));
      return arr;
    }

    function renderTheme() {
      const gameEl = document.getElementById("puz-game");
      const titleEl = document.getElementById("puz-title");
      const statEl = document.getElementById("puz-stat");
      const msgEl = document.getElementById("puz-msg");
      if (!gameEl || !titleEl || !statEl || !msgEl) return;

      if (themeIndex >= orderThemes.length) {
        gameEl.innerHTML = `<div class="wg-final">
          <div class="wg-final-icon">🏆</div>
          <div class="wg-final-text">¡Completaste todos los rompecabezas del Cauca!</div>
          <button class="wg-replay-btn" id="puz-replay">🔄 Jugar de nuevo</button>
        </div>`;
        document.getElementById("puz-replay")?.addEventListener("click", runRompecabezas);
        titleEl.textContent = "Rompecabezas del Cauca";
        statEl.textContent = `✅ ${solvedCount}/${themes.length}`;
        msgEl.textContent = "";
        return;
      }

      const theme = orderThemes[themeIndex];
      let pieces = shuffledPieces();
      let moves = 0;
      let selectedIndex = -1;

      titleEl.textContent = `🧩 ${theme.title}`;
      statEl.textContent = `✅ ${solvedCount}/${themes.length}`;
      msgEl.textContent = "Intercambia dos piezas para armar la imagen.";

      function isSolved() {
        return pieces.every((val, idx) => val === idx);
      }

      function draw() {
        gameEl.innerHTML = "";
        const board = document.createElement("div");
        board.className = "puz-board";
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        pieces.forEach((pieceValue, slotIndex) => {
          const piece = document.createElement("button");
          piece.className = "puz-piece";
          if (slotIndex === selectedIndex) piece.classList.add("selected");
          const px = pieceValue % cols;
          const py = Math.floor(pieceValue / cols);
          piece.style.backgroundImage = imageUrl(theme.svg);
          piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
          piece.style.backgroundPosition = `${(px / (cols - 1)) * 100}% ${(py / (rows - 1)) * 100}%`;
          piece.addEventListener("click", () => {
            if (selectedIndex === -1) {
              selectedIndex = slotIndex;
              draw();
              return;
            }
            if (selectedIndex === slotIndex) {
              selectedIndex = -1;
              draw();
              return;
            }
            [pieces[selectedIndex], pieces[slotIndex]] = [pieces[slotIndex], pieces[selectedIndex]];
            selectedIndex = -1;
            moves++;
            draw();
            if (isSolved()) {
              solvedCount++;
              statEl.textContent = `✅ ${solvedCount}/${themes.length}`;
              msgEl.innerHTML = `🎉 ¡Listo en ${moves} movimientos! <button class="puz-next-btn" id="puz-next">Siguiente</button>`;
              document.querySelectorAll(".puz-piece").forEach((btn) => (btn.disabled = true));
              document.getElementById("puz-next")?.addEventListener("click", () => {
                themeIndex++;
                renderTheme();
              });
            }
          });
          board.appendChild(piece);
        });

        gameEl.appendChild(board);
      }

      draw();
    }

    showPanel(`
      <div class="wg-game-header">
        <button class="wg-back-btn">← Volver</button>
        <span class="wg-game-title" id="puz-title">🧩 Rompecabezas del Cauca</span>
        <span class="wg-game-stat" id="puz-stat">✅ 0/${themes.length}</span>
      </div>
      <div id="puz-game"></div>
      <div class="wg-msg" id="puz-msg"></div>
    `);
    renderTheme();
  }

  // ── Juego 3: ¡Cuántos hay! (retroalimentación numérica) ──────────────────
  function runCuenta() {
    const emojis = [
      "🐱",
      "🐶",
      "⭐",
      "🍎",
      "🎈",
      "🌸",
      "🦄",
      "🎊",
      "🍭",
      "🔥",
      "💎",
      "🎵",
      "🌺",
      "🐠",
      "🦊",
      "🍦",
      "🏀",
      "🎸",
      "🐸",
      "🦋",
    ];
    let round = 0,
      score = 0,
      total = 8;

    function renderRound() {
      const gameEl = document.getElementById("cnt-game");
      if (!gameEl) return;
      if (round >= total) {
        const icon = score >= 6 ? "🏆" : score >= 4 ? "⭐" : "💪";
        gameEl.innerHTML = `<div class="wg-final">
          <div class="wg-final-icon">${icon}</div>
          <div class="wg-final-text">¡Acertaste <strong>${score}</strong> de ${total}!</div>
          <button class="wg-replay-btn" id="cnt-replay">🔄 Jugar de nuevo</button>
        </div>`;
        document.getElementById("cnt-replay")?.addEventListener("click", runCuenta);
        return;
      }
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const count = 1 + Math.floor(Math.random() * 9); // 1-9

      // 3 wrong numbers near count, no repeats
      const candidates = [];
      for (let n = Math.max(1, count - 3); n <= count + 3; n++) {
        if (n !== count) candidates.push(n);
      }
      candidates.sort(() => Math.random() - 0.5);
      const answers = [count, ...candidates.slice(0, 3)].sort(() => Math.random() - 0.5);

      const emojiHtml = Array(count).fill(`<span>${emoji}</span>`).join("");
      gameEl.innerHTML = `
        <div class="cnt-display" id="cnt-display">${emojiHtml}</div>
        <p class="cnt-instruction">¿Cuántos ${emoji} hay?</p>
        <div class="cnt-options" id="cnt-opts"></div>
        <div class="wg-msg" id="cnt-msg"></div>
      `;
      const opts = document.getElementById("cnt-opts");
      answers.forEach((n) => {
        const btn = document.createElement("button");
        btn.className = "cnt-btn";
        btn.textContent = n;
        btn.addEventListener("click", () => {
          opts.querySelectorAll(".cnt-btn").forEach((b) => (b.disabled = true));
          if (n === count) {
            btn.classList.add("correct");
            score++;
            document.getElementById("cnt-score").textContent = `⭐ ${score}`;
            document.getElementById("cnt-msg").textContent = `✅ ¡Sí! Hay ${count} ${emoji}`;
          } else {
            btn.classList.add("wrong");
            opts.querySelectorAll(".cnt-btn").forEach((b) => {
              if (Number(b.textContent) === count) b.classList.add("correct");
            });
            document.getElementById("cnt-msg").textContent = `❌ Eran ${count} ${emoji}`;
          }
          round++;
          setTimeout(renderRound, 1200);
        });
        opts.appendChild(btn);
      });
    }

    showPanel(`
      <div class="wg-game-header">
        <button class="wg-back-btn">← Volver</button>
        <span class="wg-game-title">🔢 ¡Cuántos hay!</span>
        <span class="wg-game-stat" id="cnt-score">⭐ 0</span>
      </div>
      <div id="cnt-game"></div>
    `);
    renderRound();
  }

  // ── Juego 4: Leer cuentos afros con ilustración ────────────────────────────
  function runCuentos() {
    const cuentos = [
      {
        title: "La Marimba de la Abuela",
        pages: [
          {
            text: "En Guapi, Sara encontró una marimba antigua en la casa de su abuela.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#ffe8d6'/><circle cx='120' cy='120' r='45' fill='#8d5524'/><rect x='102' y='160' width='36' height='80' fill='#8d5524'/><rect x='220' y='170' width='220' height='20' rx='10' fill='#6d4c41'/><rect x='230' y='145' width='16' height='25' fill='#8d6e63'/><rect x='260' y='145' width='16' height='25' fill='#8d6e63'/><rect x='290' y='145' width='16' height='25' fill='#8d6e63'/><rect x='320' y='145' width='16' height='25' fill='#8d6e63'/><rect x='350' y='145' width='16' height='25' fill='#8d6e63'/><rect x='380' y='145' width='16' height='25' fill='#8d6e63'/></svg>`,
          },
          {
            text: "Cada golpe sonaba como el río: tum, tum, tum... y todo el barrio sonrió.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#d4f1ff'/><path d='M0 230 Q120 210 240 230 T480 230 T600 230 V320 H0 Z' fill='#4dabf7'/><circle cx='300' cy='120' r='52' fill='#f1c27d'/><path d='M250 210 q50 -90 100 0 z' fill='#ef476f'/><text x='460' y='90' font-size='34' fill='#2a9d8f' font-family='Arial'>Tum Tum</text></svg>`,
          },
          {
            text: "Desde entonces, Sara compartió su música para cuidar la alegría de su comunidad.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#fefae0'/><circle cx='170' cy='130' r='38' fill='#5c3b2e'/><circle cx='300' cy='130' r='38' fill='#8d5524'/><circle cx='430' cy='130' r='38' fill='#3b251d'/><path d='M130 240 q40 -90 80 0 z' fill='#118ab2'/><path d='M260 240 q40 -90 80 0 z' fill='#ef476f'/><path d='M390 240 q40 -90 80 0 z' fill='#06d6a0'/></svg>`,
          },
        ],
      },
      {
        title: "El Tambor del Manglar",
        pages: [
          {
            text: "Nando caminó por el manglar y escuchó un tambor que hablaba con el viento.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#e8f5e9'/><rect y='230' width='600' height='90' fill='#81c784'/><rect x='120' y='90' width='20' height='180' fill='#5d4037'/><rect x='300' y='70' width='20' height='200' fill='#5d4037'/><rect x='460' y='95' width='20' height='180' fill='#5d4037'/><ellipse cx='290' cy='210' rx='46' ry='38' fill='#8d6e63'/><ellipse cx='290' cy='210' rx='30' ry='24' fill='#bcaaa4'/></svg>`,
          },
          {
            text: "Siguió el ritmo y descubrió que los animales también bailaban en círculo.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#fff3e0'/><circle cx='300' cy='180' r='96' fill='#ffcc80'/><circle cx='230' cy='160' r='24' fill='#90caf9'/><circle cx='370' cy='160' r='24' fill='#a5d6a7'/><circle cx='300' cy='230' r='24' fill='#f48fb1'/><text x='280' y='80' font-size='36' fill='#ef6c00' font-family='Arial'>♪♪</text></svg>`,
          },
          {
            text: "Nando volvió al pueblo para enseñar que escuchar la naturaleza es sabiduría afro.",
            svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'><rect width='600' height='320' fill='#ede7f6'/><rect y='230' width='600' height='90' fill='#bcaaa4'/><circle cx='300' cy='120' r='50' fill='#3b251d'/><path d='M250 230 q50 -90 100 0 z' fill='#5e35b1'/><text x='300' y='285' text-anchor='middle' font-size='28' fill='#5d4037' font-family='Arial'>Sabiduria</text></svg>`,
          },
        ],
      },
    ];

    let cuentoIndex = 0;
    let pageIndex = 0;

    function pageUrl(svg) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    function renderSelectors() {
      const sel = document.getElementById("story-selectors");
      if (!sel) return;
      sel.innerHTML = "";
      cuentos.forEach((cuento, idx) => {
        const btn = document.createElement("button");
        btn.className = "story-chip";
        if (idx === cuentoIndex) btn.classList.add("active");
        btn.textContent = cuento.title;
        btn.addEventListener("click", () => {
          cuentoIndex = idx;
          pageIndex = 0;
          renderSelectors();
          renderPage();
        });
        sel.appendChild(btn);
      });
    }

    function renderPage() {
      const cuento = cuentos[cuentoIndex];
      const page = cuento.pages[pageIndex];
      const titleEl = document.getElementById("story-title");
      const statEl = document.getElementById("story-stat");
      const imgEl = document.getElementById("story-image");
      const textEl = document.getElementById("story-text");
      const prevBtn = document.getElementById("story-prev");
      const nextBtn = document.getElementById("story-next");
      if (!titleEl || !statEl || !imgEl || !textEl || !prevBtn || !nextBtn) return;

      titleEl.textContent = `📚 ${cuento.title}`;
      statEl.textContent = `📄 ${pageIndex + 1}/${cuento.pages.length}`;
      imgEl.src = pageUrl(page.svg);
      textEl.textContent = page.text;
      prevBtn.disabled = pageIndex === 0;
      nextBtn.textContent = pageIndex === cuento.pages.length - 1 ? "Finalizar" : "Siguiente";
    }

    showPanel(`
      <div class="wg-game-header">
        <button class="wg-back-btn">← Volver</button>
        <span class="wg-game-title" id="story-title">📚 Cuentos Afros</span>
        <span class="wg-game-stat" id="story-stat">📄 1/1</span>
      </div>
      <div class="story-selectors" id="story-selectors"></div>
      <div class="story-card">
        <img id="story-image" class="story-image" alt="Ilustración del cuento afro" />
        <p id="story-text" class="story-text"></p>
        <div class="story-actions">
          <button id="story-listen" class="story-action-btn">🔊 Escuchar</button>
          <button id="story-stop" class="story-action-btn stop">⏹️ Parar</button>
          <button id="story-prev" class="story-nav-btn">⬅️ Atrás</button>
          <button id="story-next" class="story-nav-btn">Siguiente ➡️</button>
        </div>
      </div>
    `);

    renderSelectors();
    renderPage();

    document.getElementById("story-listen")?.addEventListener("click", () => {
      const text = document.getElementById("story-text")?.textContent || "";
      if (typeof narrateText === "function") narrateText(text);
    });

    document.getElementById("story-stop")?.addEventListener("click", () => {
      if (typeof stopNarration === "function") stopNarration();
    });

    document.getElementById("story-prev")?.addEventListener("click", () => {
      if (pageIndex > 0) {
        pageIndex--;
        renderPage();
      }
    });

    document.getElementById("story-next")?.addEventListener("click", () => {
      const cuento = cuentos[cuentoIndex];
      if (pageIndex < cuento.pages.length - 1) {
        pageIndex++;
        renderPage();
      } else {
        pageIndex = 0;
        renderPage();
      }
    });
  }

  // Conectar tiles con juegos
  tilesWrap.addEventListener("click", (e) => {
    const tile = e.target.closest(".wg-tile");
    if (!tile) return;
    const game = tile.dataset.wg;
    if (game === "memoria") runMemoria();
    else if (game === "rompecabezas") runRompecabezas();
    else if (game === "cuenta") runCuenta();
    else if (game === "cuentos") runCuentos();
  });
})();

// Toggle submenús — actualiza burbuja del gato con el nombre de la materia
document.getElementById("menu").addEventListener("click", (e) => {
  const btn = e.target.closest(".menu-btn");
  if (!btn) return;
  const parent = btn.parentElement;
  const wasOpen = parent.classList.contains("open");
  document.querySelectorAll(".menu-item.open").forEach((item) => {
    if (item !== parent) item.classList.remove("open");
  });
  parent.classList.toggle("open");

  // Actualizar burbuja del gato
  const materia = menuConfig.find((m) => m.id === btn.dataset.target);
  if (materia) {
    setCatBubble(wasOpen ? "¡Elige una materia! 🐾" : `${materia.icon} ${materia.label}`);
  }
});

// Hover en submenú — gato muestra el nombre del juego
document.getElementById("menu").addEventListener("mouseover", (e) => {
  const link = e.target.closest(".submenu a");
  if (!link) return;
  const gameId = link.dataset.game;
  const info = gameDescriptions[gameId];
  if (info) setCatBubble(`🎮 ${info.title}`);
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

  // Gato celebra
  setCatBubble(`¡A jugar ${info.title}! 🎉`);

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
