import { render, screen, fireEvent } from "@testing-library/react";
import CarritoTabla from "../src/components/CarritoTabla";
import { formatearPrecio } from "../src/utils/formato";

const ITEMS = [
  { id: 1, nombre: "Filtro", precio: 1000, cantidad: 2, imagen: "x.jpg" },
  { id: 2, nombre: "Aceite", precio: 3000, cantidad: 1, imagen: "y.jpg" },
];

describe("CarritoTabla", () => {
  it("19. muestra un aviso cuando el carrito está vacío", () => {
    render(<CarritoTabla items={[]} total={0} />);
    expect(screen.getByTestId("carrito-vacio")).toBeTruthy();
  });

  it("20. renderiza los productos y el total", () => {
    render(<CarritoTabla items={ITEMS} total={5000} />);
    expect(screen.getByText("Filtro")).toBeTruthy();
    expect(screen.getByText("Aceite")).toBeTruthy();
    expect(screen.getByTestId("total-carrito").textContent).toBe(formatearPrecio(5000));
  });

  it("21. evento: el botón Quitar llama a onQuitar con el id del producto", () => {
    const onQuitar = jasmine.createSpy("onQuitar");
    render(<CarritoTabla items={ITEMS} total={5000} onQuitar={onQuitar} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Quitar" })[1]);
    expect(onQuitar).toHaveBeenCalledWith(2);
  });

  it("22. evento: cambiar la cantidad llama a onCambiarCantidad", () => {
    const onCambiarCantidad = jasmine.createSpy("onCambiarCantidad");
    render(<CarritoTabla items={ITEMS} total={5000} onCambiarCantidad={onCambiarCantidad} />);
    fireEvent.change(screen.getByLabelText("Cantidad Filtro"), { target: { value: "4" } });
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, "4");
  });
});