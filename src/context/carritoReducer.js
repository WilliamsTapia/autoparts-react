import { precioFinal } from "../utils/formato";

/** Reducer puro del carrito: fácil de probar sin React */
export function carritoReducer(estado, accion) {
  switch (accion.tipo) {
    case "agregar": {
      const { producto } = accion;
      if (estado.some((i) => i.id === producto.id)) {
        return estado.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...estado, { id: producto.id, nombre: producto.nombre, precio: precioFinal(producto), imagen: producto.imagen, cantidad: 1 }];
    }
    case "quitar":
      return estado.filter((i) => i.id !== accion.id);
    case "cambiar": {
      let cantidad = parseInt(accion.cantidad, 10);
      if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
      return estado.map((i) => (i.id === accion.id ? { ...i, cantidad } : i));
    }
    case "vaciar":
      return [];
    default:
      return estado;
  }
}

export const totalCarrito = (carrito) => carrito.reduce((t, i) => t + i.precio * i.cantidad, 0);
export const cantidadItems = (carrito) => carrito.reduce((t, i) => t + i.cantidad, 0);
