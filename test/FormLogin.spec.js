import { render, screen, fireEvent } from "@testing-library/react";
import FormLogin from "../src/components/FormLogin";

describe("FormLogin", () => {
  it("24. estado: el campo muestra lo que el usuario escribe", () => {
    render(<FormLogin onIngresar={() => {}} />);
    const correo = screen.getByLabelText("Correo electrónico");
    fireEvent.change(correo, { target: { value: "ana@duoc.cl" } });
    expect(correo.value).toBe("ana@duoc.cl");
  });

  it("25. con datos inválidos muestra un mensaje de error y no llama a onIngresar", () => {
    const onIngresar = jasmine.createSpy("onIngresar");
    render(<FormLogin onIngresar={onIngresar} />);
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(screen.getByText(/Revisa los campos marcados/)).toBeTruthy();
    expect(onIngresar).not.toHaveBeenCalled();
  });

  it("26. con datos válidos llama a onIngresar y muestra su respuesta", () => {
    const onIngresar = jasmine.createSpy("onIngresar").and.returnValue({ ok: true, mensaje: "Bienvenido" });
    render(<FormLogin onIngresar={onIngresar} />);
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "ana@duoc.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "1234" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));
    expect(onIngresar).toHaveBeenCalledWith({ correo: "ana@duoc.cl", contrasena: "1234" });
    expect(screen.getByText("Bienvenido")).toBeTruthy();
  });
});