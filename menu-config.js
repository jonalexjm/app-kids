// Configuración del menú lateral
// Agrega o elimina materias y juegos desde aquí sin tocar otros archivos.
const menuConfig = [
  {
    id: "lenguaje",
    label: "Lenguaje",
    icon: "📖",
    games: [
      {
        id: "conciencia-fonologica",
        label: "Conciencia Fonológica",
        desc: "Escucha, identifica y separa las sílabas de palabras de fauna y flora del Cauca.",
      },
      {
        id: "lectura-silabica",
        label: "Lectura Silábica",
        desc: "Completa las sílabas faltantes en palabras de la naturaleza caucana.",
      },
      {
        id: "vocabulario-contextualizado",
        label: "Vocabulario Contextualizado",
        desc: "Lee oraciones sobre la fauna y flora del Cauca y ordena las palabras.",
      },
    ],
  },
  {
    id: "matematicas",
    label: "Matemáticas",
    icon: "🔢",
    games: [
      {
        id: "conteo-animado",
        label: "Conteo Animado",
        desc: "Cuenta objetos animados del 1 al 20 con pistas sonoras y de conteo.",
      },
      {
        id: "operaciones-campo",
        label: "Operaciones de Campo",
        desc: "Resuelve sumas, restas y más con herramientas y situaciones del campo.",
      },
      {
        id: "rompecabezas-geometrico",
        label: "Rompecabezas Geométrico",
        desc: "Identifica y arma figuras geométricas con sus piezas.",
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
