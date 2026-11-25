import useConsulta from "../hooks/useConsulta";
import EstadoConsulta from "../components/EstadoConsulta";
import { Container } from "react-bootstrap";
import ListaProductos from "./ListaProductos";
import { productosDB } from "../services/AutoPartsService";
import { useCarrito } from "../context/CarritoContext";

const Ofertas = () => {
  const { agregar } = useCarrito();
  const consulta = useConsulta(productosDB.listar);
  const enOferta = (consulta.datos || []).filter((p) => p.descuento > 0);
  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">🔥 Ofertas</h1>
      <EstadoConsulta {...consulta} />
      <ListaProductos productos={enOferta} onAgregar={agregar} mensajeVacio="Por ahora no hay productos en oferta." />
    </Container>
  );
};

export default Ofertas;
