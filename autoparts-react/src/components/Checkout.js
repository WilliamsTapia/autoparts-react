import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Alert, Card, Container } from "react-bootstrap";
import CheckoutForm from "./CheckoutForm";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { ordenesDB } from "../services/AutoPartsService";
import { procesarPago } from "../services/pago";

const Checkout = () => {
  const { carrito, total, vaciar } = useCarrito();
  const { usuario, cargando, esVendedor } = useAuth();
  const navegar = useNavigate();
  const [procesando, setProcesando] = useState(false);

  const [error, setError] = useState("");
  if (cargando) return <p role="status">Cargando sesión…</p>;
  if (carrito.length === 0) {
    return <Container as="main" className="my-5"><Alert variant="info">No hay productos para pagar.</Alert><Link to="/productos">Ir al catálogo</Link></Container>;
  }

  if (!usuario) return <Navigate to="/login" state={{ volver: "/checkout" }} replace />;
  if (esVendedor) return <Navigate to="/admin" replace />;

  const pagar = async (cliente, resultadoSimulado) => {
    setProcesando(true);
    setError("");
    try {
      const { aprobado } = await procesarPago({ resultadoSimulado });
      const items = carrito.map(({ id, cantidad }) => ({ id, cantidad }));
      const orden = await ordenesDB.crear({ cliente, items, aprobado });
      if (aprobado) vaciar();
      navegar(aprobado ? `/pago/exito/${orden.id}` : `/pago/error/${orden.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <Container as="main" className="my-5" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-1">Checkout</h1>
      <p className="text-muted">{usuario ? "Tus datos se completaron automáticamente." : "Completa la siguiente información."}</p>
      {error && <Alert variant="warning">{error}</Alert>}
      <Card className="p-4 shadow-sm">
        <CheckoutForm items={carrito} total={total} usuario={usuario} onPagar={pagar} procesando={procesando} />
      </Card>
    </Container>
  );
};

export default Checkout;
