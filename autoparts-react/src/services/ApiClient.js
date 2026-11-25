const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

export async function api(ruta, metodo = "GET", datos, token = sessionStorage.getItem("ap_token")) {
  const headers = {};
  if (datos !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(BASE + ruta, {
      method: metodo,
      headers,
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor de AutoParts.");
  }
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token && sessionStorage.getItem("ap_token") === token) {
      window.dispatchEvent(new Event("autoparts:sesion-vencida"));
    }
    const error = await respuesta.json().catch(() => ({}));
    throw new Error(error.message || ({
      401: "Credenciales inválidas o sesión vencida.",
      403: "No tienes permiso para esta operación.",
      404: "Registro no encontrado.",
    }[respuesta.status] || `Error del servidor (${respuesta.status}).`));
  }
  if (respuesta.status === 204 || respuesta.headers.get("content-length") === "0") return null;
  const contenido = await respuesta.text();
  return contenido ? JSON.parse(contenido) : null;
}
