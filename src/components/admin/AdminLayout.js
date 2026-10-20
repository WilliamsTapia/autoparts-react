import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** Protege las rutas /admin: solo entra un Administrador con sesión */
const AdminLayout = () => {
  const { esAdmin } = useAuth();
  if (!esAdmin) return <Navigate to="/login" replace />;
  const clase = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className="d-flex flex-column flex-md-row">
      <aside className="admin-sidebar p-3">
        <h5 className="text-white mb-4">🔧 AutoParts CL<br /><small className="text-white-50">Panel admin</small></h5>
        <nav className="nav flex-column">
          <NavLink end className={clase} to="/admin">Home</NavLink>
          <NavLink className={clase} to="/admin/productos">Productos</NavLink>
          <NavLink className={clase} to="/admin/usuarios">Usuarios</NavLink>
          <NavLink to="/">Volver a la tienda</NavLink>
        </nav>
      </aside>
      <div className="flex-grow-1 p-4"><Outlet /></div>
    </div>
  );
};

export default AdminLayout;
/*actualizacio*/
