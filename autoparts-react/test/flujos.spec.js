import { act } from "react";
import { montar, escribir, clic, enviar, porTexto } from "./helpers";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";
import { CarritoProvider } from "../src/context/CarritoContext";
import { PRODUCTOS_INICIALES } from "./dbAnterior";

const respuesta = (datos, status = 200) => ({
  status, ok: status < 400, headers: { get: () => null },
  json: async () => datos, text: async () => JSON.stringify(datos),
});

const app = (ruta) => montar(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>, { ruta });
const llenar = (c, datos) => Object.entries(datos).forEach(([id, valor]) => escribir(c.querySelector("#" + id), valor));
const CARRITO = [{ id: 1, nombre: "Pastillas", precio: 22000, imagen: "x", cantidad: 2 }];
const CLIENTE = { nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", direccion: "Calle 1", region: "Maule", comuna: "Talca", role: "CLIENTE" };

describe("Flujos con API simulada", () => {
  let vista;
  let orden;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    orden = null;
    spyOn(window, "fetch").and.callFake(async (url, opciones) => {
      if (url.endsWith("/auth/me")) {
        const rol = opciones.headers.Authorization === "Bearer vendedor" ? "VENDEDOR" : "CLIENTE";
        return respuesta({ ...CLIENTE, role: rol });
      }
      if (url.endsWith("/auth/login")) {
        return respuesta({ message: "Credenciales inválidas" }, 401);
      }
      if (url.endsWith("/ordenes") && opciones.method === "POST") {
        const datos = JSON.parse(opciones.body);
        orden = { id: 1, cliente: datos.cliente, items: CARRITO, total: 44000,
          estado: datos.aprobado ? "Pagado" : "Rechazado" };
        return respuesta(orden, 201);
      }
      if (url.endsWith("/ordenes/1")) return respuesta(orden);
      return respuesta(PRODUCTOS_INICIALES);
    });
  });

  afterEach(() => { vista?.desmontar(); vista = null; });

  for (const [resultado, estado] of [["aprobado", "Pagado"], ["rechazado", "Rechazado"]]) {
    it(`guarda la orden cuando el pago es ${resultado}`, async () => {
      sessionStorage.setItem("ap_token", "cliente");
      localStorage.setItem("ap2_carrito", JSON.stringify(CARRITO));
      await act(async () => { vista = app("/checkout"); });
      llenar(vista.contenedor, { resultadoSimulado: resultado });
      await act(async () => {
        enviar(vista.contenedor.querySelector("form"));
        await new Promise((resolve) => setTimeout(resolve, 650));
      });
      expect(orden.estado).toBe(estado);
      expect(JSON.parse(localStorage.getItem("ap2_carrito")).length).toBe(resultado === "aprobado" ? 0 : 1);
      expect(vista.contenedor.querySelector("[data-testid=total-resumen]").textContent).toBe("$44.000");
    });
  }

  it("el carrito permite cambiar cantidad y vaciar", () => {
    localStorage.setItem("ap2_carrito", JSON.stringify(CARRITO));
    vista = app("/carrito");
    const c = vista.contenedor;
    escribir(c.querySelector("input[type=number]"), "3");
    expect(c.querySelector("[data-testid=total-carrito]").textContent).toBe("$66.000");
    clic(porTexto(c, "button", "Vaciar carrito"));
    expect(c.querySelector("[data-testid=carrito-vacio]")).not.toBeNull();
  });

  it("muestra el error de una contraseña incorrecta", async () => {
    vista = app("/login");
    llenar(vista.contenedor, { correo: "nadie@gmail.com", contrasena: "12345678" });
    await act(async () => { enviar(vista.contenedor.querySelector("form")); });
    expect(vista.contenedor.querySelector(".alert-warning").textContent).toContain("Credenciales inválidas");
  });

  it("redirige al vendedor si intenta entrar a la gestión de usuarios", async () => {
    sessionStorage.setItem("ap_token", "vendedor");
    await act(async () => { vista = app("/admin/usuarios"); });
    expect(vista.contenedor.querySelector("h1").textContent).toBe("Productos");
    expect(vista.contenedor.querySelector('a[href="/admin/usuarios"]')).toBeNull();
    expect(vista.contenedor.querySelector('a[href="/admin/ordenes"]')).not.toBeNull();
    expect(vista.contenedor.querySelector('a[href="/admin/productos/nuevo"]')).toBeNull();
  });
});
