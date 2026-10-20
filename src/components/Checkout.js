import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Card, Container } from "react-bootstrap";
import CheckoutForm from "./CheckoutForm";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { ordenesDB } from "../data/db";
import { procesarPago } from "../services/pago";

const Checkout = () => {
  const { carrito, total, vaciar } = useCarrito();
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const [procesando, setProcesando] = useState(false);

  if (carrito.length === 0) {
    return <Container as="main" className="my-5"><Alert variant="info">No hay productos para pagar.</Alert><Link to="/productos">Ir al catálogo</Link></Container>;
  }

  const pagar = async (cliente, resultadoSimulado) => {
    setProcesando(true);
    const { aprobado } = await procesarPago({ resultadoSimulado });
    const orden = ordenesDB.crear({ fecha: new Date().toISOString(), cliente, items: carrito, total, estado: aprobado ? "Pagado" : "Rechazado" });
    if (aprobado) vaciar();
    navegar(aprobado ? `/pago/exito/${orden.id}` : `/pago/error/${orden.id}`);
  };

  return (
    <Container as="main" className="my-5" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-1">Checkout</h1>
      <p className="text-muted">{usuario ? "Tus datos se completaron automáticamente." : "Completa la siguiente información."}</p>
      <Card className="p-4 shadow-sm">
        <CheckoutForm items={carrito} total={total} usuario={usuario} onPagar={pagar} procesando={procesando} />
      </Card>
    </Container>
  );
};

export default Checkout;
