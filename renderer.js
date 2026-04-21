// Descripciones de los juegos
const gameDescriptions = {
  "sopa-letras": { title: "Sopa de Letras", desc: "Encuentra las palabras escondidas en la sopa de letras." },
  "completa-palabra": { title: "Completa la Palabra", desc: "Completa las letras que faltan en cada palabra." },
  "ordena-oraciones": {
    title: "Ordena Oraciones",
    desc: "Pon las palabras en el orden correcto para formar oraciones.",
  },
  "suma-resta": { title: "Suma y Resta", desc: "Resuelve operaciones de suma y resta lo más rápido que puedas." },
  multiplicacion: { title: "Multiplicación", desc: "Practica las tablas de multiplicar con ejercicios divertidos." },
  "figuras-geometricas": { title: "Figuras Geométricas", desc: "Identifica y aprende sobre las figuras geométricas." },
  animales: { title: "Animales y Hábitats", desc: "Descubre dónde viven los animales y sus características." },
  "cuerpo-humano": { title: "El Cuerpo Humano", desc: "Aprende las partes del cuerpo humano de forma interactiva." },
  plantas: { title: "Las Plantas", desc: "Conoce las partes de las plantas y cómo crecen." },
  paises: { title: "Países y Capitales", desc: "Relaciona cada país con su capital." },
  banderas: { title: "Banderas del Mundo", desc: "¿Puedes reconocer las banderas de distintos países?" },
  historia: { title: "Historia Divertida", desc: "Aprende datos históricos a través de preguntas y respuestas." },
  colorear: { title: "Colorear", desc: "Elige colores y da vida a los dibujos." },
  instrumentos: { title: "Instrumentos Musicales", desc: "Conoce los sonidos de distintos instrumentos." },
  "dibujo-libre": { title: "Dibujo Libre", desc: "Dibuja lo que quieras en el lienzo en blanco." },
};

// Toggle submenús
document.querySelectorAll(".menu-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    // Cerrar otros submenús abiertos
    document.querySelectorAll(".menu-item.open").forEach((item) => {
      if (item !== parent) item.classList.remove("open");
    });
    parent.classList.toggle("open");
  });
});

// Click en juegos del submenú
document.querySelectorAll(".submenu a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const gameId = link.getAttribute("data-game");
    const info = gameDescriptions[gameId];
    if (!info) return;

    // Marcar link activo
    document.querySelectorAll(".submenu a.active").forEach((a) => a.classList.remove("active"));
    link.classList.add("active");

    // Mostrar vista de juego
    document.getElementById("welcome").style.display = "none";
    const gameView = document.getElementById("game-view");
    gameView.style.display = "block";
    document.getElementById("game-title").textContent = info.title;
    document.getElementById("game-description").textContent = info.desc;
    document.getElementById("game-area").textContent =
      '🎮 ¡Próximamente! El juego "' + info.title + '" estará disponible pronto.';
  });
});
