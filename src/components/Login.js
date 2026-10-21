import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormLogin from "./FormLogin";
import { useAuth } from "../context/AuthContext";
import { usuariosDB } from "../data/db";

const Login = () => {
  const { iniciar } = useAuth();
  const navegar = useNavigate();

  const ingresar = ({ correo }) => {
    const usuario = usuariosDB.listar().find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase());
    if (!usuario) return { ok: false, mensaje: "No existe una cuenta con ese correo. Regístrate primero." };
    iniciar(usuario);
    setTimeout(() => navegar(usuario.tipoUsuario === "Administrador" ? "/admin" : "/"), 600);
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
