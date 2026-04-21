// ── Registro de funciones que renderizan cada juego ──────────────────────────
// Cada función recibe el elemento contenedor (game-area) y lo llena.
const gameRenderers = {};

// ╔══════════════════════════════════════════════════════════════════╗
// ║  LENGUAJE                                                       ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── Sopa de Letras ───────────────────────────────────────────────────────────
gameRenderers["sopa-letras"] = function (area) {
  const words = ["GATO", "PERRO", "CASA", "SOL", "LUNA", "ARBOL", "FLOR", "RIO"];
  const SIZE = 10;
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  const placed = [];

  function placeWord(word) {
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [0, -1],
      [-1, 0],
    ];
    for (let attempt = 0; attempt < 100; attempt++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i,
          nc = c + dc * i;
        if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
          fits = false;
          break;
        }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== word[i]) {
          fits = false;
          break;
        }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i];
        placed.push(word);
        return true;
      }
    }
    return false;
  }

  words.forEach(placeWord);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (grid[r][c] === "") grid[r][c] = letters[Math.floor(Math.random() * 26)];

  let selecting = false,
    selected = [],
    foundCells = new Set();

  area.innerHTML = `
    <div class="sopa-container">
      <div class="sopa-grid" id="sopa-grid"></div>
      <div class="sopa-words" id="sopa-words">
        <h3>Encuentra:</h3>
        ${placed.map((w) => `<span class="sopa-word" id="sw-${w}">${w}</span>`).join("")}
      </div>
    </div>`;

  const gridEl = document.getElementById("sopa-grid");
  gridEl.style.cssText = `display:grid;grid-template-columns:repeat(${SIZE},36px);gap:2px;user-select:none;`;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.textContent = grid[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.className = "sopa-cell";
      cell.style.cssText =
        "width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:#e8e5ff;border-radius:4px;font-weight:bold;cursor:pointer;font-size:0.95rem;";
      gridEl.appendChild(cell);
    }
  }

  gridEl.addEventListener("mousedown", (e) => {
    const cell = e.target.closest(".sopa-cell");
    if (!cell) return;
    selecting = true;
    selected = [cell];
    cell.style.background = "#b8b0ff";
  });

  gridEl.addEventListener("mouseover", (e) => {
    if (!selecting) return;
    const cell = e.target.closest(".sopa-cell");
    if (!cell || selected.includes(cell)) return;
    selected.push(cell);
    cell.style.background = "#b8b0ff";
  });

  gridEl.addEventListener("mouseup", () => {
    selecting = false;
    const word = selected.map((c) => c.textContent).join("");
    const wordRev = word.split("").reverse().join("");
    const match = placed.find((w) => w === word || w === wordRev);
    if (match) {
      selected.forEach((c) => {
        c.style.background = "#6c5ce7";
        c.style.color = "#fff";
        foundCells.add(c);
      });
      const tag = document.getElementById("sw-" + match);
      if (tag) {
        tag.style.textDecoration = "line-through";
        tag.style.opacity = "0.5";
      }
    } else {
      selected.forEach((c) => {
        if (!foundCells.has(c)) c.style.background = "#e8e5ff";
      });
    }
    selected = [];
  });
};

// ── Completa la Palabra ──────────────────────────────────────────────────────
gameRenderers["completa-palabra"] = function (area) {
  const wordList = [
    { word: "MARIPOSA", hint: "Insecto con alas coloridas" },
    { word: "ELEFANTE", hint: "Animal grande con trompa" },
    { word: "ESTRELLA", hint: "Brilla en el cielo de noche" },
    { word: "CHOCOLATE", hint: "Dulce hecho de cacao" },
    { word: "DINOSAURIO", hint: "Reptil gigante extinto" },
    { word: "BICICLETA", hint: "Vehículo de dos ruedas" },
  ];

  let current = 0,
    score = 0;

  function render() {
    const item = wordList[current];
    const letters = item.word.split("");
    const hideCount = Math.ceil(letters.length * 0.4);
    const indices = [];
    while (indices.length < hideCount) {
      const i = Math.floor(Math.random() * letters.length);
      if (!indices.includes(i)) indices.push(i);
    }

    area.innerHTML = `
      <div class="completa-container">
        <p class="completa-score">Puntaje: ${score} / ${wordList.length}</p>
        <p class="completa-hint">Pista: ${item.hint}</p>
        <div class="completa-word" id="completa-word">
          ${letters
            .map((l, i) =>
              indices.includes(i)
                ? `<input type="text" maxlength="1" class="completa-input" data-idx="${i}" data-letter="${l}" style="width:36px;height:42px;text-align:center;font-size:1.2rem;border:2px solid #a29bfe;border-radius:8px;text-transform:uppercase;">`
                : `<span style="display:inline-flex;width:36px;height:42px;align-items:center;justify-content:center;font-size:1.2rem;font-weight:bold;">${l}</span>`,
            )
            .join("")}
        </div>
        <button id="completa-check" class="game-btn">Comprobar</button>
      </div>`;

    const inputs = area.querySelectorAll(".completa-input");
    inputs[0]?.focus();
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
      });
    });

    document.getElementById("completa-check").addEventListener("click", () => {
      let correct = true;
      inputs.forEach((inp) => {
        if (inp.value.toUpperCase() !== inp.dataset.letter) {
          correct = false;
          inp.style.borderColor = "#e74c3c";
        } else {
          inp.style.borderColor = "#2ecc71";
        }
      });
      if (correct) {
        score++;
        current++;
        if (current < wordList.length) setTimeout(render, 600);
        else {
          area.innerHTML = `<div class="game-result"><h2>🎉 ¡Completaste todas las palabras!</h2><p>Puntaje: ${score} / ${wordList.length}</p><button class="game-btn" onclick="gameRenderers['completa-palabra'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
        }
      }
    });
  }
  render();
};

// ── Ordena Oraciones ─────────────────────────────────────────────────────────
gameRenderers["ordena-oraciones"] = function (area) {
  const sentences = [
    "El gato duerme en la cama",
    "Los niños juegan en el parque",
    "Mi mamá cocina una torta deliciosa",
    "El sol sale por la mañana",
    "Las flores crecen en el jardín",
  ];

  let current = 0,
    score = 0;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function render() {
    const words = sentences[current].split(" ");
    const shuffled = shuffle(words);
    let chosen = [];

    area.innerHTML = `
      <div class="ordena-container">
        <p class="ordena-score">Puntaje: ${score} / ${sentences.length}</p>
        <div class="ordena-answer" id="ordena-answer" style="min-height:48px;padding:10px;background:#e8e5ff;border-radius:12px;margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;"></div>
        <div class="ordena-options" id="ordena-options" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
        <button id="ordena-check" class="game-btn" style="margin-top:16px;">Comprobar</button>
      </div>`;

    const optionsEl = document.getElementById("ordena-options");
    const answerEl = document.getElementById("ordena-answer");

    shuffled.forEach((w, i) => {
      const btn = document.createElement("button");
      btn.textContent = w;
      btn.className = "word-chip";
      btn.dataset.index = i;
      btn.addEventListener("click", () => {
        chosen.push(w);
        btn.disabled = true;
        btn.style.opacity = "0.4";
        const chip = document.createElement("span");
        chip.textContent = w;
        chip.className = "word-chip chosen";
        chip.addEventListener("click", () => {
          chosen = chosen.filter((x) =>
            x !== w || chosen.indexOf(x) !== chosen.lastIndexOf(x)
              ? true
              : (chosen.splice(chosen.indexOf(x), 1), false),
          );
          chosen = chosen.filter(() => true); // recompact
          chip.remove();
          btn.disabled = false;
          btn.style.opacity = "1";
          rebuildAnswer();
        });
        answerEl.appendChild(chip);
      });
      optionsEl.appendChild(btn);
    });

    function rebuildAnswer() {
      answerEl.innerHTML = "";
      chosen.forEach((w) => {
        const chip = document.createElement("span");
        chip.textContent = w;
        chip.className = "word-chip chosen";
        answerEl.appendChild(chip);
      });
    }

    document.getElementById("ordena-check").addEventListener("click", () => {
      if (chosen.join(" ") === sentences[current]) {
        score++;
        current++;
        if (current < sentences.length) setTimeout(render, 600);
        else
          area.innerHTML = `<div class="game-result"><h2>🎉 ¡Excelente!</h2><p>Puntaje: ${score} / ${sentences.length}</p><button class="game-btn" onclick="gameRenderers['ordena-oraciones'](this.closest('.game-area'))">Jugar de nuevo</button></div>`;
      } else {
        answerEl.style.border = "2px solid #e74c3c";
        setTimeout(() => (answerEl.style.border = "none"), 800);
      }
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
