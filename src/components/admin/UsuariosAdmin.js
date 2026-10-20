import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Table } from "react-bootstrap";
import { usuariosDB } from "../../data/db";

const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState(usuariosDB.listar);

  const eliminar = (run) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    usuariosDB.eliminar(run);
    setUsuarios(usuariosDB.listar());
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-autoparts">+ Nuevo usuario</Link>
      </div>
      <Table responsive hover className="align-middle bg-white">
        <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th></th></tr></thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.run}>
              <td>{u.run}</td><td>{u.nombre} {u.apellidos}</td><td>{u.correo}</td><td><Badge bg="secondary">{u.tipoUsuario}</Badge></td>
              <td className="text-nowrap">
                <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-dark me-1">Editar</Link>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(u.run)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UsuariosAdmin;
