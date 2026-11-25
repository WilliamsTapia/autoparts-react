import { Row, Col, Form } from "react-bootstrap";

/** Filtros de búsqueda: componente controlado (el estado vive en el padre) */
const FiltrosProductos = ({ categorias, valores, onChange }) => {
  const cambiar = (campo) => (e) => onChange({ ...valores, [campo]: e.target.value });
  return (
    <Row className="g-2 mb-4">
      <Col xs={12} md={5}>
        <Form.Control type="search" placeholder="Buscar repuesto..." aria-label="Buscar"
          value={valores.texto} onChange={cambiar("texto")} />
      </Col>
      <Col xs={6} md={4}>
        <Form.Select aria-label="Categoría" value={valores.categoria} onChange={cambiar("categoria")}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
        </Form.Select>
      </Col>
      <Col xs={6} md={3}>
        <Form.Select aria-label="Ordenar" value={valores.orden} onChange={cambiar("orden")}>
          <option value="">Orden por defecto</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A-Z)</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default FiltrosProductos;
