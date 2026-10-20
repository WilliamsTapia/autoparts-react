import { validarRun, esCorreoPermitido, validarLogin, validarProducto } from "../src/utils/validaciones";

describe("Validaciones (lógica pura)", () => {
  it("1. acepta un RUN con dígito verificador correcto y rechaza uno incorrecto", () => {
    expect(validarRun("190110222")).toBeTrue();
    expect(validarRun("123456785")).toBeTrue();
    expect(validarRun("19011022K")).toBeFalse(); // dígito verificador incorrecto
    expect(validarRun("123")).toBeFalse();
  });

  it("2. solo permite correos @duoc.cl, @profesor.duoc.cl y @gmail.com", () => {
    expect(esCorreoPermitido("ana@duoc.cl")).toBeTrue();
    expect(esCorreoPermitido("ana@gmail.com")).toBeTrue();
    expect(esCorreoPermitido("ana@hotmail.com")).toBeFalse();
  });

  it("3. validarLogin devuelve errores por campo para datos inválidos", () => {
    const errores = validarLogin({ correo: "mal", contrasena: "12" });
    expect(Object.keys(errores)).toEqual(["correo", "contrasena"]);
    expect(validarLogin({ correo: "ana@duoc.cl", contrasena: "1234" })).toEqual({});
  });

  it("4. validarProducto exige stock entero y descuento entre 0 y 90", () => {
    const base = { codigo: "ABC", nombre: "X", descripcion: "", precio: "100", stock: "5", stockCritico: "", descuento: "0", categoria: "Frenos" };
    expect(validarProducto(base)).toEqual({});
    expect(validarProducto({ ...base, stock: "2.5" }).stock).toBeDefined();
    expect(validarProducto({ ...base, descuento: "95" }).descuento).toBeDefined();
  });
});
