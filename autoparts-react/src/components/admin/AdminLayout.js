import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** Limita la navegación del panel según el rol de la sesión. */
const AdminLayout = () => {
  const { usuario, esAdmin, esVendedor, cargando, cerrar } = useAuth();
  const { pathname } = useLocation();
  if (cargando) return <p role="status">Cargando sesión…</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!esAdmin && !esVendedor) return <Navigate to="/" replace />;
  if (esVendedor && !/^\/admin\/(productos(\/\d+\/detalle)?|ordenes)\/?$/.test(pathname)) {
    return <Navigate to="/admin/productos" replace />;
  }
  const clase = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className="d-flex flex-column flex-md-row">
      <aside className="admin-sidebar p-3">
        <h5 className="text-white mb-4">🔧 AutoParts CL<br /><small className="text-white-50">{esAdmin ? "Panel administrador" : "Panel vendedor"}</small></h5>
        <nav className="nav flex-column">
          {esAdmin && <NavLink end className={clase} to="/admin">Dashboard</NavLink>}
          <NavLink className={clase} to="/admin/productos">Productos</NavLink>
          {esAdmin && <>
          <NavLink className={clase} to="/admin/criticos">Stock Crítico</NavLink>
          <NavLink className={clase} to="/admin/categorias">Categorías</NavLink>

          <NavLink className={clase} to="/admin/reportes">Reportes</NavLink>
          <NavLink className={clase} to="/admin/usuarios">Usuarios</NavLink>
          <NavLink className={clase} to="/admin/perfil">Mi Perfil</NavLink>
          <NavLink to="/">Volver a la tienda</NavLink>
          </>}
          <NavLink className={clase} to="/admin/ordenes">Órdenes / Boletas</NavLink>
          <button className="btn btn-outline-light mt-3" onClick={cerrar}>Cerrar sesión</button>
        </nav>
      </aside>
      <div className="flex-grow-1 p-4"><Outlet /></div>
    </div>
  );
};

export default AdminLayout;
/*actualizacio*/
/*prueba*/
