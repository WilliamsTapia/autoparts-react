import { Container } from "react-bootstrap";
import FormContacto from "./FormContacto";

const Contacto = () => {
  return (
    <Container as="main" className="my-5" style={{ maxWidth: 640 }}>
      <h1 className="h2 mb-4">Contáctanos</h1>
      <FormContacto />
    </Container>
  );
};

export default Contacto;
