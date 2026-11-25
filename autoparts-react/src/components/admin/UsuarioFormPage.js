import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../../components/EstadoConsulta";
import { useNavigate, useParams } from "react-router-dom";
import FormUsuario from "../FormUsuario";
import { usuariosDB } from "../../services/AutoPartsService";

const UsuarioFormPage = () => {
  const { run } = useParams();
  const navegar = useNavigate();
  const consulta = useConsulta(usuariosDB.obtener, run || null);
  const existente = consulta.datos;

  const guardar = async (datos) => {
    if (existente) await usuariosDB.actualizar(run, datos);
    else await usuariosDB.crear(datos);
    setTimeout(() => navegar("/admin/usuarios"), 700);
    return { ok: true, mensaje: "Usuario guardado correctamente." };
  };

  if (run && !existente) return <EstadoConsulta {...consulta} />;

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 className="h3 mb-4">{existente ? "Editar usuario" : "Nuevo usuario"}</h1>
      <FormUsuario modo="admin" inicial={existente ?? undefined} editando={!!existente} onGuardar={guardar} />
    </div>
  );
};

export default UsuarioFormPage;
