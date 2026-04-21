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
        id: "seres-vivos",
        label: "Seres Vivos y Medio Ambiente",
        desc: "Identifica seres vivos, cuida el medio ambiente y aprende sus características.",
      },
      {
        id: "clasifica-animales",
        label: "Clasifica los Animales",
        desc: "Arrastra cada animal a su categoría: mamífero, ave, reptil, anfibio o insecto.",
      },
      {
        id: "cuerpo-humano",
        label: "Completa el Cuerpo Humano",
        desc: "Ubica los órganos y partes del cuerpo en el lugar correcto.",
      },
    ],
  },
  {
    id: "ciencias-sociales",
    label: "Ciencias Sociales",
    icon: "🌍",
    games: [
      {
        id: "identidad-familiar",
        label: "Mi Identidad y Mi Familia",
        desc: "Reconoce tu identidad personal, tu familia, tu territorio y las normas de convivencia.",
      },
      {
        id: "galeria-territorio",
        label: "Galería del Territorio y Audiorelato",
        desc: "Recorre los lugares especiales de tu vereda y escucha relatos narrados sobre el territorio.",
      },
      {
        id: "mapa-vereda",
        label: "Completa el Mapa y Mi Historia Familiar",
        desc: "Ubica los lugares de tu vereda en el mapa y construye el árbol de tu historia familiar.",
      },
    ],
  },
  {
    id: "educacion-artistica",
    label: "Educación Artística",
    icon: "🎨",
    games: [
      {
        id: "expresion-plastica",
        label: "Expresión Plástica Libre",
        desc: "Pinta libremente con colores, pinceles y sellos de fauna y cultura caucana.",
      },
      {
        id: "ritmo-musical",
        label: "Reconocimiento del Ritmo",
        desc: "Escucha patrones rítmicos y descubre a qué danza del Cauca pertenecen.",
      },
      {
        id: "danza-cauca",
        label: "Danza y Música del Cauca",
        desc: "Conoce el Bambuco, Currulao, Chirimía, Marimba y Rajaleña del Cauca.",
      },
      {
        id: "pistas-offline",
        label: "Pistas Musicales Offline",
        desc: "Toca instrumentos del Cauca y reproduce melodías tradicionales sin internet.",
      },
      {
        id: "lienzo-digital",
        label: "Lienzo de Dibujos Digitales",
        desc: "Dibuja con pincel, formas y plantillas de elementos caucanos.",
      },
      {
        id: "coreografias",
        label: "Coreografías Básicas",
        desc: "Aprende y reproduce pasos básicos del Bambuco, Currulao y Chirimía.",
      },
      {
        id: "festival-artesanias",
        label: "Festival de Teatro y Artesanías",
        desc: "Descubre el Festival Iberoamericano de Teatro y las artesanías caucanas.",
      },
    ],
  },
];
