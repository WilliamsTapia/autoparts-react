import { Link, useParams } from "react-router-dom";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import ListaProductos from "./ListaProductos";
import { obtenerCategorias, productosDB } from "../data/db";
import { useCarrito } from "../context/CarritoContext";

const Categorias = () => {
  const { nombre } = useParams();
  const { agregar } = useCarrito();
  const categorias = obtenerCategorias();
  const productos = productosDB.listar();
  const mostradas = nombre ? categorias.filter((c) => c.nombre === nombre) : categorias;

  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">Categorías</h1>
      <Row className="g-3 mb-5">
        {categorias.map((c) => (
          <Col xs={6} md={4} lg={3} key={c.nombre}>
            <Link to={`/categorias/${c.nombre}`} className="text-decoration-none">
              <Card className={`card-producto h-100 text-center ${c.nombre === nombre ? "border-danger" : ""}`}>
                <Card.Img variant="top" src={c.imagen} alt={c.nombre} />
                <Card.Body className="p-2"><strong className="text-dark">{c.nombre}</strong><br /><small className="text-muted">{c.cantidad} producto(s)</small></Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      {nombre && <Link to="/categorias" className="btn btn-outline-dark btn-sm mb-4">Ver todas las categorías</Link>}
      {mostradas.map((c) => (
        <section key={c.nombre} className="mb-5">
          <h2 className="h4 mb-3">{c.nombre}</h2>
          <ListaProductos productos={productos.filter((p) => p.categoria === c.nombre)} onAgregar={agregar} />
        </section>
      ))}
      {nombre && mostradas.length === 0 && <Alert variant="warning">La categoría “{nombre}” no existe.</Alert>}
    </Container>
  );
};

export default Categorias;
