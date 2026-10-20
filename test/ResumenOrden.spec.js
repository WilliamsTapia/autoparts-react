import { render, screen } from "@testing-library/react";
import ResumenOrden from "../src/components/ResumenOrden";
import { formatearPrecio } from "../src/utils/formato";

describe("ResumenOrden", () => {
  it("23. calcula el total sumando precio por cantidad de cada producto", () => {
    const items = [
      { id: 1, nombre: "Filtro", precio: 1000, cantidad: 2, imagen: "x.jpg" },
      { id: 2, nombre: "Aceite", precio: 3000, cantidad: 1, imagen: "y.jpg" },
    ];
    render(<ResumenOrden items={items} />);
    expect(screen.getByTestId("total-resumen").textContent).toBe(formatearPrecio(5000));
  });
});