// ── Registro de funciones que renderizan cada juego ──────────────────────────
// Cada función recibe el elemento contenedor (game-area) y lo llena.
const gameRenderers = {};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  LENGUAJE — Fauna y Flora del Cauca                             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Datos compartidos: palabras de fauna y flora del Cauca ───────────────────
const caucaWords = [
  { word: "CÓNDOR", syllables: ["CÓN", "DOR"], type: "fauna", desc: "Ave majestuosa que vuela en los Andes del Cauca" },
  {
    word: "ORQUÍDEA",
    syllables: ["OR", "QUÍ", "DE", "A"],
    type: "flora",
    desc: "Flor exótica que crece en los bosques del Cauca",
  },
  { word: "GUADUA", syllables: ["GUA", "DU", "A"], type: "flora", desc: "Bambú gigante típico del paisaje caucano" },
  {
    word: "COLIBRÍ",
    syllables: ["CO", "LI", "BRÍ"],
    type: "fauna",
    desc: "Pequeña ave que se alimenta del néctar de las flores",
  },
  { word: "TUCÁN", syllables: ["TU", "CÁN"], type: "fauna", desc: "Ave de pico grande y colorido de la selva caucana" },
  { word: "CEDRO", syllables: ["CE", "DRO"], type: "flora", desc: "Árbol noble de los bosques del Cauca" },
  { word: "DANTA", syllables: ["DAN", "TA"], type: "fauna", desc: "Mamífero grande también llamado tapir" },
  {
    word: "CEIBA",
    syllables: ["CEI", "BA"],
    type: "flora",
    desc: "Árbol gigante sagrado de las comunidades del Cauca",
  },
  {
    word: "ARMADILLO",
    syllables: ["AR", "MA", "DI", "LLO"],
    type: "fauna",
    desc: "Animal con caparazón que vive en el Cauca",
  },
  {
    word: "HELECHO",
    syllables: ["HE", "LE", "CHO"],
    type: "flora",
    desc: "Planta antigua de los bosques húmedos caucanos",
  },
  {
    word: "GUACAMAYA",
    syllables: ["GUA", "CA", "MA", "YA"],
    type: "fauna",
    desc: "Ave de plumaje rojo, azul y amarillo",
  },
  {
    word: "BROMELIA",
    syllables: ["BRO", "ME", "LI", "A"],
    type: "flora",
    desc: "Planta que crece sobre los árboles del Cauca",
  },
  { word: "ROBLE", syllables: ["RO", "BLE"], type: "flora", desc: "Árbol fuerte de las montañas caucanas" },
  {
    word: "ZARIGÜEYA",
    syllables: ["ZA", "RI", "GÜE", "YA"],
    type: "fauna",
    desc: "Marsupial nocturno de los bosques del Cauca",
  },
  { word: "FRAILEJÓN", syllables: ["FRAI", "LE", "JÓN"], type: "flora", desc: "Planta del páramo que retiene agua" },
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
        <div class="fono-word-display">
          <span class="fono-word bounce">${item.word}</span>
          <button class="fono-audio-btn" id="fono-listen" title="Escuchar">🔊</button>
        </div>
        <p class="fono-desc">${item.desc}</p>
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
        <button class="fono-audio-btn" id="sil-listen" title="Escuchar la palabra" style="font-size:2rem;margin-bottom:8px;">🔊 Escuchar</button>
        <p class="fono-desc">${item.desc}</p>
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
        <button class="fono-audio-btn" id="vocab-listen" title="Escuchar">🔊 Escuchar oración</button>
        ${wordData ? `<p class="fono-desc">Palabra clave: <strong>${wordData.word}</strong> (${wordData.syllables.join(" - ")})</p>` : ""}
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
        <button class="fono-audio-btn" id="conteo-listen" style="margin-bottom:10px;">🔊 Escuchar el conteo</button>
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
        <button class="fono-audio-btn" id="campo-listen" style="margin-bottom:12px;">🔊 Escuchar problema</button>
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
        <button class="fono-audio-btn" id="sv-listen" style="margin-bottom:10px;">🔊 Escuchar</button>
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
        <button class="fono-audio-btn" id="cls-listen" style="margin-bottom:8px;">🔊 Escuchar</button>
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
        <button class="fono-audio-btn" id="cb-listen" style="margin-bottom:8px;">🔊 Escuchar</button>
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

// ── Países y Capitales ───────────────────────────────────────────────────────
gameRenderers["paises"] = function (area) {
  const data = [
    { country: "Colombia", capital: "Bogotá" },
    { country: "México", capital: "Ciudad de México" },
    { country: "Argentina", capital: "Buenos Aires" },
    { country: "España", capital: "Madrid" },
    { country: "Perú", capital: "Lima" },
    { country: "Chile", capital: "Santiago" },
    { country: "Brasil", capital: "Brasilia" },
    { country: "Francia", capital: "París" },
  ];

  let current = 0,
    score = 0;
  const shuffled = [...data].sort(() => Math.random() - 0.5);

  function render() {
    if (current >= shuffled.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Excelente geógrafo!</h2><p>Puntaje: ${score} / ${shuffled.length}</p><button class="game-btn" onclick="gameRenderers['paises'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const item = shuffled[current];
    const options = [
      ...new Set([
        item.capital,
        ...data
          .filter((d) => d.capital !== item.capital)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((d) => d.capital),
      ]),
    ].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${shuffled.length} &nbsp;|&nbsp; Pregunta ${current + 1}</p>
        <p class="quiz-question">¿Cuál es la capital de <strong>${item.country}</strong>?</p>
        <div class="multi-options">${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="cap-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("cap-fb");
      if (btn.dataset.val === item.capital) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${item.capital}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ── Banderas del Mundo ───────────────────────────────────────────────────────
gameRenderers["banderas"] = function (area) {
  const flags = [
    { country: "Colombia", flag: "🇨🇴" },
    { country: "México", flag: "🇲🇽" },
    { country: "Argentina", flag: "🇦🇷" },
    { country: "Brasil", flag: "🇧🇷" },
    { country: "España", flag: "🇪🇸" },
    { country: "Francia", flag: "🇫🇷" },
    { country: "Japón", flag: "🇯🇵" },
    { country: "Estados Unidos", flag: "🇺🇸" },
    { country: "Italia", flag: "🇮🇹" },
    { country: "Alemania", flag: "🇩🇪" },
  ];

  let current = 0,
    score = 0;
  const shuffled = [...flags].sort(() => Math.random() - 0.5).slice(0, 8);

  function render() {
    if (current >= shuffled.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Gran conocedor de banderas!</h2><p>Puntaje: ${score} / ${shuffled.length}</p><button class="game-btn" onclick="gameRenderers['banderas'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const item = shuffled[current];
    const options = [
      ...new Set([
        item.country,
        ...flags
          .filter((f) => f.country !== item.country)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((f) => f.country),
      ]),
    ].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${shuffled.length} &nbsp;|&nbsp; Pregunta ${current + 1}</p>
        <div style="font-size:5rem;margin-bottom:16px;">${item.flag}</div>
        <p class="quiz-question">¿De qué país es esta bandera?</p>
        <div class="multi-options">${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="flag-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("flag-fb");
      if (btn.dataset.val === item.country) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${item.country}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ── Historia Divertida ───────────────────────────────────────────────────────
gameRenderers["historia"] = function (area) {
  const questions = [
    {
      q: "¿Quién llegó a América en 1492?",
      options: ["Cristóbal Colón", "Hernán Cortés", "Simón Bolívar", "Napoleón"],
      answer: "Cristóbal Colón",
    },
    {
      q: "¿Qué civilización construyó las pirámides de Egipto?",
      options: ["Egipcios", "Romanos", "Mayas", "Griegos"],
      answer: "Egipcios",
    },
    {
      q: "¿En qué continente vivían los dinosaurios?",
      options: ["En todos", "Solo América", "Solo África", "Solo Asia"],
      answer: "En todos",
    },
    {
      q: "¿Qué invento cambió la comunicación escrita?",
      options: ["La imprenta", "El teléfono", "La rueda", "El fuego"],
      answer: "La imprenta",
    },
    {
      q: "¿Quién pintó la Mona Lisa?",
      options: ["Leonardo da Vinci", "Pablo Picasso", "Miguel Ángel", "Van Gogh"],
      answer: "Leonardo da Vinci",
    },
    {
      q: "¿Cuál fue la primera civilización de América?",
      options: ["Olmeca", "Azteca", "Inca", "Maya"],
      answer: "Olmeca",
    },
  ];

  let current = 0,
    score = 0;

  function render() {
    if (current >= questions.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Gran historiador!</h2><p>Puntaje: ${score} / ${questions.length}</p><button class="game-btn" onclick="gameRenderers['historia'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const q = questions[current];
    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${questions.length} &nbsp;|&nbsp; Pregunta ${current + 1}</p>
        <p class="quiz-question">${q.q}</p>
        <div class="multi-options">${q.options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="hist-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("hist-fb");
      if (btn.dataset.val === q.answer) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${q.answer}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  EDUCACIÓN ARTÍSTICA                                            ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Colorear ─────────────────────────────────────────────────────────────────
gameRenderers["colorear"] = function (area) {
  const colors = [
    "#e74c3c",
    "#e67e22",
    "#f1c40f",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#1abc9c",
    "#e84393",
    "#ffffff",
    "#2d3436",
  ];
  let currentColor = colors[0];

  // Dibujo simple: cuadrícula para colorear
  const ROWS = 12,
    COLS = 16;

  area.innerHTML = `
    <div class="colorear-container">
      <div class="color-palette" id="color-palette">
        ${colors.map((c) => `<button class="color-swatch${c === currentColor ? " active" : ""}" data-color="${c}" style="background:${c};width:32px;height:32px;border-radius:50%;border:3px solid ${c === currentColor ? "#333" : "transparent"};cursor:pointer;"></button>`).join("")}
      </div>
      <div class="colorear-grid" id="colorear-grid" style="display:grid;grid-template-columns:repeat(${COLS},28px);gap:1px;margin-top:12px;"></div>
    </div>`;

  const gridEl = document.getElementById("colorear-grid");
  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement("div");
    cell.style.cssText = "width:28px;height:28px;background:#f5f5f5;border:1px solid #ddd;cursor:pointer;";
    cell.className = "colorear-cell";
    gridEl.appendChild(cell);
  }

  let painting = false;

  document.getElementById("color-palette").addEventListener("click", (e) => {
    const swatch = e.target.closest(".color-swatch");
    if (!swatch) return;
    currentColor = swatch.dataset.color;
    document.querySelectorAll(".color-swatch").forEach((s) => {
      s.style.borderColor = "transparent";
    });
    swatch.style.borderColor = "#333";
  });

  gridEl.addEventListener("mousedown", (e) => {
    painting = true;
    const cell = e.target.closest(".colorear-cell");
    if (cell) cell.style.background = currentColor;
  });
  gridEl.addEventListener("mouseover", (e) => {
    if (!painting) return;
    const cell = e.target.closest(".colorear-cell");
    if (cell) cell.style.background = currentColor;
  });
  gridEl.addEventListener("mouseup", () => (painting = false));
  gridEl.addEventListener("mouseleave", () => (painting = false));
};

// ── Instrumentos Musicales ───────────────────────────────────────────────────
gameRenderers["instrumentos"] = function (area) {
  const instruments = [
    { name: "Piano", emoji: "🎹", family: "Teclado", desc: "Tiene teclas blancas y negras" },
    { name: "Guitarra", emoji: "🎸", family: "Cuerda", desc: "Tiene 6 cuerdas y se rasguea" },
    { name: "Batería", emoji: "🥁", family: "Percusión", desc: "Se toca con baquetas" },
    { name: "Violín", emoji: "🎻", family: "Cuerda", desc: "Se toca con un arco" },
    { name: "Trompeta", emoji: "🎺", family: "Viento metal", desc: "Instrumento de viento con pistones" },
    { name: "Flauta", emoji: "🪈", family: "Viento madera", desc: "Se sopla por un orificio lateral" },
    { name: "Saxofón", emoji: "🎷", family: "Viento madera", desc: "Muy popular en el jazz" },
    { name: "Maracas", emoji: "🪇", family: "Percusión", desc: "Se agitan para producir sonido" },
  ];

  let current = 0,
    score = 0;
  const shuffled = [...instruments].sort(() => Math.random() - 0.5);

  function render() {
    if (current >= shuffled.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Gran músico!</h2><p>Puntaje: ${score} / ${shuffled.length}</p><button class="game-btn" onclick="gameRenderers['instrumentos'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const inst = shuffled[current];
    const options = [
      ...new Set([
        inst.name,
        ...instruments
          .filter((i) => i.name !== inst.name)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((i) => i.name),
      ]),
    ].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${shuffled.length} &nbsp;|&nbsp; Instrumento ${current + 1}</p>
        <div style="font-size:4rem;margin-bottom:8px;">${inst.emoji}</div>
        <p style="color:#888;margin-bottom:4px;">Familia: ${inst.family}</p>
        <p class="quiz-question">${inst.desc}</p>
        <div class="multi-options">${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="inst-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("inst-fb");
      if (btn.dataset.val === inst.name) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${inst.name}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ── Dibujo Libre ─────────────────────────────────────────────────────────────
gameRenderers["dibujo-libre"] = function (area) {
  const colors = ["#2d3436", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e84393", "#ffffff"];
  let currentColor = colors[0];
  let brushSize = 4;
  let drawing = false;

  area.innerHTML = `
    <div class="dibujo-container">
      <div class="dibujo-toolbar" style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">
        <div id="dibujo-palette" style="display:flex;gap:4px;">
          ${colors.map((c) => `<button class="color-swatch${c === currentColor ? " active" : ""}" data-color="${c}" style="background:${c};width:28px;height:28px;border-radius:50%;border:3px solid ${c === currentColor ? "#333" : "#ccc"};cursor:pointer;"></button>`).join("")}
        </div>
        <label style="font-size:0.85rem;">Grosor: <input type="range" id="brush-size" min="1" max="20" value="${brushSize}" style="width:80px;"></label>
        <button id="clear-canvas" class="game-btn" style="padding:6px 14px;font-size:0.85rem;">Limpiar</button>
      </div>
      <canvas id="dibujo-canvas" width="600" height="350" style="background:#fff;border-radius:12px;border:1px solid #ddd;cursor:crosshair;display:block;"></canvas>
    </div>`;

  const canvas = document.getElementById("dibujo-canvas");
  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  document.getElementById("dibujo-palette").addEventListener("click", (e) => {
    const swatch = e.target.closest(".color-swatch");
    if (!swatch) return;
    currentColor = swatch.dataset.color;
    document.querySelectorAll("#dibujo-palette .color-swatch").forEach((s) => (s.style.borderColor = "#ccc"));
    swatch.style.borderColor = "#333";
  });

  document.getElementById("brush-size").addEventListener("input", (e) => (brushSize = e.target.value));
  document
    .getElementById("clear-canvas")
    .addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  canvas.addEventListener("mouseup", () => (drawing = false));
  canvas.addEventListener("mouseleave", () => (drawing = false));
};
