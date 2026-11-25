import { render, screen, fireEvent } from "@testing-library/react";
import FormContacto from "../src/components/FormContacto";

describe("FormContacto", () => {
  it("27. muestra los errores cuando faltan datos obligatorios", () => {
    render(<FormContacto />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("Revisa los campos marcados en rojo antes de enviar.")).toBeTruthy();
    expect(screen.getByText("Nombre obligatorio (máx. 100 caracteres).")).toBeTruthy();
  });

  it("28. con datos válidos muestra la confirmación y limpia el formulario", () => {
    render(<FormContacto />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("Comentario"), { target: { value: "Quiero cotizar frenos" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText(/Tu mensaje fue enviado/)).toBeTruthy();
    expect(screen.getByLabelText("Nombre").value).toBe("");
  });
});