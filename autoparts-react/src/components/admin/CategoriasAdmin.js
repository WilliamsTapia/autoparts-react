import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useState } from "react";
import { Container, Table, Button, Form, Modal, Card, Badge } from "react-bootstrap";
import { obtenerCategorias, categoriasDB } from "../../services/AutoPartsService";

const CategoriasAdmin = () => {
  const consulta = useConsulta(obtenerCategorias);
  const categorias = consulta.datos || [];
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState({ id: null, nombre: "" });

  const abrirCrear = () => {
    setModoEdicion(false);
    setCategoriaActual({ id: null, nombre: "" });
    setMostrarModal(true);
  };

  const abrirEditar = (cat) => {
    setModoEdicion(true);
    setCategoriaActual({ id: cat.id, nombre: cat.nombre });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const eliminar = async (categoria) => {
    if (!window.confirm(`¿Eliminar la categoría ${categoria.nombre}?`)) return;
    try {
      await categoriasDB.eliminar(categoria.id);
      setError("");
      consulta.recargar();
    } catch (error) {
      setError(error.message);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!categoriaActual.nombre.trim()) return;

    try {
      const datos = { nombre: categoriaActual.nombre.trim() };
      if (modoEdicion) await categoriasDB.actualizar(categoriaActual.id, datos);
      else await categoriasDB.crear(datos);
      setError("");
      consulta.recargar();
      cerrarModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Gestión de Categorías</h2>
          <p className="text-muted mb-0">Administra las clasificaciones de repuestos</p>
        </div>
        <Button variant="danger" onClick={abrirCrear}>
          + Nueva Categoría
        </Button>
      </div>

      <EstadoConsulta {...consulta} />
      {!mostrarModal && <EstadoConsulta error={error} />}
      <Card className="shadow-sm border-0">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre de la Categoría</th>
              <th className="text-center">Productos Asociados</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{cat.nombre}</td>
                <td className="text-center">
                  <Badge bg="secondary" pill>
                    {cat.cantidad} productos
                  </Badge>
                </td>
                <td className="text-end">
                  <Button variant="outline-primary" size="sm" onClick={() => abrirEditar(cat)}>
                    Editar
                  </Button>
                  <Button variant="outline-danger" size="sm" className="ms-2" disabled={cat.cantidad > 0}
                    onClick={() => eliminar(cat)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton>
            <Modal.Title>{modoEdicion ? "Editar Categoría" : "Nueva Categoría"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EstadoConsulta error={error} />
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Frenos, Baterías, Filtros..."
                value={categoriaActual.nombre}
                onChange={(e) => setCategoriaActual({ ...categoriaActual, nombre: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                {modoEdicion
                  ? "Al cambiar el nombre, se actualizarán los productos vinculados a ella."
                  : "Esta categoría estará disponible para clasificar repuestos."}
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
            <Button variant="danger" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CategoriasAdmin;
