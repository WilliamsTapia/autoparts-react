import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListaProductos from "../src/components/ListaProductos";
import { PRODUCTO, PRODUCTO_OFERTA } from "./fixtures";

describe("ListaProductos", () => {
  it("17. renderiza una tarjeta por cada producto de la lista", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={[PRODUCTO, PRODUCTO_OFERTA]} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getAllByRole("button", { name: "Agregar" }).length).toBe(2);
    expect(screen.getByText("Aceite 5W-30")).toBeTruthy();
  });

  it("18. muestra un mensaje cuando la lista está vacía", () => {
    render(
      <MemoryRouter>
        <ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Sin resultados" />
      </MemoryRouter>
    );
    expect(screen.getByTestId("lista-vacia").textContent).toBe("Sin resultados");
  });
});