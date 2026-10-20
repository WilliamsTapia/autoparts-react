import { montar, escribir, clic, enviar, porTexto } from "./helpers";
import ProductoCard from "../src/components/ProductoCard";
import ListaProductos from "../src/components/ListaProductos";
import FiltrosProductos from "../src/components/FiltrosProductos";
import CarritoTabla from "../src/components/CarritoTabla";
import Alerta from "../src/components/Alerta";
import FormLogin from "../src/components/FormLogin";
import FormContacto from "../src/components/FormContacto";
import CheckoutForm from "../src/components/CheckoutForm";
import { PRODUCTO, PRODUCTO_OFERTA } from "./fixtures";

describe("Componentes React", () => {
  let vista;
  beforeEach(() => localStorage.clear());
  afterEach(() => vista && vista.desmontar());

  // ---------- Pruebas de renderizado ----------
  it("10. ProductoCard se renderiza con nombre, categoría y precio formateado", () => {
    vista = montar(<ProductoCard producto={PRODUCTO} onAgregar={() => {}} />);
    expect(vista.contenedor.querySelector(".card-title").textContent).toBe("Pastillas de freno");
    expect(vista.contenedor.querySelector("[data-testid=precio-final]").textContent).toBe("$20.000");
  });

  it("11. renderizado condicional: la insignia de oferta solo aparece con descuento", () => {
    vista = montar(<ListaProductos productos={[PRODUCTO, PRODUCTO_OFERTA]} onAgregar={() => {}} />);
    const insignias = vista.contenedor.querySelectorAll("[data-testid=badge-oferta]");
    expect(insignias.length).toBe(1);
    expect(insignias[0].textContent).toBe("-20%");
    expect(vista.contenedor.querySelectorAll("[data-testid=precio-final]")[1].textContent).toBe("$8.000");
  });

  it("12. ListaProductos renderiza todos los elementos del conjunto de datos", () => {
    const datos = [PRODUCTO, PRODUCTO_OFERTA, { ...PRODUCTO, id: 3, nombre: "Otro" }];
    vista = montar(<ListaProductos productos={datos} onAgregar={() => {}} />);
    expect(vista.contenedor.querySelectorAll(".card-producto").length).toBe(3);
  });

  it("13. ListaProductos muestra el mensaje vacío cuando no hay productos", () => {
    vista = montar(<ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Sin resultados" />);
    expect(vista.contenedor.querySelector("[data-testid=lista-vacia]").textContent).toBe("Sin resultados");
  });

  it("14. Alerta solo se muestra cuando hay mensaje", () => {
    vista = montar(<Alerta mensaje="" />);
    expect(vista.contenedor.querySelector(".alert")).toBeNull();
    vista.desmontar();
    vista = montar(<Alerta tipo="danger" mensaje="Error de prueba" />);
    expect(vista.contenedor.querySelector(".alert-danger").textContent).toBe("Error de prueba");
  });

  // ---------- Pruebas de props y eventos ----------
  it("15. el botón Agregar recibe la función por props y la ejecuta con el producto (spy)", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    vista = montar(<ProductoCard producto={PRODUCTO} onAgregar={onAgregar} />);
    clic(porTexto(vista.contenedor, "button", "Agregar"));
    expect(onAgregar).toHaveBeenCalledOnceWith(PRODUCTO);
  });

  it("16. el botón se deshabilita cuando el producto no tiene stock", () => {
    vista = montar(<ProductoCard producto={{ ...PRODUCTO, stock: 0 }} onAgregar={() => {}} />);
    const boton = vista.contenedor.querySelector("button");
    expect(boton.disabled).toBeTrue();
    expect(boton.textContent).toBe("Sin stock");
  });

  it("17. CarritoTabla notifica cambios de cantidad y el botón Quitar", () => {
    const items = [{ id: 1, nombre: "Pastillas", precio: 1000, imagen: "x", cantidad: 2 }];
    const onCambiar = jasmine.createSpy("onCambiar");
    const onQuitar = jasmine.createSpy("onQuitar");
    vista = montar(<CarritoTabla items={items} total={2000} onCambiarCantidad={onCambiar} onQuitar={onQuitar} />);
    expect(vista.contenedor.querySelector("[data-testid=total-carrito]").textContent).toBe("$2.000");
    escribir(vista.contenedor.querySelector("input[type=number]"), "5");
    expect(onCambiar).toHaveBeenCalledWith(1, "5");
    clic(porTexto(vista.contenedor, "button", "Quitar"));
    expect(onQuitar).toHaveBeenCalledWith(1);
  });

  it("18. CarritoTabla muestra el mensaje de carrito vacío", () => {
    vista = montar(<CarritoTabla items={[]} total={0} onCambiarCantidad={() => {}} onQuitar={() => {}} />);
    expect(vista.contenedor.querySelector("[data-testid=carrito-vacio]")).not.toBeNull();
  });

  // ---------- Pruebas de estado (state) ----------
  it("19. FiltrosProductos informa al padre los cambios de texto (estado controlado)", () => {
    const onChange = jasmine.createSpy("onChange");
    const valores = { texto: "", categoria: "", orden: "" };
    vista = montar(<FiltrosProductos categorias={[{ nombre: "Frenos" }]} valores={valores} onChange={onChange} />);
    escribir(vista.contenedor.querySelector("input[type=search]"), "freno");
    expect(onChange).toHaveBeenCalledWith({ texto: "freno", categoria: "", orden: "" });
  });

  it("20. FormLogin cambia su estado al escribir y muestra errores con datos inválidos", () => {
    const onIngresar = jasmine.createSpy("onIngresar");
    vista = montar(<FormLogin onIngresar={onIngresar} />);
    const correo = vista.contenedor.querySelector("#correo");
    escribir(correo, "no-es-correo");
    expect(correo.value).toBe("no-es-correo");
    enviar(vista.contenedor.querySelector("form"));
    expect(correo.classList.contains("is-invalid")).toBeTrue();
    expect(vista.contenedor.querySelector(".alert-warning")).not.toBeNull();
    expect(onIngresar).not.toHaveBeenCalled();
  });

  it("21. FormLogin llama a onIngresar solo con datos válidos y muestra el resultado", () => {
    const onIngresar = jasmine.createSpy("onIngresar").and.returnValue({ ok: true, mensaje: "Bienvenido" });
    vista = montar(<FormLogin onIngresar={onIngresar} />);
    escribir(vista.contenedor.querySelector("#correo"), "ana@duoc.cl");
    escribir(vista.contenedor.querySelector("#contrasena"), "1234");
    enviar(vista.contenedor.querySelector("form"));
    expect(onIngresar).toHaveBeenCalledWith({ correo: "ana@duoc.cl", contrasena: "1234" });
    expect(vista.contenedor.querySelector(".alert-success").textContent).toBe("Bienvenido");
  });

  it("22. FormContacto confirma el envío y limpia los campos", () => {
    vista = montar(<FormContacto />);
    escribir(vista.contenedor.querySelector("#nombre"), "Ana");
    escribir(vista.contenedor.querySelector("#comentario"), "Hola, quiero cotizar");
    enviar(vista.contenedor.querySelector("form"));
    expect(vista.contenedor.querySelector(".alert-success")).not.toBeNull();
    expect(vista.contenedor.querySelector("#nombre").value).toBe("");
  });

  it("23. CheckoutForm precarga los datos del usuario con sesión y envía el pago (mock)", () => {
    const usuario = { nombre: "Pedro", apellidos: "Hacker", correo: "pedro@gmail.com", direccion: "Los Crisantemos 1", region: "Maule", comuna: "Talca" };
    const items = [{ id: 1, nombre: "Pastillas", precio: 1000, imagen: "x", cantidad: 2 }];
    const onPagar = jasmine.createSpy("onPagar");
    vista = montar(<CheckoutForm items={items} total={2000} usuario={usuario} onPagar={onPagar} />);
    expect(vista.contenedor.querySelector("#nombre").value).toBe("Pedro");
    expect(vista.contenedor.querySelector("#comuna").value).toBe("Talca");
    escribir(vista.contenedor.querySelector("#resultadoSimulado"), "rechazado");
    enviar(vista.contenedor.querySelector("form"));
    expect(onPagar).toHaveBeenCalledWith(jasmine.objectContaining({ nombre: "Pedro", calle: "Los Crisantemos 1" }), "rechazado");
  });

  it("24. CheckoutForm no envía el pago si faltan datos obligatorios", () => {
    const onPagar = jasmine.createSpy("onPagar");
    vista = montar(<CheckoutForm items={[]} total={0} onPagar={onPagar} />);
    enviar(vista.contenedor.querySelector("form"));
    expect(onPagar).not.toHaveBeenCalled();
    expect(vista.contenedor.querySelectorAll(".is-invalid").length).toBeGreaterThan(3);
  });
});
