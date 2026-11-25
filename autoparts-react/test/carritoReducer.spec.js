import { carritoReducer, totalCarrito, cantidadItems } from "../src/context/carritoReducer";
import { PRODUCTO, PRODUCTO_OFERTA } from "./fixtures";

describe("carritoReducer (estado del carrito)", () => {
  it("8. agregar el mismo producto dos veces aumenta la cantidad; usa precio con descuento", () => {
    let estado = carritoReducer([], { tipo: "agregar", producto: PRODUCTO_OFERTA });
    estado = carritoReducer(estado, { tipo: "agregar", producto: PRODUCTO_OFERTA });
    expect(estado.length).toBe(1);
    expect(estado[0].cantidad).toBe(2);
    expect(estado[0].precio).toBe(8000);
  });

  it("9. cambiar cantidad corrige valores inválidos y quitar elimina el ítem", () => {
    let estado = carritoReducer([], { tipo: "agregar", producto: PRODUCTO });
    estado = carritoReducer(estado, { tipo: "cambiar", id: 1, cantidad: "0" });
    expect(estado[0].cantidad).toBe(1);
    estado = carritoReducer(estado, { tipo: "cambiar", id: 1, cantidad: "4" });
    expect(totalCarrito(estado)).toBe(80000);
    expect(cantidadItems(estado)).toBe(4);
    expect(carritoReducer(estado, { tipo: "quitar", id: 1 })).toEqual([]);
  });
});
