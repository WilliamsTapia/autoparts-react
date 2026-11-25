import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useNavigate, useParams } from "react-router-dom";
import FormProducto from "../FormProducto";
import { productosDB, obtenerCategorias } from "../../services/AutoPartsService";

const ProductoFormPage = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const consulta = useConsulta(productosDB.obtener, id || null);
  const existente = consulta.datos;
  const categorias = useConsulta(obtenerCategorias);
  if (!categorias.datos) return <EstadoConsulta {...categorias} />;

  const guardar = async (datos) => {
    if (existente) await productosDB.actualizar(id, datos);
    else await productosDB.crear(datos);
    setTimeout(() => navegar("/admin/productos"), 700);
    return { ok: true, mensaje: "Producto guardado correctamente." };
  };

  const inicial = existente ? { ...existente, stockCritico: existente.stockCritico ?? "", descuento: String(existente.descuento ?? 0) } : undefined;
  if (id && !existente) return <EstadoConsulta {...consulta} />;

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-4">{existente ? "Editar producto" : "Nuevo producto"}</h1>
      <FormProducto inicial={inicial} categorias={categorias.datos.map((c) => c.nombre)} onGuardar={guardar} />
    </div>
  );
};

export default ProductoFormPage;
