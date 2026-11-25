import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import FormUsuario from "./FormUsuario";
import { registrar as registrarCuenta } from "../services/AutoPartsService";

const Registro = () => {
  const navegar = useNavigate();

  const registrar = async (datos) => {
    await registrarCuenta(datos);
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
