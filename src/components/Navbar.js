import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

const ENLACES = [["/", "Home"], ["/productos", "Productos"], ["/categorias", "Categorías"], ["/ofertas", "Ofertas"], ["/nosotros", "Nosotros"], ["/blogs", "Blog"], ["/contacto", "Contacto"]];

/** Barra de navegación principal (responsiva: se colapsa en pantallas menores a "lg") */
const Navigation = () => {
  const { usuario, esAdmin, cerrar } = useAuth();
  const { cantidad } = useCarrito();
  const navegar = useNavigate();

  return (
    <Navbar expand="lg" variant="dark" className="navbar-autoparts">
      <Container>
        <Navbar.Brand as={Link} to="/">🔧 AutoParts CL</Navbar.Brand>
        <Navbar.Toggle aria-controls="menuPrincipal" aria-label="Menú" />
        <Navbar.Collapse id="menuPrincipal">
          <Nav className="ms-auto align-items-lg-center">
            {ENLACES.map(([ruta, texto]) => (
              <Nav.Link as={NavLink} end to={ruta} key={ruta}>{texto}</Nav.Link>
            ))}
            {esAdmin && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
            {usuario ? (
              <>
                <span className="nav-link">Hola, {usuario.nombre}</span>
                <Button size="sm" variant="outline-light" onClick={() => { cerrar(); navegar("/"); }}>Salir</Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={NavLink} to="/registro">Registro</Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/carrito">
              🛒 Carrito {cantidad > 0 && <Badge pill bg="danger" data-testid="contador-carrito">{cantidad}</Badge>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
