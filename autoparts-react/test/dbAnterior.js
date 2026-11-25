// =====================================================================
// db.js — "base de datos" simulada del proyecto (fuente de datos JS).
// Cada colección ofrece las 4 operaciones CRUD:
//   listar(), obtener(id), crear(dato), actualizar(id, cambios), eliminar(id)
// y se persiste en localStorage (claves con prefijo "ap2_").
// =====================================================================

// Ruta pública de las imágenes (BrowserRouter exige rutas absolutas desde la raíz)
const IMG = `${process.env.PUBLIC_URL}/img/`;

export const PRODUCTOS_INICIALES = [
  { id: 1, codigo: "FRE-001", nombre: "Pastillas de freno delanteras", descripcion: "Juego de pastillas de freno cerámicas para vehículos livianos. Alta duración y bajo nivel de polvo.", precio: 25990, stock: 40, stockCritico: 5, categoria: "Frenos", imagen: IMG + "freno-delantero.jpg", descuento: 15 },
  { id: 2, codigo: "FRE-002", nombre: "Disco de freno ventilado", descripcion: "Disco de freno ventilado 260mm, compatible con la mayoría de sedanes medianos.", precio: 39990, stock: 18, stockCritico: 4, categoria: "Frenos", imagen: IMG + "pastillas-freno.jpg", descuento: 0 },
  { id: 3, codigo: "BAT-001", nombre: "Batería 12V 60Ah", descripcion: "Batería libre de mantenimiento, 60Ah, ideal para autos y camionetas medianas.", precio: 59990, stock: 12, stockCritico: 3, categoria: "Baterías", imagen: IMG + "bateria-12v.jpg", descuento: 10 },
  { id: 4, codigo: "FIL-001", nombre: "Filtro de aceite", descripcion: "Filtro de aceite de alta filtración, compatible con motores 1.6 a 2.0.", precio: 8990, stock: 60, stockCritico: 10, categoria: "Filtros", imagen: IMG + "filtro-aceite.jpg", descuento: 0 },
  { id: 5, codigo: "FIL-002", nombre: "Filtro de aire", descripcion: "Filtro de aire de alto flujo, mejora el rendimiento del motor.", precio: 7490, stock: 55, stockCritico: 10, categoria: "Filtros", imagen: IMG + "filtro-aire.jpg", descuento: 0 },
  { id: 6, codigo: "SUS-001", nombre: "Amortiguador delantero", descripcion: "Amortiguador a gas para eje delantero, mejora estabilidad y confort.", precio: 45990, stock: 20, stockCritico: 4, categoria: "Suspensión", imagen: IMG + "amortiguador-delantero.jpg", descuento: 0 },
  { id: 7, codigo: "LUZ-001", nombre: "Ampolleta LED H4", descripcion: "Ampolleta LED de alto brillo, bajo consumo, fácil instalación.", precio: 12990, stock: 3, stockCritico: 5, categoria: "Iluminación", imagen: IMG + "led-h4.jpg", descuento: 0 },
  { id: 8, codigo: "ACE-001", nombre: "Aceite de motor 5W-30 (4L)", descripcion: "Aceite sintético 5W-30, protección avanzada del motor.", precio: 32990, stock: 35, stockCritico: 8, categoria: "Aceites y lubricantes", imagen: IMG + "aceite-motor.jpg", descuento: 20 },
  { id: 9, codigo: "NEU-001", nombre: "Neumático 195/65 R15", descripcion: "Neumático radial para uso urbano y carretera, excelente agarre en mojado.", precio: 69990, stock: 24, stockCritico: 6, categoria: "Neumáticos", imagen: IMG + "neumatico-r15.jpg", descuento: 25 },
];

export const USUARIOS_INICIALES = [
  { run: "197654325", nombre: "Admin", apellidos: "Sistema", correo: "admin@duoc.cl", fechaNacimiento: "", tipoUsuario: "Administrador", region: "Región Metropolitana", comuna: "Santiago", direccion: "Av. Siempre Viva 123" },
];

/* ---------- Acceso a localStorage ---------- */
const PREFIJO = "ap2_";

function leer(clave, semilla) {
  try {
    const guardado = localStorage.getItem(PREFIJO + clave);
    if (guardado === null) {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(semilla));
      return semilla.map((x) => ({ ...x }));
    }
    return JSON.parse(guardado);
  } catch {
    return semilla.map((x) => ({ ...x }));
  }
}

function escribir(clave, lista) {
  localStorage.setItem(PREFIJO + clave, JSON.stringify(lista));
}

const siguienteId = (lista) => (lista.length ? Math.max(...lista.map((x) => x.id)) + 1 : 1);

/**
 * Crea una colección con CRUD.
 * campoId: "id" (autonumérico) o "run" (clave natural que el usuario ingresa).
 */
export function crearColeccion(clave, semilla, campoId = "id") {
  const coincide = (item, id) => String(item[campoId]) === String(id);
  return {
    listar: () => leer(clave, semilla),
    obtener: (id) => leer(clave, semilla).find((x) => coincide(x, id)) ?? null,
    crear(dato) {
      const lista = leer(clave, semilla);
      const nuevo = campoId === "id" ? { ...dato, id: siguienteId(lista) } : { ...dato };
      if (lista.some((x) => coincide(x, nuevo[campoId]))) {
        throw new Error(`Ya existe un registro con ${campoId} ${nuevo[campoId]}`);
      }
      escribir(clave, [...lista, nuevo]);
      return nuevo;
    },
    actualizar(id, cambios) {
      const lista = leer(clave, semilla);
      const existente = lista.find((x) => coincide(x, id));
      if (!existente) return null;
      const actualizado = { ...existente, ...cambios, [campoId]: existente[campoId] };
      escribir(clave, lista.map((x) => (coincide(x, id) ? actualizado : x)));
      return actualizado;
    },
    eliminar(id) {
      const lista = leer(clave, semilla);
      const nueva = lista.filter((x) => !coincide(x, id));
      if (nueva.length === lista.length) return false;
      escribir(clave, nueva);
      return true;
    },
  };
}

export const productosDB = crearColeccion("productos", PRODUCTOS_INICIALES, "id");
export const usuariosDB = crearColeccion("usuarios", USUARIOS_INICIALES, "run");
export const ordenesDB = crearColeccion("ordenes", [], "id");

/** Categorías derivadas de los productos (con imagen del primer producto) */
export function obtenerCategorias() {
  const mapa = new Map();
  productosDB.listar().forEach((p) => {
    if (!mapa.has(p.categoria)) mapa.set(p.categoria, { nombre: p.categoria, imagen: p.imagen, cantidad: 0 });
    mapa.get(p.categoria).cantidad += 1;
  });
  return [...mapa.values()];
}

/* ---------- Sesión y carrito persistidos ---------- */
export const sesionDB = {
  leer: () => { try { return JSON.parse(localStorage.getItem(PREFIJO + "sesion")); } catch { return null; } },
  guardar: (u) => localStorage.setItem(PREFIJO + "sesion", JSON.stringify(u)),
  borrar: () => localStorage.removeItem(PREFIJO + "sesion"),
};

export const carritoDB = {
  leer: () => { try { return JSON.parse(localStorage.getItem(PREFIJO + "carrito")) ?? []; } catch { return []; } },
  guardar: (c) => localStorage.setItem(PREFIJO + "carrito", JSON.stringify(c)),
};
