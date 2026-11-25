import useConsulta from "../hooks/useConsulta";
import EstadoConsulta from "../components/EstadoConsulta";
import { useEffect } from "react";
import { lanzarConfeti } from "../utils/confeti"; 
import { Link, useParams } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import ResumenOrden from "./ResumenOrden";
import { ordenesDB } from "../services/AutoPartsService";

const PagoResultado = ({ historial = false }) => {
  const { id } = useParams();
  const consulta = useConsulta(ordenesDB.obtener, id);
  const orden = consulta.datos;
  const exito = orden?.estado === "Pagado";
  useEffect(() => {
    if (exito && !historial) lanzarConfeti();
  }, [exito, historial]);
  if (!orden) return <Container as="main" className="my-5"><EstadoConsulta {...consulta} /></Container>;

  const numero = `#${String(orden.id).padStart(5, "0")}`;
  const c = orden.cliente;
  return (
    <Container as="main" className="my-5" style={{ maxWidth: 800 }}>
      <Card className="p-4 shadow-sm">
        {historial && <Link to="/mis-compras" className="mb-3">Volver a mis compras</Link>}
        <h1 className={`h3 ${exito ? "text-success" : "text-danger"}`}>
          {historial ? `${exito ? "Boleta" : "Orden rechazada"} ${numero}` :
            (exito ? `✔ Se ha realizado la compra. nro ${numero}` : `✖ No se pudo realizar el pago. nro ${numero}`)}
        </h1>
        <p className="mb-1"><strong>Cliente:</strong> {c.nombre} {c.apellidos} ({c.correo})</p>
        <p className="mb-1"><strong>Entrega:</strong> {c.calle}{c.departamento ? `, Depto ${c.departamento}` : ""}, {c.comuna}, {c.region}</p>
        {c.indicaciones && <p className="mb-3"><strong>Indicaciones:</strong> {c.indicaciones}</p>}
        {historial && <p className="mb-3"><strong>Fecha:</strong> {new Date(orden.fecha).toLocaleString("es-CL")}</p>}
        <ResumenOrden items={orden.items} />
        <div className="d-flex gap-2 flex-wrap">
          {exito ? (
            <>
              <Button variant="danger" onClick={() => window.print()}>Imprimir boleta</Button>
              <Link to="/productos" className="btn btn-outline-dark">Seguir comprando</Link>
            </>
          ) : (
            !historial && <Link to="/checkout" className="btn btn-success">VOLVER A REALIZAR EL PAGO</Link>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default PagoResultado;
