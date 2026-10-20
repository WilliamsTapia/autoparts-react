import { montar, clic, escribir, enviar, porTexto } from "./helpers";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";
import { CarritoProvider } from "../src/context/CarritoContext";

const app = (ruta) => montar(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>, { ruta });

describe("Navegación y flujo de la tienda (integración)", () => {
  let vista;
  beforeEach(() => localStorage.clear());
  afterEach(() => vista && vista.desmontar());

  it("25. la ruta /ofertas lista solo los productos con descuento", () => {
    vista = app("/ofertas");
    const tarjetas = vista.contenedor.querySelectorAll(".card-producto");
    expect(tarjetas.length).toBe(4);
    expect(vista.contenedor.querySelectorAll("[data-testid=badge-oferta]").length).toBe(4);
  });

  it("26. la ruta /categorias/Frenos muestra la categoría seleccionada", () => {
    vista = app("/categorias/Frenos");
    expect(vista.contenedor.querySelector("h2").textContent).toBe("Frenos");
  });

  it("27. agregar un producto actualiza el contador del navbar", () => {
    vista = app("/productos");
    expect(vista.contenedor.querySelector("[data-testid=contador-carrito]")).toBeNull();
    clic(porTexto(vista.contenedor, "button", "Agregar"));
    expect(vista.contenedor.querySelector("[data-testid=contador-carrito]").textContent).toBe("1");
  });

  it("28. el filtro de búsqueda reduce el catálogo", () => {
    vista = app("/productos");
    escribir(vista.contenedor.querySelector("input[type=search]"), "filtro");
    expect(vista.contenedor.querySelectorAll(".card-producto").length).toBe(2);
  });

  it("29. una ruta /admin sin sesión de administrador redirige al login", () => {
    vista = app("/admin");
    expect(vista.contenedor.querySelector("h1").textContent).toBe("Iniciar sesión");
  });
});
