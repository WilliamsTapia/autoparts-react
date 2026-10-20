import { Link, useParams } from "react-router-dom";
import { Alert, Badge, Button, Col, Container, Row } from "react-bootstrap";
import { productosDB } from "../data/db";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio, precioFinal } from "../utils/formato";

const ProductoDetalle = () => {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const p = productosDB.obtener(id);

  if (!p) return <Container as="main" className="my-5"><Alert variant="warning">Producto no encontrado.</Alert><Link to="/productos">Volver al catálogo</Link></Container>;

  const enOferta = p.descuento > 0;
  return (
    <Container as="main" className="my-5">
      <Link to="/productos" className="btn btn-outline-dark btn-sm mb-4">&larr; Volver al catálogo</Link>
      <Row className="g-5">
        <Col md={6}><img src={p.imagen} alt={p.nombre} className="img-fluid rounded" /></Col>
        <Col md={6}>
          <small className="text-muted">{p.categoria} · Código {p.codigo}</small>
          <h1 className="h2">{p.nombre}</h1>
          <p className="precio-producto fs-3">
            {enOferta && <del className="text-muted fs-5 me-2 fw-normal">{formatearPrecio(p.precio)}</del>}
            {formatearPrecio(precioFinal(p))}
            {enOferta && <Badge bg="danger" className="ms-2 fs-6">-{p.descuento}%</Badge>}
          </p>
          <p>{p.descripcion}</p>
          <p className="text-muted">Stock disponible: {p.stock}</p>
          <Button variant="autoparts" size="lg" disabled={p.stock <= 0} onClick={() => agregar(p)}>Agregar al carrito</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductoDetalle;
