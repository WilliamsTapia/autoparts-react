import { Link, useParams } from "react-router-dom";
import EstadoConsulta from "../EstadoConsulta";
import useConsulta from "../../hooks/useConsulta";
import { productosDB } from "../../services/AutoPartsService";
import { formatearPrecio } from "../../utils/formato";

export default function ProductoDetalleAdmin() {
  const { id } = useParams();
  const consulta = useConsulta(productosDB.obtener, id);
  const producto = consulta.datos;
  return (
    <section>
      <Link to="/admin/productos">Volver a productos</Link>
      <EstadoConsulta {...consulta} />
      {producto && <>
        <h1 className="h3 mt-3">{producto.nombre}</h1>
        <p>{producto.descripcion}</p>
        <dl>
          <dt>Código</dt><dd>{producto.codigo}</dd>
          <dt>Categoría</dt><dd>{producto.categoria}</dd>
          <dt>Precio</dt><dd>{formatearPrecio(producto.precio)}</dd>
          <dt>Descuento</dt><dd>{producto.descuento}%</dd>
          <dt>Stock</dt><dd>{producto.stock}</dd>
        </dl>
      </>}
    </section>
  );
}
