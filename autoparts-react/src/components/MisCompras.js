import { Badge, Container, Table } from "react-bootstrap";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useConsulta from "../hooks/useConsulta";
import { listarMisCompras } from "../services/AutoPartsService";
import { formatearPrecio } from "../utils/formato";
import EstadoConsulta from "./EstadoConsulta";

export function AccesoCompras() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Container className="my-5"><EstadoConsulta cargando /></Container>;
  if (!usuario) return <Navigate to="/login" state={{ volver: "/mis-compras" }} replace />;
  if (usuario.role !== "CLIENTE") return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function MisCompras() {
  const consulta = useConsulta(listarMisCompras);
  const compras = consulta.datos;

  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">Mis compras</h1>
      <EstadoConsulta {...consulta} />
      {compras?.length === 0 && (
        <div>
          <p>Todavía no tienes compras registradas.</p>
          <Link to="/productos" className="btn btn-autoparts">Ver catálogo</Link>
        </div>
      )}
      {compras?.length > 0 && (
        <Table responsive hover className="align-middle">
          <thead>
            <tr><th>Orden</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {compras.map((orden) => {
              const pagada = orden.estado === "Pagado";
              const numero = `#${String(orden.id).padStart(5, "0")}`;
              return (
                <tr key={orden.id}>
                  <th scope="row">{numero}</th>
                  <td>{new Date(orden.fecha).toLocaleString("es-CL")}</td>
                  <td><Badge bg={pagada ? "success" : "secondary"}>{orden.estado}</Badge></td>
                  <td>{formatearPrecio(orden.total)}</td>
                  <td>
                    <Link to={`/mis-compras/${orden.id}`} className="btn btn-sm btn-outline-dark"
                      aria-label={`${pagada ? "Ver boleta" : "Ver detalle"} ${numero}`}>
                      {pagada ? "Ver boleta" : "Ver detalle"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
