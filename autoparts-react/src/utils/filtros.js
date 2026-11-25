import { precioFinal } from "./formato";

/** Filtra y ordena el catálogo según texto, categoría y orden */
export function filtrarProductos(productos, { texto = "", categoria = "", orden = "" } = {}) {
  const t = texto.trim().toLowerCase();
  let lista = productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!t || p.nombre.toLowerCase().includes(t) || (p.descripcion || "").toLowerCase().includes(t))
  );
  if (orden === "precio-asc") lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
  if (orden === "precio-desc") lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
  if (orden === "nombre") lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
  return lista;
}
