import { useState, useEffect } from "react";
import { Container, Table, Button, Badge, Modal, Card } from "react-bootstrap";
import { ordenesDB } from "../../data/db";

const OrdenesAdmin = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    setOrdenes(ordenesDB.listar());
  }, []);

  const verBoleta = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setOrdenSeleccionada(null);
  };

  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Órdenes y Boletas</h2>
      </div>

      {ordenes.length === 0 ? (
        <p className="text-muted">No hay órdenes registradas aún.</p>
      ) : (
        <Table responsive hover striped className="align-middle shadow-sm bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th># ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td><strong>#{String(orden.id).padStart(5, "0")}</strong></td>
                <td>{orden.fecha ? new Date(orden.fecha).toLocaleDateString() : "N/A"}</td>
                <td>{orden.cliente?.nombre} {orden.cliente?.apellidos}</td>
                <td>{orden.cliente?.correo}</td>
                <td>${Number(orden.total || 0).toLocaleString("es-CL")}</td>
                <td>
                  <Badge bg={orden.estado === "Pagado" ? "success" : "danger"}>
                    {orden.estado || "Completado"}
                  </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" onClick={() => verBoleta(orden)}>
                    Ver Boleta
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal con la boleta detallada */}
      <Modal show={mostrarModal} onHide={cerrarModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Boleta Electrónica #{String(ordenSeleccionada?.id || "").padStart(5, "0")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordenSeleccionada && (
            <Card className="p-3 border-0">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                <div>
                  <h5 className="mb-0">AutoParts Chile</h5>
                  <small className="text-muted">Venta de repuestos automotrices</small>
                </div>
                <div className="text-end">
                  <Badge bg="success" className="mb-1">{ordenSeleccionada.estado}</Badge>
                  <div><small className="text-muted">{new Date(ordenSeleccionada.fecha).toLocaleString()}</small></div>
                </div>
              </div>

              <div className="mb-3">
                <h6>Datos del Cliente:</h6>
                <p className="mb-1"><strong>Nombre:</strong> {ordenSeleccionada.cliente?.nombre} {ordenSeleccionada.cliente?.apellidos}</p>
                <p className="mb-1"><strong>Correo:</strong> {ordenSeleccionada.cliente?.correo}</p>
                <p className="mb-1"><strong>Dirección:</strong> {ordenSeleccionada.cliente?.calle || ordenSeleccionada.cliente?.direccion}, {ordenSeleccionada.cliente?.comuna}</p>
              </div>

              <h6>Detalle de Productos:</h6>
              <Table size="sm" bordered responsive>
                <thead>
                  <tr className="table-light">
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio Unit.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenSeleccionada.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.nombre}</td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-end">${Number(item.precio).toLocaleString("es-CL")}</td>
                      <td className="text-end">${Number(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-end mt-2">
                <h4>Total: ${Number(ordenSeleccionada.total).toLocaleString("es-CL")}</h4>
              </div>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
          <Button variant="dark" onClick={() => window.print()}>Imprimir Boleta</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdenesAdmin;