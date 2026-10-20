// Validaciones puras (sin DOM): devuelven un objeto { campo: "mensaje" }.
// Si el objeto está vacío, el formulario es válido.

/** RUN chileno sin puntos ni guion, ej: "19011022K" (módulo 11) */
export function validarRun(runCompleto = "") {
  runCompleto = runCompleto.trim().toUpperCase();
  if (runCompleto.length < 7 || runCompleto.length > 9) return false;
  const cuerpo = runCompleto.slice(0, -1);
  const dv = runCompleto.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === esperado;
}

export const esCorreoPermitido = (correo = "") =>
  /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo);

const esCorreoValido = (correo = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
const vacio = (v) => !String(v ?? "").trim();
const MSG_CORREO = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";

export function validarLogin({ correo = "", contrasena = "" }) {
  const e = {};
  if (vacio(correo) || correo.length > 100 || !esCorreoPermitido(correo)) e.correo = MSG_CORREO;
  if (vacio(contrasena) || contrasena.length < 4 || contrasena.length > 10) e.contrasena = "La contraseña debe tener entre 4 y 10 caracteres.";
  return e;
}

export function validarUsuario(d) {
  const e = {};
  if (!validarRun(d.run)) e.run = "RUN inválido (sin puntos ni guion, ej: 19011022K).";
  if (vacio(d.nombre) || d.nombre.length > 50) e.nombre = "Nombre obligatorio (máx. 50 caracteres).";
  if (vacio(d.apellidos) || d.apellidos.length > 100) e.apellidos = "Apellidos obligatorios (máx. 100 caracteres).";
  if (vacio(d.correo) || d.correo.length > 100 || !esCorreoPermitido(d.correo)) e.correo = MSG_CORREO;
  if (vacio(d.direccion) || d.direccion.length > 300) e.direccion = "Dirección obligatoria (máx. 300 caracteres).";
  return e;
}

export function validarContacto({ nombre = "", correo = "", comentario = "" }) {
  const e = {};
  if (vacio(nombre) || nombre.length > 100) e.nombre = "Nombre obligatorio (máx. 100 caracteres).";
  if (correo.length > 100 || (!vacio(correo) && !esCorreoPermitido(correo))) e.correo = MSG_CORREO;
  if (vacio(comentario) || comentario.length > 500) e.comentario = "Comentario obligatorio (máx. 500 caracteres).";
  return e;
}

export function validarProducto(d) {
  const e = {};
  if (vacio(d.codigo) || d.codigo.trim().length < 3) e.codigo = "Código obligatorio (mín. 3 caracteres).";
  if (vacio(d.nombre) || d.nombre.length > 100) e.nombre = "Nombre obligatorio (máx. 100 caracteres).";
  if ((d.descripcion || "").length > 500) e.descripcion = "Máximo 500 caracteres.";
  if (d.precio === "" || Number(d.precio) < 0) e.precio = "Precio inválido.";
  if (d.stock === "" || !Number.isInteger(Number(d.stock)) || Number(d.stock) < 0) e.stock = "Stock debe ser un entero ≥ 0.";
  if (d.stockCritico !== "" && (!Number.isInteger(Number(d.stockCritico)) || Number(d.stockCritico) < 0)) e.stockCritico = "Debe ser un entero ≥ 0.";
  if (d.descuento !== "" && (Number(d.descuento) < 0 || Number(d.descuento) > 90)) e.descuento = "Descuento entre 0 y 90 %.";
  if (!d.categoria) e.categoria = "Selecciona una categoría.";
  return e;
}

export function validarCheckout(d) {
  const e = {};
  if (vacio(d.nombre)) e.nombre = "Nombre obligatorio.";
  if (vacio(d.apellidos)) e.apellidos = "Apellidos obligatorios.";
  if (vacio(d.correo) || !esCorreoValido(d.correo)) e.correo = "Correo inválido.";
  if (vacio(d.calle)) e.calle = "Calle obligatoria.";
  if (!d.region) e.region = "Selecciona región.";
  if (!d.comuna) e.comuna = "Selecciona comuna.";
  return e;
}
