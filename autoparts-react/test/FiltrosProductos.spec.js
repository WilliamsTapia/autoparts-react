import { render, screen, fireEvent } from "@testing-library/react";
import FiltrosProductos from "../src/components/FiltrosProductos";

const VALORES = { texto: "", categoria: "", orden: "" };
const CATEGORIAS = [{ nombre: "Frenos" }, { nombre: "Filtros" }];

describe("FiltrosProductos", () => {
  it("29. al elegir una categoría avisa al padre con los demás filtros intactos", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<FiltrosProductos categorias={CATEGORIAS} valores={VALORES} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Frenos" } });
    expect(onChange).toHaveBeenCalledWith({ texto: "", categoria: "Frenos", orden: "" });
  });

  it("30. al escribir en el buscador avisa al padre con el texto", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<FiltrosProductos categorias={CATEGORIAS} valores={VALORES} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Buscar"), { target: { value: "freno" } });
    expect(onChange).toHaveBeenCalledWith({ texto: "freno", categoria: "", orden: "" });
  });
});