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

// Gato parpadea y mueve la cola — clic en el gato muestra mensaje aleatorio
document.addEventListener("DOMContentLoaded", () => {
  const cat = document.getElementById("cat-mascot");
  if (cat) {
    cat.addEventListener("click", () => {
      const msg = catBubbleMessages[Math.floor(Math.random() * catBubbleMessages.length)];
      setCatBubble(msg);
    });
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

// ── Chips de materias en la bienvenida ────────────────────────────────────────
(function buildWelcomeChips() {
  const wrap = document.getElementById("welcome-chips");
  if (!wrap) return;
  const chipColors = [
    "linear-gradient(135deg,#a29bfe,#6c5ce7)",
    "linear-gradient(135deg,#fd79a8,#e84393)",
    "linear-gradient(135deg,#55efc4,#00b894)",
    "linear-gradient(135deg,#74b9ff,#0984e3)",
    "linear-gradient(135deg,#ffeaa7,#fdcb6e)",
  ];
  menuConfig.forEach((mat, i) => {
    const btn = document.createElement("button");
    btn.className = "welcome-chip";
    btn.style.background = chipColors[i % chipColors.length];
    btn.style.animationDelay = `${i * 0.08}s`;
    btn.innerHTML = `<span class="chip-icon">${mat.icon}</span>${mat.label}`;
    btn.addEventListener("click", () => {
      // Abrir la materia en el menú lateral y mostrar el primer juego
      const menuItem = document.querySelector(`.menu-btn[data-target="${mat.id}"]`);
      if (menuItem) {
        menuItem.click();
        setCatBubble(`${mat.icon} ${mat.label}`);
      }
    });
    wrap.appendChild(btn);
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
