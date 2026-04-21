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

// ── Suma y Resta ─────────────────────────────────────────────────────────────
gameRenderers["suma-resta"] = function (area) {
  let score = 0,
    total = 0,
    maxRounds = 10;

  function nextRound() {
    if (total >= maxRounds) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Terminaste!</h2><p>Puntaje: ${score} / ${maxRounds}</p><button class="game-btn" onclick="gameRenderers['suma-resta'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const isSum = Math.random() > 0.5;
    const op = isSum ? "+" : "-";
    const nums = isSum ? [a, b] : [Math.max(a, b), Math.min(a, b)];
    const answer = isSum ? nums[0] + nums[1] : nums[0] - nums[1];

    area.innerHTML = `
      <div class="math-container">
        <p class="math-score">Puntaje: ${score} / ${maxRounds} &nbsp;|&nbsp; Pregunta ${total + 1}</p>
        <div class="math-problem">${nums[0]} ${op} ${nums[1]} = ?</div>
        <input type="number" id="math-input" class="math-input" autofocus>
        <button id="math-check" class="game-btn">Responder</button>
        <p id="math-feedback" class="math-feedback"></p>
      </div>`;

    const input = document.getElementById("math-input");
    const check = document.getElementById("math-check");
    const feedback = document.getElementById("math-feedback");
    input.focus();

    function verify() {
      const val = parseInt(input.value, 10);
      total++;
      if (val === answer) {
        score++;
        feedback.textContent = "✅ ¡Correcto!";
        feedback.style.color = "#2ecc71";
      } else {
        feedback.textContent = `❌ La respuesta era ${answer}`;
        feedback.style.color = "#e74c3c";
      }
      setTimeout(nextRound, 1000);
    }
    check.addEventListener("click", verify);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verify();
    });
  }
  nextRound();
};

// ── Multiplicación ───────────────────────────────────────────────────────────
gameRenderers["multiplicacion"] = function (area) {
  let score = 0,
    total = 0,
    maxRounds = 10;

  function nextRound() {
    if (total >= maxRounds) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Terminaste!</h2><p>Puntaje: ${score} / ${maxRounds}</p><button class="game-btn" onclick="gameRenderers['multiplicacion'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a * b;

    // Generar opciones
    const opts = new Set([answer]);
    while (opts.size < 4) opts.add(Math.floor(Math.random() * 100) + 1);
    const options = [...opts].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="math-container">
        <p class="math-score">Puntaje: ${score} / ${maxRounds} &nbsp;|&nbsp; Pregunta ${total + 1}</p>
        <div class="math-problem">${a} × ${b} = ?</div>
        <div class="multi-options" id="multi-options">
          ${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}
        </div>
        <p id="math-feedback" class="math-feedback"></p>
      </div>`;

    document.getElementById("multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      total++;
      const feedback = document.getElementById("math-feedback");
      if (parseInt(btn.dataset.val) === answer) {
        score++;
        btn.style.background = "#2ecc71";
        feedback.textContent = "✅ ¡Correcto!";
        feedback.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        feedback.textContent = `❌ La respuesta era ${answer}`;
        feedback.style.color = "#e74c3c";
      }
      document.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      setTimeout(nextRound, 1000);
    });
  }
  nextRound();
};

// ── Figuras Geométricas ──────────────────────────────────────────────────────
gameRenderers["figuras-geometricas"] = function (area) {
  const figures = [
    {
      name: "Círculo",
      svg: `<svg viewBox="0 0 100 100" width="120" height="120"><circle cx="50" cy="50" r="45" fill="#6c5ce7"/></svg>`,
      sides: "0 lados",
    },
    {
      name: "Triángulo",
      svg: `<svg viewBox="0 0 100 100" width="120" height="120"><polygon points="50,5 95,95 5,95" fill="#e17055"/></svg>`,
      sides: "3 lados",
    },
    {
      name: "Cuadrado",
      svg: `<svg viewBox="0 0 100 100" width="120" height="120"><rect x="10" y="10" width="80" height="80" fill="#00b894"/></svg>`,
      sides: "4 lados iguales",
    },
    {
      name: "Rectángulo",
      svg: `<svg viewBox="0 0 140 100" width="140" height="100"><rect x="5" y="15" width="130" height="70" fill="#0984e3"/></svg>`,
      sides: "4 lados, 2 pares iguales",
    },
    {
      name: "Pentágono",
      svg: `<svg viewBox="0 0 100 100" width="120" height="120"><polygon points="50,5 97,38 79,92 21,92 3,38" fill="#fdcb6e"/></svg>`,
      sides: "5 lados",
    },
    {
      name: "Hexágono",
      svg: `<svg viewBox="0 0 100 100" width="120" height="120"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="#e84393"/></svg>`,
      sides: "6 lados",
    },
  ];

  let current = 0,
    score = 0;

  function shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function render() {
    if (current >= figures.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Terminaste!</h2><p>Puntaje: ${score} / ${figures.length}</p><button class="game-btn" onclick="gameRenderers['figuras-geometricas'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const fig = figures[current];
    const names = shuffle(figures.map((f) => f.name));

    area.innerHTML = `
      <div class="figuras-container">
        <p class="math-score">Puntaje: ${score} / ${figures.length} &nbsp;|&nbsp; Figura ${current + 1}</p>
        <div class="figuras-svg">${fig.svg}</div>
        <p style="margin:8px 0;color:#888;">${fig.sides}</p>
        <p style="font-weight:bold;margin-bottom:12px;">¿Qué figura es?</p>
        <div class="multi-options">${names.map((n) => `<button class="option-btn" data-val="${n}">${n}</button>`).join("")}</div>
        <p id="fig-feedback" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const feedback = document.getElementById("fig-feedback");
      if (btn.dataset.val === fig.name) {
        score++;
        btn.style.background = "#2ecc71";
        feedback.textContent = "✅ ¡Correcto!";
        feedback.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        feedback.textContent = `❌ Era: ${fig.name}`;
        feedback.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  CIENCIAS NATURALES                                             ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Animales y Hábitats ──────────────────────────────────────────────────────
gameRenderers["animales"] = function (area) {
  const pairs = [
    { animal: "🐪 Camello", habitat: "Desierto" },
    { animal: "🐧 Pingüino", habitat: "Antártida" },
    { animal: "🐒 Mono", habitat: "Selva" },
    { animal: "🐻‍❄️ Oso Polar", habitat: "Ártico" },
    { animal: "🐠 Pez Payaso", habitat: "Océano" },
    { animal: "🦁 León", habitat: "Sabana" },
  ];

  let score = 0,
    answered = 0;
  const shuffledHabitats = [...pairs].sort(() => Math.random() - 0.5);
  let selectedAnimal = null;

  area.innerHTML = `
    <div class="match-container">
      <p class="math-score" id="match-score">Puntaje: 0 / ${pairs.length}</p>
      <div class="match-columns">
        <div class="match-col" id="animals-col">
          ${pairs.map((p, i) => `<button class="match-card animal-card" data-habitat="${p.habitat}" data-idx="${i}">${p.animal}</button>`).join("")}
        </div>
        <div class="match-col" id="habitats-col">
          ${shuffledHabitats.map((p, i) => `<button class="match-card habitat-card" data-habitat="${p.habitat}" data-idx="${i}">${p.habitat}</button>`).join("")}
        </div>
      </div>
    </div>`;

  area.addEventListener("click", (e) => {
    const animalBtn = e.target.closest(".animal-card");
    const habitatBtn = e.target.closest(".habitat-card");

    if (animalBtn && !animalBtn.disabled) {
      area.querySelectorAll(".animal-card").forEach((b) => b.classList.remove("selected"));
      animalBtn.classList.add("selected");
      selectedAnimal = animalBtn;
    }

    if (habitatBtn && selectedAnimal && !habitatBtn.disabled) {
      answered++;
      if (selectedAnimal.dataset.habitat === habitatBtn.dataset.habitat) {
        score++;
        selectedAnimal.style.background = "#2ecc71";
        habitatBtn.style.background = "#2ecc71";
        selectedAnimal.disabled = true;
        habitatBtn.disabled = true;
      } else {
        selectedAnimal.style.background = "#e74c3c";
        habitatBtn.style.background = "#e74c3c";
        setTimeout(() => {
          selectedAnimal.style.background = "";
          habitatBtn.style.background = "";
        }, 600);
      }
      selectedAnimal.classList.remove("selected");
      selectedAnimal = null;
      document.getElementById("match-score").textContent = `Puntaje: ${score} / ${pairs.length}`;
      if (score === pairs.length) {
        setTimeout(() => {
          area.innerHTML = `<div class="game-result"><h2>🎉 ¡Todos los animales en su hábitat!</h2><button class="game-btn" onclick="gameRenderers['animales'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
        }, 500);
      }
    }
  });
};

// ── El Cuerpo Humano ─────────────────────────────────────────────────────────
gameRenderers["cuerpo-humano"] = function (area) {
  const questions = [
    { q: "¿Qué órgano bombea la sangre?", options: ["Corazón", "Pulmón", "Hígado", "Riñón"], answer: "Corazón" },
    {
      q: "¿Con qué parte del cuerpo respiramos?",
      options: ["Pulmones", "Estómago", "Cerebro", "Huesos"],
      answer: "Pulmones",
    },
    { q: "¿Cuántos huesos tiene un adulto (aprox.)?", options: ["206", "100", "350", "50"], answer: "206" },
    { q: "¿Qué órgano controla todo el cuerpo?", options: ["Cerebro", "Corazón", "Hígado", "Piel"], answer: "Cerebro" },
    {
      q: "¿Dónde se digieren los alimentos?",
      options: ["Estómago", "Pulmones", "Riñones", "Corazón"],
      answer: "Estómago",
    },
    { q: "¿Qué protege nuestros órganos internos?", options: ["Huesos", "Pelo", "Uñas", "Dientes"], answer: "Huesos" },
  ];

  let current = 0,
    score = 0;

  function render() {
    if (current >= questions.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Terminaste!</h2><p>Puntaje: ${score} / ${questions.length}</p><button class="game-btn" onclick="gameRenderers['cuerpo-humano'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const q = questions[current];
    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${questions.length} &nbsp;|&nbsp; Pregunta ${current + 1}</p>
        <p class="quiz-question">${q.q}</p>
        <div class="multi-options">${q.options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="quiz-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("quiz-fb");
      if (btn.dataset.val === q.answer) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ La respuesta era: ${q.answer}`;
        fb.style.color = "#e74c3c";
      }
      area.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
      current++;
      setTimeout(render, 1000);
    });
  }
  render();
};

// ── Las Plantas ──────────────────────────────────────────────────────────────
gameRenderers["plantas"] = function (area) {
  const parts = [
    { name: "Raíz", emoji: "🌱", desc: "Absorbe agua y nutrientes del suelo" },
    { name: "Tallo", emoji: "🌿", desc: "Sostiene la planta y transporta nutrientes" },
    { name: "Hoja", emoji: "🍃", desc: "Realiza la fotosíntesis" },
    { name: "Flor", emoji: "🌸", desc: "Órgano de reproducción" },
    { name: "Fruto", emoji: "🍎", desc: "Contiene las semillas" },
    { name: "Semilla", emoji: "🫘", desc: "De ella nace una nueva planta" },
  ];

  let current = 0,
    score = 0;
  const shuffled = [...parts].sort(() => Math.random() - 0.5);

  function render() {
    if (current >= shuffled.length) {
      area.innerHTML = `<div class="game-result"><h2>🎉 ¡Conoces las partes de la planta!</h2><p>Puntaje: ${score} / ${parts.length}</p><button class="game-btn" onclick="gameRenderers['plantas'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      return;
    }
    const part = shuffled[current];
    const options = [...parts].sort(() => Math.random() - 0.5).map((p) => p.name);

    area.innerHTML = `
      <div class="quiz-container">
        <p class="math-score">Puntaje: ${score} / ${parts.length} &nbsp;|&nbsp; Parte ${current + 1}</p>
        <div style="font-size:3rem;margin-bottom:10px;">${part.emoji}</div>
        <p class="quiz-question">${part.desc}</p>
        <p style="font-weight:bold;margin-bottom:12px;">¿Qué parte de la planta es?</p>
        <div class="multi-options">${options.map((o) => `<button class="option-btn" data-val="${o}">${o}</button>`).join("")}</div>
        <p id="plant-fb" class="math-feedback"></p>
      </div>`;

    area.querySelector(".multi-options").addEventListener("click", (e) => {
      const btn = e.target.closest(".option-btn");
      if (!btn) return;
      const fb = document.getElementById("plant-fb");
      if (btn.dataset.val === part.name) {
        score++;
        btn.style.background = "#2ecc71";
        fb.textContent = "✅ ¡Correcto!";
        fb.style.color = "#2ecc71";
      } else {
        btn.style.background = "#e74c3c";
        fb.textContent = `❌ Era: ${part.name}`;
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
