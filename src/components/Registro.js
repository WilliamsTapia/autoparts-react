import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormUsuario from "./FormUsuario";
import { usuariosDB } from "../data/db";

const Registro = () => {
  const navegar = useNavigate();

  const registrar = (datos) => {
    if (usuariosDB.obtener(datos.run)) return { ok: false, mensaje: "Ya existe un usuario con ese RUN." };
    if (usuariosDB.listar().some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase())) return { ok: false, mensaje: "Ya existe una cuenta con ese correo." };
    usuariosDB.crear({ ...datos, tipoUsuario: "Cliente" });
    setTimeout(() => navegar("/login"), 900);
    return { ok: true, mensaje: "¡Cuenta creada correctamente! Ya puedes iniciar sesión." };
  };

  return (
    <Container as="main" className="my-5" style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-4">Crear cuenta</h1>
      <FormUsuario modo="registro" onGuardar={registrar} textoBoton="Crear cuenta" />
    </Container>
  );
};

export default Registro;
