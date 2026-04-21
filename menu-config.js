// Configuración del menú lateral
// Agrega o elimina materias y juegos desde aquí sin tocar otros archivos.
const menuConfig = [
  {
    id: "lenguaje",
    label: "Lenguaje",
    icon: "📖",
    games: [
      {
        id: "sopa-letras",
        label: "Sopa de Letras",
        desc: "Encuentra las palabras escondidas en la sopa de letras.",
      },
      {
        id: "completa-palabra",
        label: "Completa la Palabra",
        desc: "Completa las letras que faltan en cada palabra.",
      },
      {
        id: "ordena-oraciones",
        label: "Ordena Oraciones",
        desc: "Pon las palabras en el orden correcto para formar oraciones.",
      },
    ],
  },
  {
    id: "matematicas",
    label: "Matemáticas",
    icon: "🔢",
    games: [
      {
        id: "suma-resta",
        label: "Suma y Resta",
        desc: "Resuelve operaciones de suma y resta lo más rápido que puedas.",
      },
      {
        id: "multiplicacion",
        label: "Multiplicación",
        desc: "Practica las tablas de multiplicar con ejercicios divertidos.",
      },
      {
        id: "figuras-geometricas",
        label: "Figuras Geométricas",
        desc: "Identifica y aprende sobre las figuras geométricas.",
      },
    ],
  },
  {
    id: "ciencias-naturales",
    label: "Ciencias Naturales",
    icon: "🌿",
    games: [
      {
        id: "animales",
        label: "Animales y Hábitats",
        desc: "Descubre dónde viven los animales y sus características.",
      },
      {
        id: "cuerpo-humano",
        label: "El Cuerpo Humano",
        desc: "Aprende las partes del cuerpo humano de forma interactiva.",
      },
      {
        id: "plantas",
        label: "Las Plantas",
        desc: "Conoce las partes de las plantas y cómo crecen.",
      },
    ],
  },
  {
    id: "ciencias-sociales",
    label: "Ciencias Sociales",
    icon: "🌍",
    games: [
      {
        id: "paises",
        label: "Países y Capitales",
        desc: "Relaciona cada país con su capital.",
      },
      {
        id: "banderas",
        label: "Banderas del Mundo",
        desc: "¿Puedes reconocer las banderas de distintos países?",
      },
      {
        id: "historia",
        label: "Historia Divertida",
        desc: "Aprende datos históricos a través de preguntas y respuestas.",
      },
    ],
  },
  {
    id: "educacion-artistica",
    label: "Educación Artística",
    icon: "🎨",
    games: [
      {
        id: "colorear",
        label: "Colorear",
        desc: "Elige colores y da vida a los dibujos.",
      },
      {
        id: "instrumentos",
        label: "Instrumentos Musicales",
        desc: "Conoce los sonidos de distintos instrumentos.",
      },
      {
        id: "dibujo-libre",
        label: "Dibujo Libre",
        desc: "Dibuja lo que quieras en el lienzo en blanco.",
      },
    ],
  },
];
