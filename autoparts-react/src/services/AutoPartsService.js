import { api } from "./ApiClient";

function recurso(ruta) {
  return {
    listar: () => api(ruta),
    obtener: (id) => api(`${ruta}/${encodeURIComponent(id)}`),
    crear: (datos) => api(ruta, "POST", datos),
    actualizar: (id, datos) => api(`${ruta}/${encodeURIComponent(id)}`, "PUT", datos),
    eliminar: (id) => api(`${ruta}/${encodeURIComponent(id)}`, "DELETE"),
  };
}

export const productosDB = recurso("/productos");
export const usuariosDB = recurso("/usuarios");
export const ordenesDB = recurso("/ordenes");
export const listarMisCompras = () => api("/ordenes/mias");
export const categoriasDB = recurso("/categorias");
export const obtenerCategorias = categoriasDB.listar;

export const autenticar = ({ correo, contrasena }) =>
  api("/auth/login", "POST", { username: correo, password: contrasena }, null);
export const registrar = (datos) => api("/auth/register", "POST", datos, null);
export const perfil = (token) => api("/auth/me", "GET", undefined, token);
