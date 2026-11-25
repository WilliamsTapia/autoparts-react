import { Alert } from "react-bootstrap";

/** Muestra un mensaje solo cuando existe (renderizado condicional) */
const Alerta = ({ tipo = "warning", mensaje }) => {
  if (!mensaje) return null;
  return (
    <Alert variant={tipo} className="mb-3">
      <strong>{mensaje}</strong>
    </Alert>
  );
};

export default Alerta;
