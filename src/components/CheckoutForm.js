import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import RegionComuna from "./RegionComuna";
import ResumenOrden from "./ResumenOrden";
import { validarCheckout } from "../utils/validaciones";
import { formatearPrecio } from "../utils/formato";

/**
 * Paso de pago. Si hay un usuario con sesión, sus datos se precargan.
 * onPagar(datosCliente, resultadoSimulado) lo resuelve el padre.
 */
const CheckoutForm = ({ items, total, usuario, onPagar, procesando = false }) => {
  const [valores, setValores] = useState({
    nombre: usuario?.nombre ?? "", apellidos: usuario?.apellidos ?? "", correo: usuario?.correo ?? "",
    calle: usuario?.direccion ?? "", departamento: "", region: usuario?.region ?? "", comuna: usuario?.comuna ?? "",
    indicaciones: "", resultadoSimulado: "aprobado",
  });
  const [errores, setErrores] = useState({});

  const poner = (campo, valor) => setValores((v) => ({ ...v, [campo]: valor }));
  const cambiar = (e) => poner(e.target.name, e.target.value);

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarCheckout(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) return;
    const { resultadoSimulado, ...cliente } = valores;
    onPagar(cliente, resultadoSimulado);
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <ResumenOrden items={items} />
      <h2 className="h5 mt-4">Información del cliente</h2>
      <Row>
        <Col md={6}><Campo id="nombre" label="Nombre *" value={valores.nombre} onChange={cambiar} error={errores.nombre} /></Col>
        <Col md={6}><Campo id="apellidos" label="Apellidos *" value={valores.apellidos} onChange={cambiar} error={errores.apellidos} /></Col>
        <Col xs={12}><Campo id="correo" label="Correo *" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} /></Col>
      </Row>
      <h2 className="h5 mt-3">Dirección de entrega de los productos</h2>
      <Row>
        <Col md={6}><Campo id="calle" label="Calle *" value={valores.calle} onChange={cambiar} error={errores.calle} /></Col>
        <Col md={6}><Campo id="departamento" label="Departamento (opcional)" placeholder="Ej: 603" value={valores.departamento} onChange={cambiar} /></Col>
        <RegionComuna region={valores.region} comuna={valores.comuna} errores={errores} onChange={poner} />
        <Col xs={12}><Campo id="indicaciones" label="Indicaciones para la entrega (opcional)" as="textarea" rows="2" value={valores.indicaciones} onChange={cambiar} /></Col>
      </Row>
      <Alerta tipo="info" mensaje="Pasarela de pago simulada: elige el resultado para probar ambos flujos." />
      <Row className="align-items-end">
        <Col md={6}>
          <Campo id="resultadoSimulado" label="Resultado del pago (simulación)" as="select" value={valores.resultadoSimulado} onChange={cambiar}>
            <option value="aprobado">Pago aprobado</option>
            <option value="rechazado">Pago rechazado</option>
          </Campo>
        </Col>
        <Col md={6} className="mb-3 text-md-end">
          <Button type="submit" variant="success" size="lg" disabled={procesando}>
            {procesando ? "Procesando..." : `Pagar ahora ${formatearPrecio(total)}`}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CheckoutForm;
