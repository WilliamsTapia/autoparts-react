import { Alert, Table, Form, Button } from "react-bootstrap";
import { formatearPrecio } from "../utils/formato";

/** Tabla editable del carrito. Todo llega por props: no tiene estado propio */
const CarritoTabla = ({ items, total, onCambiarCantidad, onQuitar }) => {
  if (items.length === 0) return <Alert variant="info" data-testid="carrito-vacio">Tu carrito está vacío.</Alert>;
  return (
    <Table responsive className="align-middle">
      <thead><tr><th>Producto</th><th>Precio</th><th style={{ width: 110 }}>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td><img src={i.imagen} alt={i.nombre} width="60" height="45" className="me-2" style={{ objectFit: "cover" }} />{i.nombre}</td>
            <td>{formatearPrecio(i.precio)}</td>
            <td>
              <Form.Control type="number" min="1" size="sm" aria-label={`Cantidad ${i.nombre}`}
                value={i.cantidad} onChange={(e) => onCambiarCantidad(i.id, e.target.value)} />
            </td>
            <td>{formatearPrecio(i.precio * i.cantidad)}</td>
            <td><Button size="sm" variant="outline-danger" onClick={() => onQuitar(i.id)}>Quitar</Button></td>
          </tr>
        ))}
      </tbody>
      <tfoot><tr><th colSpan="3" className="text-end">Total</th><th colSpan="2" data-testid="total-carrito">{formatearPrecio(total)}</th></tr></tfoot>
    </Table>
  );
};

export default CarritoTabla;
