import { Container } from "react-bootstrap";
import ListaProductos from "./ListaProductos";
import { productosDB } from "../data/db";
import { useCarrito } from "../context/CarritoContext";

const Ofertas = () => {
  const { agregar } = useCarrito();
  const enOferta = productosDB.listar().filter((p) => p.descuento > 0);
  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">🔥 Ofertas</h1>
      <ListaProductos productos={enOferta} onAgregar={agregar} mensajeVacio="Por ahora no hay productos en oferta." />
    </Container>
  );
};

export default Ofertas;
