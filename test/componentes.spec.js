import { montar, escribir, enviar } from "./helpers";
import CheckoutForm from "../src/components/CheckoutForm";

describe("CheckoutForm", () => {
  let vista;
  afterEach(() => vista && vista.desmontar());

  it("precarga los datos del usuario con sesión y envía el pago (mock)", () => {
    const usuario = { nombre: "Pedro", apellidos: "Hacker", correo: "pedro@gmail.com", direccion: "Los Crisantemos 1", region: "Maule", comuna: "Talca" };
    const items = [{ id: 1, nombre: "Pastillas", precio: 1000, imagen: "x", cantidad: 2 }];
    const onPagar = jasmine.createSpy("onPagar");
    vista = montar(<CheckoutForm items={items} total={2000} usuario={usuario} onPagar={onPagar} />);
    expect(vista.contenedor.querySelector("#nombre").value).toBe("Pedro");
    escribir(vista.contenedor.querySelector("#resultadoSimulado"), "rechazado");
    enviar(vista.contenedor.querySelector("form"));
    expect(onPagar).toHaveBeenCalledWith(jasmine.objectContaining({ nombre: "Pedro", calle: "Los Crisantemos 1" }), "rechazado");
  });

  it("no envía el pago si faltan datos obligatorios", () => {
    const onPagar = jasmine.createSpy("onPagar");
    vista = montar(<CheckoutForm items={[]} total={0} onPagar={onPagar} />);
    enviar(vista.contenedor.querySelector("form"));
    expect(onPagar).not.toHaveBeenCalled();
    expect(vista.contenedor.querySelectorAll(".is-invalid").length).toBeGreaterThan(3);
  });
});