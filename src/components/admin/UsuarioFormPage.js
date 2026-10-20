import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import FormUsuario from "../FormUsuario";
import { usuariosDB } from "../../data/db";

const UsuarioFormPage = () => {
  const { run } = useParams();
  const navegar = useNavigate();
  const existente = run ? usuariosDB.obtener(run) : null;

  if (run && !existente) return <Alert variant="warning">Usuario no encontrado.</Alert>;

  const guardar = (datos) => {
    if (existente) usuariosDB.actualizar(run, datos);
    else if (usuariosDB.obtener(datos.run)) return { ok: false, mensaje: "Ya existe un usuario con ese RUN." };
    else usuariosDB.crear(datos);
    setTimeout(() => navegar("/admin/usuarios"), 700);
    return { ok: true, mensaje: "Usuario guardado correctamente." };
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-4">{existente ? "Editar usuario" : "Nuevo usuario"}</h1>
      <FormUsuario modo="admin" inicial={existente ?? undefined} editando={!!existente} onGuardar={guardar} />
    </div>
  );
};

export default UsuarioFormPage;
