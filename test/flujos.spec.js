import { act } from "react";
import { montar, escribir, clic, enviar, porTexto } from "./helpers";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";
import { CarritoProvider } from "../src/context/CarritoContext";
import { productosDB, usuariosDB, ordenesDB, USUARIOS_INICIALES } from "../src/data/db";
import { procesarPago } from "../src/services/pago";

const app = (ruta) => montar(<AuthProvider><CarritoProvider><App /></CarritoProvider></AuthProvider>, { ruta });
const iniciarComoAdmin = () => localStorage.setItem("ap2_sesion", JSON.stringify(USUARIOS_INICIALES[0]));
const llenar = (c, datos) => Object.entries(datos).forEach(([id, valor]) => escribir(c.querySelector("#" + id), valor));
// Espera real (la pasarela simulada tarda 500 ms) dentro de act asíncrono
const esperarPago = () => act(async () => { await new Promise((r) => setTimeout(r, 700)); });
const CARRITO = [{ id: 1, nombre: "Pastillas", precio: 22000, imagen: "x", cantidad: 2 }];
const CLIENTE = { nombre: "Pedro", apellidos: "Hacker", correo: "pedro@example.com", calle: "Los Crisantemos 1", region: "Maule", comuna: "Talca" };

describe("Flujos completos de la aplicación", () => {
  let vista;
  // El reloj falso de Jasmine controla setTimeout (redirecciones y pasarela de pago simulada)
  beforeEach(() => { localStorage.clear(); jasmine.clock().install(); });
  afterEach(() => { vista && vista.desmontar(); vista = null; jasmine.clock().uninstall(); });

  // ---------- Servicio de pago (mock del tiempo) ----------
    it("30b. procesarPago sin argumentos aprueba por defecto", async () => {
    const p = procesarPago();
    jasmine.clock().tick(500);
    expect((await p).aprobado).toBeTrue();
  });

  // ---------- Compra ----------
  it("31. compra aprobada: crea la orden, vacía el carrito y muestra la boleta", async () => {
    jasmine.clock().uninstall(); // este flujo usa el temporizador real de la pasarela
    localStorage.setItem("ap2_carrito", JSON.stringify(CARRITO));
    vista = app("/checkout");
    const c = vista.contenedor;
    llenar(c, CLIENTE);
    enviar(c.querySelector("form"));
    await esperarPago();
    expect(c.querySelector("h1").textContent).toContain("Se ha realizado la compra");
    expect(ordenesDB.listar()[0].estado).toBe("Pagado");
    expect(JSON.parse(localStorage.getItem("ap2_carrito"))).toEqual([]);
    expect(c.querySelector("[data-testid=total-resumen]").textContent).toBe("$44.000");
  });

  it("32. pago rechazado: guarda la orden como Rechazado y conserva el carrito", async () => {
    jasmine.clock().uninstall();
    localStorage.setItem("ap2_carrito", JSON.stringify(CARRITO));
    vista = app("/checkout");
    const c = vista.contenedor;
    llenar(c, { ...CLIENTE, resultadoSimulado: "rechazado" });
    enviar(c.querySelector("form"));
    await esperarPago();
    expect(c.querySelector("h1").textContent).toContain("No se pudo realizar el pago");
    expect(porTexto(c, "a", "VOLVER A REALIZAR EL PAGO")).toBeDefined();
    expect(ordenesDB.listar()[0].estado).toBe("Rechazado");
    expect(JSON.parse(localStorage.getItem("ap2_carrito")).length).toBe(1);
  });

  it("33. el checkout sin productos invita a ir al catálogo", () => {
    vista = app("/checkout");
    expect(vista.contenedor.querySelector(".alert").textContent).toContain("No hay productos");
  });

  it("34. el carrito permite cambiar cantidad, vaciar y ofrece comprar", () => {
    localStorage.setItem("ap2_carrito", JSON.stringify(CARRITO));
    vista = app("/carrito");
    const c = vista.contenedor;
    escribir(c.querySelector("input[type=number]"), "3");
    expect(c.querySelector("[data-testid=total-carrito]").textContent).toBe("$66.000");
    expect(porTexto(c, "a", "Comprar ahora")).toBeDefined();
    clic(porTexto(c, "button", "Vaciar carrito"));
    expect(c.querySelector("[data-testid=carrito-vacio]")).not.toBeNull();
  });

  // ---------- Catálogo y contenido ----------
  it("35. el detalle de producto muestra el precio con descuento y agrega al carrito", () => {
    vista = app("/productos/1");
    const c = vista.contenedor;
    expect(c.querySelector("h1").textContent).toBe("Pastillas de freno delanteras");
    expect(c.textContent).toContain("$22.092"); // 25.990 con 15 % de descuento
    clic(porTexto(c, "button", "Agregar al carrito"));
    expect(c.querySelector("[data-testid=contador-carrito]").textContent).toBe("1");
  });

  it("36. un producto o artículo inexistente muestra un aviso", () => {
    vista = app("/productos/999");
    expect(vista.contenedor.textContent).toContain("Producto no encontrado");
    vista.desmontar();
    vista = app("/blogs/99");
    expect(vista.contenedor.textContent).toContain("Artículo no encontrado");
  });

  it("37. las páginas públicas se renderizan con su contenido principal", () => {
    const casos = [["/", "AutoParts CL"], ["/nosotros", "Nuestra historia"], ["/blogs", "Blog"], ["/blogs/2", "¿Sabías esto"], ["/contacto", "Contáctanos"], ["/registro", "Crear cuenta"], ["/ruta-inexistente", "404"], ["/categorias", "Categorías"]];
    casos.forEach(([ruta, texto]) => {
      vista = app(ruta);
      expect(vista.contenedor.textContent).toContain(texto);
      vista.desmontar();
    });
    vista = null;
  });

  // ---------- Sesión ----------
  it("38. el login con un correo inexistente muestra un error", () => {
    vista = app("/login");
    llenar(vista.contenedor, { correo: "nadie@gmail.com", contrasena: "1234" });
    enviar(vista.contenedor.querySelector("form"));
    expect(vista.contenedor.querySelector(".alert-warning").textContent).toContain("No existe una cuenta");
  });

  it("39. el login del administrador guarda la sesión y redirige al panel", () => {
    vista = app("/login");
    llenar(vista.contenedor, { correo: "admin@duoc.cl", contrasena: "1234" });
    enviar(vista.contenedor.querySelector("form"));
    expect(JSON.parse(localStorage.getItem("ap2_sesion")).tipoUsuario).toBe("Administrador");
    act(() => { jasmine.clock().tick(700); });
    expect(vista.contenedor.querySelector("h1").textContent).toContain("panel de administración");
  });

  it("40. el registro crea un usuario Cliente y rechaza un RUN repetido", () => {
    vista = app("/registro");
    const c = vista.contenedor;
    const datos = { run: "190110222", nombre: "Ana", apellidos: "Soto", correo: "ana@gmail.com", direccion: "Calle 1", region: "Maule", comuna: "Talca" };
    llenar(c, datos);
    enviar(c.querySelector("form"));
    expect(usuariosDB.obtener("190110222").tipoUsuario).toBe("Cliente");
    expect(c.querySelector(".alert-success")).not.toBeNull();
    llenar(c, { correo: "otra@gmail.com" });
    enviar(c.querySelector("form"));
    expect(c.querySelector(".alert-warning").textContent).toContain("Ya existe un usuario con ese RUN");
  });

  // ---------- Panel administrador ----------
  it("41. el dashboard admin muestra los totales de productos, usuarios y órdenes", () => {
    iniciarComoAdmin();
    vista = app("/admin");
    const numeros = [...vista.contenedor.querySelectorAll(".display-6")].map((n) => n.textContent);
    expect(numeros).toEqual(["9", "1", "1", "0"]); // productos, stock crítico, usuarios, órdenes
  });

  it("42. admin elimina un producto tras confirmar (mock de window.confirm)", () => {
    iniciarComoAdmin();
    spyOn(window, "confirm").and.returnValue(true);
    vista = app("/admin/productos");
    expect(vista.contenedor.querySelectorAll("tbody tr").length).toBe(9);
    clic(porTexto(vista.contenedor, "button", "Eliminar"));
    expect(window.confirm).toHaveBeenCalled();
    expect(vista.contenedor.querySelectorAll("tbody tr").length).toBe(8);
    expect(productosDB.listar().length).toBe(8);
  });

  it("43. admin no elimina si cancela la confirmación", () => {
    iniciarComoAdmin();
    spyOn(window, "confirm").and.returnValue(false);
    vista = app("/admin/productos");
    clic(porTexto(vista.contenedor, "button", "Eliminar"));
    expect(productosDB.listar().length).toBe(9);
  });

  it("44. admin crea un producto nuevo desde el formulario", () => {
    iniciarComoAdmin();
    vista = app("/admin/productos/nuevo");
    llenar(vista.contenedor, { codigo: "TST-001", nombre: "Producto prueba", precio: "5000", stock: "7", categoria: "Frenos" });
    enviar(vista.contenedor.querySelector("form"));
    const creado = productosDB.listar().at(-1);
    expect(creado.nombre).toBe("Producto prueba");
    expect(creado.precio).toBe(5000);
  });

  it("45. admin edita un producto existente y el formulario no guarda datos inválidos", () => {
    iniciarComoAdmin();
    vista = app("/admin/productos/1/editar");
    const c = vista.contenedor;
    expect(c.querySelector("#nombre").value).toBe("Pastillas de freno delanteras");
    escribir(c.querySelector("#stock"), "-3");
    enviar(c.querySelector("form"));
    expect(c.querySelector("#stock").classList.contains("is-invalid")).toBeTrue();
    expect(productosDB.obtener(1).stock).toBe(40);
    escribir(c.querySelector("#stock"), "25");
    enviar(c.querySelector("form"));
    expect(productosDB.obtener(1).stock).toBe(25);
  });

  it("46. admin crea, edita y elimina usuarios; el RUN no se puede cambiar al editar", () => {
    iniciarComoAdmin();
    vista = app("/admin/usuarios/nuevo");
    llenar(vista.contenedor, { run: "123456785", nombre: "Luis", apellidos: "Mora", correo: "luis@duoc.cl", direccion: "Av 1", tipoUsuario: "Vendedor" });
    enviar(vista.contenedor.querySelector("form"));
    expect(usuariosDB.obtener("123456785").tipoUsuario).toBe("Vendedor");
    vista.desmontar();

    vista = app("/admin/usuarios/123456785/editar");
    expect(vista.contenedor.querySelector("#run").readOnly).toBeTrue();
    escribir(vista.contenedor.querySelector("#nombre"), "Luisa");
    enviar(vista.contenedor.querySelector("form"));
    expect(usuariosDB.obtener("123456785").nombre).toBe("Luisa");
    vista.desmontar();

    spyOn(window, "confirm").and.returnValue(true);
    vista = app("/admin/usuarios");
    expect(vista.contenedor.querySelectorAll("tbody tr").length).toBe(2);
    clic([...vista.contenedor.querySelectorAll("button")].find((b) => b.textContent === "Eliminar"));
    expect(usuariosDB.listar().length).toBe(1);
  });

  it("47. el admin sembrado se puede editar (su RUN pasa la validación)", () => {
    iniciarComoAdmin();
    vista = app("/admin/usuarios/197654325/editar");
    enviar(vista.contenedor.querySelector("form"));
    expect(vista.contenedor.querySelector(".alert-success")).not.toBeNull();
  });
});
