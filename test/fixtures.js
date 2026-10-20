// Datos de prueba reutilizables
export const PRODUCTO = { id: 1, codigo: "FRE-001", nombre: "Pastillas de freno", descripcion: "Cerámicas", precio: 20000, stock: 10, stockCritico: 3, categoria: "Frenos", imagen: "img/x.jpg", descuento: 0 };
export const PRODUCTO_OFERTA = { ...PRODUCTO, id: 2, nombre: "Aceite 5W-30", precio: 10000, descuento: 20, categoria: "Aceites y lubricantes" };
