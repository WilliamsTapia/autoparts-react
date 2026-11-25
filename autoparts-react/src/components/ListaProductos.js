import { Row, Col } from "react-bootstrap";
import ProductoCard from "./ProductoCard";

/** Grilla responsiva de productos (Bootstrap: 1/2/3/4 columnas según pantalla) */
const ListaProductos = ({ productos, onAgregar, mensajeVacio = "No hay productos para mostrar." }) => {
  if (productos.length === 0) return <p className="text-muted" data-testid="lista-vacia">{mensajeVacio}</p>;
  return (
    <Row className="g-4">
      {productos.map((p) => (
        <Col key={p.id} xs={12} sm={6} lg={4} xl={3}>
          <ProductoCard producto={p} onAgregar={onAgregar} />
        </Col>
      ))}
    </Row>
  );
};

export default ListaProductos;
