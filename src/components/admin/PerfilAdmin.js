import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Badge } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { ordenesDB, usuariosDB } from "../../data/db";

const PerfilAdmin = () => {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    region: "",
    comuna: "",
    direccion: "",
  });
  const [compras, setCompras] = useState([]);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (usuario) {
      setDatos({
        nombre: usuario.nombre || "",
        apellidos: usuario.apellidos || "",
        correo: usuario.correo || "",
        region: usuario.region || "",
        comuna: usuario.comuna || "",
        direccion: usuario.direccion || "",
      });

      // Filtrar historial de órdenes correspondientes al usuario logueado
      const todas = ordenesDB.listar();
      const misOrdenes = todas.filter(
        (o) => o.cliente?.correo?.toLowerCase() === usuario.correo?.toLowerCase()
      );
      setCompras(misOrdenes);
    }
  }, [usuario]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (usuario?.run) {
      usuariosDB.actualizar(usuario.run, datos);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    }
  };

  return (
    <Container fluid className="p-3">
      <div className="mb-4">
        <h2>Mi Perfil e Historial de Actividad</h2>
        <p className="text-muted">Administra tu información personal y revisa compras registradas</p>
      </div>

      <Row className="g-4">
        <Col md={5}>
          <Card className="p-3 shadow-sm border-0">
            <h5 className="mb-3">Información de Cuenta</h5>
            {guardado && <div className="alert alert-success py-2">Datos actualizados con éxito.</div>}
            <Form onSubmit={handleGuardar}>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" value={datos.correo} disabled />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={datos.direccion}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comuna</Form.Label>
                <Form.Control
                  type="text"
                  name="comuna"
                  value={datos.comuna}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="danger" type="submit" className="w-100">
                Guardar Cambios
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="p-3 shadow-sm border-0">
            <h5 className="mb-3">Historial de Compras Personales</h5>
            {compras.length === 0 ? (
              <p className="text-muted">No registras compras directas con esta cuenta aún.</p>
            ) : (
              <Table responsive hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th># ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((c) => (
                    <tr key={c.id}>
                      <td><strong>#{String(c.id).padStart(5, "0")}</strong></td>
                      <td>{c.fecha ? new Date(c.fecha).toLocaleDateString() : "N/A"}</td>
                      <td>${Number(c.total || 0).toLocaleString("es-CL")}</td>
                      <td><Badge bg="success">{c.estado || "Pagado"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PerfilAdmin;