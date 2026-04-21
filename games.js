// ── Registro de funciones que renderizan cada juego ──────────────────────────
// Cada función recibe el elemento contenedor (game-area) y lo llena.
const gameRenderers = {};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  LENGUAJE — Fauna y Flora del Cauca                             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Datos compartidos: palabras de fauna y flora del Cauca ───────────────────
const caucaWords = [
  {
    word: "CÓNDOR",
    syllables: ["CÓN", "DOR"],
    type: "fauna",
    emoji: "🦅",
    color: "#d5f5e3",
    desc: "Ave majestuosa que vuela en los Andes del Cauca",
  },
  {
    word: "ORQUÍDEA",
    syllables: ["OR", "QUÍ", "DE", "A"],
    type: "flora",
    emoji: "🌸",
    color: "#fce4ec",
    desc: "Flor exótica que crece en los bosques del Cauca",
  },
  {
    word: "GUADUA",
    syllables: ["GUA", "DU", "A"],
    type: "flora",
    emoji: "🎋",
    color: "#e8f5e9",
    desc: "Bambú gigante típico del paisaje caucano",
  },
  {
    word: "COLIBRÍ",
    syllables: ["CO", "LI", "BRÍ"],
    type: "fauna",
    emoji: "🐦",
    color: "#e3f2fd",
    desc: "Pequeña ave que se alimenta del néctar de las flores",
  },
  {
    word: "TUCÁN",
    syllables: ["TU", "CÁN"],
    type: "fauna",
    emoji: "🦜",
    color: "#fff8e1",
    desc: "Ave de pico grande y colorido de la selva caucana",
  },
  {
    word: "CEDRO",
    syllables: ["CE", "DRO"],
    type: "flora",
    emoji: "🌲",
    color: "#e8f5e9",
    desc: "Árbol noble de los bosques del Cauca",
  },
  {
    word: "DANTA",
    syllables: ["DAN", "TA"],
    type: "fauna",
    emoji: "🦛",
    color: "#f3e5f5",
    desc: "Mamífero grande también llamado tapir",
  },
  {
    word: "CEIBA",
    syllables: ["CEI", "BA"],
    type: "flora",
    emoji: "🌳",
    color: "#e8f5e9",
    desc: "Árbol gigante sagrado de las comunidades del Cauca",
  },
  {
    word: "ARMADILLO",
    syllables: ["AR", "MA", "DI", "LLO"],
    type: "fauna",
    emoji: "🦔",
    color: "#fff3e0",
    desc: "Animal con caparazón que vive en el Cauca",
  },
  {
    word: "HELECHO",
    syllables: ["HE", "LE", "CHO"],
    type: "flora",
    emoji: "🌿",
    color: "#e8f5e9",
    desc: "Planta antigua de los bosques húmedos caucanos",
  },
  {
    word: "GUACAMAYA",
    syllables: ["GUA", "CA", "MA", "YA"],
    type: "fauna",
    emoji: "🦚",
    color: "#e8eaf6",
    desc: "Ave de plumaje rojo, azul y amarillo",
  },
  {
    word: "BROMELIA",
    syllables: ["BRO", "ME", "LI", "A"],
    type: "flora",
    emoji: "🌺",
    color: "#fce4ec",
    desc: "Planta que crece sobre los árboles del Cauca",
  },
  {
    word: "ROBLE",
    syllables: ["RO", "BLE"],
    type: "flora",
    emoji: "🍂",
    color: "#fff8e1",
    desc: "Árbol fuerte de las montañas caucanas",
  },
  {
    word: "ZARIGÜEYA",
    syllables: ["ZA", "RI", "GÜE", "YA"],
    type: "fauna",
    emoji: "🐁",
    color: "#f5f5f5",
    desc: "Marsupial nocturno de los bosques del Cauca",
  },
  {
    word: "FRAILEJÓN",
    syllables: ["FRAI", "LE", "JÓN"],
    type: "flora",
    emoji: "🌱",
    color: "#e8f5e9",
    desc: "Planta del páramo que retiene agua",
  },
];

// ── Utilidades compartidas ───────────────────────────────────────────────────
function narrateText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "es-CO";
  utt.rate = 0.85;
  utt.pitch = 1.1;
  window.speechSynthesis.speak(utt);
}

function stopNarration() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  // Detener Web Audio (instrumentos, ritmos, melodías)
  if (globalThis._artCtx && globalThis._artCtx.state !== "closed") {
    globalThis._artCtx.suspend();
  }
  // Detener el flag de ritmos musicales
  globalThis._ritmoStopFlag = true;
  // Detener el flag de melodías de pistas offline
  globalThis._melStopFlag = true;
}

function getMedal(pct) {
  if (pct >= 90) return { icon: "🥇", label: "Maestro Lector", color: "#f1c40f" };
  if (pct >= 70) return { icon: "🥈", label: "Gran Lector", color: "#bdc3c7" };
  if (pct >= 50) return { icon: "🥉", label: "Lector Explorador", color: "#e67e22" };
  return { icon: "📖", label: "Aprendiz", color: "#a29bfe" };
}

function renderMedal(score, total, area, gameId) {
  const pct = Math.round((score / total) * 100);
  const medal = getMedal(pct);
  area.innerHTML = `
    <div class="game-result medal-result fadeIn">
      <div class="medal-badge bounce" style="font-size:4rem;">${medal.icon}</div>
      <h2 style="color:${medal.color};">Nivel: ${medal.label}</h2>
      <p>Sílabas correctas: <strong>${score}</strong> de <strong>${total}</strong> (${pct}%)</p>
      <div class="medal-stars">
        ${"⭐".repeat(Math.ceil(pct / 25))}
      </div>
      <button class="game-btn" onclick="gameRenderers['${gameId}'](this.closest('.game-area'))">Jugar de nuevo</button>
    </div>`;
  narrateText(`¡Felicidades! Obtuviste nivel ${medal.label} con ${score} de ${total} sílabas correctas.`);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── 1. Conciencia Fonológica ─────────────────────────────────────────────────
// El niño escucha la palabra y debe separar las sílabas correctamente
gameRenderers["conciencia-fonologica"] = function (area) {
  const pool = shuffle([...caucaWords]).slice(0, 8);
  let current = 0,
    totalSyllables = 0,
    correctSyllables = 0;
  pool.forEach((w) => (totalSyllables += w.syllables.length));

  function render() {
    if (current >= pool.length) {
      renderMedal(correctSyllables, totalSyllables, area, "conciencia-fonologica");
      return;
    }
    const item = pool[current];
    const typeLabel = item.type === "fauna" ? "🐾 Fauna" : "🌿 Flora";

    // Generar opciones de sílabas: las correctas + distractores
    const distractors = ["PA", "LO", "MI", "TRE", "SEN", "FU", "BI", "NOR", "PLA", "GRI"];
    const allSyllables = shuffle([...item.syllables, ...shuffle(distractors).slice(0, 3)]);
    let chosen = [];

    area.innerHTML = `
      <div class="fono-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">${typeLabel} del Cauca</span>
          <span class="math-score">Sílabas: ${correctSyllables} | Palabra ${current + 1}/${pool.length}</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin:10px 0;background:${item.color};border-radius:16px;padding:12px 18px;border:2px solid rgba(0,0,0,0.07);">
          <div style="font-size:5.5rem;line-height:1;text-shadow:0 2px 6px rgba(0,0,0,0.12);flex-shrink:0;">${item.emoji}</div>
          <div style="flex:1;">
            <div class="fono-word-display" style="margin:0 0 4px;">
              <span class="fono-word bounce">${item.word}</span>
              <button class="fono-audio-btn" id="fono-listen" title="Escuchar">🔊</button>
              <button class="fono-audio-btn" id="fono-stop" title="Parar" style="background:#e74c3c;">⏹️</button>
            </div>
            <p class="fono-desc" style="margin:0;font-size:0.88rem;">${item.desc}</p>
          </div>
        </div>
        <p class="fono-instruction">Selecciona las sílabas en orden correcto:</p>
        <div class="fono-answer" id="fono-answer"></div>
        <div class="fono-options" id="fono-options">
          ${allSyllables.map((s, i) => `<button class="syllable-chip" data-syl="${s}" data-idx="${i}">${s}</button>`).join("")}
        </div>
        <div class="fono-actions">
          <button id="fono-check" class="game-btn">Comprobar</button>
          <button id="fono-clear" class="game-btn" style="background:#95a5a6;">Limpiar</button>
        </div>
        <p id="fono-feedback" class="math-feedback"></p>
      </div>`;

    // Narrar la palabra
    setTimeout(() => narrateText(item.word), 300);

    const answerEl = document.getElementById("fono-answer");
    const optionsEl = document.getElementById("fono-options");

    document.getElementById("fono-listen").addEventListener("click", () => narrateText(item.word));
    document.getElementById("fono-stop").addEventListener("click", stopNarration);

    optionsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".syllable-chip");
      if (!btn || btn.disabled) return;
      chosen.push(btn.dataset.syl);
      btn.disabled = true;
      btn.classList.add("used");
      const chip = document.createElement("span");
      chip.className = "syllable-chip chosen popIn";
      chip.textContent = btn.dataset.syl;
      answerEl.appendChild(chip);
    });

    document.getElementById("fono-clear").addEventListener("click", () => {
      chosen = [];
      answerEl.innerHTML = "";
      optionsEl.querySelectorAll(".syllable-chip").forEach((b) => {
        b.disabled = false;
        b.classList.remove("used");
      });
    });

    document.getElementById("fono-check").addEventListener("click", () => {
      const feedback = document.getElementById("fono-feedback");
      const isCorrect = chosen.length === item.syllables.length && chosen.every((s, i) => s === item.syllables[i]);

      if (isCorrect) {
        correctSyllables += item.syllables.length;
        feedback.textContent = `✅ ¡Correcto! ${item.word} = ${item.syllables.join(" - ")}`;
        feedback.style.color = "#2ecc71";
        narrateText(`¡Muy bien! ${item.syllables.join(", ")}`);
        answerEl.querySelectorAll(".syllable-chip").forEach((c) => c.classList.add("correct"));
      } else {
        // Dar puntos parciales por sílabas en posición correcta
        let partial = 0;
        chosen.forEach((s, i) => {
          if (item.syllables[i] === s) partial++;
        });
        correctSyllables += partial;
        feedback.textContent = `❌ La respuesta era: ${item.syllables.join(" - ")} (${partial} sílaba${partial !== 1 ? "s" : ""} correcta${partial !== 1 ? "s" : ""})`;
        feedback.style.color = "#e74c3c";
        narrateText(`La separación correcta es: ${item.syllables.join(", ")}`);
      }
      current++;
      setTimeout(render, 2000);
    });
  }
  render();
};

// ── 2. Lectura Silábica ──────────────────────────────────────────────────────
// Se muestra la palabra con sílabas faltantes que el niño debe completar
gameRenderers["lectura-silabica"] = function (area) {
  const pool = shuffle([...caucaWords]).slice(0, 8);
  let current = 0,
    totalSyllables = 0,
    correctSyllables = 0;

  function render() {
    if (current >= pool.length) {
      renderMedal(correctSyllables, totalSyllables, area, "lectura-silabica");
      return;
    }
    const item = pool[current];
    const syls = item.syllables;
    const typeLabel = item.type === "fauna" ? "🐾 Fauna" : "🌿 Flora";

    // Decidir qué sílabas ocultar (al menos 1, máximo la mitad+1)
    const hideCount = Math.max(1, Math.ceil(syls.length / 2));
    const hideIndices = [];
    const candidates = syls.map((_, i) => i);
    while (hideIndices.length < hideCount && candidates.length) {
      const pick = Math.floor(Math.random() * candidates.length);
      hideIndices.push(candidates.splice(pick, 1)[0]);
    }
    totalSyllables += hideCount;

    // Distractores
    const distractors = shuffle(caucaWords.filter((w) => w.word !== item.word).flatMap((w) => w.syllables)).slice(0, 4);
    const hiddenSyls = hideIndices.map((i) => syls[i]);
    const options = shuffle([...new Set([...hiddenSyls, ...distractors])]);

    area.innerHTML = `
      <div class="silabica-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">${typeLabel} del Cauca</span>
          <span class="math-score">Sílabas: ${correctSyllables} | Palabra ${current + 1}/${pool.length}</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin:10px 0;background:${item.color};border-radius:16px;padding:12px 18px;border:2px solid rgba(0,0,0,0.07);">
          <div style="font-size:5.5rem;line-height:1;text-shadow:0 2px 6px rgba(0,0,0,0.12);flex-shrink:0;">${item.emoji}</div>
          <div style="flex:1;">
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
              <button class="fono-audio-btn" id="sil-listen" title="Escuchar la palabra" style="font-size:1.4rem;">🔊 Escuchar</button>
              <button class="fono-audio-btn" id="sil-stop" title="Parar" style="font-size:1.4rem;background:#e74c3c;">⏹️ Parar</button>
            </div>
            <p class="fono-desc" style="margin:0;font-size:0.88rem;">${item.desc}</p>
          </div>
        </div>
        <div class="silabica-word" id="sil-word">
          ${syls
            .map((s, i) =>
              hideIndices.includes(i)
                ? `<span class="syl-slot empty" data-idx="${i}" data-answer="${s}">___</span>`
                : `<span class="syl-slot filled popIn">${s}</span>`,
            )
            .join(`<span class="syl-dash">-</span>`)}
        </div>
        <p class="fono-instruction">Arrastra o haz clic en las sílabas correctas:</p>
        <div class="sil-options" id="sil-options">
          ${options.map((o) => `<button class="syllable-chip" data-syl="${o}">${o}</button>`).join("")}
        </div>
        <div class="fono-actions">
          <button id="sil-check" class="game-btn">Comprobar</button>
        </div>
        <p id="sil-feedback" class="math-feedback"></p>
      </div>`;

    setTimeout(() => narrateText(item.word), 400);

    document.getElementById("sil-listen").addEventListener("click", () => narrateText(item.word));
    document.getElementById("sil-stop").addEventListener("click", stopNarration);

    const emptySlots = area.querySelectorAll(".syl-slot.empty");
    let currentSlot = 0;

    document.getElementById("sil-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".syllable-chip");
      if (!btn || btn.disabled || currentSlot >= emptySlots.length) return;
      const slot = emptySlots[currentSlot];
      slot.textContent = btn.dataset.syl;
      slot.dataset.chosen = btn.dataset.syl;
      slot.classList.add("popIn");
      slot.classList.remove("empty");
      slot.classList.add("filled-by-user");
      btn.disabled = true;
      btn.classList.add("used");
      currentSlot++;
    });

    document.getElementById("sil-check").addEventListener("click", () => {
      const feedback = document.getElementById("sil-feedback");
      let correct = 0;

      emptySlots.forEach((slot) => {
        if (slot.dataset.chosen === slot.dataset.answer) {
          correct++;
          slot.classList.add("correct");
        } else {
          slot.classList.add("incorrect");
          slot.textContent = slot.dataset.answer;
        }
      });

      correctSyllables += correct;
      const allRight = correct === hideCount;

      if (allRight) {
        feedback.textContent = `✅ ¡Perfecto! ${syls.join(" - ")}`;
        feedback.style.color = "#2ecc71";
        narrateText(`¡Excelente! ${item.word}. ${syls.join(", ")}`);
      } else {
        feedback.textContent = `${correct > 0 ? "🟡" : "❌"} ${correct} de ${hideCount} sílabas correctas → ${syls.join(" - ")}`;
        feedback.style.color = correct > 0 ? "#e67e22" : "#e74c3c";
        narrateText(`La palabra es ${item.word}. ${syls.join(", ")}`);
      }
      current++;
      setTimeout(render, 2200);
    });
  }
  render();
};

// ── 3. Vocabulario Contextualizado ───────────────────────────────────────────
// Oraciones sobre fauna y flora del Cauca, el niño ordena las palabras
gameRenderers["vocabulario-contextualizado"] = function (area) {
  const sentences = [
    { text: "El cóndor vuela sobre las montañas del Cauca", keyword: "cóndor", type: "fauna" },
    { text: "La orquídea florece en los bosques húmedos", keyword: "orquídea", type: "flora" },
    { text: "El colibrí bebe néctar de las flores silvestres", keyword: "colibrí", type: "fauna" },
    { text: "La guadua crece junto a los ríos del Cauca", keyword: "guadua", type: "flora" },
    { text: "El tucán tiene un pico grande y colorido", keyword: "tucán", type: "fauna" },
    { text: "La ceiba es el árbol más grande del bosque", keyword: "ceiba", type: "flora" },
    { text: "El armadillo se protege con su caparazón", keyword: "armadillo", type: "fauna" },
    { text: "El frailejón retiene agua en el páramo andino", keyword: "frailejón", type: "flora" },
    { text: "La guacamaya vive en la selva tropical caucana", keyword: "guacamaya", type: "fauna" },
    { text: "Los helechos crecen bajo la sombra de los árboles", keyword: "helechos", type: "flora" },
  ];

  const pool = shuffle(sentences).slice(0, 6);
  let current = 0,
    totalSyllables = 0,
    correctSyllables = 0;

  // Contar sílabas totales de las keywords
  pool.forEach((s) => {
    const found = caucaWords.find((w) => w.word.toLowerCase() === s.keyword.toLowerCase());
    if (found) totalSyllables += found.syllables.length;
    else totalSyllables += 2;
  });

  function render() {
    if (current >= pool.length) {
      renderMedal(correctSyllables, totalSyllables, area, "vocabulario-contextualizado");
      return;
    }
    const item = pool[current];
    const words = item.text.split(" ");
    const shuffled = shuffle(words);
    let chosen = [];
    const typeLabel = item.type === "fauna" ? "🐾 Fauna" : "🌿 Flora";
    const wordData = caucaWords.find((w) => w.word.toLowerCase() === item.keyword.toLowerCase());

    area.innerHTML = `
      <div class="vocab-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">${typeLabel} del Cauca</span>
          <span class="math-score">Sílabas: ${correctSyllables} | Oración ${current + 1}/${pool.length}</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin:10px 0;background:${wordData ? wordData.color : "#f0f4f8"};border-radius:16px;padding:12px 18px;border:2px solid rgba(0,0,0,0.07);">
          <div style="font-size:5.5rem;line-height:1;text-shadow:0 2px 6px rgba(0,0,0,0.12);flex-shrink:0;">${wordData ? wordData.emoji : "🌿"}</div>
          <div style="flex:1;">
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
              <button class="fono-audio-btn" id="vocab-listen" title="Escuchar" style="font-size:1.3rem;">🔊 Escuchar oración</button>
              <button class="fono-audio-btn" id="vocab-stop" title="Parar" style="font-size:1.3rem;background:#e74c3c;">⏹️ Parar</button>
            </div>
            ${wordData ? `<p class="fono-desc" style="margin:0;font-size:0.88rem;">Palabra clave: <strong>${wordData.word}</strong> (${wordData.syllables.join(" - ")})</p>` : ""}
          </div>
        </div>
        <p class="fono-instruction">Ordena las palabras para formar la oración:</p>
        <div class="ordena-answer" id="vocab-answer" style="min-height:48px;padding:10px;background:#e8e5ff;border-radius:12px;margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;"></div>
        <div class="ordena-options" id="vocab-options" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;"></div>
        <div class="fono-actions">
          <button id="vocab-check" class="game-btn">Comprobar</button>
          <button id="vocab-clear" class="game-btn" style="background:#95a5a6;">Limpiar</button>
        </div>
        <p id="vocab-feedback" class="math-feedback"></p>
      </div>`;

    setTimeout(() => narrateText(item.text), 500);

    const answerEl = document.getElementById("vocab-answer");
    const optionsEl = document.getElementById("vocab-options");

    document.getElementById("vocab-listen").addEventListener("click", () => narrateText(item.text));
    document.getElementById("vocab-stop").addEventListener("click", stopNarration);

    shuffled.forEach((w) => {
      const btn = document.createElement("button");
      btn.textContent = w;
      btn.className = "word-chip";
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        chosen.push(w);
        btn.disabled = true;
        btn.classList.add("used");
        const chip = document.createElement("span");
        chip.textContent = w;
        chip.className = "word-chip chosen popIn";
        chip.addEventListener("click", () => {
          chosen.splice(chosen.indexOf(w), 1);
          chip.remove();
          btn.disabled = false;
          btn.classList.remove("used");
        });
        answerEl.appendChild(chip);
      });
      optionsEl.appendChild(btn);
    });

    document.getElementById("vocab-clear").addEventListener("click", () => {
      chosen = [];
      answerEl.innerHTML = "";
      optionsEl.querySelectorAll(".word-chip").forEach((b) => {
        b.disabled = false;
        b.classList.remove("used");
      });
    });

    document.getElementById("vocab-check").addEventListener("click", () => {
      const feedback = document.getElementById("vocab-feedback");
      const isCorrect = chosen.join(" ") === item.text;

      if (isCorrect) {
        if (wordData) correctSyllables += wordData.syllables.length;
        else correctSyllables += 2;
        feedback.textContent = `✅ ¡Excelente! Oración correcta.`;
        feedback.style.color = "#2ecc71";
        answerEl.classList.add("correct-answer");
        narrateText(`¡Muy bien! ${item.text}`);
      } else {
        feedback.textContent = `❌ La oración correcta es: "${item.text}"`;
        feedback.style.color = "#e74c3c";
        answerEl.style.border = "2px solid #e74c3c";
        narrateText(`La oración correcta es: ${item.text}`);
      }
      current++;
      setTimeout(render, 2500);
    });
  }
  render();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  MATEMÁTICAS                                                    ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Utilidad: medalla matemáticas ────────────────────────────────────────────
function renderMathMedal(score, total, area, gameId) {
  const pct = Math.round((score / total) * 100);
  const medal = getMedal(pct);
  area.innerHTML = `
    <div class="game-result medal-result fadeIn">
      <div class="medal-badge bounce" style="font-size:4rem;">${medal.icon}</div>
      <h2 style="color:${medal.color};">¡${medal.label}!</h2>
      <p>Respuestas correctas: <strong>${score}</strong> de <strong>${total}</strong> (${pct}%)</p>
      <div class="medal-stars">${"⭐".repeat(Math.ceil(pct / 25))}</div>
      <button class="game-btn" onclick="gameRenderers['${gameId}'](this.closest('.game-area'))">Jugar de nuevo</button>
    </div>`;
  narrateText(`¡Felicidades! Obtuviste ${score} de ${total} puntos`);
}

// ── 1. Conteo Animado (1–20) ──────────────────────────────────────────────────
gameRenderers["conteo-animado"] = function (area) {
  const OBJECTS = ["🌽", "🐔", "🐑", "🌻", "🦋", "🍎", "🐝", "🌺", "🐠", "🦜", "🌿", "🍇", "🥕", "🐰", "🌸"];
  const NUMBERS_ES = [
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
    "veinte",
  ];
  let round = 0,
    score = 0,
    maxRounds = 8;

  function narrateCount(n) {
    const words = Array.from({ length: n }, (_, i) => NUMBERS_ES[i]).join(", ");
    narrateText(words);
  }

  function nextRound() {
    if (round >= maxRounds) {
      renderMathMedal(score, maxRounds, area, "conteo-animado");
      return;
    }
    const count = Math.floor(Math.random() * 20) + 1;
    const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];

    const opts = new Set([count]);
    let att = 0;
    while (opts.size < 4 && att < 300) {
      const d = count + Math.floor(Math.random() * 7) - 3;
      if (d >= 1 && d <= 20) opts.add(d);
      att++;
    }
    let n = 1;
    while (opts.size < 4) {
      if (!opts.has(n)) opts.add(n);
      n++;
    }
    const options = [...opts].sort((a, b) => a - b);

    area.innerHTML = `
      <div class="conteo-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🔢 Conteo del 1 al 20</span>
          <span class="math-score">Puntaje: ${score} / ${maxRounds} | Ronda ${round + 1}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <button class="fono-audio-btn" id="conteo-listen">🔊 Escuchar el conteo</button>
          <button class="fono-audio-btn" id="conteo-stop" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <p class="fono-instruction">¿Cuántos objetos hay?</p>
        <div class="conteo-objects" id="conteo-objects">
          ${Array(count)
            .fill(0)
            .map((_, i) => `<span class="conteo-obj" style="animation-delay:${i * 0.07}s">${obj}</span>`)
            .join("")}
        </div>
        <div class="conteo-hint" id="conteo-hint"></div>
        <div class="multi-options" style="margin-top:16px;">
          ${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="conteo-feedback" class="math-feedback"></p>
      </div>`;

    const objs = area.querySelectorAll(".conteo-obj");
    objs.forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 80));

    document.getElementById("conteo-stop").addEventListener("click", stopNarration);
    document.getElementById("conteo-listen").addEventListener("click", () => {
      narrateCount(count);
      objs.forEach((el, i) => {
        setTimeout(() => {
          objs.forEach((e) => e.classList.remove("counting"));
          el.classList.add("counting");
          const hint = document.getElementById("conteo-hint");
          if (hint) hint.textContent = NUMBERS_ES[i].toUpperCase();
        }, i * 650);
      });
    });

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const val = parseInt(btn.dataset.val);
      const fb = document.getElementById("conteo-feedback");
      round++;
      if (val === count) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = `✅ ¡Correcto! Hay ${count} ${obj} (${NUMBERS_ES[count - 1]})`;
        fb.style.color = "#2ecc71";
        narrateText(`¡Muy bien! Hay ${count}, ${NUMBERS_ES[count - 1]}`);
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Eran ${count} ${obj} — ${NUMBERS_ES[count - 1]}`;
        fb.style.color = "#e74c3c";
        narrateText(`Son ${count}, ${NUMBERS_ES[count - 1]}`);
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      setTimeout(nextRound, 1800);
    });
  }
  nextRound();
};

// ── 2. Operaciones de Campo ───────────────────────────────────────────────────
gameRenderers["operaciones-campo"] = function (area) {
  const templates = [
    {
      text: "Tienes {a} 🌽 mazorcas y recoges {b} más.\n¿Cuántas tienes ahora?",
      op: "+",
      minA: 1,
      maxA: 10,
      minB: 1,
      maxB: 10,
      tool: "⚖️",
      toolName: "Báscula",
    },
    {
      text: "Hay {a} 🐔 gallinas en el corral. Se van {b}.\n¿Cuántas quedan?",
      op: "-",
      minA: 6,
      maxA: 15,
      minB: 1,
      maxB: 5,
      tool: "📏",
      toolName: "Metro",
    },
    {
      text: "Hay {a} filas de 🌾 con {b} plantas cada una.\n¿Cuántas plantas hay en total?",
      op: "×",
      minA: 2,
      maxA: 5,
      minB: 2,
      maxB: 5,
      tool: "🚜",
      toolName: "Tractor",
    },
    {
      text: "Cosechaste {a} 🥕 para repartir en {b} canastos iguales.\n¿Cuántas van en cada canasto?",
      op: "÷",
      minBmult: 2,
      maxBmult: 4,
      tool: "🧺",
      toolName: "Canasto",
    },
    {
      text: "Un surco mide {a} pasos. Ya caminaste {b}.\n¿Cuántos pasos faltan?",
      op: "-",
      minA: 8,
      maxA: 18,
      minB: 2,
      maxB: 7,
      tool: "📏",
      toolName: "Metro",
    },
    {
      text: "Llenaste {a} 🪣 baldes con {b} litros cada uno.\n¿Cuántos litros en total?",
      op: "×",
      minA: 2,
      maxA: 6,
      minB: 2,
      maxB: 4,
      tool: "🪣",
      toolName: "Balde",
    },
    {
      text: "Tienes {a} 🌱 semillas y sembraste {b}.\n¿Cuántas te quedan?",
      op: "-",
      minA: 10,
      maxA: 20,
      minB: 1,
      maxB: 9,
      tool: "🌱",
      toolName: "Semillero",
    },
    {
      text: "El 🌡️ marcó {a}°C en la mañana y subió {b}°C.\n¿Cuánto marca ahora?",
      op: "+",
      minA: 10,
      maxA: 20,
      minB: 1,
      maxB: 9,
      tool: "🌡️",
      toolName: "Termómetro",
    },
    {
      text: "Tienes {a} 🍎 para poner en {b} cajas iguales.\n¿Cuántas van en cada caja?",
      op: "÷",
      minBmult: 2,
      maxBmult: 5,
      tool: "📦",
      toolName: "Caja",
    },
    {
      text: "Plantaste {a} 🌿 matas en la mañana y {b} en la tarde.\n¿Cuántas plantaste en total?",
      op: "+",
      minA: 3,
      maxA: 12,
      minB: 3,
      maxB: 12,
      tool: "🌿",
      toolName: "Palín",
    },
  ];

  const pool = shuffle([...templates]).slice(0, 8);
  let current = 0,
    score = 0;

  function buildProblem(tmpl) {
    let a, b, answer;
    if (tmpl.op === "÷") {
      b = Math.floor(Math.random() * (tmpl.maxBmult - tmpl.minBmult + 1)) + tmpl.minBmult;
      const mult = Math.floor(Math.random() * 4) + 2;
      a = b * mult;
      answer = mult;
    } else {
      a = Math.floor(Math.random() * (tmpl.maxA - tmpl.minA + 1)) + tmpl.minA;
      b = Math.floor(Math.random() * (tmpl.maxB - tmpl.minB + 1)) + tmpl.minB;
      if (tmpl.op === "-" && b > a) [a, b] = [b, a];
      if (tmpl.op === "+") answer = a + b;
      if (tmpl.op === "-") answer = a - b;
      if (tmpl.op === "×") answer = a * b;
    }
    const text = tmpl.text.replace("{a}", a).replace("{b}", b);
    return { text, answer, op: tmpl.op, tool: tmpl.tool, toolName: tmpl.toolName };
  }

  function render() {
    if (current >= pool.length) {
      renderMathMedal(score, pool.length, area, "operaciones-campo");
      return;
    }
    const p = buildProblem(pool[current]);

    const opts = new Set([p.answer]);
    let att = 0;
    while (opts.size < 4 && att < 300) {
      const d = p.answer + Math.floor(Math.random() * 9) - 4;
      if (d >= 0) opts.add(d);
      att++;
    }
    let n = 0;
    while (opts.size < 4) {
      if (!opts.has(n)) opts.add(n);
      n++;
    }
    const options = [...opts].sort((a, b) => a - b);
    const opNames = { "+": "suma ➕", "-": "resta ➖", "×": "multiplicación ✖️", "÷": "división ➗" };

    area.innerHTML = `
      <div class="campo-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">${p.tool} Herramienta: ${p.toolName}</span>
          <span class="math-score">Puntaje: ${score} / ${pool.length} | Problema ${current + 1}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:12px;">
          <button class="fono-audio-btn" id="campo-listen">🔊 Escuchar problema</button>
          <button class="fono-audio-btn" id="campo-stop" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <div class="campo-problem">
          <div class="campo-tool">${p.tool}</div>
          <p class="campo-text">${p.text.replace(/\n/g, "<br>")}</p>
          <div class="campo-op-badge">${opNames[p.op]}</div>
        </div>
        <div class="multi-options" style="margin-top:20px;">
          ${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="campo-feedback" class="math-feedback"></p>
      </div>`;

    setTimeout(() => narrateText(p.text.replace(/\n/g, " ")), 400);
    document.getElementById("campo-listen").addEventListener("click", () => narrateText(p.text.replace(/\n/g, " ")));
    document.getElementById("campo-stop").addEventListener("click", stopNarration);

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const val = parseInt(btn.dataset.val);
      const fb = document.getElementById("campo-feedback");
      if (val === p.answer) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = `✅ ¡Correcto! La respuesta es ${p.answer}`;
        fb.style.color = "#2ecc71";
        narrateText(`¡Muy bien! La respuesta es ${p.answer}`);
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ La respuesta era ${p.answer}`;
        fb.style.color = "#e74c3c";
        narrateText(`La respuesta correcta es ${p.answer}`);
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1800);
    });
  }
  render();
};

// ── 3. Rompecabezas Geométrico ────────────────────────────────────────────────
gameRenderers["rompecabezas-geometrico"] = function (area) {
  const puzzles = [
    {
      name: "Casa",
      emoji: "🏠",
      description: "Techo triangular + paredes rectangulares + puerta cuadrada",
      targetSvg: `<svg width="150" height="160" viewBox="0 0 100 130">
        <rect x="15" y="55" width="70" height="60" fill="#f8d7a0" stroke="#e67e22" stroke-width="2"/>
        <polygon points="50,5 95,55 5,55" fill="#e17055" stroke="#c0392b" stroke-width="2"/>
        <rect x="38" y="80" width="24" height="35" fill="#a29bfe" stroke="#6c5ce7" stroke-width="2"/>
      </svg>`,
      correctPieces: ["Triángulo", "Rectángulo", "Cuadrado"],
      allPieces: [
        {
          name: "Triángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#e17055"/></svg>`,
          correct: true,
        },
        {
          name: "Rectángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="#f8d7a0" stroke="#e67e22" stroke-width="3"/></svg>`,
          correct: true,
        },
        {
          name: "Cuadrado",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="25" y="55" width="50" height="45" fill="#a29bfe" stroke="#6c5ce7" stroke-width="3"/></svg>`,
          correct: true,
        },
        {
          name: "Círculo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#0984e3"/></svg>`,
          correct: false,
        },
        {
          name: "Hexágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="#e84393"/></svg>`,
          correct: false,
        },
      ],
    },
    {
      name: "Cohete",
      emoji: "🚀",
      description: "Nariz triangular + cuerpo rectangular + aletas triangulares",
      targetSvg: `<svg width="120" height="160" viewBox="0 0 80 140">
        <polygon points="40,2 20,40 60,40" fill="#e17055" stroke="#c0392b" stroke-width="2"/>
        <rect x="20" y="40" width="40" height="70" fill="#6c5ce7" stroke="#5a4bd1" stroke-width="2"/>
        <polygon points="20,70 4,108 20,108" fill="#fdcb6e" stroke="#f39c12" stroke-width="2"/>
        <polygon points="60,70 76,108 60,108" fill="#fdcb6e" stroke="#f39c12" stroke-width="2"/>
      </svg>`,
      correctPieces: ["Triángulo", "Rectángulo"],
      allPieces: [
        {
          name: "Triángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#e17055"/></svg>`,
          correct: true,
        },
        {
          name: "Rectángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="20" y="10" width="60" height="80" fill="#6c5ce7" stroke="#5a4bd1" stroke-width="3"/></svg>`,
          correct: true,
        },
        {
          name: "Pentágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 97,38 79,92 21,92 3,38" fill="#fdcb6e"/></svg>`,
          correct: false,
        },
        {
          name: "Círculo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#2ecc71"/></svg>`,
          correct: false,
        },
        {
          name: "Hexágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="#e84393"/></svg>`,
          correct: false,
        },
      ],
    },
    {
      name: "Pez",
      emoji: "🐠",
      description: "Cuerpo ovalado + cola triangular",
      targetSvg: `<svg width="170" height="110" viewBox="0 0 160 100">
        <ellipse cx="75" cy="50" rx="55" ry="34" fill="#0984e3" stroke="#0769b3" stroke-width="2"/>
        <polygon points="130,20 158,50 130,80" fill="#00b894" stroke="#00a381" stroke-width="2"/>
        <circle cx="45" cy="38" r="7" fill="#fff"/>
        <circle cx="45" cy="38" r="4" fill="#1a1a1a"/>
      </svg>`,
      correctPieces: ["Elipse", "Triángulo"],
      allPieces: [
        {
          name: "Elipse",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="45" ry="28" fill="#0984e3"/></svg>`,
          correct: true,
        },
        {
          name: "Triángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#00b894"/></svg>`,
          correct: true,
        },
        {
          name: "Cuadrado",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="#e17055"/></svg>`,
          correct: false,
        },
        {
          name: "Hexágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="#e84393"/></svg>`,
          correct: false,
        },
      ],
    },
    {
      name: "Sol",
      emoji: "☀️",
      description: "Centro circular + rayos triangulares",
      targetSvg: `<svg width="150" height="150" viewBox="0 0 120 120">
        <polygon points="60,2 68,40 95,15 72,42 110,38 75,55 108,72 70,62 80,100 58,70 42,105 50,65 12,80 48,58 8,38 46,48 22,15 55,42" fill="#fdcb6e" stroke="#f39c12" stroke-width="1"/>
        <circle cx="60" cy="60" r="28" fill="#ffeaa7" stroke="#f39c12" stroke-width="2"/>
      </svg>`,
      correctPieces: ["Círculo", "Triángulo"],
      allPieces: [
        {
          name: "Círculo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ffeaa7" stroke="#f39c12" stroke-width="4"/></svg>`,
          correct: true,
        },
        {
          name: "Triángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#fdcb6e"/></svg>`,
          correct: true,
        },
        {
          name: "Rectángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="10" y="25" width="80" height="50" fill="#6c5ce7"/></svg>`,
          correct: false,
        },
        {
          name: "Pentágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 97,38 79,92 21,92 3,38" fill="#e84393"/></svg>`,
          correct: false,
        },
      ],
    },
    {
      name: "Árbol",
      emoji: "🌲",
      description: "Copa triangular (doble) + tronco rectangular",
      targetSvg: `<svg width="130" height="160" viewBox="0 0 100 130">
        <polygon points="50,5 90,65 10,65" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
        <polygon points="50,38 88,95 12,95" fill="#27ae60" stroke="#1e8449" stroke-width="2"/>
        <rect x="38" y="90" width="24" height="35" fill="#a0522d" stroke="#7a3f1e" stroke-width="2"/>
      </svg>`,
      correctPieces: ["Triángulo", "Rectángulo"],
      allPieces: [
        {
          name: "Triángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="#2ecc71"/></svg>`,
          correct: true,
        },
        {
          name: "Rectángulo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><rect x="30" y="10" width="40" height="80" fill="#a0522d" stroke="#7a3f1e" stroke-width="3"/></svg>`,
          correct: true,
        },
        {
          name: "Círculo",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#0984e3"/></svg>`,
          correct: false,
        },
        {
          name: "Hexágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="#e84393"/></svg>`,
          correct: false,
        },
        {
          name: "Pentágono",
          svg: `<svg width="56" height="56" viewBox="0 0 100 100"><polygon points="50,5 97,38 79,92 21,92 3,38" fill="#fdcb6e"/></svg>`,
          correct: false,
        },
      ],
    },
  ];

  let current = 0,
    score = 0;

  function render() {
    if (current >= puzzles.length) {
      renderMathMedal(score, puzzles.length, area, "rompecabezas-geometrico");
      return;
    }
    const puz = puzzles[current];
    const shuffledPieces = shuffle([...puz.allPieces]);
    const selectedPieces = new Set();

    area.innerHTML = `
      <div class="rompe-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🔷 Rompecabezas ${current + 1} / ${puzzles.length}</span>
          <span class="math-score">Puntaje: ${score} / ${puzzles.length}</span>
        </div>
        <p class="fono-instruction">Figura: <strong>${puz.name} ${puz.emoji}</strong></p>
        <p class="fono-desc">${puz.description}</p>
        <div class="rompe-target">${puz.targetSvg}</div>
        <p class="fono-instruction" style="margin-top:14px;">Selecciona las piezas que forman esta figura:</p>
        <div class="rompe-pieces" id="rompe-pieces">
          ${shuffledPieces
            .map(
              (p, i) => `
            <div class="rompe-piece" data-idx="${i}" data-correct="${p.correct}">
              ${p.svg}
              <span class="piece-label">${p.name}</span>
            </div>`,
            )
            .join("")}
        </div>
        <button id="rompe-check" class="game-btn" style="margin-top:14px;">Comprobar</button>
        <p id="rompe-feedback" class="math-feedback"></p>
      </div>`;

    document.getElementById("rompe-pieces").addEventListener("click", (e) => {
      const piece = e.target.closest(".rompe-piece");
      if (!piece || piece.classList.contains("piece-correct") || piece.classList.contains("piece-wrong")) return;
      const idx = piece.dataset.idx;
      if (selectedPieces.has(idx)) {
        selectedPieces.delete(idx);
        piece.classList.remove("selected");
      } else {
        selectedPieces.add(idx);
        piece.classList.add("selected");
      }
    });

    document.getElementById("rompe-check").addEventListener("click", () => {
      const selected = [...selectedPieces].map((i) => shuffledPieces[parseInt(i)]);
      const correctSelected = selected.filter((p) => p.correct).length;
      const wrongSelected = selected.filter((p) => !p.correct).length;
      const totalCorrect = shuffledPieces.filter((p) => p.correct).length;
      const fb = document.getElementById("rompe-feedback");

      document.querySelectorAll(".rompe-piece").forEach((el) => {
        const p = shuffledPieces[parseInt(el.dataset.idx)];
        if (selectedPieces.has(el.dataset.idx)) {
          el.classList.add(p.correct ? "piece-correct" : "piece-wrong");
        }
      });

      if (correctSelected === totalCorrect && wrongSelected === 0) {
        score++;
        fb.textContent = `✅ ¡Perfecto! ${puz.name} = ${puz.correctPieces.join(" + ")}`;
        fb.style.color = "#2ecc71";
        narrateText(`¡Excelente! La figura ${puz.name} se forma con ${puz.correctPieces.join(" y ")}`);
      } else {
        fb.textContent = `❌ Las piezas correctas son: ${puz.correctPieces.join(" + ")}`;
        fb.style.color = "#e74c3c";
        narrateText(`Las piezas correctas son: ${puz.correctPieces.join(" y ")}`);
      }
      current++;
      setTimeout(render, 2600);
    });
  }
  render();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  CIENCIAS NATURALES                                             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── 1. Seres Vivos y Medio Ambiente ──────────────────────────────────────────
gameRenderers["seres-vivos"] = function (area) {
  const rounds = [
    // Ronda A: ¿Es ser vivo o no?
    {
      type: "vivo-novivo",
      items: [
        { label: "🐝 Abeja", alive: true, reason: "Nace, crece, se reproduce y muere." },
        { label: "🪨 Piedra", alive: false, reason: "No nace ni crece ni respira." },
        { label: "🌻 Girasol", alive: true, reason: "Es una planta: nace, crece y se reproduce." },
        { label: "💧 Agua", alive: false, reason: "No tiene vida propia." },
        { label: "🐸 Rana", alive: true, reason: "Respira, come y se reproduce." },
        { label: "🪵 Madera", alive: false, reason: "Es materia inerte." },
        { label: "🌵 Cactus", alive: true, reason: "Planta que vive en el desierto." },
        { label: "🔦 Linterna", alive: false, reason: "Es un objeto fabricado." },
      ],
    },
    // Ronda B: Cuidado del medio ambiente — ¿Buena o mala acción?
    {
      type: "medio-ambiente",
      items: [
        { label: "🗑️ Tirar basura al río", good: false, reason: "Contamina el agua y daña a los animales." },
        { label: "🌱 Plantar un árbol", good: true, reason: "¡Excelente! Los árboles limpian el aire." },
        { label: "🚰 Cerrar el grifo al cepillarse", good: true, reason: "Ahorras agua, un recurso valioso." },
        { label: "🔥 Quemar la basura", good: false, reason: "Contamina el aire con humo." },
        { label: "♻️ Reciclar papel y plástico", good: true, reason: "Reduces los residuos y cuidas la Tierra." },
        { label: "🚗 Dejar el carro prendido", good: false, reason: "Emite gases que contaminan el aire." },
        { label: "💡 Apagar la luz al salir", good: true, reason: "Ahorras energía eléctrica." },
        { label: "🏭 Arrojar químicos al suelo", good: false, reason: "Envenena el suelo y los seres vivos." },
      ],
    },
  ];

  let roundIdx = 0,
    itemIdx = 0,
    score = 0,
    total = 0;

  function getItems() {
    return rounds[roundIdx].items;
  }
  function getType() {
    return rounds[roundIdx].type;
  }

  function renderItem() {
    if (roundIdx >= rounds.length) {
      renderMathMedal(score, total, area, "seres-vivos");
      return;
    }
    const items = getItems();
    if (itemIdx >= items.length) {
      roundIdx++;
      itemIdx = 0;
      renderItem();
      return;
    }

    const item = items[itemIdx];
    const isVivo = getType() === "vivo-novivo";
    total++;

    area.innerHTML = `
      <div class="seres-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">${isVivo ? "🌿 Seres Vivos" : "🌍 Medio Ambiente"}</span>
          <span class="math-score">Puntaje: ${score} | ${roundIdx + 1}/2 · Ítem ${itemIdx + 1}/${items.length}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <button class="fono-audio-btn" id="sv-listen">🔊 Escuchar</button>
          <button class="fono-audio-btn" id="sv-stop" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <div class="seres-item bounce">${item.label}</div>
        <p class="fono-instruction">${isVivo ? "¿Es un ser vivo?" : "¿Es una buena acción para el medio ambiente?"}</p>
        <div class="seres-btns">
          <button class="seres-yes game-btn" id="sv-yes">✅ ${isVivo ? "Sí, es vivo" : "Sí, es buena"}</button>
          <button class="seres-no game-btn"  id="sv-no" style="background:#e74c3c;">❌ ${isVivo ? "No es vivo" : "No, es mala"}</button>
        </div>
        <p id="sv-feedback" class="math-feedback"></p>
      </div>`;

    const correct = isVivo ? item.alive : item.good;
    narrateText(item.label.replace(/[^\w\s]/gi, ""));

    document
      .getElementById("sv-listen")
      .addEventListener("click", () => narrateText(item.label.replace(/[^\w\s]/gi, "") + ". " + item.reason));
    document.getElementById("sv-stop").addEventListener("click", stopNarration);

    function answer(chose) {
      const fb = document.getElementById("sv-feedback");
      document.getElementById("sv-yes").disabled = true;
      document.getElementById("sv-no").disabled = true;
      if (chose === correct) {
        score++;
        fb.textContent = `✅ ¡Correcto! ${item.reason}`;
        fb.style.color = "#2ecc71";
      } else {
        fb.textContent = `❌ ${item.reason}`;
        fb.style.color = "#e74c3c";
      }
      narrateText(item.reason);
      itemIdx++;
      setTimeout(renderItem, 2200);
    }
    document.getElementById("sv-yes").addEventListener("click", () => answer(true));
    document.getElementById("sv-no").addEventListener("click", () => answer(false));
  }
  renderItem();
};

// ── 2. Clasifica los Animales ────────────────────────────────────────────────
gameRenderers["clasifica-animales"] = function (area) {
  const categories = [
    { id: "mamifero", label: "🦁 Mamífero", color: "#e17055" },
    { id: "ave", label: "🦜 Ave", color: "#6c5ce7" },
    { id: "reptil", label: "🦎 Reptil", color: "#00b894" },
    { id: "anfibio", label: "🐸 Anfibio", color: "#0984e3" },
    { id: "insecto", label: "🐝 Insecto", color: "#fdcb6e" },
  ];

  const allAnimals = [
    { emoji: "🐘", name: "Elefante", cat: "mamifero" },
    { emoji: "🦅", name: "Águila", cat: "ave" },
    { emoji: "🐊", name: "Cocodrilo", cat: "reptil" },
    { emoji: "🐸", name: "Rana", cat: "anfibio" },
    { emoji: "🦋", name: "Mariposa", cat: "insecto" },
    { emoji: "🐬", name: "Delfín", cat: "mamifero" },
    { emoji: "🦜", name: "Guacamaya", cat: "ave" },
    { emoji: "🐍", name: "Serpiente", cat: "reptil" },
    { emoji: "🦎", name: "Salamandra", cat: "anfibio" },
    { emoji: "🐝", name: "Abeja", cat: "insecto" },
    { emoji: "🐺", name: "Lobo", cat: "mamifero" },
    { emoji: "🦉", name: "Búho", cat: "ave" },
    { emoji: "🐢", name: "Tortuga", cat: "reptil" },
    { emoji: "🐊", name: "Ajolote", cat: "anfibio" },
    { emoji: "🐛", name: "Oruga", cat: "insecto" },
  ];

  const pool = shuffle([...allAnimals]).slice(0, 10);
  let current = 0,
    score = 0;

  function render() {
    if (current >= pool.length) {
      renderMathMedal(score, pool.length, area, "clasifica-animales");
      return;
    }
    const animal = pool[current];
    const catInfo = categories.find((c) => c.id === animal.cat);

    area.innerHTML = `
      <div class="clasifica-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🦁 Clasifica los Animales</span>
          <span class="math-score">Puntaje: ${score} / ${pool.length} | Animal ${current + 1}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <button class="fono-audio-btn" id="cls-listen">🔊 Escuchar</button>
          <button class="fono-audio-btn" id="cls-stop" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <div class="clasifica-animal bounce">${animal.emoji}</div>
        <p class="clasifica-name">${animal.name}</p>
        <p class="fono-instruction">¿A qué categoría pertenece?</p>
        <div class="clasifica-cats" id="cls-cats">
          ${categories
            .map(
              (c) => `
            <button class="cat-btn" data-cat="${c.id}" style="--cat-color:${c.color}">
              ${c.label}
            </button>`,
            )
            .join("")}
        </div>
        <p id="cls-feedback" class="math-feedback"></p>
      </div>`;

    setTimeout(() => narrateText(`${animal.name}. ¿Es un mamífero, ave, reptil, anfibio o insecto?`), 300);
    document
      .getElementById("cls-listen")
      .addEventListener("click", () => narrateText(`${animal.name}. ¿Es un mamífero, ave, reptil, anfibio o insecto?`));
    document.getElementById("cls-stop").addEventListener("click", stopNarration);

    document.getElementById("cls-cats").addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      const chosen = btn.dataset.cat;
      const fb = document.getElementById("cls-feedback");
      area.querySelectorAll(".cat-btn").forEach((b) => (b.disabled = true));

      if (chosen === animal.cat) {
        score++;
        btn.classList.add("cat-correct");
        fb.textContent = `✅ ¡Correcto! ${animal.name} es un ${catInfo.label}`;
        fb.style.color = "#2ecc71";
        narrateText(`¡Muy bien! El ${animal.name} es un ${catInfo.label.replace(/[^\w\s]/gi, "")}`);
      } else {
        btn.classList.add("cat-wrong");
        area.querySelector(`[data-cat="${animal.cat}"]`).classList.add("cat-correct");
        fb.textContent = `❌ Es un ${catInfo.label}. Los ${catInfo.label} ${getCatFact(animal.cat)}`;
        fb.style.color = "#e74c3c";
        narrateText(`El ${animal.name} es un ${catInfo.label.replace(/[^\w\s]/gi, "")}`);
      }
      current++;
      setTimeout(render, 2000);
    });
  }

  function getCatFact(cat) {
    const facts = {
      mamifero: "tienen pelo y amamantan a sus crías.",
      ave: "tienen plumas y la mayoría pueden volar.",
      reptil: "tienen escamas y sangre fría.",
      anfibio: "viven en agua y tierra, tienen piel húmeda.",
      insecto: "tienen 6 patas y cuerpo en 3 partes.",
    };
    return facts[cat] || "";
  }
  render();
};

// ── 3. Completa el Cuerpo Humano ─────────────────────────────────────────────
gameRenderers["cuerpo-humano"] = function (area) {
  // Cada ronda: se muestra la silueta del cuerpo, un órgano/parte, y el niño debe
  // arrastrar la etiqueta al lugar correcto o elegir la opción correcta.
  const bodyParts = [
    {
      name: "Cerebro",
      emoji: "🧠",
      system: "Sistema Nervioso",
      position: "Dentro de la cabeza, en la parte superior",
      fact: "Controla todo el cuerpo y nos permite pensar.",
      options: ["Cerebro", "Corazón", "Estómago", "Pulmón"],
    },
    {
      name: "Corazón",
      emoji: "❤️",
      system: "Sistema Circulatorio",
      position: "En el pecho, levemente a la izquierda",
      fact: "Bombea la sangre por todo el cuerpo.",
      options: ["Hígado", "Corazón", "Riñón", "Pulmón"],
    },
    {
      name: "Pulmones",
      emoji: "🫁",
      system: "Sistema Respiratorio",
      position: "En el pecho, a ambos lados del corazón",
      fact: "Nos permiten respirar; toman oxígeno y eliminan CO₂.",
      options: ["Pulmones", "Cerebro", "Intestino", "Estómago"],
    },
    {
      name: "Estómago",
      emoji: "🫃",
      system: "Sistema Digestivo",
      position: "En el abdomen, debajo del pecho",
      fact: "Digiere los alimentos con jugos gástricos.",
      options: ["Estómago", "Riñón", "Corazón", "Vejiga"],
    },
    {
      name: "Hígado",
      emoji: "🟤",
      system: "Sistema Digestivo",
      position: "En el abdomen, lado derecho",
      fact: "Filtra toxinas y produce bilis para la digestión.",
      options: ["Páncreas", "Hígado", "Pulmón", "Bazo"],
    },
    {
      name: "Riñones",
      emoji: "🫘",
      system: "Sistema Urinario",
      position: "Atrás del abdomen, uno a cada lado",
      fact: "Filtran la sangre y producen orina.",
      options: ["Riñones", "Pulmones", "Hígado", "Cerebro"],
    },
    {
      name: "Ojos",
      emoji: "👁️",
      system: "Órganos de los Sentidos",
      position: "En la cara, dentro de las cuencas",
      fact: "Nos permiten ver la luz y los colores.",
      options: ["Oídos", "Ojos", "Nariz", "Boca"],
    },
    {
      name: "Huesos",
      emoji: "🦴",
      system: "Sistema Óseo",
      position: "En todo el cuerpo, forman el esqueleto",
      fact: "Protegen órganos y dan forma al cuerpo. Un adulto tiene 206.",
      options: ["Músculos", "Huesos", "Venas", "Piel"],
    },
  ];

  const pool = shuffle([...bodyParts]).slice(0, 7);
  let current = 0,
    score = 0;

  // Construir el SVG del cuerpo humano con slots marcados
  function getBodySvg(highlightPart) {
    const highlights = {
      Cerebro: { cx: 100, cy: 38, r: 22, color: "#a29bfe" },
      Corazón: { cx: 88, cy: 100, r: 14, color: "#e84393" },
      Pulmones: { cx: 100, cy: 100, r: 20, color: "#74b9ff" },
      Estómago: { cx: 96, cy: 130, r: 14, color: "#55efc4" },
      Hígado: { cx: 110, cy: 120, r: 13, color: "#a29bfe" },
      Riñones: { cx: 100, cy: 145, r: 10, color: "#ffeaa7" },
      Ojos: { cx: 100, cy: 28, r: 8, color: "#81ecec" },
      Huesos: { cx: 100, cy: 110, r: 60, color: "#dfe6e9" },
    };
    const h = highlights[highlightPart] || { cx: 100, cy: 100, r: 0, color: "transparent" };
    return `<svg width="140" height="260" viewBox="0 0 200 280" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,.15))">
      <!-- cabeza -->
      <circle cx="100" cy="40" r="35" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <!-- ojos -->
      <circle cx="88" cy="35" r="5" fill="#555"/><circle cx="112" cy="35" r="5" fill="#555"/>
      <!-- boca -->
      <path d="M88 52 Q100 62 112 52" stroke="#c0392b" stroke-width="2" fill="none"/>
      <!-- cuello -->
      <rect x="88" y="73" width="24" height="18" rx="4" fill="#ffd7b5" stroke="#e0a070" stroke-width="1"/>
      <!-- torso -->
      <rect x="60" y="88" width="80" height="90" rx="12" fill="#b2bec3" stroke="#636e72" stroke-width="2"/>
      <!-- línea central -->
      <line x1="100" y1="88" x2="100" y2="178" stroke="#fff" stroke-width="1.5" stroke-dasharray="4"/>
      <!-- brazos -->
      <rect x="24" y="90" width="36" height="80" rx="14" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <rect x="140" y="90" width="36" height="80" rx="14" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <!-- manos -->
      <circle cx="42"  cy="180" r="14" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <circle cx="158" cy="180" r="14" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <!-- piernas -->
      <rect x="68"  y="175" width="28" height="90" rx="12" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <rect x="104" y="175" width="28" height="90" rx="12" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <!-- pies -->
      <ellipse cx="82"  cy="270" rx="20" ry="9" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <ellipse cx="118" cy="270" rx="20" ry="9" fill="#ffd7b5" stroke="#e0a070" stroke-width="2"/>
      <!-- highlight -->
      <circle cx="${h.cx}" cy="${h.cy}" r="${h.r}" fill="${h.color}" opacity="0.75">
        <animate attributeName="r" values="${h.r};${h.r * 1.15};${h.r}" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>`;
  }

  function render() {
    if (current >= pool.length) {
      renderMathMedal(score, pool.length, area, "cuerpo-humano");
      return;
    }
    const part = pool[current];

    area.innerHTML = `
      <div class="cuerpo-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🫀 ${part.system}</span>
          <span class="math-score">Puntaje: ${score} / ${pool.length} | Parte ${current + 1}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;">
          <button class="fono-audio-btn" id="cb-listen">🔊 Escuchar</button>
          <button class="fono-audio-btn" id="cb-stop" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <div class="cuerpo-layout">
          <div class="cuerpo-svg">${getBodySvg(part.name)}</div>
          <div class="cuerpo-info">
            <div class="cuerpo-emoji bounce">${part.emoji}</div>
            <p class="fono-desc">${part.position}</p>
            <p class="fono-instruction">¿Cuál de estas partes del cuerpo se describe?</p>
            <div class="multi-options" id="cb-options">
              ${shuffle(part.options)
                .map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`)
                .join("")}
            </div>
            <p id="cb-feedback" class="math-feedback"></p>
          </div>
        </div>
      </div>`;

    setTimeout(() => narrateText(`${part.position}. ¿Qué parte del cuerpo es?`), 400);
    document.getElementById("cb-listen").addEventListener("click", () => narrateText(`${part.position}. ${part.fact}`));
    document.getElementById("cb-stop").addEventListener("click", stopNarration);

    document.getElementById("cb-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("cb-feedback");
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      if (btn.dataset.val === part.name) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = `✅ ¡Correcto! ${part.fact}`;
        fb.style.color = "#2ecc71";
        narrateText(`¡Excelente! ${part.fact}`);
      } else {
        btn.style.background = "#e74c3c";
        area.querySelector(`[data-val="${part.name}"]`).style.background = "#2ecc71";
        fb.textContent = `❌ Era: ${part.name}. ${part.fact}`;
        fb.style.color = "#e74c3c";
        narrateText(`La respuesta es ${part.name}. ${part.fact}`);
      }
      current++;
      setTimeout(render, 2400);
    });
  }
  render();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  CIENCIAS SOCIALES                                              ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Mi Identidad y Mi Familia ────────────────────────────────────────────────
gameRenderers["identidad-familiar"] = function (area) {
  const questions = [
    // Identidad personal y familiar
    {
      category: "👨‍👩‍👧 Mi Familia",
      q: "¿Quiénes forman una familia?",
      options: [
        "Solo padres e hijos",
        "Personas que se quieren y cuidan entre sí",
        "Solo personas del mismo apellido",
        "Solo quienes viven juntos",
      ],
      answer: "Personas que se quieren y cuidan entre sí",
      fact: "Una familia se forma por el amor y el cuidado mutuo, sin importar su forma.",
    },
    {
      category: "👨‍👩‍👧 Mi Familia",
      q: "¿Cómo se llaman los padres de tus padres?",
      options: ["Tíos", "Primos", "Abuelos", "Padrinos"],
      answer: "Abuelos",
      fact: "Los abuelos son los padres de nuestros padres y guardan la memoria de la familia.",
    },
    {
      category: "🪪 Mi Identidad",
      q: "¿Cuál de estos datos hace parte de tu identidad personal?",
      options: ["Tu nombre y apellido", "El nombre de tu vecino", "El color del cielo", "El nombre de tu mascota"],
      answer: "Tu nombre y apellido",
      fact: "Tu nombre, apellido y fecha de nacimiento son datos que te identifican como persona única.",
    },
    {
      category: "🪪 Mi Identidad",
      q: "¿Dónde se registra nuestra identidad oficial?",
      options: [
        "En el cuaderno",
        "En el registro civil o tarjeta de identidad",
        "En la agenda",
        "En el álbum de fotos",
      ],
      answer: "En el registro civil o tarjeta de identidad",
      fact: "El registro civil es el documento oficial que confirma nuestra identidad desde el nacimiento.",
    },
    // Reconocimiento del territorio
    {
      category: "🗺️ Mi Territorio",
      q: "¿Qué es una vereda?",
      options: [
        "Una ciudad grande",
        "Una comunidad rural con familias y tierras",
        "Un barrio de la ciudad",
        "Una isla en el mar",
      ],
      answer: "Una comunidad rural con familias y tierras",
      fact: "La vereda es el lugar donde vive nuestra comunidad campesina, con sus campos y familias.",
    },
    {
      category: "🗺️ Mi Territorio",
      q: "¿Cuál de estos hace parte del territorio de una vereda?",
      options: [
        "Rascacielos y metros",
        "Ríos, montañas, cultivos y caminos",
        "Playas y arrecifes",
        "Desiertos y dunas",
      ],
      answer: "Ríos, montañas, cultivos y caminos",
      fact: "El territorio de una vereda incluye la naturaleza, los cultivos y los caminos que unen a las familias.",
    },
    {
      category: "🗺️ Mi Territorio",
      q: "¿Por qué es importante conocer nuestro territorio?",
      options: [
        "Para presumir con amigos",
        "Para cuidarlo, protegerlo y sentirnos parte de él",
        "Porque nos lo pide el profesor",
        "Para dibujarlo en el cuaderno",
      ],
      answer: "Para cuidarlo, protegerlo y sentirnos parte de él",
      fact: "Conocer nuestro territorio nos da identidad y nos inspira a cuidarlo para las futuras generaciones.",
    },
    // Normas de convivencia
    {
      category: "🤝 Convivencia",
      q: "¿Qué son las normas de convivencia?",
      options: [
        "Castigos para los niños",
        "Reglas que nos ayudan a vivir bien juntos",
        "Leyes del gobierno nacional",
        "Órdenes del alcalde",
      ],
      answer: "Reglas que nos ayudan a vivir bien juntos",
      fact: "Las normas de convivencia son acuerdos comunitarios para vivir en paz y armonía.",
    },
    {
      category: "🤝 Convivencia",
      q: "¿Cuál es una norma de convivencia en la escuela?",
      options: [
        "Gritar en clase",
        "Tirar basura al suelo",
        "Respetar el turno para hablar",
        "Ignorar a los compañeros",
      ],
      answer: "Respetar el turno para hablar",
      fact: "Escuchar y respetar a los demás es fundamental para una buena convivencia.",
    },
    {
      category: "🤝 Convivencia",
      q: "¿Qué haces si ves que un compañero necesita ayuda?",
      options: ["Lo ignoro", "Me río de él", "Lo ayudo con solidaridad", "Lo dejo solo"],
      answer: "Lo ayudo con solidaridad",
      fact: "La solidaridad y el compañerismo son las mejores normas de convivencia en comunidad.",
    },
  ];

  const shuffled = shuffle([...questions]);
  let current = 0,
    score = 0;

  function render() {
    if (current >= shuffled.length) {
      const pct = Math.round((score / shuffled.length) * 100);
      const stars = "⭐".repeat(Math.min(5, Math.ceil(pct / 20)));
      area.innerHTML = `
        <div class="game-result fadeIn">
          <div style="font-size:3.5rem;">🌍</div>
          <h2>¡Muy bien, ciudadano!</h2>
          <p>Puntaje: <strong>${score}</strong> de <strong>${shuffled.length}</strong> (${pct}%)</p>
          <div style="font-size:2rem;margin:8px 0;">${stars}</div>
          <button class="game-btn" onclick="gameRenderers['identidad-familiar'](this.closest('.game-area'))">Jugar de nuevo</button>
        </div>`;
      narrateText(`¡Felicidades! Obtuviste ${score} de ${shuffled.length} respuestas correctas.`);
      return;
    }
    const q = shuffled[current];
    const opts = shuffle([...q.options]);
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:6px;">
          <span class="fono-badge">${q.category}</span>
          <span class="math-score">Puntaje: ${score} | Pregunta ${current + 1}/${shuffled.length}</span>
        </div>
        <p class="quiz-question">${q.q}</p>
        <div class="multi-options">
          ${opts.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="id-fb" class="math-feedback" style="min-height:44px;margin-top:10px;font-size:0.95rem;"></p>
      </div>`;

    narrateText(q.q);

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      const fb = document.getElementById("id-fb");
      if (btn.dataset.val === q.answer) {
        score++;
        btn.style.background = "#2ecc71";
        fb.innerHTML = `✅ ¡Correcto! <em>${q.fact}</em>`;
        fb.style.color = "#27ae60";
        narrateText("¡Correcto! " + q.fact);
      } else {
        btn.style.background = "#e74c3c";
        area.querySelectorAll(".option-btn").forEach((b) => {
          if (b.dataset.val === q.answer) b.style.background = "#2ecc71";
        });
        fb.innerHTML = `❌ La respuesta es: <strong>${q.answer}</strong>. <em>${q.fact}</em>`;
        fb.style.color = "#c0392b";
        narrateText("La respuesta correcta es: " + q.answer + ". " + q.fact);
      }
      current++;
      setTimeout(render, 3200);
    });
  }
  render();
};

// ── Galería del Territorio y Audiorelato ─────────────────────────────────────
gameRenderers["galeria-territorio"] = function (area) {
  const places = [
    {
      icon: "🏫",
      name: "La Escuela",
      relato:
        "En nuestra vereda, la escuela es el corazón de la comunidad. Aquí aprendemos a leer, a contar y a conocer el mundo. Los niños llegan caminando por los caminos de tierra, con sus mochilas llenas de sueños y esperanzas.",
    },
    {
      icon: "🌊",
      name: "El Río",
      relato:
        "El río es la vida de nuestra vereda. Sus aguas frescas bajan de las montañas y riegan nuestros cultivos. Los abuelos dicen que el río tiene memoria y guarda los secretos más profundos de nuestra tierra.",
    },
    {
      icon: "⛰️",
      name: "La Montaña",
      relato:
        "Desde la cima de nuestra montaña se puede ver todo el territorio. Las nubes la abrazan por las mañanas y los pájaros cantan entre sus árboles. La montaña nos da agua limpia, madera y plantas medicinales.",
    },
    {
      icon: "🌾",
      name: "Los Cultivos",
      relato:
        "Las familias cultivan maíz, frijol, café y caña con mucho esfuerzo y amor por la tierra. La cosecha es un momento de alegría donde toda la comunidad se ayuda en minga para recoger los frutos.",
    },
    {
      icon: "⛪",
      name: "La Capilla",
      relato:
        "La capilla es el lugar de encuentro de la comunidad. Aquí se celebran las fiestas patronales, las bodas y los bautizos. Es un espacio de fe y de unión donde todas las familias se reúnen.",
    },
    {
      icon: "🛤️",
      name: "El Camino Real",
      relato:
        "El camino real une nuestra vereda con el pueblo. Por él transitan personas, mulas cargadas de cosecha y niños que van a la escuela. Es la vía que nos conecta con el mundo y con otras comunidades.",
    },
    {
      icon: "🏘️",
      name: "Las Casas de la Comunidad",
      relato:
        "Las casas de nuestra vereda están construidas con materiales de la región: adobe, madera y teja de barro. Cada hogar guarda historias de familias que han vivido en este territorio por muchas generaciones.",
    },
    {
      icon: "🌿",
      name: "El Bosque Nativo",
      relato:
        "El bosque nativo es el pulmón de nuestra vereda. En él viven animales como el cóndor, el oso de anteojos y la danta. Los sabedores de la comunidad conocen sus plantas medicinales y sus secretos ancestrales.",
    },
  ];

  let current = 0;

  function render() {
    const place = places[current];
    area.innerHTML = `
      <div class="galeria-container fadeIn">
        <div class="galeria-card">
          <div class="galeria-icon bounce">${place.icon}</div>
          <h2 class="galeria-title">${place.name}</h2>
          <div class="galeria-relato">
            <p>${place.relato}</p>
          </div>
          <div style="display:flex;gap:6px;align-items:center;justify-content:center;">
            <button class="galeria-audio-btn" id="gal-audio">🔊 Escuchar Audiorelato</button>
            <button class="galeria-audio-btn" id="gal-stop" style="background:#e74c3c;">⏹️ Parar</button>
          </div>
        </div>
        <div class="galeria-nav">
          <button class="game-btn" id="gal-prev" ${current === 0 ? "disabled style='opacity:0.4;cursor:default;'" : ""}>◀ Anterior</button>
          <span class="math-score">${current + 1} / ${places.length}</span>
          <button class="game-btn" id="gal-next" ${current === places.length - 1 ? "disabled style='opacity:0.4;cursor:default;'" : ""}>Siguiente ▶</button>
        </div>
        <div class="galeria-dots">
          ${places.map((_, i) => `<span class="galeria-dot${i === current ? " active" : ""}"></span>`).join("")}
        </div>
      </div>`;

    document.getElementById("gal-audio").addEventListener("click", () => {
      narrateText(place.name + ". " + place.relato);
    });
    document.getElementById("gal-stop").addEventListener("click", stopNarration);
    document.getElementById("gal-prev").addEventListener("click", () => {
      if (current > 0) {
        current--;
        render();
      }
    });
    document.getElementById("gal-next").addEventListener("click", () => {
      if (current < places.length - 1) {
        current++;
        render();
      }
    });

    setTimeout(() => narrateText(place.name + ". " + place.relato), 400);
  }
  render();
};

// ── Completa el Mapa de mi Vereda e Historia de mi Familia ───────────────────
gameRenderers["mapa-vereda"] = function (area) {
  // ── Phase 1: Mapa de mi Vereda ────────────────────────────────────────────
  function renderMapa() {
    const zones = [
      { id: "escuela", icon: "🏫", label: "La Escuela", hint: "Aquí aprendemos" },
      { id: "rio", icon: "🌊", label: "El Río", hint: "Agua que baja de la montaña" },
      { id: "montanas", icon: "⛰️", label: "Las Montañas", hint: "Lo más alto del territorio" },
      { id: "cultivos", icon: "🌾", label: "Los Cultivos", hint: "Maíz, frijol y café" },
      { id: "capilla", icon: "⛪", label: "La Capilla", hint: "Lugar de reunión y fe" },
      { id: "camino", icon: "🛤️", label: "El Camino Real", hint: "Nos une con el pueblo" },
    ];

    const shuffledLabels = shuffle(zones.map((z) => ({ id: z.id, label: z.label })));
    const answers = {};

    area.innerHTML = `
      <div class="mapa-container fadeIn">
        <h3 class="mapa-title">🗺️ Completa el Mapa de Mi Vereda</h3>
        <p class="mapa-subtitle">Arrastra cada nombre al lugar correcto del mapa</p>
        <div class="mapa-grid" id="mapa-grid">
          ${zones
            .map(
              (z) => `
            <div class="mapa-zone" id="zone-${z.id}" data-id="${z.id}">
              <div class="mapa-zone-icon">${z.icon}</div>
              <div class="mapa-zone-hint">${z.hint}</div>
              <div class="mapa-zone-drop" id="drop-${z.id}" data-id="${z.id}">
                <span class="mapa-drop-placeholder">Arrastra aquí</span>
              </div>
            </div>`,
            )
            .join("")}
        </div>
        <div class="mapa-labels" id="mapa-labels">
          ${shuffledLabels.map((l) => `<div class="mapa-label-chip" draggable="true" data-id="${l.id}" id="chip-${l.id}">${l.label}</div>`).join("")}
        </div>
        <div style="text-align:center;margin-top:14px;">
          <button class="game-btn" id="mapa-check">✅ Comprobar</button>
          <button class="game-btn" id="mapa-reset" style="background:#95a5a6;margin-left:8px;">🔄 Reiniciar</button>
        </div>
        <p id="mapa-fb" class="math-feedback" style="text-align:center;margin-top:10px;min-height:32px;"></p>
      </div>`;

    let dragging = null;

    document.querySelectorAll(".mapa-label-chip").forEach((chip) => {
      chip.addEventListener("dragstart", () => {
        dragging = chip;
        chip.style.opacity = "0.5";
      });
      chip.addEventListener("dragend", () => {
        if (dragging) dragging.style.opacity = "1";
        dragging = null;
      });
    });

    document.querySelectorAll(".mapa-zone-drop").forEach((drop) => {
      drop.addEventListener("dragover", (e) => {
        e.preventDefault();
        drop.classList.add("drag-over");
      });
      drop.addEventListener("dragleave", () => drop.classList.remove("drag-over"));
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        drop.classList.remove("drag-over");
        if (!dragging) return;
        const zoneId = drop.dataset.id;
        const chipId = dragging.dataset.id;
        // Return old chip to the tray if zone was already occupied
        const prevId = answers[zoneId];
        if (prevId) {
          const prevChip = document.getElementById(`chip-${prevId}`);
          if (prevChip) {
            prevChip.style.display = "";
            document.getElementById("mapa-labels").appendChild(prevChip);
          }
        }
        answers[zoneId] = chipId;
        drop.innerHTML = `<span class="mapa-drop-placed">${dragging.textContent}</span>`;
        dragging.style.display = "none";
        dragging.style.opacity = "1";
      });
    });

    document.getElementById("mapa-check").addEventListener("click", () => {
      const fb = document.getElementById("mapa-fb");
      let correct = 0;
      zones.forEach((z) => {
        const zoneEl = document.getElementById(`zone-${z.id}`);
        if (answers[z.id] === z.id) {
          correct++;
          zoneEl.style.background = "#d5f5e3";
          zoneEl.style.borderColor = "#2ecc71";
        } else if (answers[z.id]) {
          zoneEl.style.background = "#fdecea";
          zoneEl.style.borderColor = "#e74c3c";
        }
      });
      if (correct === zones.length) {
        fb.textContent = "✅ ¡Perfecto! Conoces muy bien tu vereda.";
        fb.style.color = "#27ae60";
        narrateText("¡Perfecto! Conoces muy bien tu vereda. Ahora cuéntanos la historia de tu familia.");
        setTimeout(renderFamilia, 2800);
      } else {
        fb.textContent = `${correct} de ${zones.length} correctos. ¡Intenta de nuevo!`;
        fb.style.color = "#e74c3c";
        narrateText(`Tienes ${correct} de ${zones.length} correctos. Sigue intentando.`);
      }
    });

    document.getElementById("mapa-reset").addEventListener("click", () => renderMapa());
  }

  // ── Phase 2: Historia de mi Familia ──────────────────────────────────────
  function renderFamilia() {
    area.innerHTML = `
      <div class="familia-container fadeIn">
        <h3 class="mapa-title">👨‍👩‍👧 Historia de Mi Familia</h3>
        <p class="mapa-subtitle">Escribe el nombre de cada miembro de tu familia</p>
        <div class="arbol-familiar">

          <div class="arbol-row">
            <div class="arbol-level-label">👴👵 Abuelos Paternos</div>
            <div class="arbol-nodes">
              <div class="arbol-node">
                <div class="arbol-icon">👴</div>
                <input class="arbol-input" placeholder="Nombre del abuelo" data-rel="Abuelo paterno" />
              </div>
              <div class="arbol-node">
                <div class="arbol-icon">👵</div>
                <input class="arbol-input" placeholder="Nombre de la abuela" data-rel="Abuela paterna" />
              </div>
            </div>
          </div>

          <div class="arbol-row">
            <div class="arbol-level-label">👴👵 Abuelos Maternos</div>
            <div class="arbol-nodes">
              <div class="arbol-node">
                <div class="arbol-icon">👴</div>
                <input class="arbol-input" placeholder="Nombre del abuelo" data-rel="Abuelo materno" />
              </div>
              <div class="arbol-node">
                <div class="arbol-icon">👵</div>
                <input class="arbol-input" placeholder="Nombre de la abuela" data-rel="Abuela materna" />
              </div>
            </div>
          </div>

          <div class="arbol-row">
            <div class="arbol-level-label">👨👩 Mis Padres</div>
            <div class="arbol-nodes">
              <div class="arbol-node">
                <div class="arbol-icon">👨</div>
                <input class="arbol-input" placeholder="Nombre de tu papá" data-rel="Papá" />
              </div>
              <div class="arbol-node">
                <div class="arbol-icon">👩</div>
                <input class="arbol-input" placeholder="Nombre de tu mamá" data-rel="Mamá" />
              </div>
            </div>
          </div>

          <div class="arbol-row">
            <div class="arbol-level-label">🧒 Yo y Mis Hermanos</div>
            <div class="arbol-nodes">
              <div class="arbol-node arbol-yo">
                <div class="arbol-icon">🧒</div>
                <input class="arbol-input" placeholder="Tu nombre" data-rel="Yo" />
              </div>
              <div class="arbol-node">
                <div class="arbol-icon">👦</div>
                <input class="arbol-input" placeholder="Hermano/a 1" data-rel="Hermano/a 1" />
              </div>
              <div class="arbol-node">
                <div class="arbol-icon">👧</div>
                <input class="arbol-input" placeholder="Hermano/a 2" data-rel="Hermano/a 2" />
              </div>
            </div>
          </div>

        </div>

        <div style="text-align:center;margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button class="game-btn" id="fam-guardar">💾 Guardar mi Historia</button>
          <button class="game-btn" id="fam-narrar" style="background:#9b59b6;">🔊 Narrar mi Historia</button>
          <button class="game-btn" id="fam-mapa" style="background:#27ae60;">🗺️ Volver al Mapa</button>
        </div>
        <div id="fam-historia" class="fam-historia-box" style="display:none;"></div>
      </div>`;

    document.getElementById("fam-mapa").addEventListener("click", () => renderMapa());

    document.getElementById("fam-guardar").addEventListener("click", () => {
      const inputs = area.querySelectorAll(".arbol-input");
      const members = [];
      inputs.forEach((inp) => {
        if (inp.value.trim()) members.push({ rel: inp.dataset.rel, name: inp.value.trim() });
      });
      if (members.length === 0) {
        narrateText("Por favor, escribe el nombre de al menos un familiar.");
        return;
      }
      const histBox = document.getElementById("fam-historia");
      histBox.style.display = "block";
      histBox.innerHTML = `
        <h4>📖 La Historia de Mi Familia</h4>
        <p>${members.map((m) => `<strong>${m.rel}:</strong> ${m.name}`).join(" &nbsp;|&nbsp; ")}</p>
        <p style="margin-top:8px;font-style:italic;color:#7f8c8d;">
          Mi familia vive en nuestra vereda con amor y esfuerzo. Cada miembro tiene un papel importante en nuestra historia.
        </p>`;
      narrateText("¡Guardaste la historia de tu familia! Qué bonita familia tienes.");
    });

    document.getElementById("fam-narrar").addEventListener("click", () => {
      const inputs = area.querySelectorAll(".arbol-input");
      const members = [];
      inputs.forEach((inp) => {
        if (inp.value.trim()) members.push(`${inp.dataset.rel}: ${inp.value.trim()}`);
      });
      if (members.length === 0) {
        narrateText("Escribe primero los nombres de tu familia para narrar la historia.");
        return;
      }
      narrateText(
        "Esta es la historia de mi familia. " +
          members.join(". ") +
          ". Mi familia vive en nuestra vereda con amor y esfuerzo.",
      );
    });
  }

  renderMapa();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  EDUCACIÓN ARTÍSTICA — v2                                        ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Utilidad de audio compartida (Web Audio API) ─────────────────────────────
function artAudio() {
  // Reanuda el contexto si fue suspendido por stopNarration()
  if (!globalThis._artCtx) {
    // eslint-disable-next-line no-undef
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    globalThis._artCtx = new Ctx();
  } else if (globalThis._artCtx.state === "suspended") {
    globalThis._artCtx.resume();
  }
  return globalThis._artCtx;
}

function artBeep(freq = 440, dur = 0.18, type = "sine", vol = 0.4, delay = 0) {
  const ctx = artAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = type;
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

// ── 1. Expresión Plástica Libre ───────────────────────────────────────────────
gameRenderers["expresion-plastica"] = function (area) {
  const colors = [
    "#2d3436",
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#1abc9c",
    "#e84393",
    "#ffffff",
    "#f39c12",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#d35400",
  ];
  const stamps = [
    { icon: "🦅", label: "Cóndor" },
    { icon: "🌺", label: "Orquídea" },
    { icon: "🎋", label: "Guadua" },
    { icon: "🦜", label: "Guacamaya" },
    { icon: "🦋", label: "Mariposa" },
    { icon: "🎭", label: "Teatro" },
    { icon: "🥁", label: "Tambora" },
    { icon: "🌿", label: "Helecho" },
    { icon: "⭐", label: "Estrella" },
    { icon: "❤️", label: "Corazón" },
  ];
  let currentColor = colors[0];
  let brushSize = 6;
  let drawing = false;
  let tool = "brush";
  let currentStamp = stamps[0];

  area.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;background:#fff;padding:8px;border-radius:12px;border:1px solid #eee;">
        <div id="arte-palette" style="display:flex;gap:3px;flex-wrap:wrap;">
          ${colors.map((c, i) => `<button class="arte-swatch" data-color="${c}" style="width:24px;height:24px;background:${c};border-radius:50%;border:2px solid ${i === 0 ? "#333" : "#ccc"};cursor:pointer;flex-shrink:0;"></button>`).join("")}
        </div>
        <div style="display:flex;gap:4px;margin-left:6px;">
          <button id="arte-pincel" class="game-btn" style="padding:4px 10px;font-size:0.8rem;">🖌️ Pincel</button>
          <button id="arte-borrador" class="game-btn" style="padding:4px 10px;font-size:0.8rem;background:#95a5a6;">⬜ Borrar</button>
        </div>
        <label style="font-size:0.8rem;white-space:nowrap;">Grosor:<input type="range" id="arte-sz" min="2" max="24" value="${brushSize}" style="width:70px;vertical-align:middle;margin-left:4px;"></label>
        <button id="arte-clear" class="game-btn" style="padding:4px 10px;font-size:0.8rem;background:#e74c3c;">🗑️ Limpiar</button>
      </div>
      <div id="arte-stamps" style="display:flex;gap:4px;flex-wrap:wrap;background:#fff;padding:6px 10px;border-radius:12px;border:1px solid #eee;align-items:center;">
        <span style="font-size:0.8rem;font-weight:bold;color:#555;margin-right:4px;">Sellos:</span>
        ${stamps.map((s) => `<button class="arte-stamp-btn" data-icon="${s.icon}" title="${s.label}" style="font-size:1.5rem;background:none;border:2px solid transparent;border-radius:8px;cursor:pointer;padding:1px 4px;line-height:1;">${s.icon}</button>`).join("")}
      </div>
      <canvas id="arte-canvas" width="640" height="320" style="background:#fff;border-radius:12px;border:2px solid #ddd;cursor:crosshair;display:block;max-width:100%;"></canvas>
      <p style="font-size:0.78rem;color:#888;text-align:center;margin:0;">¡Exprésate libremente! Pinta, borra y usa sellos de la naturaleza y cultura caucana.</p>
    </div>`;

  const canvas = document.getElementById("arte-canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  document.getElementById("arte-palette").addEventListener("click", (e) => {
    const btn = e.target.closest(".arte-swatch");
    if (!btn) return;
    currentColor = btn.dataset.color;
    document.querySelectorAll(".arte-swatch").forEach((b) => (b.style.borderColor = "#ccc"));
    btn.style.borderColor = "#333";
    tool = "brush";
  });

  document.getElementById("arte-stamps").addEventListener("click", (e) => {
    const btn = e.target.closest(".arte-stamp-btn");
    if (!btn) return;
    currentStamp = { icon: btn.dataset.icon };
    document.querySelectorAll(".arte-stamp-btn").forEach((b) => (b.style.borderColor = "transparent"));
    btn.style.borderColor = "#3498db";
    tool = "stamp";
  });

  document.getElementById("arte-pincel").addEventListener("click", () => {
    tool = "brush";
  });
  document.getElementById("arte-borrador").addEventListener("click", () => {
    tool = "eraser";
  });
  document.getElementById("arte-sz").addEventListener("input", (e) => {
    brushSize = Number.parseInt(e.target.value, 10);
  });
  document.getElementById("arte-clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  canvas.addEventListener("mousedown", (e) => {
    if (tool === "stamp") {
      const size = Math.max(24, brushSize * 3);
      ctx.font = `${size}px serif`;
      ctx.fillText(currentStamp.icon, e.offsetX - size / 2, e.offsetY + size / 3);
      return;
    }
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    if (tool === "eraser") {
      ctx.clearRect(e.offsetX - brushSize, e.offsetY - brushSize, brushSize * 2, brushSize * 2);
    } else {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    }
  });
  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });
  canvas.addEventListener("mouseleave", () => {
    drawing = false;
  });
};

// ── 2. Reconocimiento del Ritmo ────────────────────────────────────────────────
gameRenderers["ritmo-musical"] = function (area) {
  const patterns = [
    { name: "Bambuco (3/4)", beats: [1, 0, 0, 1, 0, 0], bpm: 90, freqs: [392, 294, 220] },
    { name: "Cumbia (4/4)", beats: [1, 0, 1, 0, 1, 0, 1, 0], bpm: 100, freqs: [440, 330, 264] },
    { name: "Currulao", beats: [1, 1, 0, 1, 0, 1], bpm: 110, freqs: [370, 277, 220] },
    { name: "Chirimía", beats: [1, 0, 1, 1, 0, 1, 0, 0], bpm: 120, freqs: [494, 392, 294] },
    { name: "Rajaleña", beats: [1, 0, 0, 1, 1, 0], bpm: 95, freqs: [415, 311, 233] },
  ];
  let level = 0,
    score = 0;
  globalThis._ritmoStopFlag = false;

  function playPattern(pattern) {
    globalThis._ritmoStopFlag = false;
    const ms = 60000 / pattern.bpm / 2;
    pattern.beats.forEach((beat, i) => {
      if (!beat) return;
      setTimeout(() => {
        if (globalThis._ritmoStopFlag) return;
        artBeep(pattern.freqs[i % pattern.freqs.length], 0.15, "triangle", 0.5);
        const dots = document.querySelectorAll(".ritmo-dot");
        if (dots[i]) {
          dots[i].style.transform = "scale(1.3)";
          dots[i].style.opacity = "1";
          setTimeout(() => {
            dots[i].style.transform = "";
            dots[i].style.opacity = "0.5";
          }, 150);
        }
      }, i * ms);
    });
  }

  function render() {
    if (level >= patterns.length) {
      area.innerHTML = `
        <div class="game-result fadeIn">
          <div style="font-size:3rem;">🎵</div>
          <h2>¡Felicidades, gran músico!</h2>
          <p>Reconociste los ritmos del Cauca: Bambuco, Cumbia, Currulao, Chirimía y Rajaleña.</p>
          <p><strong>Puntaje: ${score} / ${patterns.length}</strong></p>
          <button class="game-btn" onclick="gameRenderers['ritmo-musical'](this.closest('.game-area'))">Jugar de nuevo</button>
        </div>`;
      return;
    }
    const pat = patterns[level];
    const wrong = patterns
      .filter((_, i) => i !== level)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const options = [...wrong, pat].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🎵 Ritmos del Cauca</span>
          <span class="math-score">Nivel ${level + 1}/${patterns.length} | Puntaje: ${score}</span>
        </div>
        <p style="text-align:center;font-size:0.95rem;color:#555;margin:8px 0;">Escucha el patrón y elige a qué música del Cauca pertenece:</p>
        <div style="display:flex;gap:8px;justify-content:center;margin:10px 0;flex-wrap:wrap;">
          ${pat.beats.map((b) => `<div class="ritmo-dot" style="width:28px;height:28px;border-radius:50%;background:${b ? "#e74c3c" : "#ddd"};border:2px solid ${b ? "#c0392b" : "#bbb"};transition:all 0.12s;opacity:${b ? "0.7" : "0.4"};"></div>`).join("")}
        </div>
        <div style="display:flex;gap:6px;justify-content:center;margin-bottom:14px;">
          <button id="ritmo-play" class="game-btn">▶️ Escuchar Ritmo</button>
          <button id="ritmo-stop" class="game-btn" style="background:#e74c3c;">⏹️ Parar</button>
        </div>
        <div class="multi-options" style="justify-content:center;">
          ${options.map((o) => `<button class="option-btn ritmo-opt" data-val="${o.name}">${o.name}</button>`).join("")}
        </div>
        <p id="ritmo-fb" class="math-feedback"></p>
      </div>`;

    document.getElementById("ritmo-play").addEventListener("click", () => playPattern(pat));
    document.getElementById("ritmo-stop").addEventListener("click", () => {
      globalThis._ritmoStopFlag = true;
    });
    setTimeout(() => playPattern(pat), 500);

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".ritmo-opt");
      if (!btn) return;
      const fb = document.getElementById("ritmo-fb");
      const correct = btn.dataset.val === pat.name;
      if (correct) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = `✅ ¡Correcto! Es ${pat.name}.`;
        fb.style.color = "#2ecc71";
        artBeep(523, 0.18, "sine", 0.5, 0);
        artBeep(659, 0.18, "sine", 0.5, 0.2);
        artBeep(784, 0.25, "sine", 0.5, 0.4);
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${pat.name}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".ritmo-opt").forEach((b) => (b.disabled = true));
      level++;
      setTimeout(render, 1800);
    });
  }
  render();
};

// ── 3. Danza y Música del Cauca ────────────────────────────────────────────────
gameRenderers["danza-cauca"] = function (area) {
  const danzas = [
    {
      name: "Bambuco",
      emoji: "🎻",
      region: "Andes caucanos",
      desc: "Danza nacional de Colombia, símbolo de identidad andina. Nació en los Andes del Cauca y Nariño. El hombre corteja a la mujer con movimientos elegantes usando el pañuelo.",
      instrumentos: "Tiple, bandola, guitarra, flauta traversa",
      caracter: "Romántico y vivaz",
      quiz: "¿Qué instrumento es típico del Bambuco?",
      opciones: ["Tiple", "Marimba de chonta", "Gaita", "Tambor alegre"],
      correcta: "Tiple",
    },
    {
      name: "Currulao",
      emoji: "🥁",
      region: "Pacífico caucano",
      desc: "Expresión musical de las comunidades afrodescendientes del Pacífico sur. Declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2010.",
      instrumentos: "Marimba de chonta, cununos, bombos, shakers (guasa)",
      caracter: "Sagrado y ceremonial",
      quiz: "¿A qué comunidad pertenece el Currulao?",
      opciones: [
        "Comunidades afrodescendientes",
        "Comunidades indígenas Nasa",
        "Comunidades mestizas",
        "Comunidades Misak",
      ],
      correcta: "Comunidades afrodescendientes",
    },
    {
      name: "Chirimía",
      emoji: "🎺",
      region: "Norte del Cauca",
      desc: "Música festiva de viento y percusión, propia de las comunidades afro del norte del Cauca. Se toca en fiestas, ferias y celebraciones populares de la región.",
      instrumentos: "Clarinete, bombardino, platillos, caja y bombo",
      caracter: "Festivo y alegre",
      quiz: "¿En qué región del Cauca es popular la Chirimía?",
      opciones: ["Norte del Cauca", "Sur del Cauca", "Tierradentro", "Sibundoy"],
      correcta: "Norte del Cauca",
    },
    {
      name: "Marimba de Chonta",
      emoji: "🪘",
      region: "Pacífico caucano",
      desc: "Instrumento ancestral hecho de madera de chonta. Es el corazón de la música del litoral Pacífico y fue declarado Patrimonio de la Humanidad junto al Currulao.",
      instrumentos: "Marimba, cununos, shakers, bombos",
      caracter: "Ritual y festivo",
      quiz: "¿De qué material se fabrica la Marimba de Chonta?",
      opciones: ["Madera de chonta", "Bambú guadua", "Barro cocido", "Calabaza"],
      correcta: "Madera de chonta",
    },
    {
      name: "Rajaleña",
      emoji: "🎶",
      region: "Tierradentro, Cauca",
      desc: "Música tradicional del interior caucano con coplas cantadas sobre el trabajo del campo. Se entona al ritmo de hachas y machetes durante las mingas y cosechas comunitarias.",
      instrumentos: "Voz, chucho, rayadores y palmadas",
      caracter: "Campesino y jocoso",
      quiz: "¿En qué actividades se canta la Rajaleña?",
      opciones: ["Mingas y cosechas", "Bodas y bautizos", "Funerales", "Competencias deportivas"],
      correcta: "Mingas y cosechas",
    },
  ];

  let current = 0,
    score = 0;

  function renderInfo() {
    const d = danzas[current];
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🎭 Danzas y Músicas del Cauca</span>
          <span class="math-score">${current + 1} / ${danzas.length}</span>
        </div>
        <div style="text-align:center;padding:10px 0;">
          <div style="font-size:3.5rem;">${d.emoji}</div>
          <h2 style="margin:6px 0;color:#8e44ad;">${d.name}</h2>
          <p style="font-size:0.85rem;color:#888;margin:0;">📍 ${d.region}</p>
        </div>
        <div style="background:#f8f9fa;border-radius:12px;padding:12px 16px;margin:8px 0;border-left:4px solid #9b59b6;">
          <p style="margin:0 0 6px;font-size:0.9rem;">${d.desc}</p>
          <p style="margin:0;font-size:0.85rem;"><strong>🎵 Instrumentos:</strong> ${d.instrumentos}</p>
          <p style="margin:4px 0 0;font-size:0.85rem;"><strong>💃 Carácter:</strong> ${d.caracter}</p>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;">
          <button id="danza-narrar" class="game-btn" style="background:#9b59b6;">🔊 Escuchar</button>
          <button id="danza-stop" class="game-btn" style="background:#e74c3c;">⏹️ Parar</button>
          <button id="danza-quiz" class="game-btn">Pregunta ➡️</button>
        </div>
      </div>`;
    document.getElementById("danza-narrar").addEventListener("click", () => {
      narrateText(`${d.name}. ${d.desc}. Sus instrumentos son: ${d.instrumentos}.`);
    });
    document.getElementById("danza-stop").addEventListener("click", stopNarration);
    setTimeout(() => narrateText(`${d.name}. ${d.desc}`), 300);
    document.getElementById("danza-quiz").addEventListener("click", () => {
      renderQuiz();
    });
  }

  function renderQuiz() {
    const d = danzas[current];
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header">
          <span class="fono-badge">🎭 ${d.name}</span>
          <span class="math-score">Puntaje: ${score} | ${current + 1}/${danzas.length}</span>
        </div>
        <div style="text-align:center;font-size:2.5rem;margin:8px 0;">${d.emoji}</div>
        <p class="quiz-question">${d.quiz}</p>
        <div class="multi-options">
          ${d.opciones.map((o) => `<button class="option-btn danza-opt" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="danza-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".danza-opt");
      if (!btn) return;
      const fb = document.getElementById("danza-fb");
      const correct = btn.dataset.val === d.correcta;
      if (correct) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
        artBeep(523, 0.15, "sine", 0.4, 0);
        artBeep(659, 0.15, "sine", 0.4, 0.15);
      } else {
        btn.style.background = "#e74c3c";
        const corrBtn = area.querySelector(`[data-val="${d.correcta}"]`);
        if (corrBtn) corrBtn.style.background = "#2ecc71";
        fb.textContent = `❌ Era: ${d.correcta}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".danza-opt").forEach((b) => (b.disabled = true));
      current++;
      if (current >= danzas.length) {
        setTimeout(() => {
          area.innerHTML = `
            <div class="game-result fadeIn">
              <div style="font-size:3rem;">🎭</div>
              <h2>¡Conoces las danzas del Cauca!</h2>
              <p>Puntaje: <strong>${score} / ${danzas.length}</strong></p>
              <p style="font-size:0.85rem;color:#555;">Bambuco · Currulao · Chirimía · Marimba · Rajaleña</p>
              <button class="game-btn" onclick="gameRenderers['danza-cauca'](this.closest('.game-area'))">Jugar de nuevo</button>
            </div>`;
        }, 1500);
      } else {
        setTimeout(renderInfo, 1500);
      }
    });
  }
  renderInfo();
};

// ── 4. Pistas Musicales Offline ────────────────────────────────────────────────
gameRenderers["pistas-offline"] = function (area) {
  const pads = [
    { label: "Marimba", icon: "🪘", freq: 392, type: "triangle", dur: 0.4, color: "#e74c3c" },
    { label: "Cununo", icon: "🥁", freq: 120, type: "sine", dur: 0.3, color: "#e67e22" },
    { label: "Bombo", icon: "💥", freq: 60, type: "sine", dur: 0.5, color: "#f39c12" },
    { label: "Guasa", icon: "🪇", freq: 900, type: "square", dur: 0.15, color: "#2ecc71" },
    { label: "Flauta", icon: "🪈", freq: 784, type: "sine", dur: 0.35, color: "#3498db" },
    { label: "Tiple", icon: "🎸", freq: 330, type: "sawtooth", dur: 0.3, color: "#9b59b6" },
    { label: "Tambora", icon: "🥁", freq: 80, type: "sine", dur: 0.4, color: "#1abc9c" },
    { label: "Shaker", icon: "✨", freq: 1100, type: "square", dur: 0.12, color: "#e84393" },
  ];
  const melodias = [
    { name: "Bambuco", notes: [392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392], dur: 0.25, bpm: 90 },
    { name: "Currulao", notes: [220, 247, 277, 294, 330, 294, 247, 220], dur: 0.3, bpm: 100 },
    { name: "Chirimía", notes: [523, 587, 659, 698, 659, 587, 523, 494, 523], dur: 0.2, bpm: 120 },
  ];

  globalThis._melStopFlag = false;

  area.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="fono-header" style="background:#9b59b6;color:#fff;border-radius:10px;padding:8px 16px;">
        <span>🎵 Instrumentos del Cauca — Toca para sonar</span>
      </div>
      <div id="pads-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
        ${pads
          .map(
            (p, i) => `
          <button class="arte-pad" data-idx="${i}" style="background:${p.color};color:#fff;border:none;border-radius:14px;padding:18px 8px;font-size:0.85rem;font-weight:bold;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 4px 0 rgba(0,0,0,0.25);transition:transform 0.1s,box-shadow 0.1s;">
            <span style="font-size:2rem;">${p.icon}</span>
            <span>${p.label}</span>
          </button>`,
          )
          .join("")}
      </div>
      <div style="background:#fff;border-radius:12px;padding:10px 14px;border:1px solid #eee;">
        <p style="font-weight:bold;margin:0 0 8px;font-size:0.9rem;">🎼 Reproducir melodía tradicional:</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${melodias.map((m, i) => `<button class="game-btn mel-btn" data-idx="${i}" style="padding:6px 14px;font-size:0.85rem;">${m.name}</button>`).join("")}
          <button id="stop-mel" class="game-btn" style="padding:6px 14px;font-size:0.85rem;background:#e74c3c;">⏹️ Detener</button>
        </div>
        <p id="mel-status" style="font-size:0.8rem;color:#888;margin:6px 0 0;min-height:1.2em;"></p>
      </div>
    </div>`;

  document.getElementById("pads-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".arte-pad");
    if (!btn) return;
    const pad = pads[Number.parseInt(btn.dataset.idx, 10)];
    artBeep(pad.freq, pad.dur, pad.type, 0.6);
    btn.style.transform = "scale(0.93) translateY(4px)";
    btn.style.boxShadow = "none";
    setTimeout(() => {
      btn.style.transform = "";
      btn.style.boxShadow = "0 4px 0 rgba(0,0,0,0.25)";
    }, 120);
  });

  area.addEventListener("click", (e) => {
    const btn = e.target.closest(".mel-btn");
    if (!btn) return;
    globalThis._melStopFlag = true;
    const mel = melodias[Number.parseInt(btn.dataset.idx, 10)];
    const interval = 60000 / mel.bpm;
    const status = document.getElementById("mel-status");
    setTimeout(() => {
      globalThis._melStopFlag = false;
      if (status) status.textContent = `▶️ Reproduciendo: ${mel.name}…`;
      mel.notes.forEach((freq, i) => {
        setTimeout(() => {
          if (globalThis._melStopFlag) return;
          artBeep(freq, mel.dur, "sine", 0.5);
          if (i === mel.notes.length - 1) {
            const s = document.getElementById("mel-status");
            if (s) s.textContent = `✅ ${mel.name} completado`;
          }
        }, i * interval);
      });
    }, 120);
  });

  document.getElementById("stop-mel").addEventListener("click", () => {
    globalThis._melStopFlag = true;
    const s = document.getElementById("mel-status");
    if (s) s.textContent = "⏹️ Detenido";
  });
};

// ── 5. Lienzo de Dibujos Digitales ─────────────────────────────────────────────
gameRenderers["lienzo-digital"] = function (area) {
  const colors = [
    "#2d3436",
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#1abc9c",
    "#e84393",
    "#ffffff",
    "#fd79a8",
    "#6c5ce7",
  ];
  let currentColor = colors[0];
  let brushSize = 5;
  let drawing = false;
  let tool = "brush";
  let startX = 0,
    startY = 0;
  let snapshot = null;

  area.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:6px;">
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;background:#fff;padding:8px;border-radius:12px;border:1px solid #eee;">
        <div id="lienzo-palette" style="display:flex;gap:3px;flex-wrap:wrap;">
          ${colors.map((c, i) => `<button class="lienzo-swatch" data-color="${c}" style="width:22px;height:22px;background:${c};border-radius:50%;border:2px solid ${i === 0 ? "#333" : "#ccc"};cursor:pointer;flex-shrink:0;"></button>`).join("")}
        </div>
        <div style="display:flex;gap:3px;flex-wrap:wrap;margin-left:4px;">
          <button class="lienzo-tool game-btn" data-tool="brush"  style="padding:3px 8px;font-size:0.8rem;">🖌️</button>
          <button class="lienzo-tool game-btn" data-tool="eraser" style="padding:3px 8px;font-size:0.8rem;background:#95a5a6;">⬜</button>
          <button class="lienzo-tool game-btn" data-tool="line"   style="padding:3px 8px;font-size:0.8rem;background:#e67e22;">📏</button>
          <button class="lienzo-tool game-btn" data-tool="circle" style="padding:3px 8px;font-size:0.8rem;background:#9b59b6;">⭕</button>
          <button class="lienzo-tool game-btn" data-tool="rect"   style="padding:3px 8px;font-size:0.8rem;background:#e74c3c;">▭</button>
        </div>
        <label style="font-size:0.78rem;white-space:nowrap;">Grosor:<input type="range" id="lienzo-sz" min="1" max="24" value="${brushSize}" style="width:60px;vertical-align:middle;margin-left:4px;"></label>
        <button id="lienzo-clear" class="game-btn" style="padding:3px 8px;font-size:0.8rem;background:#e74c3c;">🗑️</button>
      </div>
      <div style="display:flex;gap:6px;align-items:center;background:#fff;padding:6px 10px;border-radius:12px;border:1px solid #eee;">
        <span style="font-size:0.8rem;font-weight:bold;color:#555;">Plantillas del Cauca:</span>
        <button class="game-btn lienzo-tpl" data-tpl="condor"  style="padding:3px 10px;font-size:0.8rem;background:#3498db;">🦅 Cóndor</button>
        <button class="game-btn lienzo-tpl" data-tpl="flor"    style="padding:3px 10px;font-size:0.8rem;background:#e74c3c;">🌸 Flor</button>
        <button class="game-btn lienzo-tpl" data-tpl="casa"    style="padding:3px 10px;font-size:0.8rem;background:#e67e22;">🏠 Vereda</button>
      </div>
      <canvas id="lienzo-canvas" width="640" height="320" style="background:#fff;border-radius:12px;border:2px solid #ddd;cursor:crosshair;display:block;max-width:100%;"></canvas>
      <p id="lienzo-tool-label" style="font-size:0.78rem;color:#888;text-align:center;margin:0;">Herramienta: 🖌️ Pincel</p>
    </div>`;

  const canvas = document.getElementById("lienzo-canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  function drawCondorTpl() {
    ctx.save();
    ctx.strokeStyle = "#2d3436";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(320, 160, 40, 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(280, 160);
    ctx.quadraticCurveTo(200, 120, 150, 140);
    ctx.quadraticCurveTo(180, 162, 280, 165);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(360, 160);
    ctx.quadraticCurveTo(440, 120, 490, 140);
    ctx.quadraticCurveTo(460, 162, 360, 165);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(320, 140, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  function drawFlorTpl() {
    ctx.save();
    const cx = 320,
      cy = 170;
    ctx.strokeStyle = "#27ae60";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 20);
    ctx.lineTo(cx, cy + 80);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2,
        px = cx + Math.cos(a) * 35,
        py = cy + Math.sin(a) * 35;
      ctx.beginPath();
      ctx.strokeStyle = "#e74c3c";
      ctx.ellipse(px, py, 14, 22, a, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = "#f1c40f";
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  function drawCasaTpl() {
    ctx.save();
    ctx.strokeStyle = "#e67e22";
    ctx.lineWidth = 2;
    ctx.strokeRect(250, 180, 140, 100);
    ctx.beginPath();
    ctx.moveTo(240, 180);
    ctx.lineTo(320, 120);
    ctx.lineTo(400, 180);
    ctx.stroke();
    ctx.strokeRect(300, 230, 40, 50);
    ctx.strokeRect(260, 200, 30, 25);
    ctx.beginPath();
    ctx.moveTo(275, 200);
    ctx.lineTo(275, 225);
    ctx.moveTo(260, 212);
    ctx.lineTo(290, 212);
    ctx.stroke();
    ctx.strokeStyle = "#27ae60";
    ctx.beginPath();
    ctx.moveTo(100, 280);
    ctx.lineTo(170, 200);
    ctx.lineTo(240, 280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(400, 280);
    ctx.lineTo(470, 210);
    ctx.lineTo(540, 280);
    ctx.stroke();
    ctx.restore();
  }

  document.getElementById("lienzo-palette").addEventListener("click", (e) => {
    const btn = e.target.closest(".lienzo-swatch");
    if (!btn) return;
    currentColor = btn.dataset.color;
    document.querySelectorAll(".lienzo-swatch").forEach((b) => (b.style.borderColor = "#ccc"));
    btn.style.borderColor = "#333";
    tool = "brush";
    document.getElementById("lienzo-tool-label").textContent = "Herramienta: 🖌️ Pincel";
  });

  area.addEventListener("click", (e) => {
    const toolBtn = e.target.closest(".lienzo-tool");
    if (toolBtn) {
      tool = toolBtn.dataset.tool;
      const labels = {
        brush: "🖌️ Pincel",
        eraser: "⬜ Borrador",
        line: "📏 Línea",
        circle: "⭕ Círculo",
        rect: "▭ Rectángulo",
      };
      document.getElementById("lienzo-tool-label").textContent = `Herramienta: ${labels[tool] || tool}`;
    }
    const tplBtn = e.target.closest(".lienzo-tpl");
    if (tplBtn) {
      if (tplBtn.dataset.tpl === "condor") drawCondorTpl();
      else if (tplBtn.dataset.tpl === "flor") drawFlorTpl();
      else if (tplBtn.dataset.tpl === "casa") drawCasaTpl();
    }
  });

  document.getElementById("lienzo-sz").addEventListener("input", (e) => {
    brushSize = Number.parseInt(e.target.value, 10);
  });
  document
    .getElementById("lienzo-clear")
    .addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

  canvas.addEventListener("mousedown", (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    drawing = true;
    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    } else {
      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    if (tool === "brush") {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.clearRect(e.offsetX - brushSize, e.offsetY - brushSize, brushSize * 2, brushSize * 2);
    } else {
      ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      } else if (tool === "circle") {
        const rx = Math.abs(e.offsetX - startX) / 2,
          ry = Math.abs(e.offsetY - startY) / 2;
        ctx.beginPath();
        ctx.ellipse(startX + (e.offsetX - startX) / 2, startY + (e.offsetY - startY) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.beginPath();
        ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
      }
    }
  });
  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });
  canvas.addEventListener("mouseleave", () => {
    drawing = false;
  });
};

// ── 6. Coreografías Básicas ────────────────────────────────────────────────────
gameRenderers["coreografias"] = function (area) {
  const danzas = [
    {
      name: "Bambuco",
      emoji: "🎻",
      color: "#9b59b6",
      descripcion: "Movimientos elegantes con pañuelo, característicos de los Andes caucanos.",
      pasos: [
        { symbol: "➡️", label: "Paso derecha", freq: 440 },
        { symbol: "⬅️", label: "Paso izquierda", freq: 392 },
        { symbol: "👐", label: "Abre brazos", freq: 523 },
        { symbol: "🔄", label: "Giro completo", freq: 587 },
        { symbol: "⬆️", label: "Paso adelante", freq: 659 },
        { symbol: "⬇️", label: "Paso atrás", freq: 494 },
      ],
    },
    {
      name: "Currulao",
      emoji: "🥁",
      color: "#e74c3c",
      descripcion: "Pasos del litoral Pacífico con movimientos de tierra y comunidad afro.",
      pasos: [
        { symbol: "🦶", label: "Golpe de pie", freq: 180 },
        { symbol: "👏", label: "Palmas", freq: 900 },
        { symbol: "⬇️", label: "Flexión", freq: 220 },
        { symbol: "🔄", label: "Giro", freq: 294 },
        { symbol: "👐", label: "Brazos abiertos", freq: 330 },
        { symbol: "⬆️", label: "Incorporarse", freq: 392 },
      ],
    },
    {
      name: "Chirimía",
      emoji: "🎺",
      color: "#e67e22",
      descripcion: "Danza festiva y alegre del norte del Cauca.",
      pasos: [
        { symbol: "⬆️", label: "Adelante", freq: 523 },
        { symbol: "➡️", label: "Derecha", freq: 659 },
        { symbol: "⬆️", label: "Adelante", freq: 523 },
        { symbol: "⬅️", label: "Izquierda", freq: 784 },
        { symbol: "👏", label: "Palmas", freq: 900 },
        { symbol: "🔄", label: "Giro", freq: 698 },
      ],
    },
  ];

  const SEQ_LEN = 4;
  let danzaIdx = 0,
    sequence = [],
    userSeq = [];

  function selectDanza() {
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div style="text-align:center;margin-bottom:12px;">
          <h2>💃 Coreografías Básicas</h2>
          <p style="color:#666;font-size:0.9rem;">Elige una danza del Cauca y sigue sus pasos</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
          ${danzas
            .map(
              (d, i) => `
            <button class="danza-sel-btn" data-idx="${i}" style="background:${d.color};color:#fff;border:none;border-radius:14px;padding:16px 8px;cursor:pointer;font-size:0.85rem;font-weight:bold;display:flex;flex-direction:column;align-items:center;gap:4px;">
              <span style="font-size:2rem;">${d.emoji}</span>
              <span>${d.name}</span>
            </button>`,
            )
            .join("")}
        </div>
      </div>`;
    area.addEventListener("click", function handler(e) {
      const btn = e.target.closest(".danza-sel-btn");
      if (!btn) return;
      area.removeEventListener("click", handler);
      danzaIdx = Number.parseInt(btn.dataset.idx, 10);
      buildSequence();
    });
  }

  function buildSequence() {
    const d = danzas[danzaIdx];
    sequence = [];
    for (let i = 0; i < SEQ_LEN; i++) {
      sequence.push(d.pasos[Math.floor(Math.random() * d.pasos.length)]);
    }
    showSequence();
  }

  function showSequence() {
    const d = danzas[danzaIdx];
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header" style="background:${d.color};color:#fff;border-radius:10px;padding:8px 16px;margin-bottom:8px;">
          <span>${d.emoji} ${d.name}</span>
          <span>¡Memoriza los pasos!</span>
        </div>
        <p style="text-align:center;font-size:0.88rem;color:#555;margin:4px 0 8px;">${d.descripcion}</p>
        <div id="coreo-display" style="display:flex;gap:10px;justify-content:center;margin:12px 0;min-height:80px;align-items:center;flex-wrap:wrap;"></div>
        <p id="coreo-status" style="text-align:center;color:#888;font-size:0.9rem;margin:0;">Observa la secuencia…</p>
      </div>`;

    const display = document.getElementById("coreo-display");
    let i = 0;
    function showNext() {
      if (i >= sequence.length) {
        setTimeout(playPhase, 700);
        return;
      }
      display.innerHTML = `
        <div style="background:${d.color}22;border:3px solid ${d.color};border-radius:14px;padding:10px 18px;text-align:center;">
          <div style="font-size:2.6rem;">${sequence[i].symbol}</div>
          <div style="font-size:0.75rem;color:#555;">${sequence[i].label}</div>
        </div>`;
      artBeep(sequence[i].freq, 0.2, "sine", 0.4);
      i++;
      setTimeout(showNext, 950);
    }
    showNext();
  }

  function playPhase() {
    const d = danzas[danzaIdx];
    userSeq = [];
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header" style="background:${d.color};color:#fff;border-radius:10px;padding:8px 16px;margin-bottom:8px;">
          <span>${d.emoji} ${d.name}</span>
          <span id="coreo-counter">Tu turno: 0/${SEQ_LEN}</span>
        </div>
        <p style="text-align:center;font-size:0.9rem;margin:4px 0 8px;">¡Repite los pasos en el mismo orden!</p>
        <div id="user-seq" style="display:flex;gap:8px;justify-content:center;min-height:46px;margin:4px 0 8px;font-size:2rem;align-items:center;flex-wrap:wrap;"></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px;">
          ${d.pasos
            .map(
              (p, i) => `
            <button class="coreo-btn game-btn" data-idx="${i}" style="background:${d.color};padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:2px;">
              <span style="font-size:1.8rem;">${p.symbol}</span>
              <span style="font-size:0.7rem;">${p.label}</span>
            </button>`,
            )
            .join("")}
        </div>
        <p id="coreo-fb" class="math-feedback"></p>
      </div>`;

    const seqEl = document.getElementById("user-seq");
    const counter = document.getElementById("coreo-counter");

    area.addEventListener("click", function handler(e) {
      const btn = e.target.closest(".coreo-btn");
      if (!btn) return;
      const idx = Number.parseInt(btn.dataset.idx, 10);
      const paso = d.pasos[idx];
      userSeq.push(paso);
      artBeep(paso.freq, 0.15, "sine", 0.4);
      seqEl.innerHTML = userSeq.map((p) => `<span title="${p.label}">${p.symbol}</span>`).join(" ");
      if (counter) counter.textContent = `Tu turno: ${userSeq.length}/${SEQ_LEN}`;

      const pos = userSeq.length - 1;
      if (userSeq[pos].symbol !== sequence[pos].symbol) {
        area.removeEventListener("click", handler);
        const fb = document.getElementById("coreo-fb");
        fb.textContent = `❌ Paso ${pos + 1} incorrecto. Era: ${sequence[pos].symbol} (${sequence[pos].label})`;
        fb.style.color = "#e74c3c";
        setTimeout(() => showResult(false), 1600);
        return;
      }
      if (userSeq.length >= SEQ_LEN) {
        area.removeEventListener("click", handler);
        const fb = document.getElementById("coreo-fb");
        fb.textContent = "✅ ¡Perfecto! ¡Completaste todos los pasos!";
        fb.style.color = "#2ecc71";
        artBeep(523, 0.15, "sine", 0.5, 0);
        artBeep(659, 0.15, "sine", 0.5, 0.15);
        artBeep(784, 0.2, "sine", 0.5, 0.3);
        setTimeout(() => showResult(true), 1500);
      }
    });
  }

  function showResult(success) {
    const d = danzas[danzaIdx];
    area.innerHTML = `
      <div class="game-result fadeIn">
        <div style="font-size:3rem;">${success ? "🏆" : "💪"}</div>
        <h2 style="color:${d.color};">${success ? "¡Excelente bailarín!" : "¡Buen intento!"}</h2>
        <p>Danza: <strong>${d.name}</strong></p>
        <p>Secuencia: ${sequence.map((p) => p.symbol).join(" ")}</p>
        <p>Tu respuesta: ${userSeq.map((p) => p.symbol).join(" ")}</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px;">
          <button class="game-btn" onclick="gameRenderers['coreografias'](this.closest('.game-area'))">Elegir otra danza</button>
          <button class="game-btn" style="background:${d.color};" id="retry-coreo">Repetir</button>
        </div>
      </div>`;
    document.getElementById("retry-coreo").addEventListener("click", buildSequence);
  }

  selectDanza();
};

// ── 7. Festival Iberoamericano de Teatro y Artesanías Caucanas ──────────────────
gameRenderers["festival-artesanias"] = function (area) {
  let temaActual = "teatro";
  let quizCurrent = 0,
    quizScore = 0;

  const infoTeatro = [
    {
      icon: "🎭",
      title: "Festival Iberoamericano de Teatro",
      desc: "El FITB (Festival Iberoamericano de Teatro de Bogotá) es uno de los festivales de teatro más grandes del mundo. Reúne compañías de más de 60 países. En el Cauca, el teatro comunitario y de calle tiene gran tradición.",
    },
    {
      icon: "🎪",
      title: "Teatro del Cauca",
      desc: "El Cauca tiene una rica tradición de teatro comunitario. Grupos como el Teatro Mosca y el Frente de Teatro del Cauca llevan el arte escénico a veredas y municipios apartados.",
    },
    {
      icon: "🪆",
      title: "Máscaras y Vestuario",
      desc: "Los actores caucanos usan máscaras y vestuarios inspirados en animales del Cauca, la naturaleza y las tradiciones ancestrales de los pueblos indígenas y afrocolombianos.",
    },
    {
      icon: "🌟",
      title: "Teatro Ritual Nasa",
      desc: "Las comunidades Nasa del Cauca tienen formas propias de expresión teatral: rituales, danzas ceremoniales y representaciones de su cosmogonía que narran la creación del mundo.",
    },
  ];
  const infoArtesanias = [
    {
      icon: "🧵",
      title: "Tejidos Nasa (Páez)",
      desc: "Los tejidos en lana de los Nasa son coloridos y geométricos. El rombo simboliza el ojo del dios del agua, las líneas representan los caminos del territorio ancestral.",
    },
    {
      icon: "🪴",
      title: "Alfarería de Popayán",
      desc: "La cerámica caucana es reconocida por sus figuras de barro cocido. En municipios como El Tambo se elaboran piezas de barro con técnicas prehispánicas conservadas por generaciones.",
    },
    {
      icon: "🎋",
      title: "Cestería en Guadua",
      desc: "Los artesanos crean canastos, muebles y adornos en guadua, el bambú gigante del Cauca. Es un material renovable y resistente, símbolo del paisaje caucano.",
    },
    {
      icon: "🪵",
      title: "Talla en Madera",
      desc: "En El Tambo y Timbío los artesanos tallan figuras de santos, animales y escenas del campo en madera, mezclando herencia española e indígena en cada pieza.",
    },
  ];
  const quizTeatro = [
    {
      q: "¿Cómo se llama el gran festival de teatro iberoamericano?",
      opts: ["FITB", "FESTICAUCA", "TEATRO ANDINO", "CARNAVAL"],
      ans: "FITB",
    },
    {
      q: "¿Qué usan los actores caucanos para representar animales?",
      opts: ["Máscaras", "Trajes espaciales", "Robots", "Solo la voz"],
      ans: "Máscaras",
    },
    {
      q: "¿Qué comunidad indígena del Cauca tiene teatro ritual?",
      opts: ["Comunidad Nasa", "Comunidad Wayú", "Comunidad Emberá", "Comunidad Sikuani"],
      ans: "Comunidad Nasa",
    },
  ];
  const quizArtesanias = [
    {
      q: "¿Qué simboliza el rombo en los tejidos Nasa?",
      opts: ["El ojo del dios del agua", "El sol", "La luna", "Una montaña"],
      ans: "El ojo del dios del agua",
    },
    {
      q: "¿Qué artesanía se hace con guadua en el Cauca?",
      opts: ["Cestería", "Tejidos", "Máscaras", "Pinturas"],
      ans: "Cestería",
    },
    {
      q: "¿En qué municipio del Cauca hay tradición de talla en madera?",
      opts: ["El Tambo", "Inzá", "López", "La Sierra"],
      ans: "El Tambo",
    },
  ];

  function renderMain() {
    area.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;gap:8px;">
          <button id="tab-teatro"     class="game-btn" style="flex:1;padding:10px;font-size:0.9rem;background:${temaActual === "teatro" ? "#e74c3c" : "#95a5a6"};">🎭 Teatro</button>
          <button id="tab-artesanias" class="game-btn" style="flex:1;padding:10px;font-size:0.9rem;background:${temaActual === "artesanias" ? "#e67e22" : "#95a5a6"};">🧵 Artesanías</button>
        </div>
        <div id="festival-content"></div>
        <button id="festival-quiz-btn" class="game-btn" style="background:${temaActual === "teatro" ? "#e74c3c" : "#e67e22"};">🎯 ¡Jugar Quiz sobre ${temaActual === "teatro" ? "Teatro" : "Artesanías"}!</button>
      </div>`;

    document.getElementById("tab-teatro").addEventListener("click", () => {
      temaActual = "teatro";
      renderMain();
    });
    document.getElementById("tab-artesanias").addEventListener("click", () => {
      temaActual = "artesanias";
      renderMain();
    });
    document.getElementById("festival-quiz-btn").addEventListener("click", () => {
      quizCurrent = 0;
      quizScore = 0;
      renderQuiz();
    });

    const info = temaActual === "teatro" ? infoTeatro : infoArtesanias;
    const content = document.getElementById("festival-content");
    content.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${info
          .map(
            (item) => `
          <div style="background:#fff;border-radius:12px;padding:10px;border:1px solid #eee;display:flex;flex-direction:column;gap:4px;">
            <div style="font-size:1.8rem;">${item.icon}</div>
            <strong style="font-size:0.85rem;color:#333;">${item.title}</strong>
            <p style="font-size:0.78rem;color:#666;margin:0;line-height:1.4;">${item.desc}</p>
            <div style="display:flex;gap:4px;margin-top:4px;">
              <button class="game-btn narrar-btn" data-text="${item.title}. ${item.desc}" style="padding:2px 8px;font-size:0.74rem;background:#3498db;">🔊 Escuchar</button>
              <button class="game-btn parar-narrar" style="padding:2px 8px;font-size:0.74rem;background:#e74c3c;">⏹️ Parar</button>
            </div>
          </div>`,
          )
          .join("")}
      </div>`;

    content.addEventListener("click", (e) => {
      const btn = e.target.closest(".narrar-btn");
      if (btn) narrateText(btn.dataset.text);
      const stopBtn = e.target.closest(".parar-narrar");
      if (stopBtn) stopNarration();
    });
  }

  function renderQuiz() {
    const quizData = temaActual === "teatro" ? quizTeatro : quizArtesanias;
    if (quizCurrent >= quizData.length) {
      const icon = temaActual === "teatro" ? "🎭" : "🧵";
      area.innerHTML = `
        <div class="game-result fadeIn">
          <div style="font-size:3rem;">${icon}</div>
          <h2>¡Conoces el ${temaActual === "teatro" ? "Teatro" : "Arte Artesanal"} del Cauca!</h2>
          <p>Puntaje: <strong>${quizScore} / ${quizData.length}</strong></p>
          <button class="game-btn" onclick="gameRenderers['festival-artesanias'](this.closest('.game-area'))">Volver al inicio</button>
        </div>`;
      return;
    }
    const q = quizData[quizCurrent];
    const opts = [...q.opts].sort(() => Math.random() - 0.5);
    area.innerHTML = `
      <div class="quiz-container fadeIn">
        <div class="fono-header" style="background:${temaActual === "teatro" ? "#e74c3c" : "#e67e22"};color:#fff;border-radius:10px;padding:8px 16px;">
          <span>${temaActual === "teatro" ? "🎭 Teatro" : "🧵 Artesanías"} del Cauca</span>
          <span>Puntaje: ${quizScore} | ${quizCurrent + 1}/${quizData.length}</span>
        </div>
        <p class="quiz-question">${q.q}</p>
        <div class="multi-options">
          ${opts.map((o) => `<button class="option-btn fest-opt" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="fest-fb" class="math-feedback"></p>
        <button id="fest-volver" class="game-btn" style="margin-top:8px;background:#95a5a6;padding:6px 14px;font-size:0.85rem;">← Volver</button>
      </div>`;

    document.getElementById("fest-volver").addEventListener("click", renderMain);
    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".fest-opt");
      if (!btn) return;
      const fb = document.getElementById("fest-fb");
      const correct = btn.dataset.val === q.ans;
      if (correct) {
        quizScore++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
        artBeep(523, 0.15, "sine", 0.4, 0);
        artBeep(659, 0.15, "sine", 0.4, 0.15);
      } else {
        btn.style.background = "#e74c3c";
        const corrBtn = area.querySelector(`[data-val="${q.ans}"]`);
        if (corrBtn) corrBtn.style.background = "#2ecc71";
        fb.textContent = `❌ La respuesta era: ${q.ans}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".fest-opt").forEach((b) => (b.disabled = true));
      quizCurrent++;
      setTimeout(renderQuiz, 1500);
    });
  }

  renderMain();
};
