import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="text-center py-4 mt-5">
      <Container>
        <p className="mb-1">&copy; 2026 AutoParts CL — Av. Siempre Viva 123, Santiago</p>
        <p className="mb-0">contacto@autopartscl.cl | <Link to="/contacto">Escríbenos</Link></p>
      </Container>
    </footer>
  );
};

export default Footer;
