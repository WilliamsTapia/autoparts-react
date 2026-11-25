const PREFIJO = "ap2_";

export const carritoDB = {
  leer: () => { try { return JSON.parse(localStorage.getItem(PREFIJO + "carrito")) ?? []; } catch { return []; } },
  guardar: (c) => localStorage.setItem(PREFIJO + "carrito", JSON.stringify(c)),
};
