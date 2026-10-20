import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const NoEncontrado = () => {
  return (
    <Container as="main" className="my-5 text-center">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-autoparts">Volver al inicio</Link>
    </Container>
  );
};

export default NoEncontrado;
