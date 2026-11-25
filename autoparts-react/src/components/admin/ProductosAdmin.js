import { useAuth } from "../../context/AuthContext";
import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Table } from "react-bootstrap";
import { productosDB } from "../../services/AutoPartsService";
import { formatearPrecio, esStockCritico } from "../../utils/formato";

const ProductosAdmin = () => {
  const { esAdmin } = useAuth();
  const consulta = useConsulta(productosDB.listar);
  const productos = consulta.datos || [];
  const [error, setError] = useState("");

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await productosDB.eliminar(id);
      setError("");
      consulta.recargar();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-autoparts">+ Nuevo producto</Link>}
      </div>
      <EstadoConsulta {...consulta} />
      <EstadoConsulta error={error} />
      <Table responsive hover className="align-middle bg-white">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Dcto.</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td><td>{p.nombre}</td><td>{p.categoria}</td><td>{formatearPrecio(p.precio)}</td>
              <td>{p.descuento > 0 ? `${p.descuento}%` : "—"}</td>
              <td>{p.stock} {esStockCritico(p) && <Badge className="badge-stock-critico">bajo stock</Badge>}</td>
              <td className="text-nowrap">
                <Link to={`/admin/productos/${p.id}/detalle`} className="btn btn-sm btn-outline-primary me-1">Ver detalle</Link>
                {esAdmin && <>
                <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-dark me-1">Editar</Link>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(p.id)}>Eliminar</Button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductosAdmin;
