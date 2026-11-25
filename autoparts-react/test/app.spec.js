import { act } from "react";
import { PRODUCTOS_INICIALES, obtenerCategorias } from "./dbAnterior";
import { montar, clic, escribir, enviar, porTexto } from "./helpers";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";
import { CarritoProvider } from "../src/context/CarritoContext";

const respuesta = (datos, status = 200) => ({
  status, ok: status < 400, headers: { get: () => null },
  json: async () => datos, text: async () => JSON.stringify(datos),
});

const app = (ruta) => montar(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>, { ruta });

describe("Navegación y flujo de la tienda (integración)", () => {
  let vista;
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    spyOn(window, "fetch").and.callFake(async (url) => {
      const datos = url.endsWith("/categorias") ? obtenerCategorias() : PRODUCTOS_INICIALES;
      return respuesta(datos);
    });
  });
  afterEach(() => vista && vista.desmontar());

  it("25. la ruta /ofertas lista solo los productos con descuento", async () => {
    await act(async () => { vista = app("/ofertas"); });
    const tarjetas = vista.contenedor.querySelectorAll(".card-producto");
    expect(tarjetas.length).toBe(4);
    expect(vista.contenedor.querySelectorAll("[data-testid=badge-oferta]").length).toBe(4);
  });

 it("26. /productos?categoria=Frenos abre el catálogo con ese filtro aplicado", async () => {
    await act(async () => { vista = app("/productos?categoria=Frenos"); });
    expect(vista.contenedor.querySelector("select[aria-label=Categoría]").value).toBe("Frenos");
    expect(vista.contenedor.querySelectorAll(".card-producto").length).toBe(2);
  });

  it("27. agregar un producto actualiza el contador del navbar", async () => {
    await act(async () => { vista = app("/productos"); });
    expect(vista.contenedor.querySelector("[data-testid=contador-carrito]")).toBeNull();
    clic(porTexto(vista.contenedor, "button", "Agregar"));
    expect(vista.contenedor.querySelector("[data-testid=contador-carrito]").textContent).toBe("1");
  });

  it("28. el filtro de búsqueda reduce el catálogo", async () => {
    await act(async () => { vista = app("/productos"); });
    escribir(vista.contenedor.querySelector("input[type=search]"), "filtro");
    expect(vista.contenedor.querySelectorAll(".card-producto").length).toBe(2);
  });

  it("29. una ruta /admin sin sesión de administrador redirige al login", async () => {
    await act(async () => { vista = app("/admin"); });
    expect(vista.contenedor.querySelector("h1").textContent).toBe("Iniciar sesión");
  });
});
