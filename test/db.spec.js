import { crearColeccion, productosDB, PRODUCTOS_INICIALES } from "../src/data/db";

describe("Archivo de datos (CRUD con localStorage)", () => {
  beforeEach(() => localStorage.clear());

  it("5. listar() carga los datos iniciales la primera vez y los persiste", () => {
    expect(productosDB.listar().length).toBe(PRODUCTOS_INICIALES.length);
    expect(localStorage.getItem("ap2_productos")).not.toBeNull();
  });

  it("6. crear, actualizar y eliminar modifican la colección", () => {
    const col = crearColeccion("prueba", [], "id");
    const nuevo = col.crear({ nombre: "A" });
    expect(nuevo.id).toBe(1);
    expect(col.actualizar(1, { nombre: "B" }).nombre).toBe("B");
    expect(col.obtener(1).nombre).toBe("B");
    expect(col.eliminar(1)).toBeTrue();
    expect(col.listar()).toEqual([]);
  });

  it("7. rechaza claves duplicadas (mock de localStorage con spy)", () => {
    const col = crearColeccion("usuarios_prueba", [{ run: "1" }], "run");
    col.listar(); // la primera lectura siembra los datos iniciales
    const spy = spyOn(Storage.prototype, "setItem").and.callThrough();
    expect(() => col.crear({ run: "1" })).toThrowError(/Ya existe/);
    expect(spy).not.toHaveBeenCalled(); // no se escribió nada al fallar
  });
});
