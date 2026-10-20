export const formatearPrecio = (valor) => "$" + Number(valor).toLocaleString("es-CL");

/** Precio con el descuento (%) aplicado */
export const precioFinal = (producto) =>
  Math.round(producto.precio * (1 - (Number(producto.descuento) || 0) / 100));

export const esStockCritico = (p) => p.stockCritico != null && p.stock <= p.stockCritico;
