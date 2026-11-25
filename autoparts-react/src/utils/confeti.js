import confetti from "canvas-confetti";

// En pruebas (jsdom) no se puede dibujar en un <canvas>; en ese caso no se lanza el confeti
const hayCanvas = () => {
  try {
    return !!document.createElement("canvas").getContext("2d");
  } catch {
    return false;
  }
};

export const lanzarConfeti = () => {
  if (!hayCanvas()) return null;
  return confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
};