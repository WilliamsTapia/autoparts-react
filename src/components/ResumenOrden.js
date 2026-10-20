import { Table } from "react-bootstrap";
import { formatearPrecio } from "../utils/formato";

/** Tabla de productos con subtotales y total (checkout y boleta) */
const ResumenOrden = ({ items }) => {
  const total = items.reduce((t, i) => t + i.precio * i.cantidad, 0);
  return (
    <Table responsive className="align-middle">
      <thead><tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th></tr></thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td><img src={i.imagen} alt="" width="48" height="36" className="me-2" style={{ objectFit: "cover" }} />{i.nombre}</td>
            <td>{formatearPrecio(i.precio)}</td>
            <td>{i.cantidad}</td>
            <td>{formatearPrecio(i.precio * i.cantidad)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot><tr><th colSpan="3" className="text-end">Total</th><th data-testid="total-resumen">{formatearPrecio(total)}</th></tr></tfoot>
    </Table>
  );
};

export default ResumenOrden;
