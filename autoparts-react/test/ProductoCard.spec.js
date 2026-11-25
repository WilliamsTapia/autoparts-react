import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductoCard from "../src/components/ProductoCard";
import { formatearPrecio } from "../src/utils/formato";
import { PRODUCTO, PRODUCTO_OFERTA } from "./fixtures";

// ProductoCard usa <Link>, y un <Link> solo funciona dentro de un Router
const mostrar = (producto, onAgregar = () => {}) =>
  render(
    <MemoryRouter>
      <ProductoCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  );

describe("ProductoCard", () => {
  it("12. renderiza el nombre, la categoría y el precio del producto", () => {
    mostrar(PRODUCTO);
    expect(screen.getByText("Pastillas de freno")).toBeTruthy();
    expect(screen.getByText("Frenos")).toBeTruthy();
    expect(screen.getByTestId("precio-final").textContent).toBe(formatearPrecio(20000));
  });

  it("13. props: al presionar Agregar llama a onAgregar con el producto", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    mostrar(PRODUCTO, onAgregar);
    fireEvent.click(screen.getByRole("button", { name: "Agregar" }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(PRODUCTO);
  });

  it("14. renderizado condicional: el badge de oferta solo aparece si hay descuento", () => {
    mostrar(PRODUCTO_OFERTA);
    expect(screen.getByTestId("badge-oferta").textContent).toBe("-20%");
    expect(screen.getByTestId("precio-final").textContent).toBe(formatearPrecio(8000));
  });

  it("15. renderizado condicional: sin descuento no muestra el badge", () => {
    mostrar(PRODUCTO);
    expect(screen.queryByTestId("badge-oferta")).toBeNull();
  });

  it("16. renderizado condicional: sin stock el botón queda deshabilitado", () => {
    mostrar({ ...PRODUCTO, stock: 0 });
    const boton = screen.getByRole("button", { name: "Sin stock" });
    expect(boton.disabled).toBeTrue();
  });
});