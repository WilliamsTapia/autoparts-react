import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import CarritoTabla from "./CarritoTabla";
import { useCarrito } from "../context/CarritoContext";

const Carrito = () => {
  const { carrito, total, cambiarCantidad, quitar, vaciar } = useCarrito();
  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">Carrito de compras</h1>
      <CarritoTabla items={carrito} total={total} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />
      <div className="d-flex gap-2 flex-wrap">
        <Link to="/productos" className="btn btn-outline-dark">Seguir comprando</Link>
        {carrito.length > 0 && (
          <>
            <Button variant="secondary" onClick={vaciar}>Vaciar carrito</Button>
            <Link to="/checkout" className="btn btn-success ms-auto">Comprar ahora</Link>
          </>
        )}
      </div>
    </Container>
  );
};

export default Carrito;
