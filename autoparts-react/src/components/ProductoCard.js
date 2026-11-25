import { Link } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";
import { formatearPrecio, precioFinal } from "../utils/formato";

/** Tarjeta de un producto. Recibe el producto y la función onAgregar por props */
const ProductoCard = ({ producto, onAgregar }) => {
  const enOferta = producto.descuento > 0;
  const sinStock = producto.stock <= 0;
  return (
    <Card className="card-producto h-100">
      {enOferta && <Badge bg="danger" className="badge-oferta" data-testid="badge-oferta">-{producto.descuento}%</Badge>}
      <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        <small className="text-muted">{producto.categoria}</small>
        <Card.Title as="h5">{producto.nombre}</Card.Title>
        <p className="precio-producto mb-3">
          {enOferta && <del className="text-muted me-2 fw-normal">{formatearPrecio(producto.precio)}</del>}
          <span data-testid="precio-final">{formatearPrecio(precioFinal(producto))}</span>
        </p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-dark btn-sm">Ver detalle</Link>
          <Button variant="autoparts" size="sm" disabled={sinStock} onClick={() => onAgregar(producto)}>
            {sinStock ? "Sin stock" : "Agregar"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;
