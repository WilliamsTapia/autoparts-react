import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Table } from "react-bootstrap";
import { productosDB } from "../../data/db";
import { formatearPrecio, esStockCritico } from "../../utils/formato";

const ProductosAdmin = () => {
  const [productos, setProductos] = useState(productosDB.listar);

  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    productosDB.eliminar(id);
    setProductos(productosDB.listar());
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-autoparts">+ Nuevo producto</Link>
      </div>
      <Table responsive hover className="align-middle bg-white">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Dcto.</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td><td>{p.nombre}</td><td>{p.categoria}</td><td>{formatearPrecio(p.precio)}</td>
              <td>{p.descuento > 0 ? `${p.descuento}%` : "—"}</td>
              <td>{p.stock} {esStockCritico(p) && <Badge className="badge-stock-critico">bajo stock</Badge>}</td>
              <td className="text-nowrap">
                <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-dark me-1">Editar</Link>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductosAdmin;
