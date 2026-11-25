// Contenido del blog (antes eran dos HTML estáticos)
// Ruta pública de las imágenes (BrowserRouter exige rutas absolutas desde la raíz)
const IMG = `${process.env.PUBLIC_URL}/img/`;

export const BLOGS = [
  {
    id: 1,
    titulo: "5 señales de que tus pastillas de freno están gastadas",
    resumen: "Un chirrido al frenar o un pedal más blando pueden ser señales tempranas de desgaste. Aquí te contamos qué revisar.",
    imagen: IMG + "pastillas-gastadas.jpg",
    cta: { texto: "Ver pastillas de freno", ruta: "/productos?categoria=Frenos" },
    bloques: [
      { tipo: "p", texto: "Las pastillas de freno son una de las piezas de seguridad más importantes de tu vehículo, y su desgaste suele ser gradual, lo que hace fácil pasarlo por alto hasta que ya es tarde. Aquí te dejamos cinco señales para que revises a tiempo:" },
      { tipo: "ol", items: [
        ["Chirridos agudos al frenar:", "muchas pastillas traen un indicador metálico que roza el disco cuando el material de fricción está por acabarse."],
        ["Pedal de freno más blando o esponjoso:", "puede indicar desgaste en las pastillas o problemas en el sistema hidráulico."],
        ["Vibración al frenar:", "discos desgastados de forma irregular junto a pastillas gastadas generan vibración en el pedal o el volante."],
        ["El auto se \"tira\" hacia un lado al frenar:", "desgaste desigual entre las pastillas izquierda y derecha."],
        ["Luz de advertencia en el tablero:", "en muchos vehículos modernos, un sensor avisa cuando el grosor de la pastilla es crítico."],
      ] },
      { tipo: "p", texto: "Si notas alguna de estas señales, te recomendamos revisar tus pastillas cuanto antes. En AutoParts CL puedes encontrar pastillas de freno certificadas para distintos modelos." },
    ],
  },
  {
    id: 2,
    titulo: "¿Sabías esto sobre la vida útil de tu batería?",
    resumen: "La duración promedio de una batería no solo depende del uso, sino también del clima y de cómo se instala. Te contamos un dato curioso.",
    imagen: IMG + "curioso.jpg",
    cta: { texto: "Ver baterías", ruta: "/productos?categoria=Baterías" },
    bloques: [
      { tipo: "p", texto: "La mayoría de la gente piensa que una batería de auto dura \"lo que dura\" sin más, pero en realidad su vida útil depende de varios factores que muchas veces pasamos por alto." },
      { tipo: "p", destacado: "Dato curioso:", texto: "el calor extremo daña más rápido una batería que el frío. Aunque en invierno cuesta más arrancar el auto, es en los meses de mucho calor cuando el líquido interno de la batería se evapora más rápido, acelerando su desgaste interno." },
      { tipo: "p", texto: "Otros factores que afectan la duración de tu batería:" },
      { tipo: "ul", items: [
        "Trayectos muy cortos, que no permiten que el alternador la recargue completamente.",
        "Dejar luces o accesorios encendidos con el motor apagado.",
        "Una instalación floja, que genera vibración y daño interno con el tiempo.",
      ] },
      { tipo: "p", texto: "Revisa tu batería al menos una vez al año, y si notas que el motor arranca más lento de lo normal, ¡es momento de cambiarla!" },
    ],
  },
];