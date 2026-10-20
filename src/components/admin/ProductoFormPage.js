import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import FormProducto from "../FormProducto";
import { productosDB } from "../../data/db";

const CATEGORIAS = ["Frenos", "Filtros", "Baterías", "Suspensión", "Iluminación", "Aceites y lubricantes", "Neumáticos"];

const ProductoFormPage = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? productosDB.obtener(id) : null;

  if (id && !existente) return <Alert variant="warning">Producto no encontrado.</Alert>;

  const guardar = (datos) => {
    if (existente) productosDB.actualizar(id, datos); else productosDB.crear(datos);
    setTimeout(() => navegar("/admin/productos"), 700);
    return { ok: true, mensaje: "Producto guardado correctamente." };
  };

  const inicial = existente ? { ...existente, stockCritico: existente.stockCritico ?? "", descuento: String(existente.descuento ?? 0) } : undefined;
  return (
    <div style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-4">{existente ? "Editar producto" : "Nuevo producto"}</h1>
      <FormProducto inicial={inicial} categorias={CATEGORIAS} onGuardar={guardar} />
    </div>
  );
};

export default ProductoFormPage;
