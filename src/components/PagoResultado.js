import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card, Container } from "react-bootstrap";
import ResumenOrden from "./ResumenOrden";
import { ordenesDB } from "../data/db";

/** Una sola pantalla para "compra exitosa" y "pago con error" (prop `exito`) */
const PagoResultado = ({ exito }) => {
  const { id } = useParams();
  const orden = ordenesDB.obtener(id);
  if (!orden) return <Container as="main" className="my-5"><Alert variant="warning">Orden no encontrada.</Alert></Container>;

  const numero = `#${String(orden.id).padStart(5, "0")}`;
  const c = orden.cliente;
  return (
    <Container as="main" className="my-5" style={{ maxWidth: 800 }}>
      <Card className="p-4 shadow-sm">
        <h1 className={`h3 ${exito ? "text-success" : "text-danger"}`}>
          {exito ? `✔ Se ha realizado la compra. nro ${numero}` : `✖ No se pudo realizar el pago. nro ${numero}`}
        </h1>
        <p className="mb-1"><strong>Cliente:</strong> {c.nombre} {c.apellidos} ({c.correo})</p>
        <p className="mb-1"><strong>Entrega:</strong> {c.calle}{c.departamento ? `, Depto ${c.departamento}` : ""}, {c.comuna}, {c.region}</p>
        {c.indicaciones && <p className="mb-3"><strong>Indicaciones:</strong> {c.indicaciones}</p>}
        <ResumenOrden items={orden.items} />
        <div className="d-flex gap-2 flex-wrap">
          {exito ? (
            <>
              <Button variant="danger" onClick={() => window.print()}>Imprimir boleta</Button>
              <Link to="/productos" className="btn btn-outline-dark">Seguir comprando</Link>
            </>
          ) : (
            <Link to="/checkout" className="btn btn-success">VOLVER A REALIZAR EL PAGO</Link>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default PagoResultado;
