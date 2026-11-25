import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormLogin from "./FormLogin";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { iniciar } = useAuth();
  const navegar = useNavigate();
  const { state } = useLocation();

  const ingresar = async (credenciales) => {
    const usuario = await iniciar(credenciales);
    const volver = ["/checkout", "/mis-compras"].includes(state?.volver) ? state.volver : "/";
    navegar(usuario.role === "CLIENTE" ? volver : "/admin", { replace: true });
    return { ok: true, mensaje: "Inicio de sesión exitoso. ¡Bienvenido/a!" };
  };

  return (
    <Container as="main" className="my-5" style={{ maxWidth: 460 }}>
      <h1 className="h3 mb-4">Iniciar sesión</h1>
      <FormLogin onIngresar={ingresar} />
      <p className="mt-3 text-muted">¿No tienes cuenta? <Link to="/registro">Regístrate</Link>.</p>
    </Container>
  );
};

export default Login;
