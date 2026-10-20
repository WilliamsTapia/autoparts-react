import { filtrarProductos } from "../src/utils/filtros";
import { PRODUCTO, PRODUCTO_OFERTA } from "./fixtures";

const BUJIA = { ...PRODUCTO, id: 3, nombre: "Bujía", precio: 5000, categoria: "Motor", descripcion: "Iridio" };
const LISTA = [PRODUCTO, PRODUCTO_OFERTA, BUJIA];
const ids = (l) => l.map((p) => p.id);

describe("filtrarProductos", () => {
  it("filtra por texto (nombre o descripción) y por categoría", () => {
    expect(ids(filtrarProductos(LISTA, { texto: "freno" }))).toEqual([1]);
    expect(ids(filtrarProductos(LISTA, { texto: "iridio" }))).toEqual([3]);
    expect(ids(filtrarProductos(LISTA, { categoria: "Motor" }))).toEqual([3]);
    expect(filtrarProductos(LISTA).length).toBe(3);
  });

  it("ordena por precio final y por nombre", () => {
    expect(ids(filtrarProductos(LISTA, { orden: "precio-asc" }))).toEqual([3, 2, 1]);
    expect(ids(filtrarProductos(LISTA, { orden: "precio-desc" }))).toEqual([1, 2, 3]);
    expect(ids(filtrarProductos(LISTA, { orden: "nombre" }))).toEqual([2, 3, 1]);
  });
});